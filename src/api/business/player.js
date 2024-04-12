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
