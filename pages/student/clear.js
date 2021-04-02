const app = getApp();
let page = 1,
  pageCount, limit = 10;
Page({

  data:{
    list:[]
  },

  onShow: function () {
    app.checkLogin(()=>{
      page = 1;
      this.getClientList();
    })
  },

  onPullDownRefresh: function () {
    page = 1;
    this.getClientList();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    if (page <= pageCount) {
      this.getClientList()
    }
  },

  getClientList: function () {
    app.request({
      url: '/client/list',
      data:{
        page,
        limit,
        status: -1
      }
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

  editClient:function(e){
    let id = e.currentTarget.dataset.id;
    app.request({
      url:'/client/edit',
      data:{
        id,
        status:0
      }
    }).then(res => {
      wx.showToast({
        title: '已放回线索池',
        icon: 'success'
      });
      page = 1;
      this.getClientList();
    })
  },

  delClient:function(e){
    wx.showModal({
      title: '删除提示',
      content: '确定要彻底删除该客户',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          let id = e.currentTarget.dataset.id;
          app.request({
            url:'/client/delete',
            data:{
              id
            }
          }).then(res => {
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            page = 1;
            this.getClientList();
          })
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
})