const app = getApp()
let  page, pageCount = 1,pageSize = 20
let userId, classId,subject,token;
Page({

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
      title: `${subject}-作业记录`
    });

    app.checkLogin(()=>{
      this.inti();
    })
  },


  inti(){
    page = 1
    let user = wx.getStorageSync('userInfo');
    this.setData({
      user
    })
    this.getHomeworkList(page)
  },

  onPullDownRefresh: function () {
    page = 1
    this.getHomeworkList(page)
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    if (page <= pageCount) {
      this.getHomeworkList(page)
    }
  },

  homeworkDetail:function(e){
    let id = e.currentTarget.id
    wx.navigateTo({
      url: `../homeworks/report?homeworkId=${id}&classId=${classId}&userId=${userId}`
    });
  },

  getHomeworkList:function(_page){
    app.request({
      url:'/student/homeworks',
      data:{
        token:token,
        userId:userId,
        classId:classId,
        subject:subject,
        page:_page,
        pageSize:pageSize
      },
      barLoading:true
    }).then(res => {
      var newList = res.list;
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
    })
  },
  
  back:function(e){
    let route = getCurrentPages()
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
    let phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  
  
})