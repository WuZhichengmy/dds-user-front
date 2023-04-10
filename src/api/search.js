import request from '@/utils/request'

const BASE_URL = '/resource'

//检索结果显示字段
export function searchFields(resourceId) {
  return request({
    url: `${BASE_URL}/${resourceId}/search/fields`,
    method: 'get',
    data: {
      resourceId
    }
  })
}

// 基础检索
export function baseSearch(data) {
  return request({
    url: `${BASE_URL}/baseSearch`,
    method: 'post',
    data
  })
}

// 高级检索
export function advancedSearch(data) {
  return request({
    url: `${BASE_URL}/advancedSearch`,
    method: 'post',
    data
  })
}

// 高级检索配置
export function advancedSearchConfig(projectId, type) {
  return request({
    url: `${BASE_URL}/${projectId}/getAdvancedSearch/0`,
    method: 'get'
  })
}

//导出检索结果
export function exportData(data) {
  return request({
    url: `${BASE_URL}/exportData`,
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
