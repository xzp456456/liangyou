// component/msgBtn/index.js
var FormIdBehavior = require('../formIdBehavior.js')

Component({
  externalClasses: ['my-class'],
  behaviors: [FormIdBehavior],
  /**
   * 组件的属性列表
   */
  properties: {},

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
      this.triggerEvent('clickEvent', {})
    }
  }
})
