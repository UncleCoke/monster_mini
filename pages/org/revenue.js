const app = getApp()
Page({

  data: {
    orderList:[],
    totalFee:0
  },

  onShow: function () {
    app.checkLogin(() => {
      this.getInCome()
    })
  },

  classDetail: function (e) {
    let classes = e.currentTarget.dataset.classes;
    wx.navigateTo({
      url: `classRevenue?classId=${classes.id}&className=${classes.name}&date=${this.data.date}`,
    });
  },

  getInCome: function () {
    let url = '/income/org';
    let data = {
      orgId: app.globalData.orgId
    }
    app.request({
      url,
      data
    }).then(res => {
      let orderList = res.orderList;
      let totalFee = 0;
      orderList.forEach(item => {
        totalFee = totalFee + item.totalFee;
      })
      this.setData({
        totalFee,orderList
      })
    })
  }
})