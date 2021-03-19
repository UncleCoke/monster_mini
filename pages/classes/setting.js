const app = getApp()
var classId
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
    if (!app.globalData.token) {
      app.login((res) => {
        this.inti()
      })

    } else {
      this.inti()
    }
  },
  inti() {
    this.setData({
      teacherId: app.globalData.uid,
      // parentId: app.globalData.parentId,
      [`formData.classId`]: classId
    })
    this.getClassDetail()
  },

  getClassDetail: function () {
    var url = app.globalData.apiUrl + '/class/detail'
    var data = {
      classId: classId,
      token:app.globalData.token
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh()
        if (res.data.code == 0) {
          let classDetail = res.data.data.class
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

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      },
      fail: (res) => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
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
    if (field == "subjectindex") {
      this.setTextbookPickData(value)
    }
    if (field == "evalType") {
      if (e.detail.value == 2) {
        this.getUnit(this.data.formData.textbookId)
      }
    }
    if(field == "isOpen"){
      value = e.detail.value?1:2
    }
    if(field == "isShowContact" || field == "isFollowOrgVip"){
      value = e.detail.value?1:0
    }
    
    if (field == "units") {
      var unitArr = e.detail.value
      var units = this.data.units
      var value = [],
        unitIds = []
      unitArr.forEach(element => {
        value.push(units[element].name)
        unitIds.push(units[element].id)

      });
      this.setData({
        ['formData.unitIds']: unitIds.toString()
      })

    }
    this.setData({
      [`formData.${field}`]: value
    })
  },

  update: function (e) {
    console.log(this.data.formData);
    var formData = this.data.formData
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
    var url = app.globalData.apiUrl + '/class/update'
    var data = formData
    data.token = app.globalData.token
    // data.parentId = app.globalData.parentId
    data.name = formData.name
    // data.grade = formData.grade
    data.classId = classId*1
    data.price *=100
    // if (formData.orgName) {
    //   data.orgName = formData.orgName
    // }
    // if (formData.inviteCode) {
    //   data.inviteCode = formData.inviteCode
    // }
    // if (formData.masterName) {
    //   data.masterName = formData.masterName
    // }
    // if (formData.masterPhone) {
    //   data.masterPhone = formData.masterPhone
    // }

    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      method: "POST",
      data: data,
      success: (res) => {
        wx.hideNavigationBarLoading();
        if (res.data.code == 0) {
          this.getClassDetail()
          wx.showToast({
            title: "更新成功",
            icon: 'success',
            duration: 2000,
            mask: true
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      },
      fail: (res) => {
        wx.hideNavigationBarLoading();
      }
    })
  },
  back: function (e) {
    var route = getCurrentPages()

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
          var url = app.globalData.apiUrl + '/class/dismiss'
          var data = {classId:classId,teacherId:app.globalData.uid,
            token:app.globalData.token}
          wx.showNavigationBarLoading();
          wx.request({
            url: url,
            data: data,
            success: (res) => {
              wx.hideNavigationBarLoading();
              if (res.data.code == 0) {
                wx.switchTab({
                  url: 'list'
                });

              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000,
                  mask: true
                })
              }
            },
            fail: (res) => {
              wx.hideNavigationBarLoading();
            }
          })
        }
      },
      fail: () => {},
      complete: () => {}
    });
  }

})