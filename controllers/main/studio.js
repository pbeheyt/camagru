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

exports.captureImage = async (req, res) => {
	try {
	  const imageData = req.body.imageData;
	  const superposableImage = req.body.superposableImage;
	  const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
	  const filename = Date.now() + '-captured.png';
	  const filePath = path.join(__dirname, '../../uploads/', filename);
  
	  const canvas = createCanvas(640, 480); // Adjust the canvas size as needed
	  const context = canvas.getContext('2d');
  
	  // Draw the main image (webcam or uploaded image)
	  const img = await loadImage(`data:image/png;base64,${base64Data}`);
	  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  
	  // Draw the superposable image
	  if (superposableImage) {
		const overlayImg = await loadImage(path.join(__dirname, '../../public', superposableImage));
		context.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
	  }
  
	  // Save the final image
	  const out = fs.createWriteStream(filePath);
	  const stream = canvas.createPNGStream();
	  stream.pipe(out);
	  out.on('finish', () => {
		res.json({ success: true, imageUrl: `/uploads/${filename}` });
	  });
	} catch (error) {
	  console.error('Error capturing image:', error);
	  res.status(500).json({ success: false, error: 'Internal Server Error' });
	}
  };
  
  exports.uploadImage = [
	upload.single('image'),
	async (req, res) => {
	  try {
		const superposableImage = req.body.superposableImage;
		const filename = Date.now() + '-uploaded.png';
		const filePath = path.join(__dirname, '../../uploads/', filename);
  
		const canvas = createCanvas(640, 480); // Adjust the canvas size as needed
		const context = canvas.getContext('2d');
  
		// Draw the uploaded image
		const img = await loadImage(req.file.path);
		context.drawImage(img, 0, 0, canvas.width, canvas.height);
  
		// Draw the superposable image
		if (superposableImage) {
		  const overlayImg = await loadImage(path.join(__dirname, '../../public', superposableImage));
		  context.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
		}
  
		// Save the final image
		const out = fs.createWriteStream(filePath);
		const stream = canvas.createPNGStream();
		stream.pipe(out);
		out.on('finish', () => {
		  res.json({ success: true, imageUrl: `/uploads/${filename}` });
		});
	  } catch (error) {
		console.error('Error uploading image:', error);
		res.status(500).json({ success: false, error: 'Internal Server Error' });
	  }
	}
  ];
  
  exports.postImage = async (req, res) => {
	try {
	  const imageUrl = req.body.imageUrl;
	  const image = await Image.create({
		url: imageUrl,
		userId: req.session.userId,
		description: 'Posted image'
	  });
	  res.json({ success: true, image });
	} catch (error) {
	  console.error('Error posting image:', error);
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
