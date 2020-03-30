import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import { tokenHeaderName } from '@/settings'

let isRefreshing = false

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      // 登录退出时 此时可能store中token还存在
      const currentToken = getToken()
      config.headers[tokenHeaderName] = currentToken != null ? currentToken : ''
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 0, it is judged as an error.
    if (res.code !== '0') {
      if (res.code === '10006' || res.code === '10008' || res.code === '10010') {
        removeToken()
        store.dispatch('user/logout')
        // 重新登录
        MessageBox.confirm('登录已失效, 您可以继续停留在此页面, 或重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '继续停留',
          type: 'warning'
        }).then(() => {
          // 清除tab 防止不同账号登录情况出现tab权限问题
          store.dispatch('tagsView/delAllViews').then(() => {
            location.reload()
          })
        }).catch(() => {})
      } else if (res.code === '10009') {
        // 刷新token
        if (!isRefreshing) {
          isRefreshing = true
          store.dispatch('user/refreshToken', res.res)
        }
        const originalRequest = response.config
        const retryOriginalRequest = new Promise((resolve) => {
          originalRequest.headers[tokenHeaderName] = res.res
          originalRequest.baseURL = ''
          axios(originalRequest).then(response => {
            resolve(response.data.res)
          })
        })
        return retryOriginalRequest
      } else if (res.code === '10015') {
        // 重置密码失效 从头开始
        Message({
          message: '重置密码操作已失效,请刷新页面',
          type: 'error',
          duration: 4 * 1000
        })
      } else {
        Message({
          message: res.message || 'error',
          type: 'error',
          duration: 2 * 1000
        })
      }
      isRefreshing = false
      return Promise.reject(new Error(res.message || 'error'))
    } else {
      isRefreshing = false
      return res.res
    }
  },
  error => {
    console.log(error.message)
    Message({
      message: '网络异常,稍后重试',
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
