const routes = [
  {
    path: '/login',
    name: 'Login',
    dirPath: 'login',
    layout: false,
    meta: {
      title: '登录',
      permission: null
    },
    display: true
  },
  {
    path: '/home',
    name: 'Home',
    dirPath: 'home',
    layout: true,
    meta: {
      title: '首页',
      permission: true
    },
    display: true,

    nav: {
      isParent: false,
      icon: 'md-home'
    }
  },
  {
    path: '/search/:mode',
    name: 'Search',
    dirPath: 'search',
    layout: true,
    meta: {
      title: '资源检索',
      permission: null
    },
    display: true,
    nav: {
      isParent: false,
      icon: 'md-search'
    }
  },
  {
    path: '/detail/:resourceId/:id',
    name: 'Detail',
    dirPath: 'detail',
    layout: true,
    meta: {
      title: '资源详情',
      permission: null
    },
    display: true
  },
  {
    path: '/analysis',
    name: 'Analysis',
    dirPath: 'analysis/AnalysisField',
    layout: true,
    meta: {
      title: '结果分析',
      permission: null
    },
    display: true
  },
  {
    path: '/report',
    name: 'Report',
    dirPath: 'report',
    layout: true,
    meta: {
      title: '分析报告',
      permission: null
    },
    display: true
    // nav: {
    //   isParent: true,
    //   icon: 'md-pie'
    // }
  }
]

export default routes
