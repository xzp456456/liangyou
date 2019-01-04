import path from '../utils/api.js'
const app = getApp()
import wxRequest from '../utils/wxRequest.js'
export default class Login {
  getSetting() {
    return new Promise(resolve => {
      wx.getSetting({
        success: res => {
         // console.log(res);
          if (res.authSetting['scope.userInfo']) {
            resolve({successed: true})
          } else {
            //如果未授权，弹出授权
            resolve({ successed: false })
          }
        },
        fail: res => {
          resolve({ successed: false })
        }
      })
    })
  }
  wxLogin() {
    return new Promise(resolve => {
      wx.login({
        success: res => {
         // console.log(res);
          if (res.code) {
            resolve({ successed: true, ...res })
          } else {
            resolve({successed: false})
          }
        },
        fail: res => {
          resolve({ successed: false })
        }
      })
    })
  }
  GetRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
  }
  getUserInfo() {
    return new Promise(resolve => {
      wx.getUserInfo({
        success: res => {
           //console.log(res)
          app.globalData.userInfo = res.userInfo
          resolve({successed: true, ...res})
        },
        fail: res => {
          resolve({successed: false})
        }
      })
    })
  }

  getToken(code, iv, encryptedData) {
    var that = this;
    return new Promise(resolve => {
      wx.request({
        url: path.getToken(),
        data: {
          code: code,
          iv: iv,
          encryptedData: encryptedData
        },
        method: 'POST',
        success: res => {
          // console.log(res)
           wx.setStorageSync('token', res.data.data.token)
          app.globalData.userId = res.data.data.uid;
          wx.setStorageSync('uid', res.data.data.uid);
            app.GetUserInfo = res.data.data;
          resolve({successed: true, ...res})
        },
        fail: res => {
          resolve({successed: false})
        }
      })
    })
  }
  newgetUserInfo() {
  let that = this;
  return new Promise(resolve => {
  wxRequest.getRequest(path.getUserInfo() + wx.getStorageSync('uid'), {}).then(res => {
    //console.log(res);
    if (res.data.status) {
      //认证状态： -2：未提交审核，-1：审核中， 1：审核通过， 2：审核失败
      
      app.user = res.data.data
      
      app.realName = res.data.data.realname_status;
      resolve({ successed: true, ...res });
    }
  })
  })
}
  


}