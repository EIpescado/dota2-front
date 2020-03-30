import request from '@/utils/request'

export function departmentTree() {
  return request({
    url: '/department/tree',
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/department',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/department/' + id,
    method: 'post',
    data
  })
}

export function deleteDepartment(id) {
  return request({
    url: '/department/delete/' + id,
    method: 'post'
  })
}

export function get(id) {
  return request({
    url: '/department/' + id,
    method: 'get'
  })
}
