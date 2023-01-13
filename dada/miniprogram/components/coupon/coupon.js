Component({
    properties: {},
    data: {
        show: !1,
        couponType: "C"
    },
    methods: {
        close: function() {
            this.setData({
                show: !1
            });
            var s=this.data.show
            this.triggerEvent("showclose", s);
        },
        show: function(o) {
            this.setData({
                show: !0,
                couponType: o
            });
        },
        stopScroll: function() {
            return !1;
        }
    }
});