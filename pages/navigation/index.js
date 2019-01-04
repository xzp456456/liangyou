// pages/navigation/index.js
import path from '../../utils/api.js';
import wxRequest from '../../utils/wxRequest.js'
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,
    latitude: 0,
    longitude: 0,
    timeOrder:'',
    markers: [{
      id: 1,
      latitude: 24.595092,
      longitude: 118.112857,
      name: '软件园三期'
    }],
    MyAddress:'',
    endAddress:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //clearInterval(app.timeOrder);
    this.setData({
      MyAddress: app.globalData.address.MyAddress,
      endAddress: app.globalData.address.endAddress
    })
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight + 'px'
        })
      }
    });
    
    // app.timeOrder = setInterval(()=>{
    //   this.changeAddress();
    // },10000);
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight + 'px'
        })
      }
    });
    wx.getLocation({
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        }, () => {
          console.log(res);
          that.bicycling();
        });
      },
    })
  },
    
  changeAddress:function(){
    var that = this
    wx.getLocation({
      success: function (res) {

        wxRequest.postRequest(path.reportPosition(),{
          latitude: res.latitude,
          longitude: res.longitude
        }).then(()=>{
          wx.getLocation({
            success: function (res) {
              that.setData({
                latitude: res.latitude,
                longitude: res.longitude
              }, () => {
                
                //that.bicycling();
              });
            },
          })
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
   var that = this;
    //clearInterval(that.data.timeOrder);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bicycling: function() {
    var _this = this;
    _this.setData({
      markers: [{
        id: 1,
        latitude: app.shopAddress.latitude,
        longitude: app.shopAddress.longitude,
        name: app.globalData.address.endAddress
      }],
    })
    //网络请求设置
    var opt = {
      //WebService请求地址，from为起点坐标，to为终点坐标，开发key为必填
      url: 'https://apis.map.qq.com/ws/direction/v1/bicycling/?from=' + _this.data.latitude + ',' + _this.data.longitude + '&to=' + app.shopAddress.latitude + ',' + app.shopAddress.longitude+'&key=DZ5BZ-COBWW-KSERC-RDM4Q-DIWJS-XPBDS',
      method: 'GET',
      dataType: 'json',
      //请求成功回调
      success: function(res) {
        console.log(res);
        var ret = res.data
        if (ret.status != 0) return; //服务异常处理
        var coors = ret.result.routes[0].polyline,
          pl = [];
        //console.log(ret.result.routes[0]);
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({
            latitude: coors[i],
            longitude: coors[i + 1]
          })
        }
        //设置polyline属性，将路线显示出来
        _this.setData({
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 2
          }]
        })
      }
    };
    wx.request(opt);
  },

  openLocation: function() {
    const latitude = this.data.latitude
    const longitude = this.data.longitude
    wx.openLocation({
      latitude,
      longitude,
      scale: 28
    })
  }
})