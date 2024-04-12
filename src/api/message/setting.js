import request from '@/utils/request'

// 查询参数设定列表
export function listSetting(query) {
  return request({
    url: '/message/setting/list',
    method: 'get',
    params: query
  })
}

// 查询参数设定所有列表
export function listAllSetting(query) {
  return request({
    url: '/message/setting/listAll',
    method: 'get',
    params: query
  })
}

// 查询参数设定详细
export function getSetting(setid) {
  return request({
    url: '/message/setting/getInfo/' + setid,
    method: 'get'
  })
}

// 新增参数设定
export function addSetting(data) {
  return request({
    url: '/message/setting/add',
    method: 'post',
    data: data
  })
}

// 修改参数设定
export function updateSetting(data) {
  return request({
    url: '/message/setting/edit',
    method: 'post',
    data: data
  })
}

// 删除参数设定
export function delSetting(setid) {
  return request({
    url: '/message/setting/remove/' + setid,
    method: 'get'
  })
}
