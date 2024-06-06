document.addEventListener('DOMContentLoaded', function() {
	const errorMessage = document.getElementById('error-message');
	const successMessage = document.getElementById('success-message');

	const form = document.getElementById('login-form');
	form.addEventListener('submit', function(event) {
	  event.preventDefault();
  
	  const formData = new URLSearchParams(new FormData(this));

	  fetch('/login', {
		method: 'POST',
		body: formData,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		  }
	  })
	  .then(response => response.json())
	  .then(data => {
		if (data.success) {
		  successMessage.textContent = data.success;
		  errorMessage.textContent = '';
		  window.location.href = '/';
		} else {
		  errorMessage.textContent = data.error;
		  successMessage.textContent = '';
		}
	  })
	  .catch(error => {
		console.error('Error:', error);
	  });
	});
	  
	const params = new URLSearchParams(window.location.search);
	const error = params.get('error');
	const success = params.get('success');
  
	if (error) {
	  errorMessage.textContent = error;
	}
  
	if (success) {
	  successMessage.textContent = success;
	}
  });
  