(function(){
	
var validFunc = {
	
	/***
	 * 值:
	 * 1 无错误 
	 * -1 长度错误
	 * -2 验证错误 
	 */
	ID : function( num ) {	

    	num = num.toUpperCase();  
    	
    	//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。   
    	if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) { 
    		return -1; 
    	}
    	
		//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
		//下面分别分析出生日期和校验位 
    	
    	var len, re; 
    	len = num.length; 
    	if (len == 15) {
    		
			re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/); 
			var arrSplit = num.match(re); 

			//检查生日日期是否正确 
			var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]); 
			var bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4])); 
			
			if (!bGoodDay) { 
				return -2; 
			} else {				
				return 1;
			}   
    	}
    	
    	if (len == 18) {
    		
    		re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/); 
    		var arrSplit = num.match(re); 

    		//检查生日日期是否正确 
    		var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]); 
    		var bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4])); 

    		if (!bGoodDay) { 
    			return -2; 
    		} else { 
				//检验18位身份证的校验码是否正确。 
				//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
				var valnum; 
				var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); 
				var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); 
				var nTemp = 0, i; 
				for(i = 0; i < 17; i ++) { 
					nTemp += num.substr(i, 1) * arrInt[i]; 
				} 
				
				valnum = arrCh[nTemp % 11];
				
				if (valnum != num.substr(17, 1)) { 
					return -2; 
				} 
				
				return 1; 
    		} 
    	}
    	
    	return -2; 
		
	}
	
};

$.fn.createJvalidator = function(){
	return $(this).jvalidator({
		validation_events : ['focus','blur','keyup'], 
		on : {
			invalid : function( evt , el , patterns ){
				$("#" + el.id + "_tip").text(patterns[0].message).show();
			} , 
			valid : function( evt , el ){
				$("#" + el.id + "_tip").hide();
			}
		}
	});
};


$.jvalidator.addPattern({
	name : 'strangeword',
	message : '输入中含有生僻字，请换成拼音',
	validate : function(val, validationCallback ){  
		val = $.trim(val);
		if( val == "" ) {
			validationCallback(true); 
			return;
		}
		if ($.trim(val) == "") { 
			validationCallback(false); 
		} else {
			
			$.ajax({
				url: 'http://ws.qunar.com/cnCheck.jsp',
				data: {
					p: val
				},
				dataType: 'jsonp',
				jsonp: 'callback',
				cache: false,
				success: function(data){
					var has = false;
					$(data.result).each(function(idx, val){
						if (val.t == '1') {
							has = true;
							return false;
						}
					});
					validationCallback(!has);
				}
			});
		}
        
    }
});

//name&afterCh1&afterCh2&afterEn1&afterEn2&afterEn3&toolong
$.jvalidator.addPattern({
	name : 'name',
	message : '请输入正确姓名',
	validate : function(val, validationCallback ){  
		val = $.trim(val);
		if( val == "" ) {  validationCallback(true);  return; }
		validationCallback( /^([\u4e00-\u9fa5]|[a-z]).*$/i.test( val ) );
    }
});
 
$.jvalidator.addPattern({
	name : 'afterCh1',
	message : '姓名中不能包含特殊字符',
	validate : function(val, validationCallback ){   
		val = $.trim(val);
		if( val == "" ) {  validationCallback(true);  return; }
		if ( !/^[\u4e00-\u9fa5].*$/i.test( val ) ) {
			validationCallback( true ); 
		} else {
			var reg = /([\u4e00-\u9fa5]|[a-z])/i;
			for ( var i = 0; i < val.length; i++ ) { 
				if ( !reg.test( val.charAt(i) ) ){ 
					validationCallback( false );
					return;
				}
			}
			validationCallback( true );
		} 
    }
}); 

$.jvalidator.addPattern({
	name : 'afterCh2',
	message : '您输入的格式不正确，拼音后面不能再输入汉字，请用拼音替代',
	validate : function(val, validationCallback ){   
		val = $.trim(val);
		if( val == "" ) {  validationCallback(true);  return; }
		if ( !/^[\u4e00-\u9fa5].*$/i.test( val ) ) {
			validationCallback( true );
		} else {
			if ( !/^([\u4e00-\u9fa5]+[a-z]+|[\u4e00-\u9fa5]+)$/i.test( val ) ){
				validationCallback( false );
			} else {
				validationCallback( true );
			}
		}
				
		
    }
});

$.jvalidator.addPattern({
	name : 'deny_empty',
	message : '不能为空',
	validate : function(val, validationCallback ){   
		val = $.trim(val);
		validationCallback( $.trim(val) != "" ); 
    }
});

$.jvalidator.addPattern({
	name : 'afterEn1',
	message : '姓名过短，请输入正确姓名',
	validate : function(val, validationCallback ){ 
		val = $.trim(val);  
		if( val == "" ) {  validationCallback(true);  return; }
		if (/^[\u4e00-\u9fa5].*$/i.test(val)) {
			validationCallback(true);
		} else {
			if (val.replace('/', '').length < 3) {
				validationCallback(false);
			}
			else {
				validationCallback(true);
			}
		}
    }
});


$.jvalidator.addPattern({
	name : 'afterEn2',
	message : '英文后不能使用汉字。',
	validate : function(val, validationCallback ){
		val = $.trim(val);
		if( val == "" ) {  validationCallback(true);  return; }
		if (/^[\u4e00-\u9fa5].*$/i.test(val)) {
			validationCallback(true);
		} else {
			if (/^[a-z\/]*[\u4e00-\u9fa5]+[a-z\/]*$/i.test(val)) {
				validationCallback(false);
			}
			else {
				validationCallback(true);
			}
		}
    }
});

$.jvalidator.addPattern({
	name : 'afterEn3',
	message : '请您按照登机时所持证件上的姓名填写。英文请在姓与名之间用”/”分隔。',
	validate : function(val, validationCallback ){   
		val = $.trim(val);
		if( val == "" ) {  validationCallback(true);  return; }
		if (/^[\u4e00-\u9fa5].*$/i.test(val)) {
			validationCallback(true);
		}
		else {
			if (!/^[a-z]+\/[a-z]+$/i.test(val)) {
				validationCallback(false);
			}
			else {
				validationCallback(true);
			}
		}
    }
});

$.jvalidator.addPattern({
	name : 'toolong',
	message : '姓名过长',
	validate : function(val, validationCallback ){
		val = $.trim(val);
		if( val == "" ) {  validationCallback(true);  return; }
		var len = 0;
		var chreg = /[\u4e00-\u9fa5]/i;
		var enreg = /[a-z]/i;
		
		for ( var i = 0; i < val.length; i++ ){
			if ( chreg.test( val[0] ) ){
				len += 2;
			}
			if ( enreg.test( val[1] ) ){
				len += 1;
			}
		}
		
		if ( len > 32 ) {
			validationCallback( false );
		} else {
			validationCallback( true );
		}
    }
});

$.jvalidator.addPattern({
	name : 'long50',
	message : '邮箱长度不能超过50个字符。',
	validate : function(val, validationCallback ){
		val = $.trim(val);
		if( val == "" ) {  validationCallback(true);  return; }
		var len = 0;
		var chreg = /[\u4e00-\u9fa5]/i;
		var enreg = /[a-z]/i;
		
		for ( var i = 0; i < val.length; i++ ){
			if ( chreg.test( val[0] ) ){
				len += 2;
			}
			if ( enreg.test( val[1] ) ){
				len += 1;
			}
		}
		
		if ( len > 50 ) {
			validationCallback( false );
		} else {
			validationCallback( true );
		}
    }
});


$.jvalidator.addPattern({
	name : 'email',
	message : '错误的邮箱格式',
	validate : function(val, validationCallback ){   
		val = $.trim(val);
		if( val == "" ) {  
			validationCallback(true);  
			return; 
		}
		if ( /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test( val ) ){
			validationCallback( true );
		} else {
			validationCallback( false );
		}
    }
});


$.jvalidator.addPattern({
	name : 'id',
	message : '身份证号码错误',
	validate : function(val, validationCallback ){    
		val = $.trim(val);
		if( val == "" ) {  validationCallback(true);  return; }
		validationCallback( validFunc.ID(val) == 1 ); 
    }
});

$.jvalidator.addPattern({
	name : 'adult',
	message : '年龄必须大于12周岁',
	validate : function(val, validationCallback ){    
		val = $.trim(val);
		if( val == "" ) {  validationCallback(true);  return; }
		
		if( val.length == 18 ){
			var n = val.substr(6,8);
		} else {
			var n = '19' + val.substr(6,6);
		}
		
		var date = n.substr(0,4) + '-' + n.substr(4,2) + '-' + n.substr(6,2);
		 
		try{
			var _b = new Date( date.replace(/-/g,'/') ).getTime(); 
			var diff = ( new Date() - _b ) / 24 / 60 / 60 / 1000 / 365;

			//大于12岁
			if ( diff > 12 ) {
				validationCallback( true ); 
			} else { 
				validationCallback( false ); 
			}
			
		} catch(ex){
			validationCallback( false ); 
		}	
		
    }
});

$.jvalidator.addPattern({
	name : 'passport',
	message : '护照格式错误或过长',
	validate : function(val, validationCallback ){
		val = $.trim(val);
		if( val == "" ) {  validationCallback(true);  return; }
		validationCallback( /^[a-zA-Z0-9]{0,20}$/i.test( val ) ); 
    }
});

$.jvalidator.addPattern({
	name : 'other',
	message : '证件号码格式错误或过长',
	validate : function(val, validationCallback ){    
		val = $.trim(val);
		if( val == "" ) {  validationCallback(true);  return; }
		validationCallback( /^[a-zA-Z0-9]{0,50}$/i.test( val ) ); 
    }
});

$.jvalidator.addPattern({
	name : 'mobile',
	message : '手机号码格式错误',
	validate : function(val, validationCallback ){    
		val = $.trim(val);
        
		if( val == "" ) {  validationCallback(true);  return; }
		validationCallback(  /^(13|15|18|14)\d{9,9}$/.test( val ) ); 
    }
});

$.jvalidator.addPattern({
	name : 'allow_empty',
	message : '允许为空',
	validate : function(val,cb){
		val = $.trim(val);
		cb( $.trim(val) == "" );
	}
});

})();
