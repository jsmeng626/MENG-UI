import { BaseURL } from './global'

class Request {
  // 静态成员
  static paramsObj = {}
  static token = ''
  static result = 'handleRusult'

  constructor(method, url, data, contentType, hasAuthorization, showError) {
    // 接收请求参数
    // method 请求方式
    // url 请求路径
    // data 请求参数
    // contentType MIME-Type
    // hasAuthorization 是否携带请求头
    // showError 是否提示错误信息
    this.paramsObj = { method, url, data, contentType, hasAuthorization, showError }
    this.handleRusult = this.handleRequest(this.paramsObj)
  }

  // 请求处理函数
  handleRequest({ method = 'GET', url = '', data = {}, contentType = 'queryString', hasAuthorization = true, showError = true }) {
    // 存放静态成员
    Request.paramsObj = {
      method: method.toUpperCase(),
      url: BaseURL + url,
      data,
      header: {}
    }
    Request.token = uni.getStorageSync('token') || ''
    return new Promise((resolve, reject) => {
      // 请求头配置
      if(contentType === 'queryString') {
        Request.paramsObj.header['Content-Type'] = 'application/x-www-form-urlencoded'
      }else if(contentType === 'json') {
        Request.paramsObj.header['Content-Type'] = 'application/json'
      }else if(contentType === 'formData') {
        Request.paramsObj.header['Content-Type'] = 'multipart/form-data'
      }
      if(Request.token && hasAuthorization) {
        Request.paramsObj.header['Authorization'] = token
      }
      // 发送请求
      uni.request({
        ...Request.paramsObj,
        success: (res) => {
          if(!res.data) {
            resolve(res)
          }else {
            if(showError) this.showError(res)
            resolve(res.data)
          }
        },
        fail: (err) => {
          if(showError) this.showError(err)
          reject(err)
        }
      })
    })
  }

  showError({ data: { code, msg } }) {
    switch(code) {
      case 401:
        uni.showToast({
					title: '登录过期请重新登录',
					icon: 'none',
					position: 'bottom',
					duration: 1000
				})
        // uni.reLaunch({ url: '/pages/login/login' })
        break
      case 429:
        uni.showToast({
          title: '操作频繁请稍等片刻',
          icon: 'none',
          position: 'bottom',
          duration: 1000
        })
        break
      case 500:
        uni.showToast({
					title: msg,
					icon: 'none',
					position: 'bottom',
					duration: 1000
				})
        break
      default:
				break
    }
  }
}

export default (method, url, data, contentType, hasAuthorization, showError) => { 
  return new Request(method, url, data, contentType, hasAuthorization, showError)[Request.result]
}