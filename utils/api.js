import config from './config.js'

export default {
  getDomain: () => { return config },

  //获取token
  getToken: () => { return config + '/mini/wx_user/login' },

  getFormId: () => { return config + '/mini/wxform/get_form_id' },

  getBanner: () => { return config + '/mini/advert' },

  getUserInfo: () => { return config + '/mini/wx_user/' },

  updataUserInfo: () => { return config + '/mini/wx_user/update' },

  getIncome: () => { return config + '/mini/income' },

  getIncomeDetail: () => { return config + '/mini/income/details' },

  getBanks: () => { return config + '/mini/user_bank' },

  getBankList: () => { return config + '/mini/user_bank/bankList' },

  addBank: () => { return config + '/mini/user_bank' },

  deleteBank: () => { return config + '/mini/user_bank' },

  withdraw: () => { return config + '/mini/withdraw' },

  getToday: () => { return config + '/mini/score/day' },

  getMonth: () => { return config + '/mini/score/month' },

  getComments: () => { return config + '/mini/evaluate' },

  feedback: () => { return config + '/mini/feedback' },

  getOrders: () => { return config + '/mini/order' },

  getMessage: () => { return config + '/mini/message' },

  uploadFile: () => { return config + '/mini/upload' },

  getAuthInfo: () => { return config + '/mini/realname' },

  register: () => { return config + '/mini/realname' },

  serviceInfo: () => { return config + '/mini/service_info' },

  province: () => { return config + '/mini/location/province' },

  province: () => { return config + '/mini/location/province' },

  city: () => { return config + '/mini/location/city' },

  area: () => { return config + '/mini/location/area' },

  abnormal: () => { return config + '/mini/order/feedback' },

  grabOrder: () => { return config + '/mini/order/rob' },

  pickUp: () => { return config + '/mini/order/pick' },

  sureReceive: () => { return config + '/mini/order/confirm' },

  reportPosition: () => { return config + '/mini/wx_user/reportPosition' },
  
  wx_phone: () => { return config +'/mini/wx_user/wx_register'},

  getWxPhone: () => { return config + '/mini/assembly/getWxPhone' },

  getRobCount: () => { return config + '/mini/wx_user/getRobCount' },

  getUnRobCount: () => { return config + '/mini/wx_user/getUnRobCount' }
}