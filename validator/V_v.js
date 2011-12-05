(function($w){
	
var 
	CORE = "jQuery",
	VER = "1.5.2", 
	chkVer = function(){
		var v = $w.jQuery.fn.jquery;
		return v >= VER;
	}
;

if(typeof $w.jQuery === "undefined" || !chkVer()){
	throw CORE + "-" + VER + " required.";
}

var $ = $w.V_v = $w.jQuery.sub();


var RULE_ATTR = "data-V_v_rule",
	RULE_OBJ_KEY = "V_v_rule_object";

$.extend({
	_checkerHash: {},
	rule: function(config){
		/*
		config = {
			element: document.body,
			onpass: function() {},
			onerror: function() {}
		}

		*/
		if($.isPlainObject(config)){
			$(config.element).data(RULE_OBJ_KEY, new Rule(config.element, config));
		} else {
			return $(config).data(RULE_OBJ_KEY);
		}
	},
	checker: function(config){

		if (typeof config === "string") { return _VHash[config]; }

		_checkerHash[name] = new Checker(config.name, config.message, config.check);
	}
});

var Checker = function(name, message, checkRule){

	this._name = name;
	this._check = checkRule;
	this._message = message || "";
	this._status = 0;
	this._defer = $.Deferred();
	this._init();
};

$.extend(Checker.prototype, {
	_init: function() {},
	message: function(str){
		return this._message;
	},
	check: function(str, rule){

		var self = this;

		if(self._status !== 0){ return; }

		self._defer.done(function(result){
			self._status = 0;

			if(result){
				rule.next(this._name);
			}
		});

		self._status = 1;
		self._check(str, rule, self);
	},
	status: function() {
		return this._status;
	},
	result: function(result) {
		this._defer.resolve(result);
	}
});

var Rule = function(element, config){
	this._jquery = $(element);
	this._onpass = config.onpass || $.noop;
	this._onerror = config.onerror || $.noop;
	this._status = 0;
	this._defer = $.Deferred();
	this._init();
}

$.extend(Rule.prototype, {
	_init: function(){},
	rule: function(str){
		if(str){
			this._jquery.attr(RULE_ATTR, str);
		} else {
			return this._jquery.attr(RULE_ATTR);
		}
	},
	check: function(group){
		var self = this,
			first = self.list()[0],
			str = self._jquery.val();

		if(self._status !== 0){ return; }
			
		self._defer.done(function(result){
			self._status = 0;
		});

		self._status = 1;
		

		if (first) {
			$._checkerHash[first].check(str);
		} else {
			this._onpass();
		}
	},
	result: function(){
		self.resolve(result);
	},
	list: function() {
		return this.rule().split(" ");
	},
	next: function(key){
		var list = this.list();

		for (var i = 0, l = list.length; i < l; i++) {
			if (list[i] === key) {
				break;
			}
		}

		var next = list[i + 1];

		if(next){
			$._checkerHash[first].check(str, this, $._checkerHash[first]);
		} else {
			this._onpass();
		}
	},
	end: function(result){
		
	}
});


})(this);

(function(window) {
	V_v.checker({
		name: "empty",
		message: "你搞基啊", 
		check: function(str, rule, checker){
			
		}
	});
})(this);
