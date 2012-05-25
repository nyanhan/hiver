jQuery.inherit = function(sub, sup){
	sup = sup || Object;

	var F = function(){};
	F.prototype = sup.prototype;

	sub.prototype = new F();
	sub.prototype.constructor = sub;
	sub.superClass = sup.prototype;

	if(sup.prototype.constructor === Object.prototype.constructor){
		sup.prototype.constructor = sup;
	}
};

