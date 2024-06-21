const path = require('path');
const fs = require('fs');
const { Image } = require('../../models');
const multer = require('multer');

// Set up multer for image uploads
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
  upload.single('image'),
  async (req, res) => {
    try {
      const image = await Image.create({
        url: `/uploads/${req.file.filename}`,
        userId: req.session.userId,
        description: 'Uploaded image'
      });
      res.json({ success: true, image });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
];

exports.captureImage = async (req, res) => {
  try {
    const imageData = req.body.imageData;
    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    const filename = Date.now() + '.png';
    const filePath = path.join(__dirname, '../../uploads/', filename);

    fs.writeFile(filePath, base64Data, 'base64', async (err) => {
      if (err) {
        console.error('Error capturing image:', err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
      const image = await Image.create({
        url: `/uploads/${filename}`,
        userId: req.session.userId,
        description: 'Captured image'
      });
      res.json({ success: true, image });
    });
  } catch (error) {
    console.error('Error capturing image:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findOne({ where: { id: req.params.id, userId: req.session.userId } });
    if (!image) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }
    await image.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.getSuperposableImages = (req, res) => {
  const directoryPath = path.join(__dirname, '../../public/img/superposable');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Unable to scan directory' });
    }

    const images = files.map(file => `/img/superposable/${file}`);
    res.json({ success: true, images });
  });
};