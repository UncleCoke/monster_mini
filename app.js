App({
  onLaunch(options) {
    console.log('onLaunch', options)
    this.update();
    this.getSystemInfo();

  },

  onShow(options) {
    console.log('onShow', options)
    this.update();
    this.getSystemInfo();
  },

  //获取系统信息
  getSystemInfo() {
    try {
      const res = wx.getSystemInfoSync()
      this.globalData.windowWidth = res.windowWidth
      this.globalData.windowHeight = res.windowHeight
    } catch (e) { }
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },

  //版本更新
  update: function () {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) { })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '发现新版本，请重启应用。',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      console.log('新版本下载失败');
    })
  },

  //判断当前版本设置apiUrl
  setApi: function () {
    //获取当前小程序版本
    const accountInfo = wx.getAccountInfoSync();
    if (accountInfo.miniProgram.envVersion == 'develop') {
      this.globalData.apiUrl = ''
    } else {
      this.globalData.apiUrl = ''
    }
    console.log(accountInfo.miniProgram.envVersion, this.globalData.apiUrl);
  },

  //全局数据
  globalData: {
    //个人信息
    userInfo: {
      token: "",
      userId: "",
      avatarUrl: "",
      nickName: ""
    },
    //接口地址
    apiUrl: "",
    //文件地址
    fileUrl: "",
    //token
    token:""
  },

  //登录
  login(callback) {
    wx.login({
      success: res => {
        let data = {
          jsCode: res.code
        }
        //登录
      }
    })
  },

  //判断是否已登录
  checkLogin: function (callback) {
    if (!this.globalData.token) {
      this.login(callback)
    } else {
      callback();
    }
  },

  /**
 * url：接口地址
 * data：上传数据
 * method：上传方法GET/POST，默认为GET
 * loadingTitle：setLoading的提示语，默认为加载中
 * loading：是否加载loading，默认为false
 * barLoading:是否调用wx.showNavigationBarLoading()，默认为true
 * returnAll:不做判断直接返回res
 */
  request: function ({
    url = '',
    data = {},
    method = 'GET',
    loadingTitle = '加载中',
    loading = false,
    barLoading = true,
    returnAll = false
  } = {}) {
    if (loading) {
      wx.showLoading({
        title: loadingTitle,
        mask: true,
      });
    }
    if (barLoading) {
      wx.showNavigationBarLoading();
    }
    let apiUrl = this.globalData.apiUrl + url;
    if (!data['token']) {
      data['token'] = this.globalData.token;
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: apiUrl,
        data,
        method,
        success: res => {
          if (barLoading) {
            wx.hideNavigationBarLoading();
          }
          if (loading) {
            wx.hideLoading();
          }
          if (returnAll) {
            resolve(res);
            return;
          }
          if (res.data.code === 0) {
            resolve(res.data.data);
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }
        },
        fail: err => {
          if (loading) {
            wx.hideLoading();
          }
          if (barLoading) {
            wx.hideNavigationBarLoading();
          }
          reject(err)
          console.log(err);
        }
      });
    });
  },

  debug: true
})
