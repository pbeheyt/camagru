// Wait until the entire HTML document is fully loaded and parsed
document.addEventListener('DOMContentLoaded', function() {
  
	function loadContent(url, elementId) {
	  fetch(url)
		.then(function(response) {
		  // Convert the response into text
		  return response.text();
		})
		.then(function(data) {
		  // Insert the fetched content into the specified DOM element
		  document.getElementById(elementId).innerHTML = data;
		})
		.catch(function(error) {
		  console.error('Error fetching the content:', error);
		});
	}
  
	loadContent('/html/header.html', 'header');
	loadContent('/html/footer.html', 'footer');
  });
  