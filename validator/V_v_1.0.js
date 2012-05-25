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

var $ = $w.jQuery;


var RULE_ATTR = "data-valid_rule",
	RULE_OBJ_KEY = "valid_ruler",
	RULE_EVENT_PERFIX = "each_",
	DEFAULT_CHECKER = "valid_checker_default",
	EVENT_SUFFIX = ".valid_input";

$.extend({
	_checkerHash: {},
	IChecker: {
		name: DEFAULT_CHECKER,
		message: "",
		check: function(str, rule){
			rule.result(true);
		}
	},
	IGroup: {
		each_onchecked: $.noop,
		each_timeout: 0,
		each_ontimeout: $.noop,
		each_onloading: $.noop,
		onchecked: $.noop,
		timeout: 0,
		ontimeout: $.noop,
		onloading: $.noop
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
	validate: function(selector, config){

		return new Group(selector, config);
	}
});




var Group = function(selector, config){
	var self = this;

	self._l = [];
	self._rConf = {};
	self._gConf = {};

	self._init(selector, config);
};

$.extend(Group.prototype, {
	_init: function(selector, config){
		this.map(config);
		this.append(selector);
	},
	map: function(config){

		var self = this;

		config = $.extend({}, $.IGroup, config);

		$.each($.IGroup, function(k, v){
			if (~k.indexOf(RULE_EVENT_PERFIX)) {
				self._rConf[k.replace(RULE_EVENT_PERFIX, "")] = config[k];
			} else {
				self._gConf[k] = config[k];
			}
		});
	},
	append: function(selector){

		var self = this;

		$(selector).each(function(){
			var rule = $.rule(this);

			if(rule){
				rule.destory();	
			}

			$.rule(this, self._rConf);

			self._l.push(this);
		});
	},
	check: function(){
		var self = this;

		self._defer = $.Deferred().done(function(result){
			self._gConf.onchecked(result);
		});

		// filter removed element
		for(var i = 0; i < self._l.length; i++){
			if(!self._isInDOM(self._l[i])){
				self._l.splice(i, 1);
				i-- ;
			}
		}

		$.each(self._l, function(i, item){

			var r = $.rule(item);

			if (r) {
				r.check(function(){ self.result(); });
			}
		});
	},
	result: function(){
		var result = [],
			all = true,
			self = this;

		$.each(self._l, function(i, item){

			var res = $.rule(item).getResult();

			if(res === undefined){
				all = false;
				return false;
			}

			result.push(res);
			
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
		return $.contains($w.document.body, element);
	}
});


var Rule = function(element, config){
	var self = this;

	config = $.extend({}, $.IRule, config);
	self._jquery = $(element);
	self._timer = 0;

	$.each(config, function(k, item){
		self["_" + k] = item;
	});

	self._init(); 
};

$.extend(Rule.prototype, {
	_init: function(){
		var self = this;

		self._checkedList = {};
		self._val = "";
		self._checkerHash = {};
		self._currentChecker = undefined;
		self._message = "";
		self._bindEvents();

	},
	jQ: function(){
		return this._jquery;	
	},
	destory: function(){
		this._jquery.unbind(EVENT_SUFFIX);
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

			self._onchecked(result, self._currentChecker.message);

			self._result = result;
			self._message = self._currentChecker.message || "";

			if (next) { next(); }
		
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
	},
	_bindEvents: function(){

		var self = this;

		function sc(){ self.check(); }

		if(self._jquery[0].oninput === null){
			self._jquery.bind("input" + EVENT_SUFFIX, sc);	
		} else {
			self._intervalCheck(sc);
		}

		self._jquery.bind("focus" + EVENT_SUFFIX, sc)
				.bind("blur" + EVENT_SUFFIX, sc);
	},
	_intervalCheck: function(func){
		
		var self = this,
			data = "";

		self._jquery.bind("focus" + EVENT_SUFFIX, function(){
			self._timer = setInterval(function(){

				var v = self._jquery.val();

				if(data !== v){ func(); data = v; }
				
			}, 100);
		});

		self._jquery.bind("blur" + EVENT_SUFFIX, function(){ clearInterval(self._timer); });
	}
});


})(this);

