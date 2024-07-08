document.addEventListener('DOMContentLoaded', function() {
	const form = document.getElementById('reset-password-form');
	const errorMessage = document.getElementById('error-message');
	const successMessage = document.getElementById('success-message');
  
	const path = window.location.pathname;
	const token = path.split('/').pop();

	form.addEventListener('submit', function(event) {
	  event.preventDefault();
  
	  const formData = new FormData(this);
	  const password = formData.get('password');
	  const confirmPassword = formData.get('confirm-password');
  
	  fetch(`/password-reset/${token}`, {
		method: 'POST',
		body: JSON.stringify({ password, 'confirm-password': confirmPassword }),
		headers: {
		  'Content-Type': 'application/json'
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
				window.location.href = '/login';
		  }, 3000);
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
  