<template>
  <div class="tree-menu">
    <Tree :data="data" @on-select-change="onClickNode" />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    onClickNode([node]) {
      this.$emit('on-click', node)
    }
  }
}
</script>

<style scopde lang="scss">
.tree-menu {
  max-height: 400px;
  overflow: auto;
  &::-webkit-scrollbar-track-piece {
    background: #d3dce6;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #99a9bf;
    border-radius: 20px;
  }
  .ivu-tree {
    ul {
      font-size: 17px;
    }
  }
}
</style>
