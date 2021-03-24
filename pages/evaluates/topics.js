const app = getApp()
let toIndex;
Page({

  data: {
    topics: [],
    options:["A","B","C","D","E","F","G","H","I"],
    imgUrl:'http://img.uelink.com.cn/upload/xykj/eval/'
  },

  onLoad: function (options) {
    const {
      index,
    } = options
    toIndex = index;
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
        },()=>{
          this.setData({
            index:toIndex-1
          })
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