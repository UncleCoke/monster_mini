const app = getApp();
const QRCode = require('/../../utils/weapp-qrcode')
import rpx2px from '/../../utils/rpx2px.js'
let id,recruitType;
const qrCodeWidth = rpx2px(200)
Page({

  data: {
    posterIndex:0
  },

  onLoad: function (options) {
    id = options.id * 1;
    recruitType = options.recruitType*1;
    wx.hideShareMenu();
    app.checkLogin(() => {
      this.getPosterList();
      if(recruitType == 2){
        this.getRecruitDetail();
      }
    })
  },

  onReady: function () {
    this.createQrCode();
  },

  onShareAppMessage: function () {
    let title,path,shareImg;
    if(recruitType == 1){
      title = `${app.globalData.nickName}邀请你参与评测`
      path = `/pages/recruit/join?recruitId=${id}&recruitType=${recruitType}`
      shareImg = ''
    }else if(recruitType == 2){
      title = `${app.globalData.nickName}邀请你参与${this.data.eventTitle}活动`
      path = `/pages/recruit/join?recruitId=${id}&eventId=${this.data.eventId}&eventType=${this.data.eventType}&recruitType=${recruitType}`
      shareImg = `http://img.uelink.com.cn/upload/xykj/race/${this.data.eventType}.jpg`
    }else if(recruitType == 3){
      title = `${app.globalData.nickName}邀请你加入班级`
      path = `/pages/recruit/join?recruitId=${id}&recruitType=${recruitType}`
      shareImg = ''
    }
    return {
      title: title,
      path: path,
      imageUrl: shareImg
    }
  },

  posterChange: function (e) {
    let posterIndex = e.detail.current
    this.setData({
      posterIndex
    })
  },

  createQrCode: function () {
    let qrCode = new QRCode('canvas', {
      text: `https://xyfxadmin.uelink.com.cn/mp/${recruitType}/${id}`,
      image: '',
      width: qrCodeWidth,
      height: qrCodeWidth,
      colorDark: "#101010",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });

    console.log(qrCode);

    let _this = this;
    qrCode.makeCode(`https://xyfxadmin.uelink.com.cn/mp/${recruitType}/${id}`, () => {
      setTimeout(() => {
        qrCode.exportImage(function (path) {
          _this.setData({
            qrCodeUrl: path
          })
        })
      }, 200)
    })
  },

  getPosterList: function () {
    app.request({
      url: '/recruit/poster/list',
      data: {
        recruitType
      }
    }).then(res => {
      this.setData({
        posters: res.posters
      })
    })
  },

  makePoster: function () {
    wx.showLoading({
      title: '正在生成海报',
      mask: true
    });
    wx.downloadFile({
      url: this.data.posters[this.data.posterIndex].image,
      success: (res) => {
        if (res.statusCode === 200) {
          const ctx = wx.createCanvasContext("myQrCode", this)
          var scale = wx.getSystemInfoSync().windowWidth / 375
          ctx.drawImage(res.tempFilePath, 0, 0, 315 * scale, 560 * scale)
          ctx.drawImage(this.data.qrCodeUrl, 123 * scale, 430 * scale, 70 * scale, 70 * scale)
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
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => {
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
                fail: (err) => {
                  console.log(err);
                },
                complete: () => {}
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

  getRecruitDetail:function(){
    app.request({
      url:'/recruit/event/detail',
      data:{
        id
      }
    }).then(res => {
      this.setData({
        eventId:res.event.eventId,
        eventType:res.event.eventType,
        eventTitle:res.event.eventTitle
      })
    })
  },
})