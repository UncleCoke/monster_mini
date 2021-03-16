const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  onLoad: function (options) {
    var evalId = options.evalId || 1
    this.setData({
      evalId,
    })
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
      nickName:app.globalData.nickName
    })
  },
  

  gotoEval:function(){
    wx.navigateToMiniProgram({
      appId:'wxcfe4dc8683b0606f',
      path:`/packageB/pages/eval/info?evalId=${this.data.evalId}`,
      extraData:{},
      envVersion:'release',
      success: (result)=>{
        if(this.data.nickName){
          wx.switchTab({
            url: '/pages/home/home',
          });
        }
        
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
})