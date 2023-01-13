var t = getApp(),o=require('../../../common/js/getMyCouponList');
Page({
    data: {
        filters:  [{
            label: "我的券",
            val: true,
            act:  "act"
        }, {
            label: "参与中",
            val: false,
            act: ""
        }],
        couponList: [],
        requestType: false,
        showAuto: !1,
        couponId: null,
        pageNo: 1,
        pageSize: 0,
        awardCouponType: "",
        CcouponNum: 0,
        maxComposeNum: 0
    },
    resetPageSize: function () {
        this.setData({
            couponList: [],
            pageNo: 1,
            pageSize: 0
        });
    },
    switchView: function (o) {
        for (var t = o.currentTarget.dataset.val, a = this.data.filters, e = 0; e < a.length; e++) a[e].act = "";
        a[t].act = "act", this.setData({
            filters: a,
            requestType: a[t].val
        })
        // , 
        // this.resetPageSize(), this.requestData();
    },
    requestMoreData: function () {
        this.data.pageNo++, this.requestData();
    },
    jadgeAuth: function () {
        var o = this;
        wx.getStorage({
            key: 'userinfo',
            success: res => {
console.log(res)
                res.data.nickname ? (o.setData({
                    userinfo:res.data,
                    filters: [{
                        label: "我的券",
                        val: true,
                        act: null != this.data.couponId ? "" : "act"
                    }, {
                        label: "参与中",
                        val: false,
                        act: null != this.data.couponId ? "act" : ""
                    }],
                    requestType: null != this.data.couponId ? false : true,
                    showAuth: !1
                }), null != this.data.couponId && this.awardCoupon(), setTimeout(function () {
                    o.resetPageSize(), o.requestData();
                }, 100)) : this.setData({
                    showAuto: !0
                });


            }

        })


    },
    shrequest(){
        this.requestData()
    },
    openCoupon: function (t) {
        var a = this
        var e = t.currentTarget.dataset.info
        var f=a.data.userinfo
        console.log(t)
        this.setData({
            requestType:false
        })
       
        wx.showLoading({
            mask: !0
        })
         o.openCoupon(e,f).then(function (res) {
            console.log(res)
            a.coinDialog.show(res), 
            a.resetPageSize(),
          
                a.requestData(),
                wx.hideLoading();
            
            
                
        });
    },
    awardCoupon: function () {
        console.log(this.data.userinfo)
        const userinfo=this.data.userinfo
        var t = this;
        console.log(t.data.awardCouponType)
        wx.showLoading({
            mask: !0
        }), 
        o.awardCoupon({
            receiveRecordId: this.data.couponId,
            userinfo:userinfo
        }).then(function (o) {
            console.log(222)
            console.log(o)
            wx.hideLoading(), "SUCCESS" === o.code ? t.couponDialog.show(t.data.awardCouponType) : "COUPON_RECORD_ALREADY_RECEIVE" === o.code ? wx.showModal({
                title: "你来晚了，该券已经被领取了",
                showCancel: !1
            }) : "COUPON_RECORD_NOT_SELF_RECEIVE" === o.code ? wx.showModal({
                title: "自己不能领自己的券哦",
                showCancel: !1
            }) : "COUPON_RECORD_NOT_EXIST" === o.code ? wx.showModal({
                title: "该券已经被合成，不能被领取",
                showCancel: !1
            }) : wx.showModal({
                title: "该券不存在",
                showCancel: !1
            });
        }
        );
    },
    requestData: function () {
        console.log(this.data.requestType)
        var t = this
       
        
        var r={
          
            pageSize:this.data.pageSize,
            couponEnum: !this.data.requestType,
            userinfo:this.data.userinfo
        }
        wx.showLoading({
            mask: !0
        }), o.getMycouPonList(r).then(function (o) {
            console.log(o)
            t.renderList(o.data)
             wx.hideLoading()
        });
    },
    renderList: function (o) {
        for (var t = this.data.couponList, a = 0; a < o.length; a++) {
            var e = o[a];
            t.push({
                id: e._id,
                num:e.number,
                type:e.couponName,
                open:e.open,
                min: e.minCoin*e.number,
                max: e.maxCoin*e.number
            });
        }

        this.setData({
            couponList: t
        });
    },
    showNumChoseDialog: function () {
        var t = this;
        o.getCouponNums({
            couponName: "C"
        }).then(function (o) {
            if ("SUCCESS" === o.code) {
                var a = o.data > 50 ? 50 : o.data;
                t.setData({
                    CcouponNum: o.data,
                    maxComposeNum: a
                });
            }
        }), this.numChoseDialog.show();
    },
    composeCoupon: function (t) {
        var a = this,
            e = {
                couponName: "C",
                number: t.detail
            };
        wx.showLoading({
            mask: !0
        }), o.composeCoupon(e).then(function (o) {
            "SUCCESS" === o.code && (wx.showModal({
                title: "合成成功",
                showCancel: !1
            }), a.resetPageSize(), a.requestData()), wx.hideLoading();
        });
    },
    onLoad: function (o) {
        console.log(o.id)
        const t = this
        if(o.id!=undefined){
            this.data.couponId = o.id, this.data.awardCouponType = o.t;
            this.data.requestType=false
        }
      

    },
    onReady: function () {
        this.coinDialog = this.selectComponent("#coinDialog"), this.couponDialog = this.selectComponent("#couponDialog"),
            this.numChoseDialog = this.selectComponent("#numChoseDialog");
    },
    onShow: function () {
        this.jadgeAuth()
    },
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function (o) {
        const that=this
        console.log(that.data.userinfo)
        if ("button" === o.from) {
        var a = o.target.dataset.info;
        return {
            
            title: that.data.userinfo.nickname + "分享给你一张" + ("CC" === a.type ? "C级合成券" : a.type + "级电波券"),
            path: "pages/user/couponList/couponList?id=".concat(a.id, "&t=").concat(a.type),
            imageUrl: "/images/coupon/".concat(a.type, ".jpg")
            };
        }
        return t.setShareData();
    }
});