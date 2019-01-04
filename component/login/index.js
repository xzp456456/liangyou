// component/login/index.js
import wxRequest from '../../utils/wxRequest.js'
import regeneratorRuntime from '../../utils/runtime.js'
import Login from '../../models/login.js'
import path from '../../utils/api.js'
var app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recommender: {
      type: String,
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    auth_window_display: 'none',
    auth_phone_display: 'none',
    telphone:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    startPageEvent: function () {
      this.triggerEvent('pageEvent', {})
    },

    //点击去授权手机号,获取formid
    getFormId: function (e) {
      //console.log(e);
       app.formId = e.formId;
      wxRequest.postRequest(path.getFormId(), {
        formid: e.detail.formId
      }).then(res=>{
        //console.log(res);
      })
    },

    onGotUserInfo: function (res) {
      // 可以将 res 发送给后台解码出 unionId
      if (res.detail.userInfo) {
        this.setData({
          auth_window_display: "none"
        });
        this.getToken();
        
      }
    },
    getPhone:function(e) {
      var val = e.detail.value;
      this.setData({
        telphone: val
      });
    },
    getPhoneNumber: function (e) {
      wxRequest.getRequest(path.getUserInfo() + wx.getStorageSync('uid'), {}).then(res => {
        //console.log(res);
        if (res.data.status) {
          //认证状态： -2：未提交审核，-1：审核中， 1：审核通过， 2：审核失败
          that.setData({
            user: res.data.data
          });
          wx.setStorageSync('status', res.data.data.realname_status);
          //app.realName = res.data.data.realname_status
        }
      })
      var that = this;
      //console.log(e);
      if (e.detail.encryptedData) {
        // 调用接口将encryptedData发送到后台解密出电话号码
        var getWxPhone = wxRequest.postRequest(path.getWxPhone(), {
          'type': 1,
          'encryptedData': e.detail.encryptedData,
          'iv': e.detail.iv
        });
        getWxPhone.then(res => {
          //console.log(res);
          if (res.data.status) { //从服务器获取到手机号码
            var wxRegister = wxRequest.postRequest(path.wx_phone(), {
              'wx_phone': res.data.data.phoneNumber
            });

            wxRegister.then(result => {
              //console.log(result)
              if (result.data.status) {
                //app.globalData.userInfo.uid = result.data.data.uid
                app.globalData.userId = wx.getStorageSync('uid');
                wx.showToast({
                  title: result.data.msg,
                  icon: 'none',
                  duration: 2000
                })
                
              } else {
                if (!wx.getStorageSync('uid')){
                  wx.showToast({
                    title: result.data.msg,
                    duration: 2000
                  })
                  
                }
                
              }
            })
          }

          that.setData({
            auth_phone_display: "none"
          })
         
        })
      } else {
        
       }
      
    },
    hide:function(){
      if (!wx.getStorageSync('uid')) {
        this.setData({
         // auth_phone_display: "flex"
        });
      }
    },
    getToken: async function() {
      const that = this
      let loginInstance = new Login()
      let login = await loginInstance.wxLogin()
      if (!login.successed) return;

      let userInfo = await loginInstance.getUserInfo()
      if (!userInfo.successed) return;
      let token = await loginInstance.getToken(login.code, userInfo.iv, userInfo.encryptedData);
            
      if(!token.successed) return;
      await that.hide();
      let new_user= await loginInstance.newgetUserInfo();
      //if (!wx.getStorageSync('token')) { 
        await that.changeAddress();
        //}   
      await that.setTimeAddress();
      wx.showTabBar()
    },
    changeAddress: function () {
      //var that = this;
      wx.getLocation({
        success: function (res) {
         // console.log('ok');
        }
      })
    },
    setTimeAddress: function () {
      let that = this;
      wxRequest.postRequest(path.getRobCount(), {})
        .then(res => {
          //console.log(res);
          if (res.data.status) {
            if (res.data.data.count > 0) {
              app.timeOrder = setInterval(() => {
                that.changeAddress();
              }, 10000)
            }
          }
        })
    }
  },
 
  ready: function () {
    
    wx.getSetting({
      success: res => {
      
         //console.log(res)
        //如果已经授权
        if (res.authSetting['scope.userInfo']) {
          this.getToken();
        } else {
          //如果未授权，弹出授权
          wx.hideTabBar()
          this.setData({
            auth_window_display: "flex"
          });
        }
        
      }
    });
  }
})
