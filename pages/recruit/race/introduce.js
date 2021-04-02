const app = getApp()
let id;
Page({

  data: {},

  onLoad: function (options) {
    id = options.id;
    app.checkLogin(() => {
      this.getTemplateDetail();
    })
  },

  raceProduct: function () {
    wx.navigateTo({
      url: `product?id=${id}`
    });
  },

  showTemplate: function () {
    let eventType = this.data.event.eventType;
    let eventId = this.data.event.eventId
    let recruitId = this.data.event.id;
    wx.navigateToMiniProgram({
      appId: 'wxcfe4dc8683b0606f',
      path: `/packageB/pages/race/${eventType == 1?'index':eventType == 2?'lotteryDraw':'group'}?recruitId=${recruitId}&id=${eventId}`,
      extraData: {},
      envVersion: 'release',
      success: (result) => {},
      fail: () => {},
      complete: () => {}
    });
  },

  getTemplateDetail: function () {
    app.request({
      url: '/recruit/event/template/detail',
      data: {
        id
      },
      barLoading: true
    }).then(res => {
      this.setData({
        template: res
      }, () => {
        this.getRecruitDetail(res.demoId)
      })
    })
  },

  getRecruitDetail: function (demoId) {
    app.request({
      url: '/recruit/event/detail',
      data: {
        id: demoId
      }
    }).then(res => {
      this.setData({
        event: res.event
      })
    })
  }
})