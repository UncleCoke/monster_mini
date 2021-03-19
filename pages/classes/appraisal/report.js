const app = getApp()
let classId, studentId;
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
      date: `${options.year}-${options.month}`,
      year: options.year,
      month: options.month,
      student
    }, () => {
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
    month = month < 10 ? '0' + month : month
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

  getReport: function () {
    let url = app.globalData.apiUrl + '/class/behaviour/report'
    let data = {
      token: app.globalData.token,
      classId,
      studentId,
      year: Number(this.data.year),
      month: Number(this.data.month)
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
          let report = res.data.data;
          let scoreAddList = report.scoreAddList;
          let scoreReduceList = report.scoreReduceList;
          let list = JSON.parse(JSON.stringify(scoreAddList));
          let reduces = scoreReduceList.map(item => item.sort);
          list.forEach(item => {
            let index = reduces.indexOf(item.sort);
            if (index > -1) {
              item['reduce'] = scoreReduceList[index].score;
            } else {
              item['reduce'] = 0;
            }
          })
          this.setData({
            report,
            list,
            [`student.toalScoreAdd`]: report.toalScoreAdd,
            [`student.toalScoreReduce`]: report.toalScoreReduce
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
  },

  gotoDetail: function () {
    wx.navigateTo({
      url: `detail?student=${JSON.stringify(this.data.student)}&classId=${classId}&year=${this.data.year}&month=${this.data.month}`
    });
  },
})