const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    revenue:123456,
    list:[
      {
        id:172,
        name:'哈比',
        grade:'三年级',
        masterName:'李四',
        classLogo:'',
        price:888
      },
      {
        id:174,
        name:'哈比',
        grade:'三年级',
        masterName:'李四',
        classLogo:'https://thirdwx.qlogo.cn/mmopen/vi_32/hOibRpfJBjCZPIjUpXHMfSECtuoCr2ic4MQo1fNRu3bnaUhkrV4B7jdBB1QqbgK21IPibNyQRuoIiag8ESzlorqiaqg/132',
        price:888
      }
    ],
    date:'2021-03'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  classDetail:function(e){
    let classes = e.currentTarget.dataset.classes;
    wx.navigateTo({
      url: `classRevenue?classId=${classes.id}&className=${classes.name}&date=${this.data.date}`,
    });
  }
})