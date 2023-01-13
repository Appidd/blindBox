var db = wx.cloud.database(),

    t = getApp();
Page({
    data: {
       
        userAccountInfo: {
            coin: 0,
            canUseAmount: 0
        },
        collectionIps: [],
        showAuthMask: !1,
        QrCode: "",
        couponNum: 0,
        coin: 0,
        cumber: 0
    },
    getQrCode(){
        const that=this
        db.collection('noticeBanner').where({pageName:'我的'}).get().then(res=>{
            const QrCode=res.data[0].banner[0]
            that.setData({
                QrCode
            })
        })
    },
    tologin(){
        wx.navigateTo({
          url: '../../login/login',
        })
    },
   getuser(){
       const that=this
       db.collection('userList').where({
           _openid:'{openid}'
       }).get({
           success:res=>{
               console.log(res)
               if(res.data.length){
                that.setData({
                    userInfo:res.data[0]
                })
                t.globalData.userInfo=res.data[0]
               }else{
                that.setData({
                    userInfo:0
                })
                t.globalData.userInfo=0

                console.log(that.data.userInfo)
               }
           }
       })
   },
    gotoCouponList: function () {
        wx.navigateTo({
            url: "../couponList/couponList"
        });
    },
    gotoBalanceRecord: function () {
        wx.navigateTo({
            url: "../costRecord/costRecord"
        });
    },
    gotoCostRecord: function () {
        wx.navigateTo({
            url: "../costRecord/costRecord"
        });
    },
    gotoTradeRecord: function () {
        wx.navigateTo({
            url: "../tradeRecord/tradeRecord"
        });
    },
    gotoRecoveryRecord: function () {
        wx.navigateTo({
            url: "../recoveryRecord/recoveryRecord"
        });
    },
    gotoDeliverRecord: function () {
        wx.navigateTo({
            url: "../deliverRecord/deliverRecord"
        });
    },
    gotoCoinRecord: function () {
        wx.navigateTo({
            url: "../coinRecord/coinRecord"
        });
    },
    gotoIpDetail: function (e) {
        var a = e.currentTarget.dataset.info;
        console.log(e)
        t.globalData.choseIp = {
            id: a.ipId,
            no: a.boxNumber || 1
        }

        wx.navigateTo({
            url: "../../../pages/reward/ipInfo/ipInfo"
        });
    },
    delCollect: function (o) {
        const t = this
        console.log(o)
        const id = o.currentTarget.dataset.info.id
        db.collection('collect').doc(id).remove({
            success: res => {
                console.log(res)
                wx.showToast({
                    title: '取消收藏成功',
                })
                t.getUserCollectList()
            }
        })
    },
    showRechargeDialog: function () {
        this.rechargeDialog.show();
    },
    getRechargeMoney: function (o) {
        console.log(o)
        const that = this
        const _=db.command
        const ordernumber = 'yfs' + new Date().getTime()
        const price = parseInt(o.detail)
        const userInfo = this.data.userInfo
        
        console.log(userInfo,userInfo.nickName)
        if (userInfo._openid) {
            wx.cloud.callFunction({
                name: 'raffle',
                data: {
                    outTradeNo: ordernumber,
                    price: price,
                    type:'pay'
                },
                success: res => {
                    console.log("调用支付云函数成功", res)
                    const payment = res.result.payment
                    wx.requestPayment({
                        ...payment,
                        success(res) {
                            wx.showLoading({
                                title: '正在充值',
                            })
                            db.collection('userList').where({
                                _openid:'{openid}'
                            }).update({
                               data:{
                                canUseAmount:_.inc(price)
                               },
                               success:res=>{
                                db.collection('costRecord').add({
                                    data: {
                                        time: new Date(),
                                        avatarUrl: userInfo.avatarUrl,
                                        nickName: userInfo.nickName,
                                        totalPay: price,
                                        type:'充值'
                                    },
                                    success: res => {
                                        wx.hideLoading({
                                            success: (res) => {
                                                wx.showToast({
                                                    title: '充值成功',
                                                })
                                                setTimeout(() => {
                                                    that.getuser()
                                                    that.rechargeDialog.close()
                                                }, 600)
                                            },
                                        })
                                    }
                                })
                               }
                            })
                        },
                        fail(err) {
                            wx.showToast({
                                title: '支付失败',
                                icon: "none"
                            })
                        }
                    })
                },
                fail: res => {
                },
            })
        } else {
            wx.showToast({
                title: '请先登录',
                icon: 'none'
            })
            setTimeout(() => {
                this.rechargeDialog.close()
            }, 600)
        }
    },

    showQrCode: function () {
        wx.previewImage({
            urls: [this.data.QrCode]
        });
    },
    showWithdrawalDialog: function () {
        wx.showToast({
            title: "请联系抽赏官处理，在线秒退款↗",
            icon: "none"
        });
    },

    getUserCollectList: function () {
        var o = this;
        const openid = this.data.userInfo.openid
        db.collection('tickets').where({
            uni: openid,
            open: true
        }).get({
            success: res => {
                const list = res.data
                console.log(list)
                for (var i = 0, coin = 0; i < list.length; i++) {
                    coin = coin + list[i].number
                }
                console.log(coin)
                o.setData({
                    coin
                })
            }
        })
        db.collection('collect').where({
            uni: openid
        }).get({
            success: res => {
                console.log(res)
                var t = res.data.map(function (o) {
                    return {
                        id: o._id,
                        boxNumber: o.boxNumber,
                        goodsId: o.goodsId,
                        name: o.name,
                        img: o.img,
                        num: o.num,
                        total: o.total,
                        sellOut: 0 === o.sellOut,
                        ipId: o.ipId
                    };
                });
                o.setData({
                    collectionIps: t
                });
            }
        })

    },

    copyOpenId: function (o) {
        var e = o.currentTarget.dataset.no;
        wx.setClipboardData({
            data: e
        });
    },
    updateUserInfo: function (t) {
        wx.showLoading({

        })
        var n = this;
        console.log(t)
        n.setData({
            userInfo: t,
            showAuthMask: !1
        })

        db.collection('userInfo').where({
            uni: t.openid
        }).get({
            success: res => {
                if (!res.data.length) {
                    db.collection('userInfo').add({
                        data: {
                            avatarUrl: t.avatarUrl,
                            nickname: t.nickname,
                            uni: t.openid,
                            phonenumber:t.phonenumber,
                            canUseAmount: 0,
                            coin: 0,
                            couponNum: 0,
                            open:false
                        },
                        success: res => {

                        }
                    })
                    wx.hideLoading({

                    })
                } else {
                    db.collection('userInfo').doc(res.data[0]._id).update({
                        data:{
                            avatarUrl: t.avatarUrl,
                            nickname: t.nickname,
                            uni: t.openid,
                            phonenumber:t.phonenumber,
                            open:false
                        },success:res=>{
                            console.log(res)
                        },
                        fail:err=>{
                            console.log(err)
                        }


                    })
                    n.setData({
                        userAccountInfo: {
                            "canUseAmount": res.data[0].canUseAmount,
                            "coin": res.data[0].coin,
                            "couponNum": res.data[0].couponNum
                        }
                    })
                    wx.hideLoading({

                    })
                }

            }
        })

    },
  
    getNotice: function () {
        var o = this;
        t.getNotice("GROUP_QR_CODE").then(function (e) {
            "SUCCESS" === e.code && o.setData({
                QrCode: e.data.keyValue
            });
        });
    },
    getcounpon() {
        const openid = this.data.userInfo.openid
        const that = this
        db.collection('tickets').where({
            uni: openid
        }).get({
            success: res => {
                for (var i = 0, cumber = 0; i < res.data.length; i++) {
                    cumber += res.data[i].number
                }
                this.setData({
                    cumber: cumber
                })
            }
        })
    },
    onReady: function () {
        this.rechargeDialog = this.selectComponent("#rechargeDialog");
    },
    onShow: function () {
        var t = this;
        t.getuser()
       
    },
    onLoad: function (e) {
        this.getQrCode()
    },
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {
        return t.setShareData();
    }
});