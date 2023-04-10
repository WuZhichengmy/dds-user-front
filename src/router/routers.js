import Layout from '@/layout/index.vue'
import routesConfig from '@/config/routes'

export const constantRouterMap = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'Home',
        meta: {
          title: '用户登录',
          permission: true
        },
        component: () => import(/* webpackChunkName: "home" */ '@/views/home')
      }
    ]
  },
  {
    path: '/search/:mode',
    component: Layout,
    children: [
      {
        path: '/search/:mode',
        name: 'Search',
        meta: {
          title: '资源检索',
          permission: true
        },
        component: () =>
          import(/* webpackChunkName: "search" */ '@/views/search')
      }
    ]
  },
  {
    path: '/detail/:resourceId/:id',
    component: Layout,
    children: [
      {
        path: '/detail/:resourceId/:id',
        name: 'Detail',
        meta: {
          title: '资源详情',
          permission: true
        },
        component: () =>
          import(/* webpackChunkName: "search" */ '@/views/detail')
      }
    ]
  },
  {
    path: '/analysis',
    component: Layout,
    children: [
      {
        path: '/analysis',
        name: 'Analysis',
        meta: {
          title: '分析结果',
          permission: true
        },
        component: () =>
          import(
            /* webpackChunkName: "analysis" */ '@/views/analysis/AnalysisField'
          )
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    children: [
      {
        path: '/report',
        name: 'Report',
        meta: {
          title: '分析报告',
          permission: true
        },
        component: () =>
          import(/* webpackChunkName: "report" */ '@/views/report')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '用户登录',
      permission: null
    },
    component: () => import(/* webpackChunkName: "login" */ '@/views/login')
  },
  {
    path: '*',
    component: resolve =>
      require(/* webpackChunkName: "features" */ [
        '@/views/features/404'
      ], resolve),
    hidden: true
  }
]

const routes = routesConfig.map(item => {
  const { path, name, dirPath, layout, meta, display, nav } = item
  if (!display) return false
  let route = {
    path,
    name,
    meta: {
      ...meta,
      nav
    },
    component: resolve => require([`@/views/${dirPath}`], resolve)
  }
  if (layout) {
    route = {
      path,
      component: Layout,
      children: [route]
    }
  }
  return route
})

// const constantRouterMap = [...routes.filter(Boolean), ...baseRoutes]

export default constantRouterMap
