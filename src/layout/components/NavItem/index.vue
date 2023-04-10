<template>
  <div class="nav-item">
    <Menu
      :mode="mode"
      theme="light"
      :active-name="current"
      size="large"
      class="header-nav-menu"
      ref="menu"
    >
      <template v-for="item in data">
        <Submenu
          v-if="item.isParent && item.children.length > 0"
          :key="item.label"
          :name="item.name"
        >
          <template slot="title">
            <Icon :type="item.icon" />
            <span>
              {{ item.label }}
            </span>
          </template>
          <MenuItem
            v-for="items in item.children"
            :key="items.name"
            :name="item.name"
            @click.native="handleClickNav(item.name, { resourceId: items.id })"
          >
            <Icon :type="items.icon" />
            {{ items.name }}</MenuItem
          >
        </Submenu>
        <MenuItem
          v-else
          :key="item.label"
          :name="item.name"
          class="menuItem"
          @click.native="handleClickNav(item.name)"
        >
          <Icon :type="item.icon" />
          <span> {{ item.label }}</span></MenuItem
        >
      </template>
    </Menu>
  </div>
</template>

<script>
import { eventBus } from '@/main'

import ThemeTool from '@/components/ThemeTool'
import User from '../User'

export default {
  name: 'NavItem',
  components: {
    ThemeTool,
    User
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    config: {
      type: Object,
      required: false
    },
    current: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: false,
      default: 'horizontal'
    }
  },
  data() {
    return {}
  },
  watch: {
    current: {
      handler(n) {
        this.$nextTick(() => {
          this.$refs.menu.updateActiveName()
        })
      },
      immediate: true
    }
  },
  methods: {
    handleClickNav(name, params) {
      eventBus.$emit('toggle-drawer')
      this.$emit('on-click-nav', { name, params })
    }
  }
}
</script>

<style lang="scss">
.nav-item {
  .header-nav-menu {
    background: transparent;
  }
  .drawer-nav {
    display: none;
  }
  .ivu-menu-submenu-title,
  .ivu-menu-submenu-title,
  .ivu-menu-item {
    & > i {
      margin-right: 0;
      vertical-align: text-top;
      font-weight: normal;
    }
  }
}
</style>

<style scoped>
.nav-item,
.drawer-nav {
  height: var(--line-1);
  line-height: var(--line-1);
}
.header-nav-menu {
  height: var(--line-1);
  line-height: var(--line-1);
}
.header-nav-menu > .ivu-menu-item {
  padding: 0;
  margin-right: 40px;
  font-size: 16px;
}
.header-nav-menu > .ivu-menu-item,
.header-nav-menu > .ivu-menu-submenu {
  line-height: var(--line-1) !important;
}
.header-nav-menu {
  transition: all 0.28s;
}
.header-nav-menu >>> .ivu-menu-drop-list {
  max-height: 300px;
  overflow-y: auto;
}
.drawer-nav .icon {
  font-size: 30px;
}
.box {
  padding: 10px;
  padding-right: 0;
  display: flex;
  justify-content: space-between;
  --user-height: 40px;
  --theme-height: 35px;
  --theme-padding: 8px 10px;
  margin-bottom: 15px;
}

@media screen and (max-width: 1200px) {
  .header-nav-menu {
    /* display: none !important; */
  }
  .drawer-nav {
    /* display: block !important; */
    /* float: right; */
  }
}
</style>
<style lang="scss">
.list-drawer-class {
  .theme-tool {
    display: flex;
    &-wrapper {
      padding: 5px 10px;
    }
  }
}
</style>
