const app = getApp()
let classId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconList: [{
      icon: 'icon/work',
      badge: 0,
      name: '作业',
      type:'page',
      url:'homeworks/list',
      master:0,
      open:1
    }, {
      icon: 'icon/eval',
      badge: 0,
      name: '评测',
      type:'page',
      url:'evalList',
      master:0,
      open:1
    }, {
      icon: 'icon/student',
      badge: 0,
      name: '学生',
      type:'page',
      url:'students/list',
      master:0,
      open:1
    }, {
      icon: 'icon/teacher',
      badge: 0,
      name: '老师',
      type:'page',
      url:'teachers/list',
      master:0,
      open:1
    },
    {
      icon: 'icon/appreciate',
      badge: 0,
      name: '行为评价',
      type:'page',
      url:'appraisal/index',
      master:0,
      open:1
    }, {
      icon: 'icon/textBook',
      badge: 0,
      name: '设置教材',
      type:'page',
      url:'setTextbook',
      master:1,
      open:1
    }],
    hasJoin:-2,
    master:0,
    imgUrl:'http://img.uelink.com.cn/upload/xykj/classes/'
  },

  onLoad: function (options) {
    classId = options.id
    app.checkLogin(()=>{
      this.inti();
    })
  },

  onPullDownRefresh: function () {
    this.getClassDetail()
    wx.stopPullDownRefresh();
  },

  inti: function () {
    this.setData({
      teacherId:app.globalData.uid,
      parentId:app.globalData.parentId||0,
      nickName:app.globalData.nickName,
      phone:app.globalData.phone,
      avatarUrl:app.globalData.avatarUrl,
      hasJoin:-2,
      showModal:false,
      userInfo:app.globalData.userInfo
    })
    this.getClassDetail()
  },

  getClassDetail: function () {
    app.request({
      url:app.globalData.apiUrl + '/class/detail',
      data:{
        classId
      },
      barLoading:true
    }).then(res => {
      let classDetail = res.class
      let teacher = classDetail.teachers
      let teacherId = app.globalData.uid
      let parentId = app.globalData.parentId
      if(classDetail.teacherId == teacherId || classDetail.parentId == parentId){
        this.setData({
          master:1
        })
      }
      teacher.forEach(element => {
        if(element.teacherId == teacherId || element.parentId == parentId){
          this.setData({
            hasJoin:element.status
          })
        }
      });
      this.setData({
        classDetail
      })
    })
  },

  setUserData:function(e){
    let rawData = e.detail.rawData
    let encryptedData = e.detail.encryptedData
    let iv = e.detail.iv
    app.setUserData(encryptedData,iv,rawData,'','',()=>{
      this.setData({
        showModal:true
      })
    })
  },

  reload:function(){
    app.login((res) => {
      this.inti()
    })
  },

  join:function(e){
    let teacherId = app.globalData.uid
    var url = app.globalData.apiUrl + '/class/join'
    var data = {
      classId: classId,
      teacherId:teacherId,
      token:app.globalData.token
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideNavigationBarLoading();
        if (res.data.code == 0) {
          wx.showModal({
            title: '申请成功',
            content: '请等待班主任审核',
            showCancel: false,
            confirmText: '我知道了',
            confirmColor: '#3CC51F',
            success: (result) => {
              if(result.confirm){
                this.getClassDetail()
                
              }
            },
            fail: ()=>{},
            complete: ()=>{}
          });

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
        wx.stopPullDownRefresh()
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
        url: 'list'
      });
    }
    
  },

  share: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `share?id=${id}`
    });
  
  },

  action:function(e){
    var type = e.currentTarget.dataset.type
    var url = e.currentTarget.dataset.url
    var hasJoin = this.data.hasJoin
    console.log(e.currentTarget.dataset.master>=this.data.master,e.currentTarget.dataset.master,this.data.master);
    var isMaster = this.data.master>=e.currentTarget.dataset.master
    if(hasJoin<1){
      wx.showModal({
        title: '温馨提示',
        content: '加入班级之后才能操作哦',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#3CC51F'
      });
      return
    }
    if(!isMaster){
      wx.showModal({
        title: '温馨提示',
        content: '班主任才能操作哦',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#3CC51F'
      });
      return
    }

    if(type == 'page'){
      wx.navigateTo({
        url: `${url}?id=${this.data.classDetail.id}&tid=${this.data.classDetail.teacherId}&className=${this.data.classDetail.name}`
      });
    }else if(type == 'switch'){
      wx.switchTab({
        url: `${url}?id=${this.data.classDetail.id}&tid=${this.data.classDetail.teacherId}`
      });
    }else if(type == 'modal'){
      this.setData({
        modalName: url
      })
    }

  },

  enterClass:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateToMiniProgram({
      appId:'wxcfe4dc8683b0606f',
      path:`/packageB/pages/class/indexByStudent?classmateId=${id}`,
      extraData:{},
      envVersion:'release',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  quit: function (e) {
    wx.showModal({
      title: '退出班级',
      content: '是否将退出该班级？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          this.checkStatus(-10,this.data.teacherId)
          
        }else{
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
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
          this.inti()

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
          this.inti()

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
})