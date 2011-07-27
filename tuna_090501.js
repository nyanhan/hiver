/***
 * Tuna JavaScript Library
 * http://www.ctrip.com/
 *
 * Copyright(C) 2008 - 2011, Ctrip All rights reserved.
 *	Version: 090501
 *
 * Date: 2010-1-13
 */
 
var
	_ = window,
	__ = document, 
	___ = __.documentElement,
	Ctrip = { module:{} }, 
	$topWin = _,
	$$ = {}
;

//国内酒店在用， 暂时不能删。
$$.history={};

//检测顶层窗口
(function(){
	try{
		while (true){
			var tmpWin=$topWin.parent;
			if (tmpWin&&tmpWin!=$topWin&&tmpWin.Ctrip){
				$topWin=tmpWin;
			}
			else{ return; }
		}
	}catch(e){}
})();

/**
* from ext-core 3.1.0
*/
$$.browser=(function(ua){
	function check(r){
		return r.test(ua);
	}
	var isOpera = check(/opera/),
	    isChrome = check(/chrome/),
	    isWebKit = check(/webkit/),
	    isSafari = !isChrome && check(/safari/),
	    isIE = !isOpera && check(/msie/),
	    isIE7 = isIE && check(/msie 7/),
	    isIE8 = isIE && check(/msie 8/),
	    isIE6 = isIE && !isIE7 && !isIE8,
	    isGecko = !isWebKit && check(/gecko/),
	    isGecko2 = isGecko && check(/rv:1\.8/),
	    isGecko3 = isGecko && check(/rv:1\.9/);

	return {
		IE: isIE,
		IE6: isIE6,
		IE7: isIE7,
		IE8: isIE8,
		Moz: isGecko,
		FF2: isGecko2,
		Opera: isOpera,
		Safari: isSafari,
		WebKit: isWebKit,
		Chrome: isChrome
	};
})(navigator.userAgent.toLowerCase());

__.write('<div id="jsContainer" class="jsContainer" style="height:0"><textarea id="jsSaveStatus" style="display:none;"></textarea><div id="tuna_alert" style="display:none;position:absolute;z-index:999;overflow:hidden;"></div><div id="tuna_jmpinfo" style="visibility:hidden;position:absolute;z-index:120;"></div><div style="position: absolute;top:0; z-index: 120;display:none" id="tuna_calendar" class="tuna_calendar"></div></div>');

//数组扩展
$extend(Array.prototype, {
	each: function(func){
		for (var i = 0, l = this.length; i < l; i++){
			if ((func?func(this[i],i):this[i]())===false){
				return false;
			}
		}
		return true;
	},
	random: function(){
		if( !this.length ){
			return null;
		}
		return this[Math.floor(Math.random() * this.length)];
	},
	randomize: function(){
		for(var i = 0, n = this.length; i < n; ++i){
			var j = Math.floor(Math.random() * n);
			var t = this[i];
			this[i] = this[j];
			this[j] = t;
		}
		return this;
	},
	map: Array.prototype.map || function(func){
		var arr=[];
		for (var i = 0, l = this.length; i < l; i++){
			arr.push(func(this[i],i));
		}
		return arr;
	},
	indexOf: function(item){
		for(var i = 0, l = this.length; i < l; i++){
			if( this[i] === item ) {
				return i;
			}
		}
		return -1;
	},
	remove: function(item){
		var i = this.indexOf(item);
		if( i >=0 ){
			this.splice(i, 1);
		}
	}
});

//数值扩展
$extend(Number.prototype, {
	parseCur: function(decimalDigits){
		var num=this.toFixed(decimalDigits||2),re=/(\d)(\d{3}[,\.])/;
		while(re.test(num)){
			num=num.replace(re,"$1,$2");
		}
		num=num.replace(/^(-?)\./,"$10.");
		return decimalDigits === 0 ? num.replace(/\..*$/, "") : num;
	}
});

//字符串扩展
$extend(String.prototype, {
	replaceWith: function(obj){
		return this.replace(/\{\$(\w+)\}/g,function(s,k){
			return k in obj ? obj[k] : s;
		});
	},
	trim: function(){
		return this.replace(/^\s+|\s+$/g,'');
	},
	isEmail: function(){
		var re=/^[^@\s]+@[^@\.\s]+(\.[^@\.\s]+)+$/;
		return re.test(this);
	},
	isDateTime: function(defVal){
		var date=defVal===false?this:this.parseStdDate(false);
		if (!date){
			return false;
		}
		var arr=date.match(/^((19|20)\d{2})-(\d{1,2})-(\d{1,2})$/);
		if (!arr){
			return false;
		}
		for (var i=1;i<5;i++){
			arr[i]=parseInt(arr[i],10);
		}
		if(arr[3]<1||arr[3]>12||arr[4]<1||arr[4]>31) {
			return false;
		}
		var _t_date=new Date(arr[1],arr[3]-1,arr[4]);
		return _t_date.getDate()==arr[4]?_t_date:null;
	},
	toReString: function(){
		return this.replace(/([\.\\\/\+\*\?\[\]\{\}\(\)\^\$\|])/g,"\\$1");
	},
	//判断身份证号码是否有效
	isChinaIDCard: function(){
		var num=this.toLowerCase().match(/\w/g);
		if (this.match(/^\d{17}[\dx]$/i)){
			var sum=0,times=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
			for (var i=0;i<17;i++)
				sum+=parseInt(num[i],10)*times[i];
			if ("10x98765432".charAt(sum%11)!=num[17]){
				return false;
			}
			return !!this.replace(/^\d{6}(\d{4})(\d{2})(\d{2}).+$/,"$1-$2-$3").isDateTime();
		}
		if (this.match(/^\d{15}$/)){
			return !!this.replace(/^\d{6}(\d{2})(\d{2})(\d{2}).+$/,"19$1-$2-$3").isDateTime();
		}
		return false;
	},
	parseStdDate: function(defVal){
		var month="January|1@February|2@March|3@April|4@May|5@June|6@July|7@August|8@September|9@October|10@November|11@December|12";
		var re=this.replace(/[ \-,\.\/]+/g,"-").replace(/(^|-)0+(?=\d+)/g,"$1");
		if ($$.status.version=="en")
			re=re.replace(/[a-z]{3,}/i,function(re){
				return (_t_re=month.match(new RegExp("(^|@)"+re+"[^\\|]*\\|(\\d+)","i")))?_t_re[2]:re;
			});
		re=re.replace(/^([^-]{1,2}-[^-]{1,2})-([^-]{4})$/,"$2-$1");
		return defVal===false||re.isDateTime(false)?re:null;
	},
	parseEngDate: function(){
		var std=this.parseStdDate();
		if (!std) return null;
		var re=std.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
		return "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec".split("|")[parseInt(re[2])-1] +"-"+re[3]+"-"+re[1];
	}
});

//日期扩展
$extend(Date.prototype, {
	dateValue: function(){
		return new Date(this.getFullYear(),this.getMonth(),this.getDate());
	},
	addDate: function(day){
		return new Date(this.getFullYear(),this.getMonth(),this.getDate()+day);
	},
	toStdString: function(){
		return this.getFullYear()+"-"+(this.getMonth()+1)+"-"+this.getDate();
	},
	toEngString: function(){
		return "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec".split("|")[this.getMonth()] +"-"+this.getDate()+"-"+this.getFullYear();
	}
});

//函数扩展
$extend(Function.prototype, {
	bind:  function(obj){
		var fn = this;
		var ar = [].slice.call(arguments, 1);
		return function(){
			return fn.apply(obj, ar.concat([].slice.call(arguments, 0)));
		};
	},
	pass:  function(){
		var ar = [].slice.call(arguments, 0);
		ar.unshift(null);
		return this.bind.apply(this, ar);
	},
	delay:  function(n){
		return setTimeout(this, n);
	}
});

function $isEmptyObj(v){
	for ( var name in v ) {
		return false;
	}
	return true;
}

function $doNothing(){}

function $isUndefined(o){
	return typeof o === "undefined";
}

function $type(obj){
	if( obj === null ){
		return "null";
	}
	else{
		var t = Object.prototype.toString.call( obj ).slice( 8, -1 );
		return "Array Boolean Date RegExp String Number Function".indexOf(t) >= 0 
			? t.toLowerCase() : typeof obj;
	}
}

//全局状态
$$.status=new function(){
	this.domReady=false;
	this.load=false;
	this.busy=0;
	this.regEventCount=0;
	this.regEventHash={};
	this.charset=(((_.__.charset?_.__.charset:_.__.characterSet)||"")
		.match(/^(gb2312|big5|utf-8)$/gi)||"gb2312").toString().toLowerCase();
	this.version={
		"gb2312":"zh-cn",
		"big5":"zh-tw",
		"utf-8":"en"
	}[this.charset];
	this.alertDiv=_.__.getElementById("tuna_alert");
	this.container=_.__.getElementById("jsContainer");
	this.saveStatus=_.__.getElementById("jsSaveStatus");
	this.back=false;
	this.pageValue={data:{}};
	this.globalValue={};
	this.today=new Date().toStdString();
};

//模块变量
$$.module={
	iframe:[],
	list:{},
	tab:{},
	selectAll:{},
	address:{
		source:{}
	},
	calendar:{},
	init:[]
};

//模块字符串
$$.string={
	"zh-cn":{
		display:"@▲|▼@显示|隐藏@"
	},
	"zh-tw":{
		display:"@▲|▼@顯示|隱藏@"
	},
	"en":{
		display:"@Show|Hidden@"
	}
}[$$.status.version];

//扩展
function $extend(a){
	for(var i = 1; i < arguments.length; i ++){
		var b = arguments[i];
		for(var s in b) if(b.hasOwnProperty(s)) a[s] = b[s];
	}
	return a;
}

//合并
function $merge(){
	return $extend.apply(null, [{}].concat([].slice.call(arguments, 0)));
}

//获取hash键数组
function $keys(obj, full){
	var ret = [];
	for(var s in obj) if(full || obj.hasOwnProperty(s)) ret.push(s);
	return ret;
}

//获取hash值数组
function $values(obj, full){
	var ret = [];
	for(var s in obj) if(full || obj.hasOwnProperty(s)) ret.push(obj[s]);
	return ret;
}

//获取hash键值对数组
function $items(obj, full){
	var ret = [];
	for(var s in obj) if(full || obj.hasOwnProperty(s)) ret.push([s, obj[s]]);
	return ret;
}

//类
function $class(props, f0){
	var me = arguments.callee;
	var f1 = function(){};
	if(f0){
		f1.prototype = new f0();
		f1.prototype.constructor = f0;
	}
	var f2 = function(){
		var caller = arguments.callee.caller;
		if(caller == me || caller == f2.create) return;
		if(this.initialize) this.initialize.apply(this, arguments);
	};
	f2.prototype = new f1();
	$extend(f2.prototype, props || {}, {
		constructor: f2,
		proto: f2.prototype,
		base: f1.prototype
	});
	$extend(f2, {
		create: function(a){
			var o = new f2();
			if(o.initialize) o.initialize.apply(o, a);
			return o;
		},
		subclass: function(props){
			return me(props, f2);
		},
		implement: function(x, y){
			if($type(x) == 'string'){
				f2.prototype[x] = y;
			}else{
				[].slice.call(arguments).each(function(o){
					if($type(o) == 'function') o = new o();
					$items(o, true).each(function(a){f2.prototype[a[0]] = a[1]});
				});
			}
		}
	});
	return f2;
}

function $viewSize( elem ){
	var doc = elem.ownerDocument || document,
		win = doc.parentWindow || doc.defaultView,
		docEl = doc.documentElement;
		
	return {
		scrollLeft: win.pageXOffset || docEl.scrollLeft || doc.body.scrollLeft || 0,
		scrollTop: win.pageYOffset || docEl.scrollTop || doc.body.scrollTop || 0,
		
		clientTop: docEl.clientTop || 0,
		clientLeft: docEl.clientLeft || 0
	};
}

//获取页面尺寸
function $pageSize(maskType){
	var ret = {
		docWidth: ___.scrollWidth,
		docHeight: ___.scrollHeight,
		
		winWidth: ___.clientWidth,
		winHeight: ___.clientHeight,
		
		scrollLeft: $$.browser.WebKit ? __.body.scrollLeft : ___.scrollLeft,
		scrollTop: $$.browser.WebKit ? __.body.scrollTop : ___.scrollTop
	};
	if($$.browser.WebKit){
		var st = ___.$getStyle();
		ret.docWidth += parseInt(st.marginLeft) + parseInt(st.marginRight);
		ret.docHeight += parseInt(st.marginTop) + parseInt(st.marginBottom);
	}
	
	ret.docWidth = Math.max(ret.docWidth,ret.winWidth);
	ret.docHeight = Math.max(ret.docHeight,ret.winHeight);
	
	if(maskType){
		var sm = maskType == 'win',
			zoom = $$.support.testIEZoom();
		ret.left = sm ? ret.scrollLeft : 0;
		ret.top = sm ? ret.scrollTop : 0;
		if($$.browser.Moz){
			var st = ___.$getStyle();
			ret.left -= parseInt(st.borderLeftWidth) + parseInt(st.marginLeft);
			ret.top -= parseInt(st.borderTopWidth) + parseInt(st.marginTop);
		}
		ret.width = sm ? Math.round(ret.winWidth/zoom) : Math.max(ret.docWidth, ret.winWidth);
		ret.height = sm ? Math.round(ret.winHeight/zoom) : Math.max(ret.docHeight, ret.winHeight);
	}
	
	return ret;
}

//页面动画
function $animate(target, props, config){
	if(!target || !target.style) return;
	target = target.style;
	
	var config = $extend({
		fps: 40,
		duration: 400,
		callback: function(){},
		reverse: false,
		fn: function(x){return Math.sin(x * Math.PI / 2)}
	}, config || {});
	
	var flds = $keys(props);
	var units = flds.map(function(f){
		return /(width|height|left|top)\b/i.test(f) ? 'px' : '';
	});
	var start = new Date();
	var ani = function(){
		var d = new Date() - start;
		if(d > config.duration) d = config.duration;
		for(var j = 0; j < flds.length; j ++){
			var f = props[flds[j]];
			var x = config.fn(d / config.duration);
			var n = config.reverse ? f[1] + (f[0] - f[1]) * x : f[0] + (f[1] - f[0]) * x;
			if(units[j] == 'px') n = Math.round(n);
			target[flds[j]] = n + units[j];
		}
		if(d == config.duration){
			clearInterval(timer);
			if(config.callback) setTimeout(config.callback, Math.round(1000 / config.fps));
		}
	};
	var timer = setInterval(ani, Math.round(1000 / config.fps));
	
	ani();
	return timer;
}

//多元素动画
/*
$animate2([
[elA.style, {
	width: [10, 200, 'px'],
	height: [20, 200, 'px']
}],[elB, {
	scrollLeft: [0, 10, 0],
	scrollTop: [50, 10, 0]
}]
], {duration: 1000})
*/
function $animate2(x, j) {
	var j = $merge({
		fps:40,
		duration:400,
		callback:function () {},
		reverse:false,
		fn:function (a) {return Math.sin(a * Math.PI / 2);}
	}, j || {});
	var m = new Date;
	var s = function () {
		var a = new Date - m;
		if (a > j.duration) a = j.duration;
		var y = j.fn(a / j.duration);
		for (var c = 0; c < x.length; c++) {
			var o = x[c][0];
			var b = x[c][1];
			for(var f in b){
				var d = b[f];
				var g = j.reverse ? d[1] + (d[0] - d[1]) * y : d[0] + (d[1] - d[0]) * y;
				if(d[2] == 'px' || d[3]) g = Math.round(g);
				o[f] = g + d[2];
			}
		}
		if (a == j.duration) {
			clearInterval(q);
			if (j.callback) setTimeout(j.callback, Math.round(1000 / j.fps));
		}
		return arguments.callee;
	};
	var q = setInterval(s(), Math.round(1000 / j.fps));
	return q;
}

//修正事件对象
function $fixE(e){
	e = _.event || e;
	
	if ( !e.target ) {
		e.target = e.srcElement || __;
	}
	
	if ( e.target.nodeType === 3 ) {
		e.target = e.target.parentNode;
	}
	
	if ( !e.relatedTarget && e.fromElement ) {
		e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
	}
	
	if ( e.pageX == null && e.clientX != null ) {
		var body = __.body;
		e.pageX = e.clientX + (___ && ___.scrollLeft || body && body.scrollLeft || 0) -
			(___ && ___.clientLeft || body && body.clientLeft || 0);
		e.pageY = e.clientY + (___ && ___.scrollTop  || body && body.scrollTop  || 0) -
			(___ && ___.clientTop  || body && body.clientTop  || 0);
	}
	
	e.$target = $(e.target);
	
	return e;
}

//阻止默认事件，阻止冒泡
function $stopEvent(e,flag){
	e=$fixE(e);
	flag=flag||0;
	if (flag>=0) e.preventDefault?e.stopPropagation():(e.cancelBubble=true);
	if (flag!=0) e.preventDefault?e.preventDefault():(e.returnValue=false);
}

//获得随机id
function $getUid(){
	return "uid_"+(new Date()).getTime()+Math.random().toString().substr(2,5);
}

var $contains = __.compareDocumentPosition ? function(a, b){
	return a == b || !!(a.compareDocumentPosition(b) & 16);
} : function(a, b){
	return (a.contains ? a.contains(b) : true);
};

//创建dom节点
function $c(tag){
	if (tag.constructor==Array) return $(__.createTextNode(tag.join("\n")));
	else return $(__.createElement(tag));
}
var $createElement=$c;

//变量转换为json字符串
function $toJson(variable){
	if(variable === null) return 'null';
	if ( $isUndefined(variable) ) return 'undefined';
	switch (variable.constructor){
		case Object:
			var arr=[],value;
			for (var name in variable)
				arr.push($toJson(name)+":"+$toJson(variable[name]));
			return "{"+arr.join(",")+"}";
		case Array:
			return "["+variable.map(function(em){
				return $toJson(em);
			}).join(",")+"]";
		case String:
			return "\""+variable.replace(/([\n\r\\\/\'\"])/g,function(a){
				return {"\n":"\\n","\r":"\\r"}[a]||"\\"+a;
			})+"\"";
		case Date:
			return "new Date("+variable.getTime()+")";
		case Number:
		case Boolean:
		case Function:
		case RegExp:
			return variable.toString();
		default:
			return "null";
	}
}

//json字符串转换为变量
function $fromJson(str){
	var variable;
	try {
		variable=eval("("+str+")");
	} catch(e){};
	return variable;
}

//页面变量
function $pageValue(){
	return $pageValue.get.apply(_,arguments);
}

//保存页面变量
$pageValue.set=function(name,value){
	$$.status.pageValue.data[name]=value;
	if ($$.browser.Opera)
		$savePageValue();
};

//获取页面变量
$pageValue.get=function(name){
	var hash=$$.status.pageValue.data;
	return hash&&name in hash?hash[name]:null;
};

//删除页面变量
$pageValue.del=function(name){
	delete $$.status.pageValue.data[name];
	if ($$.browser.Opera)
		$savePageValue();
};

//保存pageValue
function $savePageValue(){
	$$.status.saveStatus.value=$toJson($$.status.pageValue);
}

//跨页面变量
function $globalValue(){}

//获取get参数
function $getQuery(name){
	var query=(location.search||"").match(new RegExp("[\\?&]"+name+"=([^&]+)","i"));
	return query?unescape(query[1]):null;
}

//动态加载js
function $loadJs(url, charset, callback, timeout) {
	var me = arguments.callee;
	var queue = me.queue || (me.queue = {});
	var timer = null;
	if(!(url in queue)){
		queue[url] = [];
		if(callback){
			timer = setTimer();
			queue[url].push(callback);
		}
	}else{
		if(callback){
			if(queue[url]){
				timer = setTimer();
				queue[url].push(callback);
			}else{
				callback();
			}
		}
		return;
	}
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.charset = charset || $$.status.charset;
	script.onload = script.onreadystatechange = function(){
		if(script.readyState && script.readyState!= 'loaded' && script.readyState != 'complete') return;
		if(timer) clearTimeout(timer);
		script.onreadystatechange = script.onload = null;
		while(queue[url].length) queue[url].shift()();
		queue[url] = null;
	};
	script.src = url;
	__.getElementsByTagName('head')[0].appendChild(script);
	
	function setTimer(){
		var arr = queue[url];
		var pos = arr.length;
		if(callback && timeout){
			return setTimeout(function(){
				if(callback(true) !== true) arr.splice(pos, 1);
			}, timeout);
		}
	}
}

//动态加载css
function $loadCss(file,charset){
	if ($$.browser.IE)
		__.createStyleSheet(file).charset=charset||_.$$.status.charset;
	else{
		var css=_.__.createElement("link");
		with (css){
			type="text\/css";
			rel="stylesheet";
			href=file;
		}
		__.$("head")[0].appendChild(css);
	}
}

//页面cookie
$$.cookie={}; //expires domain path

function $delCookie(name,subKey){
	if (subKey){
		var orginalValue=$getCookie(name,false);
		if (orginalValue===null)
			return;
		orginalValue=orginalValue.replace(new RegExp("(^|&)\\s*"+encodeURIComponent(subKey)+"=[^&]+"),"").replace(/^\s*&/,"");
		if (orginalValue){
			__.cookie=encodeURIComponent(name)+"="+orginalValue;
			return;
		}
	}
	var expires=new Date();
	expires.setTime(expires.getTime()-1);
	__.cookie=encodeURIComponent(name)+"=;expires="+expires.toGMTString();
}

function $setCookie(name,subKey,value){
	if (!value){
		value=subKey;
		subKey=null;
	}
	var extInfo=($$.cookie.domain?"; domain="+$$.cookie.domain:"")+"; path="+($$.cookie.path||"/")+($$.cookie.expires?"; expires="+new Date((new Date()).getTime()+$$.cookie.expires*3600000).toGMTString():"");
	if (subKey){
		var orginalValue=$getCookie(name,false)||"";
		if (orginalValue)
			orginalValue=(orginalValue+"&").replace(new RegExp("(^|&)\\s*"+encodeURIComponent(subKey)+"=[^&]+&"),"$1");
		__.cookie=encodeURIComponent(name)+"="+orginalValue+encodeURIComponent(subKey)+"="+encodeURIComponent(value)+extInfo;
	}else
		__.cookie=encodeURIComponent(name)+"="+encodeURIComponent(value)+extInfo;
}

function $getCookie(name,subkey){
	var arr=__.cookie.match(new RegExp("(?:^|;)\\s*"+encodeURIComponent(name)+"=([^;]+)"));
	if (subkey===false)
		return arr?arr[1]:null;
	if (arr&&subkey)
		arr=arr[1].match(new RegExp("(?:^|&)\\s*"+encodeURIComponent(subkey)+"=([^&]+)"));
	return arr?decodeURIComponent(arr[1]):null;
}

//正则加载模块
function $parserRe(obj){
	var objList=[];
	var re_mod=/<[^>]+\smod=[\'\"]?([\w|]+)[^>]+/g;
	var re_id=/\sid=[\'\"]?([^\s>\'\"]+)/i;
	var pa=null;
	var id=null;
	var el=null;
	(obj&&obj.innerHTML?obj:__.body).innerHTML.replace(re_mod,function(tag,mod){
		try{
			if(mod.toLowerCase()==="jmpinfo"){}
			else if((id=tag.match(re_id))&&(el=$(id[1]))){
				if(mod in Ctrip.module)
					new Ctrip.module[mod](el);
				else
					objList.push(el)
			}
		}catch(e){
			$t("parserRe Error", [func, obj]);
		};
		return "";
	});
	var clock=setInterval(function(){
		var obj=objList.shift();
		if (obj)
			$topWin.$d(obj);
		else
			clearInterval(clock);
	},50);
}

//加载模块
function $d(obj){
	($(obj).getAttribute("mod")||"").replace(/\w+/ig,function(mod){
		if (Ctrip.module[mod]){
			new Ctrip.module[mod](obj);
		}else{
			$t("No module Error", [mod, obj]);
		}
	});
}
var $dealElement=$d;

function $t(e, finder){
	if( typeof console === "undefined" ) { return };
	
	var mes = typeof e === "string" ? 
		e : e.message;
	
	console.error(mes, finder);
}

function $console(){
 	$loadJs("http://webresource.ctrip.com/code/js/tools/firebug-lite.js#startOpened");
}

/** Adapt from jquery-1.4.4.js
* <embed> <applet> and <object> not for flash has some problem,
* So don't use them.
* And I don't judge for rarely used.
* notice: expando will be clone when cloneNode, so be carefull!!
*/

$$.access = {

	cache: {},

	uuid: 0,

	expando: "Tuna" + new Date() * 1
};

var $data = (function(D){
	return {
		set: function(elem, name, data){
			var key = elem[ D.expando ];
			var type = $type(name);
			
			if(!key){
				elem[ D.expando ] = key = ++D.uuid;
				D.cache[ key ] = {};
			}
			
			if(type === "object"){
				$extend(D.cache[ key ], name);
			}
			else if(type === "string"){
				D.cache[ key ][ name ] = ( data == null ) ? null : data;
			}
			else{
				return false;
			}
			
			return true;
		},
		get: function(elem, name){
			var key = elem[ D.expando ];
			
			if(!key)
				return null;
				
			var tmp = D.cache[ key ];
			
			return $isUndefined(name) ? tmp : tmp[ name ];
		},
		remove: function(elem, name){
			var key = elem[ D.expando ];
			
			if( key ){
				var tmp = D.cache[ key ];
				
				if( !$isUndefined(name) ){					
					delete tmp[ name ];
				}
				else{
					delete tmp;
					D.cache[ key ] = {};
				}
			}
			
			return true;
		}
	};
})($$.access);


//修复元素
function $fixElement(obj){
	function addEvent(el,evt,fn){
		if('attachEvent' in el)
			el.attachEvent('on'+evt,fn);
		else
			el.addEventListener(evt,fn);
	}
	function firstInput(el){
		el=el.getElementsByTagName('input');
		for(var i=0;i<el.length;i++)
			if(/checkbox|radio/.test(el[i].type))
				return el[i];
		return null;
	}
	function srcElement(e){
		if(!e)
			e=_.event;
		return e.srcElement||e.target;
	}
	function mover(lbl){
		var box=lbl._for;
		if(box){
			lbl.htmlFor=box.id||(box.id=$getUid());
			lbl._for=null;
		}
		var sty=lbl.style;
		sty.borderBottom='#aaa 1px dashed';
		sty.paddingBottom='0px';
		sty.color='#1E1A75';
	}
	function mout(lbl){
		var sty=lbl.style;
		sty.borderBottom='';
		sty.paddingBottom='';
		sty.color='';
	}
	obj=obj&&obj.nodeType?obj:_.__;
	if ($$.browser.IE6){
		var label=obj.getElementsByTagName("label");
		for (i=0;i<label.length;i++){
			var el=firstInput(label[i]);
			if(el&&/checkbox|radio/.test(el.type))(function(lbl,box){
				lbl._for=box;
				addEvent(lbl,'mouseover',function(){mover(lbl)});
				addEvent(lbl,'mouseout',function(){mout(lbl)});
			})(label[i],el);
		}
	}
	if ($$.browser.IE){
		var select=obj.getElementsByTagName("select");
		for (i=0;i<select.length;i++)
			select[i].onmousewheel=function(){
				return false;
			};
	}
}

//移除
function $removeTextNode(parent){
	if (!parent)
		return;
	var obj=parent.firstChild,objTmp;
	while (obj){
		objTmp=obj.nextSibling;
		if (obj.nodeType==3){
			if (!obj.nodeValue.trim())
				parent.removeChild(obj);
		}else
			$removeTextNode(obj);
		obj=objTmp;
	}
	return parent;
}

function $ajax(url,content,callback){
	var xmlVer=["MSXML2.XMLHTTP","Microsoft.XMLHTTP"],xmlObj;
	try {
		xmlObj=new XMLHttpRequest();
	} catch(e) {
		for (var i=0;i<xmlVer.length;i++)
			try {
				xmlObj=new ActiveXObject(xmlVer[i]);
				break;
			} catch(e) {}
	}
	if (!xmlObj)
		return;
	xmlObj.open(content?"POST":"GET",url||location.href,!!callback);
	xmlObj.setRequestHeader("Content-Type","application\/x-www-form-urlencoded");
	xmlObj.setRequestHeader("If-Modified-Since",new Date(0));
	function getReturnValue(){
		return (xmlObj.status==200?(/xml/i.test(xmlObj.getResponseHeader("content-type"))?xmlObj.responseXML:xmlObj.responseText):null);
	}
	if (callback)
		xmlObj.onreadystatechange=function(){
			if (xmlObj.readyState==4){
				var txt=getReturnValue();
				if (callback(txt)===true){
					setTimeout(function(){
						$ajax(url,content,callback);
					},1000);
				}
			}
		};
	xmlObj.send(content||"");
	return callback?xmlObj:getReturnValue();
}

//校验提示
function $alert(obj,info,showDisplay,direction1,direction2){
	obj=$(obj);
	var alertInfo=$("alertInfo"),alertTable=$("alertTable"),flag=1;
	alertInfo.innerHTML=info;
	$topWin.$$.status.alertDiv.style.display="";
	$topWin.$$.status.alertDiv.$setPos(obj,direction1||"tl",direction2||"tr");
	$topWin.$$.status.alertDiv.$setIframe();
	obj.className+=" pubGlobal_checkinfo_input01";
	if (showDisplay!==false)
		obj.$setDisplay();
	function clearAlertDiv(){
		obj.className=obj.className.replace("pubGlobal_checkinfo_input01","");
		$topWin.$$.status.alertDiv.style.display="none";
		$topWin.$$.status.alertDiv.$clearIframe();
		obj.$ur("onblur",clearAlertDiv);
		__.body.$ur("onmousedown",clearAlertDiv);
		obj.clearAlert=null;
		$alert.element=null;
	}
	if (obj.disabled)
		flag=0;
	else
		setTimeout(function(){
			try{obj.focus();}
			catch(e){flag=0;};
		},0);
	if (flag)
		obj.$r("onblur",clearAlertDiv);
	else
		__.body.$r("onmousedown",clearAlertDiv);
	$alert.element=obj;
	obj.clearAlert=clearAlertDiv;
}

//从Object生成查询字符串
function $toQuery(obj, fn){
	var ar = [];
	for(var s in obj) if(obj.hasOwnProperty(s)) ar.push([s, fn ? fn(obj[s]) : obj[s]].join('='));
	return ar.join('&');
}

//从查询字符串生成Object
function $fromQuery(str, fn){
	var ar = str.split('&');
	var ret = {};
	for(var i = 0; i < ar.length; i ++){
		var t = ar[i].split('=');
		if(t.length > 1) ret[t[0]] = fn ? fn(t.slice(1).join('=')) : t.slice(1).join('=');
	}
	return ret;
}

//发送事件信息到uiServer2
function $trackEvent(category, action, label, value){
	var cnt = (arguments.callee._cnt || (arguments.callee._cnt = {tuna_total: 0, other_total: 0}));

	if(cnt.other_total >= 80) return;
	++cnt.other_total;
	
	var url = [
		'http://www.',
		/\.ctrip\.com$/.test(document.domain)? 'ctrip': 'dev.sh.ctriptravel',
		'.com/rp/uiServer2.asp'
	].join('');
	
	var query = $toQuery({
		'action': 'event',
		'p': window.UIMonitor2 && window.UIMonitor2.bi && window.UIMonitor2.bi.pageview_id || '',
		'u': document.URL,
		'c': category,
		'l': label,
		'a': action,
		'v': value,
		't': new Date * 1
	}, function(x){return encodeURIComponent(escape(x))});
	
	new Image().src = url + '?' + query;
}

//取tuna版本
function $tunaVersion(){
	var me = arguments.callee;
	if(!me._val){
		me._val = -1;
		for(var st = document.getElementsByTagName('script'), i = st.length - 1; i >= 0; i--){
			var m = st[i].src.match(/\/tuna_(\d+).js$/i);
			if(m){
				me._val = parseInt('20' + m[1]);
				me._offline = /\/webresint\.sh\.ctriptravel\.com\//i.test(st[i].src);
				me._english = /\/webresource\.english\.ctrip\.com\//i.test(st[i].src);
				break;
			}
		}
	}
	return me._val;
}
//是否为online环境
function $isOnline(){
	$tunaVersion();
	return !$tunaVersion._offline && !$tunaVersion._english;
}
//选择正确的webresource服务器, 构造url
function $webresourceUrl(url){
	$tunaVersion();
	var h = ['ource.ctrip', 'ource.english.ctrip', 'int.sh.ctriptravel'];
	var i = $tunaVersion._offline ? 2 : $tunaVersion._english ? 1 : 0;
	return 'http://webres' + h[i] + '.com' + url;
}
//选择正确的pic服务器, 构造url
function $picUrl(url){
	$tunaVersion();
	var h = ['.ctrip', '.english.ctrip', 'int.sh.ctriptravel'];
	var i = $tunaVersion._offline ? 2 : $tunaVersion._english ? 1 : 0;
	return 'http://pic' + h[i] + '.com' + url;
}

//DOM节点扩展
var DOM=function(){
	if ( !this || this.nodeType === 3 || this.$ ) 
		return this;
	this.module={};
	this.module.event={};
	function execEvent(obj){
		return function(e){
			e=$fixE(e);
			var eventInfoList=obj.module.event[e.type], val;
			for (var i=0;i<eventInfoList.length;i++){
				if (eventInfoList[i].enabled){
					try{
						val=eventInfoList[i].func.call(obj,e);
						if (val === false)	break;
					}catch(ex){
						$t(ex, [eventInfoList[i].func, obj]);
					};
				}else{
					eventInfoList.splice(i, 1);
					i--;
				}
			}
			return val;
		}
	}
	function viewSize(){
		var r = $pageSize('win');
		r.right = r.left + r.width;
		r.bottom = r.top + r.height;
		return r;
	}
	var tc_re = /^[\.#]?[^\.#]+/;
	
	function filterByClass(list, cls){
		var li = [];
		for(var i = 0, l = list.length; i < l; i++){
			if( hasClass(list[i], cls) )
				li[li.length] = list[i];
		}
		return li;
	}
	
	function hasClass(elem, cls){
		var className = " " + cls + " ";
		if ( (" " + elem.className + " ").replace(/[\n\t]/g, " ")
			.indexOf( className ) > -1 ) {
			return true;
		}
		return false;
	}
	if (this.__)
		this.$=function(objId,flag){
			if (typeof objId=="object")
				return DOM.apply(objId);
			var obj;
			if (flag){
				var arr=___.innerHTML.match(new RegExp("\\sid=([\\\'\\\"]?)([\\w$]+?[_$]"+objId.toReString()+")\\1"),"g");
				if (arr){
					for (var i=0;i<arr.length;i++){
						obj=$(arr[i]);
						if (obj)
							return obj;
					}
				}
				return $(objId);
			}else
				obj=__.getElementById(objId);
			return obj?$(obj):null;
		};
	else
		this.$=function(objTag){
			var obj=this.getElementsByTagName(objTag);
			obj.$each=function(func){
				var flag;
				if ( !$isUndefined(obj.length) ){
					for (var i=0;i<obj.length&&(flag=func.call(this,obj[i],i))!==false;i++);
				}
				else func.call(this,obj,0);
				return flag===false?0:1;
			};
			for (var i=0;i<obj.length;i++) $(obj[i]);
			return obj;
		};
	if (this.nodeType==1){
		if (this.tagName=="INPUT"&&/^(text|hidden)$/i.test(this.type)||this.tagName=="TEXTAREA")
			this.isNull=function(){
				return !this.value.trim();
			};
		if (/^SELECT$/.test(this.tagName))
			this.$setValue=function(value){
				for (var i=0;i<this.options.length;i++){
					if (this.options[i].value==value){
						this.selectedIndex=i;
						return true;
					}
				}
				return false;
			};
	}
	if (!this.hasAttribute)
		this.hasAttribute=function(str){
			return !$isUndefined( this.attributes[str] );
		};
	this.$parentNode=function(str){
		var obj=$(this.parentNode);
		if (str&&obj&&obj.tagName&&obj.tagName.toLowerCase()!=str.toLowerCase())
			obj=obj.$parentNode(str);
		return obj&&obj.tagName?obj:null;
	};
	this.$firstChild=function(){
		return $(this.firstChild);
	};
	this.$lastChild=function(){
		return $(this.lastChild);
	};
	this.$childNodes=function(){
		var obj=this.childNodes;
		for (var i=0;i<obj.length;i++)
			$(obj[i]);
		return obj;
	};
	this.$nSib=this.$nextSibling=function(){
		return $(this.nextSibling);
	};
	this.$pSib=this.$previousSibling=function(){
		return $(this.previousSibling);
	};
	this.$click=function(){
		if (this.click)
			this.click();
		else{
			var evt=__.createEvent("MouseEvents");
			evt.initMouseEvent("click",true,true,_,0,0,0,0,0,false,false,false,false,0,this);
			this.dispatchEvent(evt);
		}
	};
	this.$getStyle=function(style){
		var css=this.currentStyle||_.getComputedStyle(this,null);
		return style?css[style]:css;
	};
	this.$getPara=function(){
		var _t_para,para=(_t_para=this.getAttribute(arguments[0])||"").split(_t_para.indexOf("")>-1?"":"|");
		for (var i=0;i<Math.max(arguments.length-1,para.length);i++)
			para[i]=para[i]||arguments[i+1]||"";
		return para;
	};
	this.$r=this.$regEvent=function(eventList,funcList,hash,level){
		//eventList,funcList,hash,level
		//eventList,funcList,level
		level=level||50;
		if (arguments.length==3&&typeof hash=="number"){
			level=hash;
			hash=null;
		}
		var obj=this;
		if (eventList.constructor!=Array) eventList=[eventList];
		if (funcList.constructor!=Array) funcList=[funcList];
		eventList.each(function(e){
			funcList.each(function(f){
				e=e.replace(/^(on)?/i,"");
				e=e=="DOMContentLoaded"?"domready":e.toLowerCase();;
				if (e=="domready")
					obj=_;
				var eventInfo={
					enabled:true,
					obj:obj,
					event:e,
					func:f,
					hash:hash,
					level:level,
					id:_.$$.status.regEventCount++
				};
				if (e=="domready"&&$$.status.domReady||e=="load"&&(obj==_||obj==__.body)&&$$.status.load)
					f();
				else{
					if (!(e in obj.module.event)){
						obj.module.event[e]=[];
						if (obj.attachEvent) obj.attachEvent("on"+e,execEvent(obj));
						else obj.addEventListener(e,execEvent(obj),false);
					}
					obj.module.event[e].push(eventInfo);
					obj.module.event[e].sort(function(a,b){
						return (a.level-b.level)||(a.id-b.id);
					});
				}
				if (hash){
					if (!(hash in $$.status.regEventHash))
						$$.status.regEventHash[hash]=[];
					$$.status.regEventHash[hash].push(eventInfo);
				}
			});
		});
	};
	this.$ur=this.$unregEvent=function(eventList,funcList,hash){
		var obj=this;
		if (eventList.constructor!=Array) eventList=[eventList];
		if (funcList.constructor!=Array) funcList=[funcList];
		eventList.each(function(e){
			funcList.each(function(f){
				e=e.replace(/^(on)?/i,"");
				e=e=="DOMContentLoaded"?"domready":e.toLowerCase();
				if (e=="domready")
					obj=_;
				if (e in obj.module.event){
					var eventInfoList=obj.module.event[e];
					for (var i=0;i<eventInfoList.length;i++){
						if (eventInfoList[i].enabled&&eventInfoList[i].func==f&&(!hash||eventInfoList[i].hash==hash)){
							eventInfoList[i].enabled=false;
							break;
						}
					}
					if (!eventInfoList.length){
						delete obj.module.event[e];
						if (obj.detachEvent) obj.detachEvent(e,execEvent);
						else obj.removeEventListener(e,execEvent,false);
					}
				}
			});
		});
	};
	this.$urh=this.$unregEventHash=function(hash){
		var obj=this;
		if (hash in $$.status.regEventHash){
			var eventInfoList=$$.status.regEventHash[hash],eventInfo;
			while (eventInfo=eventInfoList.shift())
				eventInfo.obj.$ur(eventInfo.event,eventInfo.func,hash);
			delete $$.status.regEventHash[hash];
		}
	};
	this.$getWin=function(){
		var doc=this.ownerDocument;
		return doc.parentWindow||doc.defaultView;
	};
	this.$getEl = function(selector){
		if(!selector)	selector = "";
		var 
			context = arguments[1],
			sl = tc_re.exec(selector)
		;
		
		if( !sl ){
			if( !context )	return null;
			var list = [];
			
			for(var i = 0, l = context.length; i < l; i++){
				list[list.length] = $(context[i]);
			}
			return list.length ? list : null;
		}
		
		var	
			s = sl[0],
			bod = s.substring(1),
			els = selector.replace(s, ""),
			type = s.substring(0, 1),
			self = this,
			list;
		
		if( !context ){
			
			var self = self.nodeName ? self : __ ;
			
			if(type === ".") {
				var nodeList = self.getElementsByTagName("*");
				if(!nodeList)
					return null;
				list = filterByClass(nodeList, bod);
			} else if(type === "#") {
				var el = $(bod);
				list = el ? [el] : null;
			} else {
				bod = s;
				list = self.getElementsByTagName(bod);
			}
			
		} else {
			if(type === "."){
				list = filterByClass(context, bod);
			} else {
				var el = $(bod);
				for(var i = 0, l = context.length; i < l; i++){
					if(context[i] === el)
						list = [el];
				}
			}
		}
		
		if(!list || !list.length)
			return null;
		
		return arguments.callee(els, list);
	};
	this.$g=this.$selNode=function(sel){
		function _m_query(sel,node){
			var em=[],re=sel.match(/^([\.\#]*)([a-zA-Z0-9\-_*]+)(.*)$/i);
			if (!re) return [];
			if (re[1]=="#"){
				var objTmp=$(re[2]);
				if (objTmp) em.push(objTmp);
			}
			else if(re[1]==".")
				node.each(function(obj){
					obj.$("*").$each(function(obj){
						if (new RegExp("\\b"+re[2]+"\\b").test(obj.className))
							em.push($(obj));
					});
				});
			else
				for (var i=0;i<node.length;i++){
					var objTmp=node[i].$(re[2]);
					if (objTmp) for (var j=0;j<objTmp.length;j++) em.push(objTmp[j]);
				}
			re[3].replace(/\[([^!=]+)(=|!=)([^\]]*)\]/gi,function(a,b,c,d){
				var emTmp=em.slice(0);
				em=[];
				emTmp.each(function(obj){
					b={"class":"className","for":"htmlFor"}[b]||b;
					var attrTmp=obj[b]||obj.getAttribute(b);
					var flag;
					if (b=="className")
						flag=new RegExp("\\b"+d+"\\b").test(attrTmp);
					else
						flag=attrTmp==d;
					if ((c=="=")==flag)
						em.push($(obj));
				});
			});
			return em;
		}
		var selfEm=[this==_?_.__.body:this],arr1=[],arr2=[];
		sel.replace(/[^\[,]([^\[,]*(\[[^\]]*\])*)+/g,function(a){
			var em=selfEm.slice(0);
			a.replace(/(#|\*)/gi," $1").replace(/([^\^ ])\.(\w+)/gi,"$1[className=$2]").trim().split(/\s+/g).each(function(str){
				em=_m_query(str,em);
			});
			arr1=arr1.concat(em);
		});
		arr1.each(function(em){
			if (!em.__selNodeFlag__){
				em.__selNodeFlag__=true;
				arr2.push(em);
			}
		});
		arr2.each(function(em){
			em.__selNodeFlag__=false;
			if(em.hasAttribute("__selNodeFlag__"))
				em.removeAttribute("__selNodeFlag__");
		});
		return arr2.length==0?null:arr2;
	};
	this.$getPos=function(){
		var me = this,
			win = me.$getWin();
			
		if( win == $topWin )
			return $offset( me );
		
		var pos = $offsetWin(me), p = [];
		
		while( win != $topWin ){ 
			if(win.parent != $topWin) {
				p = $offsetWin(win.frameElement);
			}
			else{	
				var 
					frame = $(win.frameElement),
					doc = frame.ownerDocument,
					computedStyle = doc.defaultView ? 
						doc.defaultView.getComputedStyle( frame, null ) : frame.currentStyle,
					border={ "thin":2, "medium":4, "thick":6 };

				function isHide( s ){
					return (/^none|hidden$/i).test(s);
				}

				p = $offset(frame);
				
				if(!isHide(computedStyle.borderLeftStyle)){
					var bl = computedStyle.borderLeftWidth;
					p[0] += border[bl] || parseFloat(bl) || 0;
				}

				if(!isHide(computedStyle.borderTopStyle)){
					var bt = computedStyle.borderTopWidth;
					p[1] += border[bt] || parseFloat(bt) || 0;
				}

				if(!$$.browser.IE){
					p[0] += parseFloat(computedStyle.paddingLeft);
					p[1] += parseFloat(computedStyle.paddingTop);
				}
			}

			pos[0] += p[0];
			pos[1] += p[1];
			
			win = win.parent;
		}
		
		return pos;
	};
	this.$setPos=function(obj2, pos1, pos2){
		var auto = false, 
			apos=obj2.$getPos();
		if( pos1 === "auto" ){
			pos1 = "lt"; pos2 = "lb";
			auto = true;
		} else {
			if( !pos1 ) pos1 = "lt";
			if( !pos2 ) pos2 = "lb";
		}
		
		if( auto ){
			var view = viewSize(),
				asize = { x: obj2.offsetWidth, y: obj2.offsetHeight },
				bsize = { x: this.offsetWidth, y: this.offsetHeight },
				r = (pos1 + pos2).split("");
			
			if(apos[0] + bsize.x > view.right &&
				 apos[0] + asize.x - bsize.x >= view.left){
				r[0] = 'r';
				r[2] = 'r';
			}
			if(apos[1] + asize.y + bsize.y > view.bottom &&
				 apos[1] - bsize.y >= view.top){
				r[1] = 'b';
				r[3] = 't';
			}
			
			pos1 = r.slice(0, -2).join("");
			pos2 = r.slice(2).join("");
		}
		
		this.style.left=_m_query.call(this,/[lcr]/i,0);
		this.style.top=_m_query.call(this,/[tmb]/i,1);
		function _m_query(re,i){
			function _m_cal(apos,obj,px,i){
				return px+{"l":0,"c":obj.offsetWidth/2,"r":obj.offsetWidth,"t":0,"m":obj.offsetHeight/2,"b":obj.offsetHeight}[apos||"l"]*i;
			}
			return _m_cal(pos1.match(re),this,_m_cal(pos2.match(re),obj2,apos[i],1),-1)+"px";
		}
	};
	this.$setIframe=function(flag){
		if (flag!==true&&!$$.browser.IE6) return;
		if (this.module.iframe)
			iframe=this.module.iframe;
		else{
			function getIframe(){
				for (var i=0;i<$topWin.$$.module.iframe.length;i++){
					if ($topWin.$$.module.iframe[i].$getStyle("display")=="none")
						return $topWin.$$.module.iframe[i];
				}
			}
			var iframe=getIframe();
			if (!iframe){
				iframe=$topWin.$c("iframe");
				with(iframe.style){
					width=height="0px";
					background="#FFF";
					position="absolute";
					display="none";
					zIndex=100;
				}
				iframe.frameBorder=0;
				iframe.id=iframe.name=$getUid();
				$topWin.$$.status.container.appendChild(iframe);
				$topWin.$$.module.iframe.push(iframe);
				with($topWin.frames[iframe.id].document){
					open();
					write('<style>html,body{overflow:hidden}</style>');
					close();
				}
			}
			this.module.iframe=iframe;
		}
		iframe.$setPos(this,"tl","tl");
		with (iframe.style){
			width=this.offsetWidth+"px";
			height=this.offsetHeight+"px";
			display="";
		}
		return iframe;
	};
	this.$clearIframe=function(){
		var iframe=this.module.iframe;
		if (iframe){
			iframe.style.display="none";
			this.module.iframe=null;
		}
		return iframe;
	};
	function $abs(obj,flag,func){
		if (!obj) return null;
		flag=flag||"n";
		var re=new RegExp(({1:"n",3:"t",8:"c"}[obj.nodeType])||"o","i");
		return flag.match(re)?obj:func.call(obj,flag);
	}
	this.$nAbs=function(flag){
		var obj=this,objTmp=obj.firstChild||obj.nextSibling;
		if (!objTmp)
			do {
				obj=obj.parentNode;
				if (obj==__.body) return null;
				objTmp=obj.nextSibling;
			} while (!objTmp);
		return $($abs(objTmp,flag,arguments.callee));
	};
	this.$pAbs=function(flag){
		if (this==__.body) return null;
		var objTmp=this.previousSibling;
		if (objTmp){
			while (objTmp.lastChild)
				objTmp=objTmp.lastChild;
		}else
			objTmp=this.parentNode;
		return $($abs(objTmp,flag,arguments.callee));
	};
	this.$focusNext=function(){
		if (!this.form) return;
		try{this.blur();}catch(e){}
		var obj=this.form.elements,flag;
		for (var i=0;i<obj.length;i++){
			if (flag){
				if (!$(obj[i]).disabled&&obj[i].$isDisplay())
					try{obj[i].focus();return;}catch(e){}
			}
			if (obj[i]==this) flag=true;
		}
	};
	this.$setDisplay=function(){
		var pos=this.$getPos();
		with($topWin.___){
			scrollLeft=pos[0]-80;
			scrollTop=pos[1]-80;
		}
	};
	this.$isDisplay=function(){
		var obj=this;
		do {
			if (obj.tagName=="INPUT"&&obj.type=="hidden"||
				obj.$getStyle("display")=="none"||
				obj.$getStyle("visibility")=="hidden")
					return false;
		} while ((obj=obj.$parentNode())&&obj.nodeType==1);
		return true;
	};
	this.$setData=function(key, value){
		return $data.set(this, key, value);
	};
	this.$getData=function(key){
		return $data.get(this, key);
	};
	this.$removeData=function(key){
		return $data.remove(this, key);
	};
	this.$getModAttrs=function(arr){
		return Ctrip.support.getModAttrs(this, arr);
	};
	this.$isMod=function(str){
		return Ctrip.support.isMod(this, str);
	};
	return this;
};

//初始化DOM节点
DOM.apply(_);
DOM.apply(__);
DOM.apply(___);
DOM.apply($$.status.alertDiv);


/**
* module supporting methods
*/

$$.support = {
		/** 
		*	copy from jQuery
		*/
	testCss: function(){
		var body = __.body, container = $c("div"), innerDiv, checkDiv, td, sp = this,
		bodyMarginTop = parseFloat($(body).$getStyle("marginTop") ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		container.style.cssText = 'position:absolute; top: 0; left: 0; margin: 0; border: 0; width: 1px; height: 1px; visibility: hidden;' ;

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		sp.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		sp.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed";
		checkDiv.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		sp.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden";
		innerDiv.style.position = "relative";

		sp.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		sp.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		body = container = innerDiv = checkDiv = td = null;
		sp.testCss = $doNothing;
	},
	testIEZoom: function(){
		if( !$$.browser.IE7 )	return 1;
		
		var er = $$.support.zoomTester;
		if(!er){
			var 
				body = __.body,  container = $$.status.container || body,
				div = __.createElement("div"), self = this;
				div.style.cssText = "position:absolute;left:-10000px;top:-10000px;width:100px;height:100px;"
			;
				
			container.appendChild(div);
			er = self.zoomTester = div;
			container = div = body = null;
		}

		var rect= er.getBoundingClientRect();
		return  (rect.right - rect.left)/100 || 1;
	},
	zoomTester: null
};

Ctrip.support = (function(){
	function cut(str){
		return str.replace(/([^_]+_){1,2}/, "");
	}
	
	return {
		getModAttrs: function(elem,  arr){
			var obj = {};
			
			for(var l = arr.length; l--; ){
				obj[cut(arr[l])] = elem.getAttribute(arr[l]);
			}
			return obj;
		},
		isMod: function(elem, key ){
			var attr = elem.getAttribute("mod");
			if( !attr )
				return false;
			if( !key )
				return true;
			return (new RegExp("(\||^)"+key.toLowerCase()+"(\||$)", 'i')).test(attr.toLowerCase());
		}
	}
})();

var $offsetWin, $offset;
if( "getBoundingClientRect" in ___ ){
	
	$offsetWin = function(elem){
		var 
			pos = [0, 0],
			doc = elem.ownerDocument,
			zoom = $$.support.testIEZoom()
		;

			
		if( doc && $contains(doc.documentElement, elem) ){
			var rect = elem.getBoundingClientRect();
			pos[0] = Math.round(rect.left / zoom);
			pos[1] = Math.round(rect.top / zoom);
		}
		
		return pos;
	};

	$offset = function(elem){
		if( !elem )
			return null;
			
		var pos = [0, 0],
			page = $viewSize( elem ),
			rect = $offsetWin( elem ),
			zoom = $$.support.testIEZoom()
		;
			
		pos[1] = rect[1] + Math.round((page.scrollTop - page.clientTop) / zoom);
		pos[0] = rect[0] + Math.round((page.scrollLeft - page.clientLeft) / zoom);
		
		return pos;
	};
} else {
	$offset = function(elem){
		if( !elem )
			return null;
			
		$$.support.testCss();
		var 
			doc = elem.ownerDocument,
			docEl = doc.documentElement,
			pos = [elem.offsetLeft, elem.offsetTop], 
			offPa = elem.offsetParent,
			computedStyle,
			prevComputedStyle = doc.defaultView ? 
				doc.defaultView.getComputedStyle(elem, null) : elem.currentStyle,
			sp = $$.support,
			rtable = /^t(?:able|d|h)$/i;
			
		while( (elem = elem.parentNode) && elem !== doc.body && elem !== docEl ){
			if ( sp.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}
			
			computedStyle = doc.defaultView ? 
				doc.defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			pos[0] -= elem.scrollLeft;
			pos[1] -= elem.scrollTop;
			
			if( elem === offPa ){
				pos[0] += elem.offsetLeft;
				pos[1] += elem.offsetTop;
				
				if ( sp.doesNotAddBorder && !(sp.doesAddBorderForTableAndCells 
					&& rtable.test(elem.nodeName)) ) {
						pos[1] += parseFloat( computedStyle.borderTopWidth  ) || 0;
						pos[0] += parseFloat( computedStyle.borderLeftWidth ) || 0;
					}
				
				offPa = elem.offsetParent;
			}
			
			if ( sp.subtractsBorderForOverflowNotVisible 
				&& computedStyle.overflow !== "visible" ) {
				pos[1] += parseFloat( computedStyle.borderTopWidth  ) || 0;
				pos[0] += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}
			
			prevComputedStyle = computedStyle;
		}
		
		if ( prevComputedStyle.position === "relative" 
			|| prevComputedStyle.position === "static" ) {
			pos[1] += doc.body.offsetTop;
			pos[0] += doc.body.offsetLeft;
		}

		var top, left;
		if ( sp.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top += Math.max( docEl.scrollTop, doc.body.scrollTop );
			left += Math.max( docEl.scrollLeft, doc.body.scrollLeft );
		}
		
		return pos;
	};
	
	$offsetWin = function(elem){
		var pos = [0, 0],
			page = $viewSize( elem ),
			rect = $offset( elem );

		pos[1] = rect[1] - page.scrollTop + page.clientTop;
		pos[0] = rect[0] - page.scrollLeft + page.clientLeft;
		
		return pos;
	} ;
}
//广告配置
var c_allyes_text={};
var c_allyes_delay=1000;

//allyes模块
Ctrip.module.allyes=function(obj){
	var user=attr("user")||attr("mod_allyes_user");
	if(!user){
		var buttons=attr('mod_allyes_buttons',window);
		var text=attr('mod_allyes_text',window.c_allyes_text);
		if(!buttons&&!text)
			return;
	}
	var c_div_template='<div class="base_ad140x60" style="height:{$height}px">{$iframe}<\/div>';
	var c_txt_template='<div class="base_adtxt140">{$text}<\/div>';
	var c_frm_template='<iframe marginheight="0" width="100%" height="100%" marginwidth="0" frameborder="0" scrolling="no" src="http:\/\/allyes.ctrip.com\/main\/adfshow?user={$user}&db=ctrip&border=0&local=yes"><\/iframe>';
	setTimeout(function(){
		if(user){
			if(user.indexOf('@')>-1)
				user=choose(user.split('@'));
			obj.innerHTML=c_frm_template.replace('{$user}',user);
		}else{
			var html=[];
			if(buttons)	html=buttons.map(function(b){
				b.button=b.button||';';
				return c_div_template.replace('{$height}',b.height)
					.replace('{$iframe}',c_frm_template.replace('{$user}',b.user));
			});
			if(text)
				html.push(c_txt_template.replace('{$text}',_.$s2t(text)));
			obj.innerHTML=html.join('');
		}
	},window.c_allyes_delay);
	function attr(name,context){
		var v=obj.getAttribute(name);
		if(!v)
			return null;
		if(context)
			return context[v]||null;
		else
			return v;
	}
	function choose(arr){
		var re=/^(SearchFlights\.aspx|SearchHotels\.aspx|query\.asp)$/i;
		var pn=location.pathname;
		pn=pn.slice(pn.lastIndexOf('/')+1);
		return re.test(pn)?arr[0]:arr[1];
	}
};

//notice模块
Ctrip.module.notice=function(obj){
	var focusFlag;
	obj.module.notice=new function(){
		this.enabled=true;
		this.tip=obj.getAttribute("mod_notice_tip")||"";
		this.check=function(){
			if (obj.module.notice.enabled){
				with(obj){
					if (isNull()){
						style.color="gray";
						value=module.notice.tip;
					}else
						style.color="";
				}
			}
		};
		this.isNull=obj.isNull=function(){
			return obj.value.trim()==""||obj.value==obj.module.notice.tip;
		};
	};
	obj.$r("focus",function(){
		focusFlag=true;
		if (obj.module.notice.enabled){
			obj.style.color="";
			if (obj.value==obj.module.notice.tip)
				obj.value="";
		}
	},10);
	obj.$r("blur",function(){
		focusFlag=false;
		obj.module.notice.check();
	},90);
	if (obj.form){
		var form=$(obj.form);
		form.$r("submit",function(){
			if (obj.isNull())
				obj.value="";
			setTimeout(function(){
				if (!focusFlag)
					obj.module.notice.check();
			},1);
		});
		if (!$$.browser.IE)
			_.$r("beforeunload",obj.module.notice.check);
	}
	obj.module.notice.check();
};

//tab模块
Ctrip.module.tab=function(obj){
	var obj1=_.$g(obj.getAttribute("mod_tab_button")||"");
	var obj2=_.$g(obj.getAttribute("mod_tab_panel")||"");
	var select=parseInt(obj.getAttribute("mod_tab_select")||1,10);
	var event=((obj.getAttribute("mod_tab_event")||"").match(/^mouseover$/i)||"click").toString();
	if (!obj1||!obj2) return;
	obj.module.tab=new function(){
		this.funcListHash={};
		this.select=function(i){
			if (this.funcListHash[i-1])
				this.funcListHash[i-1]();
		};
		this.index=select;
	};
	obj1.each(function(objTmp1,j){
		obj.module.tab.funcListHash[j]=function(){
			obj1.each(function(objTmp2,k){
				objTmp2.className=objTmp2.className.replace(/_(no)?current/g,"_"+(j==k?"":"no")+"current");
				if (obj2[k]) obj2[k].style.display=(j==k)?"":"none";
			});
			obj.module.tab.index=j+1;
		};
		objTmp1.$r(event,obj.module.tab.funcListHash[j]);
	});
	obj.module.tab.select(select);
};

//display模块
Ctrip.module.display=function(obj){
	var selList=obj.$getPara("mod_display_panel"),list=[];
	selList.each(function(sel){
		sel=_.$(sel)||_.$selNode(sel);
		if (sel){
			if (sel.length)
				sel.each(function(sel){list.push(sel);});
			else
				list.push(sel);
		}
	});
	obj.$r("click",function(){
		(function(obj){
			for (var i=0;i<obj.childNodes.length;i++){
				with(obj.childNodes[i]){
					if (nodeType==3){
						var re=new RegExp($$.string.display.match(/[^@]+/g).join("|"),"gi");
						nodeValue=nodeValue.replace(re,function(str){
							var re=new RegExp("@"+str+"\\|([^@]+)|([^@]+)\\|"+str+"@","i");
							var arr=$$.string.display.match(re);
							return arr[1]||arr[2];
						});
					}else
						arguments.callee(obj.childNodes[i]);
				}
			}
		})(obj);
		list.each(function(obj){
			obj.style.display=obj.$getStyle("display")=="none"?"":"none";
		});
	});
};

//selectAll模块
Ctrip.module.selectAll=function(obj){
	var inputList=_.$selNode(obj.getAttribute("mod_selectAll_input")||"");
	if (!inputList) return;
	inputList.each(function(input){
		if (input!=obj)
			input.$r("onclick",function(){
				obj.checked=inputList.each(function(input){
					if (input!=obj&&!input.checked)
						return false;
				});
			});
	});
	obj.$r("click",function(){
		inputList.each(function(input){
			input.checked=obj.checked;
		});
	});
};

//validate模块
Ctrip.module.validate=function(obj){
	var msgTrue=_.$(obj.getAttribute("mod_validate_true")||"");
	var msgFalse=_.$(obj.getAttribute("mod_validate_false")||"");
	var func=obj.getAttribute("mod_validate_function")||"";
	if (!func) return;
	var re=func.match(/^\/(.*?[^\\])\/([gmi]*?)$/);
	var clock,flagTrue,flagFalse;
	func=obj[func]||_[func];
	if (re||func){
		obj.module.validate=new function(){
			this.check=function(){
				if (obj.value||!msgTrue&&!msgFalse)
					flagFalse=!(flagTrue=func?
						func(obj.value,obj):
						obj.value.match(new RegExp(re[1],re[2])));
				else
					flagTrue=flagFalse=false;
				if (msgTrue) msgTrue.style.display=flagTrue?"":"none";
				if (msgFalse) msgFalse.style.display=flagFalse?"":"none";
			};
		};
		obj.$r("focus",function(){
			clock=setInterval(obj.module.validate.check,200);
		});
		obj.$r("blur",function(){
			obj.module.validate.check();
			clearInterval(clock);
		});
	}
};

//jmpInfo模块
$$.module.jmpInfo = {
	timers: {
		show: 300,
		hide: 150,
		refresh: 200
	},
	
	container: $("tuna_jmpinfo") || $('z1'),
	template: {},
	array: {},
	
	load_timeout: 3000,
	
	template_dir: $webresourceUrl('/code/js/resource/jmpinfo_tuna/'),
	data_dir: $webresourceUrl('/code/js/resource/jmpinfo_tuna/'),
	ready: 0
};

(function(J){
	// 	显示计时器	当前显示节点 对象hash	鼠标当前节点
	var showTimer, current, ob = {}, cursor, iframe;
	var posMap = {
		'align-center': 'ctcb',
		'align-left': 'ltlb',
		'corner-left': 'ltrb',
		'align-right': 'rtrb',
		'corner-right': 'rtlb',
		'above-align-left': 'lblt',
		'above-align-right': 'rbrt'
	};

	function JmpInfo(el){
		this.direct = {
			't':(/(.)t\1b/),
			'r':(/r(.)l\1/),
			'b':(/(.)b\1t/),
			'l':(/l(.)r\1/)
		};
		this.setInfo(el);
	}
	JmpInfo.prototype = {
		show: function(){
			if(!this.ckStatus()){
				setTimeout(arguments.callee.bind(this), J.timers.refresh);
				return;
			}
			else{
				J.ready = 1;
				if( iframe )
					hide( iframe );
			}
			var box = J.container;
			this.fillHtml(box, this.toHtml());
		
			this.setPosition(box, this.elem, this.position);
			this.setIframe();
			this.countDownHide();
			if($type(this.callback) === 'function'){
				this.callback.call(null, 'show', this.elem, this);
			}
		},
		ckStatus: function(){
			var d = this.query ? !!J.array[this.query.name] : true;
			return !!J.template[this.page] && d;
		},
		hide: function(){
			hide(J.container);
			current = null;
			this.clearIframe();
			if($type(this.callback) === 'function'){
				this.callback.call(null, 'hide', this.elem, this);
			}
		},
		setIframe: function(){
			var i = this.box || J.container;
			iframe = i.$setIframe();
		},
		clearIframe: function(){
			var i = this.box || J.container;
			i.$clearIframe();
			iframe = null;
		},
		setPosition: function(fl, target, po){
			show(fl);
			if(!(po && po.length == 2)){
				po = this.exchangeDirction(fl, target);
			}
			this.setPos(fl, target, po);
		},
		setPos: function(fl, target, po){
			if(this.arrow){
				this.exchangeClass(fl, target, po.join(""));
			}
			fl.$setPos.apply(fl, [target].concat(po));
		},
		exchangeDirction: function(fl, target){
			var apos = target.$getPos();
			var view = this.view();
			var asize = { x: target.offsetWidth, y: target.offsetHeight };
			var bsize = { x: fl.offsetWidth, y: fl.offsetHeight };

			var r = ['l', 't', 'l', 'b'];
			if(apos[0] + bsize.x > view.right &&
				 apos[0] + asize.x - bsize.x >= view.left){
				r[0] = 'r';
				r[2] = 'r';
			}
			if(apos[1] + asize.y + bsize.y > view.bottom &&
				 apos[1] - bsize.y >= view.top){
				r[1] = 'b';
				r[3] = 't';
			}
			return [r.slice(0, -2).join(""), r.slice(2).join("")];
		},
		view: function(){
			var r = $pageSize('win');
			r.right = r.left + r.width;
			r.bottom = r.top + r.height;
			return r;
		},
		fillHtml: function(el, html){
			el.innerHTML = html;
			$parserRe(el);
			this.initElements();
		},
		initElements: function(){
			var frameSetter = J.container.$g(".base_jmp");
			this.box = frameSetter ? frameSetter[0] : J.container; 
			var arrow =  J.container.$("b");
			this.arrow = arrow ? arrow[0] : null;
			frameSetter = arrow = null;
		},
		exchangeClass: function(fl, target, po){
			for(var k in this.direct){
				var m = po.match(this.direct[k]);
				if(m){
					this.box.className = this.box.className.replace(/[trbl]$/, k);
					this.arrow.className = this.arrow.className.replace(/[trbl]$/, k);
					this.calculateArrow(fl, target, k, m[1]);
					return;
				}
			}
			throw('This direction of jmpInfo is not support yet!');
		},
		calculateArrow: function(fl, target, k, m){
			if('tb'.indexOf(k) >= 0){
				var w1 = fl.offsetWidth,
					w2 = target.offsetWidth,
					w3 = this.arrow.offsetWidth;
				if(m === 'l'){
					this.arrow.style.left = (Math.min(w1, w2)-w3)/2 + "px";
				}
				else if(m === 'r'){
					this.arrow.style.right = (Math.min(w1, w2)-w3)/2 + "px";
				}
				else if(m === 'c'){
					this.arrow.style.left = (Math.max(w1, w2)-w3)/2 + "px";
				}
			}
		},
		getInfo: function(){},
		setInfo: function(el){
			this.elem = el;
			
			var page = (el.getAttribute('mod_jmpInfo_page') || 'default_normal').split('?');
			this.page = !(/^#/).test(page[0]) ? page[0].replace(/\.asp$/i, '').toLowerCase() : page[0];
			this.query = this.parseQuery(page.slice(1).join(''));
			
			this.ready =  Math.min(this.loadData(this.query), this.loadTemplate(this.page));
		
			var content = el.getAttribute('mod_jmpInfo_content') || '';
			this.content = content.split('|');
		
			var position = el.getAttribute('mod_jmpInfo_position') || 'auto';
			if(position in posMap) position = posMap[position];
			this.position = position.match(/[ltrbc]{2}/ig);
		
			var callback = el.getAttribute('mod_jmpInfo_callback');
			if(callback && $type(_[callback]) === 'function') this.callback = _[callback];

			return this;
		},
		toHtml: function(){
			var s = J.template[this.page];
			var m = s.match(/<body.*?>([\s\S]+)<\/body>/i);
			s = (m ? m[1] : s).replace(/<!--[\s\S]*?-->/g, '');
			var o = {'para': this.content};
			if(this.query)
				o['array'] = this.queryData(this.query);
			return this.fillContent(s, o);
		},
		parseQuery: function(s){
			if(!s) return null;
			var a = s.split('=');
			if(a.length < 2) return null;
			return {
				name: a[0],
				value: a.slice(1).join('')
			};
		},
		loadData: function(query){
			if(!query) return true;
		
			var name = query.name;
			var hash = J.array;
			if(hash.hasOwnProperty(name)) return !!hash[name];
			hash[name] = false;
		
			var url = J.data_dir + name + '_' + $$.status.charset + '.js';
			$loadJs(url, null, function(timeout){
				if(timeout)
					return true;
			}, J.load_timeout);
		
			return false;
		},
		loadTemplate: function(name){
			var hash = J.template;
			if(hash.hasOwnProperty(name))
			 	return !!hash[name];
			hash[name] = false;
		
			if(name.charAt(0) === '#'){
				var el = __.$g(name);
				if(el){
					hash[name] = this.htmlOf(el[0]);
					return true;
				}
			}else{
				var url = J.template_dir + name + '.js';
				$loadJs(url, 'gbk', function(timeout){
					if(timeout)
						return true;
				}, J.load_timeout);	
			}
		
			return false;
		},
		htmlOf: function(el){
			if(!el || el.nodeType != 1) return '';
			el = el.cloneNode(true);
			el.removeAttribute('id');
			el.style.cssText = el.style.cssText.replace(/\bdisplay:\s*none;?/i, '');
			if('outerHTML' in el){
				return el.outerHTML.replace(/(<[^>]+\sid=)(\w+)/g, '$1"$2"');
			}else{
				var r = [];
				var a = el.attributes;
				for(var i = 0; i < a.length; i++){
					if(a[i].name == 'id') continue;
					r.push(a[i].name + '="' + a[i].value + '"');
				}
				var s = r.length ? ' ' + r.join(' ') : '';
				var t = el.tagName.toLowerCase();
				return '<' + t + s + '>' + el.innerHTML + '</' + t + '>';
			}
		},
		fillContent: function(html, arrays){
			var prefix = $keys(arrays).join('|');
			var s = '(<(\\w+)[^>]*)\\bid="(' + prefix + ')(\\d+)"([^>]*>)[\\s\\S]*?(<\\/\\2>)';
			var r = new RegExp(s, 'gi');
			return html.replace(r, function(x1, p1, x2, type, index, p2, p3){
				return p1 + p2 + (arrays[type][index - 1] || '') + p3;
			});
		},
		countDownHide: function(){
			var _this = this;
			var timer = setInterval(function(){
				if(current && $contains(current, cursor) 
					|| $contains(J.container, cursor))
					return;
			
				_this.hide();
				clearInterval(timer);
			}, J.timers.hide);
		},
		queryData: function(query){
			var s = J.array[query.name];
			var v = '@' + query.value + '|';
			var i = s.indexOf(v) + 1;
			if(!i){
				return [];
			}
			return s.slice(i, s.indexOf('@', i)).split('|');
		}
	};

	function hide(el){
		el.style.display = "none";
	}

	function show(el){
		el.style.display = "";
	}

	function visiable(el, bol){
		el.style.visibility = bol ? "" : "hidden";
	}

	function countDownShow(el){
		if(showTimer)
			clearTimeout(showTimer);
		showTimer = setTimeout(function(){
			if(!(current && $contains(current, cursor)))
				return;
			initJmpInfo(el);
		}, J.timers.show);
	}

	function configType(el, type){
		var temp = ob[type]; 
		if(temp){
			temp.setInfo(el);
		}
		else{
			switch(type){
				case "jmpinfo":
					temp = new JmpInfo(el);
				break;
				default:
					throw("No this type jmpinfo yet!");
				break;
			}
		}
		return temp;
	}

	function initJmpInfo(el){
		var mod = el.getAttribute("mod"),
				tp = configType(el, 'jmpinfo');
			
		tp.show();
	}

	function handleMouseOver(e){
		var tar = cursor = $fixE(e).$target;
		var jmp = isJmp(tar);
		if(jmp){
			if(current && $contains(current, tar))
				return;
			countDownShow(jmp);
			current = jmp;
		}
		else{
			current = null;
		}
	}

	function isJmp(el){
		while( !Ctrip.support.isMod(el, "jmpinfo") && ___ != el ){
			el = el.parentNode;
		}
		return el == ___ ? null : $(el);
	}

	function init(){
		visiable(J.container, true);
		___.$r('mouseover', handleMouseOver);
	}
	
	_.$r("domready", init);
	
})($$.module.jmpInfo);

_.$r('domReady', function () {
    var styles = '.tuna_calendar{width:362px;font-size:12px;font-family:tahoma, Arial, Helvetica, simsun, sans-serif;position:absolute;z-index:1000;background-color:#fff;border:solid 1px #999;-moz-box-shadow:3px 4px 5px #ccc;-webkit-box-shadow:3px 4px 5px #ccc;box-shadow:3px 4px 5px #ccc;margin:0;padding:5px 6px 4px}.tuna_calendar dl,.tuna_calendar dt,.tuna_calendar dd { margin:0; padding:0; }.tuna_calendar .select_day,.tuna_calendar dd a:hover,.tuna_calendar .calendar_title01 a,.tuna_calendar .calendar_title02 a{background:#FFF url({$picserver}/common/un_bg_calender.png) no-repeat}.tuna_calendar a{color:#005ead;font-weight:bold;text-decoration:none!important}.tuna_calendar dl{float:left;width:175px;padding:6px 0 0}.tuna_calendar #calendar_month2{position:absolute;top:28px;left:186px;z-index:2;padding-bottom:5px;padding-left:6px;border-left:2px solid #999}.tuna_calendar dt{float:left;width:25px;height:22px;background:#ececec;font-weight:normal;color:#666;font-size:12px;line-height:20px;text-align:center;cursor:default}.tuna_calendar .day0,.tuna_calendar .day6{color:#f90;font-weight:bold}.tuna_calendar .day6{width:24px}.tuna_calendar dd{clear:both;padding-top:1px;display:inline-block}.tuna_calendar dd a{font-size:11px;text-align:center;height:24px;width:22px;line-height:24px;float:left;outline-width:0;background-color:#fff;padding:0 2px 1px 1px}.tuna_calendar dd a:hover{background-color:#fff;background-position:-26px -48px}.tuna_calendar .today{font-weight:bold;color:#0053aa;line-height:17px;background-color:#fff5d1;background-image:none;width:17px;height:17px;margin-right:1px;margin-bottom:1px;border:solid 2px #ffe4a9;padding:2px 1px 1px 2px}.tuna_calendar .today:hover{line-height:25px;width:25px;height:25px;border-width:0;margin:0;padding:0}.tuna_calendar .select_day,.tuna_calendar .select_day:hover{color:#fff;background-color:#629be0;background-position:0 -48px}.tuna_calendar .blank_day,.tuna_calendar .over_day{color:#dbdbdb;font-weight:normal;cursor:default}.tuna_calendar .blank_day:hover,.tuna_calendar .over_day:hover{background-color:#fff;background-image:none}.tuna_calendar div{float:left;width:181px;color:#fff;font-weight:bold;height:23px;background:#004fb8}.tuna_calendar div a{cursor:pointer;width:40px;line-height:20px}.tuna_calendar .calendar_title01 label,.tuna_calendar .calendar_title02 label{float:left;width:143px;text-align:center;line-height:23px}.tuna_calendar .calendar_title01 label{padding-right:14px}.tuna_calendar .calendar_title02 label{padding-left:14px}.tuna_calendar .calendar_title01 a,.tuna_calendar .calendar_title02 a{background-color:#2d7fdd;float:left;width:23px;height:23px;overflow:hidden;text-indent:-10em}.tuna_calendar .calendar_title01 a{float:left}.tuna_calendar .calendar_title02 a{background-position:right 0;float:right}.tuna_calendar .calendar_title01 a:hover{background-color:#4895ec;background-position:0 -24px}.tuna_calendar .calendar_title02 a:hover{background-color:#4895ec;background-position:right -24px}.tuna_calendar b,.tuna_calendar i{background-color:#fff;display:block;width:372px;height:1px;border-right:1px solid #c3c3c3;border-left:1px solid #c3c3c3;overflow:hidden;position:absolute;left:0;z-index:1}.tuna_calendar i{border-top:1px solid #999;top:-2px}.tuna_calendar b{border-bottom:1px solid #999;bottom:-2px;_bottom:-3px}address_hot li,.address_hot_abb,.address_hot_adress{list-style:none;margin:0;padding:0}.address_hot_adress a{text-decoration:none}#tuna_address{font-size:12px;font-family:Arial, Simsun}#tuna_address #address_warp{width:220px;border:1px solid #7F9DB9;background:#FFF;text-align:left;min-height:305px;margin:0;padding:0 0 4px}* html #tuna_address #address_warp{height:305px}#tuna_address #address_message{display:block;line-height:20px;font-family:Simyou;word-wrap:break-word;word-break:break-all;background-color:#67a1e2;color:#fff;width:auto;border:none;padding:2px 0 2px 9px}#tuna_address #address_list{min-height:277px;margin:0;padding:0}* html #tuna_address #address_list{height:277px}#tuna_address #address_list span{width:110px;white-space:nowrap;overflow:hidden;float:right;text-align:right;font:normal 10px/22px verdana;margin:0;padding:0}#tuna_address #address_list a{height:22px;border-top:1px solid #FFF;border-bottom:1px solid #FFF;cursor:pointer;line-height:22px;color:#05a;display:block;text-decoration:none;min-height:22px;text-align:left;overflow:hidden;padding:1px 9px 0}* html #tuna_address #address_list a{height:22px}#tuna_address #address_list a:hover{background:#e8f4ff;border-top:1px solid #7F9DB9;border-bottom:1px solid #7F9DB9}#tuna_address .address_selected{background:#ffe6a6;color:#FFF;height:22px}#tuna_address .address_pagebreak{display:none;line-height:25px;text-align:center;margin:0;padding:0}#tuna_address .address_pagebreak a{color:#05a;font-family:Arial, Simsun, sans-serif;text-decoration:underline;font-size:14px;margin:0;padding:0 4px}#tuna_address #address_arrowl,#tuna_address #address_arrowr{color:#05a}#tuna_address a.address_current{color:#000;text-decoration:none}.address_hot{background-color:#fff;width:283px;font-size:12px}.address_hotcity{padding-left:10px;height:24px;line-height:24px;color:#cee3fc;border:#2c7ecf solid 1px;background-color:#67a1e2;border-width:1px 1px 0}.address_hotcity strong{color:#fff}.address_hotlist{border:#999 solid 1px;overflow:hidden;border-width:0 1px 1px;padding:5px}.address_hot_abb{border-bottom:#5da9e2 solid 1px;height:20px}.address_hot_abb li{float:left;width:42px;height:20px;line-height:20px;text-align:center;list-style-type:none;color:#005daa;position:relative;zoom:1;cursor:pointer}.address_hot_abb li .hot_selected{width:42px;border:#5da9e2 solid 1px;position:absolute;left:0;background-color:#fff;color:#000;font-weight:bold;border-width:1px 1px 0}.address_hot_adress{padding-top:4px}.address_hot_adress li{float:left;width:67px;height:24px;overflow:hidden}.address_hot_adress li a{display:block;height:22px;line-height:22px;border:#fff solid 1px;padding-left:5px;color:#000}.address_hot_adress li a:hover{background-color:#e8f4ff;border:#acccef solid 1px;text-decoration:none}'.replaceWith({
        'picserver': $picUrl('')
    });
	var sty;
    if ($$.browser.IE) {
        sty = document.createStyleSheet();
        sty.cssText = styles
    } else {
        sty = document.createElement('style');
        sty.type = "text/css";
        sty.textContent = styles;
        document.getElementsByTagName('head')[0].appendChild(sty)
    }
});
//地址选择器模块
$$.string.address={
	"zh-cn":{
		b:"输入中文/拼音或↑↓选择.",
		i:"输入",
		j:"或↑↓选择.",
		k:"中文/拼音",
		e:"请输入至少两个字母或一个汉字.",
		h:"",
		o:"按拼音排序",
		s:"对不起, 找不到: ",
		l:"结果共",
		p:"项,←→翻页",
		a:",共"
	},
	"zh-tw":{
		b:"輸入中文/拼音或↑↓選擇.",
		i:"輸入",
		j:"或↑↓選擇.",
		k:"中文/拼音",
		e:"請輸入至少兩個字母或一個漢字.",
		h:"",
		o:"按拼音排序",
		s:"對不起, 找不到: ",
		l:"結果共",
		p:"項,←→翻頁",
		a:",共"
	},
	"en":{
		b:"Type or scroll to select.",
		i:"Input ",
		j:" or use up or down to select.",
		k:"English",
		e:"Please Input at least two character.",
		h:"",
		o:"sort by spelling",
		s:"No match",
		l:"Results ",
		p:",left or right to turn page",
		a:",All"
	}
}[$$.status.version];

$$.module.address.sourceMap={
	"hotel":["http://scriptres.ctrip.com/hoteladdress/HotelCityAddress{$charset}.aspx","utf-8"],
	"hotelAll":["http://scriptres.ctrip.com/hoteladdress/HotelCityAddress{$charset}.aspx","utf-8"]
};

(function(){
	var hotDataTail="_".toString()+"hotData";
	var options={
		target:null,
		hotTarget:null,
		data:null,
		selectedValue:null,
		hotSelected:'热门',
		tabTagName:'span',
		tabListTagName:'ol',
		cityListTagName:'ul',
		cityTagName:'span',
		hotData:{},
		hotTemplate:{
			container:'<div class="address_hot" style="display:none;top:0;-moz-box-shadow:2px 2px 5px #333;-webkit-box-shadow:2px 2px 5px #333;" id="address_hot">{$text}</div>',
			title:'<div class="address_hotcity"><strong>热门城市</strong>{$text}</div>',
			hotlist:'<div class="address_hotlist">{$text}</div>',
			tags:'<ol class="address_hot_abb" style="{$style}">{$text}</ol>',
			tag:'<li><span {$className}>{$text}</span></li>',
			items:'<ul class="address_hot_adress layoutfix" {$display} type="{$type}">{$text}</ul>',
			item:'<li><a href="###" data="{$data}">{$text}</a></li>'
		},
		hotClassNames:{
			tagSelected:'hot_selected'
		}
	};

	function addClass(){
		if (!hasClass(arguments[0],arguments[1])) {
			arguments[0].className=arguments[0].className+" "+arguments[1];
		}
	}
	function removeClass(){
		if (hasClass(arguments[0],arguments[1])) {
			var reg=new RegExp('(\\s|^)'+arguments[1].toReString()+'(\\s|$)');
			arguments[0].className=arguments[0].className.replace(reg,' ').split(" ").join(" ");
		}
	}
	function hasClass(){
		return arguments[0].className.match(new RegExp('(\\s|^)'+arguments[1]+'(\\s|$)'));
	}
	function sortFunc(a,b){
		var c=a.match(/^[^\|]+/),d=b.match(/^[^\|]+/);
		return c>d?1:(c==d?0:-1);
	}
	function addressInit(){
		var divTmp=$c("div");
		with (divTmp.style){
			width="0px";
			height="0px";
		}
		divTmp.innerHTML="<div id=\"tuna_address\" style=\"display:none;position:absolute;top:0;z-index:120;overflow:hidden;-moz-box-shadow:2px 2px 5px #333;-webkit-box-shadow:2px 2px 5px #333;\"><div id=\"address_warp\"><div id=\"address_message\">&nbsp;<\/div><div id=\"address_list\"><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><\/div><div class=\"address_pagebreak\" id=\"address_p\"><a id=\"address_arrowl\" href=\"javascript:;\" name=\"p\">&lt;-<\/a><a id=\"address_p1\" href=\"javascript:;\" name=\"1\" class=\"address_current\">1<\/a><a id=\"address_p2\" href=\"javascript:;\" name=\"2\">2<\/a><a id=\"address_p3\" href=\"javascript:;\" name=\"3\">3<\/a><a id=\"address_p4\" href=\"javascript:;\" name=\"4\">4<\/a><a id=\"address_p5\" href=\"javascript:;\" name=\"5\">5<\/a><a id=\"address_arrowr\" href=\"javascript:;\" name=\"n\">-&gt;<\/a><\/div><\/div><\/div>";
		$("jsContainer").appendChild(divTmp);
		div=$("tuna_address");
		$$.module.address.source["default"]="@@";
		idr=$("address_warp");
		cue=$('address_message');
		u=$('address_list');
		p=[$('address_p'),$('address_p1'),$('address_p2'),$('address_p3'),$('address_p4'),$('address_p5')];
		pp=$('address_arrowl');
		pn=$('address_arrowr');
		li=u.getElementsByTagName("a");
		li_bak=[];
		for (var i=0;i<li.length;i++)
			li_bak[i]=li[i].cloneNode(true);
	}
	function setFloaterPos(tar){
		var t = options.hotTarget || div;
		t.$setPos(tar);
	}

	var div,idr,cue,u,p,pp,pn,li,li_bak,hoteDataCount=0;

	Ctrip.module.address=function(obj){
		function handleResize(){
			setFloaterPos(obj);
		}
		function getHotCity(){
			var returnValue=[];
			for(var d in options.hotData){
				hoteDataCount++;
				returnValue.push(options.hotTemplate.tag.replaceWith({
					text:d,
					className:_.$s2t(obj.hotSelected)==d?"class="+options.hotClassNames.tagSelected:''
				}));
			}
			return returnValue.join('');
		}
		function getHotCityData() {
			var returnValue = [];
			for(var d in options.hotData){
				var temp=[];
				var rawdata = options.hotData[d];
				temp = rawdata.replace(/@([^@]*)\|([^@]*)/g , function(s ,s1 ,s2){
					return options.hotTemplate.item.replaceWith({
						data : [s1,s2].join("|"),
						text :s2
					});
				});
				returnValue.push(options.hotTemplate.items.replaceWith({
					text:temp,
					display:$s2t(obj.hotSelected)==$s2t(d)?"":"style='display:none'",
					type:d
				}));
			}
			return returnValue.join('');
		}	
		function setPos(){
			hotTarget.style.position="absolute";
			hotTarget.$setPos(target);
		}
		function getSelectContent(){
			var uls=hotTarget.getElementsByTagName(options.cityListTagName);
			for(var i=0;i<uls.length;i++){
				if(uls[i].style.display==""){
					return uls[i];
				}
			}
			return null;
		}
		function getHotElementByType(type){
			var uls = hotTarget.getElementsByTagName(options.cityListTagName);
			for(var i=0;i<uls.length;i++){
				if(uls[i].getAttribute('type')==type){
					return uls[i];
				}
			}
			return null;
		}
		function getSelectTag(obj){
			var uls = obj.getElementsByTagName(options.cityTagName);
			for(var i=0;i<uls.length;i++){
				if(hasClass(uls[i],options.hotClassNames.tagSelected)){
					return uls[i];
				}
			}
			return null;
		}
		function tagEvent(olObj,tag){
			var selContent = getSelectContent();
			if(olObj && selContent){
				getSelectContent().style.display="none";
				obj.hotSelected = tag.innerText||tag.textContent;
				getHotElementByType(_.$s2t(obj.hotSelected)).style.display="";
				removeClass(getSelectTag(olObj),options.hotClassNames.tagSelected);
				var spanObj = tag.tagName == options.cityTagName.toUpperCase()? tag:tag.getElementsByTagName(options.cityTagName)[0];
				addClass(spanObj,options.hotClassNames.tagSelected)
			}
		}
		//填写输入框
		function itemEvent(ulObj,e){
			clearInterval(clock);
			var selectedValue=e.$target.getAttribute('data').split('|');
			focusTarget.value=selectedValue[1].trim();
			var ref=focusTarget.getAttribute('mod_address_reference');
			
			if(ref && $(ref)){
				$(ref).value = selectedValue[0].trim();
				if ($ref.hook["change"])
					$ref.hook["change"]($(obj));
			}
			show=0;
			hotTarget.$clearIframe();
			hotTarget.style.display="none";
			obj.blur();
			setTimeout(function(){
				if ($ref.focusNext)
					setTimeout(function(){obj.$focusNext();},1);
			},0);
		}
		//hotTarget点击事件
		function bindHotTargetEvent(){
			hotTarget.onmousedown=function(e){
				e=$fixE(e);
				var target=e.$target;
				options.olObj=target.$parentNode(options.tabListTagName);
				options.ulObj=target.$parentNode(options.cityListTagName);
				if(options.olObj){
					tagEvent(options.olObj,target);
				}else if(options.ulObj){
					itemEvent(options.ulObj,e);
					return;
				}else{
					focusTarget.select();
				}
				$stopEvent(e,2);
				if ($$.browser.IE){
					target.outerHTML+="";
				}
			};
		}
		//生成热门城市选择框
		function hotAddress(){
			
			options.hotData=$$.module.address.source[$ref.source+hotDataTail];
			if(!options.hotData) return;
			target=obj;
			obj.select();
			if(!obj.hotSelected){
				obj.hotSelected=options.hotSelected;
			}
			var address_hot=$("address_hot");
			if(address_hot){
				address_hot.parentNode.removeChild(address_hot);
			}
			var returnValue=options.hotTemplate.container.replaceWith({
				text:[
					options.hotTemplate.title.replaceWith({
						text:$$.module.address.source[$ref.source+"_keyWord"]||" （可直接输入城市或城市拼音）"
					}),
					options.hotTemplate.hotlist.replaceWith({
						text:[
							options.hotTemplate.tags.replaceWith({
								text:getHotCity(),
								style:hoteDataCount>1?"":'display:none;'
							}),
							getHotCityData()
						].join('')
					})
				].join('')
			});
			var temp=$c('div');
			temp.innerHTML=returnValue;
			hotTarget=$(temp.removeChild(temp.firstChild));
			__.body.appendChild(hotTarget);
			hotTarget.style.display='';
			hotTarget.style.zIndex=111;
			setPos();
			hotTarget.$setIframe();
			bindHotTargetEvent();
			hoteDataCount=0;
		}
		var target,hotTarget;
		var show=0,setPosFlag,owin=obj.$getWin(),hide=0;
		var $ref=obj.module.address={};
		var list,clock,lastselect=null,lastvalue,data=[];
		var firstFocus=false;
		$ref.ver = obj.getAttribute('mod_address_ver');

		if (!div){
			addressInit();
		}
		obj.setAttribute("autoComplete","off");
		$r("beforeunload",function(){
			obj.setAttribute("autoComplete","on");
		});
		$ref.focusNext=obj.getAttribute("mod_address_focusNext");
		$ref.focusNext=/^(1|true)$/i.test($ref.focusNext||"");
		$ref.reference=obj.getAttribute("mod_address_reference");

		var cookie=obj.getAttribute("mod_address_cookie");
		if (cookie){
			cookie=owin.$(cookie);
			if (!cookie){
				var _t_cookie=owin.$c("input");
				with (_t_cookie){
					type="hidden";
					id=name=cookie;
				}
				cookie=_t_cookie;
				obj.parentNode.insertBefore(cookie,obj);
			}
		}
		if ($ref.reference)
			$ref.reference=owin.$($ref.reference)||owin.$($ref.reference,true);
		var s_hot=obj.getAttribute("mod_address_suggest");
		var s_cookie=obj.getAttribute("mod_address_cookieSuggest");
		$ref.suggest=[];
		if (s_cookie){
			$ref.suggest=s_cookie.match(/[^@]+@/gi);
			if (s_hot)
				$ref.suggest._push(s_hot.match(/[^@]+@/gi));
		}
		else if (s_hot)
			$ref.suggest=s_hot.match(/[^@]+@/gi);
		if ($ref.suggest.length>12)
			$ref.suggest=$ref.suggest.slice(0,12);
		$ref.source=obj.getAttribute("mod_address_source")||"default";
		if (!$$.module.address.source[$ref.source]){
			$$.module.address.source[$ref.source]="@@";
			if ($$.module.address.sourceMap[$ref.source])
				$loadJs($$.module.address.sourceMap[$ref.source][0].replace(/\{\$charset\}/gi,$$.status.charset),($$.module.address.sourceMap[$ref.source][1]||"").replace(/\{\$charset\}/gi,$$.status.charset)||$$.status.charset);
			else
				$loadJs($webresourceUrl("/code/js/resource/address_tuna/")+$ref.source+"_"+$$.status.charset+".js",$$.status.charset);
		}
		$ref.auto=obj.getAttribute("mod_address_auto");
		$ref.auto=$ref.auto&&$ref.auto.match(/^(false|0)$/i)?false:true;
		$ref.redraw=function(){
			if (clock)
				_m_change();
		};
		$ref.hook={};
		(obj.getAttribute("mod_address_hook")||"").replace(/(on)?([^;:]+):([^;]+)/gi,function(a,b,c,d){
			$ref.hook[c.toLowerCase()]=owin[d];
		});
		function _m_focus(){
			firstFocus = true;
			if (show){
				show=0;
				return;
			}
			setPosFlag=false;
			u.style.display=cue.style.display=p[0].style.display="none";
			
			function _m_click(i){
				li[i].onmousedown=function(e){
					_m_mousedown(i);
					$stopEvent(e);
					if(li[i].outerHTML) li[i].outerHTML=li[i].outerHTML+' ';
					obj.blur();
				};
			}
			div.onmousedown=function(e){
				setTimeout(function(){
					firstFocus=false;
				},200);
				show=1;
				
				e=e||window.event;
				$stopEvent(e);
				return false;
			};
			_.$r("resize", handleResize);
			for (var i=0;i<li.length;i++)
				new _m_click(i);
			pp.onmousedown=pn.onmousedown=_m_p_click;
			for (var i=1;i<p.length;i++)
				p[i].onmousedown=_m_p_click;
			lastvalue=null;
			if (lastselect!==null){
				li[lastselect].className="address_selected";
			}
			if ($ref.hook["focus"]){
				$ref.hook["focus"](obj);
			}
			_m_change();
			clock=setInterval(_m_change,150);
		}
		function _m_p_click(e){
			show=1;
			if (e) $stopEvent(e);
			switch (this){
				case pp:_m_list.m_get(_m_list.page-1);break;
				case pn:_m_list.m_get(_m_list.page+1);break;
				default:_m_list.m_get(parseInt(this.firstChild.nodeValue));
			}
			return false;
		}
		var _m_list=new function(){
			var list;
			this.page=1;
			//this.pagelist;
			this.maxpage=1;
			this.m_get=function(_t_page){
				if (!list||!_t_page||_t_page<1||_t_page>this.maxpage) return null;
				this.page=_t_page;
				this.pagelist=list.slice((_t_page-1)*12,Math.min(_t_page*12,list.length));
				for (var i=0;i<li.length;i++){
					if (i<this.pagelist.length){
						li[i].style.display="block";
						var _t_data=this.pagelist[i].replace(/@/g,"").split("|");
						li[i].lastChild.nodeValue=_t_data[1];
						li[i].firstChild.firstChild.nodeValue=_t_data[0];
						data[i]=_t_data;
					}
					else{
						li[i].style.display="none";
						data[i]=null;
					}
				}
				if (lastselect!==null){
					if (lastselect>=this.pagelist.length){
						li[lastselect].className="";
						lastselect=this.pagelist.length-1;
						li[lastselect].className="address_selected";
					}
				}else{
					lastselect=0;
					li[0].className="address_selected";
				}
				_m_showpage.call(this);
				u.style.display=cue.style.display="";
				if (!setPosFlag){
					div.style.display="";
					var pos=obj.$getPos();
					if (div.offsetWidth+pos[0]>___.offsetWidth)
						div.$setPos(obj,"tr","br");
					else
						div.$setPos(obj);
					
					div.$setIframe();
					setPosFlag=true;
				}
				_m_resize.call(this);
			};
			this.m_set=function(_t_list){
				list=_t_list;
				this.maxpage=Math.ceil(_t_list.length/12);
				this.page=1;
				this.m_get(1);
			};
			function _m_showpage(){
				var st=this.maxpage<6||this.page<3?1:this.page>this.maxpage-2?this.maxpage-4:this.page-2;
				var ed=Math.min(st+4,this.maxpage);
				var obj;
				pp.style.display=this.page==1?"none":"";
				pn.style.display=this.page==this.maxpage?"none":"";
				for (var i=st;i<st+5;i++){
					obj=p[i-st+1];
					if (i<=ed){
						obj.firstChild.nodeValue=i;
						obj.className=i==this.page?"address_current":"";
						obj.style.display="";
					}
					else
						obj.style.display="none";
				}
				p[0].style.display=this.maxpage>1?"block":"none";
			}
		};
		function _m_resize(){
			with(div.style){
				width=idr.offsetWidth+"px";
				height=idr.offsetHeight+"px";
			}
			div.$setIframe();
		}
		function _m_suggest(){
			if ($ref.suggest.length==0){
				div.style.display="none";
				if (lastselect!==null){
					li[lastselect].className="";
					lastselect=null;
				}
				return;
			}
			_m_list.m_set($ref.suggest);
			cue.lastChild.nodeValue=$$.status.version.match(/^zh-/)?$$.string.address.i+(obj.module.notice?obj.module.notice.tip:$$.string.address.k)+$$.string.address.j:$$.string.address.b;
		}
		function _m_change(){
			focusTarget=obj;
			var value=obj.value.trim();
			if (value===lastvalue) return;
			lastvalue=value;
			value=value.replace(/([\(\)\\\[\]\.\+\?\*\|\^\$])/gi,"\\$1").replace(/@|\|/gi,"");
			if (firstFocus&&$$.module.address.source[$ref.source+hotDataTail]){
				hotAddress();
				firstFocus=false;
				options.hotTarget = hotTarget;
				return;
			}
			if (hotTarget&&!hotTarget.style.display){
				options.hotTarget = null;
				hotTarget.$clearIframe();
				hotTarget.style.display="none";
			}
			if(!value){
				_m_suggest();
				_m_resize();
				return;
			}
			if (hotTarget){
				hotTarget.$clearIframe();
				hotTarget.style.display="none";
			}
			div.style.display="";
			
			var source=$$.module.address.source[$ref.source];
			var re1=new RegExp("@([^\\|@]*\\|)?"+value+"[^@]*","gi");
			var re2=new RegExp("@([^@]*\\|)?"+value+"[^@]*","gi");
			var re3=new RegExp("@[^@]*"+value+"[^@]*","gi");
			var arr1=[],arr2=[],arr3=[];
			source=source.replace(re1,function(a){
				arr1.push(a);
				return "";
			});
			if (arr1)
				arr1.sort(sortFunc);
			source=source.replace(re2,function(a){
				arr2.push(a);
				return "";
			});
			if (arr2)
				arr2.sort(sortFunc);
			source=source.replace(re3,function(a){
				arr3.push(a);
				return "";
			});
			if (arr3)
				arr3.sort(sortFunc);
			arr=arr1.concat(arr2).concat(arr3);
			
			if(!arr||!arr.length){
				cue.lastChild.nodeValue=$ref.auto?($$.string.address.s+($$.status.version=="en"?"":obj.value)):($$.string.address.h+obj.value+", "+$$.string.address.o);
				if (!$ref.auto){
					div.style.display="none";
					if (lastselect!==null){
						li[lastselect].className="";
						lastselect=null;
					}
				}
				if (u.style.display=="none")
					_m_suggest();
				_m_resize();
			}else{
				cue.lastChild.nodeValue=$$.string.address.h+obj.value+", "+$$.string.address.o;
				_m_list.m_set(arr);
			}
			firstFocus=false;
		}
		function _m_keydown(e){
			
			var code=e?e.keyCode:event.charCode;
			var _t_code="|"+code+"|";
			if (lastselect==null){
				if ("|13|".indexOf(_t_code)!=-1){
					$stopEvent(e,1);
					if ($ref.focusNext)
						setTimeout(function(){obj.$focusNext();},1);
				}
				return true;
			}
			if ("|13|".indexOf(_t_code)!=-1){
				$stopEvent(e,1);
				_m_mousedown(lastselect);
				obj.blur();
			}
			if ("|33|37|188|219|".indexOf(_t_code)!=-1){
				_m_p_click.call(pp);
				$stopEvent(e,1);
			}
			if ("|34|39|61|190|221|".indexOf(_t_code)!=-1){
				_m_p_click.call(pn);
				$stopEvent(e,1);
			}
			if ("|38|40|".indexOf(_t_code)!=-1){
				li[lastselect].className="";
				lastselect+=_m_list.pagelist.length-39+code;
				lastselect%=_m_list.pagelist.length;
				li[lastselect].className="address_selected";
				$stopEvent(e,1);
			}
			// if(obj.value){
				// setTimeout(function(){
					// if(hotTarget){
						// hotTarget.$clearIframe();
						// hotTarget.style.display="none";
					// }
				// },200);
			// }
		}
		function _m_mousedown(i,flag){
			show=2;
			obj.value=data[i][1]||data[i][0];
			if ($ref.reference)
				$ref.reference.value=data[i][2];
			if (cookie)
				cookie.value=data.join("|");
			if ($ref.hook["change"])
				$ref.hook["change"](obj);
			if (flag!==false&&$ref.focusNext)
				setTimeout(function(){obj.$focusNext();},1);
		}
		function _m_blur(){
			firstFocus=false;
			if(show==1){
				setTimeout(function(){obj.focus()},1);
				return;
			}
			clearInterval(clock);
			clock=null;
			if(hotTarget){
				hotTarget.$clearIframe();
				hotTarget.style.display="none";
			}
			div.$clearIframe();
			div.style.display="none";
			if (lastselect!==null){
				if (obj.value&&show!=2){
					if ($ref.auto)
						_m_mousedown(lastselect,false);
					else
						$ref.check();
				}
				li[lastselect].className="";
				lastselect=null;
			}
			show=0;
			div.onmousedown=null;
			_.$ur("resize", handleResize);
		}
		$ref.check=function(){
			var value=obj.value.trim();
			if (obj.isNull&&obj.isNull())
				value="";

			var arr;
			lastvalue=value;
			value=value.replace(/([\(\)\\\[\]\.\+\?\*\|\^\$])/gi,"\\$1").replace(/@|\|/gi,"");
			if(value){
				var source=$$.module.address.source[$ref.source];
				var re1=$ref.auto?new RegExp("@([^\\|@]*\\|)?"+value+"[^@]*","gi"):new RegExp("@([^\\|@]*\\|)?"+value+"(\\|[^@]*)?(?=@)","gi");
				var re2=$ref.auto?new RegExp("@([^@]*\\|)?"+value+"[^@]*","gi"):new RegExp("@([^@]*\\|)?"+value+"(\\|[^@]*)?(?=@)","gi");
				var re3=new RegExp("@[^@]*"+value+"[^@]*","gi");
				var arr1=[],arr2=[],arr3=[];
				source=source.replace(re1,function(a){
					arr1.push(a);
					return "";
				});
				if (arr1)
					arr1.sort(sortFunc);
				source=source.replace(re2,function(a){
					arr2.push(a);
					return "";
				});
				if (arr2)
					arr2.sort(sortFunc);
				if ($ref.auto){
					source=source.replace(re3,function(a){
						arr3.push(a);
						return "";
					});
					if (arr3)
						arr3.sort(sortFunc);
				}
				arr=arr1.concat(arr2).concat(arr3);
				if (arr&&arr.length){
					setPosFlag=true;
					_m_list.m_set(arr);
					setPosFlag=false;
					_m_mousedown(0,false);
					show=0;
				}
			}
			if (obj.module.notice)
				obj.module.notice.check();
			return !!arr;
		};
		obj.$r("onfocus",_m_focus);
		obj.blur();
		obj.$r("onblur",_m_blur);
		obj.$r("onkeydown",_m_keydown);
		if ($ref.hook["load"])
			$ref.hook["load"](obj);
	}
})();

$$.module.calendar = {
	string: {
		"zh-cn": {
			a:"年",
			b:"月",
			weekday:"日一二三四五六",
			f:"yyyy-mm-dd"
		},
		"zh-tw": {
			a:"年",
			b:"月",
			weekday:"日一二三四五六",
			f:"yyyy-mm-dd"
		},
		"en": {
			a:"",
			b:"Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec",
			weekday:"SMTWTFS",
			f:"mm-dd-yyyy"
		}
	}[$$.status.version],
	
	template: '<div class="calendar_title01"><a id="calendar_lastmonth">&nbsp;</a><label id="calendar_title1">{$frontMonthStr}</label></div><div class="calendar_title02"><a id="calendar_nextmonth">&nbsp;</a><label id="calendar_title2">{$endMonthStr}</label></div><dl id="calendar_month1" t="{$frontMonth}">{$header}<dd>{$frontDay}</dd></dl><dl id="calendar_month2"  t="{$endMonth}">{$header}<dd>{$endDay}</dd></dl><i>&nbsp;</i><b>&nbsp;</b>',
	
	className: {
		today: "today",
		over: "over_day",
		blank: "blank_day",
		select: "select_day"
	},
	
	attr: [
		'mod_calendar_rangeStart',
        'mod_calendar_rangeEnd',
		'mod_calendar_rangeException',
        'mod_calendar_permit',
        'mod_calendar_prohibit',
		'mod_calendar_weekday',
        'mod_calendar_hook',
        'mod_calendar_focusNext',
        'mod_calendar_reference'
	],
	
	init: $doNothing,
	current: null
};

(function(C){

	var o, elemList = [], 
		container , mousedown = false;

	function  Calendar(){
		var a = C.string.weekday.split("");
		var header = a.map(function(im, i){
				return '<dt class="day'+ i +'">'+ im +'</dt>';
		}).join("");
		C.template = C.template.replace(/\{\$header\}/g, header);
		a = header = null;
	}
	
	Calendar.prototype = {
		addCurrentMonth: function ( n ){
			var  cur = this._data._current;
			if( !n )	n = 0;
			cur.setMonth( cur.getMonth() + n );
			return cur;
		},
		setConfig: function (elem){
			this._elem = C.current = elem;
			this._data = elem.$getModAttrs( C.attr );
			this._transConfig();
		},
		handleFocus: function(){
			this._fresh();
		},
		handleBlur: function(){
			this.hide();
		},
		fresh: function(){
			this._toHtml(true);
		},
		focusNext: function(){
			var _this = this;
			if (_this._data.focusNext)
				setTimeout(function(){_this._elem.$focusNext();},1);
		},
		_transConfig: function(){
			var el = this._elem,
				d = this._data,
				today = $$.status.today.isDateTime();
			
			this._today = new Date(today);
			this._closeAutoComplete(el);
			
			d._current = toFirstDay(today);
			d._select = null;
			if( d.rangeStart ){
				d.rangeStart = d.rangeStart === "#" ? today : d.rangeStart.isDateTime();
			}
			if( d.rangeEnd ){
				d.rangeEnd = d.rangeEnd === "#" ? today : d.rangeEnd.isDateTime();
			}
			d.weekday = d.weekday || "1234567";
			
			if( d.rangeException )
				d.rangeException = d.rangeException.split("|");
				
			if( d.permit )
				d.permit = d.permit.split("|");
				
			if( d.prohibit )
				d.prohibit = d.prohibit.split("|");
			
			if( d.hook ){
				var h = d.hook; d.hook = {};
				h.replace(/(on)?([^;:]+):([^;]+)/gi,function(a,b,c,f){
					d.hook[ c.toLowerCase() ] = f;
				});
			}			
			if( d.focusNext ){
				d.focusNext = (/^(1|true)$/i).test( d.focusNext );
			}

			if( d.reference ){
				d.reference = $(d.reference);
			}
			
			d.check = this._check;
			
			d.redraw = $doNothing;
			
			var cal = el.module.calendar;
			
			for(var _k in d){
				if( cal[_k] && !$isEmptyObj(cal[_k]) )
					d[_k] = cal[_k];
				
				if( _k.indexOf("_") !== 0 )
					cal[_k] = d[_k];
			}
			
			C.current = el;
			el = d = today = cal = null;
		},
		_closeAutoComplete: function(el){
			el.setAttribute("autoComplete", "off");
			$r("beforeunload", function(){ el.setAttribute("autoComplete", "on") });
		},
		/**
		* @param front boolean  justify if is the front calendar data;
		*/
		_toMatrix: function( temp, front ){
			var y = temp.getFullYear(),
				data = this._data;
				m =  temp.getMonth(),  d = 0,
				days  = [31, (y%4 || y%400 && !y%100 ? 28 : 29), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				
				cls = C.className,
				first = temp.getDay(),
				f = false,
				hash = [], html = [];
			
			for(var j = 0; j < 6; j++){
				hash[j] = [];
				for(var i = 0; i < 7; i++){
					while(1){
						
						var def = { n: 0,  c: null };
							d = (j * 7 + i) - first + 1;
							
						if( d <= 0 || d > days[ m ] ){
							def.c = cls.blank;
							break;
						}
						
						def.n = d;	temp = new Date( y, m, d );
						
						if( +temp === +this._today ){
							def.c = cls.today;
						}
						
						if( !this._check(temp) ){
							def.c = cls.over;
							break;
						} else {
							f = true;
						}
						
						if( +temp === +data._select 
							|| data.reference && +data.reference.value.isDateTime() === +temp){
							def.c = cls.select;
						}
						break;
					}
					hash[j][i] = def;
				}
			}
			
			if( !f && front){
				return hash = null;
			}
			
			for(var j = 0; j < 6; j++){
				for(var i = 0; i < 7; i++){
					html.push('<a href="javascript:;" {$cls}>{$d}</a>'.replaceWith({
						cls: hash[j][i].c ? 'class="' + hash[j][i].c + '"' : "",
						d: hash[j][i].n || "&nbsp;"
					}));
				}
			}
			
			return html.join("");
		},
		_check: function( date ){
			var el = this._elem, 
				d = this._data, str;
			
			if( date ){
				str = date.toStdString();
			} else {
				str = (el.isNull && el.isNull() ? 
					"" : el.value.trim());
				date = str.isDateTime();
				
				if( !date )
					return false;
			}
			
			if ( d.rangeStart && date < d.rangeStart
				|| d.rangeEnd && date > d.rangeEnd )
				return false;
				
			//str = str.replace(/(-)(\d)(?=[^\d]|$)/g, '$10$2');
			
			str += "|";
			
			if( (d.rangeException && (d.rangeException.join("|") + "|").indexOf(str) !== -1 
				|| d.prohibit && (d.prohibit.join("|") + "|").indexOf(str) !== -1
				|| d.weekday.indexOf( date.getDay() || 7 ) === -1 ) 
				&& !( d.permit && (d.permit.join("|") + "|").indexOf(str) !== -1) ){
				return false;
			}
			
			return true;
		},
		_fresh: function(){
			var ex = this._elem.value.isDateTime(),
				data = this._data;

			if ( data.reference ){
				var d = data.reference.value.isDateTime();
				if( d && data.rangeStart && d > data.rangeStart)	
					data._current = toFirstDay(d);
			}
			
			if( ex ){
				if( data.rangeStart && ex > data.rangeStart )
					data._current = toFirstDay(ex);
				data._select  = new Date( ex );
			} else {
				data._select = null;
			}
			
			this._toHtml();
			this.show();
		},
		/**
		* @param force boolean  false : 自动过滤第一个日历 没有可用日期的空月份，递增不能超过最晚时间。 true : 不过滤
		*/
		_toHtml: function( force ){
			var d = this._data._current,
				e = this._data.rangeEnd,
				arr = [], date = [], 
				i = l = 0;
			do {
				date[i] = new Date( d.getFullYear(), d.getMonth() + (l++), 1 );
				
				if( e && date[i] >= new Date(e.getFullYear(), e.getMonth(), 1) ) 
					force = true;
				
				var html = this._toMatrix( date[i], !force && !i );
				if( html ){
					arr.push( html );
					i ++;
				}
			} while( i <= 1 )
			
			if( l - i )
				d = new Date(d.setMonth( d.getMonth() + (l - i) ));
			
			container.innerHTML = C.template.replaceWith({
				frontMonthStr: this._toTitleString( date[0] ),
				endMonthStr: this._toTitleString( date[1] ),
				frontMonth: this._toYearMonth(date[0]),
				endMonth: this._toYearMonth(date[1]),
				frontDay: arr[0],
				endDay: arr[1]
			});
		},
		_toYearMonth: function( date ){
			var s = C.string,
				m = date.getMonth(),
				y = date.getFullYear();
			
			return s.f.replace("yyyy", y).replace("mm", $$.status.version === "en" ? s.b.split("|")[m] : m+1 );
		},
		_toTitleString: function( date ){
			if( $$.status.version === "en"){
				return C.string.b.split("|")[ date.getMonth() ] + "&nbsp;" + date.getFullYear();
			} else {
				return date.getFullYear() + C.string.a + "&nbsp;" + (date.getMonth() + 1) + C.string.b;
			}
		},
		show: function(){
			var s = container.style;
			if( s.display )	s.display = "";
			container.$setPos(C.current, "auto");
			container.$setIframe();
		},
		hide: function(){
			container.$clearIframe();
			container.style.display = "none";
			C.current = null;
		},
		callback: function(){
			var func = this._data.hook && this._data.hook['change'];
			if( !func )	return;
			if( Object.prototype.toString.call(func) === "[object String]" ){
				var a = func.split(".");
				
				func = a[0] === "this" ?  this._elem : _[a[0]];
				for(var i = 1, l = a.length; i < l; i++){
					if( func[a[i]] )
						func = func[a[i]];
					else{
						throw a.slice( 0, i ).toString() + "is undefined";
					}
				}
			}
			func.call( null, this._elem );
		},
		handleMousedown: function( tar ){
			this._elem.value = toDateString( tar );
			this._elem.blur();
			this.focusNext();
			this.callback();
		}
	};
	
	function initialize(elem){
		if(elem.$getData("__inited__"))
			return;
		
		elem.$r("focus", handleFocus);
		elem.$r("blur", handleBlur);
		elem.module.calendar = { hook: {}, redraw: $doNothing};
		if( $$.browser.IE ){
			elem.onbeforedeactivate = function(){
				if( mousedown ){
					return mousedown = false;
				}
				return true;
			}
		}
		elemList.push(elem);
		elem.$setData("__inited__", 1);
	}
	
	function handleResize(){
		if( !C.current )
			return;
			
		o.show();
	}
	
	function handleFocus(e){
		o.setConfig( this );
		o.handleFocus(e);
	}
	
	function handleBlur(e){
		o.handleBlur(e);
	}
	
	function clear(elem){
		elem.$ur("focus", handleFocus);
		elem.$ur("blur", handleBlur);
		elem.module.calendar = null;
		if( $$.browser.IE ){
			elem.onbeforedeactivate = null;
		}
		elemList.remove(elem);
		elem.$removeData("__inited__");
	}
	
	function toDateString( elem ){
		var d = elem.innerText || elem.textContent, 
			p = elem.$parentNode("dl");
		if( p )
			return p.getAttribute("t").replace("dd", d);
	}
	
	function gogogo(n){
		o.addCurrentMonth(n);
		o.fresh(); 
	}
	
	function toFirstDay(date){
		var d = new Date(date);
		d.setDate(1);
		return d;
	}
	
	function handleContainerMousedown(e){
		var tar = $fixE(e).$target;
		mousedown = true;
		setTimeout(function(){ mousedown = false }, 1);
		$stopEvent(e, 2);
		
		if( !tar || tar.nodeName !== "A" 
			|| tar.className === C.className.blank 
			|| tar.className === C.className.over )
			return ;
			
		if( tar.id === "calendar_nextmonth"){
			return gogogo(2); 
		}
		
		if( tar.id === "calendar_lastmonth"){
			return gogogo(-2);
		}
		
		o.handleMousedown( tar );
	}
	
	Ctrip.module.calendar = function(elem){
		if( !o )
			o = new Calendar();
		initialize(elem);
		if( !container ){
			container = $("tuna_calendar");
			container.$r("mousedown", handleContainerMousedown );
			_.$r("resize", handleResize);
		}
	}
	
})($$.module.calendar);

//初始化
(function(){
	//测算代码
	var d = (__.domain || "").match(/ctrip(travel)?\.com$/);
	if(d && $isOnline()){
		_.__uidc_init = new Date * 1;
		__.write('<script src="http://www.' + (d[1] ? 'dev.sh.' + d[0] : d[0]) + '/rp/uiScript.asp"></script>');
	}

	//简繁转换函数
	if($$.status.charset=='big5' && $isOnline())
		__.write('<script src="' + $webresourceUrl('/code/js/public/public_s2t.js') + '" charset="utf-8"><\/script>');
	else
		_.$s2t=function(s){return s};

	//修正IE6背景图不缓存
	if ($$.browser.IE6)
		try{__.execCommand("BackgroundImageCache",false,true);}catch(e){;};

	//初始化$alert函数
	$$.status.alertDiv.innerHTML=$$.status.version.match(/^zh-/)?"<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"base_popwindow01\"><tr><td class=\"base_poptl\"><\/td><td class=\"base_poptc\"><div><\/div><\/td><td class=\"base_poptr\"><\/td><\/tr><tr><td class=\"base_popml\"><\/td><td id=\"alertInfo\" class=\"base_popmc\">内容<\/td><td class=\"base_popmr\"><\/td><\/tr><tr><td class=\"base_popbl\"><\/td><td class=\"base_popbc\"><div><\/div><\/td><td class=\"base_popbr\"><\/td><\/tr><\/table>":"<table id=\"alertTable\" style=\"font-family:Arial;margin:0;\" cellpadding=\"0\" cellspacing=\"0\"><tr><td style=\"margin:0;padding:0px 2px 2px 0px;background:#E7E7E7;\"><div id=\"alertInfo\" style=\"margin:0px;padding:10px;font-size:12px;text-align:left;background:#FFFFE8;border:1px solid #FFDF47;color:#000;white-space:nowrap;\">内容<\/div><\/td><\/tr><\/table>";

	//初始化domReady事件
	function evtDomReady(e){
		function execEvent(){
			if ($$.status.domReady)
				return;
			var eventInfo;
			$$.status.domReady=true;
			if ("domready" in _.module.event){
				while (eventInfo=_.module.event["domready"].shift())
					if (eventInfo.enabled)
						try{eventInfo.func(e);}
						catch(e){
							$t("domReady Error", [eventInfo.func, _]);
						};
			}
		}
		if ($$.browser.WebKit||$$.browser.Opera)
			setTimeout(execEvent,1);
		else
			execEvent();
	}

	//注册domReady事件
	if($$.browser.Moz)
		__.addEventListener("DOMContentLoaded",evtDomReady,false);
	else if($$.browser.IE){
		try{
			if (!_.frameElement)
				(function (){
					try {
						___.doScroll("left");
					}catch (e){
						setTimeout(arguments.callee,50);
						return;
					}
					evtDomReady();
				})();
		}catch(e){;};
	}else if($$.browser.WebKit){
		var domReadyTimer=setInterval(function(){
			if(__.readyState=="loaded"||__.readyState=="complete"){
				clearInterval(domReadyTimer);
				evtDomReady();
			}
		},10); 
	}

	//加载页面变量
	function loadPageValue(){
		var str=$$.status.saveStatus.value;
		if (str)
			$$.status.back=true;
		$$.status.pageValue=$fromJson(str||"{}");
		if (!("data" in $$.status.pageValue))
			$$.status.pageValue.data={};
		if (!$$.browser.Opera)
			$r("beforeunload", $savePageValue ,90);
	}

	$r("domReady",function(){
		$(__.body);
		loadPageValue();
	},10);
	$r("domready",[$parserRe,$fixElement,function(){
		try{__.body.focus();}catch(e){;};
	}]);
	$r("load",[evtDomReady,function(){
		$$.status.load=true;
	}]);
})();

//蒙板
var maskShow=(function(){
	var mask=null;
	var curr=null;
	var free=false;
	var func={
		onresize:null,
		onscroll:null
	};
	return function(el, fre){
		if(!mask)
			initMask();
		free=!!fre;
		if(!el){
			show(curr,false);
			show(mask,false);
			showSelects(true);//for ie6
			curr=null;
			if(!free) for(var s in func){
				window[s]=func[s];
				func[s]=null;
			}
		}else{
			if(curr)
				show(curr,false);
			curr=el;
			checkVisib(curr);
			rePos();
			mask.style.zIndex = maskShow.zIndexBack || 15;
			curr.style.zIndex = maskShow.zIndexFore || 20;
			show(curr,true);
			show(mask,true);
			showSelects(false, el);//for ie6
			if(!free) for(var s in func){
				func[s]=window[s];
				window[s]=rePos;
			}
		}
	};
	function showSelects(b, box){
		if(!$$.browser.IE6) return;
		var sel=document.getElementsByTagName('select');
		var vis=b?'visible':'hidden';
		for(var i=0;i<sel.length;i++){
			if((b || !childOf(sel[i], box)) && sel[i].currentStyle.visibility != vis) sel[i].style.visibility=vis;
		}
	}
	function childOf(a, b){
		while(a && a != b) a = a.parentNode;
		return a == b;
	}
	function initMask(){
		/*
		mask=document.createElement('iframe');
		mask.src='://0';
		*/
		mask=document.createElement('div');
		mask.style.cssText='background-color:{$c};border:none;position:absolute;visibility:hidden;opacity:{$a};filter:alpha(opacity={$A})'.replaceWith({
			c: maskShow.bgColor || '#fff',
			a: maskShow.bgAlpha || '0.7',
			A: maskShow.bgAlpha ? parseInt(maskShow.bgAlpha * 100) : '70'
		});
		document.body.appendChild(mask);
		maskShow.mask = mask;
	}
	function checkVisib(el){
		var sty=el.style;
		sty.position='absolute';
		sty.left = '-10000px';
		sty.top = '-10000px';
		sty.visibility='visible';
		sty.display='block';
		sty.zIndex=10;
	}
	function rePos(){
		if(!curr) return;
		var ps = $pageSize('doc');
		setRect(mask, ps);
		var rc = centerPos(ps, curr.offsetWidth, curr.offsetHeight);
		if(rc.left < ps.scrollLeft) rc.left = ps.scrollLeft;
		if(rc.top < ps.scrollTop) rc.top = ps.scrollTop;
		setRect(curr, rc);
	}
	function centerPos(ps, cw, ch){
		return {
			left: ((ps.winWidth - cw) >> 1) + ps.scrollLeft + (maskShow.adjustX || 0),
			top: ((ps.winHeight - ch) >> 1) + ps.scrollTop + (maskShow.adjustY || 0)
		};
	}
	function setRect(el,rect){
		var sty=el.style;
		sty.left=(rect.left||0)+'px';
		sty.top=(rect.top||0)+'px';
		if('width' in rect)
			sty.width=rect.width+'px';
		if('height' in rect)
			sty.height=rect.height+'px';
	}
	function show(el,b){
		if(!el) return;
		el.style.visibility = 'visible';
		if(!b){
			el.style.left = -el.offsetWidth - 100 + 'px';
			el.style.top = -el.offsetHeight - 100 + 'px';
		}
	}
})();

//loading效果
$$.module.loading = {
	source: null, //'http://prototype.ui.sh.ctriptravel.com/code_beta/cn/loading/pic_ad.gif|###|hello world',
	backto: null,
	preload: function(d){
		if(d && $type(d) == 'number') this._preload = d;
		this._init.bind(this).delay(this._preload);
	},
	show: function(){
		if(this._visible) return;
		if(!this._panel) this._init();
		if(!this._panel) return;
		this._tmpcolor = maskShow.bgColor;
		this._button.href = this.backto || 'javascript:$$.module.loading.hide()';
		maskShow.bgColor = this._bgcolor;
		maskShow.bgColor = '#666';
		maskShow(this._panel);
		this._roll();
		this._visible = true;
	},
	hide: function(){
		if (_.ActiveXObject) __.execCommand('Stop'); 
		else if(_.stop) _.stop();
		maskShow(null);
		if(this._tmpcolor) maskShow.bgColor = this._tmpcolor;
		clearInterval(this._timer);
		this._visible = false;
	},
	wireup: function(form){
		if(this._wired || !form) return;
		var time_point = 0;
		_.$(form).$r('submit', function(){
			time_point = new Date();
		}, 1);
		_.$r('beforeunload', function(){
			var d = new Date() - time_point;
			if(d > 0 && d < 1000) $$.module.loading.show();
		}, 1);
		this._wired = true;
	},
	_flag: false,
	_timer: null,
	_preload: 12000,
	_panel: null,
	_button: null,
	_color: null,
	_bgcolor: '#666',
	_visible: false,
	_wired: false,
	_template: [
		'<div style="background:#FFFFFF none repeat scroll 0%;border:1px solid #CCDCED;height:453px;">',
		'<h1 style="border-bottom:1px solid #CBDCED;height:85px;margin:0 auto;text-align:center;width:99%"><img src="{$picserver}/common/pic_loading_logo.gif"></h1>',
		'<div style="width:120px;height:12px;overflow:hidden;margin:80px auto 20px;background-image:url({$picserver}/common/pic_loading_progress.gif)">&nbsp;</div>',
		'<p style="color:#cc6600;font-size:14px;font-weight:bold;text-align:center">我们正在处理您的请求，请稍候....</p>',
		'<p style="margin-top:30px"><a style="display:block;width:104px;height:30px;margin:0 auto;background:url({$picserver}/common/btn_loading_cancel.gif) no-repeat 0 0;text-decoration:none;" onmouseover="this.style.backgroundPosition=\'0 -30px\'" onmouseout="this.style.backgroundPosition=\'0 0\'">&nbsp;</a></p>',
		'<p><a target="_blank" href="{$link}"><img style="display:block;margin:0 auto;margin-top:20px;" title="{$title}" alt="{$title}" width="" height="" src="{$img}"></p></div>'
	].join('').replaceWith({'picserver': $picUrl('')}),
	_init: function(){
		if(this._panel || !this.source) return;
		var a = this.source.split('@').random().split('|');
		var p = document.createElement('div');
		p.style.cssText = 'width:556px;background:#d9e6f7;border:1px solid #b1cbe4;height:455px;padding:5px;'
			+ 'position: absolute; left:-1000px; top:-1000px; z-index: 20;';
		p.innerHTML = this._template.replaceWith({img: a[0], link: a[1], title: a[2] || ''});
		$$.status.container.appendChild(p);
		this._panel = p;
		this._button = $(p).$('a')[0];
	},
	_roll: function(){
		var f = 0, t = 120, d = 20, i = 300;
		var s = $(this._panel).$('div')[1].style;
		clearInterval(this._timer);
		var x = new Date(), o = -1;
		this._timer = setInterval(function(){
			var c = (Math.floor((new Date() - x) / i) * d) % (t - f) + f;
			if(c != o){
				o = c;
				s.backgroundPosition =  c + 'px 0';
			}
		}, 40);
	}
};
Ctrip.module.loading = function(el){
	var l = $$.module.loading;
	if(l._flag || !(l._flag = true)) return;

	var s = el.getAttribute('mod_loading_source');
	if(s) l.source = s;

	var b = el.getAttribute('mod_loading_backto');
	if(b) l.backto = b;

	var p = parseInt(el.getAttribute('mod_loading_preload'));
	if(isNaN(p)) p = null;

	var j = el.getAttribute('mod_loading_sourcescript');
	if(j) $loadJs.pass(j, null, l._init.bind(l)).delay(p || 1);
	else if(p) l.preload(p);

	var w = el.getAttribute('mod_loading_wireup');
	if(w.toLowerCase() == "true") l.wireup(el.tagName == 'FORM' ? el : (el.form || document.aspnetForm));
};
