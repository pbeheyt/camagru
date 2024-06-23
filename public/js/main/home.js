document.addEventListener('DOMContentLoaded', function () {
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
                        if (data.images.length === 0 && currentPage === 1) {
                            displayNoImagesMessage();
                        } else {
                            appendImages(data.images);
                        }
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
		
    function displayNoImagesMessage() {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('no-images-message');
        messageContainer.textContent = 'Nothing to show here for the moment...';
        imageFeed.appendChild(messageContainer);
				console.log('test');
    }

	function appendImages(images) {
		images.forEach(image => {
		  const imageContainer = document.createElement('div');
		  imageContainer.classList.add('image-container');
		  imageContainer.dataset.imageId = image.id;
	  
		  const userInfoElement = document.createElement('div');
		  userInfoElement.classList.add('user-info');
	  
		  const usernameElement = document.createElement('span');
		  usernameElement.classList.add('username');
		  usernameElement.textContent = image.User.username;
	  
		  const dateElement = document.createElement('span');
		  dateElement.classList.add('date');
		  dateElement.textContent = formatDate(image.createdAt);
	  
		  userInfoElement.appendChild(usernameElement);
		  userInfoElement.appendChild(dateElement);
	  
		  const imgElement = document.createElement('img');
		  imgElement.src = image.url;
		  imgElement.alt = image.description;
	  
		  const actionsElement = document.createElement('div');
		  actionsElement.classList.add('actions');
	  
		  const likeButton = document.createElement('img');
		  likeButton.src = '/img/asset/like-off.png';
		  likeButton.classList.add('like-button');
		  likeButton.addEventListener('click', () => {
			if (isAuthenticated) {
			  likeImage(image.id, likeButton, likesElement);
			} else {
			  alert('You need to log in to like an image.');
			}
		  });
	  
		  const likesElement = document.createElement('span');
		  likesElement.classList.add('like-count');
		  likesElement.textContent = `${image.Likes.length} likes`;
	  
		  const commentsTitleContainer = document.createElement('div');
		  commentsTitleContainer.classList.add('comments-title-container');
	  
		  const commentsTitle = document.createElement('h4');
		  commentsTitle.classList.add('comments-title');
		  commentsTitle.textContent = 'Comments';
	  
		  commentsTitleContainer.appendChild(commentsTitle);
		  actionsElement.appendChild(likeButton);
		  actionsElement.appendChild(likesElement);
		  commentsTitleContainer.appendChild(actionsElement);
	  
		  const commentsTitleStripe = document.createElement('hr');
		  commentsTitleStripe.classList.add('title-stripe');
	  
		  const commentsElement = document.createElement('div');
		  commentsElement.classList.add('comments-container');
		  commentsElement.dataset.imageId = image.id;
		  image.Comments.forEach(comment => {
			const commentElement = document.createElement('p');
			commentElement.classList.add('comment');
			commentElement.innerHTML = `<strong>${comment.User.username}</strong>&nbsp;&nbsp;&nbsp;${comment.text}`;
			commentsElement.appendChild(commentElement);
		  });
	  
		  const commentForm = document.createElement('form');
		  commentForm.classList.add('comment-form');
		  const commentInput = document.createElement('input');
		  commentInput.type = 'text';
		  commentInput.placeholder = 'Add a comment...';
		  const commentButton = document.createElement('img');
		  commentButton.src = '/img/asset/comment-off.png';
		  commentButton.classList.add('comment-button');
		  
      // Trigger form submission when the comment button is clicked
      commentButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default behavior
        if (isAuthenticated) {
        commentImage(image.id, commentInput.value, commentsElement);
        commentInput.value = ''; // Clear the input field after submitting
        commentButton.src = '/img/asset/comment-on.png'; // Change button to "on"
        setTimeout(() => {
          commentButton.src = '/img/asset/comment-off.png'; // Change back to "off" after 500ms
        }, 500);
        } else {
        alert('You need to log in to comment.');
        }
      });
		  
		  commentForm.appendChild(commentInput);
		  commentForm.appendChild(commentButton);
		  
		  // Add event listener to the form to handle Enter key submission
		  commentForm.addEventListener('submit', (event) => {
			event.preventDefault();
			if (isAuthenticated) {
			  commentImage(image.id, commentInput.value, commentsElement);
			  commentInput.value = ''; // Clear the input field after submitting
			} else {
			  alert('You need to log in to comment.');
			}
		  });
	  
		  imageContainer.appendChild(userInfoElement);
		  imageContainer.appendChild(imgElement);
	  
		  if (image.description) {
			const descriptionElement = document.createElement('p');
			descriptionElement.classList.add('description');
			descriptionElement.innerHTML = `<strong>${image.User.username}</strong>&nbsp;&nbsp;&nbsp;${image.description}`;
			imageContainer.appendChild(descriptionElement);
		  }
	  
		  const descriptionStripe = document.createElement('hr');
		  descriptionStripe.classList.add('description-stripe');
	  
		  imageContainer.appendChild(descriptionStripe);
		  imageContainer.appendChild(commentsTitleContainer);
		  imageContainer.appendChild(commentsTitleStripe);
		  imageContainer.appendChild(commentsElement);
		  imageContainer.appendChild(commentForm);
	  
		  imageFeed.appendChild(imageContainer);
		});
	  }


	function formatDate(dateString) {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);

		if (diffMins < 60) {
			return `${diffMins}m ago`;
		} else if (diffMins < 1440) {
			const diffHrs = Math.floor(diffMins / 60);
			return `${diffHrs}h ago`;
		} else {
			const diffDays = Math.floor(diffMins / 1440);
			return `${diffDays}d ago`;
		}
	}

	function likeImage(imageId, likeButton, likesElement) {
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
					if (data.liked) {
						likeButton.src = '/img/asset/like-on.png';
					} else {
						likeButton.src = '/img/asset/like-off.png';
					}
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
					commentElement.classList.add('comment');
					commentElement.innerHTML = `<strong>${data.comment.username}</strong>&nbsp;&nbsp;&nbsp;${data.comment.text}`;
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

