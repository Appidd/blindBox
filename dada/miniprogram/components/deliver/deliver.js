Component({
    properties: {},
    data: {
        show: !1,
        showAni: "",
        moveAni: "",
        message: null,
        address: null,
        choseAddress: !1,
        goods: [],
        postage: 0
    },
    methods: {
        confirmDeliver: function() {
            if (this.data.choseAddress) {
                var s = {
                    message: this.data.message,
                    address: this.data.address.provinceName + this.data.address.cityName + this.data.address.countyName + this.data.address.detailInfo,
                    consignee: this.data.address.userName,
                    mobile: this.data.address.telNumber,
                    goods:this.data.goods,
                    goodList:this.data.goodList
                };
                this.triggerEvent("sendDeliver", s);
            } else wx.showToast({
                title: "请选择收货地址",
                icon: "none"
            });
        },
        getUserAdd: function() {
            var s = this;
            getApp().globalData.getMyBag = !1, wx.chooseAddress({
                success: function(e) {
                    s.setData({
                        address: e,
                        choseAddress: !0
                    });
                }
            });
        },
        changeInput: function(s) {
            this.data.message = s.detail.value;
        },
        close: function() {
            var s = this;
            this.setData({
                showAni: "hideing",
                moveAni: "downing"
            }), setTimeout(function() {
                s.setData({
                    show: !1
                });
            }, 200);
        },
        show: function(s, e,t) {
            this.setData({
                show: !0,
                showAni: "showing",
                moveAni: "uping",
                goods: s,
                message: null,
                address: null,
                choseAddress: !1,
                postage: e,
                goodList:t
            });
        },
        stopScroll: function() {
            return !1;
        }
    }
});