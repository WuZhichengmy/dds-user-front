<template>
  <div class="detail-item">
    <div class="detail-row" v-for="(item, index) in rows" :key="index + '_row'">
      <div
        :class="cellClassName(items)"
        :style="{ textAlign: items.align }"
        v-for="(items, i) in item"
        :key="i + '_cell'"
      >
        <div
          :class="labelClassName(items)"
          v-if="
            items.orderNumber !== 1 && items.isLabelShow && data[items.name]
          "
          :title="open('label', items) ? data[items.name] : ''"
          @click="openDir(open('label', items), data[items.name])"
        >
          {{ items.label
          }}<span
            v-if="
              items.isValueShow && data[items.name] && data[items.name] !== ''
            "
            >:
          </span>
        </div>
        <div
          :class="valueClassName(items)"
          v-if="items.isValueShow && data[items.name]"
          :style="{ ...items.style }"
          :title="open('value', items) ? data[items.name] : ''"
          @click="openDir(open('value', items), data[items.name])"
        >
          <span
            class="content"
            :ref="`content_${index}_${i}`"
            :title="data[items.name]"
            >{{ data[items.name] }}</span
          >
          <span
            class="expand"
            @click="handleItemExpand(index, i)"
            v-if="items.orderNumber > 1 && items.isExpand !== null"
            :title="items.isExpand ? '收起' : '展开'"
            ><Icon :type="`ios-arrow-${items.isExpand ? 'up' : 'down'}`" />{{
              items.isExpand ? '收起' : '...展开'
            }}</span
          >
          <span>{{ item.expand }}</span>
        </div>
      </div>
    </div>
    <!-- <div class="detail-paper detail-paper-abstract" v-if="data.path">
        <p class="detail-paper">
          <span
            class="label-text hover"
            title="在新标签页中查看"
            @click="openDirPage(data.path)"
            >原文</span
          >
        </p>
        <p class="report-detail">
          <embed :src="data.path" width="900" height="900" />
        </p>
      </div> -->
    <div v-if="!data" style="height: 500px">
      <loading />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Loading from '@/components/Loading'
import { sortBy } from '@/utils/utils'

export default {
  name: 'DetailItem',
  props: {
    data: {
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
    currentType: {
      type: String,
      required: false,
      default: 'paper'
    }
  },
  data() {
    return {
      rows: []
    }
  },
  computed: {
    cellClassName() {
      return item => {
        return [
          'detail-cell',
          {
            'cell-heightlight': item.hightlight,
            'cell-title': item.orderNumber === 1
          }
        ]
      }
    },
    labelClassName() {
      return item => {
        return [
          'cell-label',
          {
            'cell-label-open':
              !item.isValueShow && item.isLabelShow && item.isOpen
          }
        ]
      }
    },
    valueClassName() {
      return item => {
        return [
          'cell-value',
          {
            'cell-value-open': item.isValueShow && item.isOpen,
            'height-limit': item.isExpand === false
          }
        ]
      }
    },
    open() {
      return (type, item) => {
        if (type === 'label') {
          return !item.isValueShow && item.isLabelShow && item.isOpen
            ? true
            : false
        }
        if (type === 'value') {
          return item.isValueShow && item.isOpen ? true : false
        }
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      let temp = [],
        fields = [],
        skip = null
      temp = this.fields.sort(sortBy('orderNumber', 1))
      let n = temp[temp.length - 1].orderNumber
      temp.map((item, index) => {
        if (skip && skip === item.orderNumber) {
          return
        }
        fields[index] = []
        fields[index] = temp.filter((items, i) => {
          if (item.orderNumber === items.orderNumber) {
            skip = item.orderNumber
            return items
          }
        })
      })
      fields = fields.filter((item, index) => {
        return item
      })
      this.rows = fields
      this.calcLineNumber()
    },
    openDir(isOpen, url) {
      if (!isOpen) return
      window.open(url, '_blank')
    },
    calcLineNumber() {
      this.$nextTick(() => {
        this.rows.map((item, index) => {
          item.map((items, i) => {
            if (!this.$refs[`content_${index}_${i}`]) return
            let h = this.$refs[
              `content_${index}_${i}`
            ][0].getBoundingClientRect().height
            let l = 22
            if (h / l > 3) {
              Vue.set(this.rows[index][i], 'isExpand', false)
            }
          })
        })
      })
    },
    handleItemExpand(index, i) {
      Vue.set(this.rows[index][i], 'isExpand', !this.rows[index][i].isExpand)
      this.$forceUpdate()
    }
  },
  components: {
    Loading
  }
}
</script>

<style scoped lang="scss">
.detail-item {
  position: relative;
  padding-bottom: 60px;
  .detail-row {
    --row-color: #000;
    margin: 10px 0;
    .detail-cell {
      line-height: 1.7;
      font-size: 15px;
      color: var(--row-color);
      margin-bottom: 8px;
      display: flex;
      flex-flow: wrap;
      word-break: break-all;
      .input {
        width: 100%;
      }
      &.cell-title {
        height: initial;
        margin-bottom: 25px;
        .cell-value {
          letter-spacing: 1.3px;
          font-size: 22px;
          line-height: 34px;
          color: var(--theme);
          font-weight: normal;
          word-break: break-all;
        }
      }
      &.cell-heightlight {
        .cell-value {
          color: var(--theme);
          font-weight: 600;
        }
      }

      .cell-label {
        display: inline-block;
        font-weight: 600;
        padding-right: 4px;
        color: var(--row-color);
        flex-shrink: 0;
        font-size: 14px;
      }
      .cell-value {
        &.height-limit {
          max-height: 66px;
        }
        display: inline-block;
        line-height: 22px;
        font-size: 15px;
        color: #666;
        word-spacing: 3px;
        word-wrap: break-word;

        position: relative;
        overflow: hidden;
        letter-spacing: 1px;
        &.edit {
          width: 100%;
        }
        &.cell-value-open {
          text-decoration: underline;
          cursor: pointer;
        }
        .expand {
          color: var(--theme);
          opacity: 1;
          transition: all 0.6s;
          position: absolute;
          right: 0;
          bottom: 0;
          font-size: 14px;
          cursor: pointer;
          display: block;
          font-weight: 500;
          background: -webkit-gradient(
            linear,
            left top,
            right top,
            from(hsla(0, 0%, 100%, 0)),
            to(#fff),
            color-stop(30%, #fff)
          );
          padding-right: 5px;
          i {
            transition: transform 0.6s;
            font-weight: 600;
          }
          &:hover {
            opacity: 0.9;
            i {
              transform: rotate(-180deg);
            }
          }
        }
      }
      .cell-value-open,
      .cell-label-open {
        text-decoration: underline;
        cursor: pointer;
        &:hover {
          color: var(--theme);
        }
      }
    }
  }
}
</style>

<style scoped>
.hover:hover {
  text-decoration: underline;
  cursor: pointer;
}
.label-text {
  font-weight: 600;
  padding-right: 4px;
  font-size: 15px;
  line-height: 22px;
  color: #898989;
}
</style>
