if(typeof QNR === 'undefined'){
	var QNR = {};
}

QNR.authCode = (function(window){
	var $ = function(id){
		return document.getElementById(id);
	};
	
	var ERR = "At least privide an DOM container or her ID";
	
	var _default = {
		imgSize: '1',
		challengeURI: 'http://192.168.126.112:8088/recaptcha-core/api/challenge',
		imgURI: 'http://192.168.126.112:8088/recaptcha-core/api/image',
		imgID: 'vcodeImg',
		imgClass: 'vcodeImg',
		linkID: 'vcodeLink',
		linkClass: 'vcodeImg',
		linkText: '看不清？换一张',
		inputName: 'vcodeInput',
		interval: 500
	};
	
	var _template = '<img {#imgID} {#imgClass} src="{#imgURI}"> <a {#linkID} {#linkClass} href="javascript:;">{#linkText}</a><input type="hidden" {#inputName} value="{#challenge}" />';
	
	var container, config, timer = 0, appCode;
	
	var authCode = function(elem, applicationCode, conf){
		
		container = checkElement(elem);
		
		if(!container){
			throw ERR;
		}
		
		appCode = applicationCode;
		
		config = merge({}, _default, conf || {});
		requestAuthCode(config.challengeURI, applicationCode);
	};
	
	authCode["callback"] = function(id){
			
		container.innerHTML = printf(_template, {
			imgID: config.imgID ? 'id="' + config.imgID + '"' : "",
			imgClass: config.imgClass ? 'class="' + config.imgClass + '"' : "",
			imgURI: config.imgURI + "?c=" + id + "&t=" + config.imgSize,
			linkID: config.linkID ? 'id="' + config.linkID + '"' : "",
			linkClass: config.linkClass ? 'class="' + config.linkClass + '"' : "",
			challenge: id,
			inputName: config.inputName ? 'name="' + config.inputName + '"' : "",
			linkText: config.linkText
		});
		
		listen($(config.imgID), "click", handleClick);
		listen($(config.linkID), "click", handleClick);
	};
	
	function handleClick(){
		if(checkTimer()){
			requestAuthCode(config.challengeURI, appCode);
		}
	}
	
	function checkTimer(){
		if(timer){
			return false;
		} else {
			timer = setTimeout(function(){
				timer = 0;
			}, config.interval);
			return true;
		}
	}
	
	function isInt(str){
		return parseInt(str, 10).toString() === str;
	}
	
	function printf(str, obj){
		return str.replace(/\{#(\w+)\}/g, function(s, k){
			return k in obj ? obj[k] : s;
		});
	}
	
	function checkElement(elem){;
		
		if(elem == null){
			return null;
		} else if (typeof elem === "string") {
			return $(elem);
		} else if (elem.jquery){
			return elem.length ? elem[0] : null;
		}
		
		return elem || null;
	}
	
	function merge(origin){
		
		var list = Array.prototype.slice.call(arguments, 1),
			temp = null;
		
		for(var j = 0, len = list.length; j < len; j++){
			temp = list[j];
			for(var i in temp){
				if(temp.hasOwnProperty(i)){
					origin[i] = temp[i];
				}
			}
		}
		
		return origin;
	}
	
	function requestAuthCode(url, key){
		var sp = "?", 
			index = url.indexOf("?");
			
		if( index === url.length - 1){
			sp = "";
		} else if( index >=0 ){
			sp = "&";
		}
		
		url = url + sp + "k=" + key + "&timestamp=" + (+new Date());
		
		sendRequest(url, {charset: "utf-8"});
	}
	
	function sendRequest(url, conf){
		var charset = conf.charset,
			heads = document.getElementsByTagName("head"),
			container = heads ? heads[0] : document.documentElement;
			
		var script = document.createElement("script");
			script.type = 'text/javascript';
			
		if(charset){
			script.charset = charset;
		}
		
		script.src = url;
		container.insertBefore(script, container.firstChild);
		
		return script;
	}
	
	function listen(el, evt, fn){
		if(el.addEventListener){
			el.addEventListener(evt, fn, false);
		} else {
			el.attachEvent("on" + evt, fn);
		}
	}
	
	return authCode;
	
})(this);