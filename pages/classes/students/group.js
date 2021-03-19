const app = getApp();
let classId, type, groupId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    studentIds: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    classId = options.classId;
    let studentList = JSON.parse(options.studentList);
    let isMaster = options.isMaster == 'true'?true:false;
    this.setData({
      studentList,
      isMaster
    })
    type = options.type
    this.setData({
      type
    }, () => {
      if (type === 'edit') {
        if(isMaster){
          wx.setNavigationBarTitle({
            title: '编辑小组'
          });
        }else{
          wx.setNavigationBarTitle({
            title: '小组详情'
          });
        }
        let group = JSON.parse(options.group);
        groupId = group.id
        this.setData({
          name: group.name,
          selectStudentList:group.studentList,
          studentIds: group.studentIds.split(',').map(Number) || []
        })
      }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  formInputChange: function (e) {
    let name = e.detail.value;
    this.setData({
      name
    })
  },

  select: function (e) {
    let id = e.currentTarget.dataset.id;
    let studentIds = this.data.studentIds;
    let index = studentIds.indexOf(id);
    if (index > -1) {
      studentIds.splice(index, 1);
    } else {
      studentIds.push(id)
    }
    this.setData({
      studentIds
    })
  },

  back: function () {
    wx.navigateBack({
      delta: 1
    });
  },

  add: function () {
    if (this.data.name == '') {
      wx.showToast({
        title: '请输入小组名称',
        icon: 'none',
      });
      return;
    }
    if (this.data.studentIds.length == 0) {
      wx.showToast({
        title: '请先选择学生',
        icon: 'none',
      });
      return;
    }

    let url = app.globalData.apiUrl + '/class/students/group/create'
    let data = {
      classId: classId,
      token: app.globalData.token,
      groupName: this.data.name,
      studentIds: this.data.studentIds.toString()
    }
    wx.showLoading({
      title: '正在创建',
      mask: true,
    });
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          wx.showModal({
            title: '创建成功',
            content: '是否继续创建新的小组',
            showCancel: true,
            cancelText: '返回',
            cancelColor: '#000000',
            confirmText: '继续',
            confirmColor: '#3CC51F',
            success: (result) => {
              if (result.confirm) {
                this.setData({
                  name: '',
                  studentIds: []
                })
              } else {
                this.back();
              }
            },
            fail: () => {},
            complete: () => {}
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
        wx.hideLoading();
      }
    })

  },

  edit: function () {
    if (this.data.name == '') {
      wx.showToast({
        title: '请输入小组名称',
        icon: 'none',
      });
      return;
    }
    if (this.data.studentIds.length == 0) {
      wx.showToast({
        title: '请先选择学生',
        icon: 'none',
      });
      return;
    }

    let url = app.globalData.apiUrl + '/class/students/group/edit'
    let data = {
      classId: classId,
      token: app.globalData.token,
      groupName: this.data.name,
      studentIds: this.data.studentIds.toString(),
      groupId
    }
    wx.showLoading({
      title: '正在编辑',
      mask: true,
    });
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          this.back();
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
        wx.hideLoading();
      }
    })
  },

  delete: function () {
    wx.showModal({
      title: '提示',
      content: '是否继续删除操作',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          let url = app.globalData.apiUrl + '/class/students/group/delete'
          let data = {
            classId: classId,
            token: app.globalData.token,
            groupId: groupId
          }
          wx.showLoading({
            title: '正在删除',
            mask: true,
          });
          wx.request({
            url: url,
            data: data,
            success: (res) => {
              wx.hideLoading();
              if (res.data.code == 0) {
                this.back();
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
              wx.hideLoading();
            }
          })
        }
      },
      fail: () => {},
      complete: () => {}
    });
  }
})