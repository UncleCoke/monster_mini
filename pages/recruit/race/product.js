const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['活动信息', '奖品设置'],
    activeTab: 1,
    raceData:{
      name:'',
      startTime:'',
      endTime:''
    },
    race:{
      rule:'用户每天可参与一次答题活动，答题完成后分数进行累积，当天答题次数用完后，可邀请好友参加活动，邀请人会等额获得好友答题获得的金币或红包奖励，以此类推，一天最多邀请30名好友参与活动。',
      type:0  //0：答题  1：组队
    },
    awards:[

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  tabChange: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: Number(index)
    })
  },

  setRaceData:function(e){
    let type = e.currentTarget.dataset.type;
    if(type === 'picker'){
      let field = e.currentTarget.dataset.field;
      this.setData({
        [`raceData.${field}`]: e.detail.dateString
      })
    }else{
      this.setData({
        [`raceData.name`]:e.detail.value
      })
    }
  },

  addAward:function(){
    let awards = this.data.awards;
    if(this.data.race.type === 0){
      awards.push({
        name:''
      })
    }else{
      awards.push({
        name:'',
        num:1
      })
    }
    this.setData({
      awards
    })
  },

  clearAward:function(e){
    let index = e.currentTarget.dataset.index;
    let awards = this.data.awards;
    awards.splice(index,1);
    this.setData({
      awards
    })
  },

  setAward:function(e){
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    console.log(index);
    if(type === 'input'){
      let field = e.currentTarget.dataset.field;
      this.setData({
        [`awards[${index}].${field}`]:e.detail.value
      },()=>{
        console.log(this.data.awards)
      })
    }else{
      let num = Number(this.data.awards[index].num);
      if(type === 'reduce' && num !== 1){
        num -= 1;
      }else if(type === 'add'){
        num += 1;
      }
      this.setData({
        [`awards[${index}].num`]:num
      })
    }
  },

  product:function(){
    let raceData = this.data.raceData;
    if(raceData.name === ''){
      wx.showToast({
        icon:'none',
        title: '请输入活动名称'
      });
      return
    }
    if(raceData.startTime === ''){
      wx.showToast({
        icon:'none',
        title: '请选择活动开始时间'
      });
      return
    }
    if(raceData.endTime === ''){
      wx.showToast({
        icon:'none',
        title: '请选择活动结束时间'
      });
      return
    }
    let awards = this.data.awards;
    if(awards.length === 0){
      wx.showToast({
        icon:'none',
        title: '请设置奖品'
      });
      return
    }
    let filter_awards = awards.filter(item => {
      if(this.data.race.type === 0){
        return item.name === ''
      }else{
        return item.name === '' || item.num === ''
      }
    })
    if(filter_awards.length > 0){
      wx.showToast({
        icon:'none',
        title: '请补充好奖品数据'
      });
      return
    }
    wx.navigateTo({
      url: 'share'
    });
  }

})