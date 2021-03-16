import GlobalConfig from './config'
const globalConfig = new GlobalConfig()

let fromUserId, orgId, wxSceneId;
App({
  onLaunch: function (options) {
    console.log("onLaunch", options);
    wxSceneId = options.scene
    fromUserId = options.query.fromUserId || 0
    orgId = options.query.orgId || 0
    this.update();
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },

  onShow: function (options) {
    console.log("onShow", options);
    let newOrgId = options.query.orgId || 0
    console.log(newOrgId, orgId);
    if (newOrgId !== orgId) {
      orgId = newOrgId
      this.login()
    }
    this.update();
  },

  globalData: {
    userInfo: null,
    productName: globalConfig.productName,
    product: globalConfig.product,
    isIPhoneX: null,
    verText: '1.0.19',
    token: '',
    apiUrl: globalConfig.apiUrl,
    fileUrl: globalConfig.fileUrl,
    wxSceneId: 0,
    fromUserId: 0,
    fromChildUserId: 0,
    auditStatus: 1,
    config: globalConfig,
    isVip: 0,
    session_key: '',
    unionId: '',
    appId: globalConfig.appId,
    secret: globalConfig.secret,
    loadingNum:0
  },

  //版本更新
  update: function () {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {})
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

  //登录
  login: function (callback) {
    wx.showLoading({
      title: '加载数据',
      mask: true
    })
    let url = this.globalData.apiUrl + '/public/teacher/mplogin'
    wx.login({
      success: res => {
        let jsCode = res.code
        let data = {
          jsCode: jsCode,
          wxSceneId: wxSceneId
        }
        if (orgId) {
          data.orgId = orgId
        }
        if (fromUserId) {
          data.fromUserId = fromUserId
        }
        wx.request({
          url: url,
          method: "POST",
          data: data,
          success: res => {
            wx.hideLoading()
            if (res.data.code == 0) {
              this.globalData.userInfo = res.data.data
              this.globalData.token = res.data.data.token
              this.globalData.uid = res.data.data.uid
              this.globalData.session_key = res.data.data.session_key
              this.globalData.unionId = res.data.data.unionid
              this.globalData.avatarUrl = res.data.data.avatarUrl
              this.globalData.parentId = res.data.data.parentId
              this.globalData.parentToken = res.data.data.parentToken
              this.globalData.nickName = res.data.data.nickName
              this.globalData.trueName = res.data.data.trueName
              this.globalData.phone = res.data.data.phone
              this.globalData.isAdmin = res.data.data.isAdmin || 0
              this.globalData.orgAdmin = res.data.data.orgAdmin || 0
              this.globalData.orgId = res.data.data.orgId
              this.globalData.orgName = res.data.data.orgName
              this.globalData.orgInviteCode = res.data.data.orgInviteCode
              wx.setStorage({
                key: 'token',
                data: res.data.data.token
              })
              if (callback) {
                callback()
              }
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000,
                mask: true
              })
            }
          },
          fail() {
            wx.hideLoading()
          }
        })
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

  //判断是否关闭loading
  closeLoading: function (loading) {
    if (!loading || this.globalData.loadingNum === 0) {
      return;
    }
    if (this.globalData.loadingNum === 1) {
      wx.hideLoading();
      this.globalData.loadingNum = 0
    }
    this.globalData.loadingNum -= 1;
  },

  setUserData: function (encryptedData,iv,rawData, phone, trueName, callback) {
    let data = {
      session_key:this.globalData.session_key
    }
    if (encryptedData) {
      data.encryptedData = encryptedData
    }
    if (iv) {
      data.iv = iv
    }
    if (rawData) {
      data.rawData = rawData
    }
    if (phone) {
      data.phone = phone
    }
    if (trueName) {
      data.trueName = trueName
    }
    this.request({
      url:this.globalData.apiUrl + '/public/teacher/setUserData2',
      data,
      method:'POST'
    }).then(() => {
      if(callback){
        callback();
      }
    })
  },

  /**
   * url：接口地址
   * data：上传数据
   * method：上传方法GET/POST，默认为GET
   * loadingTitle：setLoading的提示语，默认为加载中
   * loading：是否加载loading，默认为false
   * barLoading:是否调用wx.showNavigationBarLoading()，默认为false
   */
  request: function ({
    url = '',
    data = {},
    method = 'GET',
    loadingTitle = '加载中',
    loading = false,
    barLoading = false,
  } = {}) {
    if (loading) {
      wx.showLoading({
        title: loadingTitle,
        mask: true,
      });
      this.globalData.loadingNum += 1;
    }
    if(barLoading){
      wx.showNavigationBarLoading();
    }
    data['token'] = this.globalData.token;
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data,
        method,
        success: res => {
          if(barLoading){
            wx.hideNavigationBarLoading();
          }
          if (res.data.code === 0) {
            this.closeLoading(loading);
            resolve(res.data.data);
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
              mask: true
            })
            this.globalData.loadingNum = 0;
          }
        },
        fail: err => {
          this.closeLoading(loading);
          if(barLoading){
            wx.hideNavigationBarLoading();
          }
          reject(err)
          console.log(err);
        }
      });
    });
  }
})