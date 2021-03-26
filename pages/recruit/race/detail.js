const app = getApp();
let id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    race:{
      type:0,
      name:'元宵答题活动',
      startTime:'2021.02.21 00:00',
      endTime:'2021.02.28 00:00',
      status:1,  //0 未开始 1 进行中 10 已结束
      userCount:23,
      openCount:23,
      finishCount:23,
      users:[
        {
          userId:1,
          nickName:'用户名1',
          avatarUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg',
          awardNum:100,
          score:100,
          answerNum:3
        },
        {
          userId:2,
          nickName:'用户名2',
          avatarUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big10002.jpg',
          awardNum:100,
          score:100,
          answerNum:3
        },
        {
          userId:3,
          nickName:'用户名3',
          avatarUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big10003.jpg',
          awardNum:100,
          score:100,
          answerNum:3
        }
      ]
    },
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
      url: `unitDetail?user=${user}&type=${this.data.race.type}`,
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
        users:res.users
      })
    })
  },

  share:function(){
    wx.navigateTo({
      url: `share?id=${id}`
    });
  }
})