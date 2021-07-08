const app = getApp();
Component({
    properties: {
        showModal: {
            type: Boolean,
            default: false
        }
    },
    attached: function () {
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
    },
    methods: {
        hideModal: function () {
            this.setData({
                showModal: false
            })
            this.triggerEvent('setLogin', {
                showModal: false
            }, {});
        },

        userLogin: function (e) {
            let rawData = e.detail.rawData;
            app.setUserData(rawData, () => {
                app.login(() => {
                    wx.showToast({
                        title: '登录成功',
                        icon: 'success'
                    })
                    this.hideModal();
                })
            })
        },

        getUserProfile: function () {
            wx.getUserProfile({
                desc: '完善资料',
                success: (res) => {
                    let rawData = res.rawData;
                    app.setUserData(rawData, () => {
                        app.login(() => {
                            wx.showToast({
                                title: '登录成功',
                                icon: 'success'
                            })
                            this.hideModal();
                        })
                    })
                }
            })
        }
    }
})