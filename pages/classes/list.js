const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal:false
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
      this.inti();
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
    this.getClassList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  inti:function(){
    this.setData({
      teacherId:app.globalData.uid,
      phone:app.globalData.phone
    })
    this.getClassList()
  },

  getClassList:function(){
    app.request({
      url:app.globalData.apiUrl + '/class/list',
      data:{
        teacherId:app.globalData.uid
      },
      barLoading:true
    }).then(res => {
      this.setData({
        classList:res.list
      })
    })
  },

  setUserData:function(e){
    let rawData = e.detail.rawData;
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    app.setUserData(encryptedData,iv,rawData,'','',()=>{
      this.setData({
        showModal:true
      })
    })
  },

  reload:function(){
    app.login(() => {
      this.inti();
    })
  },

  classDetail:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `classIndex?id=${id}`
    });
  },

  createClass:function(){
    wx.navigateTo({
      url: 'create'
    });
  }
})