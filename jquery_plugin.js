(function(window) {
    var search = window.location.search,
        doc    = window.document,
        html   = doc.documentElement;

    if (search.indexOf("debug=true=lite") >= 0) {
        html.setAttribute("debug", "true");
        doc.write('<script src="tools/firebug-lite/build/firebug-lite.js"></script>');
    }

})(this);

(function(window) {

    var $ = window.jQuery;

    if (typeof $ !== 'function' || $().jquery < "1.5.2") {
        throw "This package depends on jQuery 1.5.2 or later !";
    }

    var doc      = window.document,
        html     = doc.documentElement,
        body     = doc.body,
        location = window.location,
        PREFIX   = "as",
        VOID     = function(){};

    $.assembly = {};

    var asContainer = $('<div id="asContainer" class="asContainer" style="height:0;"></div>')[0];
    body.insertBefore(asContainer, body.firstChild);

    var zoomTester = doc.createElement("div");
    zoomTester.style.cssText = "position:absolute;top:-10000px;width:100px;height:100px";
    asContainer.appendChild(zoomTester);


    var reURL    = (/^([^:\s]+):\/{2,3}([^\/\s:]+)(?::(\d{1,5}))?(\/[^\?\s#]+)?(\?[^#\s]+)?(#[^\s]+)?/),
        reSearch = (/(?:[\?&])(\w+)=([^#&\s]*)/g),
        URLLi    = "protocol host port path search hash";


    $.extend({
        $parseURL: function(url) {
            if (!url) {
                url = location.href;
            }

            var arr  = url.match(reURL),
                temp = {};

            $.each(URLLi.split(" "), function(i, item) {
                temp[item] = arr[i];
            });

            return temp;
        },
        $parseSearch: function(search) {
            if (!search) {
                search = location.search;
            }

            var temp = {};

            search.replace(reSearch, function(a, f, s) {
                temp[f] = s;
            });

            return temp;
        },
        $printf: function(str, obj) {
            return str.replace(/\{#(\w+)\}/g, function(s, k) {
                return k in obj ? obj[k] : s;
            });
        },
        $defined: function(name, constructor, config) {
            $.assembly[name] = constructor;

            constructor.prototype.assemblyName = name;
            constructor.prototype.PREFIX = [PREFIX, name, ""].join("-");
            constructor.prototype.constructor = constructor;

            $.extend(constructor.prototype, config || {});

            return constructor;
        }
    });
    
    $.fn.extend({
        $highLight: function() {
            var self = this,
                win  = $(window),
                p    = self.$zoomOffset(),
                v    = { width: win.width(), height: win.height() };

            win.scrollLeft(p.left - v.width / 4);
            win.scrollTop(p.top - v.height / 4);

            if (self.focus) {
                self.focus();
            }
        },
        $zoomOffset: function() {
            var offset = this.offset(),
                top    = offset.top,
                left   = offset.left,
                zoom   = 1,
                tester = zoomTester || body;

            if (tester && tester.getBoundingClientRect) {
                var bound = tester.getBoundingClientRect();
                    zoom  = parseFloat(Math.round(((bound.right - bound.left) / tester.clientWidth) * 100)) / 100;
                if (isNaN(zoom)) {
                    zoom = 1;
                }
                top  = Math.round(top / zoom);
                left = Math.round(left / zoom);
            }
            return { top: top, left: left, zoom: zoom };
        }
    });


    $.$defined("notice", function(elem, config) {

        var jObj = $.$firstJQueryObject(elem);

        // is input:text has a bug when type=""
        if (!(jObj && (jObj.is("input") && jObj[0].type === "text" || jObj.is("textarea")))) {
            return null;
        }

        var s     = this;
        s._config = config;
        s._jObj   = jObj;
        s._raw    = jObj.css(s.COLOR);
        s._color  = s._conf(s.COLOR) || s.DEFAULTCOLOR;
        s._text   = s._conf(s.TEXT) || s.DEFAULTTEXT;
        s._init();
    }, {
        DEFAULTCOLOR: "#CCC",
        DEFAULTTEXT: "",
        COLOR: "color",
        TEXT: "text",
        _init: function() {
            var self = this,
                jObj = self._jObj;

            jObj.data(self.PREFIX + self.TEXT, self._text);

            jObj.bind("focus.notice", function() {
                self._focusCheck();
            })
                .bind("blur.notice", function() {
                    self.check();
                });

            self.check();
        },
        _conf: function(key) {
            key = key.toLowerCase();
            return this._config[key] || this._getData(key);
        },
        _focusCheck: function() {
            var self = this;
            if (self.isNull()) {
                self._jObj.val("")
                    .css(self.COLOR, self._raw);
            }
        },
        _getData: function(key) {
            return this._jObj.data(this.PREFIX + key);
        },
        check: function() {
            var self = this,
                jObj = self._jObj;

            if (self.isNull()) {
                jObj.css(self.COLOR, self._color)
                    .val(self._text);
            } else {
                jObj.css(self.COLOR, self._raw);
            }
        },
        val: function(value) {
            if (typeof value === "undefined") {
                return this._jObj.isNull() ? "" : this._jObj.val();
            } else {
                this._jObj.val(value);
                this.check();
            }
        },
        isNull: function() {
            var self = this,
                jObj = self._jObj,
                nt   = jObj.data(self.PREFIX + self.TEXT),
                val  = jObj.val();

            return val === "" || ( nt && val === nt );
        },
        distroy: function() {
            var jObj = this._jObj;

            this._focusCheck();

            jObj.unbind(".notice")
                .data(this.PREFIX + this.TEXT, null);

        }
    });

    var _caculateZoomSize = function(r, width, height, zoom) {

        if (!r) {
            return null;
        }

        var midX       = r.left + width / 2,
            midY       = r.top + height / 2,
            fullWidth  = html.scrollWidth,
            fullHeight = html.scrollHeight;

        width *= zoom;
        height *= zoom;

        r.left   = Math.max(0, midX - width / 2);
        r.top    = Math.max(0, midY - height / 2);
        r.right  = Math.min(midX + width / 2, fullWidth);
        r.bottom = Math.min(midY + height / 2, fullHeight);

        return r;
    };

    $.extend({
        $viewSize: function(zoom) {

            var win = $(window);

            var r = {
                left: win.scrollLeft(),
                top: win.scrollTop()
            };

            var width  = win.width(),
                height = win.height();

            return _caculateZoomSize(r, width, height, zoom || 1);
        },
        $firstJQueryObject: function(elem) {

            if (!elem) {
                return null;
            }

            if (elem.jquery) {
                if (elem.length === 1) {
                    return elem;
                }

                return elem[0] ? $(elem[0]) : null;
            }

            elem = $(elem);

            return elem.length === 1 ? elem : $.$firstJQueryObject(elem);
        }
    });

    $.fn.extend({
        $notice: function(config) {

            var fn   = $.assembly.notice,
                name = fn.prototype.assemblyName;

            this.each(function(i, item) {
                var jObj = $(item);

                if (jObj.$asse(name)) {
                    return;
                }

                jObj.$asse(name, new fn(jObj, config || {}));
            });

            return this;
        },
        $asse: function(name, asObject) {
            if (!name) {
                return null;
            }

            var key = [PREFIX, name].join("-");

            if (typeof asObject === "undefined") {
                return this.data(key) || null;
            }

            this.data(key, asObject);

            return this;
        },
        $setPosTo: function(elem, pos) {
            // pos like ltlb  lcd tmb

            var jObj  = $.$firstJQueryObject(elem),
                auto  = !pos, self = this,
                apos  = jObj.$zoomOffset(),

                asize = { x: jObj.outerWidth(), y: jObj.outerHeight() },
                bsize = { x: self.outerWidth(), y: self.outerHeight() };

            pos = (pos || "ltlb").split("");

            if (auto) {

                var view = $.$viewSize();

                if (apos.left + bsize.x > view.right &&
                    apos.left + asize.x - bsize.x >= view.left) {
                    pos[0] = 'r';
                    pos[2] = 'r';
                }
                if (apos.top + asize.y + bsize.y > view.bottom &&
                    apos.top - bsize.y >= view.top) {
                    pos[1] = 'b';
                    pos[3] = 't';
                }
            }

            var hash = {
                l: 0, c: 0.5, r: 1,
                t: 0, m: 0.5, b: 1
            };

            function caculate(size, k, i) {
                return hash[k] * size[ i & 2 ? "y" : "x" ];
            }

            self.css("left", apos.left - caculate(bsize, pos[0], 0) + caculate(asize, pos[2], 2))
                .css("top", apos.top - caculate(bsize, pos[1], 1) + caculate(asize, pos[3], 3));

            return this;
        },
        $viewSize: function(zoom) {

            if ($.isWindow(this[0])) {
                return $.$viewSize(zoom);
            }

            var first  = $.$firstJQueryObject(this),
                r      = first.$zoomOffset(),
                width  = first.outerWidth(),
                height = first.outerHeight();

            return _caculateZoomSize(r, width, height, zoom || 1);
        },
        $appearInWindow: function(zoom) {

            if ($.isWindow(this[0])) {
                return true;
            }

            var v = $.$viewSize(zoom),
                p = this.$viewSize();

            return (p && p.left <= v.right && p.top <= v.bottom && p.right >= v.left && p.bottom >= v.top);
        }
    });

    $.$defined("switch", function(elem, config){
        var jObj = $.$firstJQueryObject(elem);

        var s        = this;
        s._jObj      = jObj;
        s._config    = config;
        s._button    = s._conf[s.BUTTON] || s.DEFAULTBUTTON;
        s._index     = s._conf[s.INDEX] || s.DEFAULTINDEX;
        s._curClass  = s._conf[s.CURCLASS] || s.DEFAULTCURRENTCLASS;
        s._panel     = s._conf[s.PANEL];
        s._callback  = s._conf[s.CALLBACK] || VOID;
        s._btnList   = [];
        s._panelList = [];
        s._hasPanel  = false;
        s._init();
    },{
        INDEX: "index",
        BUTTON: "button",
        CURCLASS: "curclass",
        CALLBACK: "callback",
        PANEL: "panel",
        DEFAULTINDEX: 0,
        DEFAULTBUTTON: "<a>",
        DEFAULTCURRENTCLASS: "current",
        _init: function(){
            var s = this,
                tag = s._button.match(/^<([a-z]+)(?:[ \/]+)?>$/i);
                
            s._btnList = tag ? $(tag[1], s.jObj) : $(s._button);
            
            if(!s._btnList.length){
                return this;
            }
            
            if(s._panel){
                s._panelList = $(s._panel);
            }
            
            if(s._panelList.length){
                s._hasPanel = true;
            }
            
            self.setCurrent(self._index);
        },
        _conf: function(key){
            key = key.toLowerCase();
            return this._config[key] || this._getData(key);
        },
        _getData: function(key) {
            return this._jObj.data(this.PREFIX + key);
        },
        getCurrent: function(){
            return this._index;
        },
        setCurrent: function(i){
            var self   = this,
                before = self.getButton(self._index),
                after  = self.getButton(i);
            
            before.removeClass(self._curClass);
            after.addClass(self._curClass);
            self.setPanelCurrent(i);
            self._index = i;
        },
        setPanelCurrent: function(i){
            var self   = this,
                before = self._index;
            
            if(self._hasPanel){
                self.getPanel(before).hide();
                self.getPanel(i).show();
            }
            
            self._callback.call(self, before, i);
        },
        getButton: function(i){
            return this._btnList.eq(i);
        },
        getPanel:function(i){
            return this._hasPanel ? this._panelList.eq(i) : null;
        }
    });

})(this);