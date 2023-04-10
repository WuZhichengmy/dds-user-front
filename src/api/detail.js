import request from '@/utils/request'

const BASE_URL = '/resource'

/**
 *资源详情
 */
export function detailFields(resourceId) {
  return request({
    url: `${BASE_URL}/${resourceId}/detail/fields`,
    method: 'get',
    data: {
      resourceId
    }
  })
}

export function detailResult(resourceId, id) {
  return request({
    // 为什么这里也会有错误...
    url: `${BASE_URL}/${resourceId}/result/${id}`,
    method: 'get'
  })
}
