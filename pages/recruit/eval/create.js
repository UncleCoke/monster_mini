const app = getApp()
let classId
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
    textbooks: [],
    formData: {
      class: {
        id: 0
      },
      classId: 0,
      evalPurpose: '',
      evalRange: 1,
      evalType: '',
      subject: "数学",
      subjectIndex: 0,
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
    multiIndex: [],
    units: []
  },

  onLoad: function (options) {
    classId = options.classId || 0;
    this.setData({
      classId
    })
    app.checkLogin(() => {
      this.inti();
    })
  },

  inti() {
    this.getTextbooks(true);
  },

  getTextbooks: function (isNoSet) {
    app.request({
      url: '/recruit/getTextbooksSimple',
      barLoading: true
    }).then(res => {
      let textbookList = res.textbookList;
      this.setData({
        textbookList,
      }, () => {
        if(!isNoSet){
          this.setTextbookPickData(this.data.formData.subjectIndex)
        }
      })
    })
  },

  setTextbookPickData: function (subjectIndex) {
    let multiArray = this.data.multiArray
    multiArray[2] = this.data.vers[subjectIndex]
    this.setData({
      multiArray,
      [`multiIndex[2]`]: 0
    }, () => {
      this.getTextbookId()
    })
  },

  getTextbookId: function () {
    let multiIndex = this.data.multiIndex
    let multiArray = this.data.multiArray
    let grade = multiArray[0][multiIndex[0]]
    let term = multiArray[1][multiIndex[1]]
    let ver = multiArray[2][multiIndex[2]]
    let subject = this.data.subjects[this.data.formData.subjectIndex]
    let textbookList = this.data.textbookList
    console.log(grade, term, ver, subject);
    textbookList.forEach(subjectItem => {
      if (subjectItem.subject == subject && subjectItem.grade == grade && subjectItem.term == term) {
        let verName = subjectItem.ver
        console.log(verName,ver,verName.indexOf(ver));
        if (verName.indexOf(ver) >= 0) {
          let textbookId = subjectItem.id
          console.log(textbookId, verName.indexOf(ver));
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

  select: function (e) {
    const {
      field,
    } = e.currentTarget.dataset;
    let value = e.currentTarget.dataset.value === undefined?e.detail.value:e.currentTarget.dataset.value
    if (field == "subjectIndex") {
      if (classId) {
        let vers = this.data.textbooks[value].vers
        let textbookId = 0
        vers.forEach(ver => {
          if (ver.checked) {
            textbookId = ver.id
          }
        });
        this.getUnit(textbookId)
        this.setData({
          [`formData.textbookId`]: textbookId,
          [`formData.subject`]: this.data.textbooks[value].subject
        })
      } else {
        this.setTextbookPickData(value)
      }
    }
    if (field == "evalType") {
      if (value == 2) {
        this.getUnit(this.data.formData.textbookId)
      }
    }
    if (field == "units") {
      let unitArr = value
      let units = this.data.units
      value = []
      let unitIds = []
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
    let formData = this.data.formData
    formData.subject = this.data.subjects[formData.subjectIndex]
    formData.evalType = formData.evalType * 1
    formData.textbook = this.data.multiArray[0][this.data.multiIndex[0]] + this.data.multiArray[1][this.data.multiIndex[1]]

    app.request({
      url:'/recruit/eval/create',
      data:formData,
      method:'POST',
      barLoading:true
    }).then(res => {
      let evalId = res.evalId
      wx.redirectTo({
        url: `/pages/recruit/share?id=${evalId}&&recruitType=1`
      })
    })
  },

  getUnit: function (textbookId) {
    app.request({
      url: '/recruit/getUnits',
      data: {
        textbookId
      },
      barLoading: true
    }).then(res => {
      let units = res.list
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
      wx.switchTab({
        url: '/pages/recruit/index'
      });
    }
  }
})