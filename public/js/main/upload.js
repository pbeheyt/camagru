document.addEventListener('DOMContentLoaded', function() {
	const uploadForm = document.getElementById('upload-form');
	const uploadMessage = document.getElementById('upload-message');
  
	uploadForm.addEventListener('submit', function(event) {
	  event.preventDefault();
	  const formData = new FormData(uploadForm);
  
	  fetch('/upload', {
		method: 'POST',
		body: formData
	  })
	  .then(response => response.json())
	  .then(data => {
		if (data.success) {
		  uploadMessage.textContent = 'Image uploaded successfully!';
		  uploadMessage.style.color = 'green';
		  uploadForm.reset();
		} else {
		  uploadMessage.textContent = `Error uploading image: ${data.error}`;
		  uploadMessage.style.color = 'red';
		}
	  })
	  .catch(error => {
		console.error('Error:', error);
		uploadMessage.textContent = 'Error uploading image.';
		uploadMessage.style.color = 'red';
	  });
	});
  });
  