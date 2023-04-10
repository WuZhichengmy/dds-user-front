// 路由相关
export default {
  data() {
    return {}
  },
  methods: {
    // 在新标签页中打开 type: 1-内部连接 2-外部连接
    openInNewTab(route, type = 1) {
      if (type === 1) {
        const path = this.$router.resolve(route)
        window.open(path.href, '_blank')
        return
      }
      window.open(route.path, '_blank')
    },
    //普通跳转
    linkTo(path, query) {
      this.$router.push({
        path,
        query
      })
    }
  }
}
