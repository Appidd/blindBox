const db=wx.cloud.database()

Page({
    data: {
        orders: [],
        pageNo: 1,
        pageSize: 0
    },
    requestMoreData: function() {
        this.data.pageSize+=20, this.requestData();
    },
    requestData: function() {
        wx.showLoading()
        const that=this
        const page=this.data.pageSize
        console.log(page)
        db.collection('recovery').where({_openid:'{openid}'}).orderBy('time', 'desc').skip(page).get({
            success:res=>{
                wx.hideLoading()
                if(res.data.length==0){
wx.showToast({
  title: '已经到底了！',
  icon:'none'
})
                }
                that.renderlist(res.data)
            }
        })
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
      renderlist(list){
        const that=this
        console.log('aa')
        console.log(list.length)
        const t=this.data.orders
    for(var i=0;i<list.length;i++){
        console.log(1)
    var item={
        price:list[i].money,
        creatTime:that.rendertime(list[i].time),
        total:list[i].number,
        num:list[i].detail.length,
        goods:list[i].detail
    }
    t.push(item)
    }
    console.log(t)
    this.setData({
        orders:t
    })
        },
    onLoad: function(e) {
       this.data.pageSize=0
        
    },
    onReady: function() {},
    onShow: function() { this.requestData()},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return a.setShareData();
    }
});