import {
  config
} from 'config.js'
const tips = {
  1: '错误'
}

class HTTP {
  request({
    url,
    data = {},
    method = 'GET'
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method);
    })
  }
  _request(url, resolve, reject, data = {}, method = 'GET') {
    // url, data, method
    console.log("token is {}", wx.getStorageSync("token"));
    wx.request({
      url: config.apiBaseUrl + url,
      data: data,
      method: method,
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync("token")
      },
      success: (res) => {
        const statutsCode = res.statusCode.toString()
        if (statutsCode.startsWith('2')) {
          let code = res.data.code.toString()
          if (code.startsWith('2')) {
            resolve(res)
          } else {
            reject()
            console.log(this, res)
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          reject()
          const error_code = res.data.error_code
          console.log(this, res)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: (err) => {
        reject()
        wx.showToast({
          title: tips[1],
          icon: 'warn',
          duration: 2000
        })
      }
    })
  }
}

export {
  HTTP
};