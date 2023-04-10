<template>
  <div class="tabs-item">
    <div class="tabs-item-content">
      <Tabs type="card">
        <TabPane
          :label="item.name"
          v-for="(item, index) in data"
          :key="index + '_detailTabsItem'"
        >
          <related-item :data="item.data" />
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import RelatedItem from './RelatedItem.vue'
export default {
  name: 'TabsItem',
  components: {
    RelatedItem,
  },
  props: {
    data: Array,
  },
  data() {
    return {}
  },
}
</script>

<style scoped>
/* tabs */
.tabs-item-content >>> .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
  border-radius: 0;
  background: #fff;
  border-color: transparent;
}
.tabs-item-content
  >>> .ivu-tabs.ivu-tabs-card
  > .ivu-tabs-bar
  .ivu-tabs-tab-active {
  background: var(--theme);
  border-color: var(--theme);
  color: #fff;
}
.tabs-item-content
  >>> .ivu-tabs.ivu-tabs-card
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
.tabs-item-content >>> .ivu-tabs-bar {
  border-bottom: 2.5px solid var(--theme);
}
.ivu-tabs-bar >>> .ivu-tabs-tab-focused.ivu-tabs-tab {
}
.tabs-item-content >>> .ivu-tabs-nav .ivu-tabs-tab:hover,
.tabs-item-content >>> .ivu-tabs-nav .ivu-tabs-tab:active {
  color: var(--theme)
}
</style>
