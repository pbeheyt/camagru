const path = require('path');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const multer = require('multer');
const upload = require('../../middlewares/upload');
const { client } = require('../../database/connect');
const { escapeHtml, isValidBase64 } = require('../../utils/');

exports.captureImage = async (req, res) => {
	try {
			let { imageData, superposableImage } = req.body;
			
			if (!isValidBase64(imageData.replace(/^data:image\/png;base64,/, ""))) {
					return res.status(400).json({ success: false, error: 'Invalid image data' });
			}

			const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
			const filename = Date.now() + '-captured.png';
			const filePath = path.join(__dirname, '../../uploads/', filename);

			const canvas = createCanvas(640, 480);
			const context = canvas.getContext('2d');

			// Draw the main image (webcam or uploaded image)
			const img = await loadImage(`data:image/png;base64,${base64Data}`);
			context.drawImage(img, 0, 0, canvas.width, canvas.height);

			// Draw the superposable image
			if (superposableImage) {
					superposableImage = escapeHtml(superposableImage); // Escape to prevent XSS
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
			// console.error('Error capturing image:', error);
			res.status(500).json({ success: false, error: 'Internal Server Error' });
	}
};
	
exports.uploadImage = (req, res) => {
	upload(req, res, async function (err) {
			if (err instanceof multer.MulterError) {
					if (err.code === 'LIMIT_FILE_SIZE') {
							return res.status(400).json({ success: false, error: 'File size exceeds limit of 5MB' });
					}
					return res.status(400).json({ success: false, error: err.message });
			} else if (err) {
					if (err.message === 'Invalid file type. Only JPEG, PNG, and GIF are allowed.') {
							return res.status(400).json({ success: false, error: err.message });
					}
					return res.status(500).json({ success: false, error: 'Internal Server Error' });
			}

			try {
					let { superposableImage } = req.body;
					const filePath = req.file.path;

					if (!req.file || !filePath) {
							return res.status(400).json({ success: false, error: 'No file uploaded' });
					}

					const canvas = createCanvas(640, 480);
					const context = canvas.getContext('2d');

					// Draw the uploaded image
					const img = await loadImage(filePath);
					context.drawImage(img, 0, 0, canvas.width, canvas.height);

					// Draw the superposable image
					if (superposableImage) {
							superposableImage = escapeHtml(superposableImage); // Escape to prevent XSS
							const overlayImg = await loadImage(path.join(__dirname, '../../public', superposableImage));
							context.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
					}

					// Save the final image
					const filename = Date.now() + '-processed.png';
					const finalPath = path.join(__dirname, '../../uploads/', filename);
					const out = fs.createWriteStream(finalPath);
					const stream = canvas.createPNGStream();
					stream.pipe(out);
					out.on('finish', () => {
							res.json({ success: true, imageUrl: `/uploads/${filename}` });
					});
			} catch (error) {
					// console.error('Error processing uploaded image:', error);
					res.status(500).json({ success: false, error: 'Internal Server Error' });
			}
	});
};
  
exports.postImage = async (req, res) => {
	try {
			const imageUrl = escapeHtml(req.body.imageUrl); // Escape to prevent XSS
			const userId = req.session.userId;

			const insertQuery = `
					INSERT INTO images (url, "userId", description)
					VALUES ($1, $2, $3)
					RETURNING *;
			`;
			const result = await client.query(insertQuery, [imageUrl, userId, 'Posted image']);
			const image = result.rows[0];

			res.json({ success: true, image });
	} catch (error) {
			// console.error('Error posting image:', error);
			res.status(500).json({ success: false, error: 'Internal Server Error' });
	}
};
  
exports.deleteImage = async (req, res) => {
  try {
    const query = `
      SELECT * FROM images
      WHERE id = $1 AND "userId" = $2;
    `;
    const result = await client.query(query, [req.params.id, req.session.userId]);
    const image = result.rows[0];

    if (!image) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }

    const filePath = path.join(__dirname, '../../uploads', path.basename(image.url));
    fs.access(filePath, fs.constants.F_OK, async (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // Delete comments and likes associated with the image
          await client.query('DELETE FROM comments WHERE "imageId" = $1', [image.id]);
          await client.query('DELETE FROM likes WHERE "imageId" = $1', [image.id]);
          await client.query('DELETE FROM images WHERE id = $1', [image.id]);
          return res.json({ success: true, message: 'Image record and associated data deleted, but file was not found' });
        } else {
          // console.error('Error accessing file:', err);
          return res.status(500).json({ success: false, error: 'Error accessing image file' });
        }
      } else {
        fs.unlink(filePath, async (err) => {
          if (err) {
            // console.error('Error deleting image file:', err);
            return res.status(500).json({ success: false, error: 'Error deleting image file' });
          }

          // Delete comments and likes associated with the image
          await client.query('DELETE FROM comments WHERE "imageId" = $1', [image.id]);
          await client.query('DELETE FROM likes WHERE "imageId" = $1', [image.id]);
          await client.query('DELETE FROM images WHERE id = $1', [image.id]);
          res.json({ success: true });
        });
      }
    });
  } catch (error) {
    // console.error('Error deleting image:', error);
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
	  // console.error('Error creating animated GIF:', error);
	  res.status(500).json({ success: false, error: 'Internal Server Error' });
	}
};
