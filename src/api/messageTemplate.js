import request from '@/utils/request'

export function create(data) {
  return request({
    url: '/messageTemplate',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/messageTemplate/' + id,
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: '/messageTemplate/' + id,
    method: 'get'
  })
}

export function deleteMessageTemplate(id) {
  return request({
    url: '/messageTemplate/delete/' + id,
    method: 'post'
  })
}

export function list(data) {
  return request({
    url: '/messageTemplate',
    method: 'get',
    params: data
  })
}
