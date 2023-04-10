<template>
  <div :class="['header-default', className]">
    <div :class="['line-1', { higher: isShowReturnBtn }]">
      <div class="content">
        <div
          class="return-btn"
          @click="$router.go(-1)"
          title="返回"
          v-if="isShowReturnBtn"
        >
          <Icon type="ios-arrow-back" />
        </div>
        <slot name="nav"></slot>
        <div class="content-right">
          <slot name="theme-tool"></slot>
          <slot name="login"></slot>
        </div>
      </div>
    </div>
    <div class="line-2">
      <div class="content">
        <slot name="logo"></slot>
        <!-- <simple-search /> -->
        <div class="drawer-nav" v-if="screenWidth <= 500">
          <span @click.native="showDrawer = !showDrawer"
            ><Icon
              :type="showDrawer ? 'md-close' : 'md-menu'"
              class="icon"
              @click.native="showDrawer = !showDrawer"
          /></span>
        </div>
      </div>
    </div>
    <Drawer
      v-model="showDrawer"
      :class-name="`list-drawer-class nav${isShowReturnBtn ? ' top1' : ''}`"
      :mask="false"
      :closable="false"
      transfer
    >
      <div class="row-1" v-if="screenWidth <= 500">
        <slot name="theme-tool"></slot>
        <slot name="login"></slot>
      </div>
      <slot name="drawer-nav" />
    </Drawer>
  </div>
</template>

<script>
import { eventBus } from '@/main'
import screenMixin from '@/mixins/screen'
import projectMixin from '@/mixins/project'
import SimpleSearch from '@/components/SearchTabs/SimpleSearch'

export default {
  name: 'PageHeader',
  mixins: [projectMixin, screenMixin],
  components: { SimpleSearch },
  props: {
    config: {
      type: Object,
      required: false,
      default: () => {
        return {
          affix: true,
          size: 'small'
        }
      }
    },
    isFixed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      showDrawer: false,
      isShowReturnBtn: false
    }
  },
  computed: {
    className() {
      const {
        $route: { name },
        isFixed
      } = this
      return {
        'page-header': name !== 'Home',
        'home-header': name === 'Home',
        fixed: isFixed
      }
    }
    // isShowReturnBtn() {
    //   const {
    //     USER_AGENT,
    //     $route: { path },
    //   } = this
    //   if (USER_AGENT === 'mobile' && path !== '/home') {
    //     return (this.isShowReturnBtn = true)
    //   }
    //   this.isShowReturnBtn = false
    // },
  },
  watch: {
    screenWidth: {
      handler(n) {
        if (n > 500) {
          this.showDrawer = false
        }
      },
      immediate: true
    },
    $route: {
      handler(to, from) {
        const { USER_AGENT } = this
        if (USER_AGENT === 'mobile' && to.path !== '/') {
          return (this.isShowReturnBtn = true)
        }
        this.isShowReturnBtn = false
      },
      immediate: true
    }
  },
  mounted() {
    eventBus.$on('toggle-drawer', () => {
      this.showDrawer = false
    })
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.header-default {
  --line-1: 40px;
  --line-2: 66px;
  --img: 36px;
  --nav-active: #fff;
  --logo-height: 28px;
  --logo-font: 16px;
  --logo-font-en: 13px;
  --logo-line-height-en: 14px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  transition: 0.6s;
  .line-1 {
    height: var(--line-1);
    line-height: var(--line-1);
    width: 100%;
    background: var(--theme);
    .content {
      width: 75%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-self: center;
      .return-btn {
        display: none;
        color: #fff;
        font-weight: 600;
        font-size: 24px;
        cursor: pointer;
      }
      &-right {
        display: flex;
        justify-content: flex-end;
        & > div {
          margin-left: 10px;
        }
      }
    }
  }

  .line-2 {
    height: var(--line-2);
    width: 100%;
    background: #fff;
    .content {
      height: 100%;
      width: 75%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .header-title-text {
        .en {
          color: #aaa;
        }
        .cn {
          color: var(--theme);
        }
      }
    }
  }
  .drawer-nav {
    color: var(--theme);
    font-size: 30px;
    span {
      cursor: pointer;
    }
  }
  ::v-deep {
    .ivu-menu,
    .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item,
    .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu {
      color: #fff;
      font-size: 14px;
      font-weight: 600;
    }
    .ivu-menu-horizontal .ivu-menu-submenu .ivu-select-dropdown .ivu-menu-item {
      color: #fff;
      font-size: 14px !important;
      font-weight: 600;
    }
    .ivu-menu-light {
      &.ivu-menu-horizontal {
        .ivu-menu-item-active,
        .ivu-menu-submenu-active {
          color: var(--nav-active);
          border-width: 3px;
          border-color: var(--color);
        }
        .ivu-menu-item:hover:not(.ivu-menu-item-active),
        .ivu-menu-submenu:hover:not(.ivu-menu-submenu-active) {
          color: var(--color);
          border-color: transparent;
        }
        .ivu-select-dropdown {
          .ivu-menu-item {
            color: var(--font) !important;
            &:hover {
              color: var(--theme) !important;
            }
          }
        }
      }
    }
  }
  &.page-header {
    box-shadow: 0 0 8px 0 rgb(51 51 51 / 15%);
  }
  &.home-header {
    box-shadow: 0 0 10px 0 rgb(51 51 51 / 20%);
  }
  &.fixed {
    z-index: 999;
    box-shadow: 0 0 10px 0 rgb(51 51 51 / 25%);
  }
}

@media screen and (max-width: 1200px) {
  .header-default {
    .line-1 {
      .content {
        width: 90%;
      }
    }
    .line-2 {
      .content {
        width: 90%;
      }
    }
  }
}
@media screen and (max-width: 992px) {
  .header-default {
    .line-1 {
      .content {
      }
    }
    .line-2 {
      .content {
        ::v-deep {
          .logo-text {
            display: none;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 760px) {
  .header-default {
    .line-1 {
      .content {
        width: 98%;
      }
    }
    .line-2 {
      .content {
        width: 98%;
      }
    }
  }
}
@media screen and (max-width: 500px) {
  .header-default {
    .line-1 {
      --line-1: 15px;
      &.higher {
        --line-1: 35px;
      }
      line-height: var(--line-1);
      .content {
        width: 98%;
        div {
          display: none;
        }
        .return-btn {
          display: block !important;
        }
      }
    }
    .line-2 {
      .content {
        width: 98%;
      }
    }
    // .drawer-nav {
    //   display: flex;
    // }
    // .list-drawer-class {
    //   &.nav {
    //     display: block;
    //   }
    // }
  }
}
</style>

<style lang="scss">
.ivu-menu,
.ivu-menu-light .ivu-menu-item,
.ivu-menu-light .ivu-menu-submenu {
  color: #fff;
  font-size: 14px;
  font-weight: 400;
}
.ivu-menu-submenu .ivu-select-dropdown .ivu-menu-item {
  color: #fff;
  font-size: 15px !important;
  font-weight: 400;
}
.ivu-menu-light {
  &.ivu-menu-horizontal {
    .ivu-menu-item-active,
    .ivu-menu-submenu-active {
      color: var(--nav-active);
      border-width: 3px;
      border-color: var(--color);
    }
    .ivu-menu-item:hover:not(.ivu-menu-item-active),
    .ivu-menu-submenu:hover:not(.ivu-menu-submenu-active) {
      color: var(--nav-active);
      border-color: transparent;
    }
    .ivu-select-dropdown {
      .ivu-menu-item {
        color: var(--font) !important;
        &:hover {
          color: var(--theme) !important;
        }
      }
    }
  }
  &.ivu-menu-vertical {
    &::after {
      width: 0 !important;
    }
    .ivu-menu-item {
      font-weight: 600;
    }
    .ivu-menu-item-active,
    .ivu-menu-submenu-active {
      color: #fff;
      border-width: 0;
      border-color: #fff;
    }
    .ivu-menu-item:hover:not(.ivu-menu-item-active),
    .ivu-menu-submenu:hover:not(.ivu-menu-submenu-active) {
      color: #fff;
      border-color: transparent;
    }
    .ivu-menu-submenu-title {
      font-weight: 600;
      &:hover {
        color: #fff;
      }
    }
    .ivu-select-dropdown {
      .ivu-menu-item {
        color: #fff !important;
        &:hover {
          color: #fff !important;
        }
      }
    }
  }
}
.list-drawer-class {
  &.nav {
    --top: 84px;
    &.top1 {
      --top: 104px;
    }
    .ivu-drawer {
      width: 100% !important;
      top: var(--top) !important;
      .ivu-drawer-body {
        background: var(--theme);
        padding: 10px !important;
        .row-1 {
          display: flex;
          justify-content: space-between;
          align-self: center;
          border-bottom: 1px dotted #fff;
          padding-bottom: 10px;
        }
      }
    }
  }
}
</style>
