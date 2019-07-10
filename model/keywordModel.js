import {
  HTTP
} from '../utils/httpUtil.js'

class KeywordModel extends HTTP {
  key = 'q';
  maxLength = 10;
  getHistory() {
    const words = wx.getStorageSync(this.key);
    if (!words) {
      return [];
    }
    return words;
  }
  addToHistory(keyword) {
    // 先判断 keyword 是否存在，不存在再添加
    let words = this.getHistory();
    const has = words.includes(keyword);

    if (!has) {
      // 超过10，先删除末尾，再添加
      const length = words.length;
      if (length >= this.maxLength) {
        words.pop();
      }
      words.unshift(keyword);
      wx.setStorageSync(this.key, words);
    }
  }
}

export {
  KeywordModel
}