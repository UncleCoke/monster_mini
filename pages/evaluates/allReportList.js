const app = getApp()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    load: true
  },
  onLoad: function (options) {
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
    this.getEvalList()
  },

  evalDetail:function(e){
    console.log(e);
    var id = e.currentTarget.id

    wx.navigateTo({
      url: `detail?id=${id}`
    });
  },
  createEval:function(e){
    wx.navigateTo({
      url: '/pages/evaluates/create',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  getEvalList:function(){

    var url = app.globalData.apiUrl + '/public/teacher/eval/reportList'
    var data = {
      token:app.globalData.token,
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh()
        if (res.data.code == 0) {
          console.log(res.data.data)
          var list = res.data.data.list
          this.setData({
            list
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
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading();
      }
    })
  },
  onPullDownRefresh: function () {
    this.getEvalList()

  },
  back:function(e){
    var route = getCurrentPages()
    if(route.length>1){
      wx.navigateBack({
        delta: 1
      });
    }else{
      
      wx.switchTab({
        url: 'list'
      });
    }
    
  },
  report: function (e) {
    const {
      user,
      token,
      id,
      index,
      userindex
    } = e.currentTarget.dataset
    var userInfo = this.data.list[index].users[userindex]
    wx.setStorage({
      key: 'userInfo',
      data: userInfo
    })
    wx.navigateTo({
      url: `report?id=${id}&token=${token}&user=${user}`
    });
  
  },
  reportList:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `reportList?id=${id}`
    });
  },
  
})