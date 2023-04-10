import { mapState, mapActions, mapGetters } from 'vuex'
import Vue from 'vue'

const SEARCH_MODE = ['base', 'advanced']

import { getQueryParameterBySearchId, setSearchId } from '@/utils/query-string'

export default {
  data() {
    return {
      currentSearchMode: ''
    }
  },
  computed: {
    ...mapState('project', ['projectId', 'gradeSearchConfig', 'resources']),
    ...mapGetters('project', ['searchConfigOfGetter'])
  },
  methods: {
    ...mapActions('project', ['getWidgetConfig', 'commonWidget']),
    initSearchConfig() {
      const {
        resources,
        gradeSearchConfig,
        $route: {
          params: { mode }
        }
      } = this
      this.currentSearchMode = mode
      this.baseSearchConfig.data.map(item => {
        item.data = resources
      })
      this.advancedSearchConfig.data.map(item => {
        item.data = gradeSearchConfig
      })
    },
    initQueryParameter() {
      const {
        $route: { query, name },
        currentSearchMode,
        searchConfigOfGetter: [field],
        resources
      } = this
      this.query = {
        ...query,
        pageNo: 1
      }
      if (!SEARCH_MODE.includes(currentSearchMode)) {
        return (this.queryParameter = {})
      }
      let queryObj = getQueryParameterBySearchId(query.searchId)
      if (!queryObj) {
        const [resource] = resources
        this.$router.replace({
          name,
          params: {
            mode: 'base'
          },
          query: {
            searchId: setSearchId({
              resourceIds: [resource.id],
              field: field.name,
              fieldLabel: field.label
            })
          }
        })
        return
      }

      /**
       * 初始化检索参数
       */

      const { resourceIds, refines, currentResourceId } = queryObj
      Vue.set(this, 'queryParameter', queryObj)
      const tempIds = []
      resources.map(item => {
        resourceIds.map(id => {
          if (id === item.id) {
            tempIds.push(item.id)
          }
        })
      })
      this.resourceIds = tempIds
      this.currentRefines = refines ? refines : []
      this.currentResourceId =
        currentResourceId && resourceIds.indexOf(currentResourceId) !== -1
          ? currentResourceId
          : tempIds[0]
      this.onSearch()
    },
    setReq(type) {
      const {
        queryParameter: { pageSize, refines, keyword, searchLogic, field },
        currentResourceId: resourceId,
        limit
      } = this
      let req = {
        resourceId,
        pageSize: limit
      }
      if (refines && refines.length > 0) {
        req.refines = refines.map(item => {
          return {
            field: item.field,
            values: item.values
          }
        })
      }
      if (type === 'base') {
        if (keyword) {
          req.keyword = keyword
        }
        if (field) {
          req.field = field
        }
      }
      if (type === 'advanced') {
        if (searchLogic) {
          req.searchLogic = searchLogic.map(item => {
            return {
              field: item.field.split('-')[0],
              keyword: item.keyword,
              logic: item.logic
            }
          })
        }
      }
      return req
    },
    handleDeleteTag({ type, info }) {
      const {
        queryParameter,
        query,
        currentSearchMode: mode,
        currentResourceId,
        $route: { name }
      } = this
      let searchInfo = {}
      let extra = {}
      // 删除资源类型
      if (type === 'resources') {
        if (queryParameter.resourceIds.length === 1) return
        let tempResourceId = queryParameter.resourceIds
        let temp = {},
          tempQuery = {}
        tempResourceId.splice(tempResourceId.indexOf(info.id), 1)
        if (info.id == currentResourceId) {
          temp = {
            resourceIds: tempResourceId,
            pageSize: 10
          }
          if (mode === 'base' && queryParameter.keyword) {
            temp.keyword = queryParameter.keyword
          } else if (mode === 'advanced') {
            temp.searchLogic = queryParameter.searchLogic
          }
        } else {
          queryParameter.resourceIds = tempResourceId
          temp = queryParameter
          tempQuery = query
        }
        searchInfo = {
          ...tempQuery,
          searchId: this.setSearchId(temp)
        }
      }
      if (type === 'searchInfo' || type === 'searchLogic') {
        const { resourceIds } = queryParameter
        searchInfo = {
          searchId: this.setSearchId({
            resourceIds
          })
        }
      }
      if (type === 'filter') {
        // queryParameter.refines.splice(info, 1)
        // searchInfo = {
        //   searchId: this.setSearchId(queryParameter)
        // }
        this.queryParameter.refines.splice(info, 1)
        this.query.pageNo = 1
        this.onSearch()
        return
      }
      this.$router.push({
        name,
        params: {
          mode
        },
        query: searchInfo
      })
    },
    handleClickTabs(id) {
      if (this.currentResourceId === id) return
      this.currentResourceId = id
      this.query.pageNo = 1
      Vue.set(this.queryParameter, 'refines', [])
      this.onSearch()
    }
  }
}
