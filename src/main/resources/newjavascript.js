var Zepto = (function() {
    var n, u, F, a, N = [], p = N.slice, G = N.filter, h = window.document, M = {}, O = {}, r = h.defaultView.getComputedStyle, W = {"column-count": 1, columns: 1, "font-weight": 1, "line-height": 1, opacity: 1, "z-index": 1, zoom: 1}, y = /^\s*<(\w+|!)[^>]*>/, l = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, J = /^(?:body|html)$/i, E = ["val", "css", "html", "text", "data", "width", "height", "offset"], z = ["after", "prepend", "before", "append"], v = h.createElement("table"), P = h.createElement("tr"), j = {tr: h.createElement("tbody"), tbody: v, thead: v, tfoot: v, td: P, th: P, "*": h.createElement("div")}, w = /complete|loaded|interactive/, I = /^\.([\w-]+)$/, x = /^#([\w-]*)$/, L = /^[\w-]+$/, g = {}.toString, e = {}, U, Q, H = h.createElement("div");
    e.matches = function(ac, Y) {
        if (!ac || ac.nodeType !== 1) {
            return false
        }
        var aa = ac.webkitMatchesSelector || ac.mozMatchesSelector || ac.oMatchesSelector || ac.matchesSelector;
        if (aa) {
            return aa.call(ac, Y)
        }
        var ab, ad = ac.parentNode, Z = !ad;
        if (Z) {
            (ad = H).appendChild(ac)
        }
        ab = ~e.qsa(ad, Y).indexOf(ac);
        Z && H.removeChild(ac);
        return ab
    };
    function q(Y) {
        return g.call(Y) == "[object Function]"
    }
    function K(Y) {
        return Y instanceof Object
    }
    function X(Y) {
        return K(Y) && Y.__proto__ == Object.prototype
    }
    function B(Y) {
        return Y instanceof Array
    }
    function C(Y) {
        return typeof Y.length == "number"
    }
    function V(Y) {
        return G.call(Y, function(Z) {
            return Z !== n && Z !== null
        })
    }
    function D(Y) {
        return Y.length > 0 ? F.fn.concat.apply([], Y) : Y
    }
    U = function(Y) {
        return Y.replace(/-+(.)?/g, function(Z, aa) {
            return aa ? aa.toUpperCase() : ""
        })
    };
    function o(Y) {
        return Y.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
    }
    Q = function(Y) {
        return G.call(Y, function(aa, Z) {
            return Y.indexOf(aa) == Z
        })
    };
    function R(Y) {
        return Y in O ? O[Y] : (O[Y] = new RegExp("(^|\\s)" + Y + "(\\s|$)"))
    }
    function f(Y, Z) {
        return(typeof Z == "number" && !W[o(Y)]) ? Z + "px" : Z
    }
    function S(aa) {
        var Y, Z;
        if (!M[aa]) {
            Y = h.createElement(aa);
            h.body.appendChild(Y);
            Z = r(Y, "").getPropertyValue("display");
            Y.parentNode.removeChild(Y);
            Z == "none" && (Z = "block");
            M[aa] = Z
        }
        return M[aa]
    }
    function t(Y) {
        return"children" in Y ? p.call(Y.children) : F.map(Y.childNodes, function(Z) {
            if (Z.nodeType == 1) {
                return Z
            }
        })
    }
    e.fragment = function(ac, aa, ab) {
        if (ac.replace) {
            ac = ac.replace(l, "<$1></$2>")
        }
        if (aa === n) {
            aa = y.test(ac) && RegExp.$1
        }
        if (!(aa in j)) {
            aa = "*"
        }
        var Z, ad, Y = j[aa];
        Y.innerHTML = "" + ac;
        ad = F.each(p.call(Y.childNodes), function() {
            Y.removeChild(this)
        });
        if (X(ab)) {
            Z = F(ad);
            F.each(ab, function(ae, af) {
                if (E.indexOf(ae) > -1) {
                    Z[ae](af)
                } else {
                    Z.attr(ae, af)
                }
            })
        }
        return ad
    };
    e.Z = function(Z, Y) {
        Z = Z || [];
        Z.__proto__ = arguments.callee.prototype;
        Z.selector = Y || "";
        return Z
    };
    e.isZ = function(Y) {
        return Y instanceof e.Z
    };
    e.init = function(Y, Z) {
        if (!Y) {
            return e.Z()
        } else {
            if (q(Y)) {
                return F(h).ready(Y)
            } else {
                if (e.isZ(Y)) {
                    return Y
                } else {
                    var aa;
                    if (B(Y)) {
                        aa = V(Y)
                    } else {
                        if (K(Y)) {
                            aa = [X(Y) ? F.extend({}, Y) : Y], Y = null
                        } else {
                            if (y.test(Y)) {
                                aa = e.fragment(Y.trim(), RegExp.$1, Z), Y = null
                            } else {
                                if (Z !== n) {
                                    return F(Z).find(Y)
                                } else {
                                    aa = e.qsa(h, Y)
                                }
                            }
                        }
                    }
                    return e.Z(aa, Y)
                }
            }
        }
    };
    F = function(Y, Z) {
        return e.init(Y, Z)
    };
    function m(aa, Z, Y) {
        for (u in Z) {
            if (Y && X(Z[u])) {
                if (!X(aa[u])) {
                    aa[u] = {}
                }
                m(aa[u], Z[u], Y)
            } else {
                if (Z[u] !== n) {
                    aa[u] = Z[u]
                }
            }
        }
    }
    F.extend = function(aa) {
        var Y, Z = p.call(arguments, 1);
        if (typeof aa == "boolean") {
            Y = aa;
            aa = Z.shift()
        }
        Z.forEach(function(ab) {
            m(aa, ab, Y)
        });
        return aa
    };
    e.qsa = function(Z, Y) {
        var aa;
        return(Z === h && x.test(Y)) ? ((aa = Z.getElementById(RegExp.$1)) ? [aa] : []) : (Z.nodeType !== 1 && Z.nodeType !== 9) ? [] : p.call(I.test(Y) ? Z.getElementsByClassName(RegExp.$1) : L.test(Y) ? Z.getElementsByTagName(Y) : Z.querySelectorAll(Y))
    };
    function A(Z, Y) {
        return Y === n ? F(Z) : F(Z).filter(Y)
    }
    F.contains = function(Y, Z) {
        return Y !== Z && Y.contains(Z)
    };
    function s(aa, Z, Y, ab) {
        return q(Z) ? Z.call(aa, Y, ab) : Z
    }
    function b(Z, Y, aa) {
        aa == null ? Z.removeAttribute(Y) : Z.setAttribute(Y, aa)
    }
    function T(aa, ab) {
        var Y = aa.className, Z = Y && Y.baseVal !== n;
        if (ab === n) {
            return Z ? Y.baseVal : Y
        }
        Z ? (Y.baseVal = ab) : (aa.className = ab)
    }
    function k(Z) {
        var Y;
        try {
            return Z ? Z == "true" || (Z == "false" ? false : Z == "null" ? null : !isNaN(Y = Number(Z)) ? Y : /^[\[\{]/.test(Z) ? F.parseJSON(Z) : Z) : Z
        } catch (aa) {
            return Z
        }
    }
    F.isFunction = q;
    F.isObject = K;
    F.isArray = B;
    F.isPlainObject = X;
    F.inArray = function(Z, aa, Y) {
        return N.indexOf.call(aa, Z, Y)
    };
    F.camelCase = U;
    F.trim = function(Y) {
        return Y.trim()
    };
    F.uuid = 0;
    F.support = {};
    F.expr = {};
    F.map = function(ac, ad) {
        var ab, Y = [], aa, Z;
        if (C(ac)) {
            for (aa = 0; aa < ac.length; aa++) {
                ab = ad(ac[aa], aa);
                if (ab != null) {
                    Y.push(ab)
                }
            }
        } else {
            for (Z in ac) {
                ab = ad(ac[Z], Z);
                if (ab != null) {
                    Y.push(ab)
                }
            }
        }
        return D(Y)
    };
    F.each = function(aa, ab) {
        var Z, Y;
        if (C(aa)) {
            for (Z = 0; Z < aa.length; Z++) {
                if (ab.call(aa[Z], Z, aa[Z]) === false) {
                    return aa
                }
            }
        } else {
            for (Y in aa) {
                if (ab.call(aa[Y], Y, aa[Y]) === false) {
                    return aa
                }
            }
        }
        return aa
    };
    F.grep = function(Y, Z) {
        return G.call(Y, Z)
    };
    if (window.JSON) {
        F.parseJSON = JSON.parse
    }
    F.fn = {forEach: N.forEach, reduce: N.reduce, push: N.push, sort: N.sort, indexOf: N.indexOf, concat: N.concat, map: function(Y) {
            return F(F.map(this, function(aa, Z) {
                return Y.call(aa, Z, aa)
            }))
        }, slice: function() {
            return F(p.apply(this, arguments))
        }, ready: function(Y) {
            if (w.test(h.readyState)) {
                Y(F)
            } else {
                h.addEventListener("DOMContentLoaded", function() {
                    Y(F)
                }, false)
            }
            return this
        }, get: function(Y) {
            return Y === n ? p.call(this) : this[Y]
        }, toArray: function() {
            return this.get()
        }, size: function() {
            return this.length
        }, remove: function() {
            return this.each(function() {
                if (this.parentNode != null) {
                    this.parentNode.removeChild(this)
                }
            })
        }, each: function(Y) {
            this.forEach(function(aa, Z) {
                Y.call(aa, Z, aa)
            });
            return this
        }, filter: function(Y) {
            if (q(Y)) {
                return this.not(this.not(Y))
            }
            return F(G.call(this, function(Z) {
                return e.matches(Z, Y)
            }))
        }, add: function(Y, Z) {
            return F(Q(this.concat(F(Y, Z))))
        }, is: function(Y) {
            return this.length > 0 && e.matches(this[0], Y)
        }, not: function(Y) {
            var Z = [];
            if (q(Y) && Y.call !== n) {
                this.each(function(ab) {
                    if (!Y.call(this, ab)) {
                        Z.push(this)
                    }
                })
            } else {
                var aa = typeof Y == "string" ? this.filter(Y) : (C(Y) && q(Y.item)) ? p.call(Y) : F(Y);
                this.forEach(function(ab) {
                    if (aa.indexOf(ab) < 0) {
                        Z.push(ab)
                    }
                })
            }
            return F(Z)
        }, has: function(Y) {
            return this.filter(function() {
                return K(Y) ? F.contains(this, Y) : F(this).find(Y).size()
            })
        }, eq: function(Y) {
            return Y === -1 ? this.slice(Y) : this.slice(Y, +Y + 1)
        }, first: function() {
            var Y = this[0];
            return Y && !K(Y) ? Y : F(Y)
        }, last: function() {
            var Y = this[this.length - 1];
            return Y && !K(Y) ? Y : F(Y)
        }, find: function(Z) {
            var Y;
            if (this.length == 1) {
                Y = F(e.qsa(this[0], Z))
            } else {
                Y = this.map(function() {
                    return e.qsa(this, Z)
                })
            }
            return Y
        }, closest: function(Y, Z) {
            var aa = this[0];
            while (aa && !e.matches(aa, Y)) {
                aa = aa !== Z && aa !== h && aa.parentNode
            }
            return F(aa)
        }, parents: function(Y) {
            var aa = [], Z = this;
            while (Z.length > 0) {
                Z = F.map(Z, function(ab) {
                    if ((ab = ab.parentNode) && ab !== h && aa.indexOf(ab) < 0) {
                        aa.push(ab);
                        return ab
                    }
                })
            }
            return A(aa, Y)
        }, parent: function(Y) {
            return A(Q(this.pluck("parentNode")), Y)
        }, children: function(Y) {
            return A(this.map(function() {
                return t(this)
            }), Y)
        }, contents: function() {
            return this.map(function() {
                return p.call(this.childNodes)
            })
        }, siblings: function(Y) {
            return A(this.map(function(Z, aa) {
                return G.call(t(aa.parentNode), function(ab) {
                    return ab !== aa
                })
            }), Y)
        }, empty: function() {
            return this.each(function() {
                this.innerHTML = ""
            })
        }, pluck: function(Y) {
            return F.map(this, function(Z) {
                return Z[Y]
            })
        }, show: function() {
            return this.each(function() {
                this.style.display == "none" && (this.style.display = null);
                if (r(this, "").getPropertyValue("display") == "none") {
                    this.style.display = S(this.nodeName)
                }
            })
        }, replaceWith: function(Y) {
            return this.before(Y).remove()
        }, wrap: function(Y) {
            var Z = q(Y);
            if (this[0] && !Z) {
                var aa = F(Y).get(0), ab = aa.parentNode || this.length > 1
            }
            return this.each(function(ac) {
                F(this).wrapAll(Z ? Y.call(this, ac) : ab ? aa.cloneNode(true) : aa)
            })
        }, wrapAll: function(Y) {
            if (this[0]) {
                F(this[0]).before(Y = F(Y));
                var Z;
                while ((Z = Y.children()).length) {
                    Y = Z.first()
                }
                F(Y).append(this)
            }
            return this
        }, wrapInner: function(Y) {
            var Z = q(Y);
            return this.each(function(ab) {
                var aa = F(this), ac = aa.contents(), ad = Z ? Y.call(this, ab) : Y;
                ac.length ? ac.wrapAll(ad) : aa.append(ad)
            })
        }, unwrap: function() {
            this.parent().each(function() {
                F(this).replaceWith(F(this).children())
            });
            return this
        }, clone: function() {
            return this.map(function() {
                return this.cloneNode(true)
            })
        }, hide: function() {
            return this.css("display", "none")
        }, toggle: function(Y) {
            return this.each(function() {
                var Z = F(this);
                (Y === n ? Z.css("display") == "none" : Y) ? Z.show() : Z.hide()
            })
        }, prev: function(Y) {
            return F(this.pluck("previousElementSibling")).filter(Y || "*")
        }, next: function(Y) {
            return F(this.pluck("nextElementSibling")).filter(Y || "*")
        }, html: function(Y) {
            return Y === n ? (this.length > 0 ? this[0].innerHTML : null) : this.each(function(Z) {
                var aa = this.innerHTML;
                F(this).empty().append(s(this, Y, Z, aa))
            })
        }, text: function(Y) {
            return Y === n ? (this.length > 0 ? this[0].textContent : null) : this.each(function() {
                this.textContent = Y
            })
        }, attr: function(Z, aa) {
            var Y;
            return(typeof Z == "string" && aa === n) ? (this.length == 0 || this[0].nodeType !== 1 ? n : (Z == "value" && this[0].nodeName == "INPUT") ? this.val() : (!(Y = this[0].getAttribute(Z)) && Z in this[0]) ? this[0][Z] : Y) : this.each(function(ab) {
                if (this.nodeType !== 1) {
                    return
                }
                if (K(Z)) {
                    for (u in Z) {
                        b(this, u, Z[u])
                    }
                } else {
                    b(this, Z, s(this, aa, ab, this.getAttribute(Z)))
                }
            })
        }, removeAttr: function(Y) {
            return this.each(function() {
                this.nodeType === 1 && b(this, Y)
            })
        }, prop: function(Y, Z) {
            return(Z === n) ? (this[0] ? this[0][Y] : n) : this.each(function(aa) {
                this[Y] = s(this, Z, aa, this[Y])
            })
        }, data: function(Y, aa) {
            var Z = this.attr("data-" + o(Y), aa);
            return Z !== null ? k(Z) : n
        }, val: function(Y) {
            return(Y === n) ? (this.length > 0 ? (this[0].multiple ? F(this[0]).find("option").filter(function(Z) {
                return this.selected
            }).pluck("value") : this[0].value) : n) : this.each(function(Z) {
                this.value = s(this, Y, Z, this.value)
            })
        }, offset: function() {
            if (this.length == 0) {
                return null
            }
            var Y = this[0].getBoundingClientRect();
            return{left: Y.left + window.pageXOffset, top: Y.top + window.pageYOffset, width: Y.width, height: Y.height}
        }, css: function(aa, Z) {
            if (arguments.length < 2 && typeof aa == "string") {
                return(this.length == 0 ? n : this[0].style[U(aa)] || r(this[0], "").getPropertyValue(aa))
            }
            var Y = "";
            for (u in aa) {
                if (!aa[u] && aa[u] !== 0) {
                    this.each(function() {
                        this.style.removeProperty(o(u))
                    })
                } else {
                    Y += o(u) + ":" + f(u, aa[u]) + ";"
                }
            }
            if (typeof aa == "string") {
                if (!Z && Z !== 0) {
                    this.each(function() {
                        this.style.removeProperty(o(aa))
                    })
                } else {
                    Y = o(aa) + ":" + f(aa, Z)
                }
            }
            return this.each(function() {
                this.style.cssText += ";" + Y
            })
        }, index: function(Y) {
            return Y ? this.indexOf(F(Y)[0]) : this.parent().children().indexOf(this[0])
        }, hasClass: function(Y) {
            if (this.length < 1) {
                return false
            } else {
                return R(Y).test(T(this[0]))
            }
        }, addClass: function(Y) {
            return this.each(function(Z) {
                a = [];
                var ab = T(this), aa = s(this, Y, Z, ab);
                aa.split(/\s+/g).forEach(function(ac) {
                    if (!F(this).hasClass(ac)) {
                        a.push(ac)
                    }
                }, this);
                a.length && T(this, ab + (ab ? " " : "") + a.join(" "))
            })
        }, removeClass: function(Y) {
            return this.each(function(Z) {
                if (Y === n) {
                    return T(this, "")
                }
                a = T(this);
                s(this, Y, Z, a).split(/\s+/g).forEach(function(aa) {
                    a = a.replace(R(aa), " ")
                });
                T(this, a.trim())
            })
        }, toggleClass: function(Z, Y) {
            return this.each(function(aa) {
                var ab = s(this, Z, aa, T(this));
                (Y === n ? !F(this).hasClass(ab) : Y) ? F(this).addClass(ab) : F(this).removeClass(ab)
            })
        }, scrollTop: function() {
            if (!this.length) {
                return
            }
            return("scrollTop" in this[0]) ? this[0].scrollTop : this[0].scrollY
        }, position: function() {
            if (!this.length) {
                return
            }
            var aa = this[0], Z = this.offsetParent(), ab = this.offset(), Y = J.test(Z[0].nodeName) ? {top: 0, left: 0} : Z.offset();
            ab.top -= parseFloat(F(aa).css("margin-top")) || 0;
            ab.left -= parseFloat(F(aa).css("margin-left")) || 0;
            Y.top += parseFloat(F(Z[0]).css("border-top-width")) || 0;
            Y.left += parseFloat(F(Z[0]).css("border-left-width")) || 0;
            return{top: ab.top - Y.top, left: ab.left - Y.left}
        }, offsetParent: function() {
            return this.map(function() {
                var Y = this.offsetParent || h.body;
                while (Y && !J.test(Y.nodeName) && F(Y).css("position") == "static") {
                    Y = Y.offsetParent
                }
                return Y
            })
        }};
    ["width", "height"].forEach(function(Y) {
        F.fn[Y] = function(Z) {
            var ab, aa = Y.replace(/./, function(ac) {
                return ac[0].toUpperCase()
            });
            if (Z === n) {
                return this[0] == window ? window["inner" + aa] : this[0] == h ? h.documentElement["offset" + aa] : (ab = this.offset()) && ab[Y]
            } else {
                return this.each(function(ac) {
                    var ad = F(this);
                    ad.css(Y, s(this, Z, ac, ad[Y]()))
                })
            }
        }
    });
    function d(aa, Y) {
        Y(aa);
        for (var Z in aa.childNodes) {
            d(aa.childNodes[Z], Y)
        }
    }
    z.forEach(function(aa, Z) {
        var Y = Z % 2;
        F.fn[aa] = function() {
            var ab = F.map(arguments, function(ae) {
                return K(ae) ? ae : e.fragment(ae)
            }), ac, ad = this.length > 1;
            if (ab.length < 1) {
                return this
            }
            return this.each(function(ae, af) {
                ac = Y ? af : af.parentNode;
                af = Z == 0 ? af.nextSibling : Z == 1 ? af.firstChild : Z == 2 ? af : null;
                ab.forEach(function(ag) {
                    if (ad) {
                        ag = ag.cloneNode(true)
                    } else {
                        if (!ac) {
                            return F(ag).remove()
                        }
                    }
                    d(ac.insertBefore(ag, af), function(ah) {
                        if (ah.nodeName != null && ah.nodeName.toUpperCase() === "SCRIPT" && (!ah.type || ah.type === "text/javascript") && !ah.src) {
                            window["eval"].call(window, ah.innerHTML)
                        }
                    })
                })
            })
        };
        F.fn[Y ? aa + "To" : "insert" + (Z ? "Before" : "After")] = function(ab) {
            F(ab)[aa](this);
            return this
        }
    });
    e.Z.prototype = F.fn;
    e.uniq = Q;
    e.deserializeValue = k;
    F.zepto = e;
    return F
})();
window.Zepto = Zepto;
"$" in window || (window.$ = Zepto);
(function(d) {
    var j = d.zepto.qsa, q = {}, f = 1, m = {}, v = {mouseenter: "mouseover", mouseleave: "mouseout"};
    m.click = m.mousedown = m.mouseup = m.mousemove = "MouseEvents";
    function a(x) {
        return x._zid || (x._zid = f++)
    }
    function k(y, A, z, x) {
        A = p(A);
        if (A.ns) {
            var B = u(A.ns)
        }
        return(q[a(y)] || []).filter(function(C) {
            return C && (!A.e || C.e == A.e) && (!A.ns || B.test(C.ns)) && (!z || a(C.fn) === a(z)) && (!x || C.sel == x)
        })
    }
    function p(x) {
        var y = ("" + x).split(".");
        return{e: y[0], ns: y.slice(1).sort().join(" ")}
    }
    function u(x) {
        return new RegExp("(?:^| )" + x.replace(" ", " .* ?") + "(?: |$)")
    }
    function t(x, z, y) {
        if (d.isObject(x)) {
            d.each(x, y)
        } else {
            x.split(/\s/).forEach(function(A) {
                y(A, z)
            })
        }
    }
    function g(x, y) {
        return x.del && (x.e == "focus" || x.e == "blur") || !!y
    }
    function s(x) {
        return v[x] || x
    }
    function n(B, A, C, y, x, z) {
        var E = a(B), D = (q[E] || (q[E] = []));
        t(A, C, function(H, G) {
            var F = p(H);
            F.fn = G;
            F.sel = y;
            if (F.e in v) {
                G = function(K) {
                    var J = K.relatedTarget;
                    if (!J || (J !== this && !d.contains(this, J))) {
                        return F.fn.apply(this, arguments)
                    }
                }
            }
            F.del = x && x(G, H);
            var I = F.del || G;
            F.proxy = function(K) {
                var J = I.apply(B, [K].concat(K.data));
                if (J === false) {
                    K.preventDefault(), K.stopPropagation()
                }
                return J
            };
            F.i = D.length;
            D.push(F);
            B.addEventListener(s(F.e), F.proxy, g(F, z))
        })
    }
    function w(A, z, B, x, y) {
        var C = a(A);
        t(z || "", B, function(E, D) {
            k(A, E, D, x).forEach(function(F) {
                delete q[C][F.i];
                A.removeEventListener(s(F.e), F.proxy, g(F, y))
            })
        })
    }
    d.event = {add: n, remove: w};
    d.proxy = function(z, y) {
        if (d.isFunction(z)) {
            var x = function() {
                return z.apply(y, arguments)
            };
            x._zid = a(z);
            return x
        } else {
            if (typeof y == "string") {
                return d.proxy(z[y], z)
            } else {
                throw new TypeError("expected function")
            }
        }
    };
    d.fn.bind = function(x, y) {
        return this.each(function() {
            n(this, x, y)
        })
    };
    d.fn.unbind = function(x, y) {
        return this.each(function() {
            w(this, x, y)
        })
    };
    d.fn.one = function(x, y) {
        return this.each(function(A, z) {
            n(this, x, y, null, function(C, B) {
                return function() {
                    var D = C.apply(z, arguments);
                    w(z, B, C);
                    return D
                }
            })
        })
    };
    var r = function() {
        return true
    }, h = function() {
        return false
    }, e = /^([A-Z]|layer[XY]$)/, l = {preventDefault: "isDefaultPrevented", stopImmediatePropagation: "isImmediatePropagationStopped", stopPropagation: "isPropagationStopped"};
    function b(z) {
        var y, x = {originalEvent: z};
        for (y in z) {
            if (!e.test(y) && z[y] !== undefined) {
                x[y] = z[y]
            }
        }
        d.each(l, function(B, A) {
            x[B] = function() {
                this[A] = r;
                return z[B].apply(z, arguments)
            };
            x[A] = h
        });
        return x
    }
    function o(y) {
        if (!("defaultPrevented" in y)) {
            y.defaultPrevented = false;
            var x = y.preventDefault;
            y.preventDefault = function() {
                this.defaultPrevented = true;
                x.call(this)
            }
        }
    }
    d.fn.delegate = function(x, y, z) {
        return this.each(function(B, A) {
            n(A, y, z, x, function(C) {
                return function(F) {
                    var D, E = d(F.target).closest(x, A).get(0);
                    if (E) {
                        D = d.extend(b(F), {currentTarget: E, liveFired: A});
                        return C.apply(E, [D].concat([].slice.call(arguments, 1)))
                    }
                }
            })
        })
    };
    d.fn.undelegate = function(x, y, z) {
        return this.each(function() {
            w(this, y, z, x)
        })
    };
    d.fn.live = function(x, y) {
        d(document.body).delegate(this.selector, x, y);
        return this
    };
    d.fn.die = function(x, y) {
        d(document.body).undelegate(this.selector, x, y);
        return this
    };
    d.fn.on = function(y, x, z) {
        return !x || d.isFunction(x) ? this.bind(y, x || z) : this.delegate(x, y, z)
    };
    d.fn.off = function(y, x, z) {
        return !x || d.isFunction(x) ? this.unbind(y, x || z) : this.undelegate(x, y, z)
    };
    d.fn.trigger = function(x, y) {
        if (typeof x == "string" || d.isPlainObject(x)) {
            x = d.Event(x)
        }
        o(x);
        x.data = y;
        return this.each(function() {
            if ("dispatchEvent" in this) {
                this.dispatchEvent(x)
            }
        })
    };
    d.fn.triggerHandler = function(y, z) {
        var A, x;
        this.each(function(C, B) {
            A = b(typeof y == "string" ? d.Event(y) : y);
            A.data = z;
            A.target = B;
            d.each(k(B, y.type || y), function(D, E) {
                x = E.proxy(A);
                if (A.isImmediatePropagationStopped()) {
                    return false
                }
            })
        });
        return x
    };
    ("focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error").split(" ").forEach(function(x) {
        d.fn[x] = function(y) {
            return y ? this.bind(x, y) : this.trigger(x)
        }
    });
    ["focus", "blur"].forEach(function(x) {
        d.fn[x] = function(y) {
            if (y) {
                this.bind(x, y)
            } else {
                this.each(function() {
                    try {
                        this[x]()
                    } catch (z) {
                    }
                })
            }
            return this
        }
    });
    d.Event = function(A, z) {
        if (typeof A != "string") {
            z = A, A = z.type
        }
        var B = document.createEvent(m[A] || "Events"), x = true;
        if (z) {
            for (var y in z) {
                (y == "bubbles") ? (x = !!z[y]) : (B[y] = z[y])
            }
        }
        B.initEvent(A, x, true, null, null, null, null, null, null, null, null, null, null, null, null);
        B.isDefaultPrevented = function() {
            return this.defaultPrevented
        };
        return B
    }
})(Zepto);
(function(b) {
    function a(d) {
        var g = this.os = {}, j = this.browser = {}, o = d.match(/WebKit\/([\d.]+)/), f = d.match(/(Android)\s+([\d.]+)/), p = d.match(/(iPad).*OS\s([\d_]+)/), n = !p && d.match(/(iPhone\sOS)\s([\d_]+)/), q = d.match(/(webOS|hpwOS)[\s\/]([\d.]+)/), m = q && d.match(/TouchPad/), l = d.match(/Kindle\/([\d.]+)/), k = d.match(/Silk\/([\d._]+)/), e = d.match(/(BlackBerry).*Version\/([\d.]+)/), h = d.match(/Chrome\/([\d.]+)/) || d.match(/CriOS\/([\d.]+)/);
        if (j.webkit = !!o) {
            j.version = o[1]
        }
        if (f) {
            g.android = true, g.version = f[2]
        }
        if (n) {
            g.ios = g.iphone = true, g.version = n[2].replace(/_/g, ".")
        }
        if (p) {
            g.ios = g.ipad = true, g.version = p[2].replace(/_/g, ".")
        }
        if (q) {
            g.webos = true, g.version = q[2]
        }
        if (m) {
            g.touchpad = true
        }
        if (e) {
            g.blackberry = true, g.version = e[2]
        }
        if (l) {
            g.kindle = true, g.version = l[1]
        }
        if (k) {
            j.silk = true, j.version = k[1]
        }
        if (!k && g.android && d.match(/Kindle Fire/)) {
            j.silk = true
        }
        if (h) {
            j.chrome = true, j.version = h[1]
        }
    }
    a.call(b, navigator.userAgent);
    b.__detect = a
})(Zepto);
(function(h) {
    var f = h.zepto, l = f.qsa, j = f.matches;
    function g(m) {
        m = h(m);
        return !!(m.width() || m.height()) && m.css("display") !== "none"
    }
    var d = h.expr[":"] = {visible: function() {
            if (g(this)) {
                return this
            }
        }, hidden: function() {
            if (!g(this)) {
                return this
            }
        }, selected: function() {
            if (this.selected) {
                return this
            }
        }, checked: function() {
            if (this.checked) {
                return this
            }
        }, parent: function() {
            return this.parentNode
        }, first: function(m) {
            if (m === 0) {
                return this
            }
        }, last: function(m, n) {
            if (m === n.length - 1) {
                return this
            }
        }, eq: function(m, n, o) {
            if (m === o) {
                return this
            }
        }, contains: function(m, n, o) {
            if (h(this).text().indexOf(o) > -1) {
                return this
            }
        }, has: function(m, n, o) {
            if (f.qsa(this, o).length) {
                return this
            }
        }};
    var b = new RegExp("(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*"), e = /^\s*>/, k = "Zepto" + (+new Date());
    function a(r, q) {
        r = r.replace(/=#\]/g, '="#"]');
        var p, m, o = b.exec(r);
        if (o && o[2] in d) {
            var p = d[o[2]], m = o[3];
            r = o[1];
            if (m) {
                var n = Number(m);
                if (isNaN(n)) {
                    m = m.replace(/^["']|["']$/g, "")
                } else {
                    m = n
                }
            }
        }
        return q(r, p, m)
    }
    f.qsa = function(n, m) {
        return a(m, function(s, q, o) {
            try {
                var r;
                if (!s && q) {
                    s = "*"
                } else {
                    if (e.test(s)) {
                        r = h(n).addClass(k), s = "." + k + " " + s
                    }
                }
                var p = l(n, s)
            } catch (t) {
                console.error("error performing selector: %o", m);
                throw t
            } finally {
                if (r) {
                    r.removeClass(k)
                }
            }
            return !q ? p : f.uniq(h.map(p, function(v, u) {
                return q.call(v, u, p, o)
            }))
        })
    };
    f.matches = function(n, m) {
        return a(m, function(q, p, o) {
            return(!q || j(n, q)) && (!p || p.call(n, null, o) === n)
        })
    }
})(Zepto);
String.prototype.score = function(l, d) {
    d = d || 0;
    if (l.length == 0) {
        return 0.9
    }
    if (l.length > this.length) {
        return 0
    }
    for (var g = l.length; g > 0; g--) {
        var n = l.substring(0, g);
        var h = this.indexOf(n);
        if (h < 0) {
            continue
        }
        if (h + l.length > this.length + d) {
            continue
        }
        var m = this.substring(h + n.length);
        var f = null;
        if (g >= l.length) {
            f = ""
        } else {
            f = l.substring(g)
        }
        var e = m.score(f, d + h);
        if (e > 0) {
            var a = this.length - m.length;
            if (h != 0) {
                var b = 0;
                var k = this.charCodeAt(h - 1);
                if (k == 32 || k == 9) {
                    for (var b = (h - 2); b >= 0; b--) {
                        k = this.charCodeAt(b);
                        a -= ((k == 32 || k == 9) ? 1 : 0.15)
                    }
                } else {
                    a -= h
                }
            }
            a += e * m.length;
            a /= this.length;
            return a
        }
    }
    return 0
};
function object(b) {
    var a = function() {
    };
    a.prototype = b;
    return new a()
}
var QuickSelect;
(function(a) {
    QuickSelect = function(u, j) {
        var r = this;
        u = a(u);
        u.attr("autocomplete", "off");
        r.options = j;
        r.AllItems = {};
        var e = false, q = -1, g = false, n, w, l, p = false, k, h;
        if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
            if (Number(RegExp.$1) <= 7) {
                p = true
            }
        }
        k = a('<div class="' + j.resultsClass + '" style="display:block;position:absolute;z-index:9999;"></div>').hide();
        h = a("<iframe />");
        h.css({border: "none", position: "absolute"});
        if (j.width > 0) {
            k.css("width", j.width);
            h.css("width", j.width)
        }
        a("body").append(k);
        k.hide();
        if (p) {
            a("body").append(h)
        }
        r.getLabel = function(x) {
            return x.label || (typeof(x) === "string" ? x : x[0]) || ""
        };
        var d = function(x) {
            return x.values || (x.value ? [x.value] : (typeof(x) === "string" ? [x] : x)) || []
        };
        var o = function(y) {
            var z = a("li", k);
            if (!z) {
                return
            }
            if (typeof(y) === "number") {
                q = q + y
            } else {
                q = z.index(y)
            }
            if (q < 0) {
                q = 0
            } else {
                if (q >= z.size()) {
                    q = z.size() - 1
                }
            }
            z.removeClass(j.selectedClass);
            a(z[q]).addClass(j.selectedClass);
            if (j.autoFill && r.last_keyCode != 8) {
                u.val(w + a(z[q]).text().substring(w.length));
                var B = w.length, A = u.val().length, C = u.get(0);
                if (C.createTextRange) {
                    var x = C.createTextRange();
                    x.collapse(true);
                    x.moveStart("character", B);
                    x.moveEnd("character", A);
                    x.select()
                } else {
                    if (C.setSelectionRange) {
                        C.setSelectionRange(B, A)
                    } else {
                        if (C.selectionStart) {
                            C.selectionStart = B;
                            C.selectionEnd = A
                        }
                    }
                }
                C.focus()
            }
        };
        var v = function() {
            if (l) {
                clearTimeout(l)
            }
            u.removeClass(j.loadingClass);
            if (k.is(":visible")) {
                k.hide()
            }
            if (h.is(":visible")) {
                h.hide()
            }
            q = -1
        };
        r.selectItem = function(x, A) {
            if (!x) {
                x = document.createElement("li");
                x.item = ""
            }
            var z = r.getLabel(x.item), y = d(x.item);
            u.lastSelected = z;
            u.val(z);
            w = z;
            k.empty();
            a(j.additionalFields).each(function(C, B) {
                a(B).val(y[C + 1]).change()
            });
            if (!A) {
                v()
            }
            if (j.onItemSelect) {
                setTimeout(function() {
                    j.onItemSelect(x)
                }, 1)
            }
            return true
        };
        var f = function() {
            var x = a("li." + j.selectedClass, k).get(0);
            if (x) {
                return r.selectItem(x)
            } else {
                if (j.exactMatch) {
                    u.val("");
                    a(j.additionalFields).each(function(z, y) {
                        a(y).val("")
                    })
                }
                return false
            }
        };
        var t = function(F, y) {
            var G;
            k.empty();
            if (j.extraOption) {
                G = j.extraOption.constructor === Function ? j.extraOption.apply(r, [y]) : j.extraOption
            }
            if (!g) {
                return v()
            }
            if (!G && (F === null || F.length === 0)) {
                if (j.noResultsDefault) {
                    F = [j.noResultsDefault]
                } else {
                    return v()
                }
            }
            var E = document.createElement("ul"), A = F.length, B = function() {
                o(this)
            }, D = function() {
            }, z = function(H) {
                H.preventDefault();
                H.stopPropagation();
                r.selectItem(this)
            };
            k.append(E);
            if (j.maxVisibleItems > 0 && j.maxVisibleItems < A) {
                A = j.maxVisibleItems
            }
            var x = function(I) {
                var H = document.createElement("li");
                k.append(H);
                a(H).text(j.formatItem ? j.formatItem(I, C, A) : r.getLabel(I));
                H.item = I;
                if (I.className) {
                    H.className = I.className
                }
                E.appendChild(H);
                a(H).bind("mouseover", B).click(z);
                a(H).bind("mouseout", D).click(z)
            };
            for (var C = 0; C < A; C++) {
                x(F[C])
            }
            if (G) {
                x(G)
            }
            u.removeClass(j.loadingClass);
            return true
        };
        var b = function(x, y) {
            j.finderFunction.apply(r, [x, function(z) {
                    t(j.matchMethod.apply(r, [x, z]), x);
                    y()
                }])
        };
        var m = function() {
            var z = u.offset(), y = (j.width > 0 ? j.width : u.width()), x = a("li", k);
            k.css({width: parseInt(y, 10) + "px", top: z.top + u.height() + 5 + "px", left: z.left + "px"});
            if (p) {
                h.css({width: parseInt(y, 10) - 2 + "px", top: z.top + u.height() + 6 + "px", left: z.left + 1 + "px", height: k.height() - 2 + "px"}).show()
            }
            k.show();
            if (j.autoSelectFirst || (j.selectSingleMatch && x.length == 1)) {
                o(x.get(0))
            }
        };
        var s = function() {
            if (n >= 9 && n <= 45) {
                return
            }
            var x = u.val();
            if (x == w) {
                return
            }
            w = x;
            if (x.length >= j.minChars) {
                u.addClass(j.loadingClass);
                b(x, m)
            } else {
                if (x.length === 0 && (j.onBlank ? j.onBlank() : true)) {
                    a(j.additionalFields).each(function(z, y) {
                        y.value = ""
                    })
                }
                u.removeClass(j.loadingClass);
                k.hide();
                h.hide()
            }
        };
        r.refresh = function() {
            var x = u.val();
            if (x.length >= j.minChars) {
                u.addClass(j.loadingClass);
                b(x, m)
            }
        };
        k.mousedown(function(x) {
            if (x.srcElement) {
                e = x.srcElement.tagName != "DIV"
            }
            x.preventDefault()
        });
        u.keydown(function(x) {
            n = x.keyCode;
            switch (x.keyCode) {
                case 38:
                    x.preventDefault();
                    o(-1);
                    break;
                case 40:
                    x.preventDefault();
                    if (!k.is(":visible")) {
                        m();
                        o(0)
                    } else {
                        o(1)
                    }
                    break;
                case 13:
                    if (f()) {
                        x.preventDefault();
                        u.select()
                    }
                    break;
                case 9:
                    break;
                case 27:
                    if (j.blurOnEsc) {
                        if (j.clearOnEsc && u.val() != "") {
                            u.val("")
                        } else {
                            u.blur()
                        }
                    } else {
                        if (j.clearOnEsc) {
                            u.val("")
                        } else {
                            if (q > -1 && j.exactMatch && u.val() != a(a("li", k).get(q)).text()) {
                                q = -1
                            }
                            a("li", k).removeClass(j.selectedClass);
                            v();
                            x.preventDefault()
                        }
                    }
                    break;
                default:
                    if (l) {
                        clearTimeout(l)
                    }
                    l = setTimeout(s, j.delay);
                    break
                }
        }).focus(function() {
            g = true
        }).blur(function(x) {
            g = false;
            if (l) {
                clearTimeout(l)
            }
            if (j.clearOnBlur) {
                u.val("");
                l = setTimeout(function() {
                    v();
                    if (j.exactMatch && u.val() != u.lastSelected) {
                        r.selectItem(null, true)
                    }
                }, 100)
            } else {
                l = setTimeout(function() {
                    if (q > -1) {
                        f()
                    }
                    v();
                    if (j.exactMatch && u.val() != u.lastSelected) {
                        r.selectItem(null, true)
                    }
                }, 150)
            }
            return true
        })
    };
    QuickSelect.matchers = {quicksilver: function(h, g) {
            var f, b, d = this;
            f = (d.options.matchCase ? h : h.toLowerCase());
            d.AllItems[f] = [];
            var e = h.slice(1, 2).toLowerCase();
            var j = h.slice(1, 2).toUpperCase();
            a.each(g, function(k, l) {
                b = (d.options.matchCase ? d.getLabel(l) : d.getLabel(l).toLowerCase());
                if (b.score(f) > 0.1) {
                    d.AllItems[f].push(l)
                }
            });
            return d.AllItems[f].sort(function(m, k) {
                var l = (d.options.matchCase ? d.getLabel(m) : d.getLabel(m).toLowerCase());
                var n = (d.options.matchCase ? d.getLabel(k) : d.getLabel(k).toLowerCase());
                l = l.score(f);
                n = n.score(f);
                return(l > n ? -1 : (n > l ? 1 : 0))
            })
        }, quicksilver_with_first_match: function(g, f) {
            var e, b, d = this;
            e = (d.options.matchCase ? g : g.toLowerCase());
            d.AllItems[e] = [];
            a.each(f, function(h, j) {
                b = (d.options.matchCase ? d.getLabel(j) : d.getLabel(j).toLowerCase());
                if (e.charAt(0) === b.charAt(0)) {
                    if (b.score(e) > 0) {
                        d.AllItems[e].push(j)
                    }
                }
            });
            return d.AllItems[e].sort(function(k, h) {
                var j = (d.options.matchCase ? d.getLabel(k) : d.getLabel(k).toLowerCase());
                var l = (d.options.matchCase ? d.getLabel(h) : d.getLabel(h).toLowerCase());
                j = j.score(e);
                l = l.score(e);
                return(j > l ? -1 : (l > j ? 1 : 0))
            })
        }, contains: function(h, g) {
            var f, b, d = this;
            f = (d.options.matchCase ? h : h.toLowerCase());
            d.AllItems[f] = [];
            for (var e = 0; e < g.length; e++) {
                b = (d.options.matchCase ? d.getLabel(g[e]) : d.getLabel(g[e]).toLowerCase());
                if (b.indexOf(f) > -1) {
                    d.AllItems[f].push(g[e])
                }
            }
            return d.AllItems[f].sort(function(m, j) {
                var l = (d.options.matchCase ? d.getLabel(m) : d.getLabel(m).toLowerCase());
                var n = (d.options.matchCase ? d.getLabel(j) : d.getLabel(j).toLowerCase());
                var o = l.indexOf(f);
                var o = l ? l.indexOf(f) : "";
                var k = n.indexOf(f);
                return(o > k ? -1 : (o < k ? 1 : (l > n ? -1 : (n > l ? 1 : 0))))
            })
        }, startsWith: function(h, g) {
            var f, b, d = this;
            f = (d.options.matchCase ? h : h.toLowerCase());
            d.AllItems[f] = [];
            for (var e = 0; e < g.length; e++) {
                b = (d.options.matchCase ? d.getLabel(g[e]) : d.getLabel(g[e]).toLowerCase());
                if (b.indexOf(f) === 0) {
                    d.AllItems[f].push(g[e])
                }
            }
            return d.AllItems[f].sort(function(l, j) {
                var k = (d.options.matchCase ? d.getLabel(l) : d.getLabel(l).toLowerCase());
                var m = (d.options.matchCase ? d.getLabel(j) : d.getLabel(j).toLowerCase());
                return(k > m ? -1 : (m > k ? 1 : 0))
            })
        }};
    QuickSelect.finders = {data: function(b, d) {
            d(this.options.data)
        }, data_for_quicksilver: function(e, g) {
            var b = [], d = e.slice(0, 1);
            a.each(this.options.data, function(f, h) {
                var j = h[0].split(" ");
                a.each(j, function(k, l) {
                    if (l.slice(0, 1).toLowerCase() == d) {
                        b.push(h)
                    }
                })
            });
            g(b)
        }, ajax: function(e, f) {
            var b = this.options.ajax + "?q=" + encodeURI(e);
            for (var d in this.options.ajaxParams) {
                if (this.options.ajaxParams.hasOwnProperty(d)) {
                    b += "&" + d + "=" + encodeURI(this.options.ajaxParams[d])
                }
            }
            a.getJSON(b, f)
        }};
    a.fn.quickselect = function(b, d) {
        if (b == "refresh" && a(this).data("quickselect")) {
            return a(this).data("quickselect").refresh()
        }
        if (b == "instance" && a(this).data("quickselect")) {
            return a(this).data("quickselect")
        }
        b = b || {};
        b.data = (typeof(b.data) === "object" && b.data.constructor == Array) ? b.data : undefined;
        b.ajaxParams = b.ajaxParams || {};
        b.delay = b.delay || 400;
        if (!b.delay) {
            b.delay = (!b.ajax ? 400 : 10)
        }
        b.minChars = b.minChars || 1;
        b.cssFlavor = b.cssFlavor || "quickselect";
        b.inputClass = b.inputClass || b.cssFlavor + "_input";
        b.loadingClass = b.loadingClass || b.cssFlavor + "_loading";
        b.resultsClass = b.resultsClass || b.cssFlavor + "_results";
        b.selectedClass = b.selectedClass || b.cssFlavor + "_selected";
        b.finderFunction = b.finderFunction || QuickSelect.finders[!b.data ? "ajax" : ("data")];
        b.matchMethod = b.matchMethod || QuickSelect.matchers[(typeof("".score) === "function" && "l".score("l") == 1 ? "quicksilver" : "contains")];
        if (b.matchMethod === "quicksilver" && b.finderFunction === "data") {
            b.finderFunction = "data_for_quicksilver"
        }
        if (b.matchMethod === "quicksilver" || b.matchMethod === "contains" || b.matchMethod === "startsWith") {
            b.matchMethod = QuickSelect.matchers[b.matchMethod]
        }
        if (b.finderFunction === "data" || b.finderFunction === "ajax") {
            b.finderFunction = QuickSelect.finders[b.finderFunction]
        }
        if (b.matchCase === undefined) {
            b.matchCase = false
        }
        if (b.exactMatch === undefined) {
            b.exactMatch = false
        }
        if (b.autoSelectFirst === undefined) {
            b.autoSelectFirst = true
        }
        if (b.selectSingleMatch === undefined) {
            b.selectSingleMatch = true
        }
        if (b.additionalFields === undefined) {
            b.additionalFields = a("nothing")
        }
        b.maxVisibleItems = b.maxVisibleItems || -1;
        if (b.autoFill === undefined || b.matchMethod != "startsWith") {
            b.autoFill = false
        }
        b.width = parseInt(b.width, 10) || 0;
        return this.each(function() {
            var n = this, p = object(b);
            if (n.tagName == "INPUT") {
                var l = new QuickSelect(n, p);
                a(n).data("quickselect", l)
            } else {
                if (n.tagName == "SELECT") {
                    p.delay = p.delay || 10;
                    p.finderFunction = "data";
                    var e = n.name, f = n.id, k = n.className, o = a(n).attr("accesskey"), h = a(n).attr("tabindex"), j = a("option:selected", n).get(0);
                    p.data = [];
                    a("option", n).each(function(q, r) {
                        p.data.push({label: a(r).text(), values: [r.value, r.value], className: r.className})
                    });
                    var m = a("<input type='text' class='" + k + "' id='" + f + "_quickselect' accesskey='" + o + "' tabindex='" + h + "' />");
                    if (j) {
                        m.val(a(j).text())
                    }
                    var g = a("<input type='hidden' id='" + f + "' name='" + n.name + "' />");
                    if (j) {
                        g.val(j.value)
                    }
                    p.additionalFields = g;
                    a(n).after(m).after(g).remove();
                    m.quickselect(p)
                }
            }
        })
    }
})(window.jQuery || window.Zepto);
var localTime = new Date();
var timeDiff = serverTime.getTime() - localTime.getTime();
var timestamp = [];
var episode = [];
var nextEpisode = -1;
function getEpoch() {
    var a = new Date();
    serverEpoch = a.getTime() + timeDiff;
    return serverEpoch
}
function updateCountdown(h) {
    var g = new Date(h);
    var j = new Date(getEpoch());
    var e = j.getTime();
    var k = g.getTime();
    var b = Math.floor(((k - e) / (60 * 60 * 24)) / 1000);
    var a = Math.floor(((k - e) / (60 * 60)) / 1000) - (b * 24);
    var f = Math.floor(((k - e) / (60)) / 1000) - (b * 24 * 60) - (a * 60);
    var d = Math.floor(((k - e)) / 1000) - (b * 24 * 60 * 60) - (a * 60 * 60) - (f * 60);
    countDownStr = "";
    if (b > 0) {
        countDownStr += b + "d "
    }
    if (a > 0 || b > 0) {
        countDownStr += a + "h "
    }
    if (f > 0 || a > 0 || b > 0) {
        countDownStr += f + "m "
    }
    if (d > -1) {
        countDownStr += d + "s"
    }
    if (b == 0 && a == 0 && f == 0 && d == 0) {
        $("#countdown").html("Now!")
    } else {
        $("#countdown").html(countDownStr)
    }
}
function prefixZero(a) {
    if (a < 10) {
        return"0" + a
    } else {
        return a
    }
}
function updateTime() {
    var a = new Date();
    if (document.getElementById("current_date") != null) {
        document.getElementById("current_date").innerHTML = a.getFullYear() + "-" + prefixZero((a.getMonth() + 1)) + "-" + prefixZero(a.getDate()) + " " + prefixZero(a.getHours()) + ":" + prefixZero(a.getMinutes()) + " (local time)"
    }
    if (a.getSeconds() == 1) {
        updateAgenda(false)
    }
    setTimeout("updateTime()", 1000)
}
function getDiff(e) {
    var f = new Date(e);
    var a = new Date(getEpoch());
    var d = a.getTime();
    var b = f.getTime();
    return(b - d)
}
function findAndUpdateNextEpisode() {
    var b = false;
    for (var a = 0; a < episode.length; a++) {
        if (getDiff(timestamp[a]) > 0) {
            b = true;
            nextEpisode = a;
            break
        }
    }
    if (b) {
        updateCountdown(timestamp[a])
    } else {
        if (document.getElementById("countdown") != null) {
            document.getElementById("countdown").style.visibility = "hidden";
            document.getElementById("countdown_prefix").style.visibility = "hidden"
        }
    }
    setTimeout("findAndUpdateNextEpisode()", 1000)
}
function getTimeLeftString(e) {
    var f = new Date(e);
    var a = new Date(getEpoch());
    var d = a.getTime();
    var b = f.getTime();
    if ((b - d) < 0) {
        diff = Math.abs(b - d)
    } else {
        diff = (b - d)
    }
    daysLeft = Math.floor((diff / (60 * 60 * 24)) / 1000);
    hoursLeft = Math.floor((diff / (60 * 60)) / 1000) - (daysLeft * 24);
    minutesLeft = Math.floor((diff / (60)) / 1000) - (daysLeft * 24 * 60) - (hoursLeft * 60);
    secondsLeft = Math.floor(diff / 1000) - (daysLeft * 24 * 60 * 60) - (hoursLeft * 60 * 60) - (minutesLeft * 60);
    countDownStr = "";
    if (daysLeft > 0) {
        if ((b - d) > 0) {
            countDownStr += "<strong>" + daysLeft + "</strong>"
        } else {
            countDownStr += daysLeft
        }
        if (daysLeft == 1) {
            countDownStr += " day "
        } else {
            countDownStr += " days "
        }
    }
    if ((b - d) < 0) {
        detailedDaysRange = 2
    } else {
        detailedDaysRange = 3
    }
    airs_today = false;
    if (a.getFullYear() == f.getFullYear() && a.getMonth() == f.getMonth() && a.getDate() == f.getDate()) {
        airs_today = true
    }
    if (daysLeft == 0 && hoursLeft > 0 && ((b - d) > 0)) {
        countDownStr += "<strong>" + hoursLeft + "h</strong> "
    } else {
        if ((hoursLeft > 0 || daysLeft > 0) && daysLeft < detailedDaysRange) {
            countDownStr += hoursLeft + "h "
        }
    }
    if (daysLeft == 0 && hoursLeft == 0 && ((b - d) > 0)) {
        countDownStr += "<strong>" + minutesLeft + "m</strong>"
    } else {
        if (daysLeft == 0 && hoursLeft == 0 && minutesLeft < 10) {
            countDownStr += minutesLeft + "m"
        } else {
            if ((minutesLeft > 0 || hoursLeft > 0 || daysLeft > 0) && daysLeft < detailedDaysRange) {
                countDownStr += prefixZero(minutesLeft) + "m"
            }
        }
    }
    if ((b - d) > 0) {
        if (daysLeft < 1) {
            if (airs_today) {
                return countDownStr + " to go"
            } else {
                return countDownStr + " to go"
            }
        } else {
            return countDownStr + " to go"
        }
    } else {
        return countDownStr + " ago"
    }
}
function updateAgenda(b) {
    for (var a = 0; a < episode.length; a++) {
        if ($("#" + episode[a]).length > 0) {
            timeLeftStr = getTimeLeftString(timestamp[a]);
            if (timeLeftStr != "") {
                $("#" + episode[a]).html(timeLeftStr)
            }
        }
    }
    if (b) {
        setTimeout("updateAgenda()", 30000)
    }
}
function roundToNearestQuarter(a) {
    newEpoch = Math.round(a / (15000 * 60)) * (15000 * 60);
    return(newEpoch)
}
function updateAirtimes() {
    var b = new Array(7);
    b[0] = "Sun";
    b[1] = "Mon";
    b[2] = "Tue";
    b[3] = "Wed";
    b[4] = "Thu";
    b[5] = "Fri";
    b[6] = "Sat";
    for (var a = 0; a < episode.length; a++) {
        if (document.getElementById("c" + episode[a]) != null) {
            var d = new Date(timestamp[a]);
            episode_airtime = new Date(roundToNearestQuarter(d.getTime() - timeDiff));
            $("#c" + episode[a]).html(b[episode_airtime.getDay()] + " " + episode_airtime.getFullYear() + "-" + prefixZero(episode_airtime.getMonth() + 1) + "-" + prefixZero(episode_airtime.getDate()) + "&nbsp;&nbsp;" + prefixZero(episode_airtime.getHours()) + ":" + prefixZero(episode_airtime.getMinutes()))
        }
    }
}
var searchItems = [];
var c = 0;
for (var i = 0; i < shows.length; i++) {
    if (shows[i][0] != "") {
        searchItems[c] = [shows[i][0], shows[i][1]];
        c++
    }
}
$(document).ready(function() {
    updateTime();
    updateAgenda(true);
    updateAirtimes();
    if (document.getElementById("countdown") != null) {
        findAndUpdateNextEpisode()
    }
    var h = "";
    var b;
    var a;
    var k;
    var g;
    var l;
    var d;
    var e;
    var o;
    var m = 0;
    var n = 1;
    var j = (shows.length / 4);
    for (var f = 0; f < shows.length; f++) {
        a = shows[f][0];
        b = shows[f][1];
        nameSEO = shows[f][2];
        g = shows[f][3];
        l = shows[f][4];
        d = parseInt(shows[f][5]);
        o = shows_selected[f];
        if (a != "") {
            h = "";
            h += "<div" + (o == 1 ? " class='focus'" : "") + ">";
            h += '<input onclick="h(this)" type="checkbox" name="c' + b + '" class="sic" value="1"' + (o == 1 ? ' checked="checked"' : "") + " />";
            h += '<a class="' + (l == 0 ? "" : "h") + (g > -7 ? " b" : "") + '" href="/s/' + nameSEO + '">' + a;
            if (d != "" && d < 90) {
                h += "&nbsp;<span class='new'></span>"
            }
            h += "</a></div>";
            $("#list" + n).append(h)
        }
        m++;
        if (m > j) {
            n += 1;
            m = 0
        }
        if (a == "") {
            continue
        }
        $("#listmenu").append('<li><a href="/s/' + nameSEO + '">' + a + "</a></li>")
    }
    $("#find_show").quickselect({maxItemsToShow: 10, matchMethod: "quicksilver", clearOnBlur: true, onItemSelect: function(q) {
            var p = $(q).text();
            for (var s = 0; s < shows.length; s++) {
                var r = shows[s][0];
                if (r == p) {
                    var t = shows[s][2];
                    window.location.href = "/s/" + t
                }
            }
        }, data: searchItems})
});
$(".bc_p,.bc_t,.bc_f").click(function() {
    $("a", $(this)).first().click()
});