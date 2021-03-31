const app = getApp();
let id,load = false;
Page({

  data: {
    intentions:[
      '无意向','低','中','高'
    ],
    imgUrl:'http://img.uelink.com.cn/upload/xykj/student/',
  },

  onLoad: function (options) {
    id = options.id*1;
    app.checkLogin(()=>{
      this.getClientDetail();
    })
  },

  onShow:function(){
    if(load){
      this.getClientDetail();
    }
  },

  onPullDownRefresh: function () {
    this.getClientDetail();
    wx.stopPullDownRefresh();
  },

  call:function(){
    wx.makePhoneCall({
      phoneNumber:this.data.client.phone
    });
  },

  follow:function(){
    load = true;
    wx.navigateTo({
      url: `follow?id=${id}&name=${this.data.client.name}`
    });
  },

  getClientDetail:function(){
    app.request({
      url:'/client/detail',
      data:{
        id
      }
    }).then(res => {
      let client = res.client;
      if(res.follow.length > 0){
        let intention = res.follow[0].intention;
        client['intention'] = this.data.intentions[intention];
      }
      this.setData({
        client,
        follow:res.follow
      })
    })
  },

  editClient:function(e){
    let status = e.currentTarget.dataset.status*1;
    app.request({
      url:'/client/edit',
      data:{
        id,
        status
      }
    }).then(res => {
      wx.switchTab({
        url: 'index',
      });
    })
  }
})