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
  const createGifButton = document.getElementById('create-gif-button');
  const gifNotification = document.getElementById('gif-notification');
  const discardButton = document.getElementById('discard-button');
  const closePreview = document.getElementById('close-preview');

  let selectedSuperposableImage = null;
  let gifInProgress = false;
  captureButton.disabled = true;
  uploadButton.disabled = true;
  createGifButton.disabled = true;

  async function initWebcam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      webcamElement.srcObject = stream;
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }

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
              createGifButton.disabled = false;
              document.querySelectorAll('.superposable-image').forEach(image => {
                image.classList.remove('selected');
              });
              img.classList.add('selected');
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

  function overlaySuperposableImage(src) {
    const overlay = document.createElement('img');
    overlay.src = src;
    overlay.classList.add('webcam-overlay');
    const existingOverlay = document.querySelector('.webcam-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    webcamElement.parentElement.appendChild(overlay);
  }

  function loadThumbnails(userSpecific = false) {
    const url = userSpecific ? '/images?user=true' : '/images';
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          data.images.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  function addThumbnail(image) {
    const img = document.createElement('img');
    img.src = image.url;
    img.addEventListener('click', () => {
      if (confirm('Do you want to delete this image?')) {
        deleteImage(image.id, img);
      }
    });
    thumbnailsContainer.insertBefore(img, thumbnailsContainer.firstChild);
  }

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
        imgElement.remove();
      } else {
        console.error('Error deleting image:', data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  captureButton.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = webcamElement.videoWidth;
    canvas.height = webcamElement.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(webcamElement, 0, 0, canvas.width, canvas.height);
    const capturedImageData = canvas.toDataURL('image/png');

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
        previewImage.src = data.imageUrl;
        previewModal.style.display = 'block';
      } else {
        console.error('Error capturing image:', data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });

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
        previewImage.src = data.imageUrl;
        previewModal.style.display = 'block';
      } else {
        console.error('Error uploading image:', data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });

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
        previewModal.style.display = 'none';
      } else {
        console.error('Error posting image:', data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });

  createGifButton.addEventListener('click', () => {
    if (gifInProgress) return;
    gifInProgress = true;
    const captureInterval = 1000 / 15;
    const captureDuration = 2000;
    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = webcamElement.videoWidth;
    captureCanvas.height = webcamElement.videoHeight;
    const context = captureCanvas.getContext('2d');
    const capturedFrames = [];
    gifNotification.style.display = 'block';

    const captureFrame = () => {
      context.drawImage(webcamElement, 0, 0, captureCanvas.width, captureCanvas.height);
      capturedFrames.push(captureCanvas.toDataURL('image/png'));

      if (capturedFrames.length * captureInterval >= captureDuration) {
        gifNotification.style.display = 'none';
        sendFramesToServer(capturedFrames);
      } else {
        setTimeout(captureFrame, captureInterval);
      }
    };

    captureFrame();
  });

  function sendFramesToServer(frames) {
    fetch('/studio/create-gif', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageUrls: frames, delay: 1000 / 15, superposableImage: selectedSuperposableImage })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('GIF created successfully');
        previewImage.src = data.imageUrl;
        previewModal.style.display = 'block';
        gifInProgress = false;
      } else {
        console.error('Error creating GIF:', data.error);
        gifInProgress = false;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      gifInProgress = false;
    });
  }

  discardButton.addEventListener('click', () => {
    previewModal.style.display = 'none';
  });

  closePreview.addEventListener('click', () => {
    previewModal.style.display = 'none';
  });

  initWebcam();
  loadSuperposableImages();
  loadThumbnails(true);
});
