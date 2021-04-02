const app = getApp()
let  page, pageCount = 1,pageSize = 20
let userId, classId,subject,token;
Page({

  data: {
    list: [],
    loadMore: false,
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
    this.getEvalList();
  },

  onPullDownRefresh: function () {
    page = 1
    this.getEvalList();
    wx.stopPullDownRefresh();
  },

  /*onReachBottom: function () {
    if (page <= pageCount) {
      this.getHomeworkList(page)
    }
  },*/

  evalReport:function(e){
    let id = e.currentTarget.id
    wx.navigateTo({
      url: `../../evaluates/report?id=${id}&token=${token}&user=${userId}`
    });
  },

  getEvalList: function () {
    let url = 'https://fxb2api.uelink.com.cn/fxbapi/classmate/evalList';
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let data = {
      classId:classId,
      userId:userId,
      token:token
    }
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        if (res.data.code == 0) {
          let list = res.data.data.list;
          let evalList = list.filter(item => {
            return item.subject == subject && item.hasDone !== 0
          })
          this.setData({
            list:evalList,
            recordCount:evalList.length
          }, () => {
            wx.hideLoading();
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

  /*getHomeworkList:function(_page){
    app.request({
      url:'/student/evalList',
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
      let newList = res.list;
      newList.forEach(element => {
        element.units = JSON.parse(element.units)
      });
      let list = []
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
  },*/
  
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
  }
})