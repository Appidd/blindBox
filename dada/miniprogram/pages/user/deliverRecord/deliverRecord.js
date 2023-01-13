const db = wx.cloud.database()
Page({
    data: {
        filters: [{
            label: "已申请",
            val: 0,
            act: "act"
        }, {
            label: "已发货",
            val: 1,
            act: ""
        }],
        records: [],
        pageNo: 0,
        pageSize: 10,
        type: 0
    },
    requestMoreData: function () {
        this.data.pageNo++, this.requestData();

    },
    switchView: function (a) {


        for (var e = a.currentTarget.dataset.val, t = this.data.filters, o = t[e], r = 0; r < t.length; r++) t[r].act = "";
        t[e].act = "act", this.setData({
            type: o.val,
            filters: t,
            pageNo:0,
            records:[]
        })
       this.requestData()
    },

    requestData: function () {
        const that = this
        const page=this.data.pageNo
        const type=this.data.type
        console.log(page,type)
        db.collection('deliver').orderBy('time', 'desc').where({
            state: type==0?false:true,
            _openid: '{openid}'
        }).skip(page*20).get({
            success: res => {
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
    rendertime(now) {
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },
    renderlist(list) {
        const that = this
        const records=this.data.records
        for (var i = 0, t = []; i < list.length; i++) {
            console.log(1)

            var item = {
                price: list[i].money,
                creatTime: that.rendertime(list[i].time),
                total: list[i].number,
                num: list[i].detail.length,
                goods: list[i].detail,
                expressCompany: list[i].expressCompany,
                expressNo: list[i].expressNo,
                add: list[i].add,
                remarks: list[i].remarks,

            }
            t.push(item)
        }

        console.log(t)
        this.setData({
            records: records.concat(t)
        })
    },
    copyExpressNo: function (a) {
        var e = a.currentTarget.dataset.no;
        wx.setClipboardData({
            data: e
        });
    },
    onLoad: function (a) {
        this.requestData()
    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {
        return e.setShareData();
    }
});