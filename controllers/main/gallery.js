const { sendCommentNotificationEmail } = require('../../utils/mailer');
const { client } = require('../../database/connect');

exports.getImages = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const userId = req.session.userId;
  const isUserSpecific = req.query.user === 'true';

  try {
    let imagesQuery;
    let countQuery;
    let images;
    let count;

    if (isUserSpecific && userId) {
      imagesQuery = `
        SELECT * FROM images
        WHERE "userId" = $1
        ORDER BY "createdAt" DESC
        LIMIT $2 OFFSET $3;
      `;
      countQuery = `
        SELECT COUNT(*) FROM images
        WHERE "userId" = $1;
      `;
      const imagesResult = await client.query(imagesQuery, [userId, limit, offset]);
      images = imagesResult.rows;
      const countResult = await client.query(countQuery, [userId]);
      count = parseInt(countResult.rows[0].count, 10);
    } else {
      imagesQuery = `
        SELECT * FROM images
        ORDER BY "createdAt" DESC
        LIMIT $1 OFFSET $2;
      `;
      countQuery = `
        SELECT COUNT(*) FROM images;
      `;
      const imagesResult = await client.query(imagesQuery, [limit, offset]);
      images = imagesResult.rows;
      const countResult = await client.query(countQuery);
      count = parseInt(countResult.rows[0].count, 10);
    }

    if (images.length === 0) {
      return res.json({ success: true, images: [], totalPages: 0, currentPage: page });
    }

    // Fetch related users
    const userIds = images.map(image => image.userId);
    const userQuery = `
      SELECT id, username FROM users
      WHERE id = ANY($1);
    `;
    const userResult = await client.query(userQuery, [userIds]);
    const users = userResult.rows;

    // Fetch likes for each image
    const imageIds = images.map(image => image.id);
    const likesQuery = `
      SELECT "imageId", COUNT(*) AS count
      FROM likes
      WHERE "imageId" = ANY($1)
      GROUP BY "imageId";
    `;
    const likesResult = await client.query(likesQuery, [imageIds]);
    const likes = likesResult.rows;

    // Fetch comments for each image
    const commentsQuery = `
      SELECT comments.*
      FROM comments
      WHERE comments."imageId" = ANY($1);
    `;
    const commentsResult = await client.query(commentsQuery, [imageIds]);
    const comments = commentsResult.rows;

    // Aggregate data
    const imagesWithDetails = images.map(image => {
      const imageUser = users.find(user => user.id === image.userId);
      const imageLikes = likes.find(like => like.imageId === image.id) || { count: 0 };
      const imageComments = comments.filter(comment => comment.imageId === image.id).map(comment => {
        const commenter = users.find(user => user.id === comment.userId);
        return {
          id: comment.id,
          text: comment.text,
          username: commenter ? commenter.username : null
        };
      });

      return {
        ...image,
        username: imageUser ? imageUser.username : null,
        likes: Array.from({ length: imageLikes.count }),
        comments: imageComments
      };
    });

    res.json({
      success: true,
      images: imagesWithDetails,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


exports.likeImage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    const likeQuery = `
      SELECT * FROM likes
      WHERE "userId" = $1 AND "imageId" = $2;
    `;
    const likeResult = await client.query(likeQuery, [userId, id]);
    const like = likeResult.rows[0];

    let liked;
    if (like) {
      const deleteQuery = `
        DELETE FROM likes
        WHERE "userId" = $1 AND "imageId" = $2;
      `;
      await client.query(deleteQuery, [userId, id]);
      liked = false;
    } else {
      const insertQuery = `
        INSERT INTO likes ("userId", "imageId")
        VALUES ($1, $2)
        RETURNING *;
      `;
      await client.query(insertQuery, [userId, id]);
      liked = true;
    }

    const countQuery = `
      SELECT COUNT(*) FROM likes
      WHERE "imageId" = $1;
    `;
    const countResult = await client.query(countQuery, [id]);
    const likeCount = parseInt(countResult.rows[0].count, 10);

    res.json({ success: true, likeCount, liked });
  } catch (error) {
    console.error('Error liking image:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.commentImage = async (req, res) => {
  try {
    const { id } = req.params; // image ID
    const { text } = req.body; // comment text
    const userId = req.session.userId; // current user ID

    // Insert the comment into the database
    const insertQuery = `
      INSERT INTO comments ("userId", "imageId", text)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [userId, id, text]);
    const comment = result.rows[0];

    // Fetch the user who commented
    const userQuery = `
      SELECT username, email FROM users
      WHERE id = $1;
    `;
    const userResult = await client.query(userQuery, [userId]);
    const user = userResult.rows[0];

    // Fetch the image details along with the user who posted it
    const imageQuery = `
      SELECT images.*, users.email AS user_email, users.username AS user_username
      FROM images
      JOIN users ON images."userId" = users.id
      WHERE images.id = $1;
    `;
    const imageResult = await client.query(imageQuery, [id]);
    const image = imageResult.rows[0];

    // Implement sendCommentNotificationEmail logic
    if (image && image.user_email) {
      await sendCommentNotificationEmail(image.user_email, image.user_username, user.username, text);
    }

    res.json({ success: true, comment: { text: comment.text, username: user.username } });
  } catch (error) {
    console.error('Error commenting on image:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

  
