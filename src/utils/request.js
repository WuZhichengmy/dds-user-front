import axios from 'axios'
import router from '@/router/routers'
import store from '../store'
import { getToken } from '@/utils/auth'
import Config from '@/settings'
import Cookies from 'js-cookie'
const ignoreUrl = ['/exportData']

// 创建axios实例
const service = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  timeout: Config.timeout // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    let flag = false
    ignoreUrl.map(item => {
      if (response.config.url.indexOf(item) !== -1) {
        flag = true
      }
    })
    if (flag) return response
    return response.data
  },
  error => {
    // 兼容blob下载出错json提示
    if (
      error.response.data instanceof Blob &&
      error.response.data.type.toLowerCase().indexOf('json') !== -1
    ) {
      const reader = new FileReader()
      reader.readAsText(error.response.data, 'utf-8')
      reader.onload = function(e) {
        const errorMsg = JSON.parse(reader.result).message
        Vue.prototype.$Message.error({
          content: errorMsg,
          duration: 3
        })
      }
    } else {
      let code = 0
      try {
        code = error.response.data.status
      } catch (e) {
        if (error.toString().indexOf('Error: timeout') !== -1) {
          Vue.prototype.$Message.error({
            content: '网络请求超时',
            duration: 3
          })
          return Promise.reject(error)
        }
      }
      if (code) {
        if (code === 401) {
          store.dispatch('LogOut').then(() => {
            Cookies.set('point', 401)
            // location.reload()
          })
        } else if (code === 403) {
          router.push({
            path: '/401'
          })
        } else if (code == 404) {
          Vue.prototype.$Message.error({
            content: '接口不存在',
            duration: 3
          })
        } else {
          const errorMsg = error.response.data.message
          if (errorMsg !== undefined) {
            Vue.prototype.$Message.error({
              content: errorMsg,
              duration: 3
            })
          }
        }
      } else {
        const { status, statusText } = error.response
        Vue.prototype.$Message.error({
          content: `${status}:${statusText}`,
          duration: 3
        })
      }
    }
    return Promise.reject(error)
  }
)
export default service
