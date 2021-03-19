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
    app.checkLogin(()=>{
      this.inti();
    })
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
    let route = getCurrentPages()
    if (route.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.switchTab({
        url: '/pages/recruit/index'
      });
    }
  },
})