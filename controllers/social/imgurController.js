const https = require('https');
const path = require('path');
const fs = require('fs');
const loadEnv = require('../../utils/loadEnv');
loadEnv(path.join(__dirname, '..', '..', '.env'));

exports.shareOnImgur = async (req, res) => {
  try {
    const { imageUrl, description } = req.body;
    const imagePath = path.join(__dirname, '../../uploads', path.basename(imageUrl));
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const postData = JSON.stringify({
      image: base64Image,
      type: 'base64',
      description: description,
    });

    const options = {
      hostname: 'api.imgur.com',
      path: '/3/image',
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      },
    };

    const imgurRequest = https.request(options, (imgurResponse) => {
      let data = '';

      imgurResponse.on('data', (chunk) => {
        data += chunk;
      });

      imgurResponse.on('end', () => {
        const responseJson = JSON.parse(data);
        if (responseJson.success) {
          res.json({ success: true, imgurLink: responseJson.data.link });
        } else {
          res.status(500).json({ success: false, error: 'Failed to upload image to Imgur' });
        }
      });
    });

    imgurRequest.on('error', (error) => {
      // console.error('Error sharing on Imgur:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    });

    // Write the request data
    imgurRequest.write(postData);
    imgurRequest.end();

  } catch (error) {
    // console.error('Error sharing on Imgur:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
