// pages/auth/auth.js
//获取应用实例
import {
  UserModel
} from '../../model/userModel.js';
const userModel = new UserModel();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
  },
  onGetUserInfo: function(e) {
    console.log(e)
    const userInfo = e.detail.userInfo
    if (userInfo) {
      wx.setStorageSync('userInfo', userInfo);
      this._userLoginGetCode(userInfo)
    }
  },
  //后台获取code
  _userLoginGetCode(userInfo) {
    console.log("发起_userLoginGetCode请求")
    wx.showLoading({
      title: '登陆中……',
    })
    wx.login({
      success(res) {
        console.log("wx.login {}", res)
        if (res.code) {
          // 发起网络请求
          const code = res.code;
          userInfo.code = code;
          userModel.getTokenByCode(userInfo).then((res) => {
            console.log("userModel getUserInfo {}", res)
            wx.setStorageSync("token", res.data.data.token)
            wx.setStorageSync('authorized', true)
            wx.switchTab({
              url: '/pages/index/index'
            })
            wx.hideLoading()
          });
        } else {
          console.log('登录失败！' + res.errMsg)
          wx.hideLoading()
        }
      }
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