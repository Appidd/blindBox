var a=require('../../../common/js/getCoin')
Page({
    data: {
        filters: [ {
            label: "全部",
            val: 'all',
            act: "act"
        }, {
            label: "收入",
            val: 'get',
            act: ""
        }, {
            label: "花费",
            val: 'cost',
            act: ""
        } ],
        records: [],
        pageNo: 1,
        pageSize: 0,
        type: 'all'
    },
    requestMoreData: function() {
        this.data.pageSize+=20, this.requestData();
    },
    switchView: function(a) {
        for (var t = a.currentTarget.dataset.val, e = this.data.filters, n = e[t], o = 0; o < e.length; o++) e[o].act = "";
        e[t].act = "act", this.setData({
            type: n.val,
            pageSize:0,
            filters: e,
            records: []
        })
        // , 
        // this.requestData();
    },
    requestData: function() {
        var t = this, e = {
            
            pageSize: this.data.pageSize,
            tradeType: this.data.type
        };
        wx.showLoading({
            mask: !0
        }), a.getCoinRecord(e).then(function(a) {
            console.log(a)
           wx.hideLoading(), t.dealData(a)
        });
    },
    rendertime(now){
        var year = now.getFullYear();  //取得4位数的年份
        var month = now.getMonth() + 1;  //取得日期中的月份，其中0表示1月，11表示12月
        var date = now.getDate();      //返回日期月份中的天数（1到31）
        var hour = now.getHours();     //返回日期中的小时数（0到23）
        var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
        var second = now.getSeconds(); //返回日期中的秒数（0到59）
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;  
      },
    dealData: function(a) {
        const that=this
        for (var t = this.data.records, e = 0; e < a.length; e++) {
            var n = a[e];
            t.push({
                type:n.costname,
                creatTime: that.rendertime(n.time),
                num: n.coin,
                type1:n.type=='cost'?'-':'+'
            });
        }
        this.setData({
            records: t
        });
    },
    onLoad: function(a) {
     
      
            // this.requestData();
       
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return t.setShareData();
    }
});