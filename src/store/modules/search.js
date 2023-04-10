import Vue from 'vue'
const search = {
  namespaced: true,
  state: {
    gradeSearchConfig: null,
  },

  mutations: {
    SET_GRADE_SEARCH_CONFIG: (state, playload) => {
      state.gradeSearchConfig = playload
    }
  },
  actions: {
  }
}

export default search
