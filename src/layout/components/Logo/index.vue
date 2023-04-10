<template>
  <div class="logo-item">
    <div class="logo-img">
      <img :src="logoOfGetter.logo" />
    </div>
    <div class="logo-text">
      <div class="cn">
        {{ logoOfGetter.titleCn }}
      </div>
      <div class="en">
        {{ logoOfGetter.titleEn }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Logo',
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters('project', ['logoOfGetter'])
  }
}
</script>

<style scoped lang="scss">
.logo {
  &-item {
    height: var(--line-1);
    display: flex;
    align-content: center;
    align-self: center;
    cursor: pointer;
  }
  &-img {
    width: var(--img);
    height: var(--img);
    margin-right: 15px;
    img {
      width: 100%;
      height: 100%;
      transform: scale(1.2);
    }
  }
  &-text {
    margin-top: -5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .cn {
      color: var(--logo-cn);
      font-size: 16px;
      font-weight: 600;
    }
    .en {
      color: var(--logo-en);
      font-size: var(--logo-font-en);
      font-weight: lighter;
      font-style: oblique;
    }
  }
}
</style>
