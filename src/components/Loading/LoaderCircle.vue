<template>
  <div class="loader">
    <div class="loader loader-circles"></div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -28px 0 0 -25px;
  display: block;
  width: 50px;
  height: 50px;
  vertical-align: middle;
  &-circles {
    border-radius: 50px;
    border: 2px solid transparent;
    // border-top-color: #6fd3b3;
    border-top-color: var(--theme);
    animation: spin 0.6s linear infinite;
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 5px;
      left: 5px;
      right: 5px;
      bottom: 5px;
      border-radius: 50px;
      border: 2px solid transparent;
      // border-top-color: rgba(111, 211, 179, 0.8);
      border-top-color: var(--theme);
      opacity: 0.8;
      animation: spinreverse 0.4s linear infinite;
    }
    &::before {
      top: 12px;
      left: 12px;
      bottom: 12px;
      right: 12px;
      // border-top-color: rgba(111, 211, 179, 0.6);
      border-top-color: var(--theme);
      animation: spinreverse 1.2s linear infinite;
    }
    &::after {
    }
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    @keyframes spinreverse {
      0% {
        transform: rotate(360deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }
  }
}
</style>
