(function(window, jQuery, undefined){

var 
    DEFAULT_CHECKER_NAME = "DEFAULT_CHECKER",
    DEFAULT_CHECKER_MESSAGE = "THANK_YOU_FOR_CHOICE"
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

var Rule = function(ruler, config){
    this._init(ruler, config);
};

Rule.prototype = {
    _init: function(ruler, config){
        var type = Type(ruler),
            self = this;

        if (type === "S") {
            self._l = Trim(ruler).split(/ +/);
        } else {
            self._l = type === "A" ? ruler : [];      
        }

        config = config || {};

        self._oncheck = config.oncheck || Noop;
        self._onchecked = config.onchecked || Noop;
        self._ontimeout = config.ontimeout || Noop;
        self._timeout = parseInt(config.timeout, 10) || 0;

        // used checker
        self._t = [];
        // current checker
        self._c = null;
        // deferred object
        self._d = null;
        // result of check 0 false 1 true -1 checking
        self._r = -1;
        // checker index;
        self._i = -1;
    },
    _getNext: function(){
        var self = this,
            i = self._i + 1;

        self._c = Checkers[self._l[i]];
        self._i = i;

        return self._c;
    },
    _checkNext: function(){
        // var next = this._getNext();

        // if(next){
        //     next.check(this._val, this);
        //     return true;
        // }

        // return false;
    },
    start: function(){

        var self = this;
        
        self._d = Deferred().done(function(T){

            self._onchecked(T, self._c.message);

            self._r = Number(T);
        
        });

        self._c = null;
        self._r = -1;
        self._i = -1;

        self._checkNext();

    },
    next: function(T){
        var self = this;

        self._t.push();
    },
    result: function(T){},
    end: function(T){},
    reset: function(ruler, config){}
};



})(this, jQuery);