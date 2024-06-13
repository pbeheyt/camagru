document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('password-forget-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const formData = new URLSearchParams(new FormData(this));

	  fetch('/password-forget/', {
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
		  setTimeout(() => {
			window.location.href = '/login';
		  }, 2000);
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
