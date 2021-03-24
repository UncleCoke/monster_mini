const app = getApp();
let page = 1,pageCount,limit = 10;
Page({

  data: {
    list: [],
    imgUrl: 'http://img.uelink.com.cn/upload/xykj/race/'
  },

  onShow: function () {
    wx.hideShareMenu();
    app.checkLogin(() => {
      page = 1;
      this.getRaces();
    })
  },

  onPullDownRefresh: function () {
    page = 1;
    this.getRaces();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    if (page <= pageCount) {
      this.getRaces()
    }
  },

  getRaces: function () {
    app.request({
      url: '/recruit/event/list',
      data: {
        page,limit
      }
    }).then(res => {
      let _list = res.list;
      let list = []
      if (page > 1) {
        list = this.data.list
      }
      list = list.concat(_list);
      if(!pageCount){
        pageCount = Math.ceil(res.total / limit)
      }
      page += 1
      this.setData({
        list,
        total:res.total
      })
    })
  },

  setUserData: function (e) {
    let rawData = e.detail.rawData;
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    app.setUserData(encryptedData, iv, rawData, '', '', () => {
      wx.navigateTo({
        url: 'create'
      });
    })
  },

  gotoDetail: function (e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: `detail?id=${id}`
    });
  }
})