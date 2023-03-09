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

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.msg || '失败',
        type: 'error',
        duration: 5 * 1000
      })
      // 401:表示Token 过期
      if (res.code === 401) {
        // to re-login 
        Message.warning('token过期了,请重新登陆')
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }

      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
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
