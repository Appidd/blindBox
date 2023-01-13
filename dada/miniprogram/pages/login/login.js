// pages/login/login.js
const db=wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasUser:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    getUserInfo(e) {
        const that = this
            wx.getUserProfile({
                desc: '获取你的昵称、头像、地区及性别',
                success: function (res) {
                    console.log(res)
                    wx.showToast({
                      title: '头像授权成功',
                    })
                    that.setData({
                        hasUser:true,
                        nickName: res.userInfo.nickName,
                        avatarUrl: res.userInfo.avatarUrl
                    })
                }
            }) 
    },
    getphone(e) {
        const that = this
        wx.showLoading()
        const nickName=that.data.nickName
        const avatarUrl=that.data.avatarUrl
        const cloudID = e.detail.cloudID
        
            wx.cloud.callFunction({
                name: 'login',
                data: {
                    weRunData: wx.cloud.CloudID(cloudID)
                },
                success: res => {
                    
                    console.log(res)
                    const phone = res.result.event.weRunData.data.phoneNumber
                    console.log(phone)
                    db.collection('userList').add({
                        data:{
                            nickName,
                            avatarUrl,
                            phone,
                            canUseAmount:0,
                            coin:0,
                            ticket:0
                        },
                        success:res=>{
                            wx.hideLoading()
                            wx.switchTab({
                              url: '../user/index/user',
                            })
                        }
                    })
                }
            })
     
       
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
  checkUser(){
      db.collection('userList').where({
          _openid:'{openid}'
      }).get({
          success:res=>{
              console.log(res)
              if(res.data.length){
                  wx.switchTab({
                    url: '../user/index/user',
                  })
              }
          }
      })
  },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
this.checkUser()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})