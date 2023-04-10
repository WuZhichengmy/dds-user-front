import request from '@/utils/request'

const BASE_URL = '/analysis'

// 分析报告 导航
export function reportMenu(projectId, resourceId) {
  return request({
    url: `${BASE_URL}/menu/project/${projectId}/resource/${resourceId}`,
    method: 'get'
  })
}

export function reportResult(menuId, data) {
  return request({
    url: `${BASE_URL}/detail/${menuId}/result`,
    method: 'post',
    data
  })
}
