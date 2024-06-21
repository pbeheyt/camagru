document.addEventListener('DOMContentLoaded', function() {
  const webcamElement = document.getElementById('webcam');
  const captureButton = document.getElementById('capture-button');
  const superposableImagesContainer = document.getElementById('superposable-images');
  const thumbnailsContainer = document.getElementById('thumbnails');

  let selectedSuperposableImage = null;
  captureButton.disabled = true;  // Disable capture button initially

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
  function loadThumbnails() {
    fetch('/images?user=true')
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
    fetch(`/edit/delete/${imageId}`, {
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

    // Draw the selected superposable image on the canvas
    if (selectedSuperposableImage) {
      const overlayImage = new Image();
      overlayImage.src = selectedSuperposableImage;
      overlayImage.onload = () => {
        context.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');

        fetch('/edit/capture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ imageData, superposableImage: selectedSuperposableImage })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Image captured successfully');
            addThumbnail(data.image);
          } else {
            console.error('Error capturing image:', data.error);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      };
    }
  });

  // Initialize
  initWebcam();
  loadSuperposableImages();
  loadThumbnails();
});
