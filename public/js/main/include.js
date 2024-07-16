document.addEventListener('DOMContentLoaded', function() {

	function loadContent(url, elementId, cssUrl) {
	  fetch(url)
		.then(function(response) {
		  return response.text();
		})
		.then(function(data) {
		  document.getElementById(elementId).innerHTML = data;
		  if (cssUrl) {
			loadCSS(cssUrl);
		  }
		})
		.catch(function(error) {
		  // console.error('Error fetching the content:', error);
		});
	}
  
	function loadCSS(url) {
	  const link = document.createElement('link');
	  link.rel = 'stylesheet';
	  link.href = url;
	  document.head.appendChild(link);
	}
  
	loadContent('/html/header-main.html', 'header', '/css/header.css');
	loadContent('/html/footer.html', 'footer', '/css/footer.css');
  });
  