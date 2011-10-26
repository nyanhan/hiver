/*
* include jquery_ext_base.js
*/

(function(window) {
	
	$.$defined("notice", function(elem, config) {

		var jObj = $(elem).first();

		// is input:text has a bug when type=""
		if (!(jObj && (jObj.is("input") && jObj[0].type === "text" || jObj.is("textarea")))) {
			return null;
		}

		var s = this;
		
		s._config = config;
		s._jObj = jObj;
		s._raw = jObj.css(s.COLOR);
		s._color = s._conf(s.COLOR) || s.DEFAULTCOLOR;
		s._text = s._conf(s.TEXT) || s.DEFAULTTEXT;
		s._align = s._conf(s.ALIGN) || s.DEFAULTALIGN;
		s._init();
	}, {
		DEFAULTALIGN: "left",
		DEFAULTCOLOR: "#CCC",
		DEFAULTTEXT: "",
		COLOR: "color",
		TEXT: "text",
		ALIGN: "align",
		TEXTALIGN: "text-align",
		_init: function() {
			var self = this,
				jObj = self._jObj;

			jObj.data(self.PREFIX + self.TEXT, self._text);

			jObj.bind("focus.notice", function() {
				self._focusCheck();
			})
			.bind("blur.notice", function() {
				self.check();
			});

			self.check();
		},
		_conf: function(key) {
			return this._config[key] || this._getData(key);
		},
		_focusCheck: function() {
			var self = this;
			if (self.isNull()) {
				self._jObj.val("")
				.css(self.COLOR, self._raw)
				.css(self.TEXTALIGN, self.DEFAULTALIGN);
			}
		},
		_getData: function(key) {
			return this._jObj.data(this.PREFIX + key);
		},
		check: function() {
			var self = this,
				jObj = self._jObj;

			if (self.isNull()) {
				jObj.css(self.COLOR, self._color)
					.css(self.TEXTALIGN, self._align)
					.val(self._text);
			} else {
				jObj.css(self.COLOR, self._raw)
					.css(self.TEXTALIGN, self.DEFAULTALIGN);
			}
		},
		val: function(value) {
			if (typeof value === "undefined") {
				return this.isNull() ? "" : this._jObj.val();
			} else {
				this._jObj.val(value);
				this.check();
			}
		},
		isNull: function() {
			var self = this,
				jObj = self._jObj,
				nt = jObj.data(self.PREFIX + self.TEXT),
				val = jObj.val();

			return val === "" || ( nt && val === nt );
		},
		distroy: function() {
			var jObj = this._jObj;

			this._focusCheck();

			jObj.unbind(".notice")
				.data(this.PREFIX + this.TEXT, null);

		}
	});
	
	$.fn.extend({
		$notice: function(config) {
			var name = "notice",
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