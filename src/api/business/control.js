import request from '@/utils/request'

// 查询control列表
export function listControl(query) {
  return request({
    url: '/business/control/list',
    method: 'get',
    params: query
  })
}

// 查询control所有列表
export function listAllControl(query) {
  return request({
    url: '/business/control/listAll',
    method: 'get',
    params: query
  })
}

// 查询control详细
export function getControl(id) {
  return request({
    url: '/business/control/getInfo/' + id,
    method: 'get'
  })
}
// 加入识别
export function addDetectionBy(id) {
  return request({
    url: '/business/control/detection/' + id,
    method: 'post'
  })
}

export function deleteDetection(id) {
  return request({
    url: '/business/control/detection/' + id,
    method: 'delete'
  })
}
// 新增control
export function addControl(data) {
  return request({
    url: '/business/control/add',
    method: 'post',
    data: data
  })
}

// 修改control
export function updateControl(data) {
  return request({
    url: '/business/control/edit',
    method: 'post',
    data: data
  })
}

// 删除control
export function delControl(id) {
  return request({
    url: '/business/control/remove/' + id,
    method: 'get'
  })
}
