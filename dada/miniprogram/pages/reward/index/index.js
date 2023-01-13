var t=getApp();

const db = wx.cloud.database()

Page({
    
    data: {
        currentindex: 0,
        filters: [],
        banners: [],
        Ips: [],
        noticeWord: "",
        pageNo: 1,
        pageSize: 20,
        searchWord: "",
        loading: !1,
    },
    gotoDetail: function (a) {
        var e = a.currentTarget.dataset.info
        console.log(e)
        db.collection('boxContent').where({
            belong:e.id,
            num:1
        }).orderBy('serial','asc').get({
            success:res=>{
               if(res.data.length){
                t.globalData.choseIp = {
                    id: e.id,
                    no: res.data[0].serial
                }, wx.navigateTo({
                    url: "../../../pages/reward/ipInfo/ipInfo",
                });
               }else{
                t.globalData.choseIp = {
                    id: e.id,
                    no: 1
                }, wx.navigateTo({
                    url: "../../../pages/reward/ipInfo/ipInfo",
                });
               }
            
            }
        })
        
    },
    switchView: function (a) {
        var e = a.currentTarget.dataset.val
        var t = this.data.filters
        for (var i = 0; i < t.length; i++) {
            var item = t[i];
            item.act = "";
        }
        t[e].act = "act";
        this.setData({
            filters: t,
            searchWord: "",
            currentindex: e,
            pageSize:20
        });
      this.requestData()

    },
  
    changeSearch: function (a) {
        this.data.searchWord = a.detail.value;
    },
    searchIp: function () {
        var a = this;
        const keyword=this.data.searchWord
        const index=this.data.currentindex
        console.log(keyword)
        db.collection('goods').where({
            name: db.RegExp({
              regexp: keyword,
              options: 'i',
            }),
            putaway:true,
            type:a.data.filters[index].lable

          }).get({
              success:res=>{
                  
                a.setData({
                    Ips:[]
                })
                a.renderList(res.data);
              }
          })
        console.log(this.data.searchWord)
    },
    requestMoreData: function () {
       const that=this
       const index=this.data.currentindex
       const pageSize=that.data.pageSize
       db.collection('goods').where({
        putaway:true,
        type:that.data.filters[index].lable
    }).orderBy('_createTime','desc').skip(pageSize).get({
        success:res=>{
            if(res.data.length==0){
                wx.showToast({
                  title: '已经到底了!!!!',
                  icon:'none',
                  duration:300
                })
            }else{
                that.renderList(res.data)
                that.setData({
                    pageSize: pageSize + 20
                })
            }
            
        }
    })    
    },
    showNoticeDialog: function () {
        this.noticeDialog.show();
    },
    renderList: function (a) {
        const that=this
        console.log(a)
        for (var e = that.data.Ips, t = 0; t < a.length; t++) {
            var i = a[t]
            console.log(i,e)
            e.push({
                id: i._id,
                name: i.name,
                new: 0 == t || 1 == t,
                img: i.image,
                price: i.price,
                num: i.onSaleBox,
                total: i.allBox,
                sellOut: 0 == i.onSaleBox,
                currentSaleBoxNumber: i.currentBox
            })
            console.log(e)
        }
        wx.hideLoading()
        that.setData({
            Ips: e
        });
    },
    requestData: function () {
        const that=this
        this.setData({
            Ips:[]
        })
        const index=this.data.currentindex
        wx.showLoading()
        db.collection('goods').where({
            putaway:true,
            type:that.data.filters[index].lable
        }).orderBy('_createTime','desc').get({
            success:res=>{
              that.setData({
                loading:!1
              })
                that.renderList(res.data)
            }
        })

    },
    requestReadyData: function () {
        const that=this
        this.setData({
            currentindex:0
        })
        that.getNoticBanner()
        that.getFilter().then(res=>{
            that.requestData()
        })
    },
    getNoticBanner(){
        const that=this
        db.collection('noticeBanner').where({
            pageName:'首页'
        }).get({
            success:res=>{
                that.setData({
                    banners:res.data[0].banner,
                    noticeWord:res.data[0].notice
                })
                
            }
        })
    },
    getFilter(){
        const that=this
      return  new Promise((resolve,reject)=>{
            db.collection('filter').get({
                success:res=>{
                    console.log(res.data)
                    that.setData({
                        filters:res.data
                    })
                    resolve()
                }
            })
        })
    },
    onLoad: function (a) {
        
        var e = this;
       
        e.requestReadyData()
    },
    onReady: function () {
        this.noticeDialog = this.selectComponent("#noticeDialog");
    },
    onShow: function () {
        
    },
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {
       
       
    },
    onReachBottom: function () {},
    onShareAppMessage: function () {
        return t.setShareData();
    }
});