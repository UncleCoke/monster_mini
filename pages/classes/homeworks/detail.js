const app = getApp()
let homeworkId,classId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eval: {},
    topics: [],
    submitedList:[],
    imgUrl:'http://img.uelink.com.cn/upload/xykj/share/',
    classImgUrl:'http://img.uelink.com.cn/upload/xykj/classes/'

},

onLoad: function (options) {
  homeworkId = options.id
  classId = options.classId
  wx.hideShareMenu();
  app.checkLogin(()=>{
    this.getHomework();
  })
},

report: function (e) {
  const {
    userid,
    index
  } = e.currentTarget.dataset
  let userInfo = this.data.submitedList[index]
  console.log(userid,index,userInfo);
  wx.setStorage({
    key: 'userInfo',
    data: userInfo
  })
  wx.navigateTo({
    url: `report?homeworkId=${homeworkId}&userId=${userid}&classId=${classId}`
  });

},

back: function () {
  let route = getCurrentPages()
  if (route.length > 1) {
    wx.navigateBack({
      delta: 1
    });
  } else {
    wx.redirectTo({
      url: `../classIndex?id=${classId}`
    });
  }

},

share: function (e) {
  let id = e.currentTarget.dataset.id
  wx.navigateTo({
    url: `share?id=${id}&subject=${this.data.eval.subject}&textbook=${this.data.eval.textbook}`
  });

},

getHomework:function(id){
  app.request({
    url:app.globalData.apiUrl + '/class/homeworkDetail',
    data:{
      homeworkId
    },
    barLoading:true
  }).then(res => {
    let homework = res.homework
    let submitedList = res.submitedList
    let unSubmitList  = res.unSubmitList
    let questions  = res.questions
    this.setData({
      homework,
      submitedList,unSubmitList,questions
    })
  })
},

enterClass:function(e){
  let id = e.currentTarget.dataset.id
  wx.navigateToMiniProgram({
    appId:'wxcfe4dc8683b0606f',
    path:`packageB/pages/class/index?classmateId=${id}&isJoin=1?`,
    extraData:{},
    envVersion:'release',
    success: (result)=>{
    },
    fail: ()=>{},
    complete: ()=>{}
  });
},

delete: function () {
  wx.showModal({
    title: '警告',
    content: '删除后将无法恢复数据',
    showCancel: true,
    cancelText: '取消',
    cancelColor: '#000000',
    confirmText: '确定',
    confirmColor: '#e54d42',
    success: (result) => {
      if (result.confirm) {
        app.request({
          url:app.globalData.apiUrl + '/class/homework/remove',
          data:{
            homeworkId
          },
          barLoading:true
        }).then(res => {
          this.back();
        })
      }
    },
    fail: () => {},
    complete: () => {}
  });
},

onShareAppMessage: function (options) {
  console.log(options);
  let mode = options.target.id
  let nickName = options.target.dataset.name
  let title = this.data.homework.title
  let shareImg
  if(mode == "warn"){
    title = `${nickName}还未完成${title}`
    shareImg = `${this.data.imgUrl}homework2.jpg`
  }else if(mode =="notify" ){
    title = `${title}来了`
    shareImg = `${this.data.imgUrl}homework1.jpg`
  }
  
  let path = `/pages/classes/homeworks/doHomework?classId=${classId}&homeworkId=${homeworkId}&mode=${mode}`
  console.log(path);
  return {
    title: title,
    path: path,
    imageUrl: shareImg
  }
},

allTopic: function (e) {
  let allTopic = this.data.questions
  wx.setStorage({
    key: 'allTopic',
    data: allTopic,
    success: (result)=>{
      wx.navigateTo({
        url: `allTopic?classId=${classId}`
      });
    },
    fail: ()=>{},
    complete: ()=>{}
  });
},

warn:function(e){
  wx.showModal({
    title: '一键提醒',
    content: '是否发送公众号消息提醒未完成的同学交作业？',
    showCancel: true,
    cancelText: '取消',
    cancelColor: '#000000',
    confirmText: '确定',
    confirmColor: '#3CC51F',
    success: (result) => {
      if(result.confirm){
        app.request({
          url:app.globalData.apiUrl + '/class/homework/warn',
          data:{
            homeworkId
          },
          barLoading:true
        }).then(res => {
          wx.showToast({
            title: "已提醒",
            icon: 'none',
            duration: 2000,
            mask: true
          })
        })
      }
    },
    fail: ()=>{},
    complete: ()=>{}
  });
}

})