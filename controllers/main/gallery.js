const { Image, Like, Comment, User } = require('../../models');
const { sendCommentNotificationEmail } = require('../../utils/mailer');

exports.getImages = async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = 5;
	const offset = (page - 1) * limit;
	const userId = req.session.userId;
	const isUserSpecific = req.query.user === 'true';
  
	try {
	  let images, count;
	  if (isUserSpecific && userId) {
		const result = await Image.findAndCountAll({
		  where: { userId },
		  limit,
		  offset,
		  order: [['createdAt', 'DESC']],
		  include: [
			{ model: User, as: 'User' },
			{ model: Like, as: 'Likes' },
			{ model: Comment, as: 'Comments', include: [{ model: User, as: 'User' }] }
		  ]
		});
		images = result.rows;
		count = result.count;
	  } else {
		const result = await Image.findAndCountAll({
		  limit,
		  offset,
		  order: [['createdAt', 'DESC']],
		  include: [
			{ model: User, as: 'User' },
			{ model: Like, as: 'Likes' },
			{ model: Comment, as: 'Comments', include: [{ model: User, as: 'User' }] }
		  ]
		});
		images = result.rows;
		count = result.count;
	  }
	  const totalPages = Math.ceil(count / limit);
	  res.json({ success: true, images, totalPages, currentPage: page });
	} catch (error) {
	  console.error('Error fetching images:', error);
	  res.status(500).json({ success: false, error: 'Internal Server Error' });
	}
  };
  
  
  exports.likeImage = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
  
      const [like, created] = await Like.findOrCreate({
        where: { userId, imageId: id }
      });
  
      let liked;
      if (!created) {
        await Like.destroy({
          where: { userId, imageId: id }
        });
        liked = false;
      } else {
        liked = true;
      }
  
      const likeCount = await Like.count({ where: { imageId: id } });
  
      res.json({ success: true, likeCount, liked });
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
  
