Component({
    properties: {},
    data: {
        show: !1,
        showAni: "",
        moveAni: "",
        money: null,
        goods: [ {
            img: "../../images/test/good.jpg"
        }, {
            img: "../../images/test/good.jpg"
        } ]
    },
    methods: {
        choseMoney: function(t) {
            var n = t.currentTarget.dataset.money;
            this.setData({
                money: n
            });
        },
        changeInput: function(t) {
            this.data.money = t.detail.value;
        },
        sendRechargeMoney: function() {
            this.data.money ? this.triggerEvent("sendRechargeMoney", this.data.money) : wx.showToast({
                title: "请输入充值金额",
                icon: "none"
            });
        },
        close: function() {
            var t = this;
            this.setData({
                showAni: "hideing",
                moveAni: "downing"
            }), setTimeout(function() {
                t.setData({
                    show: !1,
                    money: null
                });
            }, 200);
        },
        show: function() {
            this.setData({
                show: !0,
                showAni: "showing",
                moveAni: "uping"
            });
        },
        stopScroll: function() {
            return !1;
        }
    }
});