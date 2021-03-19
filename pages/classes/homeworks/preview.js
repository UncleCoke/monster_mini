const app = getApp()
var classId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    loadMore: true,
    recordCount:0,
    questions:[],
    questionTypes:[
    {value:0,name:"全部"},
    {value:1,name:"单选题"},
    {value:2,name:"判断题"},
    {value:3,name:"填空题"},
    {value:4,name:"问答题"},
    {value:5,name:"共享题干题"},
    {value:6,name:"多选题"},
    {value:7,name:"连线题"}],
    questionType:0,
    difficulty:0,
    difficulties:[{name:"全部",value:0},{name:"一星",value:1},{name:"二星",value:2},{name:"三星",value:3},{name:"四星",value:4},{name:"五星",value:5}],
    questionIds:[],

  },
  onLoad: function (options) {
    classId= options.classId
    wx.hideShareMenu();
    if (!app.globalData.token) {
      app.login((res) => {
        this.inti()
      })
  
    } else {
      this.inti()
    }
  },

  inti(){
    var hasPickQuestions = wx.getStorageSync('hasPickQuestions');
    if(hasPickQuestions){
      this.setData({
        hasPickQuestions
      })
    }
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
  pick:function(){
    var route = getCurrentPages()
    if (route.length > 2) {
      wx.navigateBack({
        delta: 2
      });
    } else {
      wx.redirectTo({
        url: `create?classId=${classId}`
      });
    }
  },
  
  
})