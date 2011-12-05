(function($w, undefined){
	
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
	RULE_OBJ_KEY = "V_v_rule_object",
	DEFAULT_CHECKER = "V_v_checker_default",
	EVENT_SUFFIX = ".V_v_input";

$.extend({
	_checkerHash: {},
	IChecker: {
		name: DEFAULT_CHECKER,
		message: "",
		async: false,
		check: function(str, rule){
			rule.result(true);
		}
	},
	IRule: {
		onverified: $.noop,
		loading: 50,
		onloading: $.noop,
		timeout: 0,
		ontimeout: $.noop
	},
	IGroup: {
		onverified: $.noop,
		loading: 50,
		onloading: $.noop,
		timeout: 0,
		ontimeout: $.noop
	}
});

$.extend({
	rule: function(element, config){

		if(config){
			$(element).data(RULE_OBJ_KEY, new Rule(element, config));
		} else {
			return $(element).data(RULE_OBJ_KEY);
		}
	},
	checker: function(config){

		if (typeof config === "string") { return $._checkerHash[config]; }

		$._checkerHash[config.name] = $.extend({}, $.IChecker, config);
	},
	group: function(selector, config){

		return new Group(selector, config);
	}
});

$.fn.extend({
	validate: function(config){
		return $.group(this, config);
	}
});

var Group = function(selector, config){
	var self = this;

	self._config = $.extend({}, $.IRule, config);
	self._jquery = $(selector);

	self._init();
}

$.extend(Group.prototype, {
	_init: function(){
		var self = this;

		self._jquery.each(function(){
			var rule = $.rule(this);

			if(rule){
				rule.destory();	
			}

			$.rule(this, self._config);
		});
	},
	check: function(config){
		var self = this;

		var o = $.extend({}, $.IGroup, config);

		$.each(o, function(k, item){
			self["_" + k] = item;
		});

		self._defer = $.Deferred().done(function(result){
			self._onverified(result);
		});

		self._jquery.each(function(){
			$.rule(this).check(function(){
				self.result();
			});
		});
	},
	result: function(){
		var result = [],
			all = true,
			self = this;

		self._jquery.each(function(){

			if(self._isInDOM(this)){

				var res = $.rule(this).getResult();

				if(res === undefined){
					all = false;
					return;
				}

				result.push(res);
			}
			
		});

		if(all){
			for (var i = 0, l = result.length; i < l; i++) {
				if(!result[i]){ self.end(false); return; }
			}

			self.end(true);
		}

	},
	end: function(result) {
		this._defer.resolve(result);
	},
	_isInDOM: function(element){
		return $.contains(document.body, element);
	}
});


var Rule = function(element, config){
	var self = this;

	config = $.extend({}, $.IRule, config);
	self._jquery = $(element);

	$.each(config, function(k, item){
		self["_" + k] = item;
	});

	self._timer = $.delayCall(null, 200);

	self._init(); 
}

$.extend(Rule.prototype, {
	_init: function(){
		var self = this;

		self._checkedList = {};
		self._val = "";
		self._checkerHash = {};
		self._currentChecker = undefined;
		self._message = "";

		self._jquery.bind("input" + EVENT_SUFFIX, function(){
			self._timer.reset(function(){
				self.check();
			});
		});
	},
	destory: function(){
		self._jquery.unbind(EVENT_SUFFIX);
		self._timer.clear();
	},
	rule: function(str){
		if(str){
			this._jquery.attr(RULE_ATTR, str);
		} else {
			return this._jquery.attr(RULE_ATTR) || "";
		}
	},
	getResult: function(){
		return this._result;	
	},
	check: function(next){
		var self = this;
		
		self._defer = $.Deferred().done(function(result){

			if(result){
				self._onverified(true, self._currentChecker.message);
			} else {
				self._onverified(false, self._currentChecker.message);
			}

			self._result = result;
			self._message = self._currentChecker.message || "";

			if (next) {
				next();
			}
		
		});

		self._currentChecker = self._result = undefined;

		self._resetHash();
		self._getValue();

		self._checkNext();
	},
	_getValue: function(){
		this._val = this._jquery.val();
	},
	_resetHash: function(){
		var self = this,
			list = self._getList();

		self._checkerHash = {};
		self._checkerList = list;
		self._clearChecked();

		for (var i = 0, l = list.length; i < l; i++) {
			self._checkerHash[list[i]] = $.checker(list[i]);
		}
	},
	_getList: function(){
		var list = this.rule().split(" ");
 
		for(var i = 0; i < list.length; i++) {

			for(var j = i + 1; j < list.length; j++) {

				if(list[i] === list[j]) {

					list.splice(j, 1);
					j--;
				}
			}
		}

		return list;
	},
	_getNextChecker: function(){
		var self = this,
			cChecker = self._currentChecker,
			list = self._checkerList,
			next;

		if(cChecker === undefined){
			next = list[0];
		} else if (cChecker === null){
			next = null;
		} else {
			var name = cChecker.name;

			for (var i = 0, l = list.length; i < l; i++) {
				if (list[i] === name) { break; }
			}

			next = list[i + 1];
		}

		if(next){ 
			return self._checkerHash[next] || $.IChecker;
		}

		return null;
	},
	_checkNext: function(){
		var next = this._getNextChecker();

		if(next){
			this._currentChecker = next;
			next.check(this._val, this);
			return true;
		}

		return false;
	},
	result: function(result){

		if(this._isChecked()){ return; }

		if(result){
			if(this._checkNext()){ return; }
		}
		
		this.end(result);
		this._checked();
	},
	next: function(result){
		
		if(this._isChecked()){ return; }

		if(!this._checkNext()){
			this.end(result);
		}
		
		this._checked();
	},
	end: function(result){

		if(this._isChecked()){ return; }

		this._defer.resolve(result);
	},
	_checked: function(){
		var key = this._currentChecker.name;

		this._checkedList[key] = 1;
	},
	_isChecked: function(){
		var key = this._currentChecker.name;

		return !!this._checkedList[key];
	},
	_clearChecked: function(){
		this._checkedList = {};
	}
});


})(this);

