document.addEventListener('DOMContentLoaded', function() {
	const webcamElement = document.getElementById('webcam');
	const captureButton = document.getElementById('capture-button');
	const uploadInput = document.getElementById('upload-input');
	const superposableImagesContainer = document.getElementById('superposable-images');
	const thumbnailsContainer = document.getElementById('thumbnails');
  
	let selectedSuperposableImage = null;
  
	// Initialize webcam
	async function initWebcam() {
	  try {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		webcamElement.srcObject = stream;
	  } catch (error) {
		console.error('Error accessing webcam:', error);
	  }
	}
  
	// Load superposable images
	function loadSuperposableImages() {
	  const images = [
	  ];
  
	  images.forEach(src => {
		const img = document.createElement('img');
		img.src = src;
		img.addEventListener('click', () => {
		  selectedSuperposableImage = src;
		  captureButton.disabled = false;
		});
		superposableImagesContainer.appendChild(img);
	  });
	}
  
	// Load previous thumbnails
	function loadThumbnails() {
	  fetch('/images?user=true')  // Assuming this endpoint returns user's images
		.then(response => response.json())
		.then(data => {
		  if (data.success) {
			data.images.forEach(image => {
			  const img = document.createElement('img');
			  img.src = image.url;
			  img.addEventListener('click', () => {
				if (confirm('Do you want to delete this image?')) {
				  deleteImage(image.id);
				}
			  });
			  thumbnailsContainer.appendChild(img);
			});
		  } else {
			console.error('Error fetching thumbnails:', data.error);
		  }
		})
		.catch(error => {
		  console.error('Error:', error);
		});
	}
  
	// Initialize
	initWebcam();
	loadSuperposableImages();
	loadThumbnails();
  });
  