// pages/comments/index.js
import path from '../../utils/api.js'
import wxRequest from '../../utils/wxRequest.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    currentPage: 1,
    totalPage: 1,
    pageSize: 10,
    showNoMore: false,
    comments: []
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getComments()
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
    if (this.data.isLoading) return
    if (this.data.currentPage > this.data.totalPage) return
    this.getComments()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getComments: function () {
    let that = this
    const { currentPage, totalPage, pageSize, comments } = this.data
    wxRequest.getRequest(path.getComments(), {
      page: currentPage,
      page_size: pageSize
    }).then(res => {
      if (res.data.status) {
        that.setData({
          comments: [...comments, ...res.data.data.list],
          currentPage: currentPage + 1,
          totalPage: Math.ceil(res.data.data.count / pageSize),
          isLoading: false,
          showNoMore: currentPage + 1 > Math.ceil(res.data.data.count / pageSize) ? true : false
        })
      }
    })
  }
})