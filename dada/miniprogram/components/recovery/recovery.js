
var e=require('../../common/js/getTotalprice')
Component({
    properties: {},
    data: {
        show: !1,
        showAni: "",
        moveAni: "",
        priceTotal: 0,
        goods: []
    },
    methods: {
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
        show: function(e,t) {
            this.setData({
                show: !0,
                showAni: "showing",
                moveAni: "uping",
                goods: e,
                priceTotal: 0,
                goodList:t
            }), this.getRecoveryPrice(e);
        },
        getRecoveryPrice: function(o) {
            console.log(o)
            var t = this, r = {
                retrieveList: this.getChoseAwardList(o)
            };
            console.log(r)
            e.getRecoveryPrice(r).then(function(e) {
                console.log(e)
                t.setData({
                    priceTotal: e
                });
            });
        },
        confirmRecovery: function() {
            console.log('aa')
            var detail={
                list:this.data.goods,
                priceTotal:this.data.priceTotal,
                goodList:this.data.goodList
            }
            this.triggerEvent("sendRecovery",detail), this.close();
        },
        getChoseAwardList: function(e) {
            for (var o = [], t = 0; t < e.length; t++) {
                var r = e[t], i = this.jadgeInArr(o, r);
                "none" === i ? o.push({
                    goodsId: r.goodsId,
                    number: 1,
                    rewardBagId: r.id,
                    rewardType: r.type.split("赏")[0],
                    reprice:r.retrievePrice,
                }) : o[i].number += 1;
            }
            return o;
        },
        jadgeInArr: function(e, o) {
            for (var t = 0; t < e.length; t++) {
                var r = e[t];
                if (r.goodsId === o.goodsId && r.rewardBagId === o.id && -1 !== o.type.indexOf(r.rewardType)) return t;
            }
            return "none";
        },
        stopScroll: function() {
            return !1;
        }
    }
});