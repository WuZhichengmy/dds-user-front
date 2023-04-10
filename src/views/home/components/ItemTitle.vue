<template>
  <div class="header">
    <Icon :type="icon" class="icon" />
    <span class="cn">{{ cn }}</span>
    <span class="en">{{ en }}</span>
  </div>
</template>

<script>
export default {
  name: 'ItemTitle',
  props: ['cn', 'en', 'icon']
}
</script>

<style scoped lang="scss">
.header {
  text-align: center;
  margin: 0 20px;
  padding-top: 20px;
  position: relative;
  padding-bottom: 5px;
  border-bottom: 1px solid #d8dce0;
  background: #fff;
  cursor: default;
  color: var(--font);
  display: flex;
  justify-content: center;
  align-items: center;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    border-radius: 2px;
    background: var(--item-title);
  }
  .cn,
  .en,
  .icon {
    font-size: 24px;
    font-weight: 500;
    padding-right: 5px;
  }
  .icon {
  }
  .en {
    font-size: 24px;
    color: #ced2d5;
  }
}
</style>
