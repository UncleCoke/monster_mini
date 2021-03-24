const app = getApp()
let classId,className
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
    app.checkLogin(() => {
      this.inti();
    })
  },

  onPullDownRefresh: function () {
    this.getTeacherList()
    wx.stopPullDownRefresh();
  },

  inti: function () {
    this.setData({
      teacherId:app.globalData.uid
    })
    this.getTeacherList()
  },

  getTeacherList: function () {
    app.request({
      url:'/class/teachers',
      data:{
        classId
      },
      barLoading:true
    }).then(res => {
      let teachers = res.teachers
      this.setData({
        teachers
      })
    })
  },

  check: function (e) {
    let id = e.currentTarget.dataset.id
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
    let id = e.currentTarget.dataset.id
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
    app.request({
      url:'/class/checkJoin',
      data:{
        classId,teacherId,status
      },
      loading:true,
      loadingTitle:'正在处理'
    }).then(() => {
      this.getTeacherList();
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
})

