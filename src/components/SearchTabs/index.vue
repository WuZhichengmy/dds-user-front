<template>
  <div :class="['search-tabs', theme]">
    <Tabs :type="config.type" :value="currentTab" @on-click="handleClickTabs">
      <template v-for="item in data.data">
        <TabPane
          v-if="!item.disabled"
          :label="item.name"
          :key="item.name + '_tabsItem'"
          :name="item.type"
          :style="{ border: config.border }"
        >
          <template v-if="data.name === 'SearchItem'">
            <search-item
              :data="item.data"
              :config="data.config"
              :theme="theme"
              @on-search="onSearch"
              v-bind="$attrs"
              v-on="$listeners"
              @handleGetMoreBtn="handleGetMoreBtn"
            />
          </template>
          <template v-if="data.name === 'GradeSearch'">
            <grade-search
              :data="item.data"
              :config="data.config"
              v-on="$listeners"
              v-bind="$attrs"
              @to-base-search="onSearch"
              @advanced-search="onSearch"
            />
          </template>
        </TabPane>
      </template>
    </Tabs>
  </div>
</template>

<script>
import projectMixin from '@/mixins/project'
import SearchItem from './SearchItem'
import GradeSearch from './GradeSearch'

export default {
  name: 'SearchTabs',
  mixins: [projectMixin],
  components: {
    SearchItem,
    GradeSearch
  },
  props: {
    config: {
      type: Object,
      required: false,
      default: () => {
        return {
          animated: false,
          type: 'card',
          border: 'none'
        }
      }
    },
    theme: {
      type: String,
      required: false,
      default: ''
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentTab: ''
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.currentTab = this.data.data[0].type
  },
  methods: {
    handleClickTabs(name) {
      this.currentTab = name
    },
    linkTo(mode, query = {}) {
      const { currentTab: name } = this
      this.$router.push({
        name,
        params: { mode },
        query
      })
    },
    onSearch({ mode, searchId }) {
      this.linkTo(mode, { searchId })
    },
    handleGetMoreBtn() {
      this.linkTo('base')
    },
    toBaseSearch() {
      this.linkTo('base')
    }
  }
}
</script>

<style scoped lang="scss">
.search-tabs {
  --tab-bg: transparent;
  --tab-border: transparent;
  --tab-font: #515a6e;

  --tab-bg-active: var(--theme);
  --tab-border-active: transparent;
  --tab-font-active: #fff;

  --tab-bg-hover: #fff;
  --tab-border-hover: transparent;
  --tab-font-hover: var(--theme);

  --tab-bg-active-hover: var(--theme);
  --tab-border-active-hover: transparent;
  --tab-font-active-hover: #fff;

  --tabpane-bg: #fff;
  --tabbar-bg: transparent;
  --tab-height: 40px;
  --tab-font-size: 16px;

  &.dark {
    --tab-height: 50px;
    --tab-font-size: 17px;

    --tab-bg: transparent;
    --tab-font: #fff;

    --tab-bg-hover: transparent;
    --tab-font-hover: #fff;

    --tab-bg-active: rgba(0, 0, 0, 0.5);
    --tab-font-active: #fff;

    --tab-bg-active-hover: rgba(0, 0, 0, 0.5);
    --tab-font-active-hover: #fff;
  }
  &.light {
    --tab-height: 50px;
    --tab-font-size: 17px;

    --tab-bg: #e3e8ee;
    --tab-font: #515a6e;

    --tab-bg-hover: #e3e8ee;
    --tab-font-hover: var(--theme);

    --tab-bg-active: #fff;
    --tab-font-active: var(--theme);

    --tab-bg-active-hover: #fff;
    --tab-font-active-hover: var(--theme);
  }
  ::v-deep .ivu-tabs {
    &-bar {
      border-bottom: none;
      margin-bottom: 0;
      .ivu-tabs-nav-container,
      .ivu-tabs-tab-active {
        height: var(--tab-height);
      }
      .ivu-tabs-tab {
        height: var(--tab-height);
        float: left;
        display: flex;
        align-items: center;
        border-radius: 0;
        background: var(--tab-bg);
        color: var(--tab-font);
        font-size: var(--tab-font-size);
        font-weight: 500;
        letter-spacing: 2px;
        border: none;
        &,
        &-active,
        &-focused {
          border-color: transparent;
          padding: 8px 30px 7px;
        }
        &-active {
          background: var(--tab-bg-active);
          border-color: var(--tab-border-active);
          color: var(--tab-font-active);
          &:before {
            height: 0 !important;
          }
          &:hover {
            background: var(--tab-bg-active-hover) !important;
            border-color: var(--tab-border-active-hover) !important;
            color: var(--tab-font-active-hover) !important;
          }
        }
        &:hover {
          background: var(--tab-bg-hover);
          border-color: var(--tab-border-hover);
          color: var(--tab-font-hover);
        }
      }
    }
    &-ink-bar {
      background-color: transparent;
    }
    &-nav-container {
      margin-bottom: 0 !important;
    }
  }
}
</style>
