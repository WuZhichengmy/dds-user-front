<template>
  <div class="article-list">
    <div
      class="article-list-info-list-items"
      v-for="(item, index) in data"
      :key="item.id + '_data' + index"
      :style="{ width: '49%' }"
      @click="handleClickItem(item.id)"
    >
      <div class="items-content">
        <div class="items-title" style="display: flex">
          <span class="item-icon">●</span>
          <span :title="item.title" class="items-title-text">{{
            item.title
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import routerMixin from '@/mixins/router'

export default {
  name: 'ArticleList',
  mixins: [routerMixin],
  data() {
    return {}
  },
  props: {
    config: {
      type: Object,
      required: false
    },
    data: Array,
    resourceId: {
      type: String | Number,
      required: false
    }
  },
  mounted() {},
  methods: {
    handleClickItem(id) {
      this.$emit('on-click-list', {
        resourceId: this.resourceId,
        id
      })
    }
  }
}
</script>

<style scoped lang="scss">
.article-list {
  &-title {
    margin-bottom: 32px;
    font-size: 18px;
    position: relative;
    &::after {
      width: 45px;
      height: 4px;
      bottom: -10px;
      content: '';
      position: absolute;
      background-color: #002147;
      left: 0;
    }
  }
}
</style>

<style scoped>
@media screen and (max-width: 750px) {
  .article-list-info-list-items {
    width: 98% !important;
    float: none !important;
    margin: 0 !important;
  }
}
.article-list {
  padding: 5px 0;
}
.article-list-info-list-items {
  border-bottom: 1px dotted #dcdee2;
  font-size: 14px;
  display: flex;
  width: 50%;
  float: left;
}
.article-list-info-list-items:nth-child(2n) {
  float: right;
}
.items-index {
  width: 20px;
  font-weight: 600;
}
.items-content {
  flex: 1;
  color: var(--font);
  font-weight: 500;
  overflow: hidden;
}
.items-title {
  width: 100%;
  cursor: pointer;
  line-height: 40px;
  padding: 0 8px;
  transition: all 0.5s;
}

.items-title:hover .items-title-text {
  text-decoration: underline;
  color: var(--color);
}
.items-title:hover .item-icon {
  color: var(--color);
}
.items-title-text {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.item-icon {
  color: #e2e2e2;
  vertical-align: middle;
  margin-right: 8px;
  transition: color 0.5s;
}
.items-title-append {
  margin-left: 14px;
  text-align: right;
}
</style>
