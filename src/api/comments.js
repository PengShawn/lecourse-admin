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
    url: `/comment/${id}/soft`,
    method: 'delete'
  })
}

export function inspectComment(commentId,pass,inspectForm) {
  return request({
    url: `/comment/${commentId}/audit`,
    method: 'post',
    data: inspectForm,
    params: {pass: pass}
  })
}

export function batchDeleteComment(ids) {
  return request({
    url: '/comment/soft/multi',
    method: 'delete',
    data: ids
  })
}
