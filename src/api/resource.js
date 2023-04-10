import request from '@/utils/request'

const BASE_URL = '/resource'

//项目所有资源
export function resourceConfig(projectId) {
  return request({
    url: `${BASE_URL}/${projectId}/resources`,
    method: 'get',
  })
}

