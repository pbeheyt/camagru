document.addEventListener('DOMContentLoaded', function() {
	const imageFeed = document.getElementById('image-feed');
	const loadingSpinner = document.getElementById('loading-spinner');
	let isAuthenticated = false;
	let currentPage = 1;
	let totalPages = 1;
	let isLoading = false;
  
	// Check if the user is authenticated
	function checkAuth() {
	  return fetch('/auth/check')
		.then(response => response.json())
		.then(data => {
		  isAuthenticated = data.authenticated;
		});
	}
  
	function fetchImages(page = 1) {
	  if (page > totalPages || isLoading) {
		return;
	  }
	  isLoading = true;
	  loadingSpinner.style.display = 'block';
  
	  setTimeout(() => {
		fetch(`/images?page=${page}`)
		  .then(response => response.json())
		  .then(data => {
			loadingSpinner.style.display = 'none';
			isLoading = false;
  
			if (data.success) {
			  appendImages(data.images);
			  currentPage = data.currentPage;
			  totalPages = data.totalPages; // Update totalPages from the response
			}
		  })
		  .catch(error => {
			loadingSpinner.style.display = 'none';
			isLoading = false;
			console.error('Error fetching images:', error);
		  });
	  }, 1000); // 1000ms delay for loading animation
	}
  
	function appendImages(images) {
	  images.forEach(image => {
		const imageContainer = document.createElement('div');
		imageContainer.classList.add('image-container');
		imageContainer.dataset.imageId = image.id;
  
		const imgElement = document.createElement('img');
		imgElement.src = image.url;
		imgElement.alt = image.description;
  
		const usernameElement = document.createElement('p');
		usernameElement.textContent = `Posted by: ${image.User.username}`;
  
		const descriptionElement = document.createElement('p');
		descriptionElement.textContent = image.description;
  
		const likesElement = document.createElement('p');
		likesElement.textContent = `${image.Likes.length} likes`;
		likesElement.classList.add('like-count');
		likesElement.dataset.imageId = image.id;
  
		const commentsElement = document.createElement('div');
		commentsElement.classList.add('comments-container');
		commentsElement.dataset.imageId = image.id;
		image.Comments.forEach(comment => {
		  const commentElement = document.createElement('p');
		  commentElement.textContent = `${comment.User.username}: ${comment.text}`;
		  commentsElement.appendChild(commentElement);
		});
  
		const likeButton = document.createElement('button');
		likeButton.textContent = 'Like';
		likeButton.addEventListener('click', () => {
		  if (isAuthenticated) {
			likeImage(image.id, likesElement);
		  } else {
			alert('You need to log in to like an image.');
		  }
		});
  
		const commentForm = document.createElement('form');
		const commentInput = document.createElement('input');
		commentInput.type = 'text';
		commentInput.placeholder = 'Add a comment';
		const commentButton = document.createElement('button');
		commentButton.textContent = 'Comment';
		commentForm.appendChild(commentInput);
		commentForm.appendChild(commentButton);
		commentForm.addEventListener('submit', (event) => {
		  event.preventDefault();
		  if (isAuthenticated) {
			commentImage(image.id, commentInput.value, commentsElement);
			commentInput.value = ''; // Clear the input field after submitting
		  } else {
			alert('You need to log in to comment.');
		  }
		});
  
		imageContainer.appendChild(imgElement);
		imageContainer.appendChild(usernameElement);
		imageContainer.appendChild(descriptionElement);
		imageContainer.appendChild(likesElement);
		imageContainer.appendChild(commentsElement);
		imageContainer.appendChild(likeButton);
		imageContainer.appendChild(commentForm);
  
		imageFeed.appendChild(imageContainer);
	  });
	}
  
	function likeImage(imageId, likesElement) {
	  fetch(`/images/${imageId}/like`, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		}
	  })
	  .then(response => response.json())
	  .then(data => {
		if (data.success) {
		  likesElement.textContent = `${data.likeCount} likes`;
		}
	  });
	}
  
	function commentImage(imageId, text, commentsElement) {
	  fetch(`/images/${imageId}/comment`, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify({ text })
	  })
	  .then(response => response.json())
	  .then(data => {
		if (data.success) {
		  const commentElement = document.createElement('p');
		  commentElement.textContent = `${data.comment.username}: ${data.comment.text}`;
		  commentsElement.appendChild(commentElement);
		}
	  });
	}
  
	function handleScroll() {
	  const windowHeight = window.innerHeight;
	  const lastImageContainer = document.querySelector('.image-container:last-child');
  
	  if (lastImageContainer) {
		const lastImageBottom = lastImageContainer.getBoundingClientRect().bottom;
  
		if (lastImageBottom <= windowHeight + 100) {
		  fetchImages(currentPage + 1);
		}
	  }
	}
  
	window.addEventListener('scroll', handleScroll);
  
	// First check if the user is authenticated, then fetch images
	checkAuth().then(() => fetchImages(currentPage));
  });
  