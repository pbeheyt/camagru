document.addEventListener('DOMContentLoaded', function() {
  
	function loadContent(url, elementId) {
	  fetch(url)
		.then(function(response) {
		  return response.text();
		})
		.then(function(data) {
		  document.getElementById(elementId).innerHTML = data;
		})
		.catch(function(error) {
		  console.error('Error fetching the content:', error);
		});
	}
  
	loadContent('/html/header-main.html', 'header');
	loadContent('/html/footer.html', 'footer');
  });
  