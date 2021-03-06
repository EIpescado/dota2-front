import request from '@/utils/request'

export function tree() {
  return request({
    url: '/menu/tree',
    method: 'get'
  })
}

export function fullTree() {
  return request({
    url: '/menu/fullTree',
    method: 'get'
  })
}

export function get(id) {
  return request({
    url: '/menu/' + id,
    method: 'get'
  })
}

export function deleteMenu(id) {
  return request({
    url: '/menu/delete/' + id,
    method: 'post'
  })
}

export function create(data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/menu/' + id,
    method: 'post',
    data
  })
}
