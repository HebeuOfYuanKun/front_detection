import request from '@/utils/request'

// 查询无人机配置信息列表
export function listUavConfig(query) {
  return request({
    url: '/uav/uavConfig/list',
    method: 'get',
    params: query
  })
}

// 查询无人机配置信息所有列表
export function listAllUavConfig(query) {
  return request({
    url: '/uav/uavConfig/listAll',
    method: 'get',
    params: query
  })
}

// 查询无人机配置信息详细
export function getUavConfig(id) {
  return request({
    url: '/uav/uavConfig/getInfo/' + id,
    method: 'get'
  })
}

// 新增无人机配置信息
export function addUavConfig(data) {
  return request({
    url: '/uav/uavConfig/add',
    method: 'post',
    data: data
  })
}

// 修改无人机配置信息
export function updateUavConfig(data) {
  return request({
    url: '/uav/uavConfig/edit',
    method: 'post',
    data: data
  })
}

// 连接无人机
export function connectUav(id) {
    return request({
      url: '/uav/uavConfig/connect/'+id,
      method: 'get',
    })
  }
// 断开连接无人机
export function disconnectUav(id) {
  return request({
    url: '/uav/uavConfig/disconnect/'+id,
    method: 'get',
  })
}

// 删除无人机配置信息
export function delUavConfig(id) {
  return request({
    url: '/uav/uavConfig/remove/' + id,
    method: 'get'
  })
}
