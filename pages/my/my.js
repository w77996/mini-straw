// pages/my/my.js
const util = require("../../utils/util.js")
var app = getApp()
import {
  UserModel
} from '../../model/userModel.js';
const userModel = new UserModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    userFileInfo: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getUserInfo();
  },
  _getUserInfo() {
    let that = this
    let userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo)
    this.setData({
      userInfo
    })
    userModel.getUserInfo().then((res) => {
      console.log(res)
      let userFileInfo = res.data.data.userFileInfo
      userFileInfo.fileSize = util.fileSizeTran(userFileInfo.fileSize)
      userFileInfo.leftSize = util.fileSizeTran(userFileInfo.leftSize)
      userFileInfo.totalSize = util.fileSizeTran(userFileInfo.totalSize)
      this.setData({
        userFileInfo
      })
      console.log(this.data.userFileInfo)
    });
  },
  onBindPhone: function(event) {
    console.log("绑定手机")
  },
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  handleContact(e) {
    console.log(e.path)
    console.log(e.query)
  },
  onUserDetail(event){
    wx.navigateTo({
      url: '../my-detail/my-detail',
    })
  },
  onAbout(e){
    wx.navigateTo({
      url: '../about/about',
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
    let refreshFileInfo = app.globalData.refreshFileInfo;
    console.info(refreshFileInfo)
    if (refreshFileInfo) {
     this._getUserInfo()
      app.globalData.refreshFileInfo = false;
    }
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

    this._getUserInfo()

    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
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