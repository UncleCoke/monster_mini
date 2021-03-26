const app = getApp()
let isRecruit;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grades:['一年级','二年级','三年级', '四年级', '五年级', '六年级'],
    formData: {
      name: '',
      grade: '',
      isOpen:1,
      price:0
    },
  },

  onLoad: function (options) {
    if(options.isRecruit){
      isRecruit = options.isRecruit*1;
      console.log(isRecruit);
    }
    app.checkLogin(()=>{
      this.inti();
    })
    wx.hideShareMenu();
  },

  inti() {
    let orgName = app.globalData.orgName || ''
    let orgId = app.globalData.orgId || 0
    this.setData({
      [`formData.orgId`]:orgId,
      [`formData.orgName`]:orgName,
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
      var value = range[e.currentTarget.dataset.value]
    } else {
      var value = e.detail.value
    }
    if(field == "isOpen"){
      value = e.detail.value?1:2
    }
    this.setData({
      [`formData.${field}`]: value
    })
  },
  
  create: function () {
    console.log(this.data.formData);
    let formData = this.data.formData
    if(!formData.name){
      wx.showToast({
        title: '请输入班级名称',
        icon: 'error',
        duration: 1500,
        mask: false
      });
      return
    }
    if(!formData.grade){
      wx.showToast({
        title: '请选择年级',
        icon: 'error',
        duration: 1500,
        mask: false
      });
      return
    }
    if(isNaN(formData.price) || formData.price<0){
      wx.showToast({
        title: '请输入正确费用',
        icon: 'error',
        duration: 1500,
        mask: false
      });
      return
    }
    if(formData.price > 99999){
      wx.showToast({
        title: '费用不能大于99999',
        icon: 'none',
        duration: 1500,
        mask: false
      });
      return
    }
    let data = formData
    data.token = app.globalData.token
    data.parentId = app.globalData.parentId
    data.price *=100
    if(isRecruit){
      data['isRecruit'] = isRecruit;
    }
    wx.showLoading({
      title: "正在提交",
      mask: true
    });
    app.request({
      url:'/class/create',
      data,
      loading:true,
      loadingTitle:'正在提交',
      barLoading:true,
      method:'POST'
    }).then(res => {
      let classmateId = res.classmateId
      this.setData({
        modalName: 'done',
        classmateId,
      })
    })
  },

  back:function(){
    let route = getCurrentPages()
    if(route.length>1){
      wx.navigateBack({
        delta: 1,
        success: (result)=>{
          this.hideModal()
        }
      });
    }else{
      wx.switchTab({
        url: '/pages/recruit/index',
        success: (result)=>{
          this.hideModal()
        }
      });
    }
  },

  enterClass:function(){
    wx.redirectTo({
      url: `classIndex?id=${this.data.classmateId}`,
      success: (result)=>{
        this.hideModal()
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  hideModal() {
    this.setData({
      modalName: null
    })
  }
})