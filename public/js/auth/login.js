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
			successMessage.style.display = 'block';
			errorMessage.style.display = 'none';
			setTimeout(() => {
				window.location.href = '/';
		}, 1000);
		} else {
		  errorMessage.textContent = data.error;
		  successMessage.textContent = '';
			errorMessage.style.display = 'block';
			successMessage.style.display = 'none';
		}
	  })
	  .catch(error => {
			console.error('Error:', error);
	  });
	});
	
	//Parse error/sucess message in the query string in case of redirection to login page with message
	const params = new URLSearchParams(window.location.search);
	const error = params.get('error');
	const success = params.get('success');
  
	if (error) {
	  errorMessage.textContent = error;
		successMessage.textContent = '';
		errorMessage.style.display = 'block';
		successMessage.style.display = 'none';
	}
  
	if (success) {
	  successMessage.textContent = success;
		errorMessage.textContent = '';
		successMessage.style.display = 'block';
		errorMessage.style.display = 'none';
	}
});
  