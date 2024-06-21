document.addEventListener('DOMContentLoaded', function() {
  const webcamElement = document.getElementById('webcam');
  const captureButton = document.getElementById('capture-button');
  const uploadInput = document.getElementById('upload-input');
  const uploadButton = document.getElementById('upload-button');
  const superposableImagesContainer = document.getElementById('superposable-images');
  const thumbnailsContainer = document.getElementById('thumbnails');
  const previewModal = document.getElementById('preview-modal');
  const previewImage = document.getElementById('preview-image');
  const postButton = document.getElementById('post-button');
  const discardButton = document.getElementById('discard-button');
  const closeModal = document.getElementById('close-modal');

  let selectedSuperposableImage = null;
  let capturedImageData = null;
  captureButton.disabled = true;  // Disable capture button initially
  uploadButton.disabled = true;   // Disable upload button initially

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
    fetch('/images/superposable')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          data.images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.classList.add('superposable-image');
            img.addEventListener('click', () => {
              selectedSuperposableImage = src;
              captureButton.disabled = false;
              uploadButton.disabled = false;
              // Remove selected class from all images
              document.querySelectorAll('.superposable-image').forEach(image => {
                image.classList.remove('selected');
              });
              // Add selected class to clicked image
              img.classList.add('selected');
              // Overlay the selected image on the webcam feed
              overlaySuperposableImage(src);
            });
            superposableImagesContainer.appendChild(img);
          });
        } else {
          console.error('Error fetching superposable images:', data.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // Overlay the selected superposable image on the webcam feed
  function overlaySuperposableImage(src) {
    const overlay = document.createElement('img');
    overlay.src = src;
    overlay.classList.add('webcam-overlay');
    // Remove any existing overlay
    const existingOverlay = document.querySelector('.webcam-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    webcamElement.parentElement.appendChild(overlay);
  }

  // Load previous thumbnails
  function loadThumbnails(userSpecific = false) {
    const url = userSpecific ? '/images?user=true' : '/images';
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          data.images.forEach(image => {
            const img = document.createElement('img');
            img.src = image.url;
            img.addEventListener('click', () => {
              if (confirm('Do you want to delete this image?')) {
                deleteImage(image.id, img);
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

  // Append new thumbnail to the thumbnails container
  function addThumbnail(image) {
    const img = document.createElement('img');
    img.src = image.url;
    img.addEventListener('click', () => {
      if (confirm('Do you want to delete this image?')) {
        deleteImage(image.id, img);
      }
    });
    thumbnailsContainer.appendChild(img);
  }

  // Delete image
  function deleteImage(imageId, imgElement) {
    fetch(`/studio/delete/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Image deleted successfully');
        imgElement.remove();  // Remove the image element from the DOM
      } else {
        console.error('Error deleting image:', data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  // Capture image from webcam
  captureButton.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = webcamElement.videoWidth;
    canvas.height = webcamElement.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(webcamElement, 0, 0, canvas.width, canvas.height);
    capturedImageData = canvas.toDataURL('image/png');

    fetch('/studio/capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageData: capturedImageData, superposableImage: selectedSuperposableImage })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        previewImage.src = data.imageUrl; // Show the final image URL from server
        previewModal.style.display = 'block';  // Show the preview modal
      } else {
        console.error('Error capturing image:', data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });

  // Upload image
  uploadButton.addEventListener('click', () => {
    const file = uploadInput.files[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('superposableImage', selectedSuperposableImage);

    fetch('/studio/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        previewImage.src = data.imageUrl; // Show the final image URL from server
        previewModal.style.display = 'block';  // Show the preview modal
      } else {
        console.error('Error uploading image:', data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });

  // Post captured or uploaded image
  postButton.addEventListener('click', () => {
    fetch('/studio/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageUrl: previewImage.src })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Image posted successfully');
        addThumbnail(data.image);
        previewModal.style.display = 'none';  // Hide the preview modal
      } else {
        console.error('Error posting image:', data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });

  // Discard captured or uploaded image
  discardButton.addEventListener('click', () => {
    previewModal.style.display = 'none';  // Hide the preview modal
    capturedImageData = null;
  });

  // Close modal
  closeModal.addEventListener('click', () => {
    previewModal.style.display = 'none';
  });

  // Initialize
  initWebcam();
  loadSuperposableImages();
  loadThumbnails(true);  // Pass true to load user-specific thumbnails
});
