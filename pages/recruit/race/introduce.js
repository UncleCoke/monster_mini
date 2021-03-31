const app = getApp()
let id;
Page({

  data: {
  },

  onLoad: function (options) {
    id = options.id;
    app.checkLogin(()=>{
      this.getTemplateDetail();
    })
  },

  raceProduct:function(){
    wx.navigateTo({
      url: `product?id=${id}`
    });
  },

  showTemplate:function(){
    let eventType = this.data.template.eventType;
    //答题 17  抽奖 16 组队 12
    let recruitId = eventType == 1?17:eventType == 2?16:12
    app.request({
      url:'/recruit/event/detail',
      data:{
        id:recruitId
      }
    }).then(res => {
      let id = res.event.eventId;
      wx.navigateToMiniProgram({
        appId:'wxcfe4dc8683b0606f',
        path:`/packageB/pages/race/${eventType == 1?'index':eventType == 2?'lotteryDraw':'group'}?recruitId=${recruitId}&id=${id}`,
        extraData:{},
        envVersion:'release',
        success: (result)=>{},
        fail: ()=>{},
        complete: ()=>{}
      });
    })
  },

  getTemplateDetail:function(){
    app.request({
      url:'/recruit/event/template/detail',
      data:{
        id
      },
      barLoading:true
    }).then(res =>{
      this.setData({
        template:res
      })
    })
  },

  
})