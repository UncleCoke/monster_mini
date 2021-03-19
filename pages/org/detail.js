const app = getApp()
var orgId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eval: {},
    topics: []
  ,

},
onLoad: function (options) {
  orgId = options.id
  wx.hideShareMenu();
  if (!app.globalData.token) {
    app.login((res) => {
      this.inti()
    })

  } else {
    this.inti()
  }
},
inti(){
  this.setData({
    globalData:app.globalData.userInfo,
  })
  this.getOrg()
},

back:function(e){
  var route = getCurrentPages()
  if(route.length>1){
    wx.navigateBack({
      delta: 1
    });
  }else{
    wx.switchTab({
      url: '/pages/my/my'
    });
  }
  
},


getOrg:function(){

  var url = app.globalData.apiUrl + '/org/detail'
  var data = {
    token:app.globalData.token,
    orgId:orgId
  }
  wx.showNavigationBarLoading();
  wx.request({
    url: url,
    data: data,
    success: (res) => {
      wx.hideNavigationBarLoading();
      if (res.data.code == 0) {
        // console.log(res.data.data)
        let org = res.data.data.org
        let teachers = res.data.data.teachers
        this.setData({
          org,
          teachers
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
      wx.hideNavigationBarLoading();
    }
  })
},

edit:function(e){
  var id = e.currentTarget.dataset.id

  wx.navigateTo({
    url: `edit?id=${id}`
  });
},
onShareAppMessage: function (options) {
  var from = options.from
  var orgName = options.target.dataset.name
  var orgId = options.target.dataset.org
  let title = `邀请你加入${orgName}`
  let shareImg = `http://img.uelink.com.cn/upload/xykj/share/inviteTeacher.png`
  let path = `/pages/home/home?fromUserId=${app.globalData.uid}&orgId=${orgId}`
  return {
    title: title,
    path: path,
    imageUrl: shareImg
  }
},

classDetail:function(e){
  var id = e.currentTarget.dataset.id

  wx.navigateTo({
    url: `/pages/classes/classIndex?id=${id}`
  });
},
})