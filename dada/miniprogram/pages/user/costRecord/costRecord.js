var a = require("../../../common/js/rendertime"), t = getApp(),db=wx.cloud.database();
Page({
    data: {
        filters: [  {
            label: "充值",
            val: "RECHARGE",
            act: "act"
        }, {
            label: "消费",
            val: "TRADE",
            act: ""
        } ],
        type:'充值',
        records: [],
        page:0
    },
    requestMoreData: function() {
        
        this.requestData();
    },
    switchView: function(a) {
        console.log(a)
        for (var t = a.currentTarget.dataset.val, e = this.data.filters, o = e[t], n = 0; n < e.length; n++) e[n].act = "";
        e[t].act = "act", this.setData({
            type: o.label,
            page:0,
            filters: e,
            records: []
        })
        // ,
        console.log(this.data.type)
         this.requestData();
    },
    requestData() {
        const that=this
        const type=this.data.type
        const page=this.data.page
        
        wx.showLoading()
      db.collection('costRecord').where({
          type:type,
          _openid:'{openid}'
      }).orderBy('time', 'desc').skip(page).get({
          success:res=>{
              wx.hideLoading()
              console.log(res)
              that.setData({
                  page:page+20
              })
              that.renderlist(res.data)
          }
      })
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
      renderlist(list){
        const that=this
        console.log('aa')
        console.log(list.length)
        const t=that.data.records
    for(var i=0;i<list.length;i++){
        console.log(1)
    var item={
        type:list[i].type,
        creatTime:that.rendertime(list[i].time),
        num:list[i].totalPay
    }
    t.push(item)
    }

    this.setData({
        records:t
    })
        },

    onLoad: function(a) {
    },
    onReady: function() {},
    onShow: function() {
        this.requestData()
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return t.setShareData();
    }
});