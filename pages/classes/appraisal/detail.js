const app = getApp()
let classId,studentId;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let student = JSON.parse(options.student);
    studentId = student.id;
    classId = options.classId;
    this.setData({
      date:`${options.year}-${options.month}`,
      year:options.year,
      month:options.month,
      student
    },()=>{
      this.getReport();
    })
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
    let day = new Date();
    let month = day.getMonth() + 1;
    month = month < 10?'0'+month:month
    this.setData({
      nDate: {
        date: `${day.getFullYear()}-${month}`,
        year: day.getFullYear(),
        month
      }
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
    this.getReport();
    wx.stopPullDownRefresh();
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

  dateChange: function (e) {
    let value = e.detail.value;
    let arr = value.split('-');
    this.setData({
      date: value,
      year: arr[0],
      month: arr[1]
    }, () => {
      this.getReport();
    })
  },

  getReport:function(){
    let url = app.globalData.apiUrl + '/class/behaviour/list'
    let data = {
      token: app.globalData.token,
      classId,
      studentId,
      year:Number(this.data.year),
      month:Number(this.data.month)
    }
    wx.showLoading({
      title: '正在获取',
      mask: true,
    });
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          let list = res.data.data.list;
          this.setData({
            list,
            [`student.toalScoreAdd`]:res.data.data.toalScoreAdd,
            [`student.toalScoreReduce`]:res.data.data.toalScoreReduce
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
        wx.hideLoading();
      }
    })
  }
})