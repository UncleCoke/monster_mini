const app = getApp()
let unitId, page, pageCount = 1,
  pageSize = 20,
  classId
let checkGroup, checkValue, hasPickQuestionIds = [],
  hasPickQuestions = []

function unique(arr) {
  return Array.from(new Set(arr))
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    loadMore: true,
    recordCount: 0,
    questions: [],
    questionTypes: [{
        value: 0,
        name: "全部"
      },
      {
        value: 1,
        name: "单选题"
      },
      {
        value: 2,
        name: "判断题"
      },
      {
        value: 3,
        name: "填空题"
      },
      {
        value: 4,
        name: "问答题"
      },
      {
        value: 5,
        name: "共享题干题"
      },
      {
        value: 6,
        name: "多选题"
      },
      {
        value: 7,
        name: "连线题"
      }
    ],
    questionType: 0,
    difficulty: 0,
    difficulties: [{
      name: "全部",
      value: 0
    }, {
      name: "一星",
      value: 1
    }, {
      name: "二星",
      value: 2
    }, {
      name: "三星",
      value: 3
    }, {
      name: "四星",
      value: 4
    }, {
      name: "五星",
      value: 5
    }],
    questionIds: [],
    hasPickQuestionIds: [],
    hasPickQuestions: [],
    imgUrl:'http://img.uelink.com.cn/upload/xykj/eval/'
  },

  onLoad: function (options) {
    hasPickQuestionIds = [], checkGroup = [], checkValue = "", hasPickQuestions = []
    classId = options.classId
    unitId = options.unitId
    wx.hideShareMenu();
    app.checkLogin(()=>{
      this.inti();
    })
  },

  inti() {
    page = 1
    this.getQuestions(page)
  },

  onPullDownRefresh: function () {
    page = 1
    this.getQuestions(page)
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    if (page <= pageCount) {
      this.getQuestions(page)
    }
  },

  getQuestions: function (_page) {
    app.request({
      url:'/class/getQuestions',
      data:{
        questionType: this.data.questionType,
        difficulty: this.data.difficulty,
        unitId: unitId,
        page: _page,
        pageSize: pageSize,
        token: app.globalData.token
      },
      barLoading:true
    }).then(res => {
      var newList = res.list;
      var list = []
      if (page > 1) {
        list = this.data.list
      }
      list = list.concat(newList)
      pageCount = res.pageCount
      page += 1
      let recordCount = res.recordCount
      this.setData({
        list,
        recordCount,
      })
    })
  },

  checkbox(e) {
    checkValue = e.currentTarget.dataset.id
    let isUncheck = checkGroup.indexOf(checkValue)
    console.log('isUncheck', isUncheck);
    if (isUncheck == -1) {
      var index = hasPickQuestionIds.indexOf(checkValue)
      hasPickQuestionIds.splice(index, 1)
      hasPickQuestions.splice(index, 1)
    }
    this.setData({
      hasPickQuestionIds,
      hasPickQuestions
    })
  },

  formInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset
    var value = e.detail.value
    if (field == "questionIds") {
      var questionIds = e.detail.value
      var questions = this.data.list
      checkGroup = []
      questionIds.forEach(element => {
        checkGroup.push(questions[element].id)
        hasPickQuestionIds.push(questions[element].id)
        hasPickQuestions.push(questions[element])

      });
      hasPickQuestionIds = unique(hasPickQuestionIds)
      hasPickQuestions = unique(hasPickQuestions)
    }
    this.setData({
      [`${field}`]: value
    })
  },

  back: function (e) {
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

  pick: function () {
    wx.setStorageSync('questionIds', hasPickQuestionIds);
    wx.setStorage({
      key: 'hasPickQuestions',
      data: hasPickQuestions,
      success: (result) => {
        wx.navigateTo({
          url: `preview?classId=${classId}`
        });
      },
      fail: () => {},
      complete: () => {}
    });
  }
})