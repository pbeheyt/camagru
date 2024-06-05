document.addEventListener('DOMContentLoaded', function() {
	const params = new URLSearchParams(window.location.search);
	const error = params.get('error');
  
	if (error) {
	  document.getElementById('error-message').textContent = decodeURIComponent(error);
	}
  
	const form = document.getElementById('register-form');
	form.addEventListener('submit', function(event) {
	  event.preventDefault();
  
	  const formData = new FormData(this);
	  fetch('/register', {
		method: 'POST',
		body: formData,
	  })
		.then(response => response.json().then(data => ({ status: response.status, body: data })))
		.then(({ status, body }) => {
		  if (status === 200) {
			window.location.href = '/login?success=' + encodeURIComponent('Account created successfully!');
		  } else {
			document.getElementById('error-message').textContent = body.error;
		  }
		})
		.catch(error => {
		  console.error('Error:', error);
		});
	});
  });
  