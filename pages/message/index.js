// pages/message/index.js
import path from '../../utils/api.js'
import wxRequest from '../../utils/wxRequest.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgs: [],
    isLoading: true,
    currentPage: 1,
    totalPage: 1,
    pageSize: 10,
    showNoMore: false
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
    this.getMessage();
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
    this.getMessageOne()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoading) return
    if (this.data.currentPage > this.data.totalPage) return
    this.getMessage()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getMessage: function() {
    let that = this
    wxRequest.getRequest(path.getMessage(), {
      page: that.data.currentPage,
      page_size: that.data.pageSize
    }).then(res => {
      if (res.data.status) {
        that.setData({
          msgs: [...that.data.msgs, ...res.data.data.list],
          totalPage: Math.ceil(res.data.data.count / that.data.pageSize),
          isLoading: false,
          currentPage: that.data.currentPage + 1,
          showNoMore: that.data.currentPage + 1 > Math.ceil(res.data.data.count / that.data.pageSize) ? true : false
        })
      }
    })
  },

  getMessageOne: function () {
    let that = this
    wxRequest.getRequest(path.getMessage(), {
      page: 1,
      page_size: that.data.pageSize
    }).then(res => {
      if (res.data.status) {
        that.setData({
          msgs: [...res.data.data.list],
          isLoading: false
        })
        
      }
    })
  },
  goInOrder:function(e){
    let distributor_order_id = e.currentTarget.dataset.dd;
    if (distributor_order_id){
        wx.navigateTo({
          url: '/pages/orderDetail/index?id=' + distributor_order_id,
        })
    }
  }

})