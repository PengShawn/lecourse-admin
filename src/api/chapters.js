import request from '@/utils/request'

export function fetchChapterList(queryInfo) {
  return request({
    url: '/course/list',
    method: 'post',
    data: queryInfo
  })
}
