(function(window) {
	var search = window.location.search,
		doc = window.document,
		html = doc.documentElement;

	if (search.indexOf("debug=true=lite") >= 0) {
		html.setAttribute("debug", "true");
		doc.write('<script src="http://qunarzz.com/js/firebug-lite/build/firebug-lite.js"></script>');
	}

})(this);
	
(function(window) {

	var $ = window.jQuery;

	if (typeof $ !== 'function' || $().jquery < "1.5.2") {
		throw "This package depends on jQuery 1.5.2 or later !";
	}

	var doc = window.document,
		html = doc.documentElement,
		body = doc.body,
		location = window.location,
		PREFIX = "as",
		zoomTester,
		returnTrue = function(){ return true; };

	$.assembly = {};

	var asContainer = '<div id="asContainer" class="asContainer" style="height:0;font-size:0;"></div>';
	
	if (body) {
		$(asContainer).insertBefore(body.firstChild);
	} else {
		doc.write(asContainer);
	}
	
	asContainer = $("#asContainer");

		
	function DelayCall (fn, time, condition) {
		this._fn = fn;
		this._time = time;
		this._condition = condition;
		this._actived = false;
		this._tmr = 0;
		this._init();
	}
	
	DelayCall.prototype = {
		_init: function() {
			var s = this;
			
			if (!s._fn) {
				return;
			}
			
			s._tmr = setTimeout(function() {
				s.trigger();
			}, s._time);
			
			this._actived = true;
		},
		isActive: function() {
			return this._actived;
		},
		reset: function(fn, time, condition) {
			var s = this;
			
			if (fn) {
				s._fn = fn;
			}
			
			if (time) {
				s._time = time;
			}
			
			if (condition) {
				s._condition = condition;
			}
			
			s.clear();
			s._init();
		},
		clear: function() {
			if(this.isActive()){
				clearTimeout(this._tmr);
				this._actived = false;
			}
		},
		trigger: function() {
			var s = this;
			
			if(s.isActive() && s._condition()){
				 s._fn.call(s);
			}
			
			s.clear();
		}
	};
		
	$.extend({
		$printf: function(str, obj) {
			return str.replace(/\{#(\w+)\}/g, function(s, k) {
				return k in obj ? obj[k] : s;
			});
		},
		$defined: function(name, constructor, config) {
			$.assembly[name] = constructor;

			constructor.prototype.assemblyName = name;
			constructor.prototype.PREFIX = [PREFIX, name, ""].join("-");
			constructor.prototype.constructor = constructor;

			$.extend(constructor.prototype, config || {});

			return constructor;
		},
		$delayCall: function(fn, time, condition) {
			
			time = time || 0;
			condition = condition || returnTrue;
			
			return new DelayCall(fn, time, condition);
		}
	});

	$.fn.extend({
		$highLight: function(percent) {
			var self = this,
				win = $(window),
				p = self.$zoomOffset(),
				v = { width: win.width(), height: win.height() };
			
			percent = percent || 0.25;
			win.scrollLeft(p.left - v.width * percent);
			win.scrollTop(p.top - v.height * percent);

			self.focus();
		},
		$zoomOffset: function() {
			
			if (!zoomTester) {
				zoomTester = doc.createElement("div");
				zoomTester.style.cssText = "position:absolute;top:-10000px;width:100px;height:100px";
				asContainer.append(zoomTester);
			}
			
			var offset = this.offset(),
				top = offset.top, left = offset.left,
				zoom = 1,
				tester = zoomTester;

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


	var _caculateZoomSize = function(r, width, height, zoom) {

		if (!r) {
			return null;
		}

		var midX = r.left + width / 2,
			midY = r.top + height / 2,
			fullWidth = html.scrollWidth,
			fullHeight = html.scrollHeight;
		
		zoom = zoom || 1;
		width *= zoom;
		height *= zoom;

		r.left = Math.max(0, midX - width / 2);
		r.top = Math.max(0, midY - height / 2);
		r.right = Math.min(midX + width / 2, fullWidth);
		r.bottom = Math.min(midY + height / 2, fullHeight);

		return r;
	};

	$.extend({
		$viewSize: function(zoom) {

			var win = $(window);

			var r = {
				left: win.scrollLeft(),
				top: win.scrollTop()
			};

			var width = win.width(),
				height = win.height();

			return _caculateZoomSize(r, width, height, zoom);
		}
	});
	
	var visiCallTimer = 0,
		visiCallDuring = 200,
		visiCallHash = [];
		
	var visiCallCheck = function(){
		var obj, fn;
		
		for(var i = 0, len = visiCallHash.length; i < len;){
			obj = visiCallHash[i][0];
			fn = visiCallHash[i][1];
			
			if(obj.$appearInWindow()){
				fn.call(obj);
				visiCallHash.splice(i, 1);
				--len;
			} else {
				++i;
			}
		}
	  
		if(!visiCallHash.length){
			clearInterval(visiCallTimer);
			visiCallTimer = 0;
		}  
	};
		

	$.fn.extend({
		$asse: function(name, asObject) {
			if (!name) {
				return null;
			}

			var key = [PREFIX, name].join("-");

			if (typeof asObject === "undefined") {
				return this.data(key) || null;
			}

			this.data(key, asObject);

			return this;
		},
		$setPosTo: function(elem, pos) {
			// pos like ltlb  lcd tmb

			var jObj = $(elem).first(),
				auto = !pos, self = this,
				apos = jObj.$zoomOffset(),

				asize = { x: jObj.outerWidth(), y: jObj.outerHeight() },
				bsize = { x: self.outerWidth(), y: self.outerHeight() };

			pos = (pos || "ltlb").split("");

			if (auto) {

				var view = $.$viewSize();

				if (apos.left + bsize.x > view.right &&
					apos.left + asize.x - bsize.x >= view.left) {
					pos[0] = 'r';
					pos[2] = 'r';
				}
				if (apos.top + asize.y + bsize.y > view.bottom &&
					apos.top - bsize.y >= view.top) {
					pos[1] = 'b';
					pos[3] = 't';
				}
			}

			var hash = {
				l: 0, c: 0.5, r: 1,
				t: 0, m: 0.5, b: 1
			};

			function caculate(size, k, i) {
				return hash[k] * size[ i % 2 ? "y" : "x" ];
			}

			self.css("left", apos.left - caculate(bsize, pos[0], 0) + caculate(asize, pos[2], 2))
				.css("top", apos.top - caculate(bsize, pos[1], 1) + caculate(asize, pos[3], 3));

			return this;
		},
		$viewSize: function(zoom) {

			if ($.isWindow(this[0])) {
				return $.$viewSize(zoom);
			}
			
			var first = this;
			
			if (first.length > 1) {
				first = first.first();
			}
			
			var r = first.$zoomOffset(),
				width = first.outerWidth(),
				height = first.outerHeight();

			return _caculateZoomSize(r, width, height, zoom);
		},
		$appearInWindow: function(zoom) {
			
			var i = 0,
				self = this,
				len = self.length,
				v = $.$viewSize(zoom);
			
			if(!len){
				return false;
			}
			
			for(; i < len; i++){
				if ($.isWindow(self[i])) {
					continue;
				}
				
				var first = self.eq(i),
					p = first.$viewSize();

				if(!(p && p.left <= v.right && p.top <= v.bottom && p.right >= v.left && p.bottom >= v.top)){
					return false;
				}
			}
			
			return true;
		},

		/*
		* 直接执行: 1. 浏览器有默认滚动行为， 是异步的。 就会导致第一屏永远初始化。
		* 异步执行： ie8 和 chrome 默认滚动发生比domready和load都晚， 考虑scroll事件和极限值结合的方案
		* 综上， 考虑到异步的默认滚动行为可能失败， 失败后如果不初始化比较尴尬， 所以还是考虑直接执行的方案。
		*/
		
		$appearCall: function(fn){
			var self = this;
			
			if(!$.isFunction(fn)){
				return;
			}
		
			if(self.$appearInWindow()){
				fn.call(self);
			} else {
				visiCallHash.push([self, fn]);
			
				if(!visiCallTimer){
					visiCallTimer = setInterval(visiCallCheck, visiCallDuring);
				}
			} 
		}
	});


})(this);