import request from '@/utils/request'

export function permissionFullTree() {
  return request({
    url: '/permission/fullTree',
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/permission',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/permission/' + id,
    method: 'post',
    data
  })
}

export function deletePermission(id) {
  return request({
    url: '/permission/delete/' + id,
    method: 'post'
  })
}

export function get(id) {
  return request({
    url: '/permission/' + id,
    method: 'get'
  })
}
