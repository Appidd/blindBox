module.exports = function() {
    var e = wx.getSystemInfoSync();
    console.log(e);
    var i = {};
    return i.info = e, i.android = "android" == e.platform, i.iphone = "iPhone" == e.brand, 
    i.ios = "ios" == e.platform, i.iphoneType = e.model.replace(/^iPhone \w+<$/), i.iphoneX = !!e.model.match(/iPhone X/), 
    i.screenHeight = e.screenHeight, i.screenWidth = e.screenWidth, i.windowHeight = e.windowHeight, 
    i.windowWidth = e.windowWidth, i.statusbarHeight = e.statusbarHeight, i.screen159 = 360 == e.screenWidth && e.windowHeight < 540, 
    i.screen189 = 360 == e.screenWidth && e.windowHeight > 590 || 393 == e.screenWidth && e.windowHeight > 660, 
    i.xiaomi = !(!e.brand.match(/Xiaomi/) && !e.brand.match(/Redmi/)), i.huawei = !!e.brand.match(/HUAWEI/), 
    i.oppo = !!e.brand.match(/OPPO/), i.vivo = !!e.brand.match(/vivo/), i;
}();