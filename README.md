[TOC]

mini-straw
# 项目结构
``` 
mini-straw
    ├── component -- 组件
    |    ├── file -- 文件组件
    |    ├── image-button -- 图片按钮组件
    |    ├── search -- 查找页面组件
    |    ├── tag -- 标签组件
    ├── images -- 图片目录
    |    ├── icon -- icon图片
    |    ├── tab -- tab图片
    ├── model -- 封装的model
    ├── pages -- 页面
    |    ├── about -- 关于页
    |    ├── auth -- 授权页
    |    ├── file -- 文件页
    |    ├── index -- 首页
    |    ├── launch -- 启动页面
    |    ├── my -- 个人中心
    └── utils -- 工具

```
# 开屏页
## 1.判断网络状态
使用`wx.getNetworkType({})`可获取当前网络状态，`networkType`值`wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)`
```
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
```
## 2.判断授权状态
使用`  wx.getSetting({})`获取授权状态，在获得`data`后取`data.authSetting['scope.userInfo']`判断授权状态
```
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
        //跳转至授权页
        let timer = setTimeout(() => {
                wx.redirectTo({
                        url: '/pages/auth/auth'
                })
        }, 2000)

    }
    }
});
```
若授权，则调用`wx.getUserInfo({})`获取微信用户信息，信息获取完成后调用`wx.login({})`获取小程序的`code`,通过`code`向后台获取用户openId及token。
```
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
                    }), 2000)
            });
        } else {
                console.log('登录失败！' + res.errMsg)
        }
        }
    })
},
```
## 3.跳转页面
- 跳转`/pages/auth/auth`页面使用的是`wx.redirectTo({})`
- 跳转`/pages/index/index`页面使用的是`wx.switchTab({})`  
因为`/pages/index/index`是小程序tab页，使用`wx.redirectTo({})`无法跳转  

# 授权页
授权需制定button按钮，加入`open-type='getUserInfo'`属性，`bindgetuserinfo`调用自定义方法`onGetUserInfo`。
```
 <button class="auth-button" open-type='getUserInfo' bindgetuserinfo="onGetUserInfo">好的</button>
```
`onGetUserInfo`接受授权状态及授权获取的用户信息，再进行`code`获取，通过`code`向后台获取用户openId及token。
```
onGetUserInfo: function(e) {
    console.log(e)
    const userInfo = e.detail.userInfo;
    if (userInfo) {
            //通过`code`向后台获取用户openId及token。
            this._userLoginGetCode(userInfo);
    }
},
```

# 主页
## 1. 图片按钮插槽组件
在`component`目录下的`images-button`组件，做了简单的图片插槽统一，在分享按钮，用户登录按钮，文件上传按钮均可以使用。`plain="{{true}}"`代表button背景透明
```
<button  open-type="{{openType}}" plain="{{true}}" class="container">
  <slot name="img"></slot>
</button>
```
`options`需要开启插槽功能，添加`multipleSlots: true`  
`open-type="{{openType}}"`父组件将参数传入子组件，子组件在`properties`属性中可以获取到父组件传来的openType数据，通过`this.properties.openType`可以获取属性值
```
options: {
    // 开启插槽
    multipleSlots: true
  },
/**
   * 组件的属性列表
   */
  properties: {
    openType: {
      type: String
    }
  },
```
`index`页面引入组件，需要在`index.json`中添加组件路径 
```
{
  "usingComponents": {
    "btn-cmp": "/component/image-button/index"
  }
}
```
## 2. 上传文件
主要使用到`wx.chooseImage({})`进行图片的选择，选择后使用`wx.uploadFile({})`上传图片至服务器
```
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
      },
      fail: (res) => {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })

  }
})
}
```
# 列表页

## 1.search组件的显示和隐藏
固定列表页搜索header位置，点击header显示`search`组件，在`search`组件点击取消则隐藏`search`组件，此处设计子组件向父组件传递消息
- 引入search组件
```
 "usingComponents": {
    ...
    "search-cmp": "/component/search/index"
  }
```
- 使用searchPage参数判断`search`组件的,默认为false,在点击header时更新searchPage为true,显示`search`组件
```
<view wx:if="{{!searchPage}}" class="container">
  ...
</view>

<search-cmp  wx:if="{{searchPage}}" ></search-cmp>
```
- `search`页面点击取消，向父组件发送一个`this.triggerEvent('cancel', {}, {});`事件，在xml中的`search-cmp `添加`cancel`事件的通知绑定
```
#file页面中的search-cmp组件
<search-cmp  wx:if="{{searchPage}}" bind:cancel="onCancel"></search-cmp>
```
父组件`file`页面绑定子组件传来的`cancel`事件通知，就调用`onCancel`方法,
在`onCancel`方法中获取事件响应，将`searchPage`参数修改为false，`search`组件就隐藏起来了
```
//cancel searching page 
onCancel(event) {
  console.info(event)
  this.triggerEvent('cancel', {}, {});
 
},
```
## 2.文件列表
### 1.获取列表信息传递给file组件
在`page`中的file页面，获取到后台传来的fileList数据，引入file组件，`file="{{item}}"`将数据传入子组件
```
<view wx:if="{{fileList}}">
  <block wx:for="{{fileList}}" wx:key="{{item.id}}" file="{{item}}">
    <file-cmp file="{{item}}" bind:del="onDelete"></file-cmp>
    <view class="line"></view>
  </block>
</view>
```
在`component`中的file组件，在`properties`添加属性`file`来接收父组件传来的数据
```
  /**
   * 组件的属性列表
   */
  properties: {
    file: Object
  }
```
file组件在xml页面中使用`{{file.fileName}}`即可获取到对象信息，相应的数据也会呈现在页面上
### 2.粘贴板操作
```
<image src="images/copy.png" bindtap="onCopy"></image>
```
图片点击响应方法`onCopy`，`onCopy`调用` wx.setClipboardData({})`可以将数据复制到粘贴板
```
    
    onCopy: function (event) {
      console.info(event)
      let _this = this;
      wx.setClipboardData({
        data: _this.properties.file.filePath,
        success: function(res) {
          wx.showToast({
            title: '图片地址复制成功',
          })
        }
      });

```
### 3.删除操作
```
<image src="images/del.png" bindtap="onDelete"></image>
```
子组件将数据传递给父组件，点击删除图片出发`onDelete`方法,通过`this.triggerEvent('del', {fileId}, {});`将文件ID发送到父组件
```
    onDelete: function (event) {
      console.info(event)
      let fileId = this.properties.file.id;
      this.triggerEvent('del', {fileId}, {});
    },
```
父组件file页面绑定子组件传来的`del`事件
```
<file-cmp file="{{item}}" bind:del="onDelete"></file-cmp>
```
调用`onDelete`出发网络请求去完成删除文件的逻辑,删除成功后重新刷新文件列表
```
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
        this._getFileList();
    })
},
```
# 我的页面

## 1.意见和建议
小程序自带用户反馈功能，使用`button`跳转至网页，用户可以填写相关反馈,`open-type`设置为`feedback`
```
<button class="about-btn" plain="true" open-type="feedback">
    <text class="about-btn-text">反馈建议</text>
</button>
```
## 2.小程序客服
小程序的`button`中的`open-type`拥有开放能力,在微信公众平台中启用客服功能，添加客服人员，在代码中添加`button`即可弹出客服聊天界面,`open-type`设置为`contact`
```
 <button class="about-btn" plain="true" open-type="contact" bindcontact="handleContact">
    <text class="about-btn-text">联系客服</text>
</button>
```

## 3.小程序分享
此处使用插槽,`button`中的`open-type`设置为`share`
```
<btn-cmp open-type="share">
    <image slot="img" src="images/share.png" />
</btn-cmp>
```

# 动画
[小程序动画官方文档](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createAnimation.html)  
开屏动画，设置文字透明度，从0到1，渐渐显示，主要使用到`opacity`去设置组件的透明度，先创建一个动画`animationTip`,持续800ms,然后在`setTimeout(function () {})`中设置动画出现时间
```
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
```

# 部署
1. 修改`utils`目录下的`config.apiBaseUrl`,改成自己的域名，上传到微信公众号平台，在版本管理中进行发布
```
const config ={
   apiBaseUrl: "你自己的域名或服务器地址"
}
```



