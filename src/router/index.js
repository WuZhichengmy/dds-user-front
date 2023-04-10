import routes from './routers'

import { getToken } from '@/utils/auth'
NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/401']

const router = new VueRouter({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  const { meta } = to
  if (getToken()) {
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    /* has no token*/
    console.log(meta.permission)
    if (!meta.permission) next()
    else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
