const app = getApp();
let id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'http://img.uelink.com.cn/upload/xykj/'
  },

  onLoad: function (options) {
    id = options.id;
    app.checkLogin(()=>{
      this.getRecruitDetail();
    })
  },

  unitDetail:function(e){
    let user = e.currentTarget.dataset.user;
    wx.navigateTo({
      url: `unitDetail?user=${JSON.stringify(user)}&type=${this.data.event.eventType}`,
    });
  },

  getRecruitDetail:function(){
    app.request({
      url:'/recruit/event/detail',
      data:{
        id
      }
    }).then(res => {
      this.setData({
        event:res.event,
        users:res.users,
        teams:res.teams
      })
    })
  },

  share:function(){
    wx.navigateTo({
      url: `/pages/recruit/share?id=${id}&recruitType=2`
    });
  }
})