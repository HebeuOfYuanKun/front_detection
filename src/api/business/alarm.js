import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listInfo(query) {
  //query.eveType=query.eveType.join(";")
  return request({
    url: '/business/alarm/list',
    method: 'get',
    params: query
  })
}
export function queryInfoById(id) {
  return request({
    url: '/message/warning/downloadImage/'+id,
    method: 'get',
    //params: query
  })
}
export const publishExportTemplateFile = (res, name, type = false) => {
  let url;
  if (type) {
    url = window.URL.createObjectURL(new Blob([res], {type: 'application/zip'}));
  } else {
    url = window.URL.createObjectURL(new Blob([res],{type: 'image/jpeg'}));
  }
  // const url = window.URL.createObjectURL(new Blob([res]));
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
 
export function downloadFile(filePath) {
  request({
    url: '/message/warning/downloadImage/'+filePath,
    method: 'get',
    params: {fileName: filePath, delete: false},
    responseType: 'blob' // 设置响应类型为 blob
  })
    .then(response => {
      publishExportTemplateFile(response ,filePath);
    })
    .catch(error => {
      console.error('Download file failed:', error);
    });
}
// 查询【请填写功能名称】所有列表
export function listAllInfo(query) {
  return request({
    url: '/business/alarm/listAll',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getInfo(unsafeid) {
  return request({
    url: '/business/alarm/getInfo/' + unsafeid,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addInfo(data) {
  return request({
    url: '/message/warning/add',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateInfo(data) {
  return request({
    url: '/message/warning/edit',
    method: 'post',
    data: data
  })
}

// 删除【请填写功能名称】
export function delInfo(unsafeid) {
  return request({
    url: '/business/alarm/remove/' + unsafeid,
    method: 'get'
  })
}
