const app = getApp();
let id,load = false,avatarUrl;
Page({

  data: {
    intentions:[
      '无意向','低','中','高'
    ],
    imgUrl:'http://img.uelink.com.cn/upload/xykj/student/',
    userClasses:[]
  },

  onLoad: function (options) {
    id = options.id*1;
    avatarUrl = options.avatarUrl;
    app.checkLogin(()=>{
      this.setData({
        orgAdmin:app.globalData.orgAdmin,
      })
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
      if(avatarUrl){
        client['avatarUrl'] = avatarUrl;
      }
      client['nickName'] =client.name;
      let userEvals = res.userEvals;
      if(userEvals){
        userEvals.map(item=>item['checked'] = false)
      }
      this.setData({
        client,
        status:client.status,
        follow:res.follow,
        userToken:res.userToken,
        userEvals,
        userClasses:res.userClasses
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
  },

  showEval:function(){
    let userEvals = this.data.userEvals;
    if(userEvals.length == 1){
      this.report(userEvals[0].id)
    }else{
      this.setData({
        modalName:'evalModal'
      })
    }
  },

  report:function(id){
    load = true;
    wx.setStorageSync('userInfo',this.data.client);
    wx.navigateTo({
      url: `/pages/evaluates/report?id=${id}&token=${this.data.userToken}&user=${this.data.client.userId}`,
    });
  },

  hideModal:function(){
    this.setData({
      modalName:null
    })
  },

  chooseEval:function(e){
    let id = e.currentTarget.dataset.id;
    this.hideModal();
    this.report(id)
  } 
})