import axios from 'axios'
import platform from 'platform'
//###################################################axios封装 ###############################################
/**
  创建axios对象
 */
const CancelToken = axios.CancelToken
const service = axios.create({
  timeout: 5000,
  headers: {
    PlatForm: platform.os + '$' + platform.name + '$' + platform.version,
    EquipmentNo: 'web'
  },
  cancelToken: new CancelToken(function executor(c) {
    self.cancel = c
  })
})
/*
允许用户操作系统的作用时长
 */
const operateTime = 30 * 60 * 1000
/**
 * 需要放行的路径
 */
const url = ['/cts/user/login']

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  config => {
    if (!sessionStorage.time) {
      sessionStorage.time = new Date().getTime()
    }
    const delayTime = new Date().getTime() - sessionStorage.time
    if (!url.includes(config.url)) {
      if (delayTime > operateTime || !sessionStorage.user_info || !sessionStorage.token) {
        //清除session
        sessionStorage.clear();
        window.location.href = '/';
        this.cancel();
      }
      sessionStorage.time = new Date().getTime()
    }
    config.headers['token'] = sessionStorage.token
    return config
  },
  error => {
    Promise.reject(error)
  }
)
/**
 * 响应拦截器
 */
service.interceptors.response.use(
  response => {
    return Promise.resolve(response)
  },
  error => {
    if (error.response.status === 401) {
      window.location.href = '/';
    }
    return Promise.reject(error)
  }
)

export default service
