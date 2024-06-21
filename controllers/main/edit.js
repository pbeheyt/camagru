const path = require('path');
const { Image, User } = require('../../models');
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

exports.renderEditPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/main/studio.html'));
};

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
    // Assume `req.body.imageData` contains the base64 encoded image from the webcam
    const imageData = req.body.imageData;
    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    const filename = Date.now() + '.png';
    const filePath = path.join(__dirname, '../../uploads/', filename);

    require("fs").writeFile(filePath, base64Data, 'base64', async (err) => {
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
