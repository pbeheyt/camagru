document.addEventListener('DOMContentLoaded', function() {
	const params = new URLSearchParams(window.location.search);
	const error = params.get('error');
	const token = params.get('token');
  
	// Display error message if it exists
	if (error) {
	  document.getElementById('error-message').textContent = decodeURIComponent(error);
	}
  
	// Set the token value in the hidden input field
	if (token) {
	  document.getElementById('token').value = token;
	}
  
	// Handle form submission
	const form = document.getElementById('reset-password-form');
	form.addEventListener('submit', function(event) {
	  event.preventDefault();
  
	  const formData = new FormData(this);
	  fetch('/password-reset', {
		method: 'POST',
		body: formData,
	  })
		.then(response => response.json().then(data => ({ status: response.status, body: data })))
		.then(({ status, body }) => {
		  if (status === 200) {
			window.location.href = '/login?success=' + encodeURIComponent('Password reset successful!');
		  } else {
			document.getElementById('error-message').textContent = body.error;
		  }
		})
		.catch(error => {
		  console.error('Error:', error);
		});
	});
  });
  