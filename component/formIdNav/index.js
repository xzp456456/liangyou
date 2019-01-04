// component/formIdNav/index.js
var FormIdBehavior = require('../formIdBehavior.js')

Component({
  externalClasses: ['my-class'],
  behaviors: [FormIdBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    url: {
      'type': String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    btnOnClick: function () {
      if (this.properties.url){
        wx.navigateTo({
          url: this.properties.url,
        })
      }
      
      // let that = this
      // this.selfAction()
      //   .then(() => {
      //     wx.navigateTo({
      //       url: that.properties.url,
      //     })
      //   })
      //   .catch(e => {
      //     wx.navigateTo({
      //       url: '/pages/login/index',
      //     })
      //   })
    }
  }
})
