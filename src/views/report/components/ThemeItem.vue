<template>
  <div class="theme-item">
    <div class="theme-box">
      <Tooltip
        placement="bottom"
        class="ivu-tooltip-light"
        v-for="(item, index) in themes"
        :key="item.id"
      >
        <span
          :class="{ isActived: theme === item.name }"
          @click="changeCurrentTheme(item)"
        >
          <span
            class="theme-items"
            :style="{ background: item.colorList[0] }"
          ></span>
        </span>
        <div slot="content">
          <p style="border-bottom: 1px solid #eee">{{ item.name }}</p>
          <div style="margin-top: 5px">
            <div
              class="colorBox"
              :style="{ background: items }"
              v-for="(items, index) in item.colorList"
              :key="index + '_colorList'"
            ></div>
          </div>
        </div>
      </Tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThemeItem',
  props: {
    theme: String,
    themes: Array
  },
  data() {
    return {

    }
  },
  methods: {
    changeCurrentTheme(item) {
      this.$emit('on-change-theme', item)
    },
  },
}
</script>

<style scoped>
.theme-item {
  position: relative;
  height: 30px;
  width: 100%;
}
.theme-box {
  position: absolute;
  right: 0;
  top: 0;
  padding: 0 20px;
}
.theme-items {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  margin: 0 4px;
  background: #000;
  cursor: pointer;
  position: relative;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
  border: 1px solid #e5e5e5;
  transition: width 0.5s;
}
.colorBox {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
}
.isActived .theme-items {
  width: 30px;
}
</style>
