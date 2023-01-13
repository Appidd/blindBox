//app.js

App({
  
  onLaunch: function () {
   
    const updateManager = wx.getUpdateManager()
    
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
        })
 
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
              })
        })
 
        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
        })
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        
        env: 'dada-8gjy4y9xf021dd0e',
        traceUser: true,
      })
    }

    
  
  },
  setShareData: function() {

    return {
        title: "嗒哒，邀请您一起潮玩",
        path: "pages/reward/index/index",
        imageUrl: "/images/icon/logo/logo.png"
    };
},
globalData: {
  userInfo: null,
  systemInfo: null,
  webUrl: null,
  sessionKey: null,
  openid: null,
  hasLogin: !1,
  getMyBag: !1,
  choseIp: {
      id: 1,
      no: 1
  }
}
})
