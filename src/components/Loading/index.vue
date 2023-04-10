<template>
  <div class="loading" :style="{ minHeight: height }">
    <div class="loading-content">
      <div
        class="loading-content-item"
        v-for="item in 8"
        :key="item + '_loading'"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Loading',
  props: {
    height: {
      type: String,
      required: false,
      default: 'calc(100vh - 200px)'
    }
  }
}
</script>
<style scoped lang="scss">
.loading {
  position: relative;
  width: 100%;
  &-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    &-item {
      width: 4px;
      height: 4px;
      border-radius: 2px;
      background: var(--theme);
      position: absolute;
      animation: demo linear 0.8s infinite;
      -webkit-animation: demo linear 0.8s infinite;
      &:nth-child(1) {
        left: 24px;
        top: 2px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 40px;
        top: 8px;
        animation-delay: 0.1s;
      }
      &:nth-child(3) {
        left: 47px;
        top: 24px;
        animation-delay: 0.1s;
      }
      &:nth-child(4) {
        left: 40px;
        top: 40px;
        animation-delay: 0.2s;
      }
      &:nth-child(5) {
        left: 24px;
        top: 47px;
        animation-delay: 0.4s;
      }
      &:nth-child(6) {
        left: 8px;
        top: 40px;
        animation-delay: 0.5s;
      }
      &:nth-child(7) {
        left: 2px;
        top: 24px;
        animation-delay: 0.6s;
      }
      &:nth-child(8) {
        left: 8px;
        top: 8px;
        animation-delay: 0.7s;
      }
    }
  }
  @keyframes demo {
    0%,
    40%,
    100% {
      transform: scale(1);
    }
    20% {
      transform: scale(2.5);
    }
  }
  @-webkit-keyframes demo {
    0%,
    40%,
    100% {
      transform: scale(1);
    }
    20% {
      transform: scale(2.5);
    }
  }
}
</style>
