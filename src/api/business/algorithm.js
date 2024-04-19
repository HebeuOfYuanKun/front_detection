import request from '@/utils/request'

// 查询算法列表
export function listAlgorithm(query) {
  return request({
    url: '/business/algorithm/list',
    method: 'get',
    params: query
  })
}

// 查询算法所有列表
export function listAllAlgorithm(query) {
  return request({
    url: '/business/algorithm/listAll',
    method: 'get',
    params: query
  })
}

// 查询算法详细
export function getAlgorithm(id) {
  return request({
    url: '/business/algorithm/getInfo/' + id,
    method: 'get'
  })
}

// 新增算法
export function addAlgorithm(data) {
  return request({
    url: '/business/algorithm/add',
    method: 'post',
    data: data
  })
}

// 修改算法
export function updateAlgorithm(data) {
  return request({
    url: '/business/algorithm/edit',
    method: 'post',
    data: data
  })
}

// 删除算法
export function delAlgorithm(id) {
  return request({
    url: '/business/algorithm/remove/' + id,
    method: 'get'
  })
}
