
const t = getApp(),db = wx.cloud.database();
Page({
    data: {
        ipId: 0,
        pageNo: 1,
        pageSize: 10,
        totalPage: 0,
        NoAct: "act",
        min:1,
        max:10,
        allowanceAct: "",
        pageArr: [],
        caseData: []
    },
    sortByAllowance: function () {
        var a = this.data.caseData;
        a.sort(function (a, t) {
            return t.num - a.num;
        }), this.setData({
            caseData: a,
            NoAct: "",
            allowanceAct: "act"
        });
    },
    sortByNo: function () {
        var a = this.data.caseData;
        console.log(a)
        a.sort(function (a, t) {
            return   t.No-a.No;
        }), this.setData({
            caseData: a,
            NoAct: "act",
            allowanceAct: ""
        });
    },
    gotoIpInfo: function (a) {
        var e = a.currentTarget.dataset.info;
        console.log(e)
        if(e.sellOut){
            t.globalData.choseIp = {
                    id: e.ipId,
                    no: e.No
                },
                wx.navigateBack({
                        delta: 1
                    });
        }else{
db.collection('boxContent').where({
            belong:e.ipId,
            num:1
        }).orderBy('serial','asc').get({
            success:res=>{
                console.log(res)
                 t.globalData.choseIp = {
            id: e.ipId,
            no: res.data[0].serial
        }, wx.navigateBack({
            delta: 1
        });
            }
        })
       
        }
        
    },
  async requestData() {
    var t = this;
    const min=this.data.min
    const max=this.data.max
    const ipId=this.data.ipId
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
        name: 'raffle',
        data: {
          ipId,
          max,
          min,
          page: 0,
          type:'getChose'
        },
        success: res => {
          console.log(res)
          t.dealBoxList(res.result.data)
         
        }
      })
 
 
  
  
  
    },
    dealBoxList: function (a) {
       
            for (var t = [], e = 0; e < a.length; e += this.data.typeNum) {
                for (var o = 0, n = {
                        ipId: a[e].belong,
                        No: a[e].serial,
                        num: o,
                        recommend: !1,
                        sellOut: !1,
                        detail: []
                    }, i = e; i < (e + this.data.typeNum < a.length ? e + this.data.typeNum : a.length); i++) {
                    var r = {
                        type: a[i].type + "赏",
                        num: a[i].num,
                        total: 1
                    };
                    n.detail.push(r),
                     "FIRST" !== a[i].type && "LAST" !== a[i].type  && (o += a[i].num);
                }
                n.num = o, n.recommend = o < 20 && o > 0, n.sellOut = 0 === o, t.push(n);
            }
            wx.hideLoading({
             
            })
            this.setData({
                caseData: t
            });
       
        
       
    },
    switchView: function (a) {
        console.log(this.data.pageArr)
        console.log(a)
        for (var t = a.currentTarget.dataset.val, e = this.data.pageArr, o = e[t], n = 0; n < e.length; n++) e[n].act = "";
        e[t].act = "act", this.data.pageNo = o.val,this.data.min=o.min,this.data.max=o.max, this.requestData(), this.setData({
            pageArr: e
        });
    },
    dealPageArr: function () {

        this.data.pageSize = 10 * this.data.typeNum;
        for (var a = [], t = 0; t < Math.ceil(this.data.ipNum / 10); t++) a.push({
            label: 10 * t + 1 + " - " + 10 * (t + 1) + "箱",
            val: t + 1,
            act: 0 === t ? "act" : "",
            min:10*t+1,
            max:10*(t+1)

        });
        this.setData({
            pageArr: a
        });
        console.log(a)
    },
    onLoad: function (a) {
        console.log(a.id)
        var e = this;
       
        this.data.ipId = a.id, this.data.ipNum = Number(a.bn), this.data.typeNum = Number(a.tn),
            this.dealPageArr()
        
        e.requestData();
       
    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {
        return t.setShareData();
    }
});