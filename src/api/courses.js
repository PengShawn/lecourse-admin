import request from '@/utils/request'

export function fetchCourseList(queryInfo) {
  return request({
    url: '/course/list',
    method: 'post',
    data: queryInfo
  })
}

export function addCourse(addForm) {
  return request({
    url: '/course/',
    method: 'post',
    data: addForm
  })
}

export function deleteCourse(id) {
  return request({
    url: `/course/${id}/soft`,
    method: 'delete'
  })
}

export function getCourseInfo(id) {
  return request({
    url: `/course/${id}/`,
    method: 'get'
  })
}

export function updateCourse(id, updateForm) {
  return request({
    url: `/course/${id}`,
    method: 'put',
    data: updateForm
  })
}

export function inspectCourse(courseId,pass,auditForm) {
  return request({
    url: `/course/${courseId}/audit`,
    method: 'put',
    data: auditForm,
    params: {pass: pass}
  })
}

export function getCourseHobby(id) {
  return request({
    url: `/course/${id}/hobby`,
    method: 'get'
  })
}

export function getCourseTag(id) {
  return request({
    url: `/course/${id}/tag`,
    method: 'get'
  })
}

export function fetchChapterList(queryInfo,courseId) {
  return request({
    url: `/course/${courseId}/list`,
    method: 'post',
    data: queryInfo
  })
}
