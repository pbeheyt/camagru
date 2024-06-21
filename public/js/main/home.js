document.addEventListener('DOMContentLoaded', function() {
	const imageFeed = document.getElementById('image-feed');
  
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
		image.Comments.forEach(comment => {
		  const commentElement = document.createElement('p');
		  commentElement.textContent = `${comment.User.username}: ${comment.text}`;
		  commentsElement.appendChild(commentElement);
		});
  
		const likeButton = document.createElement('button');
		likeButton.textContent = 'Like';
		likeButton.addEventListener('click', () => likeImage(image.id, likesElement));
  
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
		  commentImage(image.id, commentInput.value);
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
  
	function commentImage(imageId, text) {
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
		  fetchImages();
		} else {
		  console.error('Error adding comment:', data.error);
		}
	  })
	  .catch(error => {
		console.error('Error:', error);
	  });
	}
  
	fetchImages();
  });
  