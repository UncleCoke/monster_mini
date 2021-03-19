const app = getApp()
var unitId, page, pageCount = 1,
  pageSize = 20,
  classId
var checkGroup, checkValue, hasPickQuestionIds = [],
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
    hasPickQuestions: []

  },
  onLoad: function (options) {
    hasPickQuestionIds = [], checkGroup = [], checkValue = "", hasPickQuestions = []
    classId = options.classId
    unitId = options.unitId
    wx.hideShareMenu();
    if (!app.globalData.token) {
      app.login((res) => {
        this.inti()
      })

    } else {
      this.inti()
    }
  },
  onShow: function () {
    // var questions = wx.getStorageSync('questions');
    // if(questions){
    //   this.setData({
    //     questions
    //   })
    // }
  },

  inti() {
    page = 1
    this.getQuestions(page)
  },
  onPullDownRefresh: function () {
    page = 1
    this.getQuestions(page)
  },
  onReachBottom: function () {
    if (page <= pageCount) {
      this.getQuestions(page)
    }
  },

  getQuestions: function (_page) {

    var url = app.globalData.apiUrl + '/class/getQuestions'
    var data = {
      questionType: this.data.questionType,
      difficulty: this.data.difficulty,
      unitId: unitId,
      page: _page,
      pageSize: pageSize,
      token: app.globalData.token
    }
    this.setData({
      loadMore: true
    })
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        this.setData({
          loadMore: false
        })
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh()
        if (res.data.code == 0) {

          var newList = res.data.data.list;
          var list = []
          if (page > 1) {
            list = this.data.list
          }
          list = list.concat(newList)
          pageCount = res.data.data.pageCount
          page += 1
          let recordCount = res.data.data.recordCount

          this.setData({
            list,
            recordCount,
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
        this.setData({
          loadMore: false
        })
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading();
      }
    })
  },
  checkbox(e) {

    checkValue = e.currentTarget.dataset.id
    // console.log('checkbox',checkValue,checkGroup);
    var isUncheck = checkGroup.indexOf(checkValue)
    console.log('isUncheck', isUncheck);
    if (isUncheck == -1) {
      // console.log('请移除',checkValue,hasPickQuestionIds);
      var index = hasPickQuestionIds.indexOf(checkValue)
      hasPickQuestionIds.splice(index, 1)
      hasPickQuestions.splice(index, 1)
    }

    // console.log('移除了',hasPickQuestionIds);
    this.setData({
      hasPickQuestionIds,
      hasPickQuestions
    })
  },
  formInputChange(e) {
    const {
      field,
      type,
      range
    } = e.currentTarget.dataset
    // console.log(field, type, range, e.detail.value,e);
    // console.log(e.detail.value);

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
      // console.log('更新了', hasPickQuestionIds, hasPickQuestions)


    }
    this.setData({
      [`${field}`]: value
    })
  },
  back: function (e) {
    var route = getCurrentPages()
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
  },


})