

Page({
    data: {
        filters: [ {
            label: "我买到的",
            val: !0,
            act: "act"
        }, {
            label: "我卖出的",
            val: !1,
            act: ""
        } ],
        orders: [
            {
               num:30,
               creatTime:'2021-11-10 10:20:00',
               goods:[{
                   img:'../../../images/test/test1.png',
                   word:'测试中'
               }],
               price:300
            }
        ],
        pageNo: 1,
        pageSize: 10,
        type: !0
    },
    requestMoreData: function() {
        this.data.pageNo++, this.requestData();
    },
    switchView: function(a) {
        for (var t = a.currentTarget.dataset.val, e = this.data.filters, r = e[t], o = 0; o < e.length; o++) e[o].act = "";
        e[t].act = "act", this.setData({
            type: r.val,
            pageNo: 1,
            filters: e,
            // orders: []
        })
        // ,
        // this.requestData();
    },
    requestData: function() {
        var e = this, r = {
            pageNo: this.data.pageNo,
            pageSize: this.data.pageSize,
            tradeState: 20
        };
        this.data.type ? r.buyerId = t.globalData.userInfo.id : r.sellerId = t.globalData.userInfo.id, 
        wx.showLoading({
            mask: !0
        }), a.getMarketList(r).then(function(a) {
            "SUCCESS" === a.code && e.dealData(a.data.records), wx.hideLoading();
        });
    },
    dealData: function(a) {
        var t = a.map(function(a) {
            for (var t = [], e = 0; e < a.detailDoList.length; e++) for (var r = a.detailDoList[e], o = 0; o < r.number; o++) {
                var i = {
                    img: r.picUrl,
                    word: r.rewardType + "赏 " + r.rewardName
                };
                t.push(i);
            }
            return {
                id: a.id,
                user: {
                    head: a.sellerAvatarUrl,
                    name: a.sellerNickname
                },
                num: a.number,
                price: a.price,
                creatTime: a.issueDate,
                goods: t
            };
        }), e = this.data.orders.concat(t);
        this.setData({
            orders: e
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