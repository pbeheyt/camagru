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
      fetch('/images/superposable')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            data.images.forEach(src => {
              const img = document.createElement('img');
              img.src = src;
              img.addEventListener('click', () => {
                selectedSuperposableImage = src;
                captureButton.disabled = false;
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
  
    // Capture image from webcam
    captureButton.addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      canvas.width = webcamElement.videoWidth;
      canvas.height = webcamElement.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(webcamElement, 0, 0, canvas.width, canvas.height);
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
          loadThumbnails();
        } else {
          console.error('Error capturing image:', data.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  
    // Initialize
    initWebcam();
    loadSuperposableImages();
    loadThumbnails();
  });
  