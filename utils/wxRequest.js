// var token_expire = 1000 * 24 * 3600;//过期时间
 var app = getApp();
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        // console.log(res.data);
        //成功
        if (res.data.code == "401") {
          getToken(obj.url,obj.data);
        }
        if (res.data.code == "200"){
          resolve(res)
        }
        else{
          resolve(res)
        }
      }
      obj.fail = function (res) {
        //失败
        reject(res)
      }
      fn(obj)
    })
  }
}

//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};

/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
function getRequest(url, data) {
 // data.token = wx.getStorageSync('token');
 data.is_test = 1
  data.uid = 49;
  var getRequest = wxPromisify(wx.request)
  
  return getRequest({
    url: url,
    method: 'GET',
    data: data,
    header: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */
function postRequest(url, this_data = { "token":"" }) {
  var postRequest = wxPromisify(wx.request);
  //  this_data.token = wx.getStorageSync('token');
  // this_data.uid = app.globalData.userId
  this_data.is_test = 1;
  this_data.uid = 49;
  return postRequest({
    url: url,
    method: 'POST',
    data: this_data,
    header: {
      "content-type": "application/json"
    },
  })
}

/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */
function deleteRequest(url, this_data = { "token": "" }) {
  var deleteRequest = wxPromisify(wx.request);
   this_data.token = wx.getStorageSync('token');
  this_data.uid = app.globalData.userId
  return deleteRequest({
    url: url,
    method: 'DELETE',
    data: this_data,
    header: {
      "content-type": "application/json"
    },
  })
}

export default {
  postRequest: postRequest,
  getRequest: getRequest,
  deleteRequest: deleteRequest
}