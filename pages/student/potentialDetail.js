const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{
      nickName:'野原新之助',
      phone:'17608437288',
      from:2,  //1活动  2评测 3班级
      status:1, //1待跟进 2跟进中 3已报名 4无效用户
      degree:'低',
      records:[
        {
          id:1,
          teacherName:'野原广志',
          status:2,
          action:1, //1电话 2微信 3邮件
          content:'跟进信息跟进信息跟进信息跟进信息跟进信息跟进信息跟进信息跟进信息。',
          created_at:'2020.02.23 16:23'
        },
        {
          id:2,
          teacherName:'野原广志',
          status:3,
          action:2, //1电话 2微信 3邮件
          content:'跟进信息跟进信息跟进信息跟进信息跟进信息跟进信息跟进信息跟进信息。',
          created_at:'2020.02.23 16:23'
        },
        {
          id:3,
          teacherName:'野原广志',
          status:4,
          action:3, //1电话 2微信 3邮件
          content:'跟进信息跟进信息跟进信息跟进信息跟进信息跟进信息跟进信息跟进信息。',
          created_at:'2020.02.23 16:23'
        }
      ]
    },
    imgUrl:'http://img.uelink.com.cn/upload/xykj/student/',
    statusList:[
      {
        status:1,
        title:'待跟进',
        color:'text-yellow'
      },
      {
        status:2,
        title:'跟进中',
        color:'text-yellow'
      },
      {
        status:3,
        title:'已报名',
        color:'text-green'
      },
      {
        status:4,
        title:'无效用户',
        color:'text-red'
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

  call:function(){
    wx.makePhoneCall({
      phoneNumber:this.data.info.phone
    });
  },

  follow:function(){
    wx.navigateTo({
      url: 'follow'
    });
  }
})