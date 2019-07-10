import {
  HTTP
} from '../utils/httpUtil.js'
class FileModel extends HTTP {
  getFileList(pageNum,pageSize) {
    return this.request({
      url: '/file/list',
      data:{
        pageNum,
        pageSize
      }
    })
  }
  searchFileList(pageNum, pageSize, searchValue) {
    return this.request({
      url: '/file/search',
      data: {
        pageNum,
        pageSize,
        searchValue
      }
    })
  }
  delFileById(id){
    return this.request({
      url: '/file/'+id,
      data: {
        id
      },
      method:'DELETE'
    })
  }
}
export {
  FileModel
}