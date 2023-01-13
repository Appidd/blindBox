Component({
    properties: {
        pickNumMax: {
            type: Number,
            value: 0
        },
        title: {
            type: String,
            value: ""
        }
    },
    data: {
        pickNumShow: !1,
        showAni: "",
        moveAni: "",
        pickNum: 0
    },
    methods: {
        show: function() {
            this.setData({
                pickNum: 0,
                pickNumShow: !0,
                showAni: "showing",
                moveAni: "uping"
            });
        },
        hidePickNumBox: function() {
            var i = this;
            this.setData({
                showAni: "hideing",
                moveAni: "downing"
            }), setTimeout(function() {
                i.setData({
                    pickNumShow: !1
                });
            }, 200);
        },
        reducePickNum: function() {
            this.data.pickNum > 0 && this.setData({
                pickNum: this.data.pickNum - 1
            });
        },
        pickNumChange: function(i) {
            var t = parseInt(i.detail.value);
            this.setData({
                pickNum: t
            });
        },
        addPickNum: function() {
            this.data.pickNum < this.data.pickNumMax && this.setData({
                pickNum: this.data.pickNum + 1
            });
        },
        changeChoseNum: function() {
            this.data.pickNum > this.data.pickNumMax || this.data.pickNum < 2 || this.data.pickNum > 50 ? wx.showToast({
                title: "不能大于你的持有数量，且最少合成2张，不能超过50张",
                icon: "none"
            }) : (this.triggerEvent("sendPickNum", this.data.pickNum), this.hidePickNumBox());
        }
    }
});