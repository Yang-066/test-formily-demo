import axios from 'axios'

// import store from '@/store'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { Message } from 'element-ui'

const baseConfig = { timeout: 120000, headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache', fromClient: 'web' } }
const url = window.location.href.split('/')[2].split(':' || '.')[0]
const service = axios.create({
  baseURL: (url === 'xtbg.digitalgd.com.cn' || url === 'xtbg') ? `/zwdsj${process.env.VUE_APP_BASE_API}` : process.env.VUE_APP_BASE_API,
  timeout: 60000 // request timeout
})

const getRequestIdentify = (config, isReuest = false) => {
  let url = config.url
  if (isReuest) {
    url = config.baseURL + config.url.substring(1, config.url.length)
  }
  return config.method === 'get' ? encodeURIComponent(url + JSON.stringify(config.params)) : encodeURIComponent(config.url + JSON.stringify(config.data))
}

// 请求前拦截
service.interceptors.request.use(config => {
  config.headers.common.Authorization = getToken('dpd-portal-token')
  config.headers['submit-code'] = sessionStorage.getItem('submitCode')
  return Promise.resolve(config)
}, error => {
  return Promise.reject(error)
})
// 响应后拦截
service.interceptors.response.use(res => {
  const requestData = getRequestIdentify(res.config)
  if (res.status === 200 && res.headers['content-type'].includes('application/json')) {
    if (res.request.responseType !== 'blob') {
      return Promise.resolve(res.data)
    } else {
      return Promise.resolve(res)
    }
  }
  return Promise.resolve(res)
}, err => {
  // 加载失败
  if (err.toString().indexOf('timeout') !== -1) {
    this.$emit.error('请求超时，请稍后再试')
  }
  if (err && err.response) {
    if (err.response.request.responseType === 'blob') {
      if (err && err.response) {
        switch (err.response.status) {
          case 401:
            err.message = '该用户登录失效,请重新登录'
            break
        }
        if (err.message) {
          err.response.data.message = err.message
        }
        return err
      }
    } else {
      switch (err.response.status) {
        case 400:
          err.message = JSON.parse(err.response.request.response)
          break
        case 401:
          err.message = '该用户登录失效,请重新登录'
          Message({
            type: 'error',
            message: err.message
          })
          break
        case 403:
          err.message = '对不起，您无该业务的操作权限'
          Message({
            type: 'error',
            message: err.message
          })
          break
        case 404:
          err.message = '没找到该路径'
          break
        case 500:
          err.message = (typeof (err.response.data) === 'string') ? '网络错误' : err.response.data.message
          break
      }
      if (err.message) {
        if (typeof (err.response.data) === 'string') {
          err.response.data = {
            message: '网络错误'
          }
        } else {
          err.response.data.message = err.message
        }
      }
      return err.response
    }
  }
})
export default service
