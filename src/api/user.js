import request from '@/utils/request'

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function list(data) {
  return request({
    url: '/user',
    method: 'get',
    params: data
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/delete/' + id,
    method: 'post'
  })
}

export function changePassword(data) {
  return request({
    url: '/user/changePassword',
    method: 'post',
    data
  })
}

export function userStatusSelect() {
  return request({
    url: '/user/statusSelect',
    method: 'get'
  })
}
