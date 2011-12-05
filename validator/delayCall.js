(function(window){
	
	if(typeof window.jQuery === "undefined"){
		window.jQuery = {};
	}

	var $ = window.jQuery;

	function DelayCall (fn, time) {
		this._fn = fn;
		this._time = time;
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
		reset: function(fn, time) {
			var s = this;
			
			if (fn) {
				s._fn = fn;
			}
			
			if (time) {
				s._time = time;
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
			
			if(s.isActive()){
				 s._fn.call(s);
			}
			
			s.clear();
		}
	};

	$.extend({
		delayCall: function(fn, time){
			return new DelayCall(fn, time);
		}
	});

})(this);
