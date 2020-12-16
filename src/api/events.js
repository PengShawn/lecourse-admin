import request from '@/utils/request'

export function addEvent(addForm) {
  return request({
    url: '/event/',
    method: 'post',
    data: addForm
  })
}

export function deleteEvent(eventId) {
  return request({
    url: `/event/${eventId}/soft`,
    method: 'delete'
  })
}

export function updateEvent(eventId, updateForm) {
  return request({
    url: `/event/${eventId}`,
    method: 'put',
    data: updateForm
  })
}

export function inspectEvent(eventId,pass,auditForm) {
  return request({
    url: `/event/${eventId}/audit`,
    method: 'put',
    data: auditForm,
    params: {pass: pass}
  })
}

export function fetchEventList(queryInfo) {
  return request({
    url: '/event/list',
    method: 'post',
    data: queryInfo
  })
}
