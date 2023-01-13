var t = require("../../@babel/runtime/helpers/interopRequireDefault")(require("../../common/js/base/math")),
    a = require("../../common/js/base/com"),
    s = getApp(),
    db = wx.cloud.database();

Page({
    data: {
        filters: [{
                label: "全部",
                val: "all",
                act: "act"
            },
            {
                label: "现货",
                val: "SPOT_GOODS",
                act: ""
            }, {
                label: "预售",
                val: "PRE_SALE",
                act: ""
            }
        ],
        filterType: "all",
        totalNum: 0,
        goodList: [],
        choseList: [],
        noticeWord: "测试当中",
        postage: 10,
        showAuth: !1,
        choseAllFlag: !1,
        showAuthMask: !1
    },
    getChoseAwardList: function () {
        console.log(this.data.choseList)
        for (var t = [], e = 0; e < this.data.choseList.length; e++) {
            var o = this.data.choseList[e],
                a = this.jadgeInArr(t, o);
            "none" === a ? t.push({
                bagId: o.bagId,
                goodsId: o.goodsId,
                number: 1,
                rewardBagId: o.id,
                rewardType: o.type.split("赏")[0]
            }) : t[a].number += 1;
        }
        return t;
    },
    jadgeInArr: function (t, e) {
        for (var o = 0; o < t.length; o++) {
            var a = t[o];
            if (a.goodsId === e.goodsId && a.rewardBagId === e.id && -1 !== e.type.indexOf(a.rewardType)) return o;
        }
        return "none";
    },
    async awardDeliver(t) {
        
        
        console.log(t)
        const that = this
        const ordernumber = 'yfs' + new Date().getTime()
        const userInfo = this.data.userInfo
        const good = t.detail.goods
        const goodList = t.detail.goodList
        const avatarUrl = userInfo.avatarUrl
        
        const add = t.detail.address
        const remarks = t.detail.message
        const mobile = t.detail.mobile
        const nickname = t.detail.consignee
       
        for (var j = 0, nochose = [],havechose=[]; j < goodList.length; j++) {
            if (goodList[j].goods.length > 0) {
                const goods = goodList[j].goods
                const filterd = goods.filter(function (item) {
                    return item.chose == false;
                })
                const chosedlist = goods.filter(function (item) {
                    return item.chose == true;
                })
                for (var i = 0, chosed = []; i < chosedlist.length; i++) {
                    var z={
                        _id:chosedlist[i].id,
                        belong:chosedlist[i].goodsId,
                        img:chosedlist[i].url,
                        name:chosedlist[i].name,
                        num:1,
                        price:chosedlist[i].retrievePrice,
                        type:chosedlist[i].type,
                    }
                    chosed.push(z)
                    console.log(z)
                }
                havechose.push({
                    "bag": goodList[j].id,
                    "detail": chosed
                })
                for (var i = 0, detail = []; i < filterd.length; i++) {
                    var w={
                        _id:filterd[i].id,
                        belong:filterd[i].goodsId,
                        img:filterd[i].url,
                        name:filterd[i].name,
                        num:1,
                        price:filterd[i].retrievePrice,
                        type:filterd[i].type,
                    }
                    detail.push(w)
                    console.log(w)
                }
                nochose.push({
                    "bag": goodList[j].id,
                    "detail": detail
                })

            }
        }
        console.log(nochose)
        console.log(havechose)

        const trueList=t.detail.goods
        var goodsDetail=''
        for(var i=0,uplist=[];i<trueList.length;i++){
           var x={
               _id:trueList[i].id,
               belong:trueList[i].goodsId,
               img:trueList[i].url,
               num:1,
               price:trueList[i].retrievePrice,
               type:trueList[i].type,
               name:trueList[i].name
           }
           goodsDetail=goodsDetail.concat(trueList[i].name+'一件;')
           uplist.push(x)
        }
        console.log(goodsDetail,uplist)
        if (good.length > 4) {
            wx.showLoading({
                title: '处理中',
            })
            that.upRewardList(nochose,2).then(res=>{
                wx.hideLoading()
                db.collection('deliver').add({
                    data: {
                        avatarUrl,
                        nickName:nickname,
                        mobile,
                        add,
                        remarks,
                        goodsDetail,
                        number: uplist.length,
                        time: new Date(),
                        state: false,
                        detail: uplist
                    }
                })
            })
           

            
        } else {
            wx.cloud.callFunction({
                name: 'raffle',
                data: {
                    outTradeNo: ordernumber,
                    price: 10,
                    type:'pay'
                },
                success: res => {
                    console.log("调用支付云函数成功", res)
                    const payment = res.result.payment
                    wx.requestPayment({
                        ...payment,
                        success(res) {
                            wx.showLoading({
                                title: '处理中',
                            })
                            that.upRewardList(nochose,2).then(res=>{
                                wx.hideLoading()
                                db.collection('deliver').add({
                                    data: {
                                        avatarUrl,
                                        nickName:nickname,
                                        mobile,
                                        add,
                                        remarks,
                                        goodsDetail,
                                        number: uplist.length,
                                        time: new Date(),
                                        state: false,
                                        detail: uplist
                                    }
                                })
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
        }

    },
   async awardRecovery(e) {
        
        const t = this
        console.log(e)
        const _=db.command
        const userInfo = this.data.userInfo
        
        const avatarUrl = userInfo.avatarUrl
        const nickName = userInfo.nickName
        const number = e.detail.list.length
        const money = e.detail.priceTotal
       

        const goodList = e.detail.goodList
        console.log(goodList)
        for (var j = 0, nochose = [],havechose=[]; j < goodList.length; j++) {
            if (goodList[j].goods.length > 0) {
                const goods = goodList[j].goods
                const filterd = goods.filter(function (item) {
                    return item.chose == false;
                })
                const chosedlist = goods.filter(function (item) {
                    return item.chose == true;
                })
                for (var i = 0, chosed = []; i < chosedlist.length; i++) {
                    var z={
                        _id:chosedlist[i].id,
                        belong:chosedlist[i].goodsId,
                        img:chosedlist[i].url,
                        name:chosedlist[i].name,
                        num:1,
                        price:chosedlist[i].retrievePrice,
                        type:chosedlist[i].type,
                    }
                    chosed.push(z)
                    console.log(z)
                }
                havechose.push({
                    "bag": goodList[j].id,
                    "detail": chosed
                })
                for (var i = 0, detail = []; i < filterd.length; i++) {
                    var w={
                        _id:filterd[i].id,
                        belong:filterd[i].goodsId,
                        img:filterd[i].url,
                        name:filterd[i].name,
                        num:1,
                        price:filterd[i].retrievePrice,
                        type:filterd[i].type,
                    }
                    detail.push(w)
                    console.log(w)
                }
                nochose.push({
                    "bag": goodList[j].id,
                    "detail": detail
                })

            }
        }
        console.log(nochose)
        console.log(havechose)
        var goodsDetail=''
        const trueList=e.detail.list
        for(var i=0,uplist=[];i<trueList.length;i++){
           var x={
               _id:trueList[i].id,
               belong:trueList[i].goodsId,
               img:trueList[i].url,
               num:1,
               price:trueList[i].retrievePrice,
               type:trueList[i].type,
               name:trueList[i].name
               
           }
           goodsDetail=goodsDetail.concat(trueList[i].name+'1件;')
           uplist.push(x)
        }
     
        wx.showLoading({
            title: '回收中',
        })
        
      t.upRewardList(nochose,1).then(res=>{
          wx.hideLoading()
         db.collection('recovery').add({
            data: {
                avatarUrl,
                nickName,
                number,
                money,
                goodsDetail,
                detail: uplist,
                time: new Date()
            }
        })
       db.collection('userList').where({
            _openid: '{openid}'
        }).update({
            data:{
                canUseAmount:_.inc(money)
            }
        })
      }) 
    },
  async upRewardList(list,type){
      const t=this
      var title=''
      if(type==1){
        title="寄卖成功！"
      }else{
        title="发货成功！可以到“我的->发货记录”查看详情"
      }
      console.log(list)
        for(var i=0,proList=[];i<list.length;i++){
          if(list[i].detail.length>0){
              
         const all= await  db.collection('rewardList').doc(list[i].bag).update({
              data:{
                rewardlist:list[i].detail,
                buyNum:list[i].detail.length
              },
              success:res=>{
                  console.log(res)
              },
              fail:err=>{
                  console.log(err)
              }
            })
            console.log(1)
            proList.push(all)
          }else{
            const all= await db.collection('rewardList').doc(list[i].bag).remove()
            proList.push(all)
          }
         
        }
       
  return new Promise((resolve,reject)=>{
    Promise.all(proList).then(res=>{
        resolve()
        wx.hideLoading()
        wx.showModal({
            title: title,
            showCancel: !1,
            success: function () {
                t.setData({
                    choseAllFlag:0,
                    choseList:[],
                    choseAllFlag:!1
                })
                t.deliverDialog.close()
                t.recoveryDialog.close()
                t.requestDataAgain()
            }
        })
    })
  })     
  },
    requestDataAgain: function () {
        console.log('111')
        this.setData({
            choseList: []
        });
        this.requestData();
    },

    showRecoveryDialog: function () {
        console.log(this.data.choseList)
        this.data.choseList.length <= 0 ? wx.showToast({
            title: "请先选择需要回收的赏品",
            icon: "none"
        }) : this.noticeDialo.show();
    },
    showhaha(e) {
        console.log(e)
        this.recoveryDialog.show(this.data.choseList,this.data.goodList)
    },

    showDeliverBox: function () {
        console.log(this.data.goodList)
        "act" === this.data.filters[0].act && (this.data.choseList.length <= 0 ? wx.showToast({
            title: "请先选择需要发货的赏品",
            icon: "none"
        }) : this.deliverDialog.show(this.data.choseList, this.data.postage,this.data.goodList));
    },
    showNotice: function () {
        this.noticeDialog.show();
    },
    showGoodList: function (t) {
        console.log(t)
        var o = this,
            s = t.currentTarget.dataset.listindex,
            i = this.data.goodList;
        console.log(i)
        i[s].open = !i[s].open, i[s].open && i[s].goods.length <= 0 ? (wx.showLoading({
            mask: !0
        }),
        db.collection('rewardList').doc(i[s].id).get().then(function (t) {
            console.log(t)
            var e = t.data.rewardlist;
            i[s].goods = [], e.sort(function (t, e) {
                var o = ["FIRST", "LAST","全局","SP", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
                return o.indexOf(t.type) - o.indexOf(e.type);
            });
            for (var n = 0; n < e.length; n++)
                for (var h = e[n], r = 0; r < 1; r++) {
                    var d = {
                        bagId: i[s].id,
                        goodsId: h.belong,
                        id: h._id,
                        type: h.type,
                        name: h.name,
                        url: h.img,
                        retrievePrice: h.price,
                        chose: !1,
                        goodIndex: r
                        
                    };
                    i[s].goods.push(d);
                }
            console.log(i)
            o.setData({
                goodList: i
            }), wx.hideLoading();

        })) : this.setData({
            goodList: i
        });
    },
    choseAll: function () {
        if (this.data.choseAllFlag) {
            for (var t = this.data.goodList, e = 0; e < t.length; e++) {
                var o = t[e];
                o.choseNum = 0;
                for (var a = 0; a < o.goods.length; a++) {
                    o.goods[a].chose = !1;
                }
            }
            this.setData({
                goodList: t,
                choseList: [],
                choseAllFlag: !1
            });
        } else {
            for (var s = this.data.goodList, i = [], n = 0; n < s.length; n++) {
                var h = s[n];
                h.choseNum = 0;
                for (var r = 0; r < h.goods.length; r++) {
                    var d = h.goods[r];

                    d.chose = !0, i.push(d), h.choseNum++;
                }
            }
            console.log(i)
            this.setData({
                goodList: s,
                choseList: i,
                choseAllFlag: !0
            });
        }
    },
    choseGood: function (t) {
        console.log(t)
        var e = t.currentTarget.dataset.listindex,
            o = t.currentTarget.dataset.goodindex,
            a = this.data.goodList,
            s = a[e].goods[o];
        s.trade || (s.chose = !s.chose, a[e].choseNum += s.chose ? 1 : -1, this.updateChoseList(s),
            console.log(a),
            this.setData({
                goodList: a
            })

        );

    },
    updateChoseList: function (e) {
        var o = this.data.choseList;
        if (e.chose) {
            var a = t.default.deepClone(e);
            o.push(a);
        } else
            for (var s = 0; s < o.length; s++) {
                var i = o[s];
                i.id === e.id && i.type === e.type && i.name === e.name && i.goodIndex === e.goodIndex && o.splice(s, 1);
            }
        this.setData({
            choseList: o
        });
    },
    async requestData() {
        var n = new Date(new Date().toLocaleDateString()).getTime()
        var o = this;
       await db.collection('rewardList').where({
            _openid:'{openid}'
        }).get({
            success:res=>{
                console.log(res)
                o.dealIpList(res.data)
            }
        })
        this.setData({
            choseList:[]
        });
    },
    dealIpList: function (t) {
        console.log(t)
        for (var e = [], o = 0, a = 0; a < t.length; a++) {
            var s = t[a],
                i = {
                    id: s._id,
                    ipName: s.goodsName,
                    goods: [],
                    open: !1,
                    total: s.buyNum,
                    choseNum: 0
                };
            e.push(i), o += s.buyNum;
        }
        console.log(e)
        this.setData({
            goodList: e,
            totalNum: o
        });
    },
    onLoad: function (t) {

    },
    onReady: function () {
        this.deliverDialog = this.selectComponent("#deliverDialog"), this.recoveryDialog = this.selectComponent("#recoveryDialog"),
            this.shelfDialog = this.selectComponent("#shelfDialog"), this.noticeDialog = this.selectComponent("#noticeDialog"), this.noticeDialo = this.selectComponent("#noticeDialo");
    },
    getuser(){
        const that=this
        db.collection('userList').where({
            _openid:'{openid}'
        }).get({
            success:res=>{
                s.globalData.userInfo=res.data[0]
                that.setData({
                    userInfo:res.data[0]
                })
            }
        })
    },
    getnotice(){
        db.collection('noticeBanner').where({
            pageName:'赏袋'
        }).get({
            success:res=>{
                this.setData({
                    notice:res.data[0]
                })
            }
        })
    },
    onShow: function () {
        this.requestData()
        this.getuser()
        this.getnotice()
    },
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {
        return s.setShareData();
    }
});