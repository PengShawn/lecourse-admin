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
    url: `/club/hobby/list/${id}`,
    method: 'get'
  })
}


//设置课程分类
export function updateClubClassification(id, idList) {
  return request({
    url: `/club/hobby/${id}`,
    method: 'post',
    data: idList
  })
}

export function fetchEventListById(clubId,queryInfo) {
  return request({
    url: `/club/events/${clubId}`,
    method: 'post',
    data: queryInfo
  })
}
