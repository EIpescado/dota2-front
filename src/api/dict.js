import request from '@/utils/request'

export function listDict(data) {
  return request({
    url: '/dict',
    method: 'get',
    params: data
  })
}

export function getDict(id) {
  return request({
    url: '/dict/' + id,
    method: 'get'
  })
}

export function deleteDict(id) {
  return request({
    url: '/dict/delete/' + id,
    method: 'post'
  })
}

export function createDict(data) {
  return request({
    url: '/dict',
    method: 'post',
    data
  })
}

export function updateDict(id, data) {
  return request({
    url: '/dict/' + id,
    method: 'post',
    data
  })
}

export function getDictMember(id) {
  return request({
    url: '/dictMember/' + id,
    method: 'get'
  })
}

export function deleteDictMember(id) {
  return request({
    url: '/dictMember/delete/' + id,
    method: 'post'
  })
}

export function createDictMember(data) {
  return request({
    url: '/dictMember',
    method: 'post',
    data
  })
}

export function updateDictMember(id, data) {
  return request({
    url: '/dictMember/' + id,
    method: 'post',
    data
  })
}

export function listDictMember(data) {
  return request({
    url: '/dictMember',
    method: 'get',
    params: data
  })
}

export function select(dictName) {
  return request({
    url: '/dictMember/select',
    method: 'get',
    params: { dictName: dictName }
  })
}
