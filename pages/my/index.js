const app = getApp()
Page({

  data: {

  },

  onLoad: function (options) {
    wx.hideShareMenu();

  },

  onShow: function () {
    app.checkLogin(() => {
      this.inti();
    })
  },

  inti: function () {
    this.setData({
      globalData: app.globalData.userInfo,
      showModal: false,
    })
  },

  setUserData: function (e) {
    let rawData = e.detail.rawData
    let encryptedData = e.detail.encryptedData
    let iv = e.detail.iv
    app.setUserData(encryptedData, iv, rawData, '', '', () => {
      this.setData({
        showModal: true
      })
    })
  },

  reload: function () {
    app.login((res) => {
      this.inti()
    })
  },

  orgList: function () {
    wx.navigateTo({
      url: '/pages/org/list'
    });
  },

  quitOrg: function () {
    wx.showModal({
      title: '温馨提醒',
      content: '退出后您所创建的班级也将退出机构',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          app.request({
            url: app.globalData.apiUrl + '/org/quit',
            barLoading: true
          }).then(res => {
            this.reload()
          })
        }
      },
      fail: () => {},
      complete: () => {}
    });
  }

})