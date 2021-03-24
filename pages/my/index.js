const app = getApp()
Page({

  data: {
    imgUrl:'http://img.uelink.com.cn/upload/xykj/my/'
  },

  onLoad: function (options) {
    wx.hideShareMenu();

  },

  onShow: function () {
    app.checkLogin(() => {
      this.inti();
    })
  },

  onShareAppMessage: function (options) {
    var orgName = options.target.dataset.name
    var orgId = options.target.dataset.org
    let title = `邀请你加入${orgName}`
    let shareImg = `http://img.uelink.com.cn/upload/xykj/share/inviteTeacher.png`
    let path = `/pages/my/index?fromUserId=${app.globalData.uid}&orgId=${orgId}`
    console.log(path);
    return {
      title: title,
      path: path,
      imageUrl: shareImg
    }
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
            url: '/org/quit',
            barLoading: true
          }).then(res => {
            this.reload()
          })
        }
      },
      fail: () => {},
      complete: () => {}
    });
  },

  revenueDetail:function(){
    wx.navigateTo({
      url: 'revenue'
    });
  },

  orgDetail:function(){
    wx.navigateTo({
      url: `/pages/org/detail?id=${this.data.globalData.org.id}`
    });
  },

  revenueDetail:function(){
    wx.navigateTo({
      url: `/pages/org/revenue?id=${this.data.globalData.org.id}`
    });
  }

})