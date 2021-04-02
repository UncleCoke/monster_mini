const app = getApp();
let templateId;
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
Page({

  data: {
    tabs: ['活动信息', '奖品设置'],
    activeTab: 0,
    contactQrcode:'',
    contactUrl:''
  },

  onLoad: function (options) {
    this.setDate();
    templateId = options.id*1;
    app.checkLogin(() => {
      this.getTemplateDetail();
    })
  },

  tabChange: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: Number(index)
    })
  },

  setRaceData: function (e) {
    const {
      type,
      field
    } = e.currentTarget.dataset;
    if (type === 'picker') {
      this.setData({
        [`template.${field}`]: e.detail.dateString
      })
    } else {
      this.setData({
        [`template.title`]: e.detail.value
      })
    }
  },

  setAward: function (e) {
    const {
      index,
      type,
      field
    } = e.currentTarget.dataset
    if (type === 'input') {
      this.setData({
        [`template.eventAward[${index}].${field}`]: e.detail.value
      })
    } else {
      let num = Number(this.data.template.eventAward[index].number);
      if (type === 'reduce' && num !== 1) {
        num -= 1;
      } else if (type === 'add') {
        num += 1;
      }
      this.setData({
        [`template.eventAward[${index}].number`]: num
      })
    }
  },

  product: function () {
    let titleTip = this.formValidate();
    if (titleTip) {
      wx.showToast({
        title:titleTip,
        icon: 'none',
      });
      return;
    }
    if(this.data.activeTab === 0){
      this.setData({
        activeTab:1
      })
      return;
    }
    let {
      startTime,endTime,title,eventType,eventAward,eventIntro
    } = this.data.template
    app.request({
      url: '/recruit/event/create',
      data: {
        templateId,
        startTime,
        endTime,
        title,
        eventType,
        introduce:eventIntro?eventIntro:'',
        eventAward,
        contactQrcode:this.data.contactQrcode
      },
      method:'POST',
      loading:true,
      loadingTitle:'正在创建'
    }).then(res => {
      wx.navigateTo({
        url: `/pages/recruit/share?id=${res.id}&&recruitType=2`
      });
    })
  },

  getTemplateDetail: function () {
    app.request({
      url: '/recruit/event/template/detail',
      data: {
        id:templateId
      },
      barLoading: true
    }).then(res => {
      this.setData({
        template: res
      },()=>{
        this.setDate();
      })
    })
  },

  formValidate: function () {
    let template = this.data.template;
    let title;
    if(this.data.activeTab === 0){
      if (!template.title) {
        title = '请输入活动名称'
        return title;
      }
      if (!template.startTime) {
        title = '请选择活动开始时间'
        return title;
      }
      if (!template.endTime) {
        title = '请选择活动结束时间'
        return title;
      }
      let nowTime = new Date().getTime();
      let startTime = new Date(template.startTime).getTime();
      let endTime = new Date(template.endTime).getTime();
      /*if (startTime < nowTime) {
        title = '开始时间不能小于当前时间'
        return title;
      }*/
      if (endTime < nowTime) {
        title = '结束时间不能小于当前时间'
        return title;
      }
      if (endTime < startTime) {
        title = '结束时间不能小于开始时间'
        return title;
      }
    }else{
      let filter_awards = template.eventAward.filter(item => {
        if(template.eventType == 2){
          return item.name == '' || item.name == '奖品名称(请输入)' || item.number == '' || item.rate == ''
        }else{
          return item.name == '' || item.name == '奖品名称(请输入)' || item.number == ''
        }
      })
      if (filter_awards.length > 0) {
        title = '请补充好奖品数据'
        return title;
      }
      if(!this.data.contactQrcode){
        title = '请上传联系二维码'
        return title;
      }
    }
    return title
  },

  //默认时间
  setDate:function(){
    let today = new Date();
    let endDay = new Date(new Date().getTime()+3600000*24*7);
    this.setData({
      [`template.startTime`]:`${formatDate(today)} 08:00:00`,
      [`template.endTime`]:`${formatDate(endDay)} 08:00:00`
    })
  },

  lastTab:function(){
    this.setData({
      activeTab:0
    })
  },

  chooseImg:function(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      success: (res) => {
        let path =  res.tempFilePaths[0];
        wx.uploadFile({
          url: 'https://fxb2api.uelink.com.cn/teacherapi/public/pc/upload/post?type=imgContactQrcode',
          filePath:path,
          name: 'file',
          success:(res)=>{
            let data = JSON.parse(res.data).data;
            let fileName = data.fileName;
            let fileUrl = data.fileUrl;
            this.setData({
              contactQrcode:fileName,
              contactUrl:fileUrl
            })
          }
        })
      }
    })
  }
})