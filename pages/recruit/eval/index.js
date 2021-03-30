const app = getApp();
let page = 1,
  pageCount, limit = 10;
Page({

  data: {
    list:[],
    imgUrl:'http://img.uelink.com.cn/upload/xykj/eval/'
  },

  onShow: function () {
    app.checkLogin(()=>{
      page = 1;
      this.getEvalList();
    })
  },

  onPullDownRefresh: function () {
    page =1;
    this.getEvalList();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    if (page <= pageCount) {
      this.getEvalList();
    }
  },

  getEvalList:function(){
    app.request({
      url:'/recruit/eval/list',
      data:{
        page,
        limit
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

  gotoDetail:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `detail?id=${id}`,
    });
  },

  setUserData: function (e) {
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      return
    }
    let rawData = e.detail.rawData
    let encryptedData = e.detail.encryptedData
    let iv = e.detail.iv
    app.setUserData(encryptedData, iv, rawData, '', '', () => {
      wx.navigateTo({
        url:'create'
      });
    })
  }
})