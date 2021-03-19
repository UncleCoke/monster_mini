const app = getApp()
var classId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topicOptions:["A","B","C","D","E","F","G","H","I"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    classId = options.classId
    const {
      userId,
      homeworkId
    } = options
    this.setData({
      options
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
    var options = this.data.options
    var url = app.globalData.apiUrl + '/class/homework/studentDetail'
    var data = {
      userId: options.userId,
      homeworkId: options.homeworkId,
      token:app.globalData.token
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideNavigationBarLoading();
        if (res.data.code == 0) {
          let report = res.data.data
          var knowledgeData = report.knowledgeData
          var weak = 0
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
        wx.hideNavigationBarLoading();
      }
    })
  },

  back: function (e) {
    var route = getCurrentPages()
    if (route.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.redirectTo({
        url: `../classIndex?id=${classId}`
      });
    }
  
  },
})