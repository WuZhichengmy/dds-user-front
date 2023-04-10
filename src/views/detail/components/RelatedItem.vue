<template>
  <div class="related-item">
    <div
      v-for="(item, index) in data"
      :key="index + '__relatedItem'"
      class="tabs-item-list"
    >
      <div class="tabs-item-list-index">[{{ index + 1 }}]</div>
      <div class="tabs-item-list-text">
        <div class="title" :title="item.title">
          <span>{{ item.title }}</span>
        </div>
        <div class="author">作者: {{ item.author }}</div>
        <!-- <div class="recommend-contents">{{ items.content }}</div>
        <div class="recommend-desc">{{ items.desc }}</div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RelatedItem',
  props: {
    data: {
      type: Array,
      required: false
    }
  },
  data() {
    return {}
  },
}
</script>

<style scoped>
/* list */
.tabs-item-list {
  padding: 8px 15px;
  display: flex;
  border-bottom: 1px dotted #dcdee2;
}
.tabs-item-list-index {
  width: 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--font);
  margin-right: 5px;
}
.tabs-item-list-text {
  flex: 1;
}
.tabs-item-list-text .title {
  font-size: 14px;
  color: var(--font);
  letter-spacing: 1px;
  font-weight: 600;
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.tabs-item-list-text .title span:hover {
  color: var(--text-actived);
  text-decoration: underline;
  cursor: pointer;
}
.tabs-item-list-text .author {
  font-size: 13px;
  color: var(--font);
  letter-spacing: 0.86px;
}
</style>
