import request from '@/utils/request'

export function getButton(id) {
  return request({
    url: '/button/' + id,
    method: 'get'
  })
}

export function deleteButton(id) {
  return request({
    url: '/button/delete/' + id,
    method: 'post'
  })
}

export function createButton(data) {
  return request({
    url: '/button',
    method: 'post',
    data
  })
}

export function updateButton(id, data) {
  return request({
    url: '/button/' + id,
    method: 'post',
    data
  })
}
