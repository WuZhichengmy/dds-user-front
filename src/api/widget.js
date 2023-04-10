import request from '@/utils/request'

const BASE_URL = '/widgets'

//项目所有组件id
export function widgetConfig(projectId) {
  return request({
    url: `${BASE_URL}/config/${projectId}`,
    method: 'get',
  })
}

// 项目组件详情
export function widgetInfo(projectId, id) {
  return request({
    url: `${BASE_URL}/${projectId}/widgets/${id}`,
    method: 'get',
  })
}
