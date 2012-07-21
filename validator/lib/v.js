(function(window, jQuery, undefined){

var 
    DEFAULT_CHECKER_NAME = "DEFAULT_CHECKER",
    DEFAULT_CHECKER_MESSAGE = "THANK_YOU_FOR_CHOICE",
    DEFAULT_JVALID_NAME = "jvalid",
    DEFAULT_JVALID_SUFFIX = ".jvalid",
    DEFAULT_JVALID_RULER = "jvalid-ruler",
    DEFAULT_JVALID_SELECTOR = "[data-jvalid-ruler]"
;
    

// require jQuery 1.5.2 or above.
var Deferred = jQuery.Deferred,
    Trim = jQuery.trim,
    Noop = jQuery.noop,
    Each = jQuery.each,
    Log = (typeof console !== "undefined") ? console.log : Noop,
    Type = function(s){ return Object.prototype.toString.call(s).slice(8, 9); },
    Checkers = {};

function set_checker (checker){
    if (checker && checker.name) {

        var name = checker.name;

        if (Checkers[name]) {
            Log("Checker " + name + " has been override.");
        }

        Checkers[name] = checker;
    }
}

function get_checker (name) {
    return Checkers[name];
}

jQuery.extend({
    checker: {
        addItem: set_checker,
        getItem: get_checker
    }
});

Checkers[DEFAULT_CHECKER_NAME] = {
    name: DEFAULT_CHECKER_NAME,
    message: DEFAULT_CHECKER_MESSAGE,
    check: function(str, rule){
        rule.result(true);
    }
};

var Rule = function(){};

Rule.prototype = {
    _getNext: function(){
        var self = this,
            i = self._i + 1;

        self._c = Checkers[self._l[i]];
        self._i = i;

        return self._c;
    },
    _checkNext: function(){
        var self = this;

        if(self._isChecked()){ return; }

        var next = self._getNext();

        if(next){
            next.check(self._txt, this);
            return true;
        }

        return false;
    },
    _checked: function(){
        var self = this;
        
        if (!self._c) {
            return;
        }

        var key = self._c.name;

        self._t[key] = 1;
    },
    _isChecked: function(){
        var self = this;

        if (!self._c) {
            return false;
        }
        
        var key = self._c.name;

        return !!self._t[key];
    },
    _formatRuler: function(ruler){
        var type = Type(ruler),
            self = this;

        if (type === "S") {
            self._l = Trim(ruler).split(/ +/);
        } else {
            self._l = type === "A" ? ruler : [];      
        }

    },
    check: function(ruler, text, config){
        var self = this;

        config = config || {};

        self._oncheck = config.oncheck || Noop;
        self._onchecked = config.onchecked || Noop;
        self._ontimeout = config.ontimeout || Noop;
        self._timeout = parseInt(config.timeout, 10) || 0;

        self._formatRuler(ruler);

        // used checker
        self._t = [];
        // deferred
        self._d = Deferred();
        // string to check
        self._txt = text;
        // current checker
        self._c = null;
        // result of check 0 false 1 true -1 checking -2 timeout
        self._r = -1;
        // checker index;
        self._i = -1;

        self._oncheck();

        // attach promise but no resolve to this
        self._d.promise(self);

        self.done(function(T){
            
            if (T === -2) {
                self._ontimeout(T);
            } else {
                self._onchecked(T, self._c ? self._c.message : "");
            }

            self._r = Number(T);
        
        });

        if (self._timeout) {
            setTimeout(function(){
                if (self._r === -1) { 
                    self.end(-2);
                }
            }, self._timeout);
        }

        self.next(true);

    },
    status: function(){
        return this._r;
    },
    next: function(T){
        var self = this;

        if(!self._checkNext()){
            self.end(T);
        }
        self._checked();
    },
    result: function(T){
        var self = this;

        if(T && self._checkNext()){
            return;
        } else {
            self.end(T);
        }
        
        self._checked();
    },
    end: function(T){
        var self = this;

        if (self._r !== -1) { return; }

        self._d.resolve(T);
    }
};

jQuery.jvalid = function(input, config){
    /**
     * oncheck
     * onchecked
     * ontimeout
     * timeout
     */
    
    var self = $(input);

    if (!self.is("select,textarea,input") || self.is(":disabled") || !self.is(":visible")) {
        return;
    }

    var rule = self.data(DEFAULT_JVALID_NAME);

    if (!rule) {
        rule = new Rule();
        self.data(DEFAULT_JVALID_NAME, rule);
    }

    var ruler = self.data(DEFAULT_JVALID_RULER);

    rule.check(ruler, self.val(), config);

    return rule;
};

var config_keys = "oncheck onchecked ontimeout timeout";

jQuery.fn.jvalidForm = function(config){
    /**
     * oncheck
     * onchecked
     * ontimeout
     * timeout
     * each_oncheck
     * each_onchecked
     * each_ontimeout
     * each_timeout
     */
    
    config = config || {};
    
    var groupConfig = {},
        eachConfig = {};

    $.each(config_keys.split(" "), function(i, item){
        if (config[item]) {
            groupConfig[item] = config[item];
        }

        if (config["each_" + item]) {
            eachConfig[item] = config["each_" + item];   
        }
    });

    this.each(function(){
        var self = $(this);

        if (!self.is("form")) {
            return;
        }

        self.delegate(DEFAULT_JVALID_SELECTOR, "focusin" + DEFAULT_JVALID_SUFFIX, function(e){

            var target = e.target, 
                jTar = $(target);

            jQuery.jvalid(target, eachConfig);

            var data = jTar.val();

            var rule = jTar.data(DEFAULT_JVALID_NAME);

            rule._timer_ = setInterval(function(){

                var v = jTar.val();

                if(data !== v){ 
                    jQuery.jvalid(target, eachConfig);
                    data = v;
                }
                
            }, 100);

        }).delegate(DEFAULT_JVALID_SELECTOR, "focusout" + DEFAULT_JVALID_SUFFIX, function(e){
            
            var target = e.target, 
                jTar = $(target);

            jQuery.jvalid(target, eachConfig);

            var rule = jTar.data(DEFAULT_JVALID_NAME);

            clearInterval(rule._timer_);

            delete rule._timer_;
        });

    });

    return this;
};

})(this, jQuery);