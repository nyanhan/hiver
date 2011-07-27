(function(window){

var $ = window.jQuery;

if( typeof $ !== 'function' || $().jquery < "1.5.2"){
	throw "This package depends on jQuery 1.5.2 or later !";
}

var win = $(window);
$.assembly = {};

var viewSize = function(){
	var r = {
			left: win.scrollLeft(),
			top: win.scrollTop()
		},
		width = win.width(),
		height = win.height();
		
	r.right = r.left + width;
	r.bottom = r.top + height;
	return r;
};

$.extend({
	printf_: function(str, obj){
		return str.replace(/\{#(\w+)\}/g, function(s, k){
			return k in obj ? obj[k] : s;
		});
	},
	log_: function(){
		
	}
});

$.fn.extend({
	isNull_: function(){
		return this.val() === "";
	},
	highLight_: function(){
		var self = this,
			p = self.offset(),
			v = { width: win.width(), height: win.height() };

		win.scrollLeft(p.left - v.width / 4);
		win.scrollTop(p.top - v.height / 4);
		self.focus();
	}
});

$.assembly.notice = function(elem, config){
	var jObj = this.jObj = $(elem);
	
	if(!jObj.is("input, textarea")){
		return null;
	}
	
	this._raw = jObj.css("color");
	this._gray = config.gray || "#ccc";
	this._text = config.text || jObj.data("as-notice-text") || "";
	this._init();
}

$.extend($.assembly.notice.prototype, {
	_init: function(){
		var jObj = this.jObj,
			self = this;
		
		jObj.data("as-notice-text", self._text);
		
		jObj.isNull_ = function(){
			var nt = jObj.data("as-notice-text"),
				val = jObj.val();
			return val === "" || ( nt && val === nt );
		}
		
		jObj.focus(function(){
			if(jObj.isNull_()){
				jObj.val("")
				.css("color", self._raw);
			}
		}).blur(function(){
			self.check();
		});
		
		self.check();
	},
	check: function(){
		var self = this,
			jObj = self.jObj;
		
		if(jObj.isNull_()){
			jObj.css("color", self._gray)
			.val(self._text);
		} else {
			jObj.css("color", self._raw);
		}
	},
	setValue: function(value){
		this.jObj.val(value);
		this.check();
	},
	getValue: function(){
		return this.jObj.isNull() ? "" : this.jObj.val();
	}
});

$.fn.extend({
	notice_: function(config){
		var self = this,
			key = "as-notice";
		
		if(self.data(key)){
			return self;
		}
		
		config = config || {};
			
		var notice = new $.assembly.notice(self, config);
		
		self.data(key, notice);
		
		return self;
	},
	getAssembly_: function(name){
		if(!name){
			return null;
		}
		
		var key = "as-" + name;
		
		return this.data(key) || null;
	},
	setPosTo_: function(elem, pos){
		// pos like ltlb  lcd tmb
		
		if(!elem){
			return this;
		}
		var obj2 = $(elem),
			auto = !pos,
			self = this,
			apos = obj2.offset(),
			pos = (pos || "ltlb").split(""),
			
			asize = { x: obj2.outerWidth(), y: obj2.outerHeight() },
			bsize = { x: self.outerWidth(), y: self.outerHeight() }
		;
			
		if(auto){
			
			var view = viewSize(),
				r = pos;
				
			if(apos.left + bsize.x > view.right &&
				 apos.left + asize.x - bsize.x >= view.left){
				r[0] = 'r';
				r[2] = 'r';
			}
			if(apos.top + asize.y + bsize.y > view.bottom &&
				 apos.top - bsize.y >= view.top){
				r[1] = 'b';
				r[3] = 't';
			}
		}

		var hash = {
			l: 0, c: 1/2, r: 1,
			
			t: 0, m: 1/2, b: 1
		}
		function caculate(size, k, i){
			return hash[k] * size[ i % 2 ? "y" : "x" ];
		}
		
		self.css("left", apos.left - caculate(bsize, pos[0], 0) + caculate(asize, pos[2], 2))
			.css("top", apos.top - caculate(bsize, pos[1], 1) + caculate(asize, pos[3], 3));
	},
	// TODO
	validate_: function(rule, fn){
	
		var result = true;
		
		if(typeof rule === "function"){
			if(!rule(this)){
				result = false;
			}
		}
		
		fn.call(this, result);
		
		return result;
	}
});

})(this);