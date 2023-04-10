import routesConfig from '@/config/routes'
import constantRouterMap from '@/router/routers'
// import Layout from '@/layout/index'
// import getters from '../getters'
// import ParentView from '@/components/ParentView'

const permission = {
  namespaced: true,
  state: {
    routesConfig,
    routers: constantRouterMap,
    addRouters: [],
    sidebarRouters: []
  },
  getters: {
    routerOfGetters: state => {
      const { routesConfig } = state
      const res = routesConfig
        .filter(item => item.nav && item.display)
        .map(item => {
          const { meta, path, name, nav } = item
          return {
            label: meta.title,
            name,
            path,
            ...nav,
            children: [],
            type: !nav.isParent ? 3 : path.split(':').length > 1 ? 2 : 1
          }
        })
      return res
    },
    enableReport: (state, getters) => {
      const { routerOfGetters } = getters
      const names = routerOfGetters.map(item => item.name)
      return names.includes('Report')
    }
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = baseRoutes.concat(routers)
    },
    SET_SIDEBAR_ROUTERS: (state, routers) => {
      state.sidebarRouters = routers
    },
    SET_NAV_DATA: state => {}
  },
  actions: {
    GenerateRoutes({ commit }, asyncRouter) {
      commit('SET_ROUTERS', asyncRouter)
    },
    SetSidebarRouters({ commit }, sidebarRouter) {
      commit('SET_SIDEBAR_ROUTERS', sidebarRouter)
    }
  }
}

// export const filterAsyncRouter = (routers, isRewrite = false) => {
//   // 遍历后台传来的路由字符串，转换为组件对象
//   return routers.filter(router => {
//     if (isRewrite && router.children) {
//       router.children = filterChildren(router.children)
//     }
//     if (router.component) {
//       if (router.component === 'Layout') {
//         // Layout组件特殊处理
//         router.component = Layout
//       } else if (router.component === 'ParentView') {
//         router.component = ParentView
//       } else {
//         const component = router.component
//         router.component = loadView(component)
//       }
//     }
//     if (router.children && router.children.length) {
//       router.children = filterAsyncRouter(router.children, router, isRewrite)
//     }
//     return true
//   })
// }

function filterChildren(childrenMap) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        childrenMap.splice(index, 1)
        return
      }
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = view => {
  return resolve => require([`@/views/${view}`], resolve)
}

export default permission
