//app.js

App({
  user:'',
  timeOrder:"",
  globalData: {
    getUnRobCount:'',
    userData:'',
    userInfo: null,
    userId: null,
    address:{},
    pageCards: {},
    orderType: 'task', //由于switchtab不能带参数，跳转之前先设定该参数，跳转之后从这里取参
  },
  userId: null,
  GetUserInfo:'',
  formid:'',
  changeUrl:'',
  income:'',
  realName:'',
  shopAddress:{},
  onLaunch: function () {
    
  },
  onread:function(){
    wx.replace();
  },
  myToast: function(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 3000
    });
  },
  
  
})