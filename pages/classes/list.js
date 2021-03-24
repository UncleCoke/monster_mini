const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'http://img.uelink.com.cn/upload/xykj/classes/'
  },

  onLoad: function (options) {
    wx.hideShareMenu();
  },

  onPullDownRefresh: function () {
    this.getClassList()
    wx.stopPullDownRefresh();
  },

  onShow: function () {
    app.checkLogin(()=>{
      this.inti();
    })
  },

  inti: function () {
    this.setData({
      teacherId:app.globalData.uid,
      phone:app.globalData.phone,
      showModal:false
    })
    this.getClassList()
  },

  classDetail:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `classIndex?id=${id}`
    });
  },

  createClass:function(e){
    wx.navigateTo({
      url: 'create'
    });
  },

  getClassList: function () {
    app.request({
      url:'/class/list',
      data:{
        teacherId: app.globalData.uid
      },
      barLoading:true
    }).then(res => {
      let classList = res.list
      let allStudentCount = res.allStudentCount
      this.setData({
        classList,allStudentCount
      })
    })
  },

  setUserData:function(e){
    let rawData = e.detail.rawData
    let encryptedData = e.detail.encryptedData
    let iv = e.detail.iv
    app.setUserData(encryptedData,iv,rawData,'','',()=>{
      this.setData({
        showModal:true
      })
    })
  },

  reload:function(){
    app.login((res) => {
      this.inti()
    })
  }
})