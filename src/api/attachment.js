import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/attachment',
    method: 'get',
    params: data
  })
}
