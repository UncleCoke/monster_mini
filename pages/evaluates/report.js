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

    const {
      user,
      token,
      id
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
    var index = e.currentTarget.dataset.index
    var topics = this.data.report.questionList
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
    wx.showLoading({
      title: '加载数据',
      mask: true
    })
    var options = this.data.options
    var url = app.globalData.apiUrl + '/eval/view'
    var data = {
      token: app.globalData.token,
      userId: options.user,
      userEvalId: options.id
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideNavigationBarLoading();
        wx.hideLoading()
        if (res.data.code == 0) {
          let report = res.data.data
          this.setData({
            report
          })

          setTimeout(()=> {
            this.setData({
              loading: true
            })
          }, 500)

        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            showCancel: false,
            confirmText: '好的',
            confirmColor: '#3CC51F',
            success: (result) => {
              if(result.confirm){
                this.back()
              }
            },
            fail: ()=>{},
            complete: ()=>{}
          });
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'none',
          //   duration: 2000,
          //   mask: true
          // })
        }
      },
      fail: (res) => {
        wx.hideNavigationBarLoading();
        wx.hideLoading()
      }
    })
  },
  call:function(e){
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
  back: function (e) {
    var route = getCurrentPages()
    if (route.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.switchTab({
        url: 'list'
      });
    }

  },
})