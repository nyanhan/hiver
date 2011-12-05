if (typeof QNR === "undefined") {
    QNR = {};
}

QNR.template = (function() {

    var _ = { _filters: {
        
    }};

    _.escape = function(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
    };

    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%:([\s\S]+?)%>/g
    };

    _.tmpl = function(str, data, print) {
        var c = _.templateSettings;
        
            _._template_ = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};__p.push(\'' +
                str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
                .replace(c.escape, function(match, code) {
                    return "',_.escape(" + code.replace(/\\'/g, "'") + "),'";
                }).replace(c.interpolate, function(match, code) {
                    return "'," + code.replace(/\\'/g, "'") + ",'";
                }).replace(c.evaluate, function(match, code) {
                    return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, '') + ";__p.push('";
                }).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + "');return __p.join('');";

        return data ? _.render(data, print) : _;
    };
    
    _.render = function(data, print){
        if (!data) {
            data = {};
        }

        var ks = [],
            vs = [],
            l, f, s;

        for (var k in data) {
            l = ks.length;
            ks[l] = k;
            vs[l] = data[k];
        }

        l++;
        ks[l] = '_';
        vs[l] = _;
        
        s = 'f = function(' + ks.join(",") + '){' + _._template_ + '}';
        
        if (print) {
            return s;
        } else {
            eval(s);
            return f.apply(data, vs);
        }
    };
    
    _.filters = function(){
        return _._filters;
    };
    
    _.addFilter = function(name, func){
        _._filters[name] = func;
        return _;
    };
    
    _.removeFilter = function(name, func){
        delete _.filters[name];
        return _;
    };

    return _;

})();
