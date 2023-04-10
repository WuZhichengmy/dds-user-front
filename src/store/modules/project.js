import { widgetConfig, widgetInfo } from '@/api/widget'

import { resourceConfig } from '@/api/resource'

import { advancedSearchConfig } from '@/api/search'

import { sortBy } from '@/utils/utils'
import sysEnum from '@/common/sysEnum'
import { uniqueByKeys } from '@/utils'

import {
  PROJECT_ID,
  TITLE_CN,
  TITLE_EN,
  LOGO,
  COPYRIGHT,
  RECORD,
  DOMAIN_RECORD,
  IMG_URL
} from '@/settings'

const project = {
  namespaced: true,
  state: {
    projectId: PROJECT_ID,
    resources: [],
    gradeSearchConfig: null,
    widgetIds: {},
    copyright: null,
    logo: null
  },

  mutations: {
    SET_RESOURCES: (state, payload) => {
      state.resources = payload
    },
    SET_GRADE_SEARCH_CONFIG: (state, payload) => {
      state.gradeSearchConfig = payload
    },
    SET_WIDGETS: (state, payload) => {
      state.widgetIds = payload
    },
    SET_WIDGET_INFO: (state, payload) => {
      const { type, data } = payload
      state[type] = data
    }
  },
  actions: {
    getWidgetConfig({ state, commit }) {
      return new Promise(resolve => {
        const { projectId } = state
        widgetConfig(projectId)
          .then(res => {
            const widgetIds = {}
            Object.keys(res).map(key => {
              widgetIds[sysEnum.widgetTypes.getLabelByValue(parseInt(key))] =
                res[key]
            })
            commit('SET_WIDGETS', widgetIds)
            resolve()
          })
          .catch(() => {})
      })
    },
    commonWidget({ state, commit }, type) {
      return new Promise(resolve => {
        const { projectId } = state
        const widgetId = state.widgetIds[type]
        const ls = Vue.ls.get(widgetId)
        if (ls) {
          commit('SET_WIDGET_INFO', {
            type,
            data: JSON.parse(ls)
          })
          resolve()
          return
        }
        widgetInfo(projectId, widgetId).then(res => {
          const {
            data: { data }
          } = res
          const info = data[Object.keys(data)[0]]
          if (type === 'logo') {
            info.logo = IMG_URL + info.logo
          }
          Vue.ls.set(widgetId, JSON.stringify(info), 1000 * 60 * 24 * 7)
          commit('SET_WIDGET_INFO', {
            type,
            data: info
          })
          resolve()
        })
      })
    },
    getResources({ state, commit }) {
      return new Promise(resolve => {
        const { projectId } = state
        resourceConfig(projectId)
          .then(res => {
            const { data } = res
            commit('SET_RESOURCES', data.sort(sortBy('defaultResource', -1)))
            resolve(data)
          })
          .catch(() => {})
      })
    },
    AdvancedSearchConfig({ state, commit }, type) {
      return new Promise(resolve => {
        const { projectId } = state
        advancedSearchConfig(projectId)
          .then(res => {
            commit('SET_GRADE_SEARCH_CONFIG', res)
            resolve()
          })
          .catch(() => {})
      })
    }
  },
  getters: {
    resourceIdList(state) {
      return state.resources.map(item => {
        return item.id
      })
    },
    logoOfGetter(state) {
      const { logo } = state
      return logo
        ? logo
        : {
            titleCn: TITLE_CN,
            titleEn: TITLE_EN,
            logo: LOGO
          }
    },
    copyrightOfGetter(state) {
      const { copyright } = state
      return copyright
        ? copyright
        : {
            copyright: COPYRIGHT,
            record: RECORD,
            domainRecord: DOMAIN_RECORD
          }
    },
    searchConfigOfGetter(state) {
      const { gradeSearchConfig } = state
      const res = []
      gradeSearchConfig.map(item => {
        item.advancedSearchFields.map(item2 => {
          item2.value = item.name + '-' + item.resourceId
          item2.resourceId = item.resourceId
        })
        res.push(...item.advancedSearchFields)
      })
      return uniqueByKeys(res, ['name', 'label'])
    }
  }
}

export default project
