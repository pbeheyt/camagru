const path = require('path');
const fs = require('fs');
const { Image } = require('../../models');
const multer = require('multer');
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');

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
  
	  // Check if the file exists before attempting to delete it
	  fs.access(filePath, fs.constants.F_OK, async (err) => {
		if (err) {
		  if (err.code === 'ENOENT') {
			console.warn('File does not exist:', filePath);
			// File does not exist, but still delete the record from the database
			await image.destroy();
			return res.json({ success: true, message: 'Image record deleted, but file was not found' });
		  } else {
			console.error('Error accessing file:', err);
			return res.status(500).json({ success: false, error: 'Error accessing image file' });
		  }
		} else {
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
		}
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

exports.createAnimatedGIF = async (req, res) => {
	try {
	  const { imageUrls, delay, superposableImage } = req.body;
	  const encoder = new GIFEncoder(640, 480);
	  const filePath = path.join(__dirname, '../../uploads/', `${Date.now()}.gif`);
	  const writeStream = fs.createWriteStream(filePath);
  
	  encoder.createReadStream().pipe(writeStream);
	  encoder.start();
	  encoder.setRepeat(0);
	  encoder.setDelay(delay);
	  encoder.setQuality(10);
  
	  for (const imageUrl of imageUrls) {
		const img = await loadImage(imageUrl);
		const canvas = createCanvas(640, 480);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, 640, 480);
		if (superposableImage) {
		  const overlayImg = await loadImage(path.join(__dirname, '../../public', superposableImage));
		  ctx.drawImage(overlayImg, 0, 0, 640, 480);
		}
		encoder.addFrame(ctx);
	  }
  
	  encoder.finish();
  
	  writeStream.on('finish', () => {
		res.json({ success: true, imageUrl: `/uploads/${path.basename(filePath)}` });
	  });
	} catch (error) {
	  console.error('Error creating animated GIF:', error);
	  res.status(500).json({ success: false, error: 'Internal Server Error' });
	}
  };
