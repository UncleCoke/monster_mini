const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      {
        name:'元宵答题活动',
        openPeople:23,
        openNum:23,
        finishNum:23,
        created_at:'2020-02-21 12:23'
      },
      {
        name:'元宵组队答题活动',
        openPeople:23,
        openNum:23,
        finishNum:23,
        created_at:'2020-02-21 12:23'
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
    app.checkLogin(()=>{
      this.getRaces();
    })
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
    this.getRaces();
    wx.stopPullDownRefresh();
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

  getRaces:function(){},

  setUserData:function(e){
    let rawData = e.detail.rawData;
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    app.setUserData(encryptedData,iv,rawData,'','',()=>{
      wx.navigateTo({
        url: 'create'
      });
    })
  },
})