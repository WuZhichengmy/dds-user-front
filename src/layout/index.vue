<template>
  <div class="main">
    <template v-if="!initialized">
      <div class="main_loading">
        <loader-circle />
      </div>
    </template>
    <template v-else>
      <page-header :isFixed="isFixed">
        <div slot="logo" class="header-logo" @click="$router.push('/')">
          <logo :data="logo" />
        </div>
        <div slot="nav" class="header-nav">
          <nav-item
            :data="navData"
            :current="currentActiveNav"
            @on-click-nav="handleClickNav"
          />
        </div>
        <div slot="drawer-nav">
          <nav-item
            mode="vertical"
            :data="navData"
            :current="currentActiveNav"
            @on-click-nav="handleClickNav"
          />
        </div>
        <div slot="login" class="header-login">
          <user />
        </div>
        <div slot="theme-tool" class="header-theme-tool m-r-1">
          <theme-tool />
        </div>
      </page-header>
      <div style="clear: both"></div>
      <div :class="['content', currentContentClass]">
        <router-view />
      </div>
<!--      TODO COPYRIGHT-->
      <div class="footer">
        <copyright class="relative" :data="copyright" style='visibility: hidden'/>
      </div>
      <BackTop class="backtop" />
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import projectMixin from '@/mixins/project'

import { setSearchId } from '@/utils/query-string'
import { deepClone } from '@/utils'

import PageHeader from '@/layout/components/PageHeader'
import Logo from '@/layout/components/Logo'
import NavItem from '@/layout/components/NavItem'
import User from '@/layout/components/User'

import LoaderCircle from '@/components/Loading/LoaderCircle'
import ThemeTool from '@/components/ThemeTool'
import Copyright from '@/components/Copyright'

export default {
  name: 'BasicLayout',
  mixins: [projectMixin],
  components: {
    ThemeTool,
    PageHeader,
    Copyright,
    Logo,
    NavItem,
    User,
    LoaderCircle
  },
  data() {
    return {
      title: '数据展示系统',
      navData: [],
      currentActiveNav: '',
      drawerNav: false,
      scrollTop: document.documentElement.scrollTop,
      isFixed: false,
      initialized: false
    }
  },
  computed: {
    ...mapGetters('permission', ['routerOfGetters']),
    currentContentClass() {
      return this.$route.name === 'Home' ? '' : 'content-margin'
    },
    inputItemState() {
      if (this.isFixed) {
        return true
      } else {
        return this.$route.name !== 'Home' ? true : false
      }
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        this.currentActiveNav = to.name
      },
      immediate: true
    },
    scrollTop: {
      handler() {
        if (this.scrollTop > 5) {
          this.isFixed = true
        } else {
          this.isFixed = false
        }
      },
      immediate: true
    }
  },
  created() {
    this.init()
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.scrollTop = document.documentElement.scrollTop
    })
  },
  methods: {
    ...mapActions('project', ['AdvancedSearchConfig', 'getResources']),
    async init() {
      this.initialized = false
      await this.AdvancedSearchConfig(0)
      await this.getWidgetConfig()
      const { copyright, logo } = this.widgetIds
      copyright && (await this.commonWidget('copyright'))
      logo && (await this.commonWidget('logo'))
      this.initResource()
    },
    async initResource() {
      const navData = deepClone(this.routerOfGetters)
      const res = await this.$store.dispatch('project/getResources')
      // navData.map(item => {
      //   if (item.name === 'Report') {
      //     item.path = '/report/base'
      //   }
      // })
      this.navData = navData
      this.initialized = true
    },
    handleClickNav({ name, params = {} }) {
      this.drawerNav = false
      let query = {}
      switch (name) {
        case 'Report':
        case 'Search':
          params = {
            mode: 'base'
          }
          break
      }
      name = name[0].toUpperCase() + name.substring(1)
      this.$router.push({
        name,
        params,
        query
      })
    }
  }
}
</script>
<style scoped lang="scss">
.main {
  &_laoding {
    height: 100vh;
    position: relative;
    &_text {
      font-size: 18px;
    }
  }
  .content {
    background: var(--background);
  }
  .footer {
    width: 100%;
    background: var(--footer-bg);
    color: var(--footer-color);
    position: relative;
    z-index: 5;
    margin-top: 0;
    padding: 15px 0;
  }
  .backtop {
    z-index: 999;
    bottom: 30px;
    right: 30px;
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1.2s linear infinite;
  }
  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>

<style>
/* iview全局颜色 */
#app .ivu-checkbox-checked .ivu-checkbox-inner {
  /* border-color: var(--text-actived) !important;
  background-color: var(--text-actived) !important; */
}
#app .ivu-checkbox-wrapper-checked * {
  /* color: var(--text-actived) !important; */
}
/* page */
#app .ivu-page-item-active,
#app .ivu-page-item-active a,
#app .ivu-page-item:hover a,
#app .ivu-page-prev:hover,
#app .ivu-page-next:hover,
#app .ivu-page-options-elevator:hover input,
#app .ivu-page-simple .ivu-page-simple-pager input:hover {
  color: var(--theme) !important;
}

#app .ivu-page-item-active,
#app .ivu-page-item:hover,
#app .ivu-page-prev:hover,
#app .ivu-page-next:hover,
#app .ivu-page-options-elevator:hover input,
#app .ivu-page-simple .ivu-page-simple-pager input:hover {
  border-color: var(--theme) !important;
}

#app .ivu-page-prev,
#app .ivu-page-next,
#app .ivu-page-item-jump-prev,
#app .ivu-page-item-jump-next,
#app .ivu-page-item {
  min-width: 32px;
  height: 32px;
  line-height: 30px;
}
#app .ivu-page-options-elevator {
  height: 32px;
  line-height: 32px;
}
#app .ivu-page-options-elevator input {
  height: 32px;
  padding: 4px 7px;
  font-size: 14px;
}
.ivu-btn:focus {
  box-shadow: none !important;
}

.ivu-menu-horizontal.ivu-menu-light:after {
  background: transparent !important;
  height: 0 !important;
}
.list-drawer-class .ivu-drawer-body {
  padding: 0 !important;
}
.list-drawer-class {
  z-index: 999;
}
.list-drawer-class .ivu-menu {
  width: 100% !important;
}
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu-active,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu:hover {
  color: var(--theme);
}
@media screen and (max-width: 500px) {
  .chart-box-header-select,
  .chart-box-header-btn {
    width: 100% !important;
  }
  .chart-box-header .chart-box-header-select .analysis-select.ivu-select {
    width: 100% !important;
  }
}
</style>
