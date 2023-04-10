<template>
  <div class="echarts-item" id="echarts-item">
    <echarts-child-item
      v-for="item in data"
      :key="item.id"
      :data="item"
      :theme="theme"
    />
  </div>
</template>

<script>
import EchartsChildItem from './EchartsChildItem'

export default {
  name: 'EchartsItem',
  components: {
    EchartsChildItem
  },
  props: {
    theme: String,
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      span: 8,
      toolboxShow: true
    }
  },
  mounted() {}
}
</script>
<style scopde lang="scss">
.echarts-item {
  &-wrapper {
    padding: 15px 0 15px 20px;
  }
  &-content {
    padding: 10px;
    margin-bottom: 10px;
  }
  &-title {
    color: var(--font);
    font-weight: 400;
    letter-spacing: 2px;
  }
  &-component {
  }
  .title-level-1 {
    font-weight: 600;
    letter-spacing: 4px;
    .ivu-divider-inner-text {
      font-size: 22px;
      font-weight: 600;
    }
  }
  .title-level-2 {
    text-indent: 4em;
    font-size: 18px;
    letter-spacing: 2px;
    font-weight: 600;
  }
}

@media screen and (max-width: 500px) {
  .echarts-item {
    &-wrapper {
      padding: 10px 10px;
    }
    &-content {
      padding: 5px;
    }
    &-component {
      margin: 10px 0;
    }
  }
}
</style>
