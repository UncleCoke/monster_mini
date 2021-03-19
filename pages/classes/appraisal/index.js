const app = getApp()
let classId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['学生', '小组'],
    activeIndex: 0, //0：学生 1：小组
    studentList: [],
    date: '',
    behaviourModal: false,
    activeStudents: [],
    studentIds: '',
    behaviourTabs: ['表扬', '待改进'],
    activeBIndex: 0, //0：表扬 1：待改进
    isMulti: false,
    activeGroup: {},
    groupModal: false,
    time:new Date().getTime()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    classId = options.id;
    if (!app.globalData.token) {
      app.login((res) => {
        this.inti()
      })
    } else {
      this.inti()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
    this.getAllStudentBehaviour();
    this.getGroupList();
    wx.stopPullDownRefresh();
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

  inti: function () {
    this.getBehaviour();
    let day = new Date();
    let month = day.getMonth() + 1;
    month = month < 10?'0'+month:month
    this.setData({
      date: `${day.getFullYear()}-${month}`,
      year: day.getFullYear(),
      month,
      nDate: {
        date: `${day.getFullYear()}-${month}`,
        year: day.getFullYear(),
        month
      }
    }, () => {
      this.getAllStudentBehaviour();
      this.getGroupList();
    })
  },

  //获取学生列表（包含行为得分）
  getAllStudentBehaviour: function () {
    let url = app.globalData.apiUrl + '/class/behaviour/allStudent'
    let data = {
      token: app.globalData.token,
      classId,
      year: Number(this.data.year),
      month: Number(this.data.month)
    }
    wx.showLoading({
      title: '正在获取',
      mask: true,
    });
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        if (res.data.code == 0) {
          let classTotalScoreAdd = res.data.data.classToalScoreAdd;
          let classTotalScoreReduce = res.data.data.classToalScoreReduce;
          let studentList = res.data.data.studentList;
          this.setData({
            classTotalScoreAdd,
            classTotalScoreReduce,
            studentList
          }, () => {
            wx.hideLoading();
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
        wx.hideLoading();
      }
    })
  },

  //获取点评列表（表扬 & 待改进）
  getBehaviour: function () {
    let url = app.globalData.apiUrl + '/class/behaviour/items'
    let data = {
      token: app.globalData.token
    }
    wx.showLoading({
      title: '正在获取',
      mask: true,
    });
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          let list = res.data.data.list;
          let addBehaviourList = [],
            reduceBehaviourList = [];
          list.forEach(item => {
            if (item.score == 1) {
              addBehaviourList.push(item);
            } else {
              reduceBehaviourList.push(item);
            }
          })
          this.setData({
            behaviour: list,
            addBehaviourList,
            reduceBehaviourList
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
        wx.hideLoading();
      }
    })
  },

  //选择学生
  chooseStudent: function (e) {
    if (this.data.date !== this.data.nDate.date) {
      wx.showToast({
        title: '请切换到当前月份进行学生点评',
        icon: 'none'
      });
      return;
    }

    let student = e.currentTarget.dataset.student;
    let type = e.currentTarget.dataset.type;
    //单独点评
    if(type === 'single'){
      let activeStudents = [student];
      let studentIds = activeStudents.map(item => item.id);
      this.setData({
        activeStudents,studentIds
      },()=>{
        this.setModal();
      })
    //多人点评
    }else{
      let activeStudents = this.data.activeStudents;
      let studentIds = activeStudents.map(item => item.id);
      let index = studentIds.indexOf(student.id);
      if (index > -1) {
        activeStudents.splice(index, 1);
      } else {
        activeStudents.push(student)
      }
      this.setData({
        activeStudents,
        studentIds: activeStudents.map(item => item.id)
      })
    }
  },

  //点评
  addBehaviour: function (e) {
    let score = e.currentTarget.dataset.score;
    let behaviorId = e.currentTarget.dataset.id;
    let url = app.globalData.apiUrl + '/class/behaviour/add'
    let data = {
      token: app.globalData.token,
      classId,
      studentIds: this.data.studentIds.toString(),
      behaviorId
    }
    wx.showLoading({
      title: '正在获取',
      mask: true,
    });
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          this.setData({
            score,
            time:new Date().getTime()
          },()=>{
            setTimeout(()=>{
              this.setData({
                score:''
              })
            },1500)
            this.setModal();
            this.getAllStudentBehaviour();
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
        wx.hideLoading();
      }
    })
  },

  tabSelect: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeIndex: index
    })
  },

  tabBSelect: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeBIndex: index
    })
  },

  setModal: function () {
    let behaviourModal = this.data.behaviourModal;
    /*if (behaviourModal) {
      setTimeout(()=>{
        this.setData({
          activeStudents: [],
          studentIds: []
        })
      },1500)
    }*/
    if (this.data.isMulti && behaviourModal) {
      this.setMulti();
    }
    this.setData({
      activeBIndex:0,
      behaviourModal: !behaviourModal
    })
  },

  setGroupModal: function () {
    let groupModal = this.data.groupModal;
    this.setData({
      groupModal: !groupModal
    })
  },

  setActiveGroup: function (e) {
    if (this.data.date !== this.data.nDate.date) {
      wx.showToast({
        title: '请切换到当前月份进行学生点评',
        icon: 'none'
      });
      return;
    }

    let group = e.currentTarget.dataset.group;
    this.setData({
      activeGroup: group
    }, () => {
      this.setGroupModal();
    })
  },

  setMulti: function () {
    if (this.data.date !== this.data.nDate.date) {
      wx.showToast({
        title: '请切换到当前月份进行学生点评',
        icon: 'none'
      });
      return;
    }

    let isMulti = this.data.isMulti;
    if(!isMulti && this.data.studentIds.length > 0){
      this.setData({
        studentIds:[],
        activeStudents:[]
      })
    }
    this.setData({
      isMulti: !isMulti
    })
  },

  dateChange: function (e) {
    let value = e.detail.value;
    let arr = value.split('-');
    this.setData({
      date: value,
      year: arr[0],
      month: arr[1]
    }, () => {
      this.getAllStudentBehaviour();
    })
  },

  gotoReport: function () {
    wx.navigateTo({
      url: `report?student=${JSON.stringify(this.data.activeStudents[0])}&classId=${classId}&year=${this.data.year}&month=${this.data.month}`
    });
    this.setModal();
  },

  //获取分组列表
  getGroupList: function () {
    var url = app.globalData.apiUrl + '/class/students/group/get'
    var data = {
      classId: classId,
      token: app.globalData.token
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: data,
      success: (res) => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh()
        if (res.data.code == 0) {
          let groupList = res.data.data.list;
          this.setData({
            groupList
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
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },

  behaviourGroup:function(){
    this.setData({
      activeStudents:this.data.activeGroup.studentList,
      studentIds:this.data.activeGroup.studentList.map(item => item.id)
    },()=>{
      this.setGroupModal();
      this.setModal();
    })
  }
})