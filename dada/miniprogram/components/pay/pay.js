const db=wx.cloud.database();

Component({
    properties: {
        showList: {
            type: Boolean,
            value: !1
        }
    },
    data: {
       
        show: !1,
        showAni: "",
        moveAni: "",
        userAccountInfo: {
            canUseAmount: 0,
            coin: 0
        },
        deductionCoin: 0,
        deductionAmount: 0,
        payTotal: 0,
        OrderInfo: {
            num: 0,
            creatTime: "",
            price: 0,
            user: {
                head: "",
                name: ""
            },
            goods: []
        },
        IpInfo: {
            smallImage: "",
            goodsName: "",
            everyDrawPrice: 0,
            buyNum: 0
        },
        choseAmount: !1,
        choseCoin: !1
    },
    methods: {
        choseCoinDeduction: function() {
            
            this.data.userAccountInfo.coin <= 0 ? wx.showToast({
                title: "DD币不足",
                icon: "none"
            }) : (this.setData({
                choseCoin: !this.data.choseCoin
            }), this.countDeduction());
        },
        choseAmountDeduction: function() {
            this.data.userAccountInfo.canUseAmount <= 0 ? wx.showToast({
                title: "余额不足",
                icon: "none"
            }) : (this.setData({
                choseAmount: !this.data.choseAmount
            }), this.countDeduction());
        },
        countDeduction: function() {
            var t = this.data.showList ? this.data.OrderInfo.price : this.data.IpInfo.price * this.data.IpInfo.buyNum, o = this.data.userAccountInfo.coin, n = this.data.userAccountInfo.canUseAmount, e = 0, i = 0;
            this.data.choseCoin && (o > t ? (e = t, t = 0) : (e = o, t -= o)), this.data.choseAmount && (n > t ? (i = t, 
            t = 0) : (i = n, t -= n)), this.setData({
                payTotal: t,
                deductionCoin: e,
                deductionAmount: i
            });
        },
        getUserAcountInfo: function() {
            const that=this
            db.collection('userList').where({
                _openid:'{openid}'
            }).get({
               success:res=>{
                that.setData({
                    userAccountInfo:{
                        "canUseAmount":res.data[0].canUseAmount,
                        "coin":res.data[0].coin
                    }
                })
               }
            })
        },
        close: function() {
            var t = this;
            this.setData({
                showAni: "hideing",
                moveAni: "downing"
            }), setTimeout(function() {
                t.setData({
                    show: !1
                });
            }, 200);
        },
        resetData: function() {
            this.setData({
                deductionCoin: 0,
                deductionAmount: 0,
                payTotal: 0,
                OrderInfo: {
                    num: 0,
                    creatTime: "",
                    price: 0,
                    user: {
                        head: "",
                        name: ""
                    },
                    goods: []
                },
                IpInfo: {
                    image: "",
                    name: "",
                    price: 0,
                    buyNum: 0
                },
                choseAmount: !1,
                choseCoin: !1
            });
        },
        show: function(t) {
            this.resetData(), this.getUserAcountInfo(), this.setData({
                show: !0,
                showAni: "showing",
                moveAni: "uping"
            }), this.data.showList ? this.setData({
                OrderInfo: t,
                payTotal: t.price
            }) : this.setData({
                IpInfo: t,
                payTotal: t.price * t.buyNum
            }); 
            setTimeout((res=>{
                this.choseAmountDeduction()
            }),500)
            

        },
        showBuyRule: function() {
            this.triggerEvent("showBuyRule");
        },
     
        gotoPay: function() {
            var t = {
                deductionCoin: this.data.deductionCoin,
                deductionAmount: this.data.deductionAmount,
                payTotal: this.data.payTotal,
                choseAmount: this.data.choseAmount,
                choseCoin: this.data.choseCoin,
                num:this.data.IpInfo.buyNum
            };
            this.data.showList && (t.orderInfo = this.data.OrderInfo), this.triggerEvent("payConfirm", t);
        },
        stopScroll: function() {
            return !1;
        }
    },
   
           
        
    
});