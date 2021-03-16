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

  },
  onLoad: function (options) {
    var evalId = options.id
    this.setData({
      evalId
    })
    wx.hideShareMenu();
    if (!app.globalData.token) {
      app.login((res) => {
        this.inti()
      })

    } else {
      this.inti()
    }
  },
  inti() {
    this.getEvalList()
  },

  evalDetail: function (e) {
    console.log(e);
    var id = e.currentTarget.id

    wx.navigateTo({
      url: `detail?id=${id}`
    });
  },

  getEvalList: function () {

    var url = app.globalData.apiUrl + '/public/teacher/eval/reportUserList'
    var data = {
      token: app.globalData.token,
      evalId:this.data.evalId
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh()
        if (res.data.code == 0) {
          let evalData = res.data.data.eval
          let users = res.data.data.users
          this.setData({
            eval: evalData,
            users
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      },
      fail: (res) => {
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading();
      }
    })
  },
  onPullDownRefresh: function () {
    this.getEvalList()

  },
  back: function (e) {
    var route = getCurrentPages()
    if (route.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {

      wx.switchTab({
        url: 'list'
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
    var userInfo = this.data.users[index]
  wx.setStorage({
    key: 'userInfo',
    data: userInfo
  })
    wx.navigateTo({
      url: `report?id=${id}&token=${token}&user=${user}`
    });
  
  },
})