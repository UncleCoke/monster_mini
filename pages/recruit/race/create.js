const app = getApp();
Page({
  data: {
    list:[]
  },

  onShow: function () {
    app.checkLogin(() => {
      this.getRaceTemplate();
    })
  },

  raceIntroduce: function (e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: `introduce?id=${id}`
    });
  },

  getRaceTemplate: function () {
    app.request({
      url: '/recruit/event/template/list',
      barLoading:true
    }).then(res => {
      this.setData({
        list:res.list
      })
    })
  }
})