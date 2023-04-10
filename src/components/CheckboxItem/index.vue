<template>
  <div class="checkbox-item">
    <Collapse ref="collapse" v-model="currentCollapse" simple class="collapse">
      <Panel
        v-for="(item, index) in data"
        :key="index + '_checkbox'"
        :name="index + ''"
      >
        {{ item.title }}
        <div slot="content">
          <CheckboxGroup
            class="checkbox-group"
            v-model="checkbox[index]"
            @on-change="handleChangeCheckbox(index, $event)"
          >
            <template v-for="(items, i) in item.esStatisticsResults">
              <Checkbox
                v-if="i < 5"
                :key="i + '_checkboxItem'"
                :label="item.field + '#' + items.key"
                :class="isItemsShow(index, i)"
              >
                <span class="checkbox-items">{{
                  items.key + ' (' + items.value + '条)'
                }}</span>
              </Checkbox>
            </template>
          </CheckboxGroup>
          <!-- <div
            v-if="item.esStatisticsResults.length > length"
            class="collapse-footer"
          >
            <span class="open-item" @click="handleItemsOpen(index)">{{
              item.isOpened ? '收起更多' : '展开更多'
            }}</span>
          </div> -->
          <div v-if="!item.esStatisticsResults.length" class="empty">
            <div>
              <Icon type="ios-cube-outline" size="22" />
            </div>
            <p>无精炼信息</p>
          </div>
          <div
            :class="[
              'filter-btn',
              checkbox[index] && checkbox[index].length > 0
                ? 'filter-btn-active'
                : ''
            ]"
          >
            <Button
              class="reset"
              type="dashed"
              size="small"
              icon="md-refresh"
              v-if="checkbox[index] && checkbox[index].length > 0"
              @click="reset(index)"
              title="清除"
            />
            <Button
              class="filter"
              size="small"
              v-if="item.esStatisticsResults.length"
              @click="handleFilterBtn(index)"
              >精炼</Button
            >
          </div>
        </div>
      </Panel>
    </Collapse>
    <div v-if="noResult" class="empty">
      <div>
        <Icon type="ios-cube-outline" size="28" />
      </div>
      <p>暂无精炼信息</p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'CheckboxItem',
  props: {
    data: {
      type: Array,
      required: true
    },
    currentCollapse: {
      type: Array,
      required: true
    },
    currentRefines: {
      type: Array | null,
      required: true
    },
    length: {
      type: Number,
      required: false,
      default: 5
    }
  },
  data() {
    return {
      checkbox: [],
      checkedItem: [],
      noResult: false
    }
  },
  computed: {
    isItemsShow() {
      return (index, i) => {
        if (i + 1 < this.length) {
          return 'display'
        }
        if (i + 1 > this.length && this.data[index].isOpened === true) {
          return 'display'
        }
        if (i + 1 > this.length && this.data[index].isOpened === false) {
          return 'none'
        }
      }
    }
  },
  watch: {
    $route: {
      handler() {
        this.checkbox = []
      },
      immediate: true
    },
    data: {
      handler(nVal) {
        this.noResult = false
        this.checkbox = []
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    handleItemsOpen(index) {
      this.data[index].isOpened = !this.data[index].isOpened
    },
    handleChangeCheckbox(index, $event) {},
    handleFilterBtn(index) {
      if (!this.checkbox[index] || this.checkbox[index].length === 0) {
        return this.$Message.info('请先选择精炼条件')
      }
      let tempItem,
        refines = []
      this.checkbox[index].map((item, index) => {
        tempItem = item.split('#')
        if (index === 0) {
          refines = {
            field: tempItem[0]
          }
          refines.values = []
        }
        refines.values.push(tempItem[1])
      })
      this.checkbox = []
      this.$emit('on-click-filter-btn', refines)
    },
    reset(index) {
      Vue.set(this.checkbox, index, [])
    }
  }
}
</script>

<style>
.ivu-collapse-content,
.ivu-collapse-simple {
  background-color: transparent;
}
.ivu-collapse {
  border: none;
}
</style>

<style lang="scss" scoped>
.checkbox {
  &-item {
    .collapse {
      .empty {
        padding-top: 20px;
        font-weight: 500;
        i {
        }
        p {
          font-weight: 500;
          font-size: 12px;
        }
      }
      .ivu-collapse-item {
        margin-bottom: 15px;
        border: 1px solid #ebebeb;
        transition: all 0.8s;
        border-top: none;
        box-shadow: 0 1px 1px 0 rgb(210 210 210 / 75%);
        &:hover {
          box-shadow: 0 2px 3px 0 rgb(210 210 210 / 75%);
        }
      }
      ::v-deep .ivu-collapse-header {
        border-bottom: none;
        font-size: 14px;
        font-weight: 400;
        background: #e3ecfd;
        color: var(--font);
      }
      ::v-deep .ivu-collapse-content {
        padding: 15px 10px 10px 10px;
        color: var(--font);
        .ivu-collapse-content-box {
          padding-bottom: 5px;
        }
      }
      .checkbox-group {
        padding-left: 10px;
        .ivu-checkbox-default {
          max-height: 400px;
          overflow: auto;
        }
        .checkbox-items {
          font-size: 12px;
          &:hover {
            color: var(--theme) !important;
            text-decoration: underline;
          }
        }
        .ivu-checkbox-wrapper {
          display: flex;
          padding-bottom: 15px;
          ::v-deep .ivu-checkbox {
            margin-right: 8px;
            line-height: 1.2;
          }
        }
      }
      &-footer {
        padding-left: 1em;
        .open-item {
          cursor: pointer;
          color: var(--theme);
          font-weight: 600;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .filter-btn {
        text-align: right;
        &.active {
          .ivu-btn {
            background: var(--theme);
            color: #fff;
          }
        }
        .reset {
          margin-right: 5px;
          &:hover {
            border-color: var(--theme);
            color: var(--theme);
          }
        }
        ::v-deep .filter {
          &.ivu-btn {
            border-color: var(--theme);
            color: var(--theme);
            transition: background 0.3s;
            &:hover {
              background: var(--theme);
              color: #fff;
            }
          }
        }
      }
    }
    .empty {
      text-align: center;
      padding-top: 80px;
      i {
        font-weight: 600;
      }
      p {
        font-weight: 600;
        font-size: 14px;
      }
    }
  }
}
</style>
