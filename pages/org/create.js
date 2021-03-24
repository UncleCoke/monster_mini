const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      orgName: '',
      vipEndTime: '',
      vipLevel:0,
    },
    area:["广东省","广州市",""]
  },

  onLoad: function (options) {
    wx.hideShareMenu();
    app.checkLogin(()=>{
      this.inti();
    })
  },

  inti() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1
    let day = date.getDate()
    let today = `${year}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`
    this.setData({
      today
    })
  },

  formInputChange(e) {
    const {
      field,
      type,
      range
    } = e.currentTarget.dataset
    console.log(field, type, range, e.detail.value);
    if (type == 'picker') {
      var value = range[e.detail.value]
    } else {
      var value = e.detail.value

    }
    if(field == "vipLevel"){
      value = e.detail.value?1:0
    }
    if(field == "areaCode"){
      value = e.detail.postcode
      this.setData({
        [`formData.province`]: e.detail.value[0],
        [`formData.city`]: e.detail.value[1],
        [`formData.area`]: e.detail.value[2]
      })
    }
    this.setData({
      [`formData.${field}`]: value
    })
  },
  
  create: function (e) {
    console.log(this.data.formData);
    let formData = this.data.formData
    if(!formData.orgName){
      wx.showToast({
        title: '请输入名称',
        icon: 'error',
        duration: 1500,
        mask: false
      });
      return
    }
    if(!formData.areaCode){
      wx.showToast({
        title: '请选择所在地区',
        icon: 'error',
        duration: 1500,
        mask: false
      });
      return
    }
    if(formData.vipLevel && !formData.vipEndTime){
      wx.showToast({
        title: '请选择Vip有效期',
        icon: 'error',
        duration: 1500,
        mask: false
      });
      return
    }
    let data = formData
    app.request({
      url:'/org/create',
      data,
      method:'POST',
      barLoading:true
    }).then(res => {
      wx.showModal({
        title: '创建成功',
        content: '',
        showCancel: true,
        cancelText: '返回',
        cancelColor: '#000000',
        confirmText: '继续创建',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            this.setData({
              formData:{
                orgName: '',
                vipEndTime: '',
                vipLevel:0,
              }
            })
          }else{
            this.back()
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    })
  },

  back:function(){
    let route = getCurrentPages()
    if(route.length>1){
      wx.navigateBack({
        delta: 1
      });
    }else{
      wx.redirectTo({
        url: 'list'
      });
    }
  }
})