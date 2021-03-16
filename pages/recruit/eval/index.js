const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    imgUrl:'http://img.uelink.com.cn/upload/xykj/eval/'
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
    app.checkLogin(()=>{
      this.getEvalList();
    })
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
    this.getEvalList();
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

  getEvalList:function(){
    app.request({
      url:app.globalData.apiUrl + '/public/teacher/eval/list',
      barLoading:true
    }).then(res => {
      let list = res.list;
      this.setData({
        list
      })
    })
  },

  gotoDetail:function(e){
    console.log(e);
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/evaluates/detail?id=${id}`,
    });
  }
})