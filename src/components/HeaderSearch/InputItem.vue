<template>
  <div class="input-item" v-click-outside="handleClose" :style="{ color: show?'#515a6e':'transparent'}">
    <input
      type="search"
      :class="isShow ? 'search-input opened' : 'search-input'"
      placeholder="请输入检索词"
    />
    <span v-if="!isShow" class="button" @click="isShow = true"
      ><Icon type="md-search"
    /></span>
    <span v-if="isShow" class="button close-btn" @click="isShow = false"
      ><Icon type="md-close"
    /></span>
  </div>
</template>

<script>
export default {
  name: 'InputItem',
  props: {
    show: Boolean
  },
  data() {
    return {
      isShow: false,
    }
  },
  directives: {
    clickOutside: {
      // 指令的定义
      bind(el, binding, vnode) {
        function clickHandler(e) {
          // 这里判断点击的元素是否是本身，是本身，则返回
          if (el.contains(e.target)) {
            return false
          }
          // 判断指令中是否绑定了函数
          if (binding.expression) {
            // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
            binding.value(e)
          }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = clickHandler
        document.addEventListener('click', clickHandler)
      },
      update() {},
      unbind(el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__)
        delete el.__vueClickOutside__
      },
    },
  },
  mounted() {},
  methods: {
    handleClose() {
      this.isShow = false
    },
  },
}
</script>

<style scoped>
.input-item {
  height: 68px;
  line-height: 68px;
  margin: auto 0;
  position: relative;
  font-size: 14px;
  vertical-align: text-top;
  background: transparent;
}
.button {
  font-size: 20px;
  height: 100%;
  width: 30px;
}
.search-input {
  -webkit-appearance: textfield;
  -webkit-box-sizing: content-box;
  font-family: inherit;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
  width: 0;
  color: transparent;
  cursor: pointer;
  height: 0;
}
input {
  outline: none;
  border: none;
  background: transparent;
}
input::-webkit-search-decoration,
input::-webkit-search-cancel-button {
  display: none;
}
.search-input::-webkit-input-placeholder {
  color: transparent;
}
.opened::-webkit-input-placeholder {
  color: #999 !important;
}
.opened:hover {
}
.opened {
  width: 200px;
  color: #515a6e;
  font-weight: 600;
  cursor: auto;
  height: 30px;
  line-height: 30px;
  padding: 0 8px;
  border: 1px solid #515a6e;
  border-radius: 5px;
}
.close-btn {
  position: absolute;
  top: 48%;
  transform: translateY(-50%);
  right: 0;
  height: 70px;
}
</style>
