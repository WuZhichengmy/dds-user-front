import Vue from 'vue'
import { getRandomStr } from '@/utils/utils'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapState('project', [
      'resources',
      'gradeSearchConfig',
      'projectId',
      'widgetIds',
      'logo',
      'copyright'
    ]),
    ...mapGetters('project', ['logoOfGetter', 'searchConfigOfGetter'])
  },
  methods: {
    ...mapMutations('project', ['SET_GRADE_SEARCH_CONFIG']),
    ...mapActions('project', ['getWidgetConfig', 'commonWidget']),
    getQueryParameterBySearchId(searchId) {
      let r = Vue.ls.get(searchId)
      return r
    },
    setSearchId(queryParameter) {
      let random = getRandomStr()
      Vue.ls.set(random, queryParameter)
      return random
    },

    setRefineId(refine) {
      let random = getRandomStr()
      Vue.ls.set('refine' + random, refine)
      return 'refine' + random
    },

    getRefineById(id) {
      return Vue.ls.get(id)
    },

    removeSearchId(searchId) {
      Vue.ls.remove(searchId)
    },

    async getResource() {
      if (!this.resources) {
        await this.$store.dispatch('project/getResources')
      }
      return this.resources
    },

    setLocalStorage(key, data) {
      Vue.ls.set(key, data, 24 * 60 * 60 * 1000)
    },

    getLocalStorage(key) {
      return Vue.ls.get(key)
    },
    getResourceLabelById(id) {
      const { resources } = this
      if (!resources) return ''
      const [label] = resources
        .filter(item => item.id == id)
        .map(item => item.name)
      return label ? label : ''
    },
    getFieldLabel(field, resourceId) {
      const { searchConfigOfGetter: config } = this
      let label = ''
      if (config) {
        config.map(item => {
          if (item.name === field && item.resourceId === resourceId) {
            label = item.label
          }
        })
      }
      return label ? label : ''
    }
  }
}
