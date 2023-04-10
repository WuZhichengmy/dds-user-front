<template>
  <div :class="className">
    <slot name="label">
      <span class="search-item-checkbox-label">资源类型: </span>
    </slot>
    <div class="checkbox-search-content">
      <CheckboxGroup
        v-model="currentResourcesArr"
        @on-change="handleChangeCheckbox"
        class="checkbox-group"
      >
        <template v-for="(item, index) in resources">
          <Checkbox
            :key="index + '_checkboxSearch'"
            :label="item.id ? item.id : item.resourceId"
            class="search-checkbox-items"
            v-if="index < displayLength"
          >
            <span>{{ item.name }}</span>
          </Checkbox>
        </template>
        <!-- <span
          v-if="currentPage && displayLength !== resources.length"
          class="get-more-btn"
          @click="handleGetMoreBtn"
          >更多</span
        > -->
      </CheckboxGroup>
      <slot name="operation">
        <!-- <div class="search-operation" v-if="multiple">
        <span @click="handleSelectAllBtn(true)" class="select-all">全选</span>
        <span @click="handleSelectAllBtn(false)" class="cancel-select-all"
          >清除</span
        >
      </div> -->
      </slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CheckboxSearch',
  props: {
    config: {
      type: Object,
      required: false,
      default: () => {
        return {
          style: 'light',
          size: 'middle'
        }
      }
    },
    resourceIds: {
      type: Array || undefined,
      required: true
    },
    multiple: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      displayLength: 8,
      currentResourcesArr: [],
      whiteList: ['/search', '/report']
    }
  },
  computed: {
    ...mapState('project', ['resources']),
    className() {
      const { style, size } = this.config
      let str = 'checkbox checkbox-search'
      if (style) {
        str += ' checkbox-' + style
      }
      if (size) {
        str += ' checkbox-' + size
      }
      return str
    },
    currentPage() {
      return this.whiteList.indexOf(this.$route.path) === -1 ? true : false
    }
  },
  watch: {
    resourceIds: {
      handler(n) {
        this.currentResourcesArr = n ? n : []
      },
      immediate: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { resources, resourceIds, currentPage } = this
      if (resources && resources.length) {
        this.displayLength = currentPage ? 8 : resources.length
      }
      this.currentResourcesArr = resourceIds ? resourceIds : []
    },
    handleChangeCheckbox(arr) {
      if (!this.multiple) {
        if (arr.length > 1) {
          this.currentResourcesArr = []
          let i = String(arr.length - 1)
          this.currentResourcesArr = [arr[i]]
        }
        this.$emit('on-change-checkbox-single', this.currentResourcesArr)
      } else {
        if (arr.length === 0) {
          this.$Message.warning('请至少选择一个资源类型')
          this.currentResourcesArr.push(...this.resourceIds)
          return
        }
        this.$emit('on-change-checkbox', arr)
      }
    },
    handleGetMoreBtn() {
      this.$listeners.handleGetMoreBtn()
    },
    handleSelectAllBtn(state) {
      if (!state) {
        this.currentResourcesArr = []
      } else {
        if (this.currentResourcesArr.length === this.resources.length) return
        let t = []
        this.data.map(item => {
          t.push(item.id ? item.id : item.resourceId)
        })
        this.currentResourcesArr = t
      }
      this.$emit('on-select-all', state)
    }
  }
}
</script>

<style scoped>
.checkbox-search label {
  font-weight: 500 !important;
}
.checkbox-search >>> .ivu-checkbox-wrapper {
  margin-bottom: 8px !important;
}
.checkbox-search-content {
  display: flex;
  flex-flow: wrap;
}
.checkbox-search-content .checkbox-group {
  margin-right: 10px;
}
</style>
<style>
/* checkbox */
.checkbox span {
  font-size: 14px;
}
.checkbox-search {
  display: flex;
}

/* checkbox-drak */
.checkbox-dark .search-item-checkbox-label {
  color: #fff;
  font-size: 16px;
}
.checkbox-dark .ivu-checkbox-default span {
  color: #fff;
}
.checkbox-dark .ivu-checkbox-inner {
  background-color: rgba(0, 0, 0, 0.2);
}
#app .checkbox-dark .ivu-checkbox-checked .ivu-checkbox-inner {
  background: rgba(0, 0, 0, 0.2) !important;
  border-color: #fff !important;
}
#app .checkbox-dark .ivu-checkbox-wrapper-checked * {
  color: #fff !important;
}
#app .checkbox-dark .ivu-checkbox-checked .ivu-checkbox-inner:after {
  border-color: #fff;
}
#app .checkbox-dark .ivu-checkbox-checked .ivu-checkbox-inner:after {
  border-color: #fff;
}

#app .checkbox-middle span {
  font-size: 14px;
}
#app .checkbox-middle span {
  font-size: 14px;
}

.checkbox-search {
  display: flex;
}
.search-item-checkbox-label {
  font-weight: 500;
  min-width: 80px;
  color: var(--font);
  font-size: 16px;
}
.get-more-btn {
  cursor: pointer;
  font-size: 15px;
}
.checkbox-dark .get-more-btn {
  color: #fff;
}
.get-more-btn:hover {
  text-decoration: underline;
}
/* 全选 清除 */
.search-operation {
}
.search-operation span {
  cursor: pointer;
  font-size: 14px;
}
.search-operation .select-all:hover {
  color: var(--color);
}
.cancel-select-all {
  color: #878787;
}
</style>

<style scoped lang="scss">
.checkbox-border {
  ::v-deep {
    .ivu-checkbox-checked {
      .ivu-checkbox-inner {
        border-color: #dcdee2 !important;
        background-color: var(--search-checkbox) !important;
      }
    }
    .ivu-checkbox-wrapper-checked,
    .ivu-checkbox-wrapper * {
      color: var(--font) !important;
      font-weight: 600;
    }
  }
}
</style>
