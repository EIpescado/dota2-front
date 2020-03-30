import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function validCode() {
  return request({
    url: '/auth/validCode',
    method: 'get'
  })
}

export function retrievePasswordStep1(data) {
  return request({
    url: '/auth/retrievePasswordStep1',
    method: 'post',
    data
  })
}

export function retrievePasswordStep2(data) {
  return request({
    url: '/auth/retrievePasswordStep2',
    method: 'post',
    data
  })
}

export function retrievePasswordStep3(data) {
  return request({
    url: '/auth/retrievePasswordStep3',
    method: 'post',
    data
  })
}

export function sendMessageAuthCode(phone, type) {
  return request({
    url: '/auth/sendMessageAuthCode',
    method: 'get',
    params: { phone: phone, type: type }
  })
}

export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}
