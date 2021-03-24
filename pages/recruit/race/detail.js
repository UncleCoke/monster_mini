const app = getApp();
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

  unitDetail:function(e){
    let user = e.currentTarget.dataset.user;
    wx.navigateTo({
      url: `unitDetail?user=${user}&type=${this.data.race.type}`,
    });
  }
})