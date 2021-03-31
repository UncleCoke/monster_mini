const app = getApp()
let id;
Page({

  data: {
    grades:['一年级','二年级','三年级', '四年级', '五年级', '六年级'],
    formData: {
      name: '',
      grade: '',
      imgClassmate:''
    },
    fileUrl:''
  },

  onLoad: function (options) {
    id = options.id*1;
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
    this.getDetail();
  },

  formInputChange(e) {
    const {
      field,
      type,
      range
    } = e.currentTarget.dataset
    let value;
    if (type == 'picker') {
      value = range[e.currentTarget.dataset.value]
    } else {
      value = e.detail.value
    }
    this.setData({
      [`formData.${field}`]: value
    })
  },
  
  edit: function () {
    console.log(this.data.formData);
    let formData = this.data.formData
    if(!formData.imgClassmate){
      wx.showToast({
        title: '请上传班级头像',
        icon: 'error',
        duration: 1500,
        mask: false
      });
      return
    }
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
    let data = formData
    data.parentId = app.globalData.parentId
    data.id = id;
    app.request({
      url:'/recruit/class/update',
      data,
      loading:true,
      loadingTitle:'正在提交',
      barLoading:true,
      method:'POST'
    }).then(res => {
      this.setData({
        modalName: 'done'
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

  share:function(){
    wx.redirectTo({
      url: `/pages/recruit/share?id=${this.data.classmateId}&recruitType=3`,
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
  },

  chooseImg:function(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      success: (res) => {
        let path =  res.tempFilePaths[0];
        wx.uploadFile({
          url: 'https://fxb2api.uelink.com.cn/teacherapi/public/pc/upload/post?type=imgClassmate',
          filePath:path,
          name: 'file',
          success:(res)=>{
            let data = JSON.parse(res.data).data;
            let fileName = data.fileName;
            let fileUrl = data.fileUrl;
            this.setData({
              [`formData.imgClassmate`]:fileName,
              fileUrl
            })
          }
        })
      }
    })
  },

  getDetail:function(){
    app.request({
      url:'/recruit/class/detail',
      data:{
        id
      },
      barLoading:true
    }).then(res => {
      let classDetail = res.class;
      this.setData({
        classDetail,
        formData:{
          name:classDetail.name,
          grade:classDetail.grade,
          imgClassmate:classDetail.imgClassmate
        },
        fileUrl:classDetail.imgClassmateUrl
      })
    })
  },

  share:function(){
    wx.redirectTo({
      url: `/pages/recruit/share?id=${id}&recruitType=3`,
      success: (result)=>{
        this.hideModal()
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
})