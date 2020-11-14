import request from '@/utils/request'

export function fetchTagList() {
  return request({
    url: '/tag/',
    method: 'get'
  })
}
