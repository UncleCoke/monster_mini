const app = getApp()
let classId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasJoin: -2,
    showModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    classId = options.id;

    app.checkLogin(() => {
      this.inti();
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getClassDetail();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  inti: function () {
    this.setData({
      teacherId: app.globalData.uid,
      parentId: app.globalData.parentId || 0,
      nickName: app.globalData.nickName,
      phone: app.globalData.phone,
      avatarUrl: app.globalData.avatarUrl,
      userInfo: app.globalData.userInfo
    })
    this.getClassDetail()
  },

  getClassDetail: function () {
    app.request({
      url: app.globalData.apiUrl + '/class/detail',
      data: {
        classId
      },
      barLoading: true
    }).then(res => {
      let classDetail = res.class;
      let teachers = classDetail.teachers
      let teacherId = app.globalData.uid
      let parentId = app.globalData.parentId
      if (classDetail.teacherId == teacherId || classDetail.parentId == parentId) {
        this.setData({
          master: 1
        })
      }
      teachers.forEach(element => {
        if (element.teacherId == teacherId || element.parentId == parentId) {
          this.setData({
            hasJoin: element.status
          })
        }
      });
      this.setData({
        classDetail
      })
    })
  },

  setUserData: function (e) {
    let rawData = e.detail.rawData
    let encryptedData = e.detail.encryptedData
    let iv = e.detail.iv
    app.setUserData(encryptedData, iv, rawData, '', '', () => {
      this.setData({
        showModal: true
      })
    })
  },

  reload: function () {
    app.login(() => {
      this.inti()
    })
  },

  join: function () {
    app.request({
      url: app.globalData.apiUrl + '/class/join',
      data: {
        classId,
        teacherId: app.globalData.uid
      },
      barLoading: true
    }).then(() => {
      wx.showModal({
        title: '申请成功',
        content: '请等待班主任审核',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            this.getClassDetail()
          }
        },
        fail: () => {},
        complete: () => {}
      });
    })
  },

  back: function () {
    let route = getCurrentPages()
    if (route.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.switchTab({
        url: 'list'
      });
    }
  },

  action: function () {
    let type = e.currentTarget.dataset.type
    let url = e.currentTarget.dataset.url
    let hasJoin = this.data.hasJoin
    let isMaster = this.data.master >= e.currentTarget.dataset.master
    if (hasJoin < 1) {
      wx.showModal({
        title: '温馨提示',
        content: '加入班级之后才能操作哦',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#3CC51F'
      });
      return
    }
    if (!isMaster) {
      wx.showModal({
        title: '温馨提示',
        content: '班主任才能操作哦',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#3CC51F'
      });
      return
    }
    if (type == 'page') {
      wx.navigateTo({
        url: `${url}?id=${this.data.classDetail.id}&tid=${this.data.classDetail.teacherId}&className=${this.data.classDetail.name}`
      });
    } else if (type == 'switch') {
      wx.switchTab({
        url: `${url}?id=${this.data.classDetail.id}&tid=${this.data.classDetail.teacherId}`
      });
    }
  },

  enterClass: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateToMiniProgram({
      appId: 'wxcfe4dc8683b0606f',
      path: `/packageB/pages/class/indexByStudent?classmateId=${id}`,
      envVersion: 'release'
    });
  },

  quit: function () {
    wx.showModal({
      title: '退出班级',
      content: '是否将退出该班级？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          this.checkStatus(-10, this.data.teacherId)
        }
      },
      fail: () => {},
      complete: () => {}
    });
  },

  checkStatus: function (status, teacherId) {
    app.request({
      url: app.globalData.apiUrl + '/class/checkJoin',
      data: {
        classId,
        teacherId,
        status
      },
      loading: true,
      loadingTitle: '正在处理'
    }).then(res => {
      this.inti();
    })
  }
})