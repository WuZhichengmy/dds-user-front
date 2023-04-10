<template>
  <div class="text" :style="config">{{ data }}</div>
</template>

<script>
export default {
  name: 'Information', //图表说明文字组件
  props: {
    data: {
      type: String,
      required: false,
    },
    config: {
      type: Object,
      required: false,
      default: () => {
        return {
          color: '#333',
          fontSize: '18px',
        }
      },
    },
  },
  data() {
    return {}
  },
}
</script>

<style scoped lang="scss">
.text {
  margin-top: 10px;
  line-height: 1.5;
  text-indent: 2em;
  color: #333;
  font-size: 18px;
}
</style>
