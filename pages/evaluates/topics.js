const app = getApp()
Page({

  data: {
    topics: [],
    options:["A","B","C","D","E","F","G","H","I"],
  },

  onLoad: function (options) {

    const {
      index,
    } = options
    this.setData({
      index
    })
    wx.hideShareMenu();
    if (!app.globalData.token) {
      app.login((res) => {
        this.inti()
      })

    } else {
      this.inti()
    }
  },
  inti() {
    wx.getStorage({
      key: 'topics',
      success: (result) => {
        this.setData({
          topics: result.data
        })
      },
      fail: () => {},
      complete: () => {}
    });
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

  },



})