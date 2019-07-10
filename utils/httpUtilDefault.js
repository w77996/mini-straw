import {
  config
} from 'config.js'
const tips = {
  1: '错误',
  1000: '输入参数错误'
}

class HTTP {
  request(params) {
    // url, data, method
    wx.request({
      url: config.api_base_url + params.url,
      data: params.data,
      method: params.method || "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let code = res.statusCode.toString()
        if (code.startsWith('2')) {
          params.success && params.success(res)
        } else {
          // params.error && params.error(res)
          let error_code = res.data.error_code
          console.log(this, res)
          wx.showToast({
            title: tips[error_code],
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (err) {
        // params.fail && params.fail(err)
        wx.showToast({
          title: tips[1],
          icon: 'warn',
          duration: 2000
        })
      }
    })
  }

  show_error(error_code) {
    if (!error_code) {
      error_code = 1
    }
    wx.showToast({
      title: tips[error_code],
      icon: 'warn',
      duration: 2000
    })
  }
}

// export {
//   HTTP
// };