<template>
  <div class="items-header" :style="itemStyle">
    <Icon :type="icon" />
    <span>
      {{ data }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'ItemsHeader',
  props: {
    data: {
      type: String,
      required: true
    },
    itemStyle: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },
    icon: {
      type: String,
      required: false,
      default: 'md-search'
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped lang="scss">
.items-header {
  i {
    font-size: 16px;
  }
  display: flex;
  align-items: center;
  padding: 8px 15px;
  font-size: 17px;
  letter-spacing: 1px;
  color: var(--font);
  background: #e3ecfd;
  /* border-left: 3px solid var(--theme); */
}
</style>
