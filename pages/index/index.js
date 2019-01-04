// pages/orders/index.js
import path from '../../utils/api.js'
import wxRequest from '../../utils/wxRequest.js'

let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIn: false,
    count:"",
    current: 'tab1',
    isLoading: true,
    currentPage1: 1,
    currentPage2: 1,
    currentPage3: 1,
    currentPage4: 1,
    totalPage1: 1,
    totalPage2: 1,
    totalPage3: 1,
    totalPage4: 1,
    pageSize: 10,
    showNoMore: false,
    task: [],
    pickUp: [],
    sending: [],
    complete: [],
    status: ['待抢单', '配送中', '已完成', '取消订单']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUnRobCount();
      setInterval(()=>{
        this.getUnRobCount();
      },5000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    if (wx.setStorageSync('token')) {
      wx.redirectTo({
        url: '/pages/login/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    let that = this
    this.setData({
      currentPage1: 1,
      currentPage2: 1,
      currentPage3: 1,
      currentPage4: 1,
      totalPage1: 1,
      totalPage2: 1,
      totalPage3: 1,
      totalPage4: 1,
      task: [],
      pickUp: [],
      sending: [],
      complete: []
    }, () => {
      const orderType = new Map([
        ['task', {
          'tab': 'tab1',
          'page': that.data.currentPage1,
          'status': '0'
        }],
        ['pickUp', {
          'tab': 'tab2',
          'page': that.data.currentPage2,
          'status': '1'
        }],
        ['sending', {
          'tab': 'tab3',
          'page': that.data.currentPage3,
          'status': '2'
        }],
        ['complete', {
          'tab': 'tab4',
          'page': that.data.currentPage4,
          'status': '3'
        }]
      ])

      let orderConfig = orderType.get(app.globalData.orderType)

      this.getOrders(orderConfig.page, orderConfig.status)

      this.setData({
        current: orderConfig.tab
      });
    })
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

  },
  getUnRobCount: function() {
    let that = this;
    wxRequest.postRequest(path.getUnRobCount(), {})
      .then((res) => {
        //console.log(res);
        if (res.data.data.count) {

          that.setData({
            showIn: true,
            count:res.data.data.count
          })
        } else {
          that.setData({
            showIn: false
          })
        }

      })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.isLoading) return

    let that = this

    this.setData({
      isLoading: true,
      currentPage1: 1,
      currentPage2: 1,
      currentPage3: 1,
      currentPage4: 1,
      totalPage1: 1,
      totalPage2: 1,
      totalPage3: 1,
      totalPage4: 1,
      showNoMore: false,
      task: [],
      pickUp: [],
      sending: [],
      complete: []
    }, () => {
      const orderType = new Map([
        ['tab1', {
          'page': that.data.currentPage1,
          'status': '0'
        }],
        ['tab2', {
          'page': that.data.currentPage2,
          'status': '1'
        }],
        ['tab3', {
          'page': that.data.currentPage3,
          'status': '2'
        }],
        ['tab4', {
          'page': that.data.currentPage4,
          'status': '3'
        }]
      ])
      let orderConfig = orderType.get(this.data.current)

      this.getOrders(orderConfig.page, orderConfig.status, 1)
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.isLoading) return
    let that = this
    const orderType = new Map([
      ['tab1', {
        'page': that.data.currentPage1,
        'status': '0',
        'totalPage': that.data.totalPage1
      }],
      ['tab2', {
        'page': that.data.currentPage2,
        'status': '1',
        'totalPage': that.data.totalPage2
      }],
      ['tab3', {
        'page': that.data.currentPage3,
        'status': '2',
        'totalPage': that.data.totalPage3
      }],
      ['tab4', {
        'page': that.data.currentPage4,
        'status': '3',
        'totalPage': that.data.totalPage4
      }]
    ])
    let orderConfig = orderType.get(this.data.current)

    orderConfig.page <= orderConfig.totalPage ? this.getOrders(orderConfig.page, orderConfig.status) : null
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // tab切换
  tabsChange({
    detail
  }) {
    if (this.data.isLoading) return /* 加载数据时禁止切换tab */
    let that = this
    const orderType = new Map([
      ['tab1', {
        'page': that.data.currentPage1,
        'status': '0',
        'tabname': 'task'
      }],
      ['tab2', {
        'page': that.data.currentPage2,
        'status': '1',
        'tabname': 'pickUp'
      }],
      ['tab3', {
        'page': that.data.currentPage3,
        'status': '2',
        'tabname': 'sending'
      }],
      ['tab4', {
        'page': that.data.currentPage4,
        'status': '3',
        'tabname': 'complete'
      }]
    ])
    let orderConfig = orderType.get(detail.key)
    app.globalData.orderType = orderConfig.tabname;
    this.setData({
      current: detail.key
    }, () => {
      //第一次切换到该标签时加载该标签的数据
      //orderConfig.page == 1 ? this.getOrders(orderConfig.page, orderConfig.status) : null
      this.getOrders(orderConfig.page, orderConfig.status);
    });
  },

  getOrders: function(page, status, stopRefresh) {
    let that = this
    const {
      pageSize
    } = this.data
    wxRequest.getRequest(path.getOrders(), {
      page: page,
      status: status,
      page_size: this.data.pageSize
    }).then(res => {
     // console.log(res);
      if (res.data.status) {
        let totalPage = Math.ceil(res.data.data.count / pageSize)

        const statusMap = new Map([
          ['0', {
            'orderType': 'task',
            'data': that.data.task
          }],
          ['1', {
            'orderType': 'pickUp',
            'data': that.data.pickUp
          }],
          ['2', {
            'orderType': 'sending',
            'data': that.data.sending
          }],
          ['3', {
            'orderType': 'complete',
            'data': that.data.complete
          }]
        ])

        let statusConfig = statusMap.get(status)

        that.setData({
          [statusConfig.orderType]: [...statusConfig.data, ...res.data.data.list],
          ['totalPage' + (parseInt(status) + 1)]: totalPage,
          ['currentPage' + (parseInt(status) + 1)]: page + 1,
          isLoading: false,
          showNoMore: (page + 1) > totalPage ? true : false
        }, () => {
          if (stopRefresh) {
            wx.stopPullDownRefresh()
          }
        })
      }
    })
  }
})