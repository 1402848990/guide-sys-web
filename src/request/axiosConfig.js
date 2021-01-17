/**
 * axios 拦截封装
 */
import axios from 'axios'
import baseUrl from './baseUrl'
import { message } from 'antd'
import qs from 'qs'
import Cookie from 'js-cookie'


let service = axios.create({
  baseURL: baseUrl,
  timeout: 600000,
  withCredentials:true
})

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    console.log('response', response)
    //获取更新的token
    // const { token } = response.data;
    //如果token存在则存在localStorage
    // token && localStorage.setItem('token', token);
    const { data } = response
    if(!data.success){
      message.error(data.message)
      return Promise.reject(data.message)
    }
    return data
  },
  (error) => {
    if (error.response) {
      console.log('error',error)
      const { status } = error.response
      //如果401或405则到登录页
      if (status === 401 || status === 405) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    console.log(config)
    // 在cookie中取出用户信息
    const cookie = Cookie.get('userInfo')
    config.headers['Set-Cookie'] = encodeURIComponent(cookie);
    // post请求使用表单的形式提交
    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
      // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return config
  },
  (error) => {
    console.log('error', error)
    return Promise.reject(error)
  }
)

export default service
