<template>
  <div class="result-tabs" ref="tab">
    <div
      :class="['result-tabs-items', item.id === active ? 'active' : '']"
      v-for="(item, index) in data"
      :key="item.name + '_result-tabs-items'"
      @click="handleClickTabs(item.id, index)"
    >
      <span ref="tabItem">{{ item.name }} </span>
    </div>
    <span
      class="scroller"
      :style="{ left: scroller.offset + 'px', width: scroller.width + 'px' }"
    >
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ResultTabs',
  props: {
    config: {
      type: Object,
      required: false,
      default: () => {}
    },
    resourceIds: {
      type: Array,
      required: true
    },
    active: {
      type: String | Number,
      required: false,
      default: 'news'
    },
    query: {
      type: Object,
      required: true
    },
    all: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      data: [],
      scroller: {
        offset: 0,
        width: 0
      }
    }
  },
  computed: {
    ...mapState('project', ['resources'])
  },
  watch: {
    query: {
      handler(nVal, oVal) {
        this.initData()
      }
    },
    active: {
      handler(n) {
        let index = this.resourceIds.indexOf(n)
        if (index !== -1) {
          this.$nextTick(() => {
            const { left: tabL } = this.$refs.tab.getBoundingClientRect()
            const { left, width } = this.$refs.tabItem[
              index
            ].getBoundingClientRect()
            const scrolerW = width / 2
            this.scroller.width = scrolerW
            this.scroller.offset = left - tabL + scrolerW + scrolerW / 2
          })
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.data = this.resources
        .filter(item => {
          return this.resourceIds.indexOf(item.id) != -1
        })
        .map(item => {
          return {
            ...item
          }
        })
      if (this.all) {
        this.data.splice(0, 0, {
          id: '0',
          name: '全部'
        })
      }
    },
    handleClickTabs(id, index) {
      this.$emit('on-click-tabs', id)
    }
  }
}
</script>

<style scoped lang="scss">
.result-tabs {
  display: flex;
  flex-wrap: nowrap;
  background: #f7f7f7;
  letter-spacing: 1px;
  border-bottom: 1px solid #d8e1e5;
  position: relative;
  &-items {
    font-size: 16px;
    cursor: pointer;
    padding: 8px 20px;
    font-weight: 500;
    transition: 0.6s;
    font-weight: 600;
    display: flex;
    align-self: center;
    letter-spacing: 1px;
    &.active {
      color: var(--theme);
    }
  }
  .scroller {
    content: '';
    position: absolute;
    bottom: 0;
    transform: translateX(-100%);
    height: 4px;
    background: var(--color);
    transition: all 0.6s;
  }
}
</style>
