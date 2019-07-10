//index.js
//获取应用实例
const app = getApp()
import {
  UserModel
} from '../../model/userModel.js';
import {
  config
} from '../../utils/config.js'
const userModel = new UserModel();
Page({
  data: {
    userInfo: {},
    tempFilePaths: ''
  },
  onLoad: function() {

  },
  //上传文件
  onUpload(event) {
    let _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        wx.showLoading({
          title: '上传中',
        })
        wx.uploadFile({
          header: {
            "Authorization": "Bearer " + wx.getStorageSync("token")
          },
          url: config.apiBaseUrl + '/file/upload',
          filePath: tempFilePaths[0],
          name: 'file',
          success: (res) => {
           
            wx.hideLoading()

            app.globalData.refresh = true;
            app.globalData.refreshFileInfo = true;
            wx.switchTab({
              url: '/pages/file/file',
            })
          },
          fail: (res) => {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
            wx.hideLoading()
          }
        })
      }
    })
  },
})