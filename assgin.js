(function($w){

var 
	nv = $w.navigator,
	ua = nv.userAgent,
	pf = nv.platform,
	vd = nv.vendor,
	av = nv.appVersion,
	versionMarker
;

var platform = {
	"Win32": [pf],
	"Mac": [pf],
	"iPhone": [ua],
	"iPad": [ua],
	"Android":[ua],
	"Linux": [pf]
};

var browser = {
	"Chrome": [ua],
	"Safari": [vd, "Apple", "Version"],
	"Opera": [$w.opera, null, "Version"],
	"Firefox": [ua],
	"IE": [ua, "MSIE", "MSIE"],
	"WebKit": [ua],
	"Gecko": [ua, null, "rv"]
};

function ck(data, flag){
	var str, sStr, k;
	
	for (k in data){
		if(data.hasOwnProperty(k)){
			str = String(data[k][0]);
			sStr = data[k][1] || k;
			if(str.indexOf(sStr) >= 0){
				if(flag){
					versionMarker = data[k][2] || k;
				}
				return k;
			}
		}
	}
	return "";
}

function ckVersion( dataString ){
	var index = dataString.indexOf(versionMarker);
	if (index < 0){
		return "";
	}
	return parseFloat(dataString.substring(index + versionMarker.length + 1));
}



$w.OS = {
	name: ck(platform)
};

$w.BS = (function(){
	var name = ck(browser, true),
		version = ckVersion(ua) || ckVersion(av),

		v = {
			name: name,
			version: version || 0,
			isIE: name === "IE",
			isOpera: name === "Opera",
			isChrome: name === "Chrome",
			isSafari: name === "Safari"
		};
			
		v.isWebkit = v.isChrome || v.isSafari || name === "WebKit";
		v.isFirefox = name === "Firefox";
		v.isGecko = v.isFirefox || name === "Gecko";
		v.isIE6 = v.isIE && version === 6.0;
		v.isIE7 = v.isIE && version === 7.0;
		
	return v;
})();

$w.Support = {
	mhtml: BS.isIE && !document.documentMode
}

})(this);


(function($w){

var 
	$d = $w.document
;

if (BS.isIE6){
	try{
		$d.execCommand("BackgroundImageCache", false, true);
	}catch(e){};
}


if ($d.readyState == null && $d.addEventListener){
	$d.readyState = "loading";
	$d.addEventListener("DOMContentLoaded", function(){
		$d.removeEventListener("DOMContentLoaded", arguments.callee, false);
		$d.readyState = "complete";
	},false);
}

})(this);


(function($w){
var 
	AP = Array.prototype,
	DP = Date.prototype,
	SP = String.prototype,
	FP = Function.prototype,
	toString = Object.prototype.toString,
	defaultDateFormat = "yyyy-mm-dd"
;

function getSeparator(format){
	var ary = (/[\/\-]/).exec(format);
	
	return ary ? ary[0] : null;
}

function getDaysOfMonth(year, month){
	return new Date(year, month, 0).getDate();
}

function isInteger(n){
	return parseInt(n, 10) === n;
}

function compareReturn(a, b){
	if(a === b){
		return 0;
	} else if (a > b){
		return 1;
	} else if (a < b){
		return -1;
	} else {
		return null;
	}
}

function checkDateHash(year, month, date){
	if(!isInteger(year) || !isInteger(month) || !isInteger(date) 
		|| year < 1001 || year > 2999
		|| month > 12 || month < 0
		|| date < 0 || date > getDaysOfMonth(year, month)){
		return false;
	}
	return true;
}

function walkStringInTemplate(str, container, debug){
	var ary = str.split("."),
		temp = container, key,
		i = 0, len = ary.length;
	
	for(; i < len; i++){
		key = ary[i];
		if(temp[key] == null){
			if(debug && ( i + 1 ) !== len){
				throw ary.slice(0, i + 1).join(".") + " is undefined !";
			} else {
				return null;
			}
		} else {
			temp = temp[key];
		}
	}
	
	return temp;
}

$w.DateHash = function(year, month, date, check){
	if(!check && !checkDateHash(year, month, date)){
		throw new Error("Arguments error when instantiate DateHash !");
	}
	this._y = year;
	this._m = month;
	this._d = date;
}
DateHash.getDaysOfMonth = getDaysOfMonth;

DateHash.prototype = {
	defaultFormat: "yyyy-mm-dd",
	constructor: DateHash,
	getYear: function(){
		return this._y;
	},
	getMonth: function(){
		return this._m;
	},
	getDate: function(){
		return this._d;
	},
	getDay: function(){
		return this.toDate().getDay();
	},
	setDate: function(n){
		this._d = n;
		this.autoFix();
	},
	toString: function(){
		return this.toDateString();
	},
	toDateString: function(format){
		var f = format || this.defaultFormat;
		return f.replace("yyyy", this._y)
				.replace("mm", this._m)
				.replace("dd", this._d);
	},
	toDate: function(){
		return new Date(this._y, this._m - 1, this._d);
	},
	compare: function(dateHash){
		var self = this;
		
		if(self._y === dateHash._y){
			if(self._m === dateHash._m){
				return compareReturn(self._d, dateHash._d);
			} else {
				return compareReturn(self._m, dateHash._m);
			}
		} else {
			return compareReturn(self._y, dateHash._y);
		}
	},
	addDates: function(n){
		n = parseInt(n);
		if(!n){return;}
		this._d += n;
		this.autoFix();
	},
	autoFix: function(){
		for(;;){
			
			if(this._d <= 0){
				this._m--;
				this._d += getDaysOfMonth(this._y, this._m);
			} else {
				var days = getDaysOfMonth(this._y, this._m);
				if(this._d > days){
					this._d -= days;
					this._m++;
				} else {
					break;
				}
			}
		}
		
		for(;;){
			var ms = 12;
			if(this._m <= 0){
				this._m += ms;
				this._y--;
			} else if(this._m > ms){
				this._m -= ms;
				this._y++;
			} else {
				break;
			}
		}
	}
}


DP.toDateHash = function(){
	var d = this;
	return new DateHash(d.getFullYear(), d.getMonth(), d.getDate());
}

SP.trim = function(){
	var str = this,
		whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
	for (var i = 0,len = str.length; i < len; i++) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(i);
			break;
		}
	}
	for (i = str.length - 1; i >= 0; i--) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}
SP.toRawString = function(){
	var r = ".\/+*?[]{}()^$|";
		r = r.split("").join("\\");
	
	return this.replace(new RegExp("([\\" + r + "])", "g"), "\\$1");
}
SP.toDateHash = function(format){
	format = format ? format.toLowerCase() 
			: defaultDateFormat;
	var 
		self = this,
		separator = getSeparator(format),
		fArr =  format.split(separator),
		sArr = self.split(separator),
		defaultLen = 3,
		hash = {}
	;

	if(fArr.length !== defaultLen || sArr.length !== defaultLen){
		return null;
	}
	
	for(var i = 0; i < defaultLen; i++){
		var k = fArr[i].trim(),
			v = parseInt(sArr[i]);
		if( k === "" || isNaN(v) ){
			return null;
		}
		
		hash[k] = v;
	}
	
	var 
		year = hash["yyyy"],
		month = hash["mm"],
		date = hash["dd"]
	;
	hash = null;
	
	if(!checkDateHash(year, month, date)){
		return null;
	}
	
	
	return new DateHash(year, month, date, true);
}
SP.isDateString = function(format){
	return !!this.toDateHash(format);
}
SP.sprintf = function(obj, debug){
	var temp = this == null ? "" : String(this),
		o = obj || {};
	
	return temp.replace(/\{\$([\w.]+)\}/g, function(s, k){
		var v = walkStringInTemplate(k, o, debug);
		return v == null ? s : v;
	});
}


AP.forEach = function(func, binder){
	var self = this, 
		len = self.length;
	
	for (var i = 0; i < len; i++) {
		if(!self.hasOwnProperty(i)){ continue; } 
		func.call( binder, self[i], i, self );
	}
}
AP.indexOf = function(item, from){
	var self = this,
		len = self.length,
		i = from || 0;
		
	for (; i < len; i++){
		if(!self.hasOwnProperty(i)){ continue; }
		if(item === self[i]){ return i; }
	}
	
	return -1;
}
AP.lastIndexOf = function(item, from){
	var self = this,
		i = self.length;
	
	for (; i-- && (from ? i >= from : true);){
		if(!self.hasOwnProperty(i)){ continue; }
		if(item === self[i]){ return i; }
	}
	
	return -1;
}
AP.every = function(func, binder){
	//func(item, i, self);
	var self = this,
		len = self.length;
		
	for (var i = 0; i < len; i++){
		if(!self.hasOwnProperty(i)){ continue; }
		if(!func.call(binder, self[i], i, self) === true){ 
			return false; 
		}
	}
	
	return true;
}
AP.some = function(func, binder){
	//func(item, i, self);
	var self = this,
		len = self.length;
		
	for (var i = 0; i < len; i++){
		if(!self.hasOwnProperty(i)){ continue; }
		if(!!func.call(binder, self[i], i, self) === true){ 
			return true; 
		}
	}
	
	return false;
}
AP.map = function(func, binder){
	//func(item, i, self);
	var self = this,
		len = self.length,
		returnValue = [];
		
	for (var i = 0; i < len; i++){
		if(!self.hasOwnProperty(i)){ continue; }
		returnValue[returnValue.length] = func.call(binder, self[i], i, self)
	}
	
	return returnValue;
}
AP.filter = function(func, binder){
	//func(item, i, self);
	var self = this,
		len = self.length,
		returnValue = [];
		
	for (var i = 0; i < len; i++){
		if(!self.hasOwnProperty(i)){ continue; }
		if(!!func.call(binder, self[i], i, self) === true){
			returnValue[returnValue.length] = self[i];
		}
	}
	
	return returnValue;
}


FP.bind = function( binder ){
	var ar = AP.slice.call(arguments, 1);
	
	return function(){
		return this.apply(binder, ar.concat(AP.slice.call(arguments, 0)));
	};
}
FP.extend = function(supClass){
	var self = this;
	F.prototype = supClass.prototype;
	self.prototype = new F();
	self.prototype.constructor = self;

	self.superClass = supClass.prototype;
	if(supClass.prototype.constructor === Object.prototype.constructor){
		supClass.prototype.constructor = supClass;
	}
	return self;
}


})(this);






