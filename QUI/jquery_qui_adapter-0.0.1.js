(function(window, undefined) {
	
	var $ = window.jQuery;

	if (typeof $ !== 'function' || $().jquery < "1.5.2") {
		throw "This package depends on jQuery 1.5.2 or later !";
	}
	
	var doc = window.document,
		QUI = window.QUI;
	
	if(typeof QUI === "undefined"){
		QUI = {};
	}
	
	if(typeof QUI.core === "undefined"){
		QUI.core = {};
	}
	
	$.extend(QUI.core, {
		printf: function(str, obj) {
			return str.replace(/\{#(\w+)\}/g, function(s, k) {
				return k in obj ? obj[k] : s;
			});
		}
	});
	
	var _f = QUI.core,
		_containerName = "QUIContainer",
		_container = _f.printf('<div id="{#name}" class="{#name}" style="height:0;font-size:0;"> </div>', { name: _containerName }),
		_zoomTester;

	if (doc.body) {
		
		$(_container).insertBefore(body.firstChild);
		
	} else {
		
		doc.write(_container);
		
	}
	
	QUI.core.container = doc.getElementById(_containerName);
	
	$.fn.extend({
		zoomOffset: function() {
			
			if (!zoomTester) {
				_zoomTester = doc.createElement("div");
				_zoomTester.style.cssText = "position:absolute;top:-10000px;width:100px;height:100px";
				QUI.core.container.appendChild(_zoomTester);
			}
			
			var offset = this.offset(),
				top = offset.top, left = offset.left,
				zoom = 1,
				tester = _zoomTester;

			if (tester && tester.getBoundingClientRect) {
				var bound = tester.getBoundingClientRect();
				zoom = parseFloat(Math.round(((bound.right - bound.left) / tester.clientWidth) * 100)) / 100;
				if (isNaN(zoom)) {
					zoom = 1;
				}
				top = Math.round(top / zoom);
				left = Math.round(left / zoom);
			}
			return { top: top, left: left, zoom: zoom };
		}
	});
	
})(this);