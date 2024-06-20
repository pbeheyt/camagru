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
  
		const imgElement = document.createElement('img');
		imgElement.src = image.url;
		imgElement.alt = image.description;
  
		const descriptionElement = document.createElement('p');
		descriptionElement.textContent = image.description;
  
		const likesElement = document.createElement('p');
		likesElement.textContent = `${image.Likes.length} likes`;
  
		const commentsElement = document.createElement('div');
		commentsElement.classList.add('comments-container');
		image.Comments.forEach(comment => {
		  const commentElement = document.createElement('p');
		  commentElement.textContent = `${comment.User.username}: ${comment.text}`;
		  commentsElement.appendChild(commentElement);
		});
  
		imageContainer.appendChild(imgElement);
		imageContainer.appendChild(descriptionElement);
		imageContainer.appendChild(likesElement);
		imageContainer.appendChild(commentsElement);
		
		imageFeed.appendChild(imageContainer);
	  });
	}
  
	fetchImages();
  });
  