<template>
  <Row
    :gutter="40"
    class="panel-group"
    @mouseleave.native="currentHoverPanel = null"
  >
    <Col
      :xs="12"
      :sm="8"
      :lg="colNumber"
      class="card-panel-col"
      v-for="(item, index) in data"
      :key="index + '_panel'"
      @mouseover.native="currentHoverPanel = index"
      @click.native="handleClickItem(item)"
      :title="'查看' + item.name + '列表'"
    >
      <div class="card-panel">
        <div
          :class="`${item.icon} card-panel-icon-wrapper`"
          :style="{
            background: '#fff',
            color: item.color
          }"
        >
          <svg-icon :icon-class="item.icon" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description" ref="cardPanel">
          <div
            class="card-panel-text"
            :style="{
              color: `${item.color}`
            }"
          >
            {{ item.name }}
          </div>
          <count-to
            :start-val="0"
            :end-val="parseInt(item.count)"
            :duration="2600"
            class="card-panel-num"
            :autoplay="true"
            ref="countTo"
          />
        </div>
      </div>
    </Col>
  </Row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  name: 'PanelGroup',
  components: {
    CountTo
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentPanel: [],
      currentHoverPanel: null
    }
  },
  computed: {
    colNumber() {
      return Math.ceil(24 / this.data.length) < 4
        ? 4
        : Math.ceil(24 / this.data.length) === 24
        ? 12
        : Math.ceil(24 / this.data.length)
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    handleClickItem(item) {
      this.$emit('on-click', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  max-height: 250px;
  overflow-y: auto;
  margin: 0 !important;
  padding-top: 15px;
  .card-panel-col {
    margin-bottom: 15px;
  }
  .card-panel {
    border: 1px solid #e5e5e5;
    height: 100px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: var(--font);
    background: #fff;
    padding: 0 20px;
    display: flex;
    flex-flow: nowrap;
    align-items: center;
    justify-content: space-between;
    transition: all 0.6s;
    border-radius: 10px;
    box-shadow: 4px 5px 0 0 rgb(0 0 0 / 7%);
    .card-panel-description {
      font-weight: bold;
      .card-panel-text {
        line-height: 25px;
        color: var(--font);
        font-size: 14px;
      }
      .card-panel-num {
        font-size: 20px;
        color: var(--font);
      }
    }
    .card-panel-icon-wrapper {
      padding: 5px;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    &:hover {
      box-shadow: 4px 5px 0 0 rgb(0 0 0 / 10%);
      transform: scale(1.02);
      .card-panel-icon-wrapper {
        color: #fff;
      }
    }
  }
}

@media (max-width: 550px) {
}
</style>
