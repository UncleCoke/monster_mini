const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    races:[
      {
        name:'答题活动',
        price:9.9,
        imgUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
      },{
        name:'组队答题活动',
        price:9.9,
        imgUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big10002.jpg'
      },{
        name:'抽奖活动',
        price:9.9,
        imgUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big10003.jpg'
      }
    ]
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

  raceIntroduce:function(){
    wx.navigateTo({
      url: 'introduce'
    });
  }
})