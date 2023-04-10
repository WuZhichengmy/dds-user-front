<template>
  <div class="empty">
    <div>
      <Icon :type="icon" :size="iconSize" />
    </div>
    <slot name="msg">
      <p>{{ msg }}</p>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      require: false,
      default: '暂无相关内容',
    },
    icon: {
      type: String,
      require: false,
      default: 'ios-cube-outline',
    },
    iconSize: {
      type: Number,
      require: false,
      default: 28,
    },
  },
}
</script>

<style scoped lang="scss">
.empty {
  text-align: center;
  padding-top: 80px;
  i {
    font-weight: 600;
  }
  p {
    font-weight: 600;
    font-size: 14px;
  }
}
</style>
