(function(window, jQuery, undefined){

var 
    DEFAULT_CHECKER_NAME = "DEFAULT_CHECKER",
    DEFAULT_CHECKER_MESSAGE = "THANK_YOU_FOR_CHOICE",
    VALID_SUFFIX = ".jvalid",
    VALID_NAME = "jvalid",
    VALID_SELECTOR = "[data-jvalid]"
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

var Rule = function(ruler, text, config){
    this._init(ruler, text, config);
};

Rule.prototype = {
    _init: function(ruler, text, config){
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

    },
    _getNext: function(){
        var self = this,
            i = self._i + 1;

        self._c = Checkers[self._l[i]];
        self._i = i;

        return self._c;
    },
    _checkNext: function(){
        var self = this;
            next = self._getNext();

        if(next){
            next.check(self._txt, this);
            self._checked();
            return true;
        }

        return false;
    },
    _checked: function(){
        var self = this,
            key = self._c.name;

        self._t[key] = 1;
    },
    _isChecked: function(){
        var self = this,
            key = self._c.name;

        return !!self._t[key];
    },
    start: function(){

        var self = this;
        
        self._d = Deferred().done(function(T){

            if (T === -2) {
                self._ontimeout(T);
            } else {
                self._onchecked(T, self._c.message);
            }

            self._r = Number(T);
        
        });

        // used checker
        self._t = [];
        // deferred object
        self._d = null;
        // string to check
        self._txt = text;
        // current checker
        self._c = null;
        // result of check 0 false 1 true -1 checking -2 timeout
        self._r = -1;
        // checker index;
        self._i = -1;

        self._oncheck();

        if (self._timeout) {
            setTimeout(function(){
                if (self._r === -1) { 
                    self.end(-2);
                }
            }, self._timeout);
        }

        self._checkNext();

    },
    next: function(T){
        var self = this;

        if(self._isChecked()){ return; }

        if(!self._checkNext()){
            self.end(T);
        }
    },
    result: function(T){
        var self = this;

        if(self._isChecked()){ return; }

        T ? self._checkNext() : self.end(T);
        
    },
    end: function(T){
        var self = this;

        if (self._r !== -1) { return; }

        if(self._isChecked()){ return; }

        self._d.resolve(T);
    }
};


// _bindEvents: function(){

//     var self = this;

//     if(self._jquery[0].oninput === null){
//         self._jquery.bind("input" + EVENT_SUFFIX, function(){ self.check(); }); 
//     } else {
//         self._intervalCheck(function(){ self.check(); });
//     }

//     self._jquery.bind("focus" + EVENT_SUFFIX, function(){ self.check(); });
//     self._jquery.bind("blur" + EVENT_SUFFIX, function(){ self.check(); });
// },
// _intervalCheck: function(func){
    
//     var self = this,
//         data = "";

//     self._jquery.bind("focus" + EVENT_SUFFIX, function(){
//         self._timer = setInterval(function(){

//             var v = self._jquery.val();

//             if(data !== v){ func(); data = v; }
            
//         }, 100);
//     });

//     self._jquery.bind("blur" + EVENT_SUFFIX, function(){ clearInterval(self._timer); });
// }

function Group(){

}

Group.prototype = {
    checkAll: function(){

    }
}

/**
 * if jquery collection longer then 1, needs loop to fetch Group instance,
 * because use data method. 
 */

jQuery.fn.jvalid = function(config){
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

    this.each(function(){
        var self = $(this);

        if (!self.is("form")) {
            return;
        }

        self.data("jvalid", new Group(this, config));

        // self.delegate(VALID_SELECTOR, "focusin" + VALID_SUFFIX, function(e){
        //     if (!checkNeeds(e.target)) {
        //         return;
        //     }

        // }).delegate(VALID_SELECTOR, "focusout" + VALID_SUFFIX, function(e){

        // });

    });

    return this;
};



})(this, jQuery);