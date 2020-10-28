import request from '@/utils/request'

export function imageUpload(data) {
  return request({
    url: '/upload/image',
    method: 'get',
    data: data,
    headers:{
      'Content-Type':'multipart/form-data'
    }
  })
}

export function videoUpload(data) {
  return request({
    url: '/upload/video',
    method: 'get',
    data: data,
    headers:{
      'Content-Type':'multipart/form-data'
    }
  })
}
