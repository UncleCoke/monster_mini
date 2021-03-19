const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myQrCode: '/images/shareQrcode.png'
  },

  onLoad: function (options) {
    var evalId = options.id
    this.setData({
      evalId
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
    if (!app.globalData.token) {
      app.login((res) => {
        this.inti()
      })

    } else {
      this.inti()
    }
  },
  inti() {
    this.getMyQrCode()
  },

  onShareAppMessage: function () {
    let title = `邀请你使用小优评测`
    let path = `/pages/evaluates/doEval?evalId=${this.data.evalId}`
    let shareImg = `/images/share.png`
    return {
      title: title,
      path: path,
      imageUrl: shareImg
    }
  },

  getMyQrCode: function () {
    var url = 'https://fxb2api.uelink.com.cn/fxbapi/redpackage/qrcode'
    var data = {
      token: "82f27632f49049558126b87545b05f3c",
      userId: 1091,
      pagePath: 'pages/login/login',
      scene_str: `eval_${this.data.evalId}`
    }
    wx.request({
      url: url,
      method: "GET",
      data: data,
      success: (res) => {
        if (res.data.code == 0) {
          var myQrCode = res.data.data.url[0]
          this.setData({
            myQrCode
          })
        }
      },
      fail: (res) => {}
    })
  },

  downloadImg: function () {
    wx.showLoading({
      title: '正在下载',
      mask: true
    });

    var myQrCode = this.data.myQrCode
    wx.downloadFile({
      url: myQrCode,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.hideLoading();
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              wx.showToast({
                title: '下载成功',
                icon: 'success',
                duration: 1500,
                mask: false
              });
            },
            fail: () => {},
            complete: () => {}
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '下载海报发生错误，请重试',
          showCancel: false,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '好的',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {

            }
          }
        });
      },
    })
  },

  back: function (e) {
    var route = getCurrentPages()
    if (route.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.switchTab({
        url: 'list'
      });
    }

  }


})