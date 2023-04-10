import request from '@/utils/request'

const BASE_URL = '/resource'

/**
 * 结果分析
 */
export function statisticsFields(resourceId) {
  return request({
    url: `${BASE_URL}/${resourceId}/getSearchStatisticsFields`,
    method: 'get'
  })
}

export function baseStatistics(data) {
  return request({
    url: `${BASE_URL}/baseStatistics`,
    method: 'post',
    data
  })
}

export function advancedStatistics(data) {
  return request({
    url: `${BASE_URL}/advancedStatistics`,
    method: 'post',
    data
  })
}
