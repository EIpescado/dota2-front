import request from '@/utils/request'

export function create(data) {
  return request({
    url: '/faq',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/faq/' + id,
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: '/faq/' + id,
    method: 'get'
  })
}

export function deleteFAQ(id) {
  return request({
    url: '/faq/delete/' + id,
    method: 'post'
  })
}

export function list(data) {
  return request({
    url: '/faq',
    method: 'get',
    params: data
  })
}
