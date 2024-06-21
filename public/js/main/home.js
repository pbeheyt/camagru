document.addEventListener('DOMContentLoaded', function() {
	const imageFeed = document.getElementById('image-feed');
	let isAuthenticated = false;
  
	// Check if the user is authenticated
	function checkAuth() {
	  return fetch('/auth/check')
		.then(response => response.json())
		.then(data => {
		  isAuthenticated = data.authenticated;
		});
	}
  
	function fetchImages(page = 1) {
	  fetch(`/images?page=${page}`)
		.then(response => response.json())
		.then(data => {
		  if (data.success) {
			displayImages(data.images);
		  } else {
			console.error('Error fetching images:', data.error);
		  }
		})
		.catch(error => {
		  console.error('Error:', error);
		});
	}
  
	function displayImages(images) {
	  // Clear the existing images
	  imageFeed.innerHTML = '';
  
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
		  console.log('Image liked successfully');
		  likesElement.textContent = `${data.likeCount} likes`;
		} else {
		  console.error('Error liking image:', data.error);
		}
	  })
	  .catch(error => {
		console.error('Error:', error);
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
		  console.log('Comment added successfully');
		  const commentElement = document.createElement('p');
		  commentElement.textContent = `${data.comment.username}: ${data.comment.text}`;
		  commentsElement.appendChild(commentElement);
		} else {
		  console.error('Error adding comment:', data.error);
		}
	  })
	  .catch(error => {
		console.error('Error:', error);
	  });
	}
  
	// First check if the user is authenticated, then fetch images
	checkAuth().then(fetchImages);
  });
  