const { Image, Like, Comment, User } = require('../../models');
const { sendCommentNotificationEmail } = require('../../utils/mailer');
const multer = require('multer');
const path = require('path');
const { authenticateUser } = require('../../middlewares/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
  }
});

const upload = multer({ storage });

exports.uploadImage = [
  authenticateUser,
  upload.single('image'),
  async (req, res) => {
    try {
      const image = await Image.create({
        url: `/uploads/${req.file.filename}`,
        description: req.body.description,
        userId: req.session.userId
      });
      res.json({ success: true, image });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
];

exports.getImages = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  try {
    const images = await Image.findAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [User, Like, Comment]
    });
    res.json({ success: true, images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.likeImage = async (req, res) => {
	try {
	  const { id } = req.params;
	  const userId = req.session.userId;
  
	  // Find or create a like
	  const [like, created] = await Like.findOrCreate({
		where: { userId, imageId: id }
	  });
  
	  if (!created) {
		// If the like already exists, it is removed
		await Like.destroy({
		  where: { userId, imageId: id }
		});
	  }
  
	  // Get the updated count of likes for the image
	  const likeCount = await Like.count({ where: { imageId: id } });
  
	  res.json({ success: true, likeCount });
	} catch (error) {
	  console.error('Error liking image:', error);
	  res.status(500).json({ success: false, error: 'Internal Server Error' });
	}
  };
  
  exports.commentImage = async (req, res) => {
	try {
	  const { id } = req.params;
	  const { text } = req.body;
	  const userId = req.session.userId;
  
	  const comment = await Comment.create({
		userId,
		imageId: id,
		text
	  });
  
	  const user = await User.findByPk(userId);
	  const image = await Image.findByPk(id, {
		include: [User]
	  });
  
	  if (image && image.User.email) {
		await sendCommentNotificationEmail(image.User, user, text);
	  }
  
	  res.json({ success: true, comment: { text: comment.text, username: user.username } });
	} catch (error) {
	  console.error('Error commenting on image:', error);
	  res.status(500).json({ success: false, error: 'Internal Server Error' });
	}
  };
  
