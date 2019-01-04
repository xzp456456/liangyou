// var regeneratorRuntime = require('/utils/runtime.js') 

module.exports = Behavior({
  properties: {
    // checkLogin: {
    //   'type': Boolean
    // },
  },
  data: {},
  methods: {
    // selfAction: async function () {
    //   if (this.properties.checkLogin) {
    //     await this.wxGetSetting()
    //   } else {
    //     return true
    //   }
    // },

    // wxGetSetting: function () {
    //   return new Promise((resolve, reject) => {
    //     wx.getSetting({
    //       success: res => {
    //         // console.log(res)
    //         //如果已经授权
    //         if (res.authSetting['scope.userInfo']) {
    //           resolve()
    //         } else {
    //           //如果未授权
    //           reject()
    //         }
    //       }
    //     });
    //   })
    // },

    //点击去授权手机号,获取formid
    getFormId: function (e) {
      console.log(e.detail.formId)
      // var getFormId = wxRequest.postRequest(path.getFormId(), {
      //   formid: e.detail.formId
      // });
    }
  }
})