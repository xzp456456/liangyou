// pages/orderDetail/index.js
import config from '../../utils/config.js'
import path from '../../utils/api.js'
import wxRequest from '../../utils/wxRequest.js'
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    status: ['待抢单', '待取货', '配送中', '已完成', '已关闭']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrder(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 打电话
  phoneCall: function () {
    const that = this
    console.log(that.data.order)
    wx.makePhoneCall({
      phoneNumber: that.data.order.user_address.mobile
    })
  },
  phoneCallServer:function(){
    const that = this
    console.log(that.data.order)
    wx.makePhoneCall({
      phoneNumber: that.data.order.shop.kefu_phone
    })
  },
  grabOrder: function () {
    var that = this
    wxRequest.postRequest(path.grabOrder(), {
      distributor_order_id: that.data.order.distributor_order_id
    }).then(res => {
      if (res.data.status) {
        //that.getOrder(that.data.order.distributor_order_id)
        wx.showToast({
          title: '操作成功',
          duration: 3000,
          success:function(){
            setTimeout(()=>{
              that.urlInOrder('pickUp')
            }, 2000);
          }
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  changeAddress: function () {
    var that = this;
    wx.getLocation({
      success: function (res) {
        wxRequest.postRequest(path.reportPosition(), {
          latitude: res.latitude,
          longitude: res.longitude
        }).then((data) => {
          console.log(data.data.msg)
        })
      },
    })
  },
  setTimeAddress: function () {
    clearInterval(app.timeOrder);
    let that = this;
    wxRequest.postRequest(path.getRobCount(), {})
      .then(res => {
        console.log(res);
        if (res.data.status) {
          if (res.data.data.count > 0) {
            app.timeOrder = setInterval(() => {
              that.changeAddress();
            }, 10000)
          }
        }
      })
  },
  pickUp: function () {
    
    let that = this
    wxRequest.postRequest(path.pickUp(), {
      distributor_order_id: that.data.order.distributor_order_id
    }).then(res => {
      console.log(res);
      if (res.data.status) {
        that.setTimeAddress();
        //that.getOrder(that.data.order.distributor_order_id)
        wx.showToast({
          title: '操作成功',
          duration: 3000,
          success:function(){
            setTimeout(()=>{
              that.urlInOrder('sending');
            }, 2000);
          }
        })
        
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 3000
        })
      }
    })
  },

  sureReceive: function () {
    let that = this
    wxRequest.postRequest(path.sureReceive(), {
      distributor_order_id: that.data.order.distributor_order_id
    }).then(res => {
      if (res.data.status) {
        //that.getOrder(that.data.order.distributor_order_id)
        that.getRobCount();
        wx.showToast({
          title: '操作成功',
          duration: 3000,
          success:function(){
            setTimeout(()=>{
              that.urlInOrder('complete')
            },2000);
          }
        })
        
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 3000
        })
      }
    })
  },

  getOrder: function (id) {
    let that = this
    wxRequest.getRequest(config + '/mini/order/' + id, {}).then(res => {
      console.log(res);
      if (res.data.status) {
        that.setData({
          order: res.data.data
        })
        app.globalData.address.MyAddress = '我的位置';
            if(res.data.data.status==2){
              app.globalData.address.endAddress = res.data.data.user_address.address;
              app.shopAddress.latitude = res.data.data.user_address.latitude;
              app.shopAddress.longitude = res.data.data.user_address.longitude;
            } else if (res.data.data.status == 1)
              {
              app.globalData.address.endAddress = res.data.data.shop.address;
              app.shopAddress.latitude = res.data.data.shop.latitude;
              app.shopAddress.longitude = res.data.data.shop.longitude;
            }
       
      } else {
        app.globalData.address.MyAddress = '';
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 3000
        })
      }
    })
  },

  getRobCount:function(){
    wxRequest.postRequest(path.getRobCount(),{})
    .then(res=>{
      console.log(res);
      if(res.data.status){
        if(res.data.data.count==0){
          clearInterval(app.timeOrder)
        }
      }
    })
  },
  urlInOrder: function (action) {
    app.globalData.orderType = action
    wx.navigateBack()
  }
})