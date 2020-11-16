import request from '@/utils/request'

export function fetchCommentList(queryInfo) {
  return request({
    url: '/comment/list',
    method: 'post',
    data: queryInfo
  })
}

export function deleteCommentById(id) {
  return request({
    url: '/comment/soft/' + id,
    method: 'delete'
  })
}

export function inspectComment(inspectForm) {
  return request({
    url: '/comment/audit',
    method: 'post',
    data: inspectForm
  })
}

export function batchDeleteComment(ids) {
  return request({
    url: '/comment/soft/ids',
    method: 'delete',
    data: ids
  })
}
