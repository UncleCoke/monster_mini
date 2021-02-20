const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        id: 1,
        name: 'one'
      },
      {
        id: 2,
        name: 'two'
      },
      {
        id: 3,
        name: 'three'
      },
      {
        id: 4,
        name: 'four'
      },
      {
        id: 5,
        name: 'five'
      },
      {
        id: 6,
        name: 'six'
      },
      {
        id: 7,
        name: 'seven'
      },
      {
        id: 8,
        name: 'eight'
      },
      {
        id: 9,
        name: 'nine'
      },
    ],
    activeIndex: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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

  /**
   * 开始抽奖
   * index：第几个奖品(下标)
   * circleNum：先转几圈
   * startSpeed：起始速度
   * minSpeed：最低速度
   * variableSpeed：变速
   * sort:奖品下标排序
   */
  start: function ({
    index=2,
    circleNum = 3,
    startSpeed = 500,
    variableSpeed = 50,
    minSpeed = 50,
    sort = [0, 1, 2, 5, 8, 7, 6, 3]
  } = {}) {
    //获取最后一圈顺序
    let newSort = sort.slice(0, index+1);
    //总顺序
    let allSort = [];
    for (let i = 0; i < circleNum; i++) {
      allSort = allSort.concat(sort);
    }
    allSort = allSort.concat(newSort);
    //当前位置 & 当前速度
    let nowStep = 0,
      speed = startSpeed;
    let setTime = () => {
      if (nowStep < allSort.length) {
        setTimeout(() => {
          this.setData({
            activeIndex: allSort[nowStep]
          })
          //变速设置
          let state = Math.floor(allSort.length / 3);
          if(nowStep > 0 && nowStep <  state){
            //加速
            speed = speed <= minSpeed?minSpeed:(speed - variableSpeed)
          }else if(nowStep <= 2*state){
            //匀速
          }else{
            //减速
            speed = speed + variableSpeed
          }
          nowStep += 1;
          setTime();
        }, speed)
      }else{
        wx.showModal({
          title: '恭喜你',
          content: '中了奖了',
          showCancel: false,
          confirmText: '我知道了',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              
            }
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }
    }
    setTime();
  }
})