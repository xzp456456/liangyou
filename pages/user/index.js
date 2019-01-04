// pages/user/index.js
import wxRequest from '../../utils/wxRequest.js'
import path from '../../utils/api.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo();
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
  changeIndex: function () {
    if (app.realName === -2) {
      wx.navigateTo({
        url: '/pages/register/index',
      })
    } else if (app.realName === -1) {
      wx.navigateTo({
        url: '/pages/addmissing/index',
      })
    } else if (app.realName === 1) {
      wx.navigateTo({
        url: '/pages/authenticate/index',
      })
    } else if (app.realName === 2) {
      wx.navigateTo({
        url: '/pages/addmissionFail/index',
      })
    } else if (app.realName === 0) {
      wx.navigateTo({
        url: '/pages/register/index',
      })
    }
  },
  getUserInfo: function () {
    let that = this
    wxRequest.getRequest(path.getUserInfo() + wx.getStorageSync('uid'), {}).then(res => {
      console.log(res);
      if (res.data.status) {
        //认证状态： -2：未提交审核，-1：审核中， 1：审核通过， 2：审核失败
        that.setData({
          user: res.data.data
        });
        app.realName = res.data.data.realname_status
      }
    })
  }

 
})