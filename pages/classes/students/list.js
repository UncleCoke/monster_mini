const app = getApp()
var classId,className
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:['学生','小组'],
    activeIndex:0,  //0：学生 1：小组
    groupList:[],
    studentList:[]
  },

  onLoad: function (options) {
    wx.hideShareMenu();
    classId = options.id
    className = options.className
    let masterId = options.tid
    this.setData({
      masterId
    })
    
  },
  onShow:function(){
    if (!app.globalData.token) {
      app.login((res) => {
        this.inti()
      })

    } else {
      this.inti()
    }
  },
  onPullDownRefresh: function () {
    this.getStudentList()
    this.getGroupList();

  },
  inti: function () {
    this.setData({
      teacherId:app.globalData.uid
    })
    this.getStudentList()
    this.getGroupList();
  },

  studentInfo:function(e){
    var id = e.currentTarget.dataset.id

    wx.navigateTo({
      url: `info?id=${id}`
    });
  },

  getStudentList: function () {
    var url = app.globalData.apiUrl + '/class/students'
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
          let studentList = res.data.data.studentList
          this.setData({
            studentList
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

  report: function (e) {
    const {
      token,
      id,
      index
    } = e.currentTarget.dataset
    var userInfo = this.data.studentList[index]
    wx.setStorage({
      key: 'userInfo',
      data: userInfo
    })
    wx.navigateTo({
      url: `studySum?token=${token}&userId=${id}&classId=${classId}`
    });
  
  },
  check: function (e) {
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '审核学生',
      content: '是否同意该学生加入班级？',
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
      title: '移除学生',
      content: '是否将该学生移除班级？',
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

  checkStatus: function (status,userId) {
    wx.showLoading({
      title: "正在处理",
      mask: true
    });
    var url = app.globalData.apiUrl + '/class/checkStudent'
    var data = {
      token:app.globalData.token,
      classId: classId,
      userId:userId,
      status:status
    }
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          this.getStudentList()

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

  onShareAppMessage: function () {
    let title = `邀请你加入${className}`
    let path = `/pages/classes/invite?classId=${classId}`
    let shareImg = `http://img.uelink.com.cn/upload/xykj/share/inviteStudent.png`
    return {
      title: title,
      path: path,
      imageUrl: shareImg
    }
  },

  tabSelect:function(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeIndex:index
    })
  },

  //获取分组列表
  getGroupList: function () {
    var url = app.globalData.apiUrl + '/class/students/group/get'
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
          let groupList = res.data.data.list
          this.setData({
            groupList
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

  //新增小组 || 编辑小组
  gotoGroup:function(e){
    let type = e.currentTarget.dataset.type;
    if(type === 'add'){
      if(this.data.studentList.length == 0){
        wx.showToast({
          title: '该班级暂无学生，无法进行该操作',
          icon: 'none',
          duration: 1500
        });
        return;
      }
      wx.navigateTo({
        url: `group?classId=${classId}&studentList=${JSON.stringify(this.data.studentList)}&type=add&isMaster=${this.data.masterId == this.data.teacherId}`,
      });
    }else{
      let group = e.currentTarget.dataset.group;
      wx.navigateTo({
        url: `group?classId=${classId}&studentList=${JSON.stringify(this.data.studentList)}&type=edit&group=${JSON.stringify(group)}&isMaster=${this.data.masterId == this.data.teacherId}`,
      });
    }
  }
})

