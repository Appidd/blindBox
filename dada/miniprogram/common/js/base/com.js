var e, t = require("../../../@babel/runtime/helpers/defineProperty"), n = require("math.js");

module.exports = e = {
    page: function() {
        var e = getCurrentPages();
        return e[e.length - 1];
    },
    pages: function() {
        return getCurrentPages();
    },
    ajax: function(e, t, n, o, a) {
        e && t && wx.request({
            url: e,
            data: t,
            method: a,
            header: {
                "content-type": "application/json"
            },
            dataType: "json",
            success: function(e) {
                n(e);
            },
            fail: function(e) {
                o(e);
            }
        });
    },
    get: function(e, t, n, o) {
        this.ajax(e, t, n, o, "GET");
    },
    post: function(e, t, n, o) {
        this.ajax(e, t, n, o, "POST");
    },
    dateFormat: function(e, t) {
        e = e.replace(/-/g, "/");
        var n = new Date(e), o = n.getFullYear(), a = n.getMonth() + 1 < 10 ? "0" + (n.getMonth() + 1) : n.getMonth() + 1, i = n.getDate() < 10 ? "0" + n.getDate() : n.getDate(), r = n.getHours() < 10 ? "0" + n.getHours() : n.getHours(), c = n.getMinutes() < 10 ? "0" + n.getMinutes() : n.getMinutes(), s = n.getSeconds() < 10 ? "0" + n.getSeconds() : n.getSeconds();
        return t ? o + "-" + a + "-" + i : o + "-" + a + "-" + i + " " + r + ":" + c + ":" + s;
    },
    toggle: function(e, n, o, a, i) {
        var r, c = getCurrentPages(), s = c[c.length - 1];
        n && (o && a && i > 0 ? e ? (s.setData((t(r = {}, n, e), t(r, o, "showTransparent"), 
        r)), setTimeout(function() {
            s.setData(t({}, o, a));
        }, 20)) : (s.setData(t({}, o, a)), setTimeout(function() {
            s.setData(t({}, n, e));
        }, i)) : s.setData(t({}, n, e)));
    },
    show: function(e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "fadeIn", o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 350;
        this.toggle(!0, e, t, n, o);
    },
    hide: function(e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "fadeOut", o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 300;
        this.toggle(!1, e, t, n, o);
    },
    loadBox: function() {
        var t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0], n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "loadBox";
        t ? this.show(n) : e.hide(n);
    },
    loading: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", t = {
            title: e,
            mask: !0
        };
        wx.showLoading(t);
    },
    loadingHide: function() {
        wx.hideLoading();
    },
    sign: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "none", n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1e3, o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : function() {}, a = {
            title: e,
            icon: t,
            duration: n,
            mask: !0
        };
        wx.showToast(a), setTimeout(o, n);
    },
    signHide: function() {
        wx.hideToast();
    },
    alert: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function() {}, n = {
            content: e,
            success: t,
            showCancel: !1
        };
        wx.showModal(n);
    },
    dilaog: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = {}, n = {
            title: "",
            content: "",
            showCancel: !0,
            cancelText: "取消",
            cancelColor: "#000000",
            confirmText: "确定",
            confirmColor: "#3CC51F"
        };
        Object.assign(t, n, e), wx.showModal(t);
    },
    actionSheet: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        wx.showActionSheet(e);
    },
    getBound: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function() {};
        if (e) {
            var o = {};
            wx.createSelectorQuery().select(e).boundingClientRect(function(e) {
                o.left = e.left, o.right = e.right, o.top = e.top, o.bottom = e.bottom, o.width = e.width, 
                o.height = e.height;
            }).exec(), a();
        }
        function a() {
            setTimeout(function() {
                n.objectLength(bound) > 0 ? t(bound) : a();
            }, 33);
        }
    },
    hitTest: function(e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function() {};
        t && e && wx.createIntersectionObserver().relativeTo(t).observe(e, function(e) {
            n(e.intersectionRatio);
        });
    },
    hitArea: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function() {};
        e && wx.createIntersectionObserver().relativeToViewport(t).observe(e, function(e) {
            n(e.intersectionRatio);
        });
    },
    hitOff: function() {
        wx.createIntersectionObserver().disconnect();
    },
    getUrl: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        "" != e && (t ? wx.navigateTo({
            url: e
        }) : wx.redirectTo({
            url: e
        }));
    },
    backUrl: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
        wx.navigateBack({
            delta: e
        });
    },
    checkStr: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
        if ("" != e) {
            var n;
            switch (t) {
              case 0:
                n = new RegExp(/^1[3-9]\d{9}$/);
                break;

              case 1:
                n = new RegExp(/^[1-9]\d{5}$/);
                break;

              case 2:
                n = new RegExp(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/);
                break;

              case 3:
                n = new RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/);
                break;

              case 4:
                n = new RegExp(/^\d+$/);
                break;

              case 5:
                n = new RegExp(/^[a-zA-Z\u0391-\uFFE5]*[\w\u0391-\uFFE5]*$/);
                break;

              case 6:
                n = new RegExp(/^\w+$/);
                break;

              case 7:
                n = new RegExp(/^[\u0391-\uFFE5]+$/);
                break;

              case 8:
                n = new RegExp(/^[a-zA-Z\u0391-\uFFE5]+$/);
                break;

              case 9:
                n = new RegExp(/^\d{6}$/);
                break;

              case 10:
                n = new RegExp(/^\d{4}$/);
            }
            return !!n.exec(this.trim(e));
        }
        return !1;
    },
    trim: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
        return e.replace(/(^\s*)|(\s*$)/g, "");
    },
    click: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1500, n = null;
        return function() {
            var o = +new Date();
            (o - n > t || !n) && (e.apply(this, arguments), n = o);
        };
    },
    storage: function(e, t) {
        if (e) {
            if (null == t || null == t) return wx.getStorageSync(e);
            wx.setStorageSync(e, t);
        }
    },
    removeStorage: function(e) {
        e && wx.removeStorageSync(e);
    },
    clearStorage: function() {
        wx.clearStorage();
    },
    storageInfo: function() {
        return wx.getStorageInfoSync();
    },
    shake: function(o, a, i) {
        var r = getCurrentPages(), c = r[r.length - 1];
        if (console.log(o + "/" + a), o && a) {
            var s, g = {};
            Object.assign(g, {
                rx: 5,
                ry: 5,
                delay: 33,
                now: 0,
                max: 5,
                restore: !0
            }, i), console.log(g);
            var u, l = n.randomRange(-g.rx, g.rx), d = n.randomRange(-g.ry, g.ry);
            if (console.log(l + "/" + d), c.setData((t(s = {}, o, l + "px"), t(s, a, d + "px"), 
            s)), g.now++, g.now > g.max) g.restore && c.setData((t(u = {}, o, 0), t(u, a, 0), 
            u)), g.onComplete && g.onComplete(); else setTimeout(e.shake, g.delay, o, a, g);
        }
    },
    vibrate: function() {
        var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        e ? wx.vibrateLong() : wx.vibrateShort();
    },
    screenBrightness: function(e) {
        e >= 0 && e <= 1 ? wx.setScreenBrightness({
            value: e
        }) : "function" == typeof e && wx.getScreenBrightness({
            success: e
        });
    },
    screenCapture: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function() {};
        wx.onUserCaptureScreen(e);
    },
    clipboardData: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function() {};
        null != e ? wx.setClipboardData({
            data: e,
            success: t
        }) : "function" == typeof e && wx.getClipboardData({
            success: function(t) {
                e(t.data);
            }
        });
    }
};