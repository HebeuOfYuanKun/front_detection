import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function getFlvUrl(app,name) {
  //query.eveType=query.eveType.join(";")
  return request({
    url: '/business/stream/flvurl',
    method: 'get',
    params: {app,name}
  })
}
export function getCurrentAlarm(query) {
  //query.eveType=query.eveType.join(";")
  return request({
    url: '/business/alarm/list',
    method: 'get',
    params: query
  })
}
// 查询control详细
// 查询识别物体列表
export function listObject(query) {
  return request({
    url: '/business/object/list',
    method: 'get',
    params: query
  })
}

// 查询识别物体所有列表
export function listAllObject(query) {
  return request({
    url: '/business/object/listAll',
    method: 'get',
    params: query
  })
}

// 查询识别物体详细
export function getObject(id) {
  return request({
    url: '/business/object/getInfo/' + id,
    method: 'get'
  })
}

// 新增识别物体
export function addObject(data) {
  return request({
    url: '/business/object/add',
    method: 'post',
    data: data
  })
}

// 修改识别物体
export function updateObject(data) {
  return request({
    url: '/business/object/edit',
    method: 'post',
    data: data
  })
}

// 删除识别物体
export function delObject(id) {
  return request({
    url: '/business/object/remove/' + id,
    method: 'get'
  })
}