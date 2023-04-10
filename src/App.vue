<template>
  <div id="app" class="default">
    <!-- shell -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {}
}
</script>

<style lang="scss">
body {
  background: #fff !important;
  padding: 0;
  // overflow-x: hidden;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  color: var(--font);
  font-size: 14px;
}
</style>
