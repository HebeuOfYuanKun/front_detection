import request from '@/utils/request'

// 查询测试列表
export function listTestInfo(query) {
  return request({
    url: '/business/testInfo/list',
    method: 'get',
    params: query
  })
}

// 查询测试所有列表
export function listAllTestInfo(query) {
  return request({
    url: '/business/testInfo/listAll',
    method: 'get',
    params: query
  })
}

// 查询测试详细
export function getTestInfo(id) {
  return request({
    url: '/business/testInfo/getInfo/' + id,
    method: 'get'
  })
}

// 新增测试
export function addTestInfo(data) {
  return request({
    url: '/business/testInfo/add',
    method: 'post',
    data: data
  })
}

// 修改测试
export function updateTestInfo(data) {
  return request({
    url: '/business/testInfo/edit',
    method: 'post',
    data: data
  })
}

// 删除测试
export function delTestInfo(id) {
  return request({
    url: '/business/testInfo/remove/' + id,
    method: 'get'
  })
}
