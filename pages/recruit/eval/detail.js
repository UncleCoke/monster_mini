const app = getApp()
let evalId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eval: {},
    topics: [],
    imgUrl:'http://img.uelink.com.cn/upload/xykj/eval/',
    isShowAll:false
  },

  onLoad: function (options) {
    evalId = options.id
    wx.hideShareMenu();
    app.checkLogin(() => {
      this.getEval();
    })
  },

  onPullDownRefresh: function () {
    this.getEval();
    wx.stopPullDownRefresh();
  },


  report: function (e) {
    const {
      user,
      token,
      id,
      index
    } = e.currentTarget.dataset
    const userInfo = this.data.users[index]
    wx.setStorage({
      key: 'userInfo',
      data: userInfo
    })
    wx.navigateTo({
      url: `/pages/evaluates/report?id=${id}&token=${token}&user=${user}`
    });

  },

  reportList: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/evaluates/reportList?id=${id}`
    });
  },

  back: function (e) {
    let route = getCurrentPages()
    if (route.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.switchTab({
        url: '/pages/recruit/index'
      });
    }
  },

  share: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/recruit/share?id=${id}&recruitType=1`
    });

  },

  getEval: function () {
    app.request({
      url:'/recruit/eval/detail',
      data:{
        id:evalId
      },
      barLoading:true
    }).then(res=>{
      let evalData = res.eval
      let intiUnits = evalData.units.slice(0,2);
      let users = res.users
      this.setData({
        eval: evalData,
        users,
        intiUnits
      })
    })
  },

  setIsShowAll:function(){
    let isShowAll = this.data.isShowAll;
    this.setData({
      isShowAll:!isShowAll
    })
  }
})