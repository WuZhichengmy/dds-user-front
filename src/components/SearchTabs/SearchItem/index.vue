<template>
  <div :class="['search-item', theme]">
    <div class="search-wrapper">
      <div :class="['input-holder', config.size]">
        <Input
          v-model="keyword"
          type="text"
          class="search-input"
          clearable
          placeholder="请输入检索词"
          @on-enter="handleSearchBtn"
        >
          <Select
            v-if="!config.disabledGradeSearch"
            v-model="field"
            slot="prepend"
            class="input-prepend"
            transfer
            transfer-class-name="search-dropdown"
          >
            <Option
              :value="item.name"
              v-for="(item, index) in fields"
              :key="index + '_fields'"
              :label="item.label"
            >
              <span>{{ item.label }}</span>
              <!-- <span style="float:right;color:#ccc">{{ item.name }}</span> -->
            </Option>
          </Select>
        </Input>
        <button class="search-icon" @click="handleSearchBtn" title="检索">
          <span><Icon type="ios-search"/></span>
        </button>
      </div>
    </div>
    <div class="search-item-footer">
      <slot name="checkbox">
        <div class="search-item-checkbox">
          <checkbox-search
            :config="config"
            @on-change-checkbox="handleChangeCheckbox"
            @on-select-all="handleSelectAllBtn"
            :resourceIds="resourceIds"
            v-if="data && data.length > 1 && resourceIds"
            v-on="$listeners"
          >
            <template v-if="whiteList.indexOf($route.path) === -1"> </template>
          </checkbox-search>
        </div>
      </slot>
      <slot
        name="gradeSearch"
        v-if="resourceIds && !config.disabledGradeSearch"
      >
        <span
          :class="gradeSearchClassName"
          @click="handleGradeSearchBtn"
          title="高级检索"
        >
          <Icon type="md-options" class="grade-search-label-icon" />
          高级检索
        </span>
      </slot>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import mixin from '../mixins/index'
import routerMixin from '@/mixins/router'
import CheckboxSearch from '../CheckboxItem'
import { deepClone } from '@/utils'

export default {
  name: 'SearchItem',
  mixins: [mixin, routerMixin],
  components: {
    CheckboxSearch
  },
  props: {
    changeItemHeight: {
      type: Boolean,
      required: false,
      default: false
    },
    data: {
      type: Array | null,
      required: true
    },
    config: {
      type: Object,
      required: false,
      default: () => {
        return {
          height: {
            type: 'number',
            value: 70
          },
          width: {
            type: 'percent',
            value: '100%'
          }
        }
      }
    },
    theme: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      query: {},
      keyword: '',
      whiteList: ['Search', 'Report'],
      resourceIds: null,
      fields: [],
      field: '',
      searchLogic: []
    }
  },
  computed: {
    ...mapGetters('project', ['searchConfigOfGetter']),
    ...mapState('project', ['resources', 'gradeSearchConfig']),
    resourceName() {
      return id => {
        const { resources } = this
        let r = ''
        resources.map(item => {
          if (item.id == id) r = item.name
        })
        return r
      }
    },
    className() {
      const { style } = this.config
      return ['search-wrapper', style ? `input-${style}` : '']
    },
    holderClassName() {
      let str = this.config.size ? 'input-' + this.config.size : 'input-large'
      return str + ' input-holder'
    },
    show() {
      const {
        $route: { name },
        whiteList
      } = this
      const index = whiteList.indexOf(name)
      return index !== -1 ? true : false
    },
    gradeSearchClassName() {
      const { style } = this.config
      return ['grade-search-label', style ? style : '']
    },
    transferClassName() {
      return [this.$route.name === 'Home' ? 'search-transfer' : 'transfer']
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        this.query = to.query
        this.initResourceIds()
      },
      immediate: false
    },
    data: {
      handler(nVal, oVal) {
        if (nVal) {
          // this.initResourceIds()
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.query = this.$route.query
    this.initResourceIds()
  },
  methods: {
    initResourceIds() {
      const query = this.$attrs['queryParameter']
      if (query) {
        const { resourceIds, keyword } = query
        if (resourceIds && resourceIds.length) {
          this.resourceIds = resourceIds
          this.keyword = keyword ? keyword : ''
          this.initFields(query.field)
          return
        }
      }
      const [first] = this.resources
      this.resourceIds = first ? [first.id] : []
      this.initFields()
    },
    initFields(current) {
      const { resourceIds } = this
      if (resourceIds.length === 0) {
        this.fields = []
        this.field = ''
        return
      }
      const gradeSearchConfig = deepClone(this.gradeSearchConfig)
      const filterConfig = gradeSearchConfig.filter(item =>
        resourceIds.includes(item.resourceId)
      )
      let newArr = []
      filterConfig.map((item, index) => {
        if (index === 0) {
          newArr = item.advancedSearchFields
        } else {
          newArr = this.setUnion(newArr, item.advancedSearchFields)
        }
      })
      let field = ''
      this.fields = newArr
      if (!newArr.length) {
        this.field = ''
      } else {
        newArr.map(item => {
          if (current) {
            if (!field && item.name === current) {
              field = current
            }
          }
        })
        this.field = field ? field : this.fields[0].name
      }
    },
    handleSelectAllBtn(state) {
      if (state) {
        if (this.resourceIds.length === this.data.length) return
        let t = []
        this.data.map(item => {
          t.push(item.id)
        })
        return (this.resourceIds = t)
      }
      this.resourceIds = []
    },
    handleChangeCheckbox(arr) {
      this.resourceIds = arr
      this.initFields()
    },
    handleSearchBtn() {
      if (!this.config.disabledGradeSearch && !this.field)
        return this.$Message.warning('请选择检索字段')
      const searchId = this.setQuery()
      if (!searchId) return
      this.$emit('on-search', {
        mode: 'base',
        searchId
      })
    },
    handleGradeSearchBtn() {
      const { field, fields } = this
      let label = field
      let flag = false
      fields.map(item => {
        if (!flag && item.name === field) {
          label += `-${item.label}`
          flag = true
        }
      })
      // const searchLogic = []
      // searchLogic.push({
      //   field: label,
      //   keyword: '',
      //   logic: 'AND'
      // })
      // this.searchLogic = searchLogic
      const searchId = this.setQuery('advanced')
      if (!searchId) return
      this.$emit('on-search', {
        mode: 'advanced',
        searchId
      })
    },
    handleAnalysisBtnClick() {
      const searchId = this.setQuery()
      if (!searchId) return
      this.openInNewTab({
        path: '/analyze',
        query: { searchId }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  // position: relative;
  padding-right: 1px;
  --search-input-h: 50px;
  --search-border: 1px solid #000; //d8e1e5
  --search-input-bg: transparent;
  --search-input-color: var(--font);
  --icon-bg: transparent;
  --icon-font: #000;
  --icon-bg-before: transparent;
  --icon-font-hover: var(--theme);
  --icon-border: none;
  &.dark {
    --search-input-bg: rgba(0, 0, 0, 0.5);
    --search-input-color: #fff;
    --search-selection-color: #fff;
    --search-border: none;
    --icon-bg: #fff;
    --icon-font: #50596c;
    --icon-font-hover: #50596c;
    --icon-bg-before: #fff;
  }
  &.light {
    --search-input-bg: #fff;
    --search-input-color: var(--theme);
    --search-border: var(--theme);
    --search-selection-color: #000;
    --icon-bg: var(--color);
    --icon-font: #fff;
    --icon-font-hover: #fff;
    --icon-bg-before: var(--color);
  }
  .analysis-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 5px;
  }
  .search-wrapper {
    display: flex;
    position: relative;
    border: var(--search-border);
    box-shadow: 0 3px 3px rgb(0 0 0 / 8%);
    .input-holder {
      &.large {
        --search-input-h: 58px;
      }
      width: 100%;
      position: relative;
      transition: all 0.3s;
      display: flex;
      flex-flow: nowrap;
      height: var(--search-input-h);
      line-height: var(--search-input-h);
      .search-input {
        ::v-deep .ivu-input {
          line-height: var(--search-input-h);
          height: var(--search-input-h);
          background: var(--search-input-bg) !important;
          color: var(--search-input-color);
          opacity: 1;
          box-sizing: border-box;
          border: none;
          outline: none;
          font-family: 'Open Sans', Arial, Verdana;
          font-size: 16px;
          font-weight: 400;
          transition: all 0.3s;
          padding-left: 20px;
          padding-right: 20px;
          border-radius: 0;
          &:focus {
            box-shadow: none;
          }
        }
        ::v-deep .ivu-input-icon {
          height: var(--search-input-h);
          line-height: var(--search-input-h);
        }
        ::v-deep .ivu-input-group-prepend {
          border: none;
          background: var(--search-input-bg) !important;
          border-right: 1px solid transparent;
          .ivu-select-selected-value,
          .ivu-select-placeholder {
            font-size: 16px;
            color: var(--search-selection-color);
          }
        }
        .input-prepend {
          width: 150px;
        }
      }
      .search-icon {
        background: var(--icon-bg);
        border: var(--icon-border);
        color: var(--icon-font) !important;
        margin: 0 !important;
        display: inline-block;
        position: relative;
        min-width: 60px;
        width: 12%;
        height: inherit;
        line-height: inherit;
        margin: auto 6px auto 0;
        padding: 0px;
        outline: none;
        z-index: 2;
        cursor: pointer;
        transition: all 0.7s;
        overflow: hidden;
        color: #fff;
        vertical-align: top;
        opacity: 0.7;
        span {
          position: relative;
          z-index: 3;
        }
        &::before {
          background: var(--icon-bg-before);
          content: '';
          position: absolute;
          top: 0;
          left: -103%;
          bottom: -1px;
          width: 102%;
          transition: transform 0.35s;
          z-index: 2;
        }
        &:hover {
          color: var(--icon-font-hover) !important;
          opacity: 1;
          &::before {
            transform: translateX(100%);
          }
        }
        ::v-deep .ivu-icon {
          font-size: 25px;
          font-weight: 600;
          vertical-align: middle;
        }
      }
    }
  }

  &-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    font-size: 16px;
  }
}
</style>

<style lang="scss">
.ivu-select-dropdown {
  * {
    font-size: 16px !important;
  }
}
</style>

<style>
.dark.grade-search-label {
  color: #fff;
}
.dark.grade-search-label:hover {
  color: #fff;
}

/* light */
.input-light {
  background: rgba(255, 255, 255, 1);
}
.input-light .ivu-input {
  color: var(--theme);
}
.input-light .search-icon::before {
  background: var(--theme);
  border-color: transparent;
}
.input-light .search-icon:hover {
  color: #fff !important;
}
.input-light .search-icon {
  background: transparent;
  border-color: #000;
  color: var(--theme) !important;
}

.grade-search-label {
  cursor: pointer;
  min-width: 90px;
  font-size: 16px;
}
.grade-search-label-icon {
  font-size: 18px;
}
.grade-search-label:hover {
  color: var(--color);
}
</style>
