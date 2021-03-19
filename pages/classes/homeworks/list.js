const app = getApp()
let classId,tid, page, pageCount = 1,pageSize = 20
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    recordCount:0,
    imgUrl:'http://img.uelink.com.cn/upload/xykj/classes/'
  },

  onLoad: function (options) {
    classId = options.id,tid= options.tid
    wx.hideShareMenu();
    app.checkLogin(()=>{
      this.inti();
    })
  },

  inti(){
    page = 1
    this.getHomeworkList(page)
    this.getTextbook()
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
      url: `detail?id=${id}&classId=${classId}`
    });
  },

  createHomework:function(e){
    wx.navigateTo({
      url: `create?classId=${classId}`
    });
  },

  getHomeworkList:function(_page){
    app.request({
      url:app.globalData.apiUrl + '/class/homeworks',
      data:{
        classId,
        page:_page,
        pageSize:pageSize,
      },
      barLoading:true
    }).then(res => {
      let newList = res.list;
      let list = []
      if (page > 1) {
        list = this.data.list
      }
      list = list.concat(newList)
      pageCount = res.pageCount
      page += 1
      let recordCount = res.recordCount
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

  getTextbook:function(){
    app.request({
      url:app.globalData.apiUrl + '/class/getTextbooks',
      data:{
        classId
      }
    }).then(res => {
      let textbooks = res.textbooks
      let hasSet = 0
      textbooks.forEach(element => {
        let  vers = element.vers
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
                url: `../setTextbook?id=${classId}&tid=${tid}`
              });
            }
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }
    })
  },
  
})