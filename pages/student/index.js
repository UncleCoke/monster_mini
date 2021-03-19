const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:['潜在生源','学生信息'],
    activeTab:0,
    imgUrl:'http://img.uelink.com.cn/upload/xykj/student/',
    potentialList:[
      {
        userId:1,
        nickName:'野原新之助',
        avatarUrl:'https://thirdwx.qlogo.cn/mmopen/vi_32/hOibRpfJBjCZPIjUpXHMfSECtuoCr2ic4MQo1fNRu3bnaUhkrV4B7jdBB1QqbgK21IPibNyQRuoIiag8ESzlorqiaqg/132',
        phone:'13123212312',
        lastLoginTime:'2020-02-21 12:23'
      },{
        userId:2,
        nickName:'洛奇亚',
        avatarUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg',
        phone:'12312312312',
        lastLoginTime:'2020-02-21 12:23'
      }
    ],
    studentList:[
      {
        userId:1,
        nickName:'野原新之助',
        avatarUrl:'https://thirdwx.qlogo.cn/mmopen/vi_32/hOibRpfJBjCZPIjUpXHMfSECtuoCr2ic4MQo1fNRu3bnaUhkrV4B7jdBB1QqbgK21IPibNyQRuoIiag8ESzlorqiaqg/132',
        phone:'13123212312',
        lastLoginTime:'2020-02-21 12:23'
      },{
        userId:2,
        nickName:'洛奇亚',
        avatarUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg',
        phone:'12312312312',
        lastLoginTime:'2020-02-21 12:23'
      }
    ],
    isFind:false,
    from:['电话','微信','短信'],
    status:['待跟进','跟进中','已报名','无效用户'],
    degree:['高','中','低'],
    formData:{
      name:'',
      phone:'',
      from:'',
      status:'',
      degree:'',
      time:''    
    }
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

  tabChange:function(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeTab:index
    })
  },

  call:function(e){
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber:phone
    });
  },

  potentialDetail:function(){
    wx.navigateTo({
      url: 'potentialDetail'
    });
  },

  setFind:function(){
    let isFind = this.data.isFind;
    this.setData({
      isFind:!isFind
    })
  }
})