const app = getApp()
var subject,textbook
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventImgUrl: app.globalData.fileUrl + '/static/UI/poster/',
    posters: ['poster_1.png', 'poster_2.png', 'poster_3.png'],
    posterIndex: 0,
    myQrCode: '/images/shareQrcode.png'
  },

  onLoad: function (options) {
    let evalId = options.id
    subject = options.subject
    textbook = options.textbook
    this.setData({
      evalId
    })

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })

    app.checkLogin(() => {
      this.getMyQrCode()
    })
  },


  onShareAppMessage: function () {
    let title = `邀请你做${textbook}${subject}评测`
    let path = `/pages/evaluates/doEval?evalId=${this.data.evalId}`
    let shareImg = `/images/shaer.eval.png`
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
      pagePath: 'packageB/pages/eval/info',
      scene_str: `eval_${this.data.evalId}`
    }
    wx.request({
      url: url,
      method: "GET",
      data: data,
      success: (res) => {
        if (res.data.code == 0) {
          var myQrCode = res.data.data.url[0]
          wx.downloadFile({
            url: myQrCode,
            success: (res) => {
              if (res.statusCode === 200) {
                this.setData({
                  myQrCodeTemp: res.tempFilePath
                })
              }
            }
          })
          this.setData({
            myQrCode
          })
        }
      },
      fail: (res) => {}
    })
  },

  makePoster: function () {
    wx.showLoading({
      title: '正在生成海报',
      mask: true
    });
    wx.downloadFile({
      url: this.data.eventImgUrl + this.data.posters[this.data.posterIndex],
      success: (res) => {
        if (res.statusCode === 200) {
          const ctx = wx.createCanvasContext("myQrCode", this)
          var scale = wx.getSystemInfoSync().windowWidth / 375
          ctx.drawImage(res.tempFilePath, 0, 0, 315 * scale, 560 * scale)
          ctx.drawImage(this.data.myQrCodeTemp, 123 * scale, 430 * scale, 70 * scale, 70 * scale)
          ctx.draw()
          setTimeout(() => {
            this.downloadPosterImg()
          }, 1500);
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '生成海报发生错误，请重试',
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

  downloadPosterImg: function () {
    wx.hideLoading();
    wx.showLoading({
      title: '正在下载海报',
      mask: true
    });
    wx.canvasToTempFilePath({
      canvasId: 'myQrCode',
      destWidth: 720,
      destHeight: 1280,
      success: (result) => {
        wx.hideLoading();
        wx.saveImageToPhotosAlbum({
          filePath: result.tempFilePath,
          success: () => {
            wx.showToast({
              title: '下载成功',
              icon: 'success',
              duration: 1500,
              mask: false
            });
          },
          fail: (err) => {
            console.log(err)
            if(err.errMsg === "saveImageToPhotosAlbum:fail auth deny"){
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: ()=>{
                  wx.saveImageToPhotosAlbum({
                    filePath: result.tempFilePath,
                    success: () => {
                      wx.showToast({
                        title: '下载成功',
                        icon: 'success',
                        duration: 1500,
                        mask: false
                      });
                    },
                    fail: (err) => {
                      console.log(err)
                    },
                    complete: () => {}
                  });
                },
                fail: (err)=>{
                  console.log(err);
                },
                complete: ()=>{}
              });
            }
          },
          complete: () => {}
        });

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
      complete: () => {}
    }, this);
  },

  back: function (e) {
    let route = getCurrentPages()
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