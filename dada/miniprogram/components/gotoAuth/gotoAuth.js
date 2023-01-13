Component({
    properties: {},
    data: {},
    methods: {
        gotoLogin: function() {
            wx.switchTab({
                url: "../../pages/user/index/user",
                fail: function() {
                    wx.switchTab({
                        url: "../../../pages/user/index/user"
                    });
                }
            });
        }
    }
});