// pages/about/about.js
Page({

        /**
         * 页面的初始数据
         */
        data: {
                gongzong: "https://mmbiz.qpic.cn/mmbiz_png/K9o04n1smLyCcJ5MDvS4o51739H8mJSzwf70KrQiaV8ics1dZrxfHK1uemHiayIyeQbWOOkBP1186gwnOUvlwCJBw/0?wx_fmt=png",
                pay:"https://mmbiz.qpic.cn/mmbiz_png/K9o04n1smLyCcJ5MDvS4o51739H8mJSzSKlcfoxghtqpTq74taASib0BfCPicQxDicx8eqGvT5IC8ZK0TMF05RwrA/0?wx_fmt=png"
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {

        },
        onGongzong:function(event){
                let imageArray = new Array()
                imageArray.push(this.data.gongzong)
                wx.previewImage({
                        // 当前显示图片的http链接
                        current: this.data.gongzong,
                        // 需要预览的图片http链接列表
                        urls: imageArray
                })
        },
        onPay: function(event) {
                console.info(event)
                let imageArray = new Array()
                imageArray.push(this.data.pay)
                wx.previewImage({
                        // 当前显示图片的http链接
                        current: this.data.pay,
                        // 需要预览的图片http链接列表
                        urls: imageArray
                })
        },
        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {

        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {

        },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function() {

        },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function() {

        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function() {

        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function() {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function() {

        }
})