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

export function inspectSubComment(id, pass,inspectForm) {
  return request({
    url: `/comment/sub/${id}/audit`,
    method: 'put',
    data: inspectForm,
    params: {pass: pass}
  })
}

export function batchDeleteSubComment(ids) {
  return request({
    url: '/comment/sub/soft/ids',
    method: 'delete',
    data: ids
  })
}
