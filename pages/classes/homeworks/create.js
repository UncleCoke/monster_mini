const app = getApp()
let classId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjects: ["数学", "语文", "英语"],
    classes: [],
    types: [{
      type: 3,
      name: "课时练习"
    }, {
      type: 2,
      name: "组题练习"
    }, {
      type: 1,
      name: "单元测验"
    }, ],
    ranges: [{
        range: 1,
        name: "全班布置"
      }, {
        range: 2,
        name: "分组布置"
      },
      /*{
          range: 3,
          name: "指定学生"
      }, */
    ],
    rules: [{
      rule: 1,
      name: "相同题目"
    }, {
      rules: 2,
      name: "AI智适应"
    }],
    textbooks: [],
    formData: {
      classId: 0,
      type: 3,
      range: 1,
      rule: 1,
      subject: "数学",
      subjectindex: 0,
      unitId: 0,
      questionIds: [],
      endTime: "20:00",
      studentIds: ''
    },
    questionIds: [],
    groupModal: false,
    ranger:'全班学生'
  },

  onLoad: function (options) {
    classId = options.classId || 0
    this.setData({
      classId: classId,
    })
    wx.hideShareMenu();
    app.checkLogin(()=>{
      this.inti();
    })
  },

  onShow: function () {
    let questionIds = wx.getStorageSync('questionIds');
    if (questionIds) {
      this.setData({
        [`formData.questionIds`]: questionIds,
      })
    }
  },

  inti() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1
    let day = date.getDate()
    let today = `${year}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`
    console.log(year, month, day);
    if (classId) {
      this.setData({
        [`formData.classId`]: classId,
        [`formData.endDate`]: today,
        today: today
      })
      this.getTextbook()
      this.getClassDetail()
      this.getGroupList()
      this.getStudentList()
    }
  },

  formInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset
    var value = e.currentTarget.dataset.value !== undefined?e.currentTarget.dataset.value:e.detail.value
    console.log(e,field,value);
    if (field == "subjectindex") {
      if (classId) {
        var vers = this.data.textbooks[value].vers
        var textbookId = 0
        vers.forEach(ver => {
          if (ver.checked) {
            textbookId = ver.id
          }
        });
        this.getUnit(textbookId)
        this.setData({
          [`formData.subject`]: this.data.textbooks[value].subject,
          [`formData.unitId`]: 0,
          [`formData.unit`]:'',
          [`formData.questionIds`]: []
        })
        try {
          wx.removeStorageSync('questionIds')
        } catch (e) {}
        try {
          wx.removeStorageSync('questions')
        } catch (e) {}
      }
    }
    if (field == "unitId") {
      var index = e.detail.value
      var units = this.data.units
      if (index.indexOf("_") > -1) {
        var indexArr = index.split("_")
        console.log(indexArr);
        var value = units[indexArr[0]].children[indexArr[1]].id,
          unit = units[indexArr[0]].children[indexArr[1]].name
      } else {
        var unitIndex = e.detail.value
        var value = units[unitIndex].id,
          unit = units[unitIndex].name
      }
      this.setData({
        ['formData.unit']: unit
      })
    }
    if (field == 'range') {
      if (value == 1) {
        let studentIds = this.data.studentList.map(item => item.id);
        this.setData({
          [`formData.studentIds`]: studentIds,
          ranger:'全班学生'
        })
      } else {
        if(this.data.groupList.length == 0){
          wx.showToast({
            title: '该班级暂无分组',
            icon: 'none',
          });
          return;
        }else{
          this.setGroupModal();
        }
      }
    }
    this.setData({
      [`formData.${field}`]: value
    })
  },

  create: function (e) {
    console.log(this.data.formData);
    var formData = this.data.formData
    if (this.data.classDetail.studentCount < 1) {
      wx.showModal({
        title: '温馨提示',
        content: '该班级人数不足，无法发布评测！',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#3CC51F'
      });
      return
    }
    if (!formData.unitId) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择单元或课时',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#3CC51F'
      });
      return
    }
    if ((formData.type == 2) && formData.questionIds.length < 5) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择至少5题',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#3CC51F'
      });
      return
    }
    formData.subject = this.data.textbooks[formData.subjectindex].subject
    formData.ends_at = `${formData.endDate} ${formData.endTime}`
    app.request({
      url:'/class/createHomeworkV2',
      data:formData,
      barLoading:true,
      method:'POST'
    }).then(res => {
      var homeworkId = res.homeworkId
      try {
        wx.removeStorageSync('questionIds')
      } catch (e) {}
      try {
        wx.removeStorageSync('questions')
      } catch (e) {}
      wx.showModal({
        title: '发布成功',
        content: '',
        showCancel: true,
        cancelText: '返回',
        cancelColor: '#000000',
        confirmText: '查看',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            wx.redirectTo({
              url: `detail?id=${homeworkId}&classId=${classId}`
            });
          } else {
            this.back()
          }
        },
        fail: () => {},
        complete: () => {}
      });
    })
  },

  getUnit: function (textbookId) {
    app.request({
      url:'/class/getUnits',
      data:{
        textbookId
      },
      barLoading:true
    }).then(res => {
      let units = res
      this.setData({
        units
      })
    })
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal() {
    this.setData({
      modalName: null
    })
  },

  back: function () {
    let route = getCurrentPages()
    if (route.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.redirectTo({
        url: `../classIndex?id=${classId}`
      });
    }
  },

  getTextbook: function () {
    app.request({
      url:'/class/getTextbooks',
      data:{
        classId
      },
      barLoading:true
    }).then(res => {
      let textbooks = res.textbooks
      let textbookId = 0
      textbooks.forEach(element => {
        if (element.subject == this.data.formData.subject) {
          let vers = element.vers
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
    })
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
      this.setData({
        classDetail
      })
    })
  },

  pickTopic: function () {
    wx.navigateTo({
      url: `pickTopic?unitId=${this.data.formData.unitId}&classId=${classId}`
    });
  },

  //获取分组列表
  getGroupList: function () {
    app.request({
      url:'/class/students/group/get',
      data:{
        classId
      },
      barLoading:true
    }).then(res => {
      let groupList = res.list
      this.setData({
        groupList
      })
    })
  },

  //获取学生列表
  getStudentList: function () {
    app.request({
      url:'/class/students',
      data:{
        classId
      },
      barLoading:true
    }).then(res => {
      let studentList = res.studentList
      let studentIds = studentList.map(item => item.id);
      this.setData({
        studentList,
        [`formData.studentIds`]: studentIds
      })
    })
  },

  setGroupModal: function () {
    let groupModal = this.data.groupModal;
    this.setData({
      groupModal: !groupModal
    })
  },

  getGroup:function(e){
    let group = e.currentTarget.dataset.group;
    this.setData({
      [`formData.studentIds`]:group.studentIds.split(','),
      ranger:`${group.name}(${group.studentList.length}人)`
    })
    this.setGroupModal();
  }
})