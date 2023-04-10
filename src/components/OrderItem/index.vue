<template>
  <div class="order-banner">
    <div class="order-banner-warpper">
      <span class="order-items">排序 :</span>
      <span
        v-for="item in data"
        :key="item.name + '_orderItems'"
        :class="orderItemsClassName(item.value)"
        @click="changeOrderType(item)"
      >
        {{ item.name }}
        <svg
          class="order-svg"
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          v-if="item.value === currentOrder"
        >
          <path :d="orderIcon" p-id="1554" :fill="color" />
        </svg>
      </span>
    </div>
  </div>
</template>

<script>
import sysEnum from '@/common/sysEnum.js'
export default {
  name: 'OrderItem',
  props: {
    data: {
      type: Array,
      required: false,
      default: () => {
        return [
          {
            name: '相关度',
            value: '1',
            default: 0
          },
          {
            name: '发布时间',
            value: '2',
            default: 0
          },
          {
            name: '被引频次',
            value: '3',
            default: 0
          },
          {
            name: '下载量',
            value: '4',
            default: 0
          },
          {
            name: '相关度1',
            value: '5',
            default: 0
          },
          {
            name: '相关度2',
            value: '6',
            default: 0
          }
        ]
      }
    }
  },
  data() {
    return {
      query: {},
      color: '#515a6e',
      currentOrder: '',
      currentOrderType: 0
    }
  },
  computed: {
    orderItemsClassName() {
      return value => {
        let str = 'order-items'
        str += this.currentOrder !== value ? '' : ' order-items-active'
        return str
      }
    },
    orderIcon() {
      let path = sysEnum.orderIcon.getValueByLabel(
        parseInt(this.currentOrderType)
      )
      return path
    }
  },
  watch: {
    '$route.query': {
      handler(nVal, oVal) {
        this.query = nVal
        this.init()
      },
      immediate: true
    }
  },
  mounted() {
    // this.query = this.$route.query
    // this.init()
  },
  methods: {
    init() {
      if (this.query.order) {
        this.currentOrder = this.query.order
        if (this.query.orderType) {
          this.currentOrderType = this.query.orderType
        }
        return
      }
      this.currentOrder = this.data[0].value
    },
    changeOrderType(item) {
      if (this.currentOrder === item.value) {
        this.currentOrderType = this.currentOrderType === 0 ? 1 : 0
      }
      this.$emit('on-change-order-type', {
        order: item.value,
        orderType: this.currentOrderType
      })
    }
  }
}
</script>

<style scoped>
.order-banner-warpper {
  height: 40px;
  line-height: 40px;
  background: #f1f1f1;
  display: flex;
  border: 1px solid #cccccc;
  border-left: none;
  border-right: none;
}
.order-items {
  padding: 0 8px;
  height: 100%;
  cursor: pointer;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  transition: border-color 0.3s;
}
.order-items-active {
  background: #fff;
  color: var(--theme);
  border-color: #cccccc;
  font-weight: 600;
}
.order-svg {
  height: 15px;
  width: 15px;
  vertical-align: text-bottom;
}
</style>
