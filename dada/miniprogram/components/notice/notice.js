Component({
    properties: {
        title: {
            type: String,
            value: ""
        },
        info: {
            type: String,
            value: ""
        }
    },
    data: {
        show: !1
    },
    methods: {
        close: function() {
            this.setData({
                show: !1
            });
            var s=this.data.show
            this.triggerEvent("showclose", s);
        },
        show: function() {
            this.setData({
                show: !0
            });
         
        },
        stopScroll: function() {
            return !1;
        }
    }
});