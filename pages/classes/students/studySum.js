const app = getApp()
import _ from '../../../utils/lodash';
var userId, classId,subject,token;

let chart = null;

function initLineChart(canvas, width, height, F2, chartData) { // 使用 F2 绘制图表
  // console.log('chartData', chartData);

  // const data = chartData;
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  const data = chartData;
  chart.source(data, {
    created_at: {
      range: [0.1, 0.9],
      type: 'timeCat',
      mask: 'MM-DD'
    },
    score: {
      max: 100,
      min:0,
      tickCount: 4
    }
  });
  chart.tooltip({
    showCrosshairs: true,
    onShow: function onShow(ev) {
      const items = ev.items;

      items[0].name = items[0].title;
    }
  })
  chart.area().position('created_at*score')
  .color("#1890FF")
  .shape('smooth');
  chart.line().position('created_at*score')
  // .color('l(90) 0:#1890FF 1:#f7f7f7')
  .shape('smooth');
  chart.point().position('created_at*score').style({
    lineWidth: 3,
    stroke: '#0081ff'
  });
  if(chartData.length<2){
    chart.interval().position('created_at*score').style({
    lineWidth: 1,
    radius: [ 1, 1, 0, 0 ]
     })
     .size(1);
  }
  
  chart.render();
  return chart;
}

function initRadarChart(canvas, width, height, F2, chartData) { // 使用 F2 绘制图表
  // console.log('chartData', chartData);

  const data = chartData;
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.coord('polar');
  chart.source(data, {
    score: {
      min: 0,
      max: 100,
      nice: true,
      tickCount: 5
    }
  });
  chart.tooltip({
    custom: true, // 自定义 tooltip 内容框
    alwaysShow: true,
    onShow: function onShow(obj) {


      const legend = chart.get('legendController').legends.top[0];
      const tooltipItems = obj.items;
      const legendItems = legend.items;
      console.log(tooltipItems, legendItems);
      const map = {};
      legendItems.forEach(function (item) {
        map[item.name] = _.clone(item);
      });
      tooltipItems.forEach(function (item) {
        const name = item.name;
        const value = item.value;
        if (map[name]) {
          map[name].value = value;
        }
      });
      legend.setItems(_.values(map));
    },
    onHide: function onHide() {
      const legend = chart.get('legendController').legends.top[0];
      legend.setItems(chart.getLegendItems().country);
    }
  });
  chart.axis('score', {
    label: function label(text, index, total) {
      if (index === total - 1) {
        return null;
      }
      return {
        top: true
      };
    },
    grid: {
      lineDash: null,
      type: 'arc' // 弧线网格
    }
  });
  chart.axis('item', {
    grid: {
      lineDash: null
    }
  });
  chart.line().position('item*score').color('user');
  chart.point().position('item*score').color('user')
    .style({
      stroke: '#fff',
      lineWidth: 1
    });

  

  chart.render();
  return chart;
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjects: ['语文', '数学', '英语'],
    tabIndex: 0,
    style:[{
      tabColor:'#29b6f6',
      tabHoverColor:'#0288d1',
      titleColor:'#29b6f6',
      listColor:'#0288d1',
      listBgColor:'#e1f5fe',
    },{
      tabColor:'#ffc107',
      tabHoverColor:'#ffa000',
      titleColor:'#ffc107',
      listColor:'#ffa000',
      listBgColor:'#FFECB3',
    }],
    optsLine: {
      onInit: initLineChart
    },
    optsRadar: {
      onInit: initRadarChart
    },
    bookPassPer: {
      data: 10
    },
    bookStudyPer: {
      data: 10
    },
    showChart: false
  },

  onLoad: function (options) {
    
    wx.hideShareMenu();
    userId = options.userId
    token =  options.token
    classId =  options.classId
    subject = '语文'

    wx.setNavigationBarTitle({
      title: `${subject}-学习报告`
    });

    var subjects = this.data.subjects
    var tabIndex = 0

    subjects.forEach((element, index) => {

      if (element == subject) {
        tabIndex = index
      }

    });
    this.setData({
      tabIndex
    })
    if (!app.globalData.token) {
      app.login((res) => {
        this.inti()
      })

    } else {
      this.inti()
    }
    
  },

  inti: function () {

    var user = wx.getStorageSync('userInfo');
    
    this.setData({
      user
    })

    this.getStudySum()


  },
  
  tab: function (e) {
    let tabIndex = e.currentTarget.dataset.index
    this.setData({
      tabIndex
    }, () => {
      subject = this.data.subjects[tabIndex]
      wx.setNavigationBarTitle({
        title: `${subject}-学习报告`
      });
      this.getStudySum()
    })
  },

  getStudySum: function () {
    wx.showLoading({
      title: '加载数据',
      mask: true
    })
    var url = app.globalData.apiUrl + '/student/studyData'
    var data = {
      token: app.globalData.token,
      userId: userId,
      subject: subject,
      classId:classId
    }
    this.setData({
      showChart: false
    })
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      method: "GET",
      data: data,
      success: (res) => {
        wx.stopPullDownRefresh();
        wx.hideLoading()
        wx.hideNavigationBarLoading();
        if (res.data.code == 0) {
          var StudySum = res.data.data;

          var evalList = StudySum.evalList
          if(evalList.length > 5){
            evalList.splice(5,evalList.length-5)
          }
          var homeworks = StudySum.homeworks
          if(homeworks.length > 5){
            homeworks.splice(5,homeworks.length-5)
          }

          this.setData({
            StudySum,
            evalList,
            homeworks,
            showChart: true
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            showCancel: false,
            confirmText: '好的',
            confirmColor: '#3CC51F',
            success: (result) => {
              if(result.confirm){
                // this.back()
                this.setData({
                  err:res.data.msg
                })
              }
            },
            fail: ()=>{},
            complete: ()=>{}
          });
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'none',
          //   duration: 2000,
          //   mask: true
          // })
        }
      },
      fail: (res) => {
        wx.stopPullDownRefresh();
        wx.hideLoading()
        wx.hideNavigationBarLoading();
      }
    })
  },
  remove: function (e) {
    wx.showModal({
      title: '移除学生',
      content: '是否将该学生移除班级？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          this.checkStatus(-10,userId)
          
        }else{
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  checkStatus: function (status,userId) {
    wx.showLoading({
      title: "正在处理",
      mask: true
    });
    var url = app.globalData.apiUrl + '/class/checkStudent'
    var data = {
      token:app.globalData.token,
      classId: classId,
      userId:userId,
      status:status
    }
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          this.back()

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
        wx.hideLoading();
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
        url: '/pages/classes/list'
      });
    }
    
  },

  viewEvalList: function (e) {
    wx.navigateTo({
      url: `evalList?token=${token}&userId=${userId}&classId=${classId}&subject=${subject}`
    });
  
  },
  viewHomeworkList: function (e) {
    wx.navigateTo({
      url: `homeworkList?token=${token}&userId=${userId}&classId=${classId}&subject=${subject}`
    });
  
  },
  call:function(e){
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
})