import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 配置请求拦截器
service.interceptors.request.use(
  config => {
    // 如果本地存储存在token则携带过去
    if (store.getters.token) {
      config.headers['token'] = "Bearer "+ getToken() // 请求头添加token和Bearer
      // 配置post的请求头，默认是表单提交
      config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 相应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      Message({
        message: res.msg || '失败',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    switch (error.response.status) {
      // 401:表示Token 过期
      case 401:
        Message.error(error.response.data.msg)
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
        break;
        case 404:
          Message.error('接口请求不存在')
          break;
      default:
        Message.error(error.response.data.message)
        break;
    }
    return Promise.reject(error)
  }
)
export function get(url,params){
  return service.get(url,{params})
}

export function post(url,data){
  return service({
    method:'post',
    url,
    data:qs.stringify(data)
  })
}
// 文件上传
export function upload(url,data){
  return service({
    method:'post',
    url,
    headers:{
      ["Content-Type"]: "multipart/form-data"
    },
    data
  })
}

export default service
