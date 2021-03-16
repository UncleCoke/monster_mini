const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    showModal:false,

  },
  onLoad: function (options) {
    wx.hideShareMenu();
    
  },
  onShow:function(){
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
      phone:app.globalData.phone,
      showModal:false
    })
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

    var url = app.globalData.apiUrl + '/public/teacher/eval/list'
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
  setUserData:function(e){
    let rawData = e.detail.rawData
    let nickName = e.detail.userInfo.nickName
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