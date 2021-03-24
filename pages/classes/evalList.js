const app = getApp()
let classId,tid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    imgUrl:'http://img.uelink.com.cn/upload/xykj/eval/',
    isShowAll:false
  },

  onLoad: function (options) {
    classId = options.id,tid= options.tid
    wx.hideShareMenu();
    app.checkLogin(() => {
      this.inti();
    })
  },

  inti(){
    this.getEvalList()
    this.getTextbook()
  },

  onPullDownRefresh: function () {
    this.getEvalList()
    wx.stopPullDownRefresh();
  },

  evalDetail:function(e){
    console.log(e);
    let id = e.currentTarget.id
    wx.navigateTo({
      url: `/pages/evaluates/detail?id=${id}`
    });
  },

  createEval:function(e){
    wx.navigateTo({
      url: `/pages/evaluates/create?classId=${classId}`,
      success: (result)=>{
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  getEvalList:function(){
    app.request({
      url:'/class/evalList2',
      data:{
        classId
      },
      barLoading:true
    }).then(res => {
      let list = res.list;
      list.forEach(item => {
          item['intiUnits'] = item.units.slice(0,2);
      })
      this.setData({
        list
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

  getTextbook:function(){
    app.request({
      url:'/class/getTextbooks',
      data:{
        classId
      }
    }).then(res => {
      let textbooks = res.textbooks
      let hasSet = 0
      textbooks.forEach(element => {
        let vers = element.vers
          vers.forEach(ver => {
            if(ver.checked){
              hasSet++
            }
          });
      });
      if(hasSet<textbooks.length){
        wx.showModal({
          title: '温馨提示',
          content: '请设置教材版本',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              wx.navigateTo({
                url: `setTextbook?id=${classId}&tid=${tid}`
              });
            }
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }
    })
  },
  
  setIsShowAll:function(){
    let isShowAll = this.data.isShowAll;
    this.setData({
      isShowAll:!isShowAll
    })
  }
})