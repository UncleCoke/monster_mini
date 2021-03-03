App({
  onLaunch: function () {
    this.getIsIPhoneX();
    this.update();
    try {
      const res = wx.getSystemInfoSync()
      this.globalData.windowWidth = res.windowWidth
      this.globalData.windowHeight = res.windowHeight
    } catch (e) {}
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },

  globalData: {
    windowWidth: 0,
    windowHeight: 0,
    longScreen: 0,
    token: '',
    userId: '',
    nickName: '',
    unionId: '',
    session_key: '',
    avatar: '',
    apiUrl: 'https://fxb2api.uelink.com.cn/fxbapi',
    fileUrl: 'https://fxb2api.uelink.com.cn/upload',
    loadingNum:0
  },

  //判断是否为IPhoneX
  getIsIPhoneX: function () {
    let that = this
    return new Promise(function (resolve, reject) {
      if (that.globalData.isIPhoneX !== null) {
        resolve(that.globalData.isIPhoneX);
      } else {
        wx.getSystemInfo({
          success: function success(_ref) {
            let model = _ref.model,
              screenHeight = _ref.screenHeight,
              screenWidth = _ref.screenWidth;
            let screenRatio = screenHeight / screenWidth
            let longScreen = screenRatio > (17 / 9) ? 1 : 0
            let iphoneX = /iphone x/i.test(model);
            let iphoneNew = /iPhone11/i.test(model) && screenHeight === 812;
            that.globalData.isIPhoneX = iphoneX || iphoneNew;
            that.globalData.longScreen = longScreen;
            resolve(that.globalData.isIPhoneX);
          },
          fail: reject
        });
      }
    });
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
      title: '加载中',
      mask: true
    })
    wx.login({
      success: res => {
        wx.request({
          url: this.globalData.apiUrl + '/public/mplogin',
          data: {
            jsCode: res.code
          },
          success: res => {
            wx.hideLoading()
            if (res.data.code == 0) {
              this.globalData.token = res.data.data.token;
              this.globalData.uid = res.data.data.uid;
              this.globalData.unionId = res.data.data.unionid;
              this.globalData.avatar = res.data.data.lastAvatar;
              this.globalData.session_key = res.data.data.session_key;
              if (callback) {
                callback(res.data.data)
              }
            } else {
              wx.showModal({
                title: '提示',
                content: '网络出了点问题，加载超时！',
                showCancel: false,
                confirmText: '重试',
                confirmColor: '#3BBE79',
                success: (result) => {
                  if (result.confirm) {
                    this.login(callback);
                  }
                }
              });
            }
          },
          fail: err => {
            console.log(err);
            wx.hideLoading()
          }
        })
      },
      fail: err => {
        console.log(err);
        wx.hideLoading()
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
  closeLoading:function(loading){
    if(!loading || this.globalData.loadingNum === 0){
      return;
    }
    if(this.globalData.loadingNum === 1){
      wx.hideLoading();
      this.globalData.loadingNum = 0
    }
    this.globalData.loadingNum -= 1;
  },

  /**
   * url：接口地址
   * data：上传数据
   * method：上传方法GET/POST，默认为GET
   * loadingTitle：setLoading的提示语，默认为加载中
   * isCloseLoading：接口调用成功时是否立即取消Loading加载 (预防接口返回后的大量处理)
   * loading：是否加载loading，默认为true
   */
  request: function ({url,data,method = 'GET',loadingTitle = '加载中',isCloseLoading = true,loading = true} = {}) {
    if(loading){
      wx.showLoading({
        title:loadingTitle,
        mask: true,
      });
      this.globalData.loadingNum += 1; 
    }
    data['token'] = this.globalData.token;
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data,
        method,
        success: res => {
          if (res.data.code === 0) {
            if(isCloseLoading){
              this.closeLoading(loading);
            }
            resolve(res.data.data)
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
          reject(err)
          console.log(err);
        }
      });
    });
  }
})