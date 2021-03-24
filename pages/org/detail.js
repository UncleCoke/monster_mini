const app = getApp()
let orgId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'http://img.uelink.com.cn/upload/xykj/'
  },

  onLoad: function (options) {
    orgId = options.id
    wx.hideShareMenu();
    app.checkLogin(()=>{
      this.inti();
    })
  },

  inti() {
    this.setData({
      globalData: app.globalData.userInfo,
    })
    this.getOrg()
  },

  back: function (e) {
    let route = getCurrentPages()
    if (route.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.switchTab({
        url: '/pages/my/index'
      });
    }
  },

  getOrg: function () {
    app.request({
      url:'/org/detail',
      data:{
        orgId
      },
      barLoading:true
    }).then(res => {
      let org = res.org
      let teachers = res.teachers
      this.setData({
        org,
        teachers
      })
    })
  },

  edit: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `edit?id=${id}`
    });
  },

  onShareAppMessage: function (options) {
    let orgName = options.target.dataset.name
    let orgId = options.target.dataset.org
    let title = `邀请你加入${orgName}`
    let shareImg = `http://img.uelink.com.cn/upload/xykj/share/inviteTeacher.png`
    let path = `/pages/home/home?fromUserId=${app.globalData.uid}&orgId=${orgId}`
    return {
      title: title,
      path: path,
      imageUrl: shareImg
    }
  },

  classDetail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/classes/classIndex?id=${id}`
    });
  },
})