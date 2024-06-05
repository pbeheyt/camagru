document.addEventListener('DOMContentLoaded', function() {
	const params = new URLSearchParams(window.location.search);
	const error = params.get('error');
	const success = params.get('success');
  
	if (error) {
	  document.getElementById('error-message').textContent = error;
	}
  
	if (success) {
	  document.getElementById('success-message').textContent = success;
	}
  
	const form = document.getElementById('login-form');
	form.addEventListener('submit', function(event) {
	  event.preventDefault();
  
	  const formData = new FormData(this);
	  fetch('/login', {
		method: 'POST',
		body: formData,
	  })
		.then(response => response.json())
		.then(data => {
		  if (data.success) {
			window.location.href = '/';
		  } else {
			document.getElementById('error-message').textContent = data.error;
		  }
		})
		.catch(error => {
		  console.error('Error:', error);
		});
	});
  });
  