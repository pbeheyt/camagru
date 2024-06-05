document.addEventListener('DOMContentLoaded', function() {
	const params = new URLSearchParams(window.location.search);
	const error = params.get('error');
	const success = params.get('success');
  
	if (error) {
	  document.getElementById('error-message').textContent = decodeURIComponent(error);
	}
  
	if (success) {
	  document.getElementById('success-message').textContent = decodeURIComponent(success);
	}
  
	const form = document.getElementById('password-forget-form');
	form.addEventListener('submit', function(event) {
	  event.preventDefault();
  
	  const formData = new FormData(this);
	  fetch('/password-forget', {
		method: 'POST',
		body: formData,
	  })
		.then(response => response.json().then(data => ({ status: response.status, body: data })))
		.then(({ status, body }) => {
		  if (status === 200) {
			window.location.href = '/password-forget?success=' + encodeURIComponent('Password reset request sent!');
		  } else {
			document.getElementById('error-message').textContent = body.error;
		  }
		})
		.catch(error => {
		  console.error('Error:', error);
		});
	});
  });
  