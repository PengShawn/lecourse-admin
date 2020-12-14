import request from '@/utils/request'

export function fetchUserList(queryInfo) {
  return request({
    url: '/user/list',
    method: 'post',
    data: queryInfo
  })
}

export function addUser(addForm) {
  return request({
    url: '/user/',
    method: 'post',
    data: addForm
  })
}

export function deleteUser(id) {
  return request({
    url: `/user/${id}/soft`,
    method: 'delete'
  })
}

export function getUserInfo(id) {
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}

export function updateUser(id, updateForm) {
  return request({
    url: `/user/${id}`,
    method: 'put',
    data: updateForm
  })
}

export function updateUserRole(userId, list) {
  return request({
    url: `/user/${userId}/role`,
    method: 'put',
    data: list
  })
}

export function batchDeleteUser(ids) {
  return request({
    url: '/user/soft/multi',
    method: 'delete',
    data: ids
  })
}

