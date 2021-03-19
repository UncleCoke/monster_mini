const app = getApp()
var classId,className
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  onLoad: function (options) {
    wx.hideShareMenu();
    classId = options.id
    className = options.className
    let masterId = options.tid
    this.setData({
      masterId
    })

    if (!app.globalData.token) {
      app.login((res) => {
        this.inti()
      })

    } else {
      this.inti()
    }
  },
  onPullDownRefresh: function () {
    this.getTeacherList()

  },
  inti: function () {
    this.setData({
      teacherId:app.globalData.uid
    })
    this.getTeacherList()
  },


  getTeacherList: function () {
    var url = app.globalData.apiUrl + '/class/teachers'
    var data = {
      classId: classId,
      token:app.globalData.token
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh()
        if (res.data.code == 0) {
          let teachers = res.data.data.teachers
          this.setData({
            teachers
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
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },

  check: function (e) {
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '审核老师',
      content: '是否同意该老师加入班级？',
      showCancel: true,
      cancelText: '拒绝',
      cancelColor: '#000000',
      confirmText: '同意',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          this.checkStatus(1,id)
          
        }else{
          this.checkStatus(-1,id)
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  remove: function (e) {
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '移除老师',
      content: '是否将该老师移除班级？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          this.checkStatus(-10,id)
          
        }else{
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  onShareAppMessage: function () {
    let title = `邀请你一起管理班级：${className}`
    let shareImg = `http://img.uelink.com.cn/upload/xykj/share/inviteTeacher.png`
    let path = `/pages/classes/classIndex?id=${classId}`
    return {
      title: title,
      path: path,
      imageUrl: shareImg
    }
  },

  checkStatus: function (status,teacherId) {
    wx.showLoading({
      title: "正在处理",
      mask: true
    });
    var url = app.globalData.apiUrl + '/class/checkJoin'
    var data = {
      token:app.globalData.token,
      classId: classId,
      teacherId:teacherId,
      status:status
    }
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          this.getTeacherList()

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
})

