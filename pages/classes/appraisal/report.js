const app = getApp()
let classId, studentId;
Page({

  data: {
    imgUrl:'http://img.uelink.com.cn/upload/xykj/classes/'
  },

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

  onPullDownRefresh: function () {
    this.getReport();
    wx.stopPullDownRefresh();
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
    app.request({
      url: '/class/behaviour/report',
      data: {
        classId,
        studentId,
        year: Number(this.data.year),
        month: Number(this.data.month)
      },
      loading:true,
      loadingTitle:'正在获取'
    }).then(res => {
      let report = res;
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
    })
  },

  gotoDetail: function () {
    wx.navigateTo({
      url: `detail?student=${JSON.stringify(this.data.student)}&classId=${classId}&year=${this.data.year}&month=${this.data.month}`
    });
  }
})