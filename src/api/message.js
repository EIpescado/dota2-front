import request from '@/utils/request'

export function webList(data) {
  return request({
    url: '/message/web',
    method: 'get',
    params: data
  })
}

export function systemList(data) {
  return request({
    url: '/message/system',
    method: 'get',
    params: data
  })
}

export function noticeList(data) {
  return request({
    url: '/message/notice',
    method: 'get',
    params: data
  })
}

export function noticeDetail(id) {
  return request({
    url: '/message/notice/' + id,
    method: 'get'
  })
}

export function createNotice(data) {
  return request({
    url: '/message/notice',
    method: 'post',
    data
  })
}

export function updateNotice(id, data) {
  return request({
    url: '/message/notice/' + id,
    method: 'post',
    data
  })
}

export function unReadSummarize() {
  return request({
    url: '/message/unReadSummarize',
    method: 'get'
  })
}
