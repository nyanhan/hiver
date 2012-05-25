(function(window){

	function Delay (fn, time) {
		this._fn = fn;
		this._time = time;
		this._actived = false;
		this._tmr = 0;
		this._init();
	}
	
	Delay.prototype = {
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

	jQuery.extend({
		delay: function(fn, time){
			return new Delay(fn, time);
		}
	});

})(this);
