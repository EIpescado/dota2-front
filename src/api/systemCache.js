import request from '@/utils/request'

export function systemCacheList(data) {
  return request({
    url: '/systemCache',
    method: 'get',
    params: data
  })
}

export function deleteCache(data) {
  return request({
    url: '/systemCache/delete',
    method: 'post',
    data
  })
}

export function flushDb() {
  return request({
    url: '/systemCache/flushDb',
    method: 'post'
  })
}
