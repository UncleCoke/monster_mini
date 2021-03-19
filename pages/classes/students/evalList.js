const app = getApp()
var  page, pageCount = 1,pageSize = 20
var userId, classId,subject,token;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    loadMore: true,
    recordCount:0,

  },
  onLoad: function (options) {
    wx.hideShareMenu();
    userId = options.userId
    token =  options.token
    classId =  options.classId
    subject = options.subject

    wx.setNavigationBarTitle({
      title: `${subject}-评测记录`
    });

    if (!app.globalData.token) {
      app.login((res) => {
        this.inti()
      })
  
    } else {
      this.inti()
    }
  },
  inti(){
    page = 1
    var user = wx.getStorageSync('userInfo');
    
    this.setData({
      user
    })
    this.getHomeworkList(page)
  },
  onPullDownRefresh: function () {
    page = 1
    this.getHomeworkList(page)
  },
  onReachBottom: function () {
    if (page <= pageCount) {
      this.getHomeworkList(page)
    }
  },
  evalReport:function(e){
    var id = e.currentTarget.id
    wx.navigateTo({
      url: `../../evaluates/report?id=${id}&token=${token}&user=${userId}`
    });
  },

  getHomeworkList:function(_page){

    var url = app.globalData.apiUrl + '/student/evalList'
    var data = {
      token:token,
      userId:userId,
      classId:classId,
      subject:subject,
      page:_page,
      pageSize:pageSize
    }
    this.setData({
      loadMore: true
    })
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        this.setData({
          loadMore: false
        })
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh()
        if (res.data.code == 0) {

          var newList = res.data.data.list;
          newList.forEach(element => {
            element.units = JSON.parse(element.units)
            
          });
          
          var list = []
          if (page > 1) {
            list = this.data.list
          }
          list = list.concat(newList)
          pageCount = res.data.data.pageCount
          page += 1
          let recordCount = res.data.data.recordCount

          this.setData({
            list,
            recordCount
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
        this.setData({
          loadMore: false
        })
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading();
      }
    })
  },
  
  back:function(e){
    var route = getCurrentPages()
    if(route.length>1){
      wx.navigateBack({
        delta: 1
      });
    }else{
      wx.switchTab({
        url: '/pages/classes/list'
      });
    }
    
  },
  call:function(e){
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
  
  
})