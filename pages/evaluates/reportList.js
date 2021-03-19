const app = getApp()
Page({
  data: {
    reportList: {
      id: 1,
      created_at: '2020-11-11 12:33',
      subject: '语文',
      textbook: "三年级上册",
      evalType: '期末测评', //期中/单元
      evalRange: 1, //1:"个人评测"2:班级评测,
      evalPurpose: '推广',
      finishCount: 11,
      openCount: 511,
      userCount: 111,
      topicsCount: 20,
    },
    list: [],
    imgUrl:'http://img.uelink.com.cn/upload/xykj/eval/'
  },

  onLoad: function (options) {
    var evalId = options.id
    this.setData({
      evalId
    })
    app.checkLogin(() => {
      this.getEvalList()
    })
  },

  getEvalList: function () {
    app.request({
      url:app.globalData.apiUrl + '/public/teacher/eval/reportUserList',
      data:{
        evalId: this.data.evalId
      },
      barLoading:true
    }).then(res => {
      let evalData = res.eval
      let users = res.users
      this.setData({
        eval: evalData,
        users
      })
    })
  },

  onPullDownRefresh: function () {
    this.getEvalList()
    wx.stopPullDownRefresh();
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

  report: function (e) {
    const {
      user,
      token,
      id,
      index
    } = e.currentTarget.dataset
    let userInfo = this.data.users[index]
    wx.setStorage({
      key: 'userInfo',
      data: userInfo
    })
    wx.navigateTo({
      url: `report?id=${id}&token=${token}&user=${user}`
    });
  },
})