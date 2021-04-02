const app = getApp();
let id;
Page({

  data: {
    imgUrl:'http://img.uelink.com.cn/upload/xykj/',
    tabs:['获客记录','参与情况'],
    activeIndex:0,
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
        teams:res.teams,
        clients:res.clients
      })
    })
  },

  share:function(){
    wx.navigateTo({
      url: `/pages/recruit/share?id=${id}&recruitType=2`
    });
  },

  back:function(){
    let route = getCurrentPages()
    if(route.length>1){
      wx.navigateBack({
        delta: 1
      });
    }else{
      wx.switchTab({
        url: '/pages/recruit/index'
      });
    }
  },

  tabSelect:function(e){
    let activeIndex = e.currentTarget.dataset.index;
    this.setData({
      activeIndex
    })
  },

  potentialDetail:function(e){
    let {id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/student/potentialDetail?id=${id}`
    });
  }
})