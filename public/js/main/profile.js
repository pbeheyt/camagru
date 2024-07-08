document.addEventListener('DOMContentLoaded', function() {
	const changeInfoForm = document.getElementById('change-info-form');
	const changePasswordForm = document.getElementById('change-password-form');
	const errorMessage = document.getElementById('error-message');
	const successMessage = document.getElementById('success-message');
  
	// Fetch and display current user info
	fetch('/profile-info', {
	  method: 'GET',
	  headers: {
		'Content-Type': 'application/json'
	  }
	})
	.then(response => response.json())
	.then(data => {
	  if (data.success) {
		document.getElementById('email').value = data.user.email;
		document.getElementById('username').value = data.user.username;
	  } else {
		errorMessage.textContent = data.error;
	  }
	})
	.catch(error => {
	  console.error('Error:', error);
	});
  
	changeInfoForm.addEventListener('submit', function(event) {
	  event.preventDefault();
  
	  const formData = new URLSearchParams(new FormData(this));
  
	  fetch('/change-info', {
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
		} else {
		  errorMessage.textContent = data.error;
		  successMessage.textContent = '';
			errorMessage.style.display = 'block';
			successMessage.style.display = 'none';
		}})
	  .catch(error => {
			console.error('Error:', error);
	  });
	});
  
	changePasswordForm.addEventListener('submit', function(event) {
	  event.preventDefault();
  
	  const formData = new URLSearchParams(new FormData(this));
  
	  fetch('/change-password', {
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
