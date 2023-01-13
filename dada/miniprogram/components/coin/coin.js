Component({
    properties: {},
    data: {
        show: !1,
        num: 0
    },
    methods: {
        close: function() {
            this.setData({
                show: !1
            });
        },
        show: function(t) {
            this.setData({
                show: !0,
                num: t
            });
        },
        stopScroll: function() {
            return !1;
        }
    }
});