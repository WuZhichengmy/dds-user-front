<template>
  <Breadcrumb class="wrapper" separator="/">
    <!-- <transition-group name="breadcrumb"> -->
    <span class="no-redirect m-r-10">当前位置: </span>
    <BreadcrumbItem
      v-for="(item, index) in data"
      :key="index + '_breadcrumbItem'"
      @click.native="handleLink(item)"
    >
      <span
        :class="[item.noRedirect ? 'no-redirect' : 'redirect']"
        :title="item.name"
        >{{
          strLength(item.name) > maxLength
            ? item.name.substring(0, maxLength) + '...'
            : item.name
        }}</span
      >
    </BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
const zhPattern = new RegExp('[\u4E00-\u9FA5]+')

export default {
  props: {
    data: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      maxLength: 50
    }
  },
  computed: {
    strLength() {
      return str => {
        let length = 0
        for (let i = 0; i < str.length; i++) {
          if (zhPattern.test(str.charAt(i))) {
            length += 2
          } else {
            length += 1
          }
        }
        return length
      }
    }
  },
  methods: {
    getBreadcrumb() {
      const { data } = this
      if (data.length > 0) {
        return this.customizeLevelList()
      }
      let matched = this.$route.matched.filter(
        item => item.meta && item.meta.title
      )
      const first = matched[0]
      if (first.meta.project) {
        matched = [{ path: '/', meta: { title: '检索' } }].concat(matched)
      }
      this.levelList = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    },
    handleLink(item) {
      const { path, noRedirect } = item
      if (noRedirect) return
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  font-size: 14px;
  line-height: inherit;
  color: #b9b4b4;
  font-weight: 400;
  line-height: inherit;
  .no-redirect {
    color: #666;
    cursor: text;
    font-weight: 500 !important;
  }
  .redirect,
  .router-link-active {
    font-weight: 500 !important;
    cursor: pointer;
    color: #666;
    &:hover {
      color: var(--theme);
    }
  }
  ::v-deep .ivu-breadcrumb-item-separator {
    font-size: 16px;
  }
}
</style>
