const app = getApp()
let classId,tid
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  onLoad: function (options) {
    classId = options.id
    tid= options.tid
    wx.hideShareMenu();
    app.checkLogin(()=>{
      this.inti();
    })
  },

  inti(){
    this.getTextbook()
  },

  getTextbook:function(){
    app.request({
      url:'/class/getTextbooks',
      data:{
        classId
      },
      barLoading:true
    }).then(res => {
      let textbooks = res.textbooks
      this.setData({
        textbooks
      })
    })
  },

  setTextbook:function(){
    let textbooks = this.data.textbooks
    let setTextbooks = []
    textbooks.forEach(element => {
      let subjectItem = {}
      subjectItem.subject = element.subject
      let vers = element.vers
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

    app.request({
      url:'/class/setTextbooks',
      data:{
        classId,textbooks:setTextbooks
      },
      barLoading:true,
      method:"POST"
    }).then(res => {
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
    })
  },

  back:function(e){
    let route = getCurrentPages()
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
      subject,
      index
    } = e.currentTarget.dataset
    let vers = this.data.textbooks[subject].vers
    vers.forEach((element,verIndex) => {
      this.setData({
        [`textbooks[${subject}].vers[${verIndex}].checked`]: index == verIndex
      })
    });
    
  },
  
})