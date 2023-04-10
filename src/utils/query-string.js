import Vue from "vue"

import store from '@/store'

import {
  getRandomStr
} from '@/utils/utils'


export function getQueryParameterBySearchId(searchId) {
  let r = Vue.ls.get(searchId)
  return r
}
export function setSearchId(queryParameter) {
  if (!queryParameter) {
    const {resources} = store.state.project
    if (!resources) return false
    queryParameter = {
      resourceIds: [resources[0].id]
    }
  }
  const random = getRandomStr()
  Vue.ls.set(random, queryParameter)
  return random
}

export function setRefineId(refine) {
  let random = getRandomStr()
  Vue.ls.set('refine_' + random, refine)
  return 'refine_' + random
}

export function getRefineById(id) {
  return Vue.ls.get(id)
}

export function removeSearchId(searchId) {
  Vue.ls.remove(searchId)
}

export function setLocalStorage(key, data) {
  Vue.ls.set(key, data, 24 * 60 * 60 * 1000)
}

export function getLocalStorage(key) {
  return Vue.ls.get(key)
}
