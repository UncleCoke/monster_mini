const app = getApp()
let page = 1,
  pageCount, limit = 10;
Page({

  data: {
    imgUrl:'http://img.uelink.com.cn/upload/xykj/classes/',
    list:[]
  },

  onLoad: function (options) {
    wx.hideShareMenu();
  },

  onPullDownRefresh: function () {
    page = 1;
    this.getClassList()
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    if (page <= pageCount) {
      this.getClassList();
    }
  },

  onShow: function () {
    app.checkLogin(()=>{
      this.inti();
    })
  },

  inti: function () {
    this.setData({
      teacherId:app.globalData.uid,
      phone:app.globalData.phone,
      showModal:false
    })
    page = 1;
    this.getClassList()
  },

  classDetail:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `detail?id=${id}`
    });
  },

  createClass:function(){
    wx.navigateTo({
      url: `create`
    });
  },

  getClassList: function () {
    app.request({
      url:'/recruit/class/list',
      data:{
        page,limit,isRecruit:1
      },
      barLoading:true
    }).then(res => {
      let _list = res.list;
      let list = []
      if (page > 1) {
        list = this.data.list
      }
      list = list.concat(_list);
      if (!pageCount) {
        pageCount = Math.ceil(res.total / limit)
      }
      let total = res.total;
      page += 1
      this.setData({
        list,
        total
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
  }
})