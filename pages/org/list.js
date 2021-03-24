const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'http://img.uelink.com.cn/upload/xykj/'
  },

  onLoad: function (options) {
    wx.hideShareMenu();
  },

  onPullDownRefresh: function () {
    this.getOrgList()
    wx.stopPullDownRefresh();
  },

  onShow: function () {
    app.checkLogin(()=>{
      this.inti();
    })
  },

  inti: function () {
    /*let isAdmin = app.globalData.isAdmin
    if(!isAdmin){
      wx.showModal({
        title: '提示',
        content: '无管理权限',
        showCancel: false,
        confirmText: '返回',
        confirmColor: '#e54d42',
        success: (result) => {
          if(result.confirm){
            wx.switchTab({
              url: '/pages/my/index'
            });
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      return
    }
    this.setData({
      teacherId:app.globalData.uid,
      phone:app.globalData.phone,
    })*/
    this.getOrgList()
  },

  orgDetail:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `detail?id=${id}`
    });
  },

  edit:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `edit?id=${id}`
    });
  },

  createClass:function(e){
    wx.navigateTo({
      url: 'create'
    });
  },

  getOrgList: function () {
    app.request({
      url:'/org/list',
      barLoading:true
    }).then(res => {
      let orgList = res.list
      this.setData({
        orgList
      })
    })
  },

  onShareAppMessage: function (options) {
    let orgName = options.target.dataset.name
    let orgId = options.target.dataset.org
    let title = `邀请你加入${orgName}`
    let shareImg = `http://img.uelink.com.cn/upload/xykj/share/inviteTeacher.png`
    let path = `/pages/my/index?fromUserId=${app.globalData.uid}&orgId=${orgId}`
    console.log(path);
    return {
      title: title,
      path: path,
      imageUrl: shareImg
    }
  },
})