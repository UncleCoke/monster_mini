const app = getApp()
let classId
Page({

  data: {
    topicOptions:["A","B","C","D","E","F","G","H","I"],
  },

  onLoad: function (options) {
    classId = options.classId
    this.setData({
      options
    })
    wx.hideShareMenu();
    app.checkLogin(()=>{
      this.inti();
    })
  },

  inti() {
    var user = wx.getStorageSync('userInfo');
    this.setData({
      user
    })
    this.getReport()
  },

  viewTopic: function (e) {
    // var index = e.currentTarget.dataset.index
    // var topics = this.data.report.questionList
    // wx.setStorage({
    //   key: 'topics',
    //   data: topics,
    //   success: (result)=>{
    //     wx.navigateTo({
    //       url: `topics?index=${index}&classId=${classId}`
    //     });
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // });
  },

  getReport: function () {
    let options = this.data.options
    app.request({
      url:'/class/homework/studentDetail',
      data:{
        userId: options.userId,
        homeworkId: options.homeworkId,
        token:app.globalData.token
      },
      barLoading:true
    }).then(res => {
      let report = res
      let knowledgeData = report.knowledgeData
      let weak = 0
      knowledgeData.forEach(element => {
        if(element.tips == '待提高'){
          weak++
        }
      });
      this.setData({
        report,
        weak
      })
      setTimeout(()=> {
        this.setData({
          loading: true
        })
      }, 500)
    })
  },

  back: function (e) {
    let route = getCurrentPages()
    if (route.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.redirectTo({
        url: `../classIndex?id=${classId}`
      });
    }
  }
})