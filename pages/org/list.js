const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  

  onLoad: function (options) {
    wx.hideShareMenu();
    
  },
  onPullDownRefresh: function () {
    this.getOrgList()

  },
  onShow: function () {
    

    if (!app.globalData.token) {
      app.login((res) => {
        this.inti()
      })

    } else {
      this.inti()
    }
  },
  inti: function () {
    var isAdmin = app.globalData.isAdmin
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
              url: '/pages/my/my'
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
      showModal:false
    })
    this.getOrgList()
  },

  orgDetail:function(e){
    var id = e.currentTarget.dataset.id

    wx.navigateTo({
      url: `detail?id=${id}`
    });
  },

  edit:function(e){
    var id = e.currentTarget.dataset.id
  
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
    var url = app.globalData.apiUrl + '/org/list'
    var data = {
      token: app.globalData.token,
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh()
        if (res.data.code == 0) {
          let orgList = res.data.data.list
          this.setData({
            orgList
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      },
      fail: (res) => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  onShareAppMessage: function (options) {
    var from = options.from
    var orgName = options.target.dataset.name
    var orgId = options.target.dataset.org
    let title = `邀请你加入${orgName}`
    let shareImg = `http://img.uelink.com.cn/upload/xykj/share/inviteTeacher.png`
    let path = `/pages/home/home?fromUserId=${app.globalData.uid}&orgId=${orgId}`
    console.log(path);
    return {
      title: title,
      path: path,
      imageUrl: shareImg
    }
  },
})