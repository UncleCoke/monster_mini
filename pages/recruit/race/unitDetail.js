const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:2,
    user:{
      userId:1,
      nickName:'用户名1',
      avatarUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg',
      awardNum:100,
      score:100,
      answerNum:3,
      list:[
        {
          score:70,
          created_at:'2020-02-21 12:23'
        },{
          score:60,
          created_at:'2020-02-21 12:23'
        }
      ]
    },
    awards:[
      {
        title:'一等奖',
        awardName:'好多钱',
        getTime:'2020-02-21 12:23'
      },
      {
        title:'二等奖',
        awardName:'好多金币',
        getTime:'2020-02-21 12:23'
      },
    ],
    group:{
      groupName:'无敌风火轮',
      score:100,
      answerNum:3,
      members:[
        {
          userId:1,
          trueName:'昵称1',
          avatarUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
        },
        {
          userId:2,
          trueName:'昵称2',
          avatarUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
        },
        {
          userId:3,
          trueName:'昵称3',
          avatarUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
        }
      ],
      list:[
        {
          name:'昵称1',
          score:70,
          created_at:'2020-02-21 12:23'
        },
        {
          name:'昵称1',
          score:60,
          created_at:'2020-02-21 12:23'
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

  }
})