

Component({
    properties: {},
    data: {
        show: !1,
        showAni: "",
        moveAni: "",
        money: 0,
        priceTotal: 0,
        goods: []
    },
    methods: {
        shelfAard: function() {
            var e = this;
            !this.data.money || this.data.money < 0 ? wx.showToast({
                title: "请输入大于0的正整数",
                icon: "none"
            }) : (console.log(this.data.money, this.data.priceTotal), this.data.money < this.data.priceTotal ? wx.showModal({
                title: "回收参考价格：" + this.data.priceTotal,
                content: "你的上架价格低于回收价格，确定要上架吗？",
                success: function(t) {
                    t.confirm && (e.close(), e.triggerEvent("sendShelf", e.data.money));
                }
            }) : (this.close(), this.triggerEvent("sendShelf", this.data.money)));
        },
        changeInput: function(e) {
            this.data.money = Number(e.detail.value);
        },
        close: function() {
            var e = this;
            this.setData({
                showAni: "hideing",
                moveAni: "downing"
            }), setTimeout(function() {
                e.setData({
                    show: !1
                });
            }, 200);
        },
        show: function(e) {
            this.setData({
                show: !0,
                showAni: "showing",
                moveAni: "uping",
                goods: e,
                money: null,
                priceTotal: 0
            }), this.getRecoveryPrice(e);
        },
        getRecoveryPrice: function(t) {
            var o = this, n = {
                retrieveList: this.getChoseAwardList(t)
            };
            e.getRecoveryPrice(n).then(function(e) {
                "SUCCESS" === e.code && o.setData({
                    priceTotal: e.data
                });
            });
        },
        getChoseAwardList: function(e) {
            for (var t = [], o = 0; o < e.length; o++) {
                var n = e[o], i = this.jadgeInArr(t, n);
                "none" === i ? t.push({
                    goodsId: n.goodsId,
                    number: 1,
                    rewardBagId: n.id,
                    rewardType: n.type.split("赏")[0]
                }) : t[i].number += 1;
            }
            return t;
        },
        jadgeInArr: function(e, t) {
            for (var o = 0; o < e.length; o++) {
                var n = e[o];
                if (n.goodsId === t.goodsId && n.rewardBagId === t.id && -1 !== t.type.indexOf(n.rewardType)) return o;
            }
            return "none";
        },
        stopScroll: function() {
            return !1;
        }
    }
});