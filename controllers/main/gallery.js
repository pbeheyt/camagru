const { Image, Like, Comment, User } = require('../../models');
const nodemailer = require('nodemailer');
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

    const like = await Like.findOrCreate({
      where: { userId, imageId: id }
    });

    res.json({ success: true, like });
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

    const image = await Image.findByPk(id, {
      include: [User]
    });

    if (image && image.User.emailNotifications) {
      const user = await User.findByPk(userId);
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: image.User.email,
        subject: 'New comment on your image',
        text: `User ${user.username} commented on your image: ${text}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }

    res.json({ success: true, comment });
  } catch (error) {
    console.error('Error commenting on image:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
