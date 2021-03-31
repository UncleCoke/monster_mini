const app = getApp();
let recruitType,recruitId,eventType
Page({

  data: {
    imgUrl:'http://img.uelink.com.cn/upload/xykj/race/1.jpg'
  },

  onLoad: function (options) {
    recruitId = options.recruitId*1;
    recruitType = options.recruitType*1;
    eventType = options.eventType*1 || 1;
    this.setImgUrl();
  },

  gotoRace:function(){
    let path;
    if(recruitType == 1){
      path = `/packageB/pages/eval/recruit?recruitId=${recruitId}`
    }else if(recruitType == 2){
      path = `/packageB/pages/race/${eventType == 1?'index':eventType == 2?'lotteryDraw':'group'}?recruitId=${recruitId}&id=${id}`
    }else if(recruitType == 3){
      path = `/pages/home/index?joinMode=student&classmateId=${recruitId}`
    }
    wx.navigateToMiniProgram({
      appId:'wxcfe4dc8683b0606f',
      path,
      extraData:{},
      envVersion:'release',
      success: (result)=>{},
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  setImgUrl:function(){
    let imgUrl;
    if(recruitType == 1){
      imgUrl = 'http://img.uelink.com.cn/upload/xykj/poster/eval.png'
    }else if(recruitType == 3){
      imgUrl = 'http://img.uelink.com.cn/upload/xykj/poster/inviteStudent.png'
    }else{
      imgUrl = `http://img.uelink.com.cn/upload/xykj/race/${eventType}.jpg`
    }
    this.setData({
      imgUrl
    })
  }
})