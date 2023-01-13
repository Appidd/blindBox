
Page({
    data: {
        filters: [ {
            label: "全部",
            val: null,
            act: "act"
        }, {
            label: "充值",
            val: "RECHARGE",
            act: ""
        }, {
            label: "花费",
            val: "OUT_ACCOUNT",
            act: ""
        } ],
        records: [],
        pageNo: 1,
        pageSize: 20,
        type: null
    },
    requestMoreData: function() {
        this.data.pageNo++, this.requestData();
    },
    switchView: function(a) {
        for (var t = a.currentTarget.dataset.val, e = this.data.filters, n = e[t], o = 0; o < e.length; o++) e[o].act = "";
        e[t].act = "act", this.setData({
            type: n.val,
            pageNo: 1,
            filters: e,
            records: []
        }), this.requestData();
    },
    requestData: function() {
        var t = this, e = {
            pageNo: this.data.pageNo,
            pageSize: this.data.pageSize,
            tradeTypeEnum: this.data.type
        };
        wx.showLoading({
            mask: !0
        }), a.getBalanceRecord(e).then(function(a) {
            "SUCCESS" === a.code && (wx.hideLoading(), t.dealData(a.data.records));
        });
    },
    dealData: function(a) {
        for (var t = this.data.records, e = 0; e < a.length; e++) {
            var n = a[e], o = {
                type: n.tradeDesc,
                creatTime: n.datachangeLasttime,
                num: n.tradeAmount
            };
            t.push(o);
        }
        this.setData({
            records: t
        });
    },
    onLoad: function(a) {
        var e = this;
        t.globalData.hasLogin ? this.requestData() : t.watch(function() {
            e.requestData();
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return t.setShareData();
    }
});