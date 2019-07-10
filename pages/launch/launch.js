// pages/launch/launch.js
import {
  UserModel
} from '../../model/userModel.js';
const userModel = new UserModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationTip: {},
    animationTip2: {},
    animationData: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    this.showAnimation();
    this._userLoginOrAuthorized();

  },
  showAnimation(){
    var animationTip = wx.createAnimation({
      //持续时间800ms
      duration: 800,
      timingFunction: 'ease',
    });
    this.animationTip = animationTip;
    animationTip.opacity(0).step()
    this.setData({
      animationTip: animationTip.export()
    })
    setTimeout(function () {
      animationTip.opacity(1).step()
      this.setData({
        animationTip: animationTip.export()
      })
    }.bind(this), 500)

    var animationTip2 = wx.createAnimation({
      //持续时间1000ms
      duration: 1000,
      timingFunction: 'ease',
    });
    this.animationTip2 = animationTip2;
    animationTip2.opacity(0).step()
    this.setData({
      animationTip2: animationTip2.export()
    })
    setTimeout(function () {
      animationTip2.opacity(1).step()
      this.setData({
        animationTip2: animationTip2.export()
      })
    }.bind(this), 1000)

  },
  _userLoginOrAuthorized() {
    //判断网络状态
    wx.getNetworkType({
      success: res => {
        if (res.networkType == "none") {
          wx.showToast({
            title: '嗷~~网络不可用',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      },
    })
    //判断本地授权缓存
    const authorized = wx.getStorageSync('authorized');
    if (!authorized) {
      //无缓存，判断授权
      this._userAuthorized();
    } else {
      //已授权，执行登陆
      wx.getUserInfo({
        success: data => {
          console.log("userInfo {}", data)
          let userInfo = data.userInfo;
          wx.setStorageSync('userInfo', userInfo);
          //执行登陆操作
          this._userLoginGetCode(userInfo);
        }
      });
    }
  },
  //判断授权状态，进入主页或授权页
  _userAuthorized() {
    // 获取授权的状态
    wx.getSetting({
      success: data => {
        if (data.authSetting['scope.userInfo']) {
          //已授权，执行登陆
          wx.getUserInfo({
            success: data => {
              console.log("userInfo {}", data)
              let userInfo = data.userInfo;
              wx.setStorageSync('userInfo', userInfo);
              //执行登陆操作
              this._userLoginGetCode(userInfo);
            }
          });
          wx.setStorageSync('authorized', true);
        } else {
          console.log("未授权")
          let timer = setTimeout(() => {
            wx.redirectTo({
              url: '/pages/auth/auth'
            })
          }, 1800)

        }
      }
    });
  },
  //后台获取code
  _userLoginGetCode(userInfo) {
    console.log("发起_userLoginGetCode请求");
    wx.login({
      success(res) {
        console.log("wx.login {}", res);
        if (res.code) {
          // 发起网络请求
          const code = res.code;
          userInfo.code = code;
          userModel.getTokenByCode(userInfo).then((res) => {
            console.log("userModel getUserInfo {}", res);
            wx.setStorageSync("token", res.data.data.token);
            let timer = setTimeout(() =>
              wx.switchTab({
                url: '/pages/index/index',
              }), 1800)
          });
        } else {
          console.log('登录失败！' + res.errMsg)
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