import request from '@/utils/request'

// 查询message列表
export function listMessage(query) {
  return request({
    url: '/uav/message/list',
    method: 'get',
    params: query
  })
}

// 查询message所有列表
export function listAllMessage(query) {
  return request({
    url: '/uav/message/listAll',
    method: 'get',
    params: query
  })
}

// 查询message详细
export function getMessage(id) {
  return request({
    url: '/uav/message/getInfo/' + id,
    method: 'get'
  })
}

// 新增message
export function addMessage(data) {
  return request({
    url: '/uav/message/add',
    method: 'post',
    data: data
  })
}

// 修改message
export function updateMessage(data) {
  return request({
    url: '/uav/message/edit',
    method: 'post',
    data: data
  })
}

// 删除message
export function delMessage(id) {
  return request({
    url: '/uav/message/remove/' + id,
    method: 'get'
  })
}
