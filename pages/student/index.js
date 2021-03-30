const app = getApp();
let page = 1,
  pageCount, limit = 10;
Page({

  data: {
    fromRecruits:[
      {
        type:1,
        name:'评测'
      },{
        type:2,
        name:'活动'
      },{
        type:3,
        name:'组班'
      }
    ] ,
    intentions:[
      {
        type:1,name:'低'
      },{
        type:2,name:'中'
      },
      {
        type:3,name:'高'
      },{
        type:4,name:'无意向'
      }
    ],
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
      fromRecruitType:'',
      intention:'',
      nextFollowTime: ''
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

  potentialDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `potentialDetail?id=${id}`
    });
  },

  setFind: function () {
    let isFind = this.data.isFind;
    this.setData({
      isFind: !isFind
    })
  },

  getClientList: function () {
    let data = {
      page,
      limit,
      status: this.data.status
    }
    for(let i in this.data.formData){
      if(this.data.formData[i] !== '' && i !== 'nextFollowTime'){
        data[i] = this.data.formData[i]
      }
    }
    app.request({
      url: '/client/list',
      data
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


      if(this.data.formData.nextFollowTime){
        let nextFollowTime = this.data.formData.nextFollowTime + ' 00:00:00';
        list = list.filter(item => item.lastFollow.nextFollowTime == nextFollowTime);
        total = list.length;
      }
      this.setData({
        list,
        total
      })
    })
  },

  formInputChange: function (e) {
    const {
      type,
      field
    } = e.currentTarget.dataset;
    let value;
    if (type === 'input') {
      value = e.detail.value;
    }else if(type === 'picker'){
      value = e.currentTarget.dataset.value
    }
    this.setData({
      [`formData.${field}`]: value
    },()=>{
      this.find();
    })
  },

  find:function(){
    page = 1;
    this.getClientList();
  },

  clear:function(){
    this.setData({
      formData: {
        name: '',
        phone: '',
        fromRecruitType:'',
        intention:'',
        nextFollowTime: ''
      }
    },()=>{
      this.find();
      this.setFind();
    })
  }
})