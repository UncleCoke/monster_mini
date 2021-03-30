const app = getApp();
let recruitType,recruitId
Page({

  data: {
    imgUrl:'http://img.uelink.com.cn/upload/xykj/race/'
  },

  onLoad: function (options) {
    recruitId = options.recruitId*1;
    recruitType = options.recruitType*1;

    eventType = options.eventType*1;
    this.setData({
      eventType
    })
  },

  gotoRace:function(){
    wx.navigateToMiniProgram({
      appId:'wxcfe4dc8683b0606f',
      path:`/packageB/pages/race/${eventType == 1?'index':eventType == 2?'lotteryDraw':'group'}?recruitId=${recruitId}&id=${id}`,
      extraData:{},
      envVersion:'release',
      success: (result)=>{},
      fail: ()=>{},
      complete: ()=>{}
    });
  },
})