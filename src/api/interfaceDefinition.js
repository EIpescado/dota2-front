import request from '@/utils/request'

export function create(data) {
  return request({
    url: '/interfaceDefinition',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/interfaceDefinition/' + id,
    method: 'post',
    data
  })
}

export function list(data) {
  return request({
    url: '/interfaceDefinition',
    method: 'get',
    params: data
  })
}

export function get(id) {
  return request({
    url: '/interfaceDefinition/' + id,
    method: 'get'
  })
}

export function interfaceTree() {
  return request({
    url: '/interfaceDefinition/tree',
    method: 'get'
  })
}
