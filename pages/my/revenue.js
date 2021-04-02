const app = getApp()
Page({

  data: {
    orderList:[],
    totalFee:0
  },

  onLoad: function (options) {
    app.checkLogin(()=>{
      this.getInCome();
    })
  },

  getInCome:function(){
    let url = '/income/teacher',data = {};
    app.request({
      url,data
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