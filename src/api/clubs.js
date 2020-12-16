import request from '@/utils/request'

export function fetchClubList(queryInfo) {
  return request({
    url: '/club/list',
    method: 'post',
    data: queryInfo
  })
}

export function addClub(addForm) {
  return request({
    url: '/club/',
    method: 'post',
    data: addForm
  })
}

export function deleteClub(id) {
  return request({
    url: `/club/${id}/soft`,
    method: 'delete'
  })
}

export function getClubInfo(id) {
  return request({
    url: `/club/${id}/`,
    method: 'get'
  })
}

export function updateClub(id, updateForm) {
  return request({
    url: `/club/${id}`,
    method: 'put',
    data: updateForm
  })
}

export function inspectClub(clubId,pass,auditForm) {
  return request({
    url: `/club/${clubId}/audit`,
    method: 'put',
    data: auditForm,
    params: {pass: pass}
  })
}

export function getClubHobby(id) {
  return request({
    url: `/club/${id}/hobby`,
    method: 'get'
  })
}

export function getClubTag(id) {
  return request({
    url: `/course/${id}/tag`,
    method: 'get'
  })
}

//设置课程分类
export function updateClubClassification(id, idList) {
  return request({
    url: `/course/${id}/hobby`,
    method: 'put',
    data: idList
  })
}

export function fetchEventList(queryInfo,clubId) {
  return request({
    url: `/club/${clubId}/list`,
    method: 'post',
    data: queryInfo
  })
}
