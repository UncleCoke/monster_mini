const app = getApp();
let templateId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['活动信息', '奖品设置'],
    activeTab: 0,
    raceData: {
      name: '',
      startTime: '',
      endTime: ''
    },
    race: {
      rule: '用户每天可参与一次答题活动，答题完成后分数进行累积，当天答题次数用完后，可邀请好友参加活动，邀请人会等额获得好友答题获得的金币或红包奖励，以此类推，一天最多邀请30名好友参与活动。',
      type: 1 //0：答题  1：抽奖
    },
    awards: [

    ]
  },

  onLoad: function (options) {
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
      },
      method:'POST',
      loading:true,
      loadingTitle:'正在创建'
    }).then(res => {
      wx.navigateTo({
        url: `share?id=${res.id}`
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
      })
    })
  },

  formValidate: function () {
    let template = this.data.template;
    let title;
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
    if (startTime < nowTime) {
      title = '开始时间不能小于当前时间'
      return title;
    }
    if (endTime < nowTime) {
      title = '结束时间不能小于当前时间'
      return title;
    }
    if (endTime < startTime) {
      title = '结束时间不能小于开始时间'
      return title;
    }
    let filter_awards = template.eventAward.filter(item => {
      return item.name == '' || item.name == '奖品名称(请输入)' || item.number == ''
    })
    if (filter_awards.length > 0) {
      title = '请补充好奖品数据'
      return title;
    }
    return title
  }
})