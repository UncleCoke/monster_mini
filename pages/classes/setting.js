const app = getApp()
let classId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
    formData: {
      name: '',
      grade: '',
      isShowContact:1
    },
  },

  onLoad: function (options) {
    classId = options.id
    wx.hideShareMenu();
    app.checkLogin(()=>{
      this.inti();
    })
  },

  inti() {
    this.setData({
      teacherId: app.globalData.uid,
      [`formData.classId`]: classId
    })
    this.getClassDetail()
  },

  getClassDetail: function () {
    app.request({
      url:'/class/detail',
      data:{
        classId
      },
      barLoading:true
    }).then(res => {
      let classDetail = res.class
      classDetail.price /= 100
      this.setData({
        classDetail,
        [`formData.name`]: classDetail.name,
        [`formData.price`]: classDetail.price,
        [`formData.grade`]: classDetail.grade,
        [`formData.isOpen`]: classDetail.status||1,
        [`formData.isShowContact`]: classDetail.isShowContact,
        [`formData.isFollowOrgVip`]: classDetail.isFollowOrgVip,
      })
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
    if(field == "isFollowOrgVip"){
      value = e.detail.value?1:0
    }
    this.setData({
      [`formData.${field}`]: value
    })
  },

  update: function (e) {
    console.log(this.data.formData);
    let formData = this.data.formData
    if (!formData.name) {
      wx.showToast({
        title: '班级名称不能为空',
        icon: 'error',
        duration: 1500,
        mask: false
      });
      return
    }
    if (!formData.grade) {
      wx.showToast({
        title: '请选择年级',
        icon: 'error',
        duration: 1500,
        mask: false
      });
      return
    }
    if(formData.price<0){
      wx.showToast({
        title: '请输入正确的费用',
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

    let data = formData;
    data.classId = classId*1
    data.price *=100 
    app.request({
      url:'/class/update',
      data,
      barLoading:true,
      method:'POST'
    }).then(() => {
      this.getClassDetail()
      wx.showToast({
        title: "更新成功",
        icon: 'success',
        duration: 2000,
        mask: true
      })
    })
  },

  back: function (e) {
    let route = getCurrentPages()
    if (route.length > 1) {
      wx.navigateBack({
        delta: 1,
        success: (result) => {
          this.hideModal()
        }
      });
    } else {
      wx.switchTab({
        url: 'list',
        success: (result) => {
          this.hideModal()
        }
      });
    }
  },

  enterClass: function () {
    wx.redirectTo({
      url: `classIndex?id=${this.data.classmateId}`,
      success: (result) => {
        this.hideModal()
      },
      fail: () => {},
      complete: () => {}
    });
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  dismiss: function () {
    wx.showModal({
      title: '警告',
      content: '解散后将无法恢复数据',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          app.request({
            url:'/class/dismiss',
            data:{
              classId,
              teacherId:app.globalData.uid
            },
            barLoading:true
          }).then(res => {
            wx.switchTab({
              url: 'list'
            });

          })
        }
      },
      fail: () => {},
      complete: () => {}
    });
  }

})