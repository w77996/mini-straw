import {
  HTTP
} from '../utils/httpUtil.js'

class FeedBackModel extends HTTP {
  feedBack(type,content) {
    return this.request({
      url: '/feedback',
      data:{
        type,
        content
      },
      method:'POST'
    });
  }
}

export { FeedBackModel }