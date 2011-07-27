(function($w){
	
var 
	CORE = "jQuery",
	VER = "1.5.2", 
	chkVer = function(){
		var v = jQuery.fn.jquery;
		return v >= VER;
	}
;

if(typeof jQuery === "undefined" || !chkVer()){
	throw CORE + "-" + VER + " required.";
}

var $ = jQuery;

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
	
	if(m > 12 || m < 1 
		d < 1 || d > 31){
		return false;
	}
	
	return new Date(y, m - 1, d).getDate() === d;
}

function isInt(str){
	// whether trim blank
	return parseInt(str).toString() === str;
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

$.fn.extend({
	valid_: function(configObject){

	}
});



})(this);



