(function(window) {

	if(typeof jQuery === "undefined"){
		window.jQuery = {};
	}
   
	var $ = jQuery,
		reURL    = (/^([^:\s]+):\/{2,3}([^\/\s:]+)(?::(\d{1,5}))?(\/[^\?\s#]+)?(\?[^#\s]+)?(#[^\s]+)?/),
		reSearch = (/(?:[\?&])(\w+)=([^#&\s]*)/g),
		URLLi    = "protocol host port path search hash";

		
	$.$parseURL = function(url) {
		if (!url) {
			url = location.href;
		}

		var arr = url.match(reURL),
			temp = {};

		$.each(URLLi.split(" "), function(i, item) {
			temp[item] = arr[i];
		});

		return temp;
	};
	
	$.$parseQuery = function(queryString) {
		if (!queryString) {
			queryString = location.search;
		}

		var temp = {};

		queryString.replace(reSearch, function(a, f, s) {
			temp[f] = s;
		});

		return temp;
	};
	
	$.$toQuery = function(obj) {
		var arr = [];
		
		obj = obj || {};
		
		for (var k in obj) {
			if(obj.hasOwnProperty(k)){
				arr[arr.length] = k + "=" + obj[k];
			}
		}
		
		return arr.join("&");
	};
	
})(this);
