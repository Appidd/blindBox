var t = {
    requestDomain: "https://reward.seventh77.com",
    _send: function(t) {
        var e = this, n = t.data, o = t.method || "POST", a = {};
        if (t.login) {
            var r = getApp();
            if (1 == r.globalData.userInfo.userState) return void wx.showToast({
                title: "您的账户已经被冻结，无法使用小程序的功能",
                icon: "none"
            });
            a.token = r.globalData.openid;
        }
        return new Promise(function(r, i) {
            wx.request({
                url: e.requestDomain + t.url,
                data: n,
                method: o,
                header: a,
                dataType: "json",
                success: function(t) {
                    r(t.data);
                },
                fail: function(t) {
                    i(t);
                }
            });
        });
    },
    loginWX: function(t) {
        return this._send({
            url: "/wx/user/login",
            method: "GET",
            login: !1,
            data: {
                code: t,
                appid: wx.getAccountInfoSync().miniProgram.appId
            }
        });
    },
    getUserInfo: function(t) {
        return this._send({
            url: "/wx/user/info",
            method: "GET",
            login: !0,
            data: t
        });
    }
};

module.exports = t;