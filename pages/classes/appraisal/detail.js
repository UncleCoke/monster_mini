const app = getApp()
let classId,studentId;
Page({

  data: {
    imgUrl:'http://img.uelink.com.cn/upload/xykj/classes/'
  },

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

  getReport:function(){
    app.request({
      url:'/class/behaviour/list',
      data:{
        classId,
        studentId,
        year:Number(this.data.year),
        month:Number(this.data.month)
      },
      loading:true,
      loadingTitle:'正在获取'
    }).then(res => {
      let list = res.list;
      this.setData({
        list,
        [`student.toalScoreAdd`]:res.toalScoreAdd,
        [`student.toalScoreReduce`]:res.toalScoreReduce
      })
    })
  }
})