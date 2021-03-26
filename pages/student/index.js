const app = getApp();
let page = 1,
  pageCount, limit = 10;
Page({

  data: {
    tabs: [{
        status: 1,
        title: '潜在生源'
      },
      {
        status: 10,
        title: '学生信息'
      }
    ],
    status: 1,
    imgUrl: 'http://img.uelink.com.cn/upload/xykj/student/',
    formData: {
      name: '',
      phone: '',
      from: '',
      status: '',
      degree: '',
      time: ''
    }
  },

  onShow: function () {
    app.checkLogin(()=>{
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

  tabChange: function (e) {
    let status = e.currentTarget.dataset.status;
    this.setData({
      status
    }, () => {
      page = 1;
      this.getClientList()
    })
  },

  call: function (e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },

  potentialDetail: function () {
    wx.navigateTo({
      url: 'potentialDetail'
    });
  },

  setFind: function () {
    let isFind = this.data.isFind;
    this.setData({
      isFind: !isFind
    })
  },

  getClientList: function () {
    app.request({
      url: '/client/list',
      data: {
        page,
        limit,
        status: this.data.status
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
      page += 1
      this.setData({
        list,
        total: res.total
      })
    })
  }
})