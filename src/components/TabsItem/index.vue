<template>
  <div class="tabs-item">
    <div :class="className">
      <Tabs
        :type="config.type"
        :class="tabsClassName"
        @on-click="handleClickTabs"
      >
        <TabPane
          :label="item.name"
          v-for="(item, index) in data.data[Object.keys(data.data)[0]]"
          :key="index + '_tabsItem'"
          :style="{ border: config.border }"
        >
          <component
            :is="Object.keys(data.data)[0]"
            :data="item.data"
            :resourceId="item.resourceId"
            :config="data.config ? data.config : undefined"
            v-on="$listeners"
          >
          </component>
        </TabPane>
        <span slot="extra"><slot name="btn"> </slot></span>
      </Tabs>
    </div>
  </div>
</template>

<script>
import LeaderBoard from '@/components/LeaderBoard'
import ArticleList from '@/components/ArticleList'
import TagsCloud from '@/components/TagsCloud'

export default {
  name: 'TabsItem',
  components: {
    LeaderBoard,
    ArticleList,
    TagsCloud
  },
  props: {
    config: {
      type: Object,
      required: false,
      default: () => {
        return {
          animated: false,
          type: 'card',
          style: 1,
          border: 'none'
        }
      }
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    className() {
      return 'tabs-style-' + this.config.style + ' tabs-item-wrapper'
    },
    tabsClassName() {
      return this.data.config && this.data.config.tabsStyle === 'dark'
        ? 'dark'
        : ''
    }
  },
  methods: {
    handleClickTabs(name) {
      if (this.data.name === 'SearchItem') {
        this.$emit('on-click-search-tabs', name)
      }
    }
  }
}
</script>

<style>
/* 公共样式 */
.tabs-item-wrapper .ivu-tabs-bar {
  border-bottom: 2px solid var(--theme);
  margin-bottom: 0;
  font-weight: 600;
  font-size: 14px;
}
.tabs-item-wrapper .ivu-tabs-ink-bar {
  background-color: var(--theme);
}
.tabs-item-wrapper .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
  border-color: var(--theme) !important;
}
.tabs-item-wrapper .ivu-tabs-nav-container {
  margin-bottom: 0 !important;
}

/* dark */
.dark.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
  background: rgba(0, 0, 0, 0.5) !important;
  color: #fff !important;
}
/* 默认样式 */
.tabs-style-1 .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
  border-radius: 0;
  background: #fff;
  border-color: transparent;
  color: var(--font);
}
.tabs-style-1 .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
  background: var(--theme);
  border-color: var(--theme);
  color: #fff;
}
.tabs-style-1
  .ivu-tabs.ivu-tabs-card
  > .ivu-tabs-bar
  .ivu-tabs-tab-active:before {
  content: '';
  display: block;
  width: 100%;
  height: 1px;
  background: var(--theme);
  position: absolute;
  top: 0;
  left: 0;
}
.tabs-style-1 .ivu-tabs-nav .ivu-tabs-tab:hover {
  color: var(--theme);
}
.tabs-style-1 ivu-tabs-tab.ivu-tabs-tab-active:hover {
  color: #fff;
}
</style>
