// pages/authenticate/index.js
import path from '../../utils/api.js'
import wxRequest from '../../utils/wxRequest.js'

let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameValue: '',
    idcardValue: '',
    image1: '',
    image2: '',
    image3: '',
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

  nameChange: function (e) {
    this.setData({
      nameValue: e.detail.value
    })
  },

  idcardChange: function (e) {
    this.setData({
      idcardValue: e.detail.value
    })
  },

  selectImage: function (e) {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.setData({
          ['image' + e.currentTarget.dataset.index]: res.tempFilePaths[0]
        })
      },
    })
  },

  save: function () {
    if (this.data.nameValue === '') {
      app.myToast('姓名不能为空！')
      return;
    }
    if (this.data.idcardValue === '') {
      app.myToast('身份证不能为空！')
      return;
    }
    if (this.data.image1 === '') {
      app.myToast('您还未上传身份证人像面')
      return;
    }
    if (this.data.image2 === '') {
      app.myToast('您还未上传身份证国徽面')
      return;
    }
    if (this.data.image3 === '') {
      app.myToast('您还未上传手持身份证')
      return;
    }

    let that = this
    let success = 0, imgs = []
    uploadImage()

    function uploadImage() {
      wx.showLoading({
        title: '上传第' + (success + 1) + '张图片中...'
      })

      wx.uploadFile({
        url: path.uploadFile(),
        filePath: that.data['image' + (success + 1)],
        name: 'files[0]',
        formData: {
          'is_only_url': 1,
          'token':wx.getStorageSync('token')
        },
        success: function (res) {
          console.log(res);
          imgs.push(JSON.parse(res.data).data.url)
          success += 1
          wx.hideLoading()
          if (success < 3) {
            uploadImage()
          } else {
            wx.showLoading({
              title: '正在提交申请...'
            })
            that.register(imgs)
          }
        }
      })
    }
  },
  getRzInfo:function(){
    wxRequest.getRequest(path.register(), {})
    .then((res)=>{
      if(res.data.status){
        wx.setStorageSync('realname_id',res.data.data.id)
      }
    })
  },
  register: function (imgs) {
    let that = this
    
    wxRequest.postRequest(path.register(), {
      realname: that.data.nameValue,
      card_num: that.data.idcardValue,
      card_pic: imgs[0],
      card_pic_back: imgs[1],
      card_pic_hand: imgs[2],
      mark: '上传测试备注',
      realname_id:wx.getStorageSync('realname_id')
    }).then(res => {
      console.log(res)
      if (res.data.status) {
        that.getRzInfo();
        wx.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 3000,
          success:function(){
            setTimeout(()=>{
              wx.switchTab({
                url: '/pages/user/index',
              })
            },2000)
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
  }
})