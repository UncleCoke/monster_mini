const app = getApp()
var classId,tid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []

  },
  onLoad: function (options) {
    classId = options.id,tid= options.tid
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
    this.getTextbook()
  },
  getTextbook:function(){

    var url = app.globalData.apiUrl + '/class/getTextbooks'
    var data = {
      classId:classId,
      token:app.globalData.token
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh()
        if (res.data.code == 0) {
          console.log(res.data.data)
          var textbooks = res.data.data.textbooks
          this.setData({
            textbooks
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
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading();
      }
    })
  },
  setTextbook:function(){

    var textbooks = this.data.textbooks
    var setTextbooks = []
    textbooks.forEach(element => {
      var subjectItem = {}
      subjectItem.subject = element.subject
      var vers = element.vers
      if(vers.length == 1){
        subjectItem.textbookId = vers[0].id
      }else{
        vers.forEach(ver => {
          if(ver.checked){
            subjectItem.textbookId = ver.id
          }
        });
      }
      setTextbooks.push(subjectItem)
    });
    console.log(setTextbooks);
    var url = app.globalData.apiUrl + '/class/setTextbooks'
    var data = {
      classId:classId,
      textbooks:setTextbooks,
      token:app.globalData.token
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      method:"POST",
      data: data,
      success: (res) => {
        wx.hideNavigationBarLoading();
        if (res.data.code == 0) {
          wx.showModal({
            title: '温馨提示',
            content: '设置成功',
            showCancel: false,
            confirmText: '返回',
            confirmColor: '#3CC51F',
            success: (result) => {
              if(result.confirm){
                this.back()
              }
            },
            fail: ()=>{},
            complete: ()=>{}
          });
          
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
        wx.hideNavigationBarLoading();
      }
    })
  },
  back:function(e){
    var route = getCurrentPages()
    if(route.length>1){
      wx.navigateBack({
        delta: 1
      });
    }else{
      
      wx.switchTab({
        url: 'list'
      });
    }
    
  },
  formInputChange(e) {
    const {
      subject
    } = e.currentTarget.dataset
    var verIndex = e.detail.value

    var vers = this.data.textbooks[subject].vers

    vers.forEach((element,index) => {
      this.setData({
        [`textbooks[${subject}].vers[${index}].checked`]: index == verIndex
      })
    });
    
  },
  
})