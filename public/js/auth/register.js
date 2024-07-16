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
	  .then(response => response.json())
		.then(data => {
			if (data.success) {
					successMessage.textContent = data.success;
					successMessage.style.display = 'block';
					errorMessage.style.display = 'none';
					setTimeout(() => {
							window.location.href = '/login';
					}, 3000);
			} else {
					errorMessage.textContent = data.error;
					errorMessage.style.display = 'block';
					successMessage.style.display = 'none';
			}
		})
	  .catch(error => {
			// console.error('Error:', error);
	  });
	});
});
  