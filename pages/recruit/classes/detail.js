const app = getApp();
let classId,load=false;
Page({

  data: {
    imgUrl:'http://img.uelink.com.cn/upload/xykj/classes/',
    tabs:['获客记录','班级学生'],
    activeIndex:0,
  },

  onLoad: function (options) {
    classId = options.id*1;
    app.checkLogin(() => {
      this.setData({
        teacherId:app.globalData.uid
      })
      this.inti();
    })
  },

  inti:function(){
    this.getDetail();
    this.getStudentList();
  },

  onShow:function(){
    if(load){
      this.inti();
    }
  },

  onPullDownRefresh: function () {
    this.inti();
    wx.stopPullDownRefresh();
  },

  getDetail:function(){
    app.request({
      url:'/recruit/class/detail',
      data:{
        id:classId
      },
      barLoading:true
    }).then(res => {
      this.setData({
        clients:res.clients,
        classDetail:res.class
      })
    })
  },

  setClass:function(){
    load = true;
    wx.navigateTo({
      url: `edit?id=${classId}`
    });
  },

  share:function(){
    wx.redirectTo({
      url: `/pages/recruit/share?id=${classId}&recruitType=3`
    })
  },

  tabSelect:function(e){
    let activeIndex = e.currentTarget.dataset.index;
    this.setData({
      activeIndex
    })
  },

  getStudentList: function () {
    app.request({
      url:'/class/students',
      data:{
        classId
      },
      barLoading:true
    }).then(res => {
      let studentList = res.studentList
      this.setData({
        studentList
      })
    })
  },

  report: function (e) {
    const {
      token,
      id,
      index
    } = e.currentTarget.dataset
    let userInfo = this.data.studentList[index]
    wx.setStorage({
      key: 'userInfo',
      data: userInfo
    })
    wx.navigateTo({
      url: `/pages/classes/students/studySum?token=${token}&userId=${id}&classId=${classId}`
    });
  },

  check: function (e) {
    let id = e.currentTarget.dataset.id
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

  checkStatus: function (status,userId) {
    wx.showLoading({
      title: "正在处理",
      mask: true
    });
    app.request({
      url:'/class/checkStudent',
      data:{
        classId,userId,status
      },
      loading:true,
      loadingTitle:'正在处理'
    }).then(res => {
      this.getStudentList()
    })
  },

  editClient:function(e){
    let id = e.currentTarget.dataset.id;
    app.request({
      url:'/client/edit',
      data:{
        id,
        status:1
      }
    }).then(res => {
      this.inti();
    })
  }
})