const app = getApp()
var classId,tid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []

  },
  onLoad: function (options) {
    classId = options.id,tid= options.tid
    wx.hideShareMenu();
    if (!app.globalData.token) {
      app.login((res) => {
        this.inti()
      })
  
    } else {
      this.inti()
    }
  },
  inti(){
    this.getEvalList()
    this.getTextbook()
  },
  onPullDownRefresh: function () {
    this.getEvalList()
  },
  evalDetail:function(e){
    console.log(e);
    var id = e.currentTarget.id

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

    var url = app.globalData.apiUrl + '/class/evalList2'
    var data = {
      classId:classId,
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
          console.log(res.data.data)
          var list = res.data.data.list
          this.setData({
            list
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
        url: 'list'
      });
    }
    
  },
  getTextbook:function(){

    var url = app.globalData.apiUrl + '/class/getTextbooks'
    var data = {
      classId:classId,
      token:app.globalData.token
    }
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        if (res.data.code == 0) {
          var textbooks = res.data.data.textbooks
          var hasSet = 0
          textbooks.forEach(element => {
            var vers = element.vers
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
          
        } 
      },
      fail: (res) => {
      }
    })
  },
  
})