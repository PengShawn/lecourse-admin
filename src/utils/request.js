import axios from 'axios'
import { Message, MessageBox } from 'element-ui'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://106.15.192.234:80', // api的base_url
  timeout: 15000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
  config.headers.token = window.sessionStorage.getItem('token');
  return config
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error)
});

// respone拦截器
service.interceptors.response.use(
    response => {
      /**
       * errorCode为非'200'是抛错 可结合自己业务进行修改
       */
      const res = response.data;
      if (res.errorCode !== '0') {
        Message({
          message: res.errorMessage,
          type: 'error',
          duration: 3 * 1000
        });

        // '1001':未登录;
        if (res.errorCode === '1001') {
          MessageBox.confirm('你已被登出，请重新登录', '确定登出', {
            confirmButtonText: '重新登录',
            type: 'warning'
          }).then(() => {
            // store.dispatch('FedLogOut').then(() => {
            //   location.reload()// 为了重新实例化vue-router对象 避免bug
            // })
            window.sessionStorage.removeItem('token');
            //this.$router.push('/login');
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        }
        return Promise.reject('error')
      } else {
        return response.data
      }
    },
    error => {
      console.log('err' + error)// for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error)
    }
);

export default service
