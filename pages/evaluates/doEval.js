const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'http://img.uelink.com.cn/upload/xykj/poster/'
  },


  onLoad: function (options) {
    let evalId = options.evalId || 1
    this.setData({
      evalId,
    })
    wx.hideShareMenu();
    app.checkLogin(()=>{
      this.inti();
    })
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