const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    revenue:123456,
    list:[
      {
        nickName:'某某',
        avatarUrl:'https://thirdwx.qlogo.cn/mmopen/vi_32/hOibRpfJBjCZPIjUpXHMfSECtuoCr2ic4MQo1fNRu3bnaUhkrV4B7jdBB1QqbgK21IPibNyQRuoIiag8ESzlorqiaqg/132',
        content:'加入某某班级',
        created_at:'2020-02-21 12:23',
        price:888
      },
      {
        nickName:'默默',
        avatarUrl:'https://thirdwx.qlogo.cn/mmopen/vi_32/hOibRpfJBjCZPIjUpXHMfSECtuoCr2ic4MQo1fNRu3bnaUhkrV4B7jdBB1QqbgK21IPibNyQRuoIiag8ESzlorqiaqg/132',
        content:'加入某某班级',
        created_at:'2020-02-21 12:23',
        price:888
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin(()=>{

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
})