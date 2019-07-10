// component/search/index.js
import {
  FileModel
} from '../../model/fileModel.js';
import {
  KeywordModel
} from '../../model/keywordModel.js';
const fileModel = new FileModel();
const keywordModel = new KeywordModel();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    more: {
      type: String,
      // observer: function() {}
      observer: 'loadMore'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    historyWords: [],
    searchPage: false,
    fileList: [],
    pageNum: 1,
    pageSize: 5,
    searchValue: ''
  },
  attached() {
    this.setData({
      historyWords: keywordModel.getHistory()
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //cancel searching page 
    onCancel(event) {
      console.info(event)
      this.triggerEvent('cancel', {}, {});

    },
    //search input delete
    onDelete(event) {
      this.setData({
        searchValue: ''
      });
      this.setData({
        searchPage: false
      })
    },
    onConfirm(event) {
      const searchValue = event.detail.value || event.detail.text
      console.log("searchValue " + searchValue)
      console.log("onConfirm ")
      this.setData({
        searchValue,
        fileList: []
      })
      this._getFileList(searchValue)

    },
    _getFileList(searchValue) {
      let pageNum = this.data.pageNum;
      let pageSize = this.data.pageSize;
      fileModel.searchFileList(pageNum, pageSize, searchValue).then((res) => {
        console.log("fileModel getFileList {}", res);
        let newFileList = res.data.data;
        this.setData({
          fileList: this.data.fileList.concat(newFileList),
          searchPage: true
        })
        keywordModel.addToHistory(searchValue)
      })
    },
    loadMore() {
      console.log("loadMore " + this.properties.more)
      console.log(this.data.fileList.length)
      if (this.data.fileList.length > 0) {
        let pageNum = this.data.pageNum + 1
        this.setData({
          pageNum
        });
        console.log(this.data.pageNum)
        this._getFileList(this.data.searchValue);
      }
    }
  },

})