import request from '@/utils/request'

export function fetchHobbyList() {
  return request({
    url: '/hobby/',
    method: 'get'
  })
}
