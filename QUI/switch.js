/*
* include jquery_ext_base.js
*/

(function(window) {
	
	$.$defined("switch", function(elem, config){
		var jObj = $(elem).first();

		var s = this;
		s._jObj = jObj;
		s._config = config;
		s._button = s._conf(s.BUTTON) || s.DEFAULTBUTTON;
		s._default = s._conf(s.INDEX);
		s._index = null;
		s._active = s._conf(s.ACTIVE) || s.DEFAULTACTIVE;
		s._panel = s._conf(s.PANEL);
		s._event = s._conf(s.EVENT) || s.DEFAULTEVENT;
		s._callback = s._conf(s.CALLBACK) || $.noop;
		s._btnList = [];
		s._panelList = [];
		s._hasPanel = false;
		s._init();
	},{
		INDEX: "index",
		BUTTON: "button",
		ACTIVE: "active",
		CALLBACK: "callback",
		PANEL: "panel",
		EVENT: "event",
		DEFAULTEVENT: "click",
		DEFAULTBUTTON: "<a>",
		DEFAULTACTIVE: "active",
		_init: function(){
			var self = this,
				tag = self._button.match(/^<([a-z]+)(?:[ \/]+)?>$/i);

			self._btnList = tag ? $(tag[1], self._jObj) : $(self._button);
			
			if(!self._btnList.length){
				return self;
			}
			
			if(self._panel){
				self._panelList = $(self._panel);
			}
			
			if(self._panelList.length){
				self._hasPanel = true;
			}
			
			self._btnList.each(function(i, item){
				$(item).bind(self._event, function(){
					self.setCurrent(i);
				});
			});

			if(self._default != null){
				self.setCurrent(self._default);
			}
		},
		_conf: function(key){
			var c = this._config[key];
			
			return c == null ? this._getData(key) : c;
		},
		_getData: function(key) {
			return this._jObj.data(this.PREFIX + key);
		},
		getCurrent: function(){
			return this._index;
		},
		setCurrent: function(i){
			if(this._index === i){
				return;
			}
			
			var self = this,
				before = self.getButton(self._index),
				after = self.getButton(i);
			
			before.removeClass(self._active);
			after.addClass(self._active);
			self.setPanelCurrent(i);
			self._index = i;
		},
		setPanelCurrent: function(i){
			var self = this,
				before = self._index;
			
			if(self._hasPanel){
				self.getPanel(before).hide();
				self.getPanel(i).show();
			}
			
			self._callback.call(self, before, i);
		},
		getButton: function(i){
			return this._btnList.eq(i);
		},
		getPanel:function(i){
			return this._hasPanel ? this._panelList.eq(i) : null;
		},
		trigger: function(i){
			this.getButton(i).trigger(this._event);
		}
	});
	
	$.fn.extend({
		$switch: function(config){
			var name = "switch",
				fn = $.assembly[name];
			
			this.each(function(i, item) {
				var jObj = $(item);

				if (jObj.$asse(name)) {
					return;
				}

				jObj.$asse(name, new fn(jObj, config || {}));
			});
			
			return this;
		}
	});
})(this);