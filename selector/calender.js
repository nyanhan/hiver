$extend(Array.prototype, {
    each: function (a) {
        for (var b = 0, c = this.length; b < c; b++) if (!1 === (a ? a(this[b], b) : this[b]())) return !1;
        return !0
    },
    random: function () {
        return !this.length ? null : this[Math.floor(Math.random() * this.length)]
    },
    randomize: function () {
        for (var a = 0, b = this.length; a < b; ++a) {
            var c = Math.floor(Math.random() * b),
                d = this[a];
            this[a] = this[c];
            this[c] = d
        }
        return this
    },
    map: Array.prototype.map ||
    function (a) {
        for (var b = [], c = 0, d = this.length; c < d; c++) b.push(a(this[c], c));
        return b
    },
    indexOf: function (a) {
        for (var b = 0, c = this.length; b < c; b++) if (this[b] === a) return b;
        return -1
    },
    remove: function (a) {
        a = this.indexOf(a);
        0 <= a && this.splice(a, 1)
    }
});
$extend(Number.prototype, {
    parseCur: function (a) {
        for (var b = this.toFixed(a || 2), c = /(\d)(\d{3}[,\.])/; c.test(b);) b = b.replace(c, "$1,$2");
        b = b.replace(/^(-?)\./, "$10.");
        return 0 === a ? b.replace(/\..*$/, "") : b
    }
});
$extend(String.prototype, {
    replaceWith: function (a) {
        return this.replace(/\{\$(\w+)\}/g, function (b, c) {
            return c in a ? a[c] : b
        })
    },
    trim: function () {
        return this.replace(/^\s+|\s+$/g, "")
    },
    isEmail: function () {
        return /^[^@\s]+@[^@\.\s]+(\.[^@\.\s]+)+$/.test(this)
    },
    isDateTime: function (a) {
        a = !1 === a ? this : this.parseStdDate(!1);
        if (!a) return !1;
        a = a.match(/^((19|20)\d{2})-(\d{1,2})-(\d{1,2})$/);
        if (!a) return !1;
        for (var b = 1; 5 > b; b++) a[b] = parseInt(a[b], 10);
        if (1 > a[3] || 12 < a[3] || 1 > a[4] || 31 < a[4]) return !1;
        b = new Date(a[1], a[3] - 1, a[4]);
        return b.getDate() == a[4] ? b : null
    },
    toReString: function () {
        return this.replace(/([\.\\\/\+\*\?\[\]\{\}\(\)\^\$\|])/g, "\\$1")
    },
    isChinaIDCard: function () {
        var a = this.toLowerCase().match(/\w/g);
        if (this.match(/^\d{17}[\dx]$/i)) {
            for (var b = 0, c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], d = 0; 17 > d; d++) b += parseInt(a[d], 10) * c[d];
            return "10x98765432".charAt(b % 11) != a[17] ? !1 : !! this.replace(/^\d{6}(\d{4})(\d{2})(\d{2}).+$/, "$1-$2-$3").isDateTime()
        }
        return this.match(/^\d{15}$/) ? !! this.replace(/^\d{6}(\d{2})(\d{2})(\d{2}).+$/, "19$1-$2-$3").isDateTime() : !1
    },
    parseStdDate: function (a) {
        var b = this.replace(/[ \-,\.\/]+/g, "-").replace(/(^|-)0+(?=\d+)/g, "$1");
        "en" == $$.status.version && (b = b.replace(/[a-z]{3,}/i, function (a) {
            return (_t_re = "January|1@February|2@March|3@April|4@May|5@June|6@July|7@August|8@September|9@October|10@November|11@December|12".match(RegExp("(^|@)" + a + "[^\\|]*\\|(\\d+)", "i"))) ? _t_re[2] : a
        }));
        b = b.replace(/^([^-]{1,2}-[^-]{1,2})-([^-]{4})$/, "$2-$1");
        return !1 === a || b.isDateTime(!1) ? b : null
    },
    parseEngDate: function () {
        var a = this.parseStdDate();
        if (!a) return null;
        a = a.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        return "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(",")[parseInt(a[2]) - 1] + "-" + a[3] + "-" + a[1]
    },
    toSafeCode: function () {
        for (var a = [], b = 0, c = this.length; b < c; b++) a.push(this.charCodeAt(b));
        return "&#" + a.join("&#")
    }
});
$extend(Function.prototype, {
    bind: function (a) {
        var b = this,
            c = [].slice.call(arguments, 1);
        return function () {
            return b.apply(a, c.concat([].slice.call(arguments, 0)))
        }
    },
    pass: function () {
        var a = [].slice.call(arguments, 0);
        a.unshift(null);
        return this.bind.apply(this, a)
    },
    delay: function (a) {
        return setTimeout(this, a)
    }
});

function $type(a) {
    switch (a) {
    case void 0:
        return "undefined";
    case null:
        return "null";
    default:
        if (a.tagName) return "element";
        var b = typeof a;
        if ("object" != b && "function" != b) return b;
        var c = {
            array: Array,
            "boolean": Boolean,
            date: Date,
            regexp: RegExp,
            string: String,
            number: Number,
            "function": Function
        },
            d;
        for (d in c) if (a instanceof c[d] || a.constructor == c[d]) return d;
        return b
    }
}
function $isEmptyObj(a) {
    for (var b in a) return !1;
    return !0
}
function $doNothing() {}
function $isUndefined(a) {
    return "undefined" === typeof a
}
function $type(a) {
    if (null === a) return "null";
    var b = Object.prototype.toString.call(a).slice(8, -1);
    return 0 <= "Array Boolean Date RegExp String Number Function".indexOf(b) ? b.toLowerCase() : typeof a
}
function $merge() {
    return $extend.apply(null, [{}].concat([].slice.call(arguments, 0)))
}
function $keys(a, b) {
    var c = [],
        d;
    for (d in a)(b || a.hasOwnProperty(d)) && c.push(d);
    return c
}
function $values(a, b) {
    var c = [],
        d;
    for (d in a)(b || a.hasOwnProperty(d)) && c.push(a[d]);
    return c
}
function $items(a, b) {
    var c = [],
        d;
    for (d in a)(b || a.hasOwnProperty(d)) && c.push([d, a[d]]);
    return c
}
function $class(a, b) {
    var c = arguments.callee,
        d = function () {};
    b && (d.prototype = new b, d.prototype.constructor = b);
    var g = function () {
            var a = arguments.callee.caller;
            a == c || a == g.create || this.initialize && this.initialize.apply(this, arguments)
        };
    g.prototype = new d;
    $extend(g.prototype, a || {}, {
        constructor: g,
        proto: g.prototype,
        base: d.prototype
    });
    $extend(g, {
        create: function (a) {
            var b = new g;
            b.initialize && b.initialize.apply(b, a);
            return b
        },
        subclass: function (a) {
            return c(a, g)
        },
        implement: function (a, b) {
            $type(a) == "string" ? g.prototype[a] = b : [].slice.call(arguments).each(function (a) {
                $type(a) == "function" && (a = new a);
                $items(a, true).each(function (a) {
                    g.prototype[a[0]] = a[1]
                })
            })
        }
    });
    return g
}
function $viewSize(a) {
    var a = a.ownerDocument || document,
        b = a.parentWindow || a.defaultView,
        c = a.documentElement;
    return {
        scrollLeft: b.pageXOffset || c.scrollLeft || a.body.scrollLeft || 0,
        scrollTop: b.pageYOffset || c.scrollTop || a.body.scrollTop || 0,
        clientTop: c.clientTop || 0,
        clientLeft: c.clientLeft || 0
    }
}
function $pageSize(a) {
    var b = {
        docWidth: ___.scrollWidth,
        docHeight: ___.scrollHeight,
        winWidth: ___.clientWidth,
        winHeight: ___.clientHeight,
        scrollLeft: $$.browser.WebKit ? __.body.scrollLeft : ___.scrollLeft,
        scrollTop: $$.browser.WebKit ? __.body.scrollTop : ___.scrollTop
    };
    if ($$.browser.WebKit) {
        var c = ___.$getStyle();
        b.docWidth += parseInt(c.marginLeft) + parseInt(c.marginRight);
        b.docHeight += parseInt(c.marginTop) + parseInt(c.marginBottom)
    }
    b.docWidth = Math.max(b.docWidth, b.winWidth);
    b.docHeight = Math.max(b.docHeight, b.winHeight);
    if (a) {
        var a = "win" == a,
            d = $$.support.testIEZoom();
        b.left = a ? b.scrollLeft : 0;
        b.top = a ? b.scrollTop : 0;
        $$.browser.Moz && (c = ___.$getStyle(), b.left -= parseInt(c.borderLeftWidth) + parseInt(c.marginLeft), b.top -= parseInt(c.borderTopWidth) + parseInt(c.marginTop));
        b.width = a ? Math.round(b.winWidth / d) : Math.max(b.docWidth, b.winWidth);
        b.height = a ? Math.round(b.winHeight / d) : Math.max(b.docHeight, b.winHeight)
    }
    return b
}
function $animate(a, b, c) {
    if (a && a.style) {
        var a = a.style,
            c = $extend({
                fps: 40,
                duration: 400,
                callback: function () {},
                reverse: !1,
                fn: function (a) {
                    return Math.sin(a * Math.PI / 2)
                }
            }, c || {}),
            d = $keys(b),
            g = d.map(function (a) {
                return /(width|height|left|top)\b/i.test(a) ? "px" : ""
            }),
            f = new Date,
            k = function () {
                var k = new Date - f;
                k > c.duration && (k = c.duration);
                for (var h = 0; h < d.length; h++) {
                    var m = b[d[h]],
                        q = c.fn(k / c.duration),
                        m = c.reverse ? m[1] + (m[0] - m[1]) * q : m[0] + (m[1] - m[0]) * q;
                    "px" == g[h] && (m = Math.round(m));
                    a[d[h]] = m + g[h]
                }
                k == c.duration && (clearInterval(p), c.callback && setTimeout(c.callback, Math.round(1E3 / c.fps)))
            },
            p = setInterval(k, Math.round(1E3 / c.fps));
        k();
        return p
    }
}
function $animate2(a, b) {
    var b = $merge({
        fps: 40,
        duration: 400,
        callback: function () {},
        reverse: !1,
        fn: function (a) {
            return Math.sin(a * Math.PI / 2)
        }
    }, b || {}),
        c = new Date,
        d = setInterval(function () {
            var g = new Date - c;
            g > b.duration && (g = b.duration);
            for (var f = b.fn(g / b.duration), k = 0; k < a.length; k++) {
                var p = a[k][0],
                    j = a[k][1],
                    h;
                for (h in j) {
                    var m = j[h],
                        q = b.reverse ? m[1] + (m[0] - m[1]) * f : m[0] + (m[1] - m[0]) * f;
                    if ("px" == m[2] || m[3]) q = Math.round(q);
                    p[h] = q + m[2]
                }
            }
            g == b.duration && (clearInterval(d), b.callback && setTimeout(b.callback, Math.round(1E3 / b.fps)));
            return arguments.callee
        }(), Math.round(1E3 / b.fps));
    return d
}
function $fixE(a) {
    a = _.event || a;
    a.target || (a.target = a.srcElement || __);
    3 === a.target.nodeType && (a.target = a.target.parentNode);
    !a.relatedTarget && a.fromElement && (a.relatedTarget = a.fromElement === a.target ? a.toElement : a.fromElement);
    if (null == a.pageX && null != a.clientX) {
        var b = __.body;
        a.pageX = a.clientX + (___ && ___.scrollLeft || b && b.scrollLeft || 0) - (___ && ___.clientLeft || b && b.clientLeft || 0);
        a.pageY = a.clientY + (___ && ___.scrollTop || b && b.scrollTop || 0) - (___ && ___.clientTop || b && b.clientTop || 0)
    }
    a.$target = $(a.target);
    return a
}
function $stopEvent(a, b) {
    a = $fixE(a);
    b = b || 0;
    0 <= b && (a.preventDefault ? a.stopPropagation() : a.cancelBubble = !0);
    0 != b && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
}
function $getUid() {
    return "uid_" + (new Date).getTime() + Math.random().toString().substr(2, 5)
}
var $contains = __.compareDocumentPosition ?
function (a, b) {
    return a == b || !! (a.compareDocumentPosition(b) & 16)
} : function (a, b) {
    return a.contains ? a.contains(b) : !0
};

function $c(a) {
    return a.constructor == Array ? $(__.createTextNode(a.join("\n"))) : $(__.createElement(a))
}
var $createElement = $c;

function $toJson(a) {
    if (null === a) return "null";
    if ($isUndefined(a)) return "undefined";
    switch (a.constructor) {
    case Object:
        var b = [],
            c;
        for (c in a) b.push($toJson(c) + ":" + $toJson(a[c]));
        return "{" + b.join(",") + "}";
    case Array:
        return "[" + a.map(function (a) {
            return $toJson(a)
        }).join(",") + "]";
    case String:
        return '"' + a.replace(/([\n\r\\\/\'\"])/g, function (a) {
            return {
                "\n": "\\n",
                "\r": "\\r"
            }[a] || "\\" + a
        }) + '"';
    case Date:
        return "new Date(" + a.getTime() + ")";
    case Number:
    case Boolean:
    case Function:
    case RegExp:
        return a.toString();
    default:
        return "null"
    }
}
function $fromJson(a) {
    var b;
    try {
        b = eval("(" + a + ")")
    } catch (c) {}
    return b
}
function $pageValue() {
    return $pageValue.get.apply(_, arguments)
}
$pageValue.set = function (a, b) {
    $$.status.pageValue.data[a] = b;
    $$.browser.Opera && $savePageValue()
};
$pageValue.get = function (a) {
    var b = $$.status.pageValue.data;
    return b && a in b ? b[a] : null
};
$pageValue.del = function (a) {
    delete $$.status.pageValue.data[a];
    $$.browser.Opera && $savePageValue()
};

function $savePageValue() {
    $$.status.saveStatus.value = $toJson($$.status.pageValue)
}
function $globalValue() {}
function $getQuery(a) {
    return (a = (location.search || "").match(RegExp("[\\?&]" + a + "=([^&]+)", "i"))) ? unescape(a[1]) : null
}
function $loadJs(a, b, c, d) {
    function g() {
        var b = k[a],
            f = b.length;
        if (c && d) return setTimeout(function () {
            !0 !== c(!0) && b.splice(f, 1)
        }, d)
    }
    var f = arguments.callee,
        k = f.queue || (f.queue = {}),
        p = null;
    if (a in k) c && (k[a] ? (p = g(), k[a].push(c)) : c());
    else {
        k[a] = [];
        c && (p = g(), k[a].push(c));
        var j = document.createElement("script");
        j.type = "text/javascript";
        j.charset = b || $$.status.charset;
        j.onload = j.onreadystatechange = function () {
            if (!j.readyState || !(j.readyState != "loaded" && j.readyState != "complete")) {
                p && clearTimeout(p);
                for (j.onreadystatechange = j.onload = null; k[a].length;) k[a].shift()();
                k[a] = null
            }
        };
        j.src = a;
        __.getElementsByTagName("head")[0].appendChild(j)
    }
}
function $loadCss(a, b) {
    if ($$.browser.IE) __.createStyleSheet(a).charset = b || _.$$.status.charset;
    else {
        var c = _.__.createElement("link");
        with(c) type = "text/css", rel = "stylesheet", href = a;
        __.$("head")[0].appendChild(c)
    }
}
$$.cookie = {};

function $delCookie(a, b) {
    if (b) {
        var c = $getCookie(a, !1);
        if (null === c) return;
        if (c = c.replace(RegExp("(^|&)\\s*" + encodeURIComponent(b) + "=[^&]+"), "").replace(/^\s*&/, "")) {
            __.cookie = encodeURIComponent(a) + "=" + c;
            return
        }
    }
    c = new Date;
    c.setTime(c.getTime() - 1);
    __.cookie = encodeURIComponent(a) + "=" + ($$.cookie.domain ? "; domain=" + $$.cookie.domain : "") + "; path=" + ($$.cookie.path || "/") + "; expires=" + c.toGMTString()
}
function $setCookie(a, b, c) {
    c || (c = b, b = null);
    var d = ($$.cookie.domain ? "; domain=" + $$.cookie.domain : "") + "; path=" + ($$.cookie.path || "/") + ($$.cookie.expires ? "; expires=" + (new Date((new Date).getTime() + 36E5 * $$.cookie.expires)).toGMTString() : "");
    if (b) {
        var g = $getCookie(a, !1) || "";
        g && (g = (g + "&").replace(RegExp("(^|&)\\s*" + encodeURIComponent(b) + "=[^&]+&"), "$1"));
        __.cookie = encodeURIComponent(a) + "=" + g + encodeURIComponent(b) + "=" + encodeURIComponent(c) + d
    } else __.cookie = encodeURIComponent(a) + "=" + encodeURIComponent(c) + d
}
function $getCookie(a, b) {
    var c = __.cookie.match(RegExp("(?:^|;)\\s*" + encodeURIComponent(a) + "=([^;]+)"));
    if (!1 === b) return c ? c[1] : null;
    c && b && (c = c[1].match(RegExp("(?:^|&)\\s*" + encodeURIComponent(b) + "=([^&]+)")));
    return c ? decodeURIComponent(c[1]) : null
}
function $parserRe(a) {
    var b = [],
        c = /\sid=['"]?([^\s>'"]+)/i,
        d = null,
        g = null;
    (a && a.innerHTML ? a : __.body).innerHTML.replace(/<[^>]+\smod=['"]?([\w|]+)[^>]+/g, function (f, p) {
        try {
            if ("jmpinfo" !== p.toLowerCase() && (d = f.match(c)) && (g = $(d[1]))) p in Ctrip.module ? new Ctrip.module[p](g) : b.push(g)
        } catch (j) {
            (function (a) {
                setTimeout(function () {
                    $triggerError(a, {
                        category: "tuna-error",
                        label: "$parserRe"
                    })
                }, 0)
            })(j), $t("parserRe Error", [func, a])
        }
        return ""
    });
    var f = setInterval(function () {
        var a = b.shift();
        a ? $topWin.$d(a) : clearInterval(f)
    }, 50)
}
$$.module.queue = {};

function $d(a) {
    ($(a).getAttribute("mod") || "").replace(/\w+/ig, function (b) {
        Ctrip.module[b] ? new Ctrip.module[b](a) : $isUndefined($$.module.queue[b]) ? $$.module.queue[b] = [a] : $$.module.queue[b].push(a)
    })
}
var $dealElement = $d;

function $t(a, b) {
    "undefined" !== typeof console && console.error("string" === typeof a ? a : a.message, b)
}
function $console() {
    $loadJs("http://webresource.ctrip.com/code/js/tools/firebug-lite.js#startOpened")
}
$$.access = {
    cache: {},
    uuid: 0,
    expando: "Tuna" + 1 * new Date
};
var $data = function (a) {
        return {
            set: function (b, c, d) {
                var g = b[a.expando],
                    f = $type(c);
                g || (b[a.expando] = g = ++a.uuid, a.cache[g] = {});
                if ("object" === f) $extend(a.cache[g], c);
                else if ("string" === f) a.cache[g][c] = null == d ? null : d;
                else return !1;
                return !0
            },
            get: function (b, c) {
                var d = b[a.expando];
                if (!d) return null;
                d = a.cache[d];
                return $isUndefined(c) ? d : d[c]
            },
            remove: function (b, c) {
                var d = b[a.expando];
                if (d) {
                    var g = a.cache[d];
                    $isUndefined(c) ? (delete g, a.cache[d] = {}) : delete g[c]
                }
                return !0
            }
        }
    }($$.access);

function $fixElement(a) {
    function b(a, b, c) {
        "attachEvent" in a ? a.attachEvent("on" + b, c) : a.addEventListener(b, c)
    }
    function c(a) {
        for (var a = a.getElementsByTagName("input"), b = 0; b < a.length; b++) if (/checkbox|radio/.test(a[b].type)) return a[b];
        return null
    }
    a = a && a.nodeType ? a : _.__;
    if ($$.browser.IE6) {
        var d = a.getElementsByTagName("label");
        for (i = 0; i < d.length; i++) {
            var g = c(d[i]);
            g && /checkbox|radio/.test(g.type) &&
            function (a, c) {
                a._for = c;
                b(a, "mouseover", function () {
                    var b = a._for;
                    b && (a.htmlFor = b.id || (b.id = $getUid()), a._for = null);
                    b = a.style;
                    b.borderBottom = "#aaa 1px dashed";
                    b.paddingBottom = "0px";
                    b.color = "#1E1A75"
                });
                b(a, "mouseout", function () {
                    var b = a.style;
                    b.borderBottom = "";
                    b.paddingBottom = "";
                    b.color = ""
                })
            }(d[i], g)
        }
    }
    if ($$.browser.IE) {
        a = a.getElementsByTagName("select");
        for (i = 0; i < a.length; i++) a[i].onmousewheel = function () {
            return !1
        }
    }
}
function $removeTextNode(a) {
    if (a) {
        for (var b = a.firstChild, c; b;) c = b.nextSibling, 3 == b.nodeType ? b.nodeValue.trim() || a.removeChild(b) : $removeTextNode(b), b = c;
        return a
    }
}
function $ajax(a, b, c) {
    function d() {
        return 200 == f.status ? /xml/i.test(f.getResponseHeader("content-type")) ? f.responseXML : f.responseText : null
    }
    var g = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"],
        f;
    try {
        f = new XMLHttpRequest
    } catch (k) {
        for (var p = 0; p < g.length; p++) try {
            f = new ActiveXObject(g[p]);
            break
        } catch (j) {}
    }
    if (f) return f.open(b ? "POST" : "GET", a || location.href, !! c), f.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8"), f.setRequestHeader("If-Modified-Since", new Date(0)), c && (f.onreadystatechange = function () {
        if (4 == f.readyState) {
            var k = d();
            !0 === c(k) && setTimeout(function () {
                $ajax(a, b, c)
            }, 1E3)
        }
    }), f.send(b || ""), c ? f : d()
}
function $alert(a, b, c, d, g) {
    function f() {
        a.className = a.className.replace("c_input_error pubGlobal_checkinfo_input01", "");
        $topWin.$$.status.alertDiv.style.display = "none";
        $topWin.$$.status.alertDiv.$clearIframe();
        a.$ur("onblur", f);
        __.body.$ur("onmousedown", f);
        a.clearAlert = null;
        $alert.element = null
    }
    var a = $(a),
        d = "tl",
        g = "tr",
        k = $("alertInfo");
    $("alertTable");
    var p = 1;
    k.innerHTML = b;
    $topWin.$$.status.alertDiv.style.display = "";
    $topWin.$$.status.alertDiv.$setPos(a, d || "tl", g || "tr");
    $topWin.$$.status.alertDiv.$setIframe();
    a.className += " c_input_error pubGlobal_checkinfo_input01";
    !1 !== c && a.$setDisplay();
    a.disabled ? p = 0 : setTimeout(function () {
        try {
            a.focus()
        } catch (b) {
            p = 0
        }
    }, 0);
    p ? a.$r("onblur", f) : __.body.$r("onmousedown", f);
    $alert.element = a;
    a.clearAlert = f
}
function $toQuery(a, b) {
    var c = [],
        d;
    for (d in a) a.hasOwnProperty(d) && c.push([d, b ? b(a[d]) : a[d]].join("="));
    return c.join("&")
}
function $fromQuery(a, b) {
    for (var c = a.split("&"), d = {}, g = 0; g < c.length; g++) {
        var f = c[g].split("=");
        1 < f.length && (d[f[0]] = b ? b(f.slice(1).join("=")) : f.slice(1).join("="))
    }
    return d
}
function $trackEvent(a, b, c, d) {
    var g = arguments.callee._cnt || (arguments.callee._cnt = {
        tuna_total: 0,
        other_total: 0
    });
    if (!(80 <= g.other_total)) {
        ++g.other_total;
        var g = ["http://www.", /\.ctrip\.com$/.test(document.domain) ? "ctrip" : "dev.sh.ctriptravel", ".com/rp/uiServer2.asp"].join(""),
            f = $toQuery({
                action: "event",
                p: window.UIMonitor2 && window.UIMonitor2.bi && window.UIMonitor2.bi.pageview_id || "",
                u: document.URL,
                c: a,
                l: c,
                a: b,
                v: d,
                t: 1 * new Date
            }, function (a) {
                return encodeURIComponent(escape(a))
            });
        (new Image).src = g + "?" + f
    }
}
function $tunaVersion() {
    var a = arguments.callee;
    if (!a._val) {
        a._val = -1;
        for (var b = document.getElementsByTagName("script"), c = b.length - 1; 0 <= c; c--) {
            var d = b[c].src.match(/\/tuna_(\d+).js$/i);
            if (d) {
                a._val = parseInt("20" + d[1]);
                a._offline = /\/webresint\.sh\.ctriptravel\.com\//i.test(b[c].src);
                a._english = /\/webresource\.english\.ctrip\.com\//i.test(b[c].src);
                break
            }
        }
    }
    return a._val
}
function $isOnline() {
    $tunaVersion();
    return !$tunaVersion._offline && !$tunaVersion._english
}
function $webresourceUrl(a) {
    $tunaVersion();
    return "http://webres" + ["ource.ctrip", "ource.english.ctrip", "int.sh.ctriptravel"][$tunaVersion._offline ? 2 : $tunaVersion._english ? 1 : 0] + ".com" + a
}
function $picUrl(a) {
    $tunaVersion();
    return "http://pic" + [".ctrip", ".english.ctrip", "int.sh.ctriptravel"][$tunaVersion._offline ? 2 : $tunaVersion._english ? 1 : 0] + ".com" + a
}
var DOM = function () {
        function a(a) {
            return function (b) {
                for (var b = $fixE(b), c = a.module.event[b.type], d, h = 0; h < c.length; h++) if (c[h].enabled) try {
                    if (d = c[h].func.call(a, b), !1 === d) break
                } catch (m) {
                    setTimeout(function () {
                        $triggerError(m, {
                            category: "tuna-error",
                            label: "DOM.execEvent"
                        })
                    }, 0), $t(m, [c[h].func, a])
                } else c.splice(h, 1), h--;
                return d
            }
        }
        function b() {
            var a = $pageSize("win");
            a.right = a.left + a.width;
            a.bottom = a.top + a.height;
            return a
        }
        function c(a, b) {
            for (var c = [], d = 0, h = a.length; d < h; d++) {
                var m;
                m = " " + b + " ";
                m = -1 < (" " + a[d].className + " ").replace(/[\n\t]/g, " ").indexOf(m) ? !0 : !1;
                m && (c[c.length] = a[d])
            }
            return c
        }
        function d(a, b, c) {
            if (!a) return null;
            b = b || "n";
            return b.match(RegExp({
                1: "n",
                3: "t",
                8: "c"
            }[a.nodeType] || "o", "i")) ? a : c.call(a, b)
        }
        if (!this || 3 === this.nodeType || this.$) return this;
        this != _ && (this.module = {}, this.module.event = {});
        var g = /^[\.#]?[^\.#]+/;
        this.$ = this.__ ?
        function (a, b) {
            if (typeof a == "object") return DOM.apply(a);
            var c;
            if (b) {
                var d = ___.innerHTML.match(RegExp("\\sid=([\\'\\\"]?)([\\w$]+?[_$]" + a.toReString() + ")\\1"), "g");
                if (d) for (var h = 0; h < d.length; h++) if (c = $(d[h])) return c;
                return $(a)
            }
            return (c = __.getElementById(a)) ? $(c) : null
        } : function (a) {
            var b = this.getElementsByTagName(a);
            b.$each = function (a) {
                var c;
                if ($isUndefined(b.length)) a.call(this, b, 0);
                else for (var f = 0; f < b.length && (c = a.call(this, b[f], f)) !== false; f++);
                return c === false ? 0 : 1
            };
            for (a = 0; a < b.length; a++) $(b[a]);
            return b
        };
        if (1 == this.nodeType) {
            if ("INPUT" == this.tagName && /^(text|hidden)$/i.test(this.type) || "TEXTAREA" == this.tagName) this.isNull = function () {
                return !this.value.trim()
            };
            /^SELECT$/.test(this.tagName) && (this.$setValue = function (a) {
                for (var b = 0; b < this.options.length; b++) if (this.options[b].value == a) {
                    this.selectedIndex = b;
                    return true
                }
                return false
            })
        }
        this.hasAttribute || (this.hasAttribute = function (a) {
            return !$isUndefined(this.attributes[a])
        });
        this.$parentNode = function (a) {
            var b = $(this.parentNode);
            a && b && b.tagName && b.tagName.toLowerCase() != a.toLowerCase() && (b = b.$parentNode(a));
            return b && b.tagName ? b : null
        };
        this.$firstChild = function () {
            return $(this.firstChild)
        };
        this.$lastChild = function () {
            return $(this.lastChild)
        };
        this.$childNodes = function () {
            for (var a = this.childNodes, b = 0; b < a.length; b++) $(a[b]);
            return a
        };
        this.$nSib = this.$nextSibling = function () {
            return $(this.nextSibling)
        };
        this.$pSib = this.$previousSibling = function () {
            return $(this.previousSibling)
        };
        this.$click = function () {
            if (this.click) this.click();
            else {
                var a = __.createEvent("MouseEvents");
                a.initMouseEvent("click", true, true, _, 0, 0, 0, 0, 0, false, false, false, false, 0, this);
                this.dispatchEvent(a)
            }
        };
        this.$getStyle = function (a) {
            var b = this.currentStyle || _.getComputedStyle(this, null);
            return a ? b[a] : b
        };
        this.$getPara = function () {
            var a, b = (a = this.getAttribute(arguments[0]) || "").split(a.indexOf("\u000c") > -1 ? "\u000c" : "|");
            for (a = 0; a < Math.max(arguments.length - 1, b.length); a++) b[a] = b[a] || arguments[a + 1] || "";
            return b
        };
        this.$r = this.$regEvent = function (b, c, d, j) {
            j = j || 50;
            if (arguments.length == 3 && typeof d == "number") {
                j = d;
                d = null
            }
            var h = this;
            b.constructor != Array && (b = [b]);
            c.constructor != Array && (c = [c]);
            b.each(function (b) {
                c.each(function (c) {
                    b = b.replace(/^(on)?/i, "");
                    b = b == "DOMContentLoaded" ? "domready" : b.toLowerCase();
                    b == "domready" && (h = _);
                    var f = {
                        enabled: true,
                        obj: h,
                        event: b,
                        func: c,
                        hash: d,
                        level: j,
                        id: _.$$.status.regEventCount++
                    };
                    if (b == "domready" && $$.status.domReady || b == "load" && (h == _ || h == __.body) && $$.status.load) try {
                        c()
                    } catch (k) {
                        (function (a) {
                            setTimeout(function () {
                                $triggerError(a, {
                                    category: "tuna-error",
                                    label: "evtDomReady.execEvent"
                                })
                            }, 0)
                        })(k)
                    } else {
                        if (!(b in h.module.event)) {
                            h.module.event[b] = [];
                            h.attachEvent ? h.attachEvent("on" + b, a(h)) : h.addEventListener(b, a(h), false)
                        }
                        h.module.event[b].push(f);
                        h.module.event[b].sort(function (a, b) {
                            return a.level - b.level || a.id - b.id
                        })
                    }
                    if (d) {
                        d in $$.status.regEventHash || ($$.status.regEventHash[d] = []);
                        $$.status.regEventHash[d].push(f)
                    }
                })
            })
        };
        this.$ur = this.$unregEvent = function (b, c, d) {
            var j = this;
            b.constructor != Array && (b = [b]);
            c.constructor != Array && (c = [c]);
            b.each(function (b) {
                c.each(function (c) {
                    b = b.replace(/^(on)?/i, "");
                    b = b == "DOMContentLoaded" ? "domready" : b.toLowerCase();
                    b == "domready" && (j = _);
                    if (b in j.module.event) {
                        for (var f = j.module.event[b], k = 0; k < f.length; k++) if (f[k].enabled && f[k].func == c && (!d || f[k].hash == d)) {
                            f[k].enabled = false;
                            break
                        }
                        if (!f.length) {
                            delete j.module.event[b];
                            j.detachEvent ? j.detachEvent(b, a) : j.removeEventListener(b, a, false)
                        }
                    }
                })
            })
        };
        this.$urh = this.$unregEventHash = function (a) {
            if (a in $$.status.regEventHash) {
                for (var b = $$.status.regEventHash[a], c; c = b.shift();) c.obj.$ur(c.event, c.func, a);
                delete $$.status.regEventHash[a]
            }
        };
        this.$getWin = function () {
            var a = this.ownerDocument,
                a = a.parentWindow || a.defaultView;
            return a == window && a !== window ? window : a
        };
        this.$getEl = function (a) {
            a || (a = "");
            var b = arguments[1],
                d = g.exec(a);
            if (!d) {
                if (!b) return null;
                for (var j = [], h = 0, m = b.length; h < m; h++) j[j.length] = $(b[h]);
                return j.length ? j : null
            }
            var m = d[0],
                h = m.substring(1),
                d = a.replace(m, ""),
                q = m.substring(0, 1),
                x = this;
            if (b) if (q === ".") j = c(b, h);
            else {
                q = $(h);
                h = 0;
                for (m = b.length; h < m; h++) b[h] === q && (j = [q])
            } else {
                x = x.nodeName ? x : __;
                if (q === ".") {
                    b = x.getElementsByTagName("*");
                    if (!b) return null;
                    j = c(b, h)
                } else if (q === "#") j = (q = $(h)) ? [q] : null;
                else j = x.getElementsByTagName(m)
            }
            return !j || !j.length ? null : arguments.callee(d, j)
        };
        this.$g = this.$selNode = function (a) {
            function b(a, c) {
                var d = [],
                    f = a.match(/^([\.\#]*)([a-zA-Z0-9\-_*]+)(.*)$/i),
                    j;
                if (!f) return [];
                if (f[1] == "#")(j = $(f[2])) && d.push(j);
                else if (f[1] == ".") c.each(function (a) {
                    a.$("*").$each(function (a) {
                        RegExp("\\b" + f[2] + "\\b").test(a.className) && d.push($(a))
                    })
                });
                else for (var k = 0; k < c.length; k++) if (j = c[k].$(f[2])) for (var h = 0; h < j.length; h++) d.push(j[h]);
                f[3].replace(/\[([^!=]+)(=|!=)([^\]]*)\]/gi, function (a, b, c, m) {
                    a = d.slice(0);
                    d = [];
                    a.each(function (a) {
                        b = {
                            "class": "className",
                            "for": "htmlFor"
                        }[b] || b;
                        var u = a[b] || a.getAttribute(b),
                            u = b == "className" ? RegExp("\\b" + m + "\\b").test(u) : u == m;
                        c == "=" == u && d.push($(a))
                    })
                });
                return d
            }
            var c = [this == _ ? _.__.body : this],
                d = [],
                h = [];
            a.replace(/[^\[,]([^\[,]*(\[[^\]]*\])*)+/g, function (a) {
                var f = c.slice(0);
                a.replace(/(#|\*)/gi, " $1").replace(/([^\^ ])\.(\w+)/gi, "$1[className=$2]").trim().split(/\s+/g).each(function (a) {
                    f = b(a, f)
                });
                d = d.concat(f)
            });
            d.each(function (a) {
                if (!a.__selNodeFlag__) {
                    a.__selNodeFlag__ = true;
                    h.push(a)
                }
            });
            h.each(function (a) {
                a.__selNodeFlag__ = false;
                a.hasAttribute("__selNodeFlag__") && a.removeAttribute("__selNodeFlag__")
            });
            return h.length == 0 ? null : h
        };
        this.$getPos = function () {
            var a = this.$getWin();
            if (a == $topWin) return $offset(this);
            for (var b = $offsetWin(this), c = []; a != $topWin;) {
                if (a.parent != $topWin) c = $offsetWin(a.frameElement);
                else {
                    var c = $(a.frameElement),
                        d = c.ownerDocument,
                        d = d.defaultView ? d.defaultView.getComputedStyle(c, null) : c.currentStyle,
                        h = {
                            thin: 2,
                            medium: 4,
                            thick: 6
                        },
                        c = $offset(c);
                    if (!/^none|hidden$/i.test(d.borderLeftStyle)) {
                        var m = d.borderLeftWidth;
                        c[0] = c[0] + (h[m] || parseFloat(m) || 0)
                    }
                    if (!/^none|hidden$/i.test(d.borderTopStyle)) {
                        m = d.borderTopWidth;
                        c[1] = c[1] + (h[m] || parseFloat(m) || 0)
                    }
                    if (!$$.browser.IE) {
                        c[0] = c[0] + parseFloat(d.paddingLeft);
                        c[1] = c[1] + parseFloat(d.paddingTop)
                    }
                }
                b[0] = b[0] + c[0];
                b[1] = b[1] + c[1];
                a = a.parent
            }
            return b
        };
        this.$setPos = function (a, c, d) {
            function j(b, q) {
                function j(a, b, c, d) {
                    return c + {
                        l: 0,
                        c: b.offsetWidth / 2,
                        r: b.offsetWidth,
                        t: 0,
                        m: b.offsetHeight / 2,
                        b: b.offsetHeight
                    }[a || "l"] * d
                }
                return j(c.match(b), this, j(d.match(b), a, m[q], 1), -1) + "px"
            }
            var h = false,
                m = a.$getPos();
            if (c === "auto") {
                c = "lt";
                d = "lb";
                h = true
            } else {
                c || (c = "lt");
                d || (d = "lb")
            }
            if (h) {
                var h = b(),
                    q = a.offsetWidth,
                    g = a.offsetHeight,
                    t = this.offsetWidth,
                    C = this.offsetHeight,
                    B = (c + d).split("");
                if (m[0] + t > h.right && m[0] + q - t >= h.left) {
                    B[0] = "r";
                    B[2] = "r"
                }
                if (m[1] + g + C > h.bottom && m[1] - C >= h.top) {
                    B[1] = "b";
                    B[3] = "t"
                }
                c = B.slice(0, -2).join("");
                d = B.slice(2).join("")
            }
            this.style.left = j.call(this, /[lcr]/i, 0);
            this.style.top = j.call(this, /[tmb]/i, 1)
        };
        this.$setIframe = function (a) {
            if (a === true || $$.browser.IE6) {
                if (this.module.iframe) a = this.module.iframe;
                else {
                    a: {
                        for (a = 0; a < $topWin.$$.module.iframe.length; a++) if ($topWin.$$.module.iframe[a].$getStyle("display") == "none") {
                            a = $topWin.$$.module.iframe[a];
                            break a
                        }
                        a = void 0
                    }
                    if (!a) {
                        a = $topWin.$c("iframe");
                        with(a.style) {
                            width = height = "0px";
                            background = "#FFF";
                            position = "absolute";
                            display = "none";
                            zIndex = 100
                        }
                        a.frameBorder = 0;
                        a.id = a.name = $getUid();
                        $topWin.$$.status.container.appendChild(a);
                        $topWin.$$.module.iframe.push(a);
                        with($topWin.frames[a.id].document) {
                            open();
                            write("<style>html,body{overflow:hidden}</style>");
                            close()
                        }
                    }
                    this.module.iframe = a
                }
                a.$setPos(this, "tl", "tl");
                with(a.style) {
                    width = this.offsetWidth + "px";
                    height = this.offsetHeight + "px";
                    display = ""
                }
                return a
            }
        };
        this.$clearIframe = function () {
            var a = this.module.iframe;
            if (a) {
                a.style.display = "none";
                this.module.iframe = null
            }
            return a
        };
        this.$nAbs = function (a) {
            var b = this,
                c = b.firstChild || b.nextSibling;
            if (!c) {
                do {
                    b = b.parentNode;
                    if (b == __.body) return null;
                    c = b.nextSibling
                } while (!c)
            }
            return $(d(c, a, arguments.callee))
        };
        this.$pAbs = function (a) {
            if (this == __.body) return null;
            var b = this.previousSibling;
            if (b) for (; b.lastChild;) b = b.lastChild;
            else b = this.parentNode;
            return $(d(b, a, arguments.callee))
        };
        this.$focusNext = function () {
            if (this.form) {
                try {
                    this.blur()
                } catch (a) {}
                for (var b = this.form.elements, c, d = 0; d < b.length; d++) {
                    if (c && !$(b[d]).disabled && b[d].$isDisplay()) try {
                        b[d].focus();
                        break
                    } catch (h) {}
                    b[d] == this && (c = true)
                }
            }
        };
        this.$setDisplay = function () {
            var a = this.$getPos();
            with($topWin.___) {
                scrollLeft = a[0] - 80;
                scrollTop = a[1] - 80
            }
        };
        this.$isDisplay = function () {
            var a = this;
            do if (a.tagName == "INPUT" && a.type == "hidden" || a.$getStyle("display") == "none" || a.$getStyle("visibility") == "hidden") return false;
            while ((a = a.$parentNode()) && a.nodeType == 1);
            return true
        };
        this.$setData = function (a, b) {
            return $data.set(this, a, b)
        };
        this.$getData = function (a) {
            return $data.get(this, a)
        };
        this.$removeData = function (a) {
            return $data.remove(this, a)
        };
        this.$getModAttrs = function (a) {
            return Ctrip.support.getModAttrs(this, a)
        };
        this.$isMod = function (a) {
            return Ctrip.support.isMod(this, a)
        };
        return this
    };
DOM.apply(_);
DOM.apply(__);
DOM.apply(___);
DOM.apply($$.status.alertDiv);
$$.support = {
    testCss: function () {
        var a = __.body,
            b = $c("div"),
            c, d, g, f = parseFloat($(a).$getStyle("marginTop")) || 0;
        b.style.cssText = "position:absolute; top: 0; left: 0; margin: 0; border: 0; width: 1px; height: 1px; visibility: hidden;";
        b.innerHTML = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
        a.insertBefore(b, a.firstChild);
        c = b.firstChild;
        d = c.firstChild;
        g = c.nextSibling.firstChild.firstChild;
        this.doesNotAddBorder = 5 !== d.offsetTop;
        this.doesAddBorderForTableAndCells = 5 === g.offsetTop;
        d.style.position = "fixed";
        d.style.top = "20px";
        this.supportsFixedPosition = 20 === d.offsetTop || 15 === d.offsetTop;
        d.style.position = d.style.top = "";
        c.style.overflow = "hidden";
        c.style.position = "relative";
        this.subtractsBorderForOverflowNotVisible = -5 === d.offsetTop;
        this.doesNotIncludeMarginInBodyOffset = a.offsetTop !== f;
        a.removeChild(b);
        this.testCss = $doNothing
    },
    testIEZoom: function () {
        if (!$$.browser.IE7) return 1;
        var a = $$.support.zoomTester;
        if (!a) {
            var a = __.body,
                a = $$.status.container || a,
                b = __.createElement("div");
            b.style.cssText = "position:absolute;left:-10000px;top:-10000px;width:100px;height:100px;";
            a.appendChild(b);
            a = this.zoomTester = b
        }
        a = a.getBoundingClientRect();
        return (a.right - a.left) / 100 || 1
    },
    zoomTester: null
};
Ctrip.support = function () {
    return {
        getModAttrs: function (a, b) {
            for (var c = {}, d = b.length; d--;) c[b[d].replace(/([^_]+_){1,2}/, "")] = a.getAttribute(b[d]);
            return c
        },
        isMod: function (a, b) {
            var c = a.getAttribute("mod");
            return !c ? !1 : !b ? !0 : RegExp("(||^)" + b.toLowerCase() + "(||$)", "i").test(c.toLowerCase())
        }
    }
}();
var $offsetWin, $offset;
"getBoundingClientRect" in ___ ? ($offsetWin = function (a) {
    var b = [0, 0],
        c = a.ownerDocument,
        d = $$.support.testIEZoom();
    c && $contains(c.documentElement, a) && (a = a.getBoundingClientRect(), b[0] = Math.round(a.left / d), b[1] = Math.round(a.top / d));
    return b
}, $offset = function (a) {
    if (!a) return null;
    var b = [0, 0],
        c = $viewSize(a),
        a = $offsetWin(a),
        d = $$.support.testIEZoom();
    b[1] = a[1] + Math.round((c.scrollTop - c.clientTop) / d);
    b[0] = a[0] + Math.round((c.scrollLeft - c.clientLeft) / d);
    return b
}) : ($offset = function (a) {
    if (!a) return null;
    $$.support.testCss();
    var b = a.ownerDocument,
        c = b.documentElement,
        d = [a.offsetLeft, a.offsetTop],
        g = a.offsetParent,
        f;
    f = b.defaultView ? b.defaultView.getComputedStyle(a, null) : a.currentStyle;
    for (var k = $$.support, p = /^t(?:able|d|h)$/i;
    (a = a.parentNode) && a !== b.body && a !== c && !(k.supportsFixedPosition && "fixed" === f.position);) {
        f = b.defaultView ? b.defaultView.getComputedStyle(a, null) : a.currentStyle;
        d[0] -= a.scrollLeft;
        d[1] -= a.scrollTop;
        if (a === g) {
            d[0] += a.offsetLeft;
            d[1] += a.offsetTop;
            if (k.doesNotAddBorder && (!k.doesAddBorderForTableAndCells || !p.test(a.nodeName))) d[1] += parseFloat(f.borderTopWidth) || 0, d[0] += parseFloat(f.borderLeftWidth) || 0;
            g = a.offsetParent
        }
        k.subtractsBorderForOverflowNotVisible && "visible" !== f.overflow && (d[1] += parseFloat(f.borderTopWidth) || 0, d[0] += parseFloat(f.borderLeftWidth) || 0)
    }
    if ("relative" === f.position || "static" === f.position) d[1] += b.body.offsetTop, d[0] += b.body.offsetLeft;
    k.supportsFixedPosition && "fixed" === f.position && (Math.max(c.scrollTop, b.body.scrollTop), Math.max(c.scrollLeft, b.body.scrollLeft));
    return d
}, $offsetWin = function (a) {
    var b = [0, 0],
        c = $viewSize(a),
        a = $offset(a);
    b[1] = a[1] - c.scrollTop + c.clientTop;
    b[0] = a[0] - c.scrollLeft + c.clientLeft;
    return b
});
Ctrip.module.recommend = function (a) {
    function b(a) {
        var b = ++p,
            q = a.innerHTML.trim(),
            a = a.getAttribute("page");
        d.innerHTML = q;
        var j = 'if(typeof(SetLink)=="function"){SetLink(setlink_isbig5, \'' + c + "Panel');}";
        if (q in k) {
            f.innerHTML = k[q];
            eval(j)
        } else {
            f.innerHTML = '<div class="pic_loading"></div>';
            $ajax(a, null, function (a) {
                if (p == b && a !== false) {
                    k[q] = f.innerHTML = a;
                    eval(j)
                }
            })
        }
    }
    var c = a.id,
        d = $(c + "Txt"),
        g = $(c + "Div"),
        f = $(c + "Panel");
    if (d && g && f) {
        var k = {};
        k[d.innerHTML.trim()] = f.innerHTML;
        var p = 0;
        a.hideFocus = true;
        a.style.outline = "none";
        var j = false;
        a.$r("focus", function () {
            j = true;
            a.className = "choice_focus";
            g.style.display = ""
        });
        a.$r("blur", function () {
            j = false;
            a.className = "choice_more";
            g.style.display = "none"
        });
        a.$r("mousedown", function () {
            j ? setTimeout(function () {
                a.blur()
            }) : ($$.browser.Safari || $$.browser.Chrome) && setTimeout(function () {
                a.focus()
            })
        });
        g.$r("mousedown", function (a) {
            var c = $fixE(a).$target;
            if (c.tagName == "A") {
                b(c);
                $$.browser.IE && setTimeout(function () {
                    c.outerHTML = c.outerHTML + ""
                })
            }
        })
    }
};
var c_allyes_text = {},
    c_allyes_delay = 1E3;
Ctrip.module.allyes = function (a) {
    function b(b, c) {
        var d = a.getAttribute(b);
        return !d ? null : c ? c[d] || null : d
    }
    function c(a) {
        var b = location.pathname,
            b = b.slice(b.lastIndexOf("/") + 1);
        return /^(SearchFlights\.aspx|SearchHotels\.aspx|query\.asp)$/i.test(b) ? a[0] : a[1]
    }
    var d = b("user") || b("mod_allyes_user");
    if (!d) {
        var g = b("mod_allyes_buttons", window),
            f = b("mod_allyes_text", window.c_allyes_text);
        if (!g && !f) return
    }
    setTimeout(function () {
        if (d) {
            d.indexOf("@") > -1 && (d = c(d.split("@")));
            a.innerHTML = '<iframe marginheight="0" width="100%" height="100%" marginwidth="0" frameborder="0" scrolling="no" src="http://allyes.ctrip.com/main/adfshow?user={$user}&db=ctrip&border=0&local=yes"></iframe>'.replace("{$user}", d)
        } else {
            var b = [];
            g && (b = g.map(function (a) {
                a.button = a.button || ";";
                return '<div class="base_ad140x60" style="height:{$height}px">{$iframe}</div>'.replace("{$height}", a.height).replace("{$iframe}", '<iframe marginheight="0" width="100%" height="100%" marginwidth="0" frameborder="0" scrolling="no" src="http://allyes.ctrip.com/main/adfshow?user={$user}&db=ctrip&border=0&local=yes"></iframe>'.replace("{$user}", a.user))
            }));
            f && b.push('<div class="base_adtxt140">{$text}</div>'.replace("{$text}", _.$s2t(f)));
            a.innerHTML = b.join("")
        }
    }, window.c_allyes_delay)
};
Ctrip.module.notice = function (a) {
    var b;
    a.module.notice = new function () {
        this.enabled = true;
        this.tip = a.getAttribute("mod_notice_tip") || "";
        this.check = function () {
            if (a.module.notice.enabled) with(a) if (isNull()) {
                style.color = "gray";
                value = module.notice.tip
            } else style.color = ""
        };
        this.isNull = a.isNull = function () {
            return a.value.trim() == "" || a.value == a.module.notice.tip
        }
    };
    a.$r("focus", function () {
        b = true;
        if (a.module.notice.enabled) {
            a.style.color = "";
            if (a.value == a.module.notice.tip) a.value = ""
        }
    }, 10);
    a.$r("blur", function () {
        b = false;
        a.module.notice.check()
    }, 90);
    if (a.form) {
        $(a.form).$r("submit", function () {
            if (a.isNull()) a.value = "";
            setTimeout(function () {
                b || a.module.notice.check()
            }, 1)
        });
        $$.browser.IE || _.$r("beforeunload", a.module.notice.check)
    }
    a.module.notice.check()
};
Ctrip.module.tab = function (a) {
    var b = _.$g(a.getAttribute("mod_tab_button") || ""),
        c = _.$g(a.getAttribute("mod_tab_panel") || ""),
        d = parseInt(a.getAttribute("mod_tab_select") || 1, 10),
        g = ((a.getAttribute("mod_tab_event") || "").match(/^mouseover$/i) || "click").toString();
    if (b && c) {
        a.module.tab = new function () {
            this.funcListHash = {};
            this.select = function (a) {
                if (this.funcListHash[a - 1]) this.funcListHash[a - 1]()
            };
            this.index = d
        };
        b.each(function (d, k) {
            a.module.tab.funcListHash[k] = function () {
                b.each(function (a, b) {
                    a.className = a.className.replace(/_(no)?current/g, "_" + (k == b ? "" : "no") + "current");
                    if (c[b]) c[b].style.display = k == b ? "" : "none"
                });
                a.module.tab.index = k + 1
            };
            d.$r(g, a.module.tab.funcListHash[k])
        });
        a.module.tab.select(d)
    }
};
Ctrip.module.display = function (a) {
    var b = [];
    a.$getPara("mod_display_panel").each(function (a) {
        (a = _.$(a) || _.$selNode(a)) && (a.length ? a.each(function (a) {
            b.push(a)
        }) : b.push(a))
    });
    a.$r("click", function () {
        (function (a) {
            for (var b = 0; b < a.childNodes.length; b++) with(a.childNodes[b]) if (nodeType == 3) {
                var g = RegExp($$.string.display.match(/[^@]+/g).join("|"), "gi");
                nodeValue = nodeValue.replace(g, function (a) {
                    a = $$.string.display.match(RegExp("@" + a + "\\|([^@]+)|([^@]+)\\|" + a + "@", "i"));
                    return a[1] || a[2]
                })
            } else arguments.callee(a.childNodes[b])
        })(a);
        b.each(function (a) {
            a.style.display = a.$getStyle("display") == "none" ? "" : "none"
        })
    })
};
Ctrip.module.selectAll = function (a) {
    var b = _.$selNode(a.getAttribute("mod_selectAll_input") || "");
    if (b) {
        b.each(function (c) {
            c != a && c.$r("onclick", function () {
                a.checked = b.each(function (b) {
                    if (b != a && !b.checked) return false
                })
            })
        });
        a.$r("click", function () {
            b.each(function (b) {
                b.checked = a.checked
            })
        })
    }
};
Ctrip.module.validate = function (a) {
    var b = _.$(a.getAttribute("mod_validate_true") || ""),
        c = _.$(a.getAttribute("mod_validate_false") || ""),
        d = a.getAttribute("mod_validate_function") || "";
    if (d) {
        var g = d.match(/^\/(.*?[^\\])\/([gmi]*?)$/),
            f, k, p, d = a[d] || _[d];
        if (g || d) {
            a.module.validate = new function () {
                this.check = function () {
                    a.value || !b && !c ? p = !(k = d ? d(a.value, a) : a.value.match(RegExp(g[1], g[2]))) : k = p = false;
                    if (b) b.style.display = k ? "" : "none";
                    if (c) c.style.display = p ? "" : "none"
                }
            };
            a.$r("focus", function () {
                f = setInterval(a.module.validate.check, 200)
            });
            a.$r("blur", function () {
                a.module.validate.check();
                clearInterval(f)
            })
        }
    }
};
$$.module.jmpInfo = {
    timers: {
        show: 300,
        hide: 150,
        refresh: 200
    },
    container: $("tuna_jmpinfo") || $("z1"),
    template: {},
    array: {},
    load_timeout: 3E3,
    template_dir: $webresourceUrl("/code/js/resource/jmpinfo_tuna/"),
    data_dir: $webresourceUrl("/code/js/resource/jmpinfo_tuna/"),
    ready: 0
};
(function (a) {
    function b(a) {
        this.direct = {
            t: /(.)t\1b/,
            r: /r(.)l\1/,
            b: /(.)b\1t/,
            l: /l(.)r\1/
        };
        this.setInfo(a)
    }
    function c(c) {
        g && clearTimeout(g);
        g = setTimeout(function () {
            if (f && $contains(f, p)) {
                c.getAttribute("mod");
                var a = k.jmpinfo;
                if (a) a.setInfo(c);
                else switch ("jmpinfo") {
                case "jmpinfo":
                    a = new b(c);
                    break;
                default:
                    throw "No this type jmpinfo yet!";
                }
                a.show()
            }
        }, a.timers.show)
    }
    function d(a) {
        var a = p = $fixE(a).$target,
            b;
        if (b = a) {
            for (; !Ctrip.support.isMod(b, "jmpinfo") && ___ != b;) b = b.parentNode;
            b = b == ___ ? null : $(b)
        } else b = null;
        if (b) {
            if (!f || !$contains(f, a)) {
                c(b);
                f = b
            }
        } else f = null
    }
    var g, f, k = {},
        p, j, h = {
            "align-center": "ctcb",
            "align-left": "ltlb",
            "corner-left": "ltrb",
            "align-right": "rtrb",
            "corner-right": "rtlb",
            "above-align-left": "lblt",
            "above-align-right": "rbrt"
        };
    b.prototype = {
        show: function () {
            if (this.ckStatus()) {
                a.ready = 1;
                if (j) j.style.display = "none";
                var b = a.container;
                this.fillHtml(b, this.toHtml());
                this.setPosition(b, this.elem, this.position);
                this.setIframe();
                this.countDownHide();
                $type(this.callback) === "function" && this.callback.call(null, "show", this.elem, this)
            } else setTimeout(arguments.callee.bind(this), a.timers.refresh)
        },
        ckStatus: function () {
            var b = this.query ? !! a.array[this.query.name] : true;
            return !!a.template[this.page] && b
        },
        ckAjaxStatus: function () {
            return this.ajaxUrl == "" ? true : this.ajaxComplete
        },
        hide: function () {
            a.container.style.display = "none";
            f = null;
            this.clearIframe();
            $type(this.callback) === "function" && this.callback.call(null, "hide", this.elem, this)
        },
        setIframe: function () {
            j = (this.box || a.container).$setIframe()
        },
        clearIframe: function () {
            (this.box || a.container).$clearIframe();
            j = null
        },
        setPosition: function (a, b, c) {
            a.style.display = "";
            c && c.length == 2 || (c = this.exchangeDirction(a, b));
            this.setPos(a, b, c)
        },
        setPos: function (a, b, c) {
            this.arrow && this.exchangeClass(a, b, c.join(""));
            a.$setPos.apply(a, [b].concat(c))
        },
        exchangeDirction: function (a, b) {
            var c = b.$getPos(),
                d = this.view(),
                f = b.offsetWidth,
                h = b.offsetHeight,
                j = a.offsetWidth,
                g = a.offsetHeight,
                k = ["l", "t", "l", "b"];
            if (c[0] + j > d.right && c[0] + f - j >= d.left) {
                k[0] = "r";
                k[2] = "r"
            }
            if (c[1] + h + g > d.bottom && c[1] - g >= d.top) {
                k[1] = "b";
                k[3] = "t"
            }
            return [k.slice(0, -2).join(""), k.slice(2).join("")]
        },
        view: function () {
            var a = $pageSize("win");
            a.right = a.left + a.width;
            a.bottom = a.top + a.height;
            return a
        },
        fillHtml: function (a, b) {
            a.innerHTML = b;
            $parserRe(a);
            this.initElements()
        },
        initElements: function () {
            var b = a.container.$g(".base_jmp");
            this.box = b ? b[0] : a.container;
            this.arrow = (b = a.container.$("b")) ? b[0] : null
        },
        exchangeClass: function (a, b, c) {
            for (var d in this.direct) {
                var f = c.match(this.direct[d]);
                if (f) {
                    this.box.className = this.box.className.replace(/[trbl]$/, d);
                    this.arrow.className = this.arrow.className.replace(/[trbl]$/, d);
                    this.calculateArrow(a, b, d, f[1]);
                    return
                }
            }
            throw "This direction of jmpInfo is not support yet!";
        },
        calculateArrow: function (a, b, c, d) {
            if ("tb".indexOf(c) >= 0) {
                a = a.offsetWidth;
                b = b.offsetWidth;
                c = this.arrow.offsetWidth;
                if (d === "l") this.arrow.style.left = (Math.min(a, b) - c) / 2 + "px";
                else if (d === "r") this.arrow.style.right = (Math.min(a, b) - c) / 2 + "px";
                else if (d === "c") this.arrow.style.left = (Math.max(a, b) - c) / 2 + "px"
            }
        },
        getInfo: function () {},
        setInfo: function (a) {
            this.elem = a;
            var b = (a.getAttribute("mod_jmpInfo_page") || "default_normal").split("?");
            this.page = !/^#/.test(b[0]) ? b[0].replace(/\.asp$/i, "").toLowerCase() : b[0];
            this.query = this.parseQuery(b.slice(1).join(""));
            this.ready = Math.min(this.loadData(this.query), this.loadTemplate(this.page));
            this.content = (a.getAttribute("mod_jmpInfo_content") || "").split("|");
            b = a.getAttribute("mod_jmpInfo_position") || "auto";
            b in h && (b = h[b]);
            this.position = b.match(/[ltrbc]{2}/ig);
            if ((a = a.getAttribute("mod_jmpInfo_callback")) && $type(_[a]) === "function") this.callback = _[a];
            return this
        },
        toHtml: function () {
            var b = a.template[this.page],
                c = b.match(/<body.*?>([\s\S]+)<\/body>/i),
                b = (c ? c[1] : b).replace(/<\!--[\s\S]*?--\>/g, ""),
                c = {
                    para: this.content
                };
            this.query && (c.array = this.queryData(this.query));
            return this.fillContent(b, c)
        },
        parseQuery: function (a) {
            if (!a) return null;
            a = a.split("=");
            return a.length < 2 ? null : {
                name: a[0],
                value: a.slice(1).join("")
            }
        },
        loadData: function (b) {
            if (!b) return true;
            var b = b.name,
                c = a.array;
            if (c.hasOwnProperty(b)) return !!c[b];
            c[b] = false;
            $loadJs(a.data_dir + b + "_" + $$.status.charset + ".js", null, function (a) {
                if (a) return true
            }, a.load_timeout);
            return false
        },
        loadTemplate: function (b) {
            var c = a.template;
            if (c.hasOwnProperty(b)) return !!c[b];
            c[b] = false;
            if (b.charAt(0) === "#") {
                var d = __.$g(b);
                if (d) {
                    c[b] = this.htmlOf(d[0]);
                    return true
                }
            } else $loadJs(a.template_dir + b + ".js", "gbk", function (a) {
                if (a) return true
            }, a.load_timeout);
            return false
        },
        htmlOf: function (a) {
            if (!a || a.nodeType != 1) return "";
            a = a.cloneNode(true);
            a.removeAttribute("id");
            a.style.cssText = a.style.cssText.replace(/\bdisplay:\s*none;?/i, "");
            if ("outerHTML" in a) return a.outerHTML.replace(/(<[^>]+\sid=)(\w+)/g, '$1"$2"');
            for (var b = [], c = a.attributes, d = 0; d < c.length; d++) c[d].name != "id" && b.push(c[d].name + '="' + c[d].value + '"');
            b = b.length ? " " + b.join(" ") : "";
            c = a.tagName.toLowerCase();
            return "<" + c + b + ">" + a.innerHTML + "</" + c + ">"
        },
        fillContent: function (a, b) {
            var c = '(<(\\w+)[^>]*)\\bid="(' + $keys(b).join("|") + ')(\\d+)"([^>]*>)[\\s\\S]*?(<\\/\\2>)';
            return a.replace(RegExp(c, "gi"), function (a, c, d, f, j, h, g) {
                return c + h + (b[f][j - 1] || "") + g
            })
        },
        countDownHide: function () {
            var b = this,
                c = setInterval(function () {
                    if (!(f && $contains(f, p) || $contains(a.container, p))) {
                        b.hide();
                        clearInterval(c)
                    }
                }, a.timers.hide)
        },
        queryData: function (b) {
            var c = a.array[b.name],
                b = c.indexOf("@" + b.value + "|") + 1;
            return !b ? [] : c.slice(b, c.indexOf("@", b)).split("|")
        }
    };
    _.$r("domready", function () {
        a.container.style.visibility = "";
        ___.$r("mouseover", d)
    })
})($$.module.jmpInfo);
_.$r("domReady", function () {
    var a = ".tuna_calendar{width:362px;font-size:12px;font-family:tahoma, Arial, Helvetica, simsun, sans-serif;position:absolute;z-index:1000;background-color:#fff;border:solid 1px #999;-moz-box-shadow:3px 4px 5px #ccc;-webkit-box-shadow:3px 4px 5px #ccc;box-shadow:3px 4px 5px #ccc;margin:0;padding:5px 6px 4px}.tuna_calendar dt,.tuna_calendar dd{margin:0;padding:0}.tuna_calendar dl,.tuna_calendar dt,.tuna_calendar dd { margin:0; padding:0; }.tuna_calendar .select_day,.tuna_calendar dd a:hover,.tuna_calendar .calendar_title01 a,.tuna_calendar .calendar_title02 a,.tuna_calendar .today{background:#FFF url({$picserver}/common/un_bg_calender110117.png) no-repeat}.tuna_calendar a{color:#005ead;font-weight:bold;text-decoration:none!important}.tuna_calendar dl{float:left;width:175px;padding:6px 0 0}.tuna_calendar #calendar_month2{position:absolute;top:28px;left:186px;z-index:2;padding-bottom:5px;padding-left:6px;border-left:2px solid #999}.tuna_calendar dt{float:left;width:25px;height:22px;background:#ececec;font-weight:normal;color:#666;font-size:12px;line-height:20px;text-align:center;cursor:default}.tuna_calendar .day0,.tuna_calendar .day6{color:#f90;font-weight:bold}.tuna_calendar .day6{width:24px}.tuna_calendar dd{clear:both;padding-top:1px;display:inline-block}.tuna_calendar dd a{font-size:11px;text-align:center;height:24px;width:22px;line-height:24px;float:left;outline-width:0;background-color:#fff;padding:0 2px 1px 1px}.tuna_calendar dd a:hover{background-color:#fff;background-position:-26px -48px}.tuna_calendar .today{font-weight:bold;background-position:0 -74px;}.tuna_calendar .today:hover{}.tuna_calendar .select_day,.tuna_calendar .select_day:hover{color:#fff;background-color:#629be0;background-position:0 -48px}.tuna_calendar .blank_day,.tuna_calendar .over_day{color:#dbdbdb;font-weight:normal;cursor:default}.tuna_calendar .blank_day:hover,.tuna_calendar .over_day:hover{background-color:#fff;background-image:none}.tuna_calendar div{float:left;width:181px;color:#fff;font-weight:bold;height:23px;background:#004fb8}.tuna_calendar div a{cursor:pointer;width:40px;line-height:20px}.tuna_calendar .calendar_title01 span,.tuna_calendar .calendar_title02 span{float:left;width:143px;text-align:center;line-height:23px}.tuna_calendar .calendar_title01 span{padding-right:14px}.tuna_calendar .calendar_title02 span{padding-left:14px}.tuna_calendar .calendar_title01 a,.tuna_calendar .calendar_title02 a{background-color:#2d7fdd;float:left;width:23px;height:23px;overflow:hidden;text-indent:-10em}.tuna_calendar .calendar_title01 a{float:left}.tuna_calendar .calendar_title02 a{background-position:right 0;float:right}.tuna_calendar .calendar_title01 a:hover{background-color:#4895ec;background-position:0 -24px}.tuna_calendar .calendar_title02 a:hover{background-color:#4895ec;background-position:right -24px}.tuna_calendar b,.tuna_calendar i{background-color:#fff;display:block;width:372px;height:1px;border-right:1px solid #c3c3c3;border-left:1px solid #c3c3c3;overflow:hidden;position:absolute;left:0;z-index:1}.tuna_calendar i{border-top:1px solid #999;top:-2px}.tuna_calendar b{border-bottom:1px solid #999;bottom:-2px;_bottom:-3px}address_hot li,.address_hot_abb,.address_hot_adress{list-style:none;margin:0;padding:0}.address_hot_adress a{text-decoration:none}#tuna_address{font-family: Arial,Simsun; font-size: 12px;}#tuna_address #address_warp{background: none repeat scroll 0 0 #FFFFFF; border: 1px solid #7F9DB9; margin: 0; min-height: 305px; padding: 0 0 4px; text-align: left; width: 220px;}* html #tuna_address #address_warp{height: 305px;}#tuna_address #address_message{background-color: #67A1E2; border: medium none; color: #FFFFFF; display: block; font-family: Simsun; height: 1.7em; line-height: 20px; overflow: hidden; padding: 2px 0 2px 9px; width: auto; white-space: nowrap; text-overflow: ellipsis;}#tuna_address #address_list{margin: 0; min-height: 277px; padding: 0;}* html #tuna_address #address_list{height: 277px;}#tuna_address #address_list span{float: right; font: 10px/22px verdana; margin: 0; overflow: hidden; padding: 0; text-align: right; white-space: nowrap; width: 110px;}#tuna_address #address_list a{border-bottom: 1px solid #FFFFFF; border-top: 1px solid #FFFFFF; color: #0055AA; cursor: pointer; display: block; height: 22px; line-height: 22px; min-height: 22px; overflow: hidden; padding: 1px 9px 0; text-align: left; text-decoration: none;}* html #tuna_address #address_list a{height: 22px;}#tuna_address #address_list a:hover{background: none repeat scroll 0 0 #E8F4FF; border-bottom: 1px solid #7F9DB9; border-top: 1px solid #7F9DB9;}#tuna_address .address_selected{background: none repeat scroll 0 0 #FFE6A6; color: #FFFFFF; height: 22px;}#tuna_address .address_pagebreak{display: none; line-height: 25px; margin: 0; padding: 0; text-align: center;}#tuna_address .address_pagebreak a{color: #0055AA; display: inline-block; font-family: Arial,Simsun,sans-serif; font-size: 14px; margin: 0; padding: 0 4px; text-align: center; text-decoration: underline; width: 15px;}#tuna_address #address_arrowl, #tuna_address #address_arrowr{color: #0055AA;}#tuna_address a.address_current{color: #000000; text-decoration: none;}.address_hot{background-color: #FFFFFF; font-size: 12px; width: 283px;}.address_hotcity{background-color: #67A1E2; border-color: #2C7ECF; border-style: solid; border-width: 1px 1px 0; color: #CEE3FC; height: 24px; line-height: 24px; padding-left: 10px;}.address_hotcity strong{color: #FFFFFF;}.address_hotlist{border-color: #999999; border-style: solid; border-width: 0 1px 1px; overflow: hidden; padding: 5px;}.address_hot_abb{border-bottom: 1px solid #5DA9E2; padding-bottom: 20px;}.address_hot_abb li{color: #005DAA; cursor: pointer; float: left; height: 20px; line-height: 20px; list-style-type: none; text-align: center;}.address_hot_abb li span{padding:0 8px;}.address_hot_abb li .hot_selected{display:block; padding:0 7px; background-color: #FFFFFF; border-color: #5DA9E2; border-style: solid; border-width: 1px 1px 0; color: #000000; font-weight: bold;}.address_hot_adress{padding-top: 4px; width: 100%;}.address_hot_adress li{float: left; height: 24px; overflow: hidden; width: 67px;}.address_hot_adress li a{border: 1px solid #FFFFFF; color: #000000; display: block; height: 22px; line-height: 22px; padding-left: 5px;}.address_hot_adress li a:hover{background-color: #E8F4FF; border: 1px solid #ACCCEF; text-decoration: none;}.span_fest{text-indent:-9999px} .yuan_dan span, .chu_xi span, .chun_jie span, .yuan_xiao span, .qing_ming span, .lao_dong span, .duan_wu span, .zhong_qiu span, .guo_qing span { display:block; height:24px; background-image:url({$picserver}/common/icon_festival.png); background-repeat:no-repeat; } .tuna_calendar .yuan_dan:hover, .tuna_calendar .chu_xi:hover, .tuna_calendar .chun_jie:hover, .tuna_calendar .yuan_xiao:hover, .tuna_calendar .qing_ming:hover, .tuna_calendar .lao_dong:hover, .tuna_calendar .duan_wu:hover, .tuna_calendar .zhong_qiu:hover, .tuna_calendar .guo_qing:hover { background-image:url({$picserver}/common/icon_festival.png); background-repeat:no-repeat; background-position:0 -400px; cursor:pointer; } .tuna_calendar .festival_select, .tuna_calendar .festival_select:hover { background-image:url({$picserver}/common/icon_festival.png); background-repeat:no-repeat; background-position:0 -360px; } .yuan_dan span { background-position:0 6px; } .chu_xi span { background-position:0 -35px; } .chun_jie span { background-position:0 -74px; } .yuan_xiao span { background-position:0 -114px; } .qing_ming span { background-position:0 -155px; } .lao_dong span { background-position:0 -194px; } .duan_wu span { background-position:0 -234px; } .zhong_qiu span { background-position:0 -274px; } .guo_qing span { background-position:0 -314px; }".replaceWith({
        picserver: $picUrl("")
    }),
        b;
    if ($$.browser.IE) {
        b = document.createStyleSheet();
        b.cssText = a
    } else {
        b = document.createElement("style");
        b.type = "text/css";
        b.textContent = a;
        document.getElementsByTagName("head")[0].appendChild(b)
    }
});
$$.string.address = {
    "zh-cn": {
        b: "\u8f93\u5165\u4e2d\u6587/\u62fc\u97f3\u6216\u2191\u2193\u9009\u62e9.",
        i: "\u8f93\u5165",
        j: "\u6216\u2191\u2193\u9009\u62e9.",
        k: "\u4e2d\u6587/\u62fc\u97f3",
        e: "\u8bf7\u8f93\u5165\u81f3\u5c11\u4e24\u4e2a\u5b57\u6bcd\u6216\u4e00\u4e2a\u6c49\u5b57.",
        h: "",
        o: "\u6309\u62fc\u97f3\u6392\u5e8f",
        s: "\u5bf9\u4e0d\u8d77, \u627e\u4e0d\u5230: ",
        l: "\u7ed3\u679c\u5171",
        p: "\u9879,\u2190\u2192\u7ffb\u9875",
        a: ",\u5171"
    },
    "zh-tw": {
        b: "\u8f38\u5165\u4e2d\u6587/\u62fc\u97f3\u6216\u2191\u2193\u9078\u64c7.",
        i: "\u8f38\u5165",
        j: "\u6216\u2191\u2193\u9078\u64c7.",
        k: "\u4e2d\u6587/\u62fc\u97f3",
        e: "\u8acb\u8f38\u5165\u81f3\u5c11\u5169\u500b\u5b57\u6bcd\u6216\u4e00\u500b\u6f22\u5b57.",
        h: "",
        o: "\u6309\u62fc\u97f3\u6392\u5e8f",
        s: "\u5c0d\u4e0d\u8d77, \u627e\u4e0d\u5230: ",
        l: "\u7d50\u679c\u5171",
        p: "\u9805,\u2190\u2192\u7ffb\u9801",
        a: ",\u5171"
    },
    en: {
        b: "Type or scroll to select.",
        i: "Input ",
        j: " or use up or down to select.",
        k: "English",
        e: "Please Input at least two character.",
        h: "",
        o: "sort by spelling",
        s: "No match",
        l: "Results ",
        p: ",left or right to turn page",
        a: ",All"
    }
}[$$.status.version];
$$.module.address.sourceMap = {};
(function () {
    var a, b, c, d, g, f, k, p, j, h, m, q, x, t, C, B;

    function L(a, b) {
        return RegExp("\\b" + b + "\\b").test(a.className)
    }
    function s(a, b) {
        var c = a.match(/^[^\|]+/),
            d = b.match(/^[^\|]+/);
        return c > d ? 1 : c == d ? 0 : -1
    }
    function W() {
        var a = $c("div");
        a.style.width = "0px";
        a.style.height = "0px";
        a.innerHTML = '<div id="tuna_address" style="display:none;position:absolute;top:0;z-index:120;overflow:hidden;-moz-box-shadow:2px 2px 5px #333;-webkit-box-shadow:2px 2px 5px #333;"><div id="address_warp"><div id="address_message">&nbsp;</div><div id="address_list"><a class="a1" href="###"><span>&nbsp;</span>&nbsp;</a><a class="a1" href="###"><span>&nbsp;</span>&nbsp;</a><a class="a1" href="###"><span>&nbsp;</span>&nbsp;</a><a class="a1" href="###"><span>&nbsp;</span>&nbsp;</a><a class="a1" href="###"><span>&nbsp;</span>&nbsp;</a><a class="a1" href="###"><span>&nbsp;</span>&nbsp;</a><a class="a1" href="###"><span>&nbsp;</span>&nbsp;</a><a class="a1" href="###"><span>&nbsp;</span>&nbsp;</a><a class="a1" href="###"><span>&nbsp;</span>&nbsp;</a><a class="a1" href="###"><span>&nbsp;</span>&nbsp;</a><a class="a1" href="###"><span>&nbsp;</span>&nbsp;</a><a class="a1" href="###"><span>&nbsp;</span>&nbsp;</a></div><div class="address_pagebreak" id="address_p"><a id="address_arrowl" href="javascript:;" name="p">&lt;-</a><a id="address_p1" href="javascript:;" name="1" class="address_current">1</a><a id="address_p2" href="javascript:;" name="2">2</a><a id="address_p3" href="javascript:;" name="3">3</a><a id="address_p4" href="javascript:;" name="4">4</a><a id="address_p5" href="javascript:;" name="5">5</a><a id="address_arrowr" href="javascript:;" name="n">-&gt;</a></div></div></div>';
        $("jsContainer").appendChild(a);
        r = $("tuna_address");
        $$.module.address.source["default"] = "@@";
        F = $("address_warp");
        u = $("address_message");
        z = $("address_list");
        H = [$("address_p"), $("address_p1"), $("address_p2"), $("address_p3"), $("address_p4"), $("address_p5")];
        N = $("address_arrowl");
        O = $("address_arrowr");
        y = z.getElementsByTagName("a");
        for (a = 0; a < y.length; a++) y[a].cloneNode(true)
    }
    var A = "_".toString() + "hotData";
    j = null;
    h = "\u70ed\u95e8";
    m = "ol";
    q = "ul";
    x = "span";
    t = {};
    b = '<div class="address_hot" style="display:none;top:0;-moz-box-shadow:2px 2px 5px #333;-webkit-box-shadow:2px 2px 5px #333;" id="address_hot">{$text}</div>';
    c = '<div class="address_hotcity"><strong>{$stext}</strong>{$text}</div>';
    d = '<div class="address_hotlist">{$text}</div>';
    g = '<ol class="address_hot_abb" style="{$style}">{$text}</ol>';
    f = "<li><span {$className}>{$text}</span></li>";
    k = '<ul class="address_hot_adress layoutfix" {$display} type="{$type}">{$text}</ul>';
    p = '<li><a href="###" data="{$data}">{$text}</a></li>';
    a = "hot_selected";
    B = C = void 0;
    var r, F, u, z, H, N, O, y, X = 0;
    Ctrip.module.address = function (n) {
        function M() {
            if (I && I.releaseCapture) {
                I.releaseCapture();
                I = null
            }
        }
        function ba() {
            (j || r).$setPos(n)
        }
        function ga() {
            var b = [],
                c;
            for (c in t) {
                X++;
                b.push(f.replaceWith({
                    text: c,
                    className: _.$s2t(n.hotSelected) == c ? "class=" + a : ""
                }))
            }
            return b.join("")
        }
        function ha() {
            var a = [],
                b;
            for (b in t) {
                var c = [],
                    c = t[b].replace(/@([^@]*)\|([^@]*)/g, function (a, b, c) {
                        return p.replaceWith({
                            data: [b, c].join("|"),
                            text: c
                        })
                    });
                a.push(k.replaceWith({
                    text: c,
                    display: $s2t(n.hotSelected) == $s2t(b) ? "" : "style='display:none'",
                    type: b
                }))
            }
            return a.join("")
        }
        function ia() {
            w.style.position = "absolute";
            var a = S.$getPos();
            w.offsetWidth + a[0] > ___.offsetWidth ? w.$setPos(S, "tr", "br") : w.$setPos(S)
        }
        function ca() {
            for (var a = w.getElementsByTagName(q), b = 0; b < a.length; b++) if (a[b].style.display == "") return a[b];
            return null
        }
        function ja(a, b) {
            clearInterval(P);
            var c = b.$target.getAttribute("data");
            if (!c) return false;
            c = c.split("|");
            focusTarget.value = c[1].trim();
            var d = focusTarget.getAttribute("mod_address_reference");
            if (d && $(d)) $(d).value = c[0].trim();
            w.$clearIframe();
            w.style.display = "none";
            n.blur();
            setTimeout(function () {
                o.focusNext && setTimeout(function () {
                    n.$focusNext()
                }, 1)
            }, 0);
            o.hook.change && o.hook.change($(n));
            return true
        }
        function ka() {
            w.onmousedown = function (b) {
                var b = $fixE(b),
                    c = b.$target;
                if (c.setCapture) {
                    M();
                    c.setCapture();
                    I = c
                }
                C = c.$parentNode(m);
                B = c.$parentNode(q);
                if (C) {
                    var b = C,
                        d = ca();
                    if (b && d) {
                        ca().style.display = "none";
                        n.hotSelected = c.innerText || c.textContent;
                        a: {
                            for (var d = _.$s2t(n.hotSelected), u = w.getElementsByTagName(q), z = 0; z < u.length; z++) if (u[z].getAttribute("type") == d) {
                                d = u[z];
                                break a
                            }
                            d = null
                        }
                        d.style.display = "";
                        a: {
                            b = b.getElementsByTagName(x);
                            for (d = 0; d < b.length; d++) if (L(b[d], a)) {
                                b = b[d];
                                break a
                            }
                            b = null
                        }
                        d = a;
                        if (L(b, d)) {
                            d = RegExp("(\\s|^)" + d.toReString() + "(\\s|$)");
                            b.className = b.className.replace(d, " ").split(" ").join(" ")
                        }
                        c = c.tagName == x.toUpperCase() ? c : c.getElementsByTagName(x)[0];
                        b = a;
                        if (!L(c, b)) c.className = c.className + " " + b;
                        w.$clearIframe();
                        w.$setIframe()
                    }
                } else {
                    if (B) return ja(B, b);
                    focusTarget.select()
                }
                return false
            };
            w.onmouseup = M
        }
        function la() {
            if (t = $$.module.address.source[o.source + A]) {
                S = n;
                n.select();
                if (!n.hotSelected) n.hotSelected = $$.module.address.source[o.source + "_selTabWord"] || h;
                var a = $("address_hot");
                a && a.parentNode.removeChild(a);
                var a = b.replaceWith({
                    text: [c.replaceWith({
                        stext: $$.module.address.source[o.source + "_keyTitle"] || "\u70ed\u95e8\u57ce\u5e02",
                        text: $$.module.address.source[o.source + "_keyWord"] || " \uff08\u53ef\u76f4\u63a5\u8f93\u5165\u57ce\u5e02\u6216\u57ce\u5e02\u62fc\u97f3\uff09"
                    }), d.replaceWith({
                        text: [g.replaceWith({
                            text: ga(),
                            style: X > 1 ? "" : "display:none;"
                        }), ha()].join("")
                    })].join("")
                }),
                    u = "",
                    a = a.replace(/\{guestId:(\w+)\}/g, function (a, b) {
                        u = b;
                        !n.guests[u] && $(u) && (n.guests[u] = $(u));
                        return '<div class="hot_guest" id="{id}"></div>'.replace("{id}", b + da)
                    }),
                    z = $c("div");
                z.innerHTML = a;
                w = $(z.removeChild(z.firstChild));
                __.body.appendChild(w);
                for (u in n.guests) {
                    a = $(u + da);
                    a.parentNode.className = "";
                    a.parentNode.replaceChild(n.guests[u], a)
                }
                w.style.display = "";
                w.style.zIndex = 111;
                ia();
                w.$setIframe();
                ka();
                X = 0
            }
        }
        function T(a) {
            a && $stopEvent(a);
            switch (this) {
            case N:
                D.m_get(D.page - 1);
                break;
            case O:
                D.m_get(D.page + 1);
                break;
            default:
                D.m_get(parseInt(this.firstChild.nodeValue))
            }
            return false
        }
        function Y() {
            with(r.style) {
                width = F.offsetWidth + "px";
                height = F.offsetHeight + "px"
            }
            r.$setIframe()
        }
        function ea() {
            if (o.suggest.length == 0) {
                r.style.display = "none";
                if (v !== null) {
                    y[v].className = "";
                    v = null
                }
            } else {
                D.m_set(o.suggest);
                u.lastChild.nodeValue = $$.status.version.match(/^zh-/) ? $$.string.address.i + (n.module.notice ? n.module.notice.tip : $$.string.address.k) + $$.string.address.j : $$.string.address.b
            }
        }
        function Z() {
            focusTarget = n;
            var a = n.value.trim();
            if (a !== U) {
                U = a;
                a = a.replace(/([\(\)\\\[\]\.\+\?\*\|\^\$])/gi, "\\$1").replace(/@|\|/gi, "");
                if (J && $$.module.address.source[o.source + A]) {
                    la();
                    J = false;
                    j = w
                } else {
                    if (w && !w.style.display) {
                        j = null;
                        w.$clearIframe();
                        w.style.display = "none"
                    }
                    if (a) {
                        if (w) {
                            w.$clearIframe();
                            w.style.display = "none"
                        }
                        r.style.display = "";
                        var b = $$.module.address.source[o.source],
                            c = RegExp("@([^@]*\\|)?" + a + "[^@]*", "gi"),
                            d = RegExp("@[^@]*" + a + "[^@]*", "gi"),
                            f = [],
                            h = [],
                            g = [],
                            b = b.replace(RegExp("@([^\\|@]*\\|)?" + a + "[^@]*", "gi"), function (a) {
                                f.push(a);
                                return ""
                            });
                        f && f.sort(s);
                        b = b.replace(c, function (a) {
                            h.push(a);
                            return ""
                        });
                        h && h.sort(s);
                        b = b.replace(d, function (a) {
                            g.push(a);
                            return ""
                        });
                        g && g.sort(s);
                        arr = f.concat(h).concat(g);
                        u.style.backgroundColor = arr.length ? "#67A1E2" : "#0053AA";
                        if (!arr || !arr.length) {
                            u.lastChild.nodeValue = o.auto ? $$.string.address.s + ($$.status.version == "en" ? "" : n.value) : $$.string.address.h + n.value + ", " + $$.string.address.o;
                            if (!o.auto) {
                                r.style.display = "none";
                                if (v !== null) {
                                    y[v].className = "";
                                    v = null
                                }
                            }
                            z.style.display == "none" && ea();
                            Y()
                        } else {
                            u.lastChild.nodeValue = $$.string.address.h + n.value + ", " + $$.string.address.o;
                            D.m_set(arr)
                        }
                        J = false
                    } else {
                        ea();
                        Y()
                    }
                }
            }
        }
        function V(a, b) {
            n.value = K[a][1] || K[a][0];
            if (o.reference) o.reference.value = K[a][2];
            if (E) E.value = K.join("|");
            o.hook.change && o.hook.change(n);
            if (v !== null) {
                y[v].className = "";
                v = null
            }
            b !== false && o.focusNext && setTimeout(function () {
                n.$focusNext()
            }, 1)
        }
        var I = null;
        n.guests = {};
        var da = (new Date).getTime(),
            S, w, Q, R = n.$getWin(),
            o = n.module.address = {},
            P, v = null,
            U, K = [],
            J = false;
        o.ver = n.getAttribute("mod_address_ver");
        o.autoFilter = /^(true|1)$/.test(n.getAttribute("mod_address_autofilter"));
        r || W();
        n.setAttribute("autoComplete", "off");
        $r("beforeunload", function () {
            n.setAttribute("autoComplete", "on")
        });
        o.focusNext = n.getAttribute("mod_address_focusNext");
        o.focusNext = /^(1|true)$/i.test(o.focusNext || "");
        o.reference = n.getAttribute("mod_address_reference");
        var E = n.getAttribute("mod_address_cookie");
        if (E) {
            E = R.$(E);
            if (!E) {
                var G = R.$c("input");
                with(G) {
                    type = "hidden";
                    id = name = E
                }
                E = G;
                n.parentNode.insertBefore(E, n)
            }
        }
        if (o.reference) o.reference = R.$(o.reference) || R.$(o.reference, true);
        var G = n.getAttribute("mod_address_suggest"),
            fa = n.getAttribute("mod_address_cookieSuggest");
        o.suggest = [];
        if (fa) {
            o.suggest = fa.match(/[^@]+@/gi);
            G && o.suggest._push(G.match(/[^@]+@/gi))
        } else if (G) o.suggest = G.match(/[^@]+@/gi);
        if (o.suggest.length > 12) o.suggest = o.suggest.slice(0, 12);
        o.source = n.getAttribute("mod_address_source") || "default";
        if (!$$.module.address.source[o.source]) {
            $$.module.address.source[o.source] = "@@";
            $$.module.address.sourceMap[o.source] ? $loadJs($$.module.address.sourceMap[o.source][0].replace(/\{\$charset\}/gi, $$.status.charset), ($$.module.address.sourceMap[o.source][1] || "").replace(/\{\$charset\}/gi, $$.status.charset) || $$.status.charset) : $loadJs($webresourceUrl("/code/js/resource/address_tuna/") + o.source + "_" + $$.status.charset + ".js", $$.status.charset)
        }
        o.auto = n.getAttribute("mod_address_auto");
        o.auto = o.auto && o.auto.match(/^(false|0)$/i) ? false : true;
        o.redraw = function () {
            P && Z()
        };
        o.hook = {};
        (n.getAttribute("mod_address_hook") || "").replace(/(on)?([^;:]+):([^;]+)/gi, function (a, b, c, d) {
            o.hook[c.toLowerCase()] = R[d]
        });
        var aa = false,
            D = new function () {
                var a;
                this.maxpage = this.page = 1;
                this.m_get = function (b) {
                    if (!a || !b || b < 1 || b > this.maxpage) return null;
                    this.page = b;
                    this.pagelist = a.slice((b - 1) * 12, Math.min(b * 12, a.length));
                    for (b = 0; b < y.length; b++) if (b < this.pagelist.length) {
                        y[b].style.display = "block";
                        var c = this.pagelist[b].replace(/@/g, "").split("|");
                        y[b].lastChild.nodeValue = c[1];
                        y[b].firstChild.firstChild.nodeValue = c[0];
                        K[b] = c
                    } else {
                        y[b].style.display = "none";
                        K[b] = null
                    }
                    if (v !== null) {
                        if (v >= this.pagelist.length) {
                            y[v].className = "";
                            v = this.pagelist.length - 1;
                            y[v].className = "address_selected"
                        }
                    } else {
                        v = 0;
                        y[0].className = "address_selected"
                    }
                    var b = this.maxpage < 6 || this.page < 3 ? 1 : this.page > this.maxpage - 2 ? this.maxpage - 4 : this.page - 2,
                        c = Math.min(b + 4, this.maxpage),
                        d;
                    N.style.display = this.page == 1 ? "none" : "";
                    O.style.display = this.page == this.maxpage ? "none" : "";
                    for (var f = b; f < b + 5; f++) {
                        d = H[f - b + 1];
                        if (f <= c) {
                            d.firstChild.nodeValue = f;
                            d.className = f == this.page ? "address_current" : "";
                            d.style.display = ""
                        } else d.style.display = "none"
                    }
                    H[0].style.display = this.maxpage > 1 ? "block" : "none";
                    z.style.display = u.style.display = "";
                    if (!Q) {
                        r.style.display = "";
                        b = n.$getPos();
                        r.offsetWidth + b[0] > ___.offsetWidth ? r.$setPos(n, "tr", "br") : r.$setPos(n);
                        r.$setIframe();
                        Q = true
                    }
                    Y.call(this)
                };
                this.m_set = function (b) {
                    a = b;
                    this.maxpage = Math.ceil(b.length / 12);
                    this.page = 1;
                    this.m_get(1)
                }
            };
        o.check = function () {
            var a = n.value.trim();
            n.isNull && n.isNull() && (a = "");
            var b;
            U = a;
            if (a = a.replace(/([\(\)\\\[\]\.\+\?\*\|\^\$])/gi, "\\$1").replace(/@|\|/gi, "")) {
                b = $$.module.address.source[o.source];
                var c = o.auto ? RegExp("@([^@]*\\|)?" + a + "[^@]*", "gi") : RegExp("@([^@]*\\|)?" + a + "(\\|[^@]*)?(?=@)", "gi"),
                    d = RegExp("@[^@]*" + a + "[^@]*", "gi"),
                    u = [],
                    z = [],
                    f = [];
                b = b.replace(o.auto ? RegExp("@([^\\|@]*\\|)?" + a + "[^@]*", "gi") : RegExp("@([^\\|@]*\\|)?" + a + "(\\|[^@]*)?(?=@)", "gi"), function (a) {
                    u.push(a);
                    return ""
                });
                u && u.sort(s);
                b = b.replace(c, function (a) {
                    z.push(a);
                    return ""
                });
                z && z.sort(s);
                if (o.auto) {
                    b = b.replace(d, function (a) {
                        f.push(a);
                        return ""
                    });
                    f && f.sort(s)
                }
                if ((b = u.concat(z).concat(f)) && b.length) {
                    Q = true;
                    D.m_set(b);
                    Q = false;
                    V(0, false)
                }
            }
            n.module.notice && n.module.notice.check();
            return !!b
        };
        n.$r("onfocus", function () {
            function a(b) {
                y[b].onmousedown = function () {
                    V(b);
                    n.blur()
                }
            }
            if (!aa) {
                aa = true;
                setTimeout(function () {
                    aa = false
                });
                J = true;
                Q = false;
                z.style.display = u.style.display = H[0].style.display = "none";
                r.onmousedown = function (a) {
                    J = false;
                    var a = $fixE(a),
                        b = a.$target;
                    if (b.setCapture) {
                        M();
                        b.setCapture();
                        I = b
                    }
                    $stopEvent(a, 1);
                    return false
                };
                r.onmouseup = M;
                _.$r("resize", ba);
                for (var b = 0; b < y.length; b++) new a(b);
                N.onmousedown = O.onmousedown = T;
                for (b = 1; b < H.length; b++) H[b].onmousedown = T;
                U = null;
                if (v !== null) y[v].className = "address_selected";
                o.hook.focus && o.hook.focus(n);
                Z();
                P = setInterval(Z, 150)
            }
        });
        n.blur();
        n.$r("onblur", function () {
            J = false;
            clearInterval(P);
            P = null;
            if (w) {
                w.$clearIframe();
                w.style.display = "none"
            }
            r.$clearIframe();
            r.style.display = "none";
            if (v !== null) {
                y[v].className = "";
                n.value && (o.auto ? V(v, false) : o.check());
                v = null
            }
            r.onmousedown = null;
            r.onmouseup = null;
            M();
            _.$ur("resize", ba)
        });
        n.$r("onkeydown", function (a) {
            var b = a ? a.keyCode : event.charCode,
                c = "|" + b + "|";
            if (v == null) {
                if ("|13|".indexOf(c) != -1) {
                    $stopEvent(a, 1);
                    o.focusNext && setTimeout(function () {
                        n.$focusNext()
                    }, 1)
                }
                return true
            }
            if ("|13|".indexOf(c) != -1) {
                $stopEvent(a, 1);
                V(v, void 0);
                n.blur()
            } else if ("|33|37|188|219|".indexOf(c) != -1) {
                T.call(N);
                $stopEvent(a, 1)
            } else if ("|34|39|61|190|221|".indexOf(c) != -1) {
                T.call(O);
                $stopEvent(a, 1)
            } else if ("|38|40|".indexOf(c) != -1) {
                y[v].className = "";
                v = v + (D.pagelist.length - 39 + b);
                v = v % D.pagelist.length;
                y[v].className = "address_selected";
                $stopEvent(a, 1)
            }
        });
        n.$r("onkeyup", function () {
            if (o.autoFilter && n.value) n.value = n.value.replace(/[^a-zA-Z'\u4E00-\u9FA5]+/g, "");
            n.focus()
        });
        o.hook.load && o.hook.load(n)
    }
})();
$$.module.calendar = {
    string: {
        "zh-cn": {
            a: "\u5e74",
            b: "\u6708",
            weekday: "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d",
            f: "yyyy-mm-dd"
        },
        "zh-tw": {
            a: "\u5e74",
            b: "\u6708",
            weekday: "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d",
            f: "yyyy-mm-dd"
        },
        en: {
            a: "",
            b: "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec",
            weekday: "SMTWTFS",
            f: "mm-dd-yyyy"
        }
    }[$$.status.version],
    fest: {
        "2011-2-2": "\u9664\u5915",
        "2012-1-22": "\u9664\u5915",
        "2013-2-9": "\u9664\u5915",
        "2011-2-3": "\u6625\u8282",
        "2012-1-23": "\u6625\u8282",
        "2013-2-10": "\u6625\u8282",
        "2011-2-4": "\u521d\u4e8c",
        "2012-1-24": "\u521d\u4e8c",
        "2013-2-11": "\u521d\u4e8c",
        "2011-2-5": "\u521d\u4e09",
        "2012-1-25": "\u521d\u4e09",
        "2013-2-12": "\u521d\u4e09",
        "2011-2-6": "\u521d\u56db",
        "2012-1-26": "\u521d\u56db",
        "2013-2-13": "\u521d\u56db",
        "2011-2-7": "\u521d\u4e94",
        "2012-1-27": "\u521d\u4e94",
        "2013-2-14": "\u521d\u4e94",
        "2011-2-8": "\u521d\u516d",
        "2012-1-28": "\u521d\u516d",
        "2013-2-15": "\u521d\u516d",
        "2011-2-9": "\u521d\u4e03",
        "2012-1-29": "\u521d\u4e03",
        "2013-2-16": "\u521d\u4e03",
        "2011-2-10": "\u521d\u516b",
        "2012-1-30": "\u521d\u516b",
        "2013-2-17": "\u521d\u516b",
        "2011-1-1": "\u5143\u65e6",
        "2012-1-1": "\u5143\u65e6",
        "2013-1-1": "\u5143\u65e6",
        "2011-4-5": "\u6e05\u660e\u8282",
        "2012-4-4": "\u6e05\u660e\u8282",
        "2013-4-4": "\u6e05\u660e\u8282",
        "2011-6-6": "\u7aef\u5348\u8282",
        "2012-6-23": "\u7aef\u5348\u8282",
        "2013-6-12": "\u7aef\u5348\u8282",
        "2011-5-1": "\u52b3\u52a8\u8282",
        "2012-5-1": "\u52b3\u52a8\u8282",
        "2013-5-1": "\u52b3\u52a8\u8282",
        "2011-10-1": "\u56fd\u5e86\u8282",
        "2012-10-1": "\u56fd\u5e86\u8282",
        "2013-10-1": "\u56fd\u5e86\u8282",
        "2011-9-12": "\u4e2d\u79cb\u8282",
        "2012-9-30": "\u4e2d\u79cb\u8282",
        "2013-9-19": "\u4e2d\u79cb\u8282",
        "2011-2-17": "\u5143\u5bb5\u8282",
        "2012-2-6": "\u5143\u5bb5\u8282",
        "2013-2-24": "\u5143\u5bb5\u8282"
    },
    festWidth: 120,
    festCls: {
        "\u5143\u65e6": "yuan_dan",
        "\u9664\u5915": "chu_xi",
        "\u6625\u8282": "chun_jie",
        "\u5143\u5bb5\u8282": "yuan_xiao",
        "\u6e05\u660e\u8282": "qing_ming",
        "\u7aef\u5348\u8282": "duan_wu",
        "\u52b3\u52a8\u8282": "lao_dong",
        "\u4e2d\u79cb\u8282": "zhong_qiu",
        "\u56fd\u5e86\u8282": "guo_qing"
    },
    template: '<div class="calendar_title01"><a id="calendar_lastmonth">&nbsp;</a><span id="calendar_title1">{$frontMonthStr}</span></div><div class="calendar_title02"><a id="calendar_nextmonth">&nbsp;</a><span id="calendar_title2">{$endMonthStr}</span></div><dl id="calendar_month1" t="{$frontMonth}">{$header}<dd>{$frontDay}</dd></dl><dl id="calendar_month2" t="{$endMonth}">{$header}<dd>{$endDay}</dd></dl><i>&nbsp;</i><b>&nbsp;</b>',
    className: {
        today: "today",
        over: "over_day",
        blank: "blank_day",
        select: "select_day",
        fselect: "festival_select"
    },
    attr: "mod_calendar_rangeStart,mod_calendar_rangeEnd,mod_calendar_rangeException,mod_calendar_permit,mod_calendar_prohibit,mod_calendar_weekday,mod_calendar_hook,mod_calendar_focusNext,mod_calendar_reference,mod_calendar_dateNote".split(","),
    init: $doNothing,
    current: null
};
(function (a) {
    function b() {
        var b = a.string.weekday.split(""),
            b = b.map(function (a, b) {
                return '<dt class="day' + b + '">' + a + "</dt>"
            }).join("");
        a.template = a.template.replace(/\{\$header\}/g, b);
        b = b = null
    }
    function c(a) {
        if (!a.$getData("__inited__")) {
            a.$r("focus", f);
            a.$r("blur", k);
            a.addEventListener ? a.addEventListener("input", p, false) : a.attachEvent("onpropertychange", function () {
                e = window.event;
                e.propertyName == "value" && p(e)
            });
            a.module.calendar = {
                hook: {},
                redraw: $doNothing,
                check: function () {
                    s.setConfig(a);
                    return s._check()
                }
            };
            W.push(a);
            a.$setData("__inited__", 1);
            var b = a.value.trim();
            b && b.isDateTime() && a.module.calendar.check()
        }
    }
    function d(a, b) {
        return (" " + a.className + " ").replace(/[\n\t]/g, " ").indexOf(" " + b + " ") > -1 ? true : false
    }
    function g() {
        a.current && s.show()
    }
    function f(b) {
        b = $fixE(b);
        a.current = b.$target;
        s.setConfig(this);
        s.handleFocus(b)
    }
    function k(b) {
        a.current = null;
        s.handleBlur(b)
    }
    function p(a) {
        s.handleChange(a)
    }
    function j(a, b) {
        var c = a.isDateTime();
        return c ? c.addDate(b).toStdString() : ""
    }
    function h(a) {
        if (a) {
            var b = a.innerText || a.textContent;
            if (a = a.$parentNode("dl")) return a.getAttribute("t").replace("dd", b)
        }
    }
    function m(a) {
        s.addCurrentMonth(a);
        s.fresh();
        return false
    }
    function q(a) {
        a = new Date(a);
        a.setDate(1);
        return a
    }
    function x(b) {
        b = $fixE(b).$target;
        if (b.setCapture) {
            t();
            b.setCapture();
            r = b
        }
        if (!b || b.nodeName !== "A" && b.className != "span_fest" || b.className === a.className.blank || b.className === a.className.over) return false;
        if (b.id === "calendar_nextmonth") return m(2);
        if (b.id === "calendar_lastmonth") return m(-2);
        s.handleMousedown(b);
        return false
    }
    function t() {
        if (r && r.releaseCapture) {
            r.releaseCapture();
            r = null
        }
    }
    function C(a) {
        return (a = a.isDateTime()) ? a.toStdString() : ""
    }
    function B(b) {
        try {
            var b = b || window.event,
                c = b.target || b.srcElement,
                c = $(c),
                d = s._data;
            if (d.reference) {
                var f = C(d.reference.value),
                    g = h(c);
                if (!(c.tagName != "A" || c.className == a.className.over) && g && f.isDateTime() && d.reference != null) if (g.isDateTime() > f.isDateTime()) {
                    var k = d._firstEl,
                        m = j(f, 1),
                        n = h(k);
                    if (n) {
                        var p;
                        for (n.isDateTime() > m.isDateTime() && (m = n); m != g;) {
                            p = $(m);
                            if (p != null && p.className == "" && p.className != a.className.over) p.style.cssText = "background-color: #D9E5F4;border-bottom: 1px solid #FFFFFF;padding-bottom: 0;";
                            m = j(m, 1)
                        }
                    }
                    F = true
                } else g == f && j(f, 1)
            }
        } catch (q) {}
    }
    function L() {
        if (F) {
            var a = s._data;
            if (a.reference) {
                var b = C(a.reference.value);
                if (b) {
                    for (a = a._lastEl; b != h(a);) {
                        var c = $(b);
                        if (c != null) c.style.cssText = "";
                        b = j(b, 1)
                    }
                    a.style.cssText = "";
                    s._elem && s._elem.value && s._setPeroidStyle()
                }
                F = false
            }
        }
    }
    var s, W = [],
        A;
    b.prototype = {
        addCurrentMonth: function (a) {
            var b = this._data._current;
            a || (a = 0);
            b.setMonth(b.getMonth() + a);
            return b
        },
        setConfig: function (b) {
            this._elem = b;
            this._data = b.$getModAttrs(a.attr);
            this._transConfig()
        },
        handleFocus: function () {
            this._fresh()
        },
        handleBlur: function () {
            this.hide();
            t()
        },
        handleChange: function (a) {
            this.setDateNote(a.nodeType ? a : a.srcElement || a.target)
        },
        fresh: function () {
            this._toHtml(true);
            try {
                this._setSelectEl()
            } catch (a) {}
        },
        focusNext: function () {
            var a = this;
            a._data.focusNext && setTimeout(function () {
                a._elem.$focusNext()
            }, 1)
        },
        _transConfig: function () {
            var a = this._elem,
                b = this._data,
                c = $$.status.today.isDateTime();
            this._today = new Date(c);
            this._closeAutoComplete(a);
            b._current = q(c);
            b._select = null;
            if (b.rangeStart) b.rangeStart = b.rangeStart === "#" ? c : b.rangeStart.isDateTime();
            if (b.rangeEnd) b.rangeEnd = b.rangeEnd === "#" ? c : b.rangeEnd.isDateTime();
            b.weekday = b.weekday || "1234567";
            if (b.rangeException) b.rangeException = b.rangeException.split("|");
            if (b.permit) b.permit = b.permit.split("|");
            if (b.prohibit) b.prohibit = b.prohibit.split("|");
            if (b.hook) {
                c = b.hook;
                b.hook = {};
                c.replace(/(on)?([^;:]+):([^;]+)/gi, function (a, c, d, f) {
                    b.hook[d.toLowerCase()] = f
                })
            }
            if (b.focusNext) b.focusNext = /^(1|true)$/i.test(b.focusNext);
            if (b.reference) b.reference = $(b.reference);
            b.check = this._check;
            b.redraw = $doNothing;
            var a = a.module.calendar,
                d;
            for (d in b) {
                a[d] && !$isEmptyObj(a[d]) && (b[d] = a[d]);
                d.indexOf("_") !== 0 && (a[d] = b[d])
            }
            a = b = c = a = null
        },
        _closeAutoComplete: function (a) {
            a.setAttribute("autoComplete", "off");
            $r("beforeunload", function () {
                a.setAttribute("autoComplete", "on")
            })
        },
        _toMatrix: function (b, c) {
            var d = b.getFullYear(),
                f = this._data,
                g = b.getMonth(),
                h = 0,
                j = [31, d % 4 || d % 400 && !d % 100 ? 28 : 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                m = a.className,
                k = b.getDay(),
                p = false,
                q = [],
                s = [],
                r, t;
            for (t = 0; t < 6; t++) {
                q[t] = [];
                for (r = 0; r < 7; r++) {
                    for (;;) {
                        var x = {
                            n: 0,
                            c: null
                        },
                            h = t * 7 + r - k + 1;
                        if (h <= 0 || h > j[g]) {
                            x.c = m.blank;
                            break
                        }
                        x.n = x.t = h;
                        b = new Date(d, g, h);
                        if (+b === +this._today) x.c = m.today;
                        if (this._check(b)) p = true;
                        else {
                            x.c = m.over;
                            break
                        }
                        if (+b === +f._select || f.reference && +f.reference.value.isDateTime() === +b) x.c = m.select;
                        if ((h = a.fest[b.toStdString()]) && a.festCls[h]) {
                            x.c ? x.c = "festival_select " + a.festCls[h] : x.c = a.festCls[h];
                            x.n = '<span class="span_fest">' + x.n + "</span>"
                        }
                        break
                    }
                    q[t][r] = x
                }
            }
            if (!p && c) return null;
            for (t = 0; t < 6; t++) for (r = 0; r < 7; r++) {
                s.push('<a href="javascript:;" {$cls} {$id}>{$d}</a>'.replaceWith({
                    cls: q[t][r].c ? 'class="' + q[t][r].c + '"' : "",
                    d: q[t][r].n || "&nbsp;",
                    id: 'id="' + [d, g + 1, q[t][r].t].join("-") + '"'
                }));
                if ((j = q[t][r].c) && (j == m.select || j.indexOf(m.fselect) != -1)) f._selElId = [d, g + 1, q[t][r].t].join("-")
            }
            return s.join("")
        },
        _check: function (a) {
            var b = this._elem,
                c = this._data;
            if (a) b = a.toStdString();
            else {
                b = b.isNull && b.isNull() ? "" : b.value.trim();
                a = b.isDateTime();
                if (!a) return false;
                this.setDateNote()
            }
            if (c.rangeStart && a < c.rangeStart || c.rangeEnd && a > c.rangeEnd) return false;
            b = b + "|";
            return (c.rangeException && (c.rangeException.join("|") + "|").indexOf(b) !== -1 || c.prohibit && (c.prohibit.join("|") + "|").indexOf(b) !== -1 || c.weekday.indexOf(a.getDay() || 7) === -1) && !(c.permit && (c.permit.join("|") + "|").indexOf(b) !== -1) ? false : true
        },
        _fresh: function () {
            var a = this._elem.value.isDateTime(),
                b = this._data;
            if (b.reference) {
                var c = b.reference.value.isDateTime();
                if (c && b.rangeStart && c > b.rangeStart) b._current = q(c)
            }
            if (a) {
                if (b.rangeStart && a > b.rangeStart) b._current = q(a);
                b._select = new Date(a)
            } else b._select = null;
            this._toHtml();
            this.show();
            this._setSelectEl()
        },
        _setSelectEl: function () {
            var a = s._data;
            if (a.reference) {
                s._data._selEl = $(a._selElId);
                s._data._lastEl = this._getLastEl();
                s._data._firstEl = this._getFirstEl();
                this._setPeroidStyle()
            }
        },
        _getFirstEl: function () {
            for (var b = A.$("a"), c = 0; c < b.length; c++) if (b[c].innerHTML != "&nbsp;" && !d(b[c], a.className.over)) return b[c];
            return null
        },
        _getLastEl: function () {
            for (var b = A.$("a"), c = b.length - 1; c > 0; c--) if (b[c].innerHTML != "&nbsp;" && !d(b[c], a.className.over)) return b[c];
            return null
        },
        _setPeroidStyle: function () {
            var b = s._data,
                c = s._elem.value,
                f = C(b.reference.value);
            if (f != "") {
                var c = c.isDateTime(),
                    g = f.isDateTime(),
                    m = h(b._firstEl).isDateTime(),
                    k = h(b._lastEl).isDateTime();
                if (c && g && !(c <= g || m > c || k < g)) {
                    if (b._selEl != null) {
                        b = b._selEl;
                        f = h(b) == f ? 1 : -1;
                        b = j(h(b), f)
                    } else {
                        b = b._lastEl;
                        f = h(b) == f ? 1 : -1;
                        b = h(b)
                    }
                    c = a.className;
                    g = $(b);
                    if (g != null) for (; g != null && !d(g, c.select) && !d(g, c.fselect);) {
                        g.style.cssText = "background-color: #f0f5fb;border-bottom: 1px solid #FFFFFF;padding-bottom: 0;";
                        b = j(b, f);
                        g = $(b)
                    }
                }
            }
        },
        _toHtml: function (b) {
            var c = this._data._current,
                d = this._data.rangeEnd,
                f = [],
                g = [],
                h = l = 0;
            do {
                g[h] = new Date(c.getFullYear(), c.getMonth() + l++, 1);
                d && g[h] >= new Date(d.getFullYear(), d.getMonth(), 1) && (b = true);
                var j = this._toMatrix(g[h], !b && !h, h);
                if (j) {
                    f.push(j);
                    h++
                }
            } while (h <= 1);
            l - h && c.setMonth(c.getMonth() + (l - h));
            A.innerHTML = a.template.replaceWith({
                frontMonthStr: this._toTitleString(g[0]),
                endMonthStr: this._toTitleString(g[1]),
                frontMonth: this._toYearMonth(g[0]),
                endMonth: this._toYearMonth(g[1]),
                frontDay: f[0],
                endDay: f[1]
            })
        },
        _toYearMonth: function (b) {
            var c = a.string,
                d = b.getMonth(),
                b = b.getFullYear();
            return c.f.replace("yyyy", b).replace("mm", $$.status.version === "en" ? c.b.split("|")[d] : d + 1)
        },
        _toTitleString: function (b) {
            return $$.status.version === "en" ? a.string.b.split("|")[b.getMonth()] + "&nbsp;" + b.getFullYear() : b.getFullYear() + a.string.a + "&nbsp;" + (b.getMonth() + 1) + a.string.b
        },
        show: function () {
            var b = A.style;
            if (b.display) b.display = "";
            A.$setPos(a.current, "auto");
            A.$setIframe()
        },
        hide: function () {
            A.$clearIframe();
            A.style.display = "none";
            a.current = null
        },
        callback: function () {
            var a = this._data.hook && this._data.hook.change;
            if (a) {
                if (Object.prototype.toString.call(a) === "[object String]") for (var b = a.split("."), a = b[0] === "this" ? this._elem : _[b[0]], c = 1, d = b.length; c < d; c++) if (a[b[c]]) a = a[b[c]];
                else throw b.slice(0, c).toString() + "is undefined";
                a.call(null, this._elem)
            }
        },
        setDateNote: function (b) {
            var b = b || this._elem,
                c = b.value.isDateTime(),
                c = c ? c.toStdString() : "",
                d = this._data ? this._data.dateNote : b.getAttribute("mod_calendar_dateNote") || "";
            if (c) {
                if (!(d == "off" || d != "on" && b.offsetWidth < a.festWidth || $$.status.version == "en")) {
                    if (d = a.fest[c]) c = d;
                    else {
                        var f = new Date,
                            d = f.getFullYear(),
                            g = f.getMonth(),
                            f = f.getDate(),
                            h = {};
                        h[(new Date(d, g, f)).toStdString()] = "\u4eca\u5929";
                        h[(new Date(d, g, f + 1)).toStdString()] = "\u660e\u5929";
                        h[(new Date(d, g, f + 2)).toStdString()] = "\u540e\u5929";
                        c = h[c] || "\u661f\u671f" + "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".substr((new Date(c.replace(/-/g, "/"))).getDay(), 1)
                    }
                    if (b.dateNoteElem) b.dateNoteElem.innerHTML = c;
                    else {
                        d = $c("span");
                        d.innerHTML = c;
                        d.style.cssText = "position:absolute;color:#999;text-align:right;width:40px;padding-right:3px;height:" + b.offsetHeight + "px;line-height:" + (b.offsetHeight + 2) + "px;margin-left:" + (b.offsetWidth - 43) + "px;";
                        b.dateNoteElem = d;
                        d.onmousedown = function (a) {
                            a = $fixE(a);
                            a = a.$target;
                            if (a.setCapture) {
                                t();
                                a.setCapture();
                                r = a
                            }
                            return false
                        };
                        d.onmouseup = t;
                        b.parentNode.insertBefore(d, b);
                        d.onclick = function () {
                            b.focus()
                        }
                    }
                }
            } else if (b && b.dateNoteElem) b.dateNoteElem.innerHTML = "\u3000"
        },
        handleMousedown: function (a) {
            this._elem.value = h(a);
            this.setDateNote();
            this._elem.blur();
            this.focusNext();
            this.callback();
            return false
        }
    };
    var r = null,
        F = false;
    Ctrip.module.calendar = function (a) {
        s || (s = new b);
        c(a);
        s.setDateNote(a);
        if (!A) {
            A = $("tuna_calendar");
            A.onmousedown = x;
            A.onmouseover = B;
            A.onmouseout = L;
            A.onmouseup = t;
            _.$r("resize", g)
        }
    }
})($$.module.calendar);
(function () {
    if ($$.browser.IE6) try {
        __.execCommand("BackgroundImageCache", false, true)
    } catch (a) {}
    $$.status.alertDiv.innerHTML = $$.status.version.match(/^zh-/) ? '<div class="c_alert"><div id="alertInfo" class="c_alertinfo">\u5185\u5bb9</div></div>' : '<table id="alertTable" style="font-family:Arial;margin:0;" cellpadding="0" cellspacing="0"><tr><td style="margin:0;padding:0px 2px 2px 0px;background:#E7E7E7;"><div id="alertInfo" style="margin:0px;padding:10px;font-size:12px;text-align:left;background:#FFFFE8;border:1px solid #FFDF47;color:#000;white-space:nowrap;">\u5185\u5bb9</div></td></tr></table>';
    $r("domReady", function () {
        $(__.body);
        var a = $$.status.saveStatus.value;
        if (a) $$.status.back = true;
        $$.status.pageValue = $fromJson(a || "{}");
        if (!("data" in $$.status.pageValue)) $$.status.pageValue.data = {};
        $$.browser.Opera || $r("beforeunload", $savePageValue, 90)
    }, 10);
    $r("domready", [$parserRe, $fixElement, function () {
        try {
            __.body.focus()
        } catch (a) {}
    }]);
    $r("load", [evtDomReady, function () {
        $$.status.load = true
    }])
})();
var maskShow = function () {
        function a(a, b) {
            if ($$.browser.IE6) for (var c = document.getElementsByTagName("select"), d = a ? "visible" : "hidden", f = 0; f < c.length; f++) {
                var g;
                if (!(g = a)) {
                    for (g = c[f]; g && g != b;) g = g.parentNode;
                    g = g != b
                }
                if (g && c[f].currentStyle.visibility != d) c[f].style.visibility = d
            }
        }
        function b() {
            if (f) {
                var a = $pageSize("doc");
                c(g, a);
                var b = {
                    left: (a.winWidth - f.offsetWidth >> 1) + a.scrollLeft + (maskShow.adjustX || 0),
                    top: (a.winHeight - f.offsetHeight >> 1) + a.scrollTop + (maskShow.adjustY || 0)
                };
                if (b.left < a.scrollLeft) b.left = a.scrollLeft;
                if (b.top < a.scrollTop) b.top = a.scrollTop;
                c(f, b)
            }
        }
        function c(a, b) {
            var c = a.style;
            c.left = (b.left || 0) + "px";
            c.top = (b.top || 0) + "px";
            if ("width" in b) c.width = b.width + "px";
            if ("height" in b) c.height = b.height + "px"
        }
        function d(a, b) {
            if (a) {
                a.style.visibility = "visible";
                if (!b) if (/lepad/.test(navigator.userAgent)) {
                    var c = a.getBoundingClientRect();
                    a.style.left = -c.width - 100 + "px";
                    a.style.top = -c.height - 100 + "px"
                } else {
                    a.style.left = -a.offsetWidth - 100 + "px";
                    a.style.top = -a.offsetHeight - 100 + "px"
                }
            }
        }
        var g = null,
            f = null,
            k = false,
            p = {
                onresize: null,
                onscroll: null
            };
        return function (c, h) {
            if (!g) {
                g = document.createElement("div");
                g.style.cssText = "background-color:{$c};border:none;position:absolute;visibility:hidden;opacity:{$a};filter:alpha(opacity={$A})".replaceWith({
                    c: maskShow.bgColor || "#000",
                    a: maskShow.bgAlpha || "0.5",
                    A: maskShow.bgAlpha ? parseInt(maskShow.bgAlpha * 100) : "50"
                });
                document.body.appendChild(g);
                maskShow.mask = g
            }
            k = !! h;
            if (c) {
                f && d(f, false);
                f = c;
                var m = f.style;
                m.position = "absolute";
                m.left = "-10000px";
                m.top = "-10000px";
                m.visibility = "visible";
                m.display = "block";
                m.zIndex = 10;
                b();
                g.style.zIndex = maskShow.zIndexBack || 15;
                f.style.zIndex = maskShow.zIndexFore || 20;
                d(f, true);
                d(g, true);
                a(false, c);
                if (!k) for (q in p) {
                    p[q] = window[q];
                    window[q] = b
                }
            } else {
                d(f, false);
                d(g, false);
                a(true);
                f = null;
                if (!k) for (var q in p) {
                    window[q] = p[q];
                    p[q] = null
                }
            }
        }
    }();
$$.module.loading = {
    source: null,
    backto: null,
    preload: function (a) {
        if (a && $type(a) == "number") this._preload = a;
        this._init.bind(this).delay(this._preload)
    },
    show: function () {
        if (!this._visible) {
            this._panel || this._init();
            if (this._panel) {
                this._tmpcolor = maskShow.bgColor;
                this._button.href = this.backto || "javascript:$$.module.loading.hide()";
                maskShow.bgColor = this._bgcolor;
                maskShow.bgColor = "#666";
                maskShow(this._panel);
                this._roll();
                this._visible = true
            }
        }
    },
    hide: function () {
        _.ActiveXObject ? __.execCommand("Stop") : _.stop && _.stop();
        maskShow(null);
        if (this._tmpcolor) maskShow.bgColor = this._tmpcolor;
        clearInterval(this._timer);
        this._visible = false
    },
    wireup: function (a) {
        if (!this._wired && a) {
            var b = 0;
            _.$(a).$r("submit", function () {
                b = new Date
            }, 1);
            _.$r("beforeunload", function () {
                var a = new Date - b;
                a > 0 && a < 1E3 && $$.module.loading.show()
            }, 1);
            this._wired = true
        }
    },
    _flag: !1,
    _timer: null,
    _preload: 12E3,
    _panel: null,
    _button: null,
    _color: null,
    _bgcolor: "#666",
    _visible: !1,
    _wired: !1,
    _template: '<div style="background:#FFFFFF none repeat scroll 0%;border:1px solid #CCDCED;height:453px;"><h1 style="border-bottom:1px solid #CBDCED;height:85px;margin:0 auto;text-align:center;width:99%"><img src="{$picserver}/common/pic_loading_logo.gif"></h1><div style="width:120px;height:12px;overflow:hidden;margin:80px auto 20px;background-image:url({$picserver}/common/pic_loading_progress.gif)">&nbsp;</div><p style="color:#cc6600;font-size:14px;font-weight:bold;text-align:center">\u6211\u4eec\u6b63\u5728\u5904\u7406\u60a8\u7684\u8bf7\u6c42\uff0c\u8bf7\u7a0d\u5019....</p><p style="margin-top:30px"><a style="display:block;width:104px;height:30px;margin:0 auto;background:url({$picserver}/common/btn_loading_cancel.gif) no-repeat 0 0;text-decoration:none;" onmouseover="this.style.backgroundPosition=\'0 -30px\'" onmouseout="this.style.backgroundPosition=\'0 0\'">&nbsp;</a></p><p><a target="_blank" href="{$link}"><img style="display:block;margin:0 auto;margin-top:20px;" title="{$title}" alt="{$title}" width="" height="" src="{$img}"></p></div>'.replaceWith({
        picserver: $picUrl("")
    }),
    _init: function () {
        if (!this._panel && this.source) {
            var a = this.source.split("@").random().split("|"),
                b = document.createElement("div");
            b.style.cssText = "width:556px;background:#d9e6f7;border:1px solid #b1cbe4;height:455px;padding:5px;position: absolute; left:-1000px; top:-1000px; z-index: 20;";
            b.innerHTML = this._template.replaceWith({
                img: a[0],
                link: a[1],
                title: a[2] || ""
            });
            $$.status.container.appendChild(b);
            this._panel = b;
            this._button = $(b).$("a")[0]
        }
    },
    _roll: function () {
        var a = $(this._panel).$("div")[1].style;
        clearInterval(this._timer);
        var b = new Date,
            c = -1;
        this._timer = setInterval(function () {
            var d = Math.floor((new Date - b) / 300) * 20 % 120 + 0;
            if (d != c) {
                c = d;
                a.backgroundPosition = d + "px 0"
            }
        }, 40)
    }
};
Ctrip.module.loading = function (a) {
    var b = $$.module.loading;
    if (!b._flag && (b._flag = true)) {
        var c = a.getAttribute("mod_loading_source");
        if (c) b.source = c;
        if (c = a.getAttribute("mod_loading_backto")) b.backto = c;
        c = parseInt(a.getAttribute("mod_loading_preload"));
        isNaN(c) && (c = null);
        var d = a.getAttribute("mod_loading_sourcescript");
        d ? $loadJs.pass(d, null, b._init.bind(b)).delay(c || 1) : c && b.preload(c);
        a.getAttribute("mod_loading_wireup").toLowerCase() == "true" && b.wireup(a.tagName == "FORM" ? a : a.form || document.aspnetForm)
    }
};
$$.module.adFrame = {
    clock: null,
    list: [],
    interval: 800,
    timeout: 1500,
    count: 0
};
Ctrip.module.adFrame = function (a) {
    function b() {
        var a = c.list.shift(),
            b = a.getAttribute("mod_adFrame_src") || "about:blank",
            f = a.getAttribute("mod_adFrame_style") || "";
        a.innerHTML = '<iframe marginheight="0" marginwidth="0" frameborder="0" scrolling="no" style="' + f + '" src="' + b + '"></iframe>';
        c.list.length ? setTimeout(arguments.callee, c.interval) : c.clock = null
    }
    var c = $$.module.adFrame;
    c.list.push(a);
    if (!c.clock) c.count ? b() : c.clock = setTimeout(b, c.timeout);
    c.count++
};