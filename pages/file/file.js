import {
  FileModel
} from '../../model/fileModel.js';
import {
  config
} from '../../utils/config.js'
const app = getApp()
const fileModel = new FileModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    searchPage: false,
    pageNum: 1,
    pageSize: 5,
    more: '',
    animationBtn: '',
    imageList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.info(options)
    this._getFileList();
  },
  _getFileList() {
    let pageNum = this.data.pageNum;
    let pageSize = this.data.pageSize;
    // wx.showLoading({
    //   title: '加载中',
    // })
    fileModel.getFileList(pageNum, pageSize).then((res) => {
      console.log("fileModel getFileList {}", res);
      let newFileList = res.data.data;
      this.setData({
        fileList: this.data.fileList.concat(newFileList)
      })

      //wx.hideLoading()
    })
  },
  onSearchTap(event) {
    this.setData({
      searchPage: true
    })
    this._hideAddBtn();
  },
  //取消查找显示
  onCancel(event) {
    console.info("tv search canel ")
    this.setData({
      searchPage: false
    })
    this._showAddBtn();
  },
  //删除图片
  onDelete(event) {
    console.info("DEL")
    console.info(event)
    let fileId = event.detail.fileId;
    fileModel.delFileById(fileId).then((res) => {
      console.info(res);
      wx.showToast({
        title: '删除成功',
      })
      this.setData({
        pageNum: 1,
        fileList: []
      });
      app.globalData.refreshFileInfo = true;
      this._getFileList();
    })
  },

  //上传文件
  onUpload(event) {
    let _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.info(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
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
            wx.showToast({
              title: "上传成功~",
              icon: 'none',
              duration: 2000
            })
            _this.setData({
              pageNum: 1,
              fileList: []
            })
            app.globalData.refreshFileInfo = true;
            wx.hideLoading()
            _this._getFileList();
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
  _showAddBtn() {
    var animationBtn = wx.createAnimation({
      //持续时间800ms
      duration: 200,
      timingFunction: 'ease',
    });
    this.animationBtn = animationBtn;
    animationBtn.opacity(0).step()
    animationBtn.rotateZ(0).step()
    this.setData({
      animationBtn: animationBtn.export()
    })
    setTimeout(function() {
      animationBtn.opacity(1).step()
      animationBtn.rotateZ(90).step()
      this.setData({
        animationBtn: animationBtn.export()
      })
    }.bind(this), 200)
  },
  _hideAddBtn() {
    var animationBtn = wx.createAnimation({
      //持续时间800ms
      duration: 200,
      timingFunction: 'ease',
    });
    this.animationBtn = animationBtn;
    animationBtn.opacity(1).step()
    animationBtn.rotateZ(0).step()
    this.setData({
      animationBtn: animationBtn.export()
    })
    setTimeout(function() {
      animationBtn.opacity(0).step()
      animationBtn.rotateZ(90).step()
      this.setData({
        animationBtn: animationBtn.export()
      })
    }.bind(this), 200)
  },
  showImage(event) {
    let current = event.detail.current
    let fileList = this.data.fileList;
    let imageList = new Array();
    console.info(fileList)
    if (fileList.length > 0) {
      for (var index in fileList) {
        imageList.push(fileList[index].filePath)
      }
    }
    wx.previewImage({
      // 当前显示图片的http链接
      current: current,
      // 需要预览的图片http链接列表
      urls: imageList
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
    let refresh = app.globalData.refresh;
    console.info(refresh)
    if (refresh) {
      wx.showToast({
        title: "上传成功~",
        icon: 'none',
        duration: 2000
      })
            this.setData({
                    pageNum: 1,
                    fileList: []
            });
            this._getFileList();
      app.globalData.refresh = false;
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
    console.log("下拉动作")
    this.setData({
      pageNum: 1,
      fileList: []
    });
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

    this._getFileList();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("onReachBottom")
    console.log(this.data.fileList.length)
    if (this.data.fileList.length > 0 && !this.data.searchPage) {
      let pageNum = this.data.pageNum + 1
      this.setData({
        pageNum
      });
      console.log(this.data.pageNum)
      this._getFileList();
    }
    if (this.data.searchPage) {
      this.setData({
        more: Math.random(4)
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})