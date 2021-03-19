var WXBizDataCrypt = require('/../utils/RdWXBizDataCrypt.js');
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal: {
      type: [Boolean, String],
      default: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    trueName:'',
    phone:''
  },
  lifetimes: {
    attached: function() {
      console.log("onLoad",app.globalData.trueName);
      this.setData({
        trueName:app.globalData.trueName||'',
        phone:app.globalData.phone||''
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show:function(options){
      console.log("onLoad");
      this.setData({
        trueName:app.globalData.trueName,
        phone:app.globalData.phone
      })

    },
    formInputChange(e) {
      const {
        field
      } = e.currentTarget.dataset
      console.log(field, e.detail.value);
      var value = e.detail.value
      
      this.setData({
        [`${field}`]: value
      })
    },
    setUserData:function(e){
      let trueName = this.data.trueName
      let phone = this.data.phone
      console.log(phone);
      if(!trueName){
        wx.showToast({
          title: '请输入姓名',
          icon: 'error',
          duration: 1500,
          mask: false
        });
        return
      }
      if(!(/^1[3456789]\d{9}$/.test(phone))){ 
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'error',
          duration: 1500,
          mask: false
        });
        return false; 
      } 
      
      app.setUserData('','','',phone,trueName,()=>{
        this.triggerEvent('customevent', {})
      })
    },
    hideModal:function(e){
      this.setData({
        showModal:false
      })
    },
    getPhoneNumber:function(e){
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        let session_key = app.globalData.session_key
        let appId = app.globalData.appId
        let encryptedData = e.detail.encryptedData
        let iv = e.detail.iv
        var pc = new WXBizDataCrypt(appId, session_key)
        var data = pc.decryptData(encryptedData, iv)
        var phone = data.phoneNumber
        this.setData({
          phone
        })
      } else {
        wx.showToast({
          title: '获取手机号码失败',
          icon: 'none',
          duration: 1500
        })
      }
    }

  }
})
