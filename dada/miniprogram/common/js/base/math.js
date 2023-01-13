var t, r = require("../../../@babel/runtime/helpers/typeof");

module.exports = ((t = {
    randomRange: function(t, r) {
        return Math.floor(Math.random() * (r - t + 1)) + t;
    },
    randomSort: function(t) {
        t && t.length > 1 && t.sort(function() {
            return .5 - Math.random();
        });
    },
    randomPlus: function() {
        return Math.random() < .5 ? -1 : 1;
    },
    autoSize: function(t, r) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, e = new Array(), a = t[0] / t[1];
        return e[0] = r[0], e[1] = Math.round(e[0] / a), n ? e[1] < r[1] && (e[1] = r[1], 
        e[0] = Math.round(e[1] * a)) : e[1] > r[1] && (e[1] = r[1], e[0] = Math.round(e[1] * a)), 
        e;
    },
    ease: function(t, r) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 10, e = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : .1, a = r - t;
        return Math.abs(a) > e ? a / n + t : r;
    },
    toRadian: function(t) {
        return t * Math.PI / 180;
    },
    toDegree: function(t) {
        return t / Math.PI * 180;
    },
    arrayToInt: function(t) {
        for (var r = 0, n = 0; n < t.length; n++) r += t[n] * Math.pow(10, t.length - 1 - n);
        return r;
    },
    deepClone: function(t) {
        var r = this;
        return function t(n) {
            var e = "array" == r.dataType(n) ? [] : {};
            for (var a in n) "object" != r.dataType(n[a]) && "array" != r.dataType(n[a]) ? e[a] = n[a] : e[a] = t(n[a]);
            return e;
        }(t);
    },
    dataType: function(t) {
        return "object" === r(t) ? Array == t.constructor ? "array" : "object" : null;
    },
    objectLength: function(t) {
        return Object.keys(t).length;
    },
    formatNumber: function(t) {
        return (t = t.toString()).length <= 3 ? t : this.formatNumber(t.substr(0, t.length - 3)) + "," + t.substr(t.length - 3);
    },
    float: function(t) {
        var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2;
        if (-1 == (t = t.toString()).indexOf(".")) return t;
        var n = t.split("."), e = n[0] + "." + n[1].substr(0, r);
        return Number(e);
    },
    getDis: function(t, r) {
        var n = r[0] - t[0], e = r[1] - t[1];
        return Math.sqrt(Math.pow(Math.abs(n), 2) + Math.pow(Math.abs(e), 2));
    },
    getDeg: function(t, r) {
        var n;
        if (t[0] == r[0] && t[1] == r[1]) n = 0; else {
            var e = r[1] - t[1], a = r[0] - t[0];
            n = 180 * Math.atan(e / a) / Math.PI, a < 0 ? n = 180 + n : a >= 0 && e < 0 && (n = 360 + n);
        }
        return n;
    },
    hitTest: function(t, r) {
        if (t && r) {
            var n = [ t.left + .5 * t.width, t.top + .5 * t.height ], e = [ r.left + .5 * r.width, r.top + .5 * r.height ], a = Math.abs(e[0] - n[0]), o = Math.abs(e[1] - n[1]), u = .5 * (t.width + r.width), i = .5 * (t.height + r.height);
            return a <= u && o <= i;
        }
        return !1;
    },
    hitPoint: function(t, r) {
        if (t && r) {
            var n = [ r.left, r.left + r.width, r.top, r.top + r.height ];
            return t[0] >= n[0] && t[0] <= n[1] && t[1] >= n[2] && t[1] <= n[3];
        }
        return !1;
    },
    colorToRgb: function(t) {
        if (t.match(/^#?([0-9a-f]{6}|[0-9a-f]{3})$/i)) {
            var r = t.slice(t.indexOf("#") + 1), n = 3 === r.length, e = n ? r.charAt(0) + r.charAt(0) : r.substring(0, 2), a = n ? r.charAt(1) + r.charAt(1) : r.substring(2, 4), o = n ? r.charAt(2) + r.charAt(2) : r.substring(4, 6);
            return [ parseInt(e, 16), parseInt(a, 16), parseInt(o, 16) ];
        }
        return [ 0, 0, 0 ];
    },
    formatTime: function(t) {
        var r = t.getFullYear(), n = t.getMonth() + 1, e = t.getDate(), a = t.getHours(), o = t.getMinutes(), u = t.getSeconds();
        return [ r, n, e ].map(formatNumber).join("/") + " " + [ a, o, u ].map(formatNumber).join(":");
    }
}).formatNumber = function(t) {
    return (t = t.toString())[1] ? t : "0" + t;
}, t.randomString = function(t) {
    t = t || 32;
    for (var r = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678", n = r.length, e = "", a = 0; a < t; a++) e += r.charAt(Math.floor(Math.random() * n));
    return e;
}, t);