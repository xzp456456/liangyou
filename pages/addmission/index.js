// pages/addmission/index.js
import path from '../../utils/api.js'
import wxRequest from '../../utils/wxRequest.js'
import regeneratorRuntime from '../../utils/runtime.js'

let provinces = []

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceInfo: {},
    isWork: 1,
    areaList: [],
    areaIds: [],
    region: ['福建省', '厦门市', '集美区'],
    customItem: ''
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
    this.getServiceInfo()
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

  bindRegionChange: async function ({detail: {value}}) {
    let that = this
     //console.log('picker发送选择改变，携带值为', e.detail.value)
    let areaList = this.data.areaList, ids = this.data.areaIds
    if (!provinces.length) {
      provinces = await this.getProvince()
    }

    let cities = await this.getCities(provinces.filter(item => item.province === value[0])[0].provinceid)
       
    let areas = await this.getAreas(cities.filter(item => item.city === value[1])[0].cityid)
    
    let selectedArea = areas.filter(item => item.area === value[2])[0]
    let cheAreaList  = areaList.some((item)=>{
      return item.area_id == selectedArea.areaid
    })
    if(!cheAreaList){
      areaList.push({ area_id: selectedArea.areaid, area_info: value[1] + selectedArea.area });
      ids.push(selectedArea.areaid);
    }
    
    //console.log(areaList);
    
    this.setData({
      areaIds: ids,
      areaList: areaList,
      region: value
    })
  },
  
  setTakeOrder: function ({currentTarget}) {
    this.setData({
      isWork: currentTarget.dataset.i
    })
  },
 
  getServiceInfo: function() {
    let that = this
    wxRequest.getRequest(path.serviceInfo(), {}).then(res => {
      console.log(res);
      if (res.data.status) {
        that.setData({
          serviceInfo: res.data.data,
          isWork: res.data.data.is_work,
          areaList: res.data.data.areas,
          areaIds: res.data.data.area_ids.split(',')
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
  getProvince: function() {
    return new Promise(resolve => {
      wxRequest.getRequest(path.province(), {}).then(res => {
        console.log(res);
        resolve(res.data.data.list)
      })
    })
  },

  getCities: function (id) {
    return new Promise(resolve => {
      wxRequest.getRequest(path.city(), {
        province_id: id
      }).then(res => {
        console.log(res);
        resolve(res.data.data.list)
      })
    })
  },

  getAreas: function (id) {
    return new Promise(resolve => {
      wxRequest.getRequest(path.area(), {
        city_id: id
      }).then(res => {
        console.log(res);
        resolve(res.data.data.list)
      })
    })
  },

  deleteArea: function({target: {id}}) {
    this.setData({
      areaList: this.data.areaList.filter(item => item.area_id !== id),
      areaIds: this.data.areaIds.filter(item => item !== id)
    })
  },

  setSeviceInfo: function() {
    let that = this
    wxRequest.postRequest(path.serviceInfo(), {
      area_ids: that.data.areaIds.join(','),
      is_work: that.data.isWork,
      service_info_id: that.data.serviceInfo.id
    }).then(res => {
      if (res.data.status) {
        wx.showToast({
          title: res.data.msg
        })
      }
    })
  }
})