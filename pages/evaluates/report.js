const app = getApp()
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
    this.setData({
      options
    })
    app.checkLogin(()=>{
      this.inti();
    })
  },

  inti() {
    let user = wx.getStorageSync('userInfo');
    this.setData({
      user
    })
    this.getReport()
  },

  viewTopic: function (e) {
    let index = e.currentTarget.dataset.index
    let topics = this.data.report.questionList
    wx.setStorage({
      key: 'topics',
      data: topics,
      success: (result)=>{
        wx.navigateTo({
          url: `topics?index=${index}`
        });
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  getReport: function () {
    let options = this.data.options
    app.request({
      url:'/eval/view',
      data:{
        userId: options.user,
        userEvalId: options.id
      },
      barLoading:true,
      loading:true,
      loadingTitle:'加载数据'
    }).then(res => {
      let report = res;
      this.setData({
        report
      })
      setTimeout(()=> {
        this.setData({
          loading: true
        })
      }, 500)
    })
  },

  call:function(e){
    let phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },

  back: function (e) {
    let route = getCurrentPages()
    if (route.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.switchTab({
        url: '/pages/recruit/index'
      });
    }
  },
})