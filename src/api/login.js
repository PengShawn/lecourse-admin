import request from '@/utils/request'
export function login(loginForm) {
  return request({
    url: '/user/login',
    method: 'post',
    data: loginForm
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}
