const path = require('path');
const fs = require('fs');
const { Image } = require('../../models');
const multer = require('multer');
const { createCanvas, loadImage } = require('canvas');

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
    const { imageData, superposableImage } = req.body;

    // Decode the base64 image data
    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Load the webcam image
    const webcamImage = await loadImage(buffer);

    // Load the superposable image
    const superposableImagePath = path.join(__dirname, '../../public/img/superposable', path.basename(superposableImage));
    const overlayImage = await loadImage(superposableImagePath);

    // Create a canvas and draw both images on it
    const canvas = createCanvas(webcamImage.width, webcamImage.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(webcamImage, 0, 0);
    ctx.drawImage(overlayImage, 0, 0, webcamImage.width, webcamImage.height);

    // Save the final image
    const filename = `${Date.now()}.png`;
    const outputPath = path.join(__dirname, '../../uploads', filename);
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', async () => {
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
  
	  // Get the file path
	  const filePath = path.join(__dirname, '../../uploads', path.basename(image.url));
  
	  // Delete the image file from the file system
	  fs.unlink(filePath, async (err) => {
		if (err) {
		  console.error('Error deleting image file:', err);
		  return res.status(500).json({ success: false, error: 'Error deleting image file' });
		}
  
		// Delete the record from the database
		await image.destroy();
		res.json({ success: true });
	  });
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
