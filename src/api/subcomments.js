import request from '@/utils/request'

export function fetchSubCommentList(queryInfo) {
  return request({
    url: '/comment/sub/list',
    method: 'post',
    data: queryInfo
  })
}

export function deleteSubCommentById(id) {
  return request({
    url: '/comment/sub/soft/' + id,
    method: 'delete'
  })
}

export function inspectSubComment(commentId, inspectForm) {
  return request({
    url: `/comment/sub/${commentId}/audit`,
    method: 'put',
    data: inspectForm
  })
}

export function batchDeleteSubComment(ids) {
  return request({
    url: '/comment/sub/soft/ids',
    method: 'delete',
    data: ids
  })
}
