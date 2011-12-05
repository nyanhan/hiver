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

function isBlank(str){
	return !!$.trim(str);
}

function isDate(str){
	var re = /^([12]\d{3})([\/\-])(\d{1,2})\2(\d{1,2})$/,
		dateList = re.exec(str);
	
	if(!dateList){
		return false;
	}
	
	var y = dateList[1] | 0, 
		m = dateList[3] | 0, 
		d = dateList[4] | 0;
	
	if(m > 12 || m < 1 ||
		d < 1 || d > 31){
		return false;
	}
	
	return new Date(y, m - 1, d).getDate() === d;
}

function isInt(str){
	return parseInt(str, 10).toString() === str;
}

function isNumber(str){
	return parseFloat(str).toString() === str;
}

function isFloat(str){
	return isNumber(str) && !isInt(str);
}

function isChinese(str){
	return (/^[\u4e00-\u9fa5]+$/).test(str);
}

function hasChinese(str){
    return (/[\u4e00-\u9fa5]$/).test(str);
}

/*
 A @ B . C
 A 原则上少做限制，因为各家服务商可能规则不太一样 A-Z a-z 0-9 - _ .
 B 域名规范 A-Z a-z 0-9 开头 后面可以是 A-Z a-z 0-9 _ -
 C 型如 com | com.cn 
 
 考虑每个字段加个长度限制
*/
function isEmail(str){
	return (/^[\w\.\-]+@[a-zA-Z0-9][\w\-]*\.[a-zA-Z]+(\.[a-zA-Z]+)?$/).test(str);
}





var _checkerHash = {},
	RULE_ATTR = "data-V_v_rule",
	RULE_OBJ_KEY = "V_v_rule_object";

$.extend({
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
	},
	group: function(){ }
});

var Rule = function(element, config){
	this._jquery = $(element);
	this._onpass = config.onpass || $.noop;
	this._onerror = config.onerror || $.noop;
}

$.extend(Rule.prototype, {
	rule: function(str){
		if(str){
			this._jquery.attr(RULE_ATTR, str);
		} else {
			return this._jquery.attr(RULE_ATTR);
		}
	},
	check: function(str){
		
	},
	result: function(){
		
	},
	checker_list: function() {
		return this.rule().split(" ");
	},
	next: function(){
		
	},
	end: function(){
		
	}
});

var Checker = function(name, message, checkRule){

	this._name = name;
	this._check = checkRule;
	this._message = message || "";
	this._status = 0;
};

$.extend(Checker.prototype, {
	message: function(str){
		return this._message;
	},
	check: function(str, rule){
		this._check(str, this, rule);
	},
	status: function() {
		return this._status;
	},
	result: function(result) {
		if(result){
			
		}
	}
});

})(this);


(function(window) {
	V_v.checker({
		name: "empty",
		message: "你搞基啊", 
		check: function(str, checker, rule){
			
		}
	});
})(this);
