var t = getApp();

Component({
    properties: {},
    animationData: {},
    animationData1: {},
    data: {
        show: !1,
        goods: []
    },
    methods: {
        gotoMybag: function() {
            t.globalData.getMyBag = !0, wx.switchTab({
                url: "../../../pages/mybag/mybag"
            });
        },
        close: function() {
            this.setData({
                show: !1
            });
        },
        show: function(t) {
            this.setData({
                show: !0,
                goods: t,
                animationData: {},
               
            })
            var animation = wx.createAnimation({
                duration: 1000,
                timingFunction: 'ease',
              })
              this.animation = animation
              animation.scale(0).translateX(1000).step()
              
              this.setData({
                animationData:animation.export()
              })
          
              setTimeout(function() {
                animation.scale(1).rotate(360).translateX(0).step()
                this.setData({
                  animationData:animation.export()
                })
              }.bind(this), 500)
        },
        stopScroll: function() {
            return !1;
        }
    }
});