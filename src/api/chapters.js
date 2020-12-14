import request from '@/utils/request'

export function addChapter(addForm) {
  return request({
    url: '/chapter/',
    method: 'post',
    data: addForm
  })
}

export function deleteChapter(chapterId) {
  return request({
    url: `/chapter/${chapterId}/soft`,
    method: 'delete'
  })
}

export function updateChapter(chapterId, updateForm) {
  return request({
    url: `/chapter/${chapterId}`,
    method: 'put',
    data: updateForm
  })
}

export function inspectChapter(chapterId,pass,auditForm) {
  return request({
    url: `/chapter/${chapterId}/audit`,
    method: 'put',
    data: auditForm,
    params: {pass: pass}
  })
}
