const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recruits: [{
        title: '评测招生',
        introduce: '洞悉用户学习薄弱点，线上线下双引流',
        bgColor: 'bg-blue',
        bgImgUrl: 'http://img.uelink.com.cn/upload/xykj/bg_eval.png',
        url: 'eval/index'
      },
      {
        title: '活动招生',
        introduce: '通过活动奖品实现用户自然裂变引流',
        bgColor: 'bg-green',
        bgImgUrl: 'http://img.uelink.com.cn/upload/xykj/bg_race.png',
        url: 'race/index'
      },
      {
        title: '班级招生',
        introduce: '组建线上服务体验班，引流线上转线下',
        bgColor: 'bg-yellow',
        bgImgUrl: 'http://img.uelink.com.cn/upload/xykj/bg_class.png',
        url: '/pages/classes/create'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.checkLogin(() => {
      this.setData({
        globalData: app.globalData.userInfo
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  userLogin: function (e) {
    let url = e.currentTarget.dataset.url;
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      return
    }
    let rawData = e.detail.rawData
    let encryptedData = e.detail.encryptedData
    let iv = e.detail.iv
    app.setUserData(encryptedData, iv, rawData, '', '', () => {
      if (url) {
        wx.navigateTo({
          url
        });
      }
    })
  }
})