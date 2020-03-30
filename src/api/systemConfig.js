import request from '@/utils/request'

export function systemConfigList(data) {
  return request({
    url: '/systemConfig',
    method: 'get',
    params: data
  })
}

export function create(data) {
  return request({
    url: '/systemConfig',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/systemConfig/' + id,
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: '/systemConfig/' + id,
    method: 'get'
  })
}
