const app = getApp()
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}
Page({

  data: {
    followBys: ['微信', '电话', '短信', '面聊'],
    intentions: ['无意向', '低', '中', '高'],
    formData: {
      clientName: '',
      intention: '',
      remark: '',
      followBy: '',
      clientId: '',
      nextFollowTime: ''
    },
    remarks:[
      '已报名其他机构','没有相关意向，不考虑报名培训班'
    ]
  },


  onLoad: function (options) {
    app.checkLogin(() => {
      this.setData({
        [`formData.clientName`]: options.name,
        [`formData.clientId`]: options.id*1
      })
    })
  },

  formInputChange: function (e) {
    const {
      type,
      field
    } = e.currentTarget.dataset;
    let value;
    if (type === 'input') {
      value = e.detail.value;
    }else if(type === 'picker'){
      value = e.currentTarget.dataset.value
    }
    if(field === 'intention' && value >0){
      let nextFollowTime;
      if(value == 1){
        nextFollowTime =  formatDate(new Date(new Date().getTime()+3600000*24*7))
      }else if(value == 2){
        nextFollowTime =  formatDate(new Date(new Date().getTime()+3600000*24*3))
      }else if(value == 3){
        nextFollowTime =  formatDate(new Date(new Date().getTime()+3600000*24*1))
      }
      console.log(nextFollowTime)
      this.setData({
        [`formData.nextFollowTime`]:nextFollowTime
      })
    }
    this.setData({
      [`formData.${field}`]: value
    })
  },

  addFollow:function(){
    if(this.data.formData.clientName === ''){
      wx.showToast({
        title: '请输入学员名称',
        icon: 'none'
      });
      return
    }
    if(this.data.formData.followBy === ''){
      wx.showToast({
        title: '请选择来源途径',
        icon: 'none'
      });
      return
    }
    if(this.data.formData.intention === ''){
      wx.showToast({
        title: '请选择意向程度',
        icon: 'none'
      });
      return
    }
    if(this.data.formData.nextFollowTime === ''){
      wx.showToast({
        title: '请选择下次跟进日期',
        icon: 'none'
      });
      return
    }
    if(this.data.formData.remark === ''){
      wx.showToast({
        title: '请输入备注',
        icon: 'none'
      });
      return
    }
    app.request({
      url:'/client/follow/add',
      data:this.data.formData,
      method:'POST',
      loading:true,
      loadingTitle:'正在创建'
    }).then(() => {
      wx.showModal({
        content: '新增跟进成功，是否继续',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            
          }else{
            wx.navigateBack({
              delta: 1
            });
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    })
  }
})