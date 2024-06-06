document.addEventListener('DOMContentLoaded', function() {
	const form = document.getElementById('register-form');
	const errorMessage = document.getElementById('error-message');
	const successMessage = document.getElementById('success-message');
  
	form.addEventListener('submit', function(event) {
	  event.preventDefault();
  
	  const formData = new URLSearchParams(new FormData(this));
	  
	  fetch('/register', {
		method: 'POST',
		body: formData,
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded'
		}
	  })
	  .then(response => {
		console.log('Response:', response);
		return response.json();
	  })
	  .then(data => {
		console.log('Data:', data);
		if (data.success) {
		  successMessage.textContent = data.success;
		  errorMessage.textContent = '';
		} else {
		  errorMessage.textContent = data.error;
		  successMessage.textContent = '';
		}
	  })
	  .catch(error => {
		console.error('Error:', error);
	  });
	});
  });
  