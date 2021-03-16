const app = getApp()
var classId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjects: ["数学", "语文", "英语"],
    classes: [{
      id: 1,
      name: "一年级一班",
      studentCount: 30,
      grade: "三年级"
    }, {
      id: 2,
      name: "一年级2班",
      studentCount: 40,
      grade: "三年级"
    }],
    evalTypes: [{
      type: 0,
      name: "单元评测"
    }, {
      type: 1,
      name: "期中评测"
    }, {
      type: 2,
      name: "期末测评"
    }],
    evalRanges: [{
      type: 1,
      name: "个人评测"
    }, {
      type: 2,
      name: "班级评测"
    }],
    evalPurposes: ["宣传推广", "辅助教学", "其他"],
    topicsCounts: [30, 25, 20],
    textbooks: [],
    formData: {
      class: {
        id: 0
      },
      classId: 0,
      evalPurpose: '',
      evalRange: 1,
      evalType: 0,
      subject: "数学",
      subjectindex: 0,
      textbook: '',
      textbookId: 0,
      topicsCount: 30,
      unitIds: '',
      units: []
    },
    vers: [
      ["人教版", "北师大版"],
      ["人教部编版"],
      ["新人教版", "外研版", "科普版"]
    ],
    multiArray: [
      ['三年级', '四年级', '五年级', '六年级'],
      ['上册', '下册'],
      ["人教版", "北师大版"],

    ],
    multiIndex: [0, 0, 0],
    units: []

  },

  onLoad: function (options) {
    classId = options.classId || 0
    this.setData({
      classId: classId,

    })
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
    if (classId) {
      this.setData({
        [`formData.classId`]: classId,
        [`formData.evalRange`]: 2
      })
      this.getTextbook()
      this.getClassDetail()

    } else {
      this.getTextbooks()
      this.getClassList()
    }


  },
  getTextbooks: function () {
    var url = app.globalData.apiUrl + '/public/getTextbooksSimple'
    var data = {}
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      method: "GET",
      data: data,
      success: (res) => {
        wx.hideNavigationBarLoading();
        if (res.data.code == 0) {
          var textbookList = res.data.data.textbookList;
          this.setData({
            textbookList,
          }, () => {
            this.setTextbookPickData(this.data.formData.subjectindex)
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
  setTextbookPickData: function (subjectindex) {
    var multiArray = this.data.multiArray
    multiArray[2] = this.data.vers[subjectindex]
    // console.log(multiArray);
    this.setData({
      multiArray,
      [`multiIndex[2]`]: 0
    }, () => {
      this.getTextbookId()
    })
  },
  getTextbookId: function () {
    var multiIndex = this.data.multiIndex
    var multiArray = this.data.multiArray
    var grade = multiArray[0][multiIndex[0]]
    var term = multiArray[1][multiIndex[1]]
    var ver = multiArray[2][multiIndex[2]]
    var subject = this.data.subjects[this.data.formData.subjectindex]
    var textbookList = this.data.textbookList
    console.log(grade,term,ver,subject);
    textbookList.forEach(subjectItem => {
      if (subjectItem.subject == subject && subjectItem.grade == grade && subjectItem.term == term ) {
        var  verName = subjectItem.ver
        if(verName.indexOf(ver)>=0){
          var textbookId = subjectItem.id
          console.log(textbookId,verName.indexOf(ver));
          if (this.data.formData.evalType == 0) {
            this.getUnit(textbookId)
          }
          this.setData({
            [`formData.textbookId`]: textbookId
          })
        }
      }
    })
  },

  formInputChange(e) {
    const {
      field,
      type,
      range
    } = e.currentTarget.dataset
    // console.log(field, type, range, e.detail.value);
    if (type == 'picker') {
      var value = range[e.detail.value]
    } else {
      var value = e.detail.value

    }
    if (field == "subjectindex") {
      if (classId) {

        var vers = this.data.textbooks[e.detail.value].vers
        var textbookId = 0
        vers.forEach(ver => {
          if (ver.checked) {
            textbookId = ver.id
          }
        });
        this.getUnit(textbookId)
        this.setData({
          [`formData.textbookId`]: textbookId,
          [`formData.subject`]: this.data.textbooks[e.detail.value].subject
        })

      } else {
        this.setTextbookPickData(value)
      }

    }
    if (field == "evalType") {
      if (e.detail.value == 2) {
        this.getUnit(this.data.formData.textbookId)
      }
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
  MultiChange(e) {
    this.setData({
      multiIndex: e.detail.value,
    }, () => {
      this.getTextbookId()
    })
  },

  create: function (e) {
    console.log(this.data.formData);
    var formData = this.data.formData
    if (formData.class.id) {
      formData.classId = formData.class.id
    }

    if (formData.evalRange == 2 && !formData.classId) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择班级',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#3CC51F'
      });
      return
    }

    if (formData.evalRange == 2 && formData.class.studentCount < 1) {
      wx.showModal({
        title: '温馨提示',
        content: '该班级人数不足，无法发布评测！',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#3CC51F'
      });
      return
    }

    if (formData.evalType == 0 && !formData.unitIds) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择至少一个单元',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#3CC51F'
      });
      return
    }



    formData.subject = this.data.subjects[formData.subjectindex]
    formData.evalType = formData.evalType * 1
    // if(formData.units){
    //   formData.units = formData.units.toString()
    // }

    formData.textbook = this.data.multiArray[0][this.data.multiIndex[0]] + this.data.multiArray[1][this.data.multiIndex[1]]

    var url = app.globalData.apiUrl + '/public/teacher/eval/create'
    var data = formData
    data.token = app.globalData.token
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      method: "POST",
      data: data,
      success: (res) => {
        wx.hideNavigationBarLoading();
        if (res.data.code == 0) {
          console.log(res.data.data.evalId);
          var evalId = res.data.data.evalId
          wx.redirectTo({
            url: `detail?id=${evalId}`
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
  },
  getUnit: function (textbookId) {
    var url = app.globalData.apiUrl + '/public/teacher/unit/list'
    var data = {
      textbookId: textbookId
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideNavigationBarLoading();
        if (res.data.code == 0) {
          let units = res.data.data.list
          this.setData({
            units
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
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  back: function (e) {
    var route = getCurrentPages()
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
  getClassList: function () {
    var url = app.globalData.apiUrl + '/class/list'
    var data = {
      teacherId: app.globalData.uid,
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
          let classList = res.data.data.list
          this.setData({
            classList
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
  getTextbook: function () {

    var url = app.globalData.apiUrl + '/class/getTextbooks'
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
          var textbooks = res.data.data.textbooks
          var textbookId = 0
          textbooks.forEach(element => {
            if (element.subject == this.data.formData.subject) {
              var vers = element.vers
              vers.forEach(ver => {
                if (ver.checked) {
                  textbookId = ver.id
                }
              });
            }
          });
          this.getUnit(textbookId)
          this.setData({
            textbooks,
            [`formData.textbookId`]: textbookId
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
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading();
      }
    })
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
          this.setData({
            [`formData.class`]: classDetail
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
})