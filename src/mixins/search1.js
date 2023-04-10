import Vue from "vue"
import {
  getRandomStr
} from '@/utils/utils'
import searchAPI from "@/api/search"
import {
  mapMutations
} from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState('search', ['gradeSearchConfig',])
  },
  methods: {
    ...mapMutations('search', ['SET_GRADE_SEARCH_CONFIG']),
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
  },
}
