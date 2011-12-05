$.extend({
	jvalidator: {
		 
		PATTERN : {} ,
		
		LOG : [],
		
		addPattern : function( pattern ) {
			if(!pattern.name) return;
			$.jvalidator.PATTERN[pattern.name] = pattern;
		},
		
		log : function(text){
			$.jvalidator.LOG.push(text);
		}
		
	}
});
 
//-------

var jvalidatorGroup = function( setting ){
	this.setting = setting;
	this._jvs = []; 
	this._selector = null;
	this.async = new AsyncRequest();
}

jvalidatorGroup.prototype.refresh = function(){
	
	if( !this._selector ) return;
	
	var self = this;
	
	this._jvs = [];
	
	$( this._selector ).each(function(){
		
		var jv = $(this).data('jvalidator');
		
		if( !jv ) {
			jv = new jvalidator( this , self.setting );
			$(this).data('jvalidator',jv);
		}
		
		self._jvs.push( jv );  
		
	});

}

jvalidatorGroup.prototype.append = function( selectors ){

	if( !selectors ) return;

	this._selector = this._selector ? this._selector.add( selectors ) : selectors;
	
	this.refresh();

}

jvalidatorGroup.prototype.remove = function( selectors ){

	if( !selectors ) return;
	
	if( this._selector ){
	
		this._selector = this._selector.not( selectors );
		
		this.refresh();
	
	}
	
}
 
jvalidatorGroup.prototype.validateAll = function(validateAllCallback){
	
	var self = this;
	var jvs = this._jvs;
	var async = this.async;
	var all = true;
			
	async.clear();
	async.onfinished = function(){
		if(validateAllCallback){ 
			validateAllCallback(all); 
		}
	}
	
	//check all empty 
	var isAllEmtpy = true;
	for( var i = 0; i < jvs.length; i++ ) {
		var item = jvs[i];
		if( item && item.exists() ) {
			isAllEmtpy = false;
		}
	}
	
	if( isAllEmtpy ) {
		
		if( validateAllCallback ) {
			validateAllCallback(all); 
		}

	} else {
	
		for(var i=0; i<jvs.length; i++){
			
			var jv = jvs[i];
			
			if( !jv || !jv.exists() ) continue;
			
			(function(jv){
			
				async.addRequest(function(async_continue){
					jv.check(function( checkResult ){
						if(!checkResult){ all = checkResult; }
						async_continue();
					});
				});
			
			})(jv);
		}

		async.go();
	
	}
	
} 

//----
  
var jvalidator = function( el , setting ){
	var self = this;
	this.invalid_pattern = [];
	this.el = el;
	this.setting = setting;
	this.async = new AsyncRequest();
	
	//validation_events
	var validation_events = this.setting['validation_events'] || [];
	$.each( validation_events , function(idx,evtName){
		$(el).bind( evtName , function(evt){ 
			switch( evt.type ){
			    case 'keyup':
			    case 'keydown':
				    //ctrl , alt , shift , 方向键
					//ctrl + a 
					//不进行check
				    if ( evt.keyCode == 17 || evt.keyCode == 18 || evt.keyCode == 16 || 
					     evt.keyCode == 37 || evt.keyCode == 38 || evt.keyCode == 39 || evt.keyCode == 40 ||
					     evt.ctrlKey || evt.altKey || evt.shiftKey 
					) {  
						return false;
					} else {
						self.check();
					}
				    break;
				default:
				    self.check();
				    break;
			}
			
		});
	});
	
	//custom events
	var on_events = this.setting['on'] || {};
	$.each( on_events , function( key , value ){ 
		$(self).bind( key , value );
	});
	
	//blur and focus
	$(el).blur(function(){
	   $(self).trigger('blur'); 
	});
	
}

//判断是否还在ＤＯＭ树内，
jvalidator.prototype.exists = function(){
	return jQuery(this.el).closest('body').size();
}

jvalidator.prototype._checkPattern = function(resultTable){
	var $el = $(this.el);
	var pattern = $el.attr("data-jvalidator-pattern") || "";
			
	var code = pattern.replace(/ /g,'').replace(/\|/g,'||').replace(/\&/g,'&&');
		code = code.replace(/([^|&\(\)]+)/g, function(str, v1) {
			return ( typeof resultTable[v1] != 'undefined' ) ? resultTable[v1] : "true";
		});

	return eval(code);
}

jvalidator.prototype.check = function( checkCallback ){
	
	var self = this;
	var $el = $(this.el);
	var async = this.async;
	var patternstr = ( $el.attr("data-jvalidator-pattern") || "" ).replace(/\(/g,'').replace(/\)/g,'').replace(/\|/g,',').replace(/\&/g,',');
	var patterns = patternstr ? patternstr.split(',') : [];
	var val = $el.val();
	var resultTable = {};
	this.invalid_pattern = [];

	async.clear();
	async.onfinished = function(requestResult){
		var valid = self._checkPattern(resultTable);
		if ( checkCallback ) { checkCallback( valid ); }
		self.after_check( valid , patterns );
	}

	for(var i=0; i<patterns.length; i++){
		var pname = $.trim( patterns[i] );
		var p = $.jvalidator.PATTERN[pname];
		if(!p) { 
			$.jvalidator.log('找不到模式['+pname+']');
			continue; 
		}

		(function(p,pname){
					
		async.addRequest(function(async_continue){
			p.validate.call( self.el , val , function( valid , message ){
				if(!valid){
					p.message = message || p.message;
					self.invalid_pattern.push(p);
				}
				resultTable[pname] = valid;
				async_continue();
			});
		});
		
		})(p,pname);
	}
	
	async.go();
	
}

jvalidator.prototype.after_check = function( valid , patterns ) { 
	if ( valid ) {
		$(this).trigger('valid', [ this.el ] );
	} else {
		var p = patterns.join(',');
		this.invalid_pattern.sort(function(a,b){
			return p.indexOf( a.name ) - p.indexOf( b.name );
		});
		$(this).trigger('invalid', [ this.el, this.invalid_pattern ] );
	}
}

//-----

$.fn.jvalidator = function( setting ){

	setting = $.extend({ 
	}, setting || {});

	var group = new jvalidatorGroup( setting );
	
	group.append( this ); 
	
	return group;
}
