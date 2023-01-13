const db = wx.cloud.database(),
    
    n = getApp();
Page({
    data: {
        collected:true,
        filters: [{
            label: "赏池预览",
            val: 1,
            act: "act"
        }, {
            label: "赏品余量",
            val: 2,
            act: ""
        }, {
            label: "中赏记录",
            val: 3,
            act: ""
        }],
        ipId: 1,
        choseType: 1,
        currentBoxNo: 1,
        IpInfo: {},
        awardTotal: 12,
        awardInventory: 11,
        IpTypeNum: 0,
        buyNum: 0,
        lotteryNum: [1, 5, 10, 0],
        goods: [],
        awardList: [],
        goodImgShow: !0,
        goodInfoShow: !1,
        awardListShow: !1,
        noticeTitle: "用户服务协议条款",
        noticeWord: "测试当中",
        showAuto: !1,
        showAuthMask: !1,
        loading: !1,
        pageNo: 0,
        pageSize: 0,
        rloading: !1,
        listindex: 0,
        today: ''
    },
    requestMoreAwardListData: function () {
        this.requestAwardListData()
    },
    showAuthBox: function () {
        this.setData({
            showAuto: !0,
            showAuthMask: !1
        });
    },
    switchView: function (a) {
        const that = this
        console.log(a)
        for (var t = a.currentTarget.dataset.val, e = this.data.filters, o = e[t], i = 0; i < e.length; i++) e[i].act = "";
        e[t].act = "act", this.data.choseType = o.val, 1 === o.val ? this.showIpImg() : 2 === o.val ? this.showIpInfo() : 3 === o.val && this.showAwardList(),
            this.setData({
                filters: e,
                awardList: [],
                pageNo: 0
            })
        if (a.currentTarget.dataset.val == 2) {
            that.requestAwardListData()
        }
    },
    showAwardList: function () {
        this.setData({
            goodImgShow: !1,
            goodInfoShow: !1,
            awardListShow: !0
        });
    },
    showIpInfo: function () {
        this.setData({
            goodImgShow: !1,
            goodInfoShow: !0,
            awardListShow: !1
        });
    },
    showIpImg: function () {
        this.setData({
            goodImgShow: !0,
            goodInfoShow: !1,
            awardListShow: !1
        });
    },
    changeCase: function () {
        console.log(this.data.IpTypeNum)
        wx.navigateTo({
            url: "../../../pages/reward/chose/chose?id=".concat(this.data.ipId, "&tn=").concat(this.data.IpTypeNum, "&bn=").concat(this.data.IpInfo.allBox)
        });
    },
    collectionIp: function () {

        const num = this.data.awardInventory
        const total = this.data.awardTotal
        const uni = this.data.userinfo.openid
        const avatarUrl = this.data.userinfo.avatarUrl
        const nickname = this.data.userinfo.nickname
        const img = this.data.IpInfo.smallImage
        const sellOut = num
        const boxNumber = this.data.currentBoxNo
        const name = this.data.IpInfo.goodsName
        const ipId = this.data.ipId
        db.collection('collect').add({
            data: {
                num,
                total,
                uni,
                avatarUrl,
                nickname,
                img,
                sellOut,
                boxNumber,
                name,
                ipId
            },
            success: res => {
                console.log(res)
                wx.showToast({
                    title: '收藏成功',
                })
            }
        })

    },
    gotoMybag: function () {
        n.globalData.getMyBag = !0, wx.switchTab({
            url: "../../../pages/mybag/mybag"
        });
    },
    async payConfirm(a) {
        console.log(a)
        const t=this
        const ordernumber = 'yfs' + new Date().getTime()
        const payTotal=a.detail.payTotal
            if (payTotal) {
                wx.cloud.callFunction({
                    name: 'raffle',
                    data: {
                        outTradeNo: ordernumber,
                        price: payTotal,
                        type:'pay'
                    },
                    success: res => {
                        console.log("调用支付云函数成功", res)
                        const payment = res.result.payment
                        wx.requestPayment({
                            ...payment,
                            success(res) {
                                console.log(res)
                                    t.updateUseAccount(a)
                                    t.confirmPayOrder()
                            },
                            fail(err) {
                                
                                console.log(err)
                                wx.showToast({
                                    title: '支付失败',
                                    icon: "none"
                                })
                            }
                        })
                    },
                    fail: res => {
                        
                        console.log("调用支付失败" + res)
                    },
                })
            } else {
                t.updateUseAccount(a)
                t.confirmPayOrder()
            }
    },
  async  updateUseAccount(a){
        const t=this
        const _=db.command
        const   totalPay=a.detail.deductionAmount+a.detail.deductionCoin+a.detail.payTotal

                // 消费记录
     await   db.collection('costRecord').add({
        data:{
                        avatarUrl: t.data.userInfo.avatarUrl,
                        nickName: t.data.userInfo.nickName,
                        time: new Date(),
                        deductionAmount:a.detail.deductionAmount,
                        deductionCoin:a.detail.deductionCoin,
                        cash:a.detail.payTotal,
                        goodsname :t.data.IpInfo.name,
                        boxNumber:t.data.currentBoxNo,
                        number:a.detail.num,
                        totalPay,
                        type:'消费'       
        },
        success:res=>{
            console.log(res)
        }
    })

    // 更新用户消费金额
   await db.collection('userList').doc(t.data.userInfo._id).update({
        data:{
            canUseAmount:_.inc(-a.detail.deductionAmount),
            coin:_.inc(-a.detail.deductionCoin)
        },
        success:res=>{
            t.getuser()
        }
    })
    },
    async confirmPayOrder() {
        wx.showLoading({
          title: '正在抽赏',
        })
        const t = this
        const buyNum = t.data.buyNum
        const ipId = t.data.ipId
        const currentBoxNo = t.data.currentBoxNo
        const name=t.data.IpInfo.name
        const price=t.data.IpInfo.price
        console.log(buyNum, ipId, currentBoxNo)
        wx.cloud.callFunction({
            name:'raffle',
            data:{
                buyNum, ipId, currentBoxNo,name,price,
                type:'getReward'
            },
            success:res=>{
                wx.hideLoading()
                console.log(res)
                if(res.result.code=='OK'){
                    t.payTool.close()
                    t.showAwardRes(res.result.allList.list)
                    t.sendReward().then(res=>{
                        console.log(res)
                        t.requestReadyData()
                    })
                    
                }else{
                    wx.showToast({
                      title: '宝贝被别人抽跑了',
                      icon:'none'
                    })
                    t.rebackmoney()
                    t.requestReadyData()
                    // 退还至余额
                }
            }
        })
    },
   
    sendtickets() {
        const _ = db.command
        const IpInfo = this.data.IpInfo
        const buyNum = this.data.buyNum
        const uni = this.data.userinfo.openid
        const avatarUrl = this.data.userinfo.avatarUrl
        const nickname = this.data.userinfo.nickname
        var couponName = ''
        var maxCoin = 3
        var minCoin = 1
        var number = 0
        if (IpInfo.everyDrawPrice > 10) {
            if (IpInfo.everyDrawPrice >= 11 && IpInfo.everyDrawPrice <= 29) {
                couponName = "C"
            } else if (IpInfo.everyDrawPrice >= 30 && IpInfo.everyDrawPrice <= 59) {
                couponName = "B"
                minCoin = 3
                maxCoin = 5
            } else if (IpInfo.everyDrawPrice >= 60 && IpInfo.everyDrawPrice <= 89) {
                couponName = "A"
                minCoin = 5
                maxCoin = 10
            } else if (IpInfo.everyDrawPrice >= 90) {
                couponName = "S"
                minCoin = 10
                maxCoin = 20
            }
            for (var i = 0; i < buyNum; i++) {
                const getnum = Math.floor(Math.random() * 100)
                if (getnum <= 20) {
                    number++
                }
            }
            if (number) {
                db.collection('tickets').where({
                    uni: uni,
                    couponName: couponName
                }).get({
                    success: res => {
                        if (res.data.length) {
                            const id = res.data[0]._id
                            db.collection('tickets').doc(id).update({
                                data: {
                                    number: _.inc(number)
                                }
                            })
                        } else {
                            db.collection('tickets').add({
                                data: {
                                    uni,
                                    avatarUrl,
                                    nickname,
                                    number,
                                    couponName,
                                    minCoin,
                                    maxCoin,
                                    open: false
                                }
                            })
                        }
                    }
                })
            }
        }
    },
  async  sendReward(){
       const t=this
    return new Promise((resovle,reject)=>{
        wx.cloud.callFunction({
            name:'raffle',
            data:{
              currentBoxNo:t.data.currentBoxNo,
              ipId:t.data.ipId,
              type:'sendReward'
            },
            success:res=>{
               resovle(res)
            },
            fail:err=>{
                reject(err)
            }
        })
    }) 
     
    },
    rebackmoney() {
        const t=this
        const _ = db.command
        db.collection('userList').doc(t.data.userInfo._id).update({
            data: {
                canUseAmount: _.inc(t.data.buyNum*t.data.IpInfo.price)
            }
        })
    },
    previewImage: function (a) {
        var t = a.currentTarget.dataset.img;
        wx.previewImage({
            current: '',
            urls: [t],
        });
    },
    closeOrder: function (a) {
        o.closeOrder({
            orderId: a.orderDo.id
        }).then(function (a) {});
    },
    showAwardRes: function (a) {
        console.log(a)
        this.awardResDialog.show(a);
    },
    showBuyRule: function () {
        this.setData({
            noticeTitle: "用户服务协议条款",
            noticeWord: this.data.USER_BUY_PACT
        }), this.noticeDialog.show();
    },
    showRule: function () {
        this.setData({
            noticeTitle: "购买说明",
            noticeWord: this.data.BUY_RULE
        }), this.noticeDialog.show();
    },
    showPay: function (a) {
        var t = Number(a.currentTarget.dataset.num)
        var e = this.data.IpInfo
        console.log(this.data.userInfo)
        if(!this.data.userInfo){
            wx.showToast({
              title: '请先登陆',
              icon:'none'
            })
        }
       else if (this.data.awardInventory == 0) {
            wx.showToast({
                title: "该箱已经售完",
                icon: "none"
            })
        } else if (this.data.awardInventory < t) {
            wx.showToast({
                title: "卡片不足",
                icon: "none"
            })
        } else {
            e.buyNum = t, this.payTool.show(e), this.data.buyNum = t;
        }
    },
    requestGoodData: function () {
        const t = this
        const id = t.data.ipId
        const currentBoxNo = t.data.currentBoxNo
        db.collection('boxContent').where({
            belong: id,
            serial: currentBoxNo
        }).get({
            success:res=>{
                console.log(res)
                t.dealIpDetail(res.data)
            }
        })
    },
    dealIpDetail: function (a) {
       
        const f = this
     
        console.log(a)
        var t = 0,
            e = 0;
        a.sort(function (a, t) {
            var e = ["FIRST", "SP", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "LAST"];
            return e.indexOf(a.type) - e.indexOf(t.type);
        }), this.data.IpTypeNum = 0;
        for (var o = 0; o < a.length; o++) "FIRST" !== a[o].type && "LAST" !== a[o].type  && (t += 1,
            e += a[o].num), this.data.IpTypeNum++;
        var i = a.map(function (a) {
            var t = "FIRST" === a.type || "LAST" === a.type ? "赠品" : "概率：".concat(parseInt(a.num / e * 1e4) / 100 || 0, "%");

            return {
                id: a._id,
                name: a.name,
                type: a.type + "赏",
                img: a.img,
                num: a.num,
                total: a.num,
                sellOut: 0 === a.num,
                probability: t,
                price: a.price
            };
        });
        console.log(e)

        console.log(t)
        console.log(this.data.IpTypeNum)
        f.setData({
            goods: i,
            awardInventory: e,
            awardTotal: t,
            lotteryNum: [1, 5, 10, e],
            loading: !1
        });
    },
    requestAwardListData() {
        var a = this
        const goodsId = a.data.ipId
        const currentBoxNo = a.data.currentBoxNo
       
        console.log(currentBoxNo,goodsId)
        db.collection('recordList').where({
            goodsId,
            currentBoxNo
        }).orderBy('time','desc').get({
            success:res=>{
                a.dealAwardList(res.data)
            }
        })
    },
    async dealAwardList(a) {
        const that = this
        var list=[]
        for(var i=0;i<a.length;i++){
            for(var j=0;j<a[i].rewardlist.length;j++){
                var t={
                    head:a[i].avatarUrl,
                    name:a[i].nickName,
                    getTime:that.rendertime(a[i].time),
                    goodName:a[i].rewardlist[j].name,
                    type:a[i].rewardlist[j].type
                }
                list.push(t)
            }
        }
        console.log(list)
        for(var j=0,alist=[],blist=[];j<list.length;j++){
            if(list[j].type=='LAST'||list[j].type=='FIRST'){
                alist.push(list[j])
            }else{
                blist.push(list[j])
            }
        }
        console.log(alist,blist)
        var clist=alist.concat(blist)
        that.setData({
            awardList: clist,
        });
    },
    rendertime(now){ 
        var year = now.getFullYear(); 
        var month = now.getMonth() + 1; 
         var date = now.getDate();  
         var hour = now.getHours(); 
         var minute = now.getMinutes();  
         var second = now.getSeconds(); 
         return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
},
    requestIpDetail: function () {
        var t = this;
        const id = this.data.ipId
        db.collection('goods').doc(id).get({
            success: res => {
                console.log(res)
                t.setData({
                    IpInfo: res.data
                })
                console.log(res.data)
            }
        })
    },
    getNotice: function (a) {
        var t = this;
        db.collection('noticeBanner').where({
            pageName:'抽赏'
        }).get({
            success:res=>{
                t.setData({
                    noticeWord:res.data[0].buyInfo
                })
            }
        })
    },
    requestReadyData() {
        this.setData({
            awardList: []
        })
            this.requestAwardListData()
            this.requestIpDetail()
            this.requestGoodData()
    },
    gettoday() {
        var now = new Date()
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        const today = year + "/" + month + "/" + date;
        this.setData({
            today
        })
    },
    onLoad: function (a) {
        var t = this;
        t.gettoday();
        a.id && (n.globalData.choseIp.id = a.id), a.no && (n.globalData.choseIp.no = parseInt(a.no))

    },
    onReady: function () {
            this.noticeDialog = this.selectComponent("#noticeDialog"), this.payTool = this.selectComponent("#payTool"),
            this.awardResDialog = this.selectComponent("#awardResDialog");
    },
    getuser(){
        const i = this
        db.collection('userList').where({
            _openid:'{openid}'
        }).get({
            success:res=>{
                console.log(res)
                i.setData({
                    userInfo:res.data[0]
                })
            }
        })
    },
    onShow: function () {
        const i = this
        i.getuser()
        i.getNotice()
        i.setData({
            ipId: n.globalData.choseIp.id,
            currentBoxNo: n.globalData.choseIp.no,
            awardList: [],
        })

        i.requestReadyData()
    },
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {
        return {
            title: "嗒哒潮玩" + this.data.IpInfo.name + " 第" + this.data.currentBoxNo + "箱",
            path: "pages/reward/ipInfo/ipInfo?id=".concat(this.data.ipId, "&no=").concat(this.data.currentBoxNo),
            imageUrl: this.data.IpInfo.image
        };
    }
});