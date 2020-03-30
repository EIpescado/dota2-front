import request from '@/utils/request'

export function jobSelect(data) {
  return request({
    url: '/job/select',
    method: 'get',
    params: data
  })
}

export function create(data) {
  return request({
    url: '/job',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/job/' + id,
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: '/job/' + id,
    method: 'get'
  })
}

export function deleteJob(id) {
  return request({
    url: '/job/delete/' + id,
    method: 'post'
  })
}

export function list(data) {
  return request({
    url: '/job',
    method: 'get',
    params: data
  })
}
