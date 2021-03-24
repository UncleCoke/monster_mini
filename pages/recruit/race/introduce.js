const app = getApp()
let id;
Page({

  data: {
  },

  onLoad: function (options) {
    id = options.id;
    app.checkLogin(()=>{
      this.getTemplateDetail();
    })
  },

  raceProduct:function(){
    wx.navigateTo({
      url: `product?id=${id}`
    });
  },

  showTemplate:function(){
    
  },

  getTemplateDetail:function(){
    app.request({
      url:'/recruit/event/template/detail',
      data:{
        id
      },
      barLoading:true
    }).then(res =>{
      this.setData({
        template:res
      })
    })
  }
})