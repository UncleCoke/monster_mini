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
      url: `report?id=${id}&token=${token}&user=${user}`
    });

  },

  reportList: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `reportList?id=${id}`
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
      url: `share?id=${id}&subject=${this.data.eval.subject}&textbook=${this.data.eval.textbook}`
    });

  },

  getEval: function () {
    app.request({
      url:app.globalData.apiUrl + '/public/teacher/eval/detail',
      data:{
        evalId
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