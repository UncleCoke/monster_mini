const app = getApp()
let homeworkId,classId

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'http://img.uelink.com.cn/upload/xykj/poster/'
  },


  onLoad: function (options) {
    homeworkId = options.homeworkId
    classId = options.classId
    let mode= options.mode
    this.setData({
      mode
    })
    app.checkLogin(()=>{
      this.inti();
    })
    wx.hideShareMenu();
    console.log(homeworkId,classId);
  },

  inti(){
    this.setData({
      nickName:app.globalData.nickName
    })
  },  

  gotoHomework:function(){
    wx.navigateToMiniProgram({
      appId:'wxcfe4dc8683b0606f',
      path:`/packageB/pages/class/indexByStudent?classmateId=${classId}&homeworkId=${homeworkId}`,
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