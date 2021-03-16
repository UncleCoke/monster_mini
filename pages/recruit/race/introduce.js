const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    race:{
      name:'答题活动',
      price:9.9,
      imgUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg',
      introduce:'用户每天可参与一次答题活动，答题完成后分数进行累积，当天答题次数用完后，可邀请好友参加活动，邀请人会等额获得好友答题获得的金币或红包奖励，以此类推，一天最多邀请30名好友参与活动。',
      result:'用户在第一次参加活动时，系统就会请求获取用户手机号码，可通过电话营销方式跟进用户',
      award:'用户在第一次参加活动时，系统就会请求获取用户手机号码，可通过电话营销方式跟进用户'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  raceProduct:function(){
    wx.navigateTo({
      url: 'product'
    });
  },

  showTemplate:function(){
    
  }
})