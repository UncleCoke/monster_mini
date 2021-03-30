const app = getApp()
let classId
Page({

  data: {
    topics: [],
    options:["A","B","C","D","E","F","G","H","I"],
  },

  onLoad: function (options) {
    classId = options.classId
    wx.hideShareMenu();
    app.checkLogin(()=>{
      this.inti()
    })
  },

  inti() {
    wx.getStorage({
      key: 'allTopic',
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
      wx.redirectTo({
        url: `../classIndex?id=${classId}`
      });
    }
  
  },



})