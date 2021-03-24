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
    time:new Date().getTime(),
    imgUrl:'http://img.uelink.com.cn/upload/xykj/classes/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    classId = options.id;
    app.checkLogin(()=>{
      this.inti();
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
    app.request({
      url:'/class/behaviour/allStudent',
      data:{
        classId,
        year: Number(this.data.year),
        month: Number(this.data.month)
      },
      barLoading:true
    }).then(res => {
      let classTotalScoreAdd = res.classToalScoreAdd;
      let classTotalScoreReduce = res.classToalScoreReduce;
      let studentList = res.studentList;
      this.setData({
        classTotalScoreAdd,
        classTotalScoreReduce,
        studentList
      })
    })
  },

  //获取点评列表（表扬 & 待改进）
  getBehaviour: function () {
    app.request({
      url:'/class/behaviour/items',
      barLoading:true
    }).then(res => {
      let list = res.list;
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
    app.request({
      url:'/class/behaviour/add',
      data:{
        classId,
        studentIds: this.data.studentIds.toString(),
        behaviorId
      },
      loading:true,
      loadingTitle:'正在点评'
    }).then(res => {
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
    app.request({
      url:'/class/students/group/get',
      data:{
        classId
      },
      barLoading:true
    }).then(res => {
      let groupList = res.list;
      this.setData({
        groupList
      })
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