import request from '@/utils/request'

export function roleSelect() {
  return request({
    url: '/role/select',
    method: 'get'
  })
}

export function roleList(data) {
  return request({
    url: '/role',
    method: 'get',
    params: data
  })
}

export function create(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/role/' + id,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/role/delete/' + id,
    method: 'post'
  })
}

export function get(id) {
  return request({
    url: '/role/' + id,
    method: 'get'
  })
}

export function singleRoleMenuAndButton(id) {
  return request({
    url: '/role/' + id + '/mbs',
    method: 'get'
  })
}

export function bindComponent(id, data) {
  return request({
    url: '/role/' + id + '/bind',
    method: 'post',
    data
  })
}
