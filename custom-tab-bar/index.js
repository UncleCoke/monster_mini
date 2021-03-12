Component({
  data: {
    selected: 0,
    list: [{
        icon:'',
        activeIcon:'',
        pagePath: "pages/recruit/index",
        text: "招生工具"
      },
      {
        icon:'',
        activeIcon:'',
        pagePath: "pages/student/index",
        text: "学员"
      },
      {
        icon:'',
        activeIcon:'',
        pagePath: "pages/classes/list",
        text: "班级"
      },
      {
        pagePath: "pages/my/index",
        text: "我的"
      }
    ]
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
      this.setData({
        selected: data.index
      })
    }
  }
})