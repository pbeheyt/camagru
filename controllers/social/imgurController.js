const axios = require('axios');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

exports.shareOnImgur = async (req, res) => {
  try {
    const { imageUrl, description } = req.body;
    const imagePath = path.join(__dirname, '../../uploads', path.basename(imageUrl));
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const response = await axios.post('https://api.imgur.com/3/image', {
      image: base64Image,
      type: 'base64',
      description: description
    }, {
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      },
    });

    if (response.data.success) {
      res.json({ success: true, imgurLink: response.data.data.link });
    } else {
      res.status(500).json({ success: false, error: 'Failed to upload image to Imgur' });
    }
  } catch (error) {
    console.error('Error sharing on Imgur:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
