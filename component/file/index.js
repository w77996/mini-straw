// component/file/index.js
const util = require("../../utils/util.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    file: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    fileCreatTime: '',
    fileSize: 0
  },
  ready: function() {
    if (this.properties.file) {
      console.info(util.formatTime(new Date(this.properties.file.createTime)));
      let fileCreatTime = util.formatTime(new Date(this.properties.file.createTime));
      let fileSize = util.fileSizeTran(this.properties.file.fileSize)
      this.setData({
        fileCreatTime,
        fileSize
      });
    }

  },
  /**
   * 组件的方法列表
   */
  methods: {
    onDelete: function(event) {
      console.info(event)
      let fileId = this.properties.file.id;
      this.triggerEvent('del', {
        fileId
      }, {});
    },
    onCopy: function(event) {
      console.info(event)
      let _this = this;
      wx.setClipboardData({
        data: _this.properties.file.filePath,
        success: function(res) {
          wx.showToast({
            title: '地址复制成功',
          })
        }
      });
    },
    onTouch: function(event) {
      let  current = this.properties.file.filePath
      this.triggerEvent('showImage', {current}, {});

    },
  }
})