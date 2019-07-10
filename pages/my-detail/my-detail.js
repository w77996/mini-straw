// pages/my-detail/my-detail.js
import {
        UserModel
} from '../../model/userModel.js';
const userModel = new UserModel();
Page({

        /**
         * 页面的初始数据
         */
        data: {
                birthDay: "",
                userInfo: "",
                userDetailInfo: "",
                sex: 1
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                userModel.getUserDetailInfo().then((res) => {
                        console.info(res)
                        let userDetailInfo = res.data.data.userDetailInfo;
                        let userInfo = res.data.data.userInfo;
                        this.setData({
                                userDetailInfo,
                                userInfo
                        })
                        let birthDay = this.data.userDetailInfo.birthDay;
                        let sex = this.data.userDetailInfo.sex;
                        console.info(sex)
                        if (sex != 1) {
                                this.setData({
                                        sex: 2
                                })
                        }
                        console.info(birthDay)
                        if (!birthDay) {
                                console.info("birthDay")
                                var myDate = new Date();
                                console.info(myDate.getFullYear() + "-" + myDate.getMonth() + "-" + myDate.getDay())
                                this.setData({
                                        birthDay: new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDay()
                                })
                        } else {
                                console.info("birth")
                                this.setData({
                                        birthDay
                                })
                        }
                        console.info(userDetailInfo)
                });


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
        bindDateChange: function(e) {
                console.log('picker发送选择改变，携带值为', e.detail)
                this.setData({
                        date: e.detail.value
                })
        },
        onSubmit: function(event) {
                let sex = this.data.sex
                let birthDay = this.data.birthDay
                userModel.editUserDetailInfo(sex, birthDay).then((res)=>{
                        wx.showToast({
                                title: '更新成功~'
                                
                        })
                        setTimeout(function () {
                                wx.switchTab({
                                        url: '/pages/file/file',
                                })
                        }.bind(this), 500)
                        
                })
        },
        radioChange: function(event) {
                console.info(event)
                this.setData({
                        sex: event.detail.value
                })
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