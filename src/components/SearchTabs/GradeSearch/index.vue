<template>
  <div class="filter-item">
    <checkbox-search
      ref="checkboxSearch"
      class="checkbox"
      :config="config"
      :data="data"
      :resourceIds="resourceIds"
      :multiple="true"
      v-if="data.length > 1 && resourceIds"
      @on-change-checkbox-single="handleChangeCheckbox"
      @on-change-checkbox="handleChangeCheckbox"
      @on-select-all="handleSelectAllBtn"
    >
      <div class="label m-r-10" slot="label">
        <span>资源类型:</span>
      </div>
    </checkbox-search>
    <div class="grade-search-form">
      <div class="label m-r-10">
        <span>检索条件:</span>
      </div>
      <Form ref="filterForm" :model="form" class="grade-search-form-content">
        <template v-if="form.searchLogic.length > 0">
          <div
            v-for="(item, index) in form.searchLogic"
            :key="item.id"
            class="filter-items"
          >
            <FormItem class="search-select-1">
              <Select
                v-model="item.logic"
                transfer
                v-if="index !== 0"
                transfer-class-name="logic-select"
              >
                <Option
                  v-for="(logic, logicIndex) in logic"
                  :key="logicIndex + '_logicIndex'"
                  :value="logic"
                  :label="logic"
                >
                  <span>{{ logic }}</span>
                </Option>
              </Select>
              <Button
                v-if="index === 0"
                title="添加检索条件"
                class="add-btn btn-active"
                @click="addFilterItems"
                icon="md-add"
              />
            </FormItem>
            <FormItem class="search-select">
              <Select
                v-model="item.field"
                transfer
                transfer-class-name="filter-select"
              >
                <Option
                  v-for="(field, fieldIndex) in fields"
                  :key="fieldIndex + '_fieldIndex'"
                  :value="field.name + '-' + field.label"
                  :label="field.label"
                >
                  <span>{{ field.label }}</span>
                </Option>
              </Select>
            </FormItem>
            <FormItem class="filter-input">
              <Input
                v-model="item.keyword"
                placeholder="请输入检索词"
                clearable
              >
              </Input>
            </FormItem>
            <Button
              :disabled="form.searchLogic.length < 2"
              class="remove-btn"
              shape="circle"
              @click="removeFilterItems(index)"
              icon="md-remove"
              type="error"
              title="移除条件"
            />
          </div>
        </template>
      </Form>
    </div>
    <div class="grade-search-footer">
      <slot name="filter-info">
        <div class="grade-search-footer-btn">
          <Button
            v-if="form.searchLogic.length > 0"
            class="reset-btn"
            type="dashed"
            @click="resetSearchLogic"
            ><Icon type="md-refresh"
          /></Button>
          <Button
            type="primary"
            class="search-btn"
            @click="handleGradeSearchBtn"
            >检索</Button
          >
        </div>
        <div class="grade-search" v-if="resourceIds">
          <span
            class="grade-search-label"
            @click="toggleGradeSearch"
            title="基本检索"
          >
            <Icon type="logo-buffer" class="grade-search-label-icon" />
            基本检索</span
          >
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import mixin from '../mixins/index'
import CheckboxSearch from '../CheckboxItem'
import { setSearchId } from '@/utils/query-string'
import { deepClone } from '@/utils'

export default {
  name: 'GradeSearch',
  mixins: [mixin],
  components: {
    CheckboxSearch
  },
  props: {
    config: {
      field: Object,
      required: false
    },
    data: {
      field: Array,
      required: false
    }
  },
  data() {
    return {
      form: {
        searchLogic: [
          {
            logic: 'AND',
            field: '',
            keyword: ''
          },
          {
            logic: 'AND',
            field: '',
            keyword: ''
          }
        ]
      },
      activeName: '',
      selectError: false,
      inputError: false,
      logic: ['AND', 'OR', 'NOT'],
      query: {},
      resourceIds: null,
      fields: null
    }
  },
  computed: {
    ...mapState('project', ['resources']),
    isAddBtnShow() {
      return index => {
        if (
          index === this.form.searchLogic.length - 1 &&
          this.form.searchLogic.length < 5
        ) {
          return true
        }
        return false
      }
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        this.query = to.query
      },
      immediate: true
    },
    resourceId: {
      handler(nVal, oVal) {
        if (nVal !== this.resourceIds[0]) {
          this.setFields()
        }
      },
      immediate: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.initResourceIds()
    },
    initResourceIds() {
      try {
        const { resourceIds, searchLogic } = this.$attrs['queryParameter']
        if (!resourceIds || !resourceIds.length) return false
        this.resourceIds = deepClone(resourceIds)
        this.setFields()
        if (searchLogic) {
          searchLogic.map((item, index) => {
            this.form.searchLogic[index] = item
          })
          // if (searchLogic.length < 3) {
          //   let defaultField = this.fields[0].name + '-' + this.fields[0].label
          //   for (let i = 3; i > 1 - searchLogic.length; i--) {
          //     this.form.searchLogic[i - 1].field = defaultField
          //     this.form.searchLogic[i - 1].logic = this.logic[0]
          //   }
          // }
        } else {
          const {
            fields: [field],
            logic: [logic]
          } = this
          let defaultField = field.name + '-' + field.label
          this.form.searchLogic.map((item, index) => {
            item.field = defaultField
            if (!item.logic || item.logic == '') {
              item.logic = logic
            }
          })
        }
      } catch (error) {
        return false
      }
    },
    toggleGradeSearch() {
      const { resourceIds, resources } = this
      const ids =
        !resourceIds || !resourceIds.length ? resources[0].id : resourceIds
      const searchId = setSearchId({
        resourceIds: ids
      })
      this.$emit('to-base-search', {
        mode: 'base',
        searchId
      })
    },
    handleGradeSearchBtn() {
      if (this.resourceIds.length === 0)
        return this.$Message.info('请选择资源类型')
      let temp = []
      this.form.searchLogic.map((item, index) => {
        if (
          item.keyword &&
          item.keyword.trim() !== '' &&
          item.field &&
          item.logic
        ) {
          temp.push(item)
        }
      })
      if (temp.length === 0) return this.$Message.warning('请填写检索信息')
      if (temp.length < 2) return this.$Message.warning('请至少添加2条检索条件')
      const req = {
        resourceIds: this.resourceIds,
        searchLogic: temp
      }
      const searchId = setSearchId(req)
      this.$emit('advanced-search', {
        mode: 'advanced',
        searchId
      })
    },
    addFilterItems() {
      const { resourceIds, fields } = this
      let defaultField = ''
      if (resourceIds && resourceIds.length && fields && fields.length) {
        defaultField = fields[0].name + '-' + fields[0].label
      }
      this.form.searchLogic.push({
        logic: 'AND',
        field: defaultField,
        keyword: ''
      })
    },
    removeFilterItems(index) {
      if (this.form.searchLogic.length <= 1) return
      this.form.searchLogic.splice(index, 1)
    },
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
    },
    resetSearchLogic() {
      // this.resourceIds = []
      // this.$nextTick(() => {
      //   this.$refs.checkboxSearch.currentResourcesArr = []
      // })
      Vue.set(this.form, 'searchLogic', [
        {
          logic: 'AND',
          field: '',
          keyword: ''
        },
        {
          logic: 'AND',
          field: '',
          keyword: ''
        }
      ])
    },
    setFields() {
      const { resourceIds } = this
      if (!resourceIds || resourceIds.length === 0) return (this.fields = [])
      const data = deepClone(this.data)
      const fields = data.filter(item => resourceIds.includes(item.resourceId))
      let unionFields = []
      fields.map((item, index) => {
        if (index === 0) {
          unionFields = item.advancedSearchFields
        } else {
          unionFields = this.setUnion(unionFields, item.advancedSearchFields)
        }
      })
      this.fields = unionFields
      this.form.searchLogic.map(item => {
        if (item.field) {
          let flag = false
          unionFields.map(items => {
            // const str =  + '-' + items.label
            const str = item.field.split('-')[0]
            if (str === items.name) {
              flag = true
            }
          })
          if (!flag) {
            item.field = ''
          }
        }
      })
      // this.data.map(item => {
      //   if (item.resourceId === this.resourceIds[0]) {
      //     this.fields = item.advancedSearchFields
      //   }
      // })
    },
    handleChangeCheckbox(arr) {
      this.resourceIds = arr
      this.setFields()
      return
      let defaultField = this.fields[0].name + '-' + this.fields[0].label
      this.form.searchLogic.map((item, index) => {
        item.field = defaultField
        if (!item.logic || item.logic == '') {
          item.logic = this.logic[0]
        }
      })
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
    }
  }
}
</script>

<style scoped lang="scss">
.filter-item {
  padding: 8px 15px;
  border: 2px solid #dcdee2;
  border-top-width: 1px;
  border-right-width: 3px;
  .ivu-form-item {
    margin-bottom: 5px !important;
  }
  .checkbox {
    padding: 10px 0;
  }
  ::v-deep .label {
    width: 6em;
    color: var(--font);
    span {
      font-size: 14px;
    }
  }
  .grade-search-form {
    padding: 20px 0;
    border-bottom: 1px dashed var(--font);
    display: flex;
    &-content {
      flex: 1;
      max-height: 180px;
      overflow-y: auto;
      animation: animate 0.5s;
      padding-right: 10px;
      ::v-deep .ivu-select-single {
        .ivu-select-selection {
          .ivu-select-placeholder {
            text-align: center;
          }
          .ivu-select-selected-value {
            text-align: center;
            color: var(--font);
          }
        }
      }
      ::v-deep .ivu-icon {
        &.ivu-select-arrow {
          right: 0;
          transform: translateX(-50%) translateY(-50%);
          color: var(--font);
        }
      }
      @keyframes animate {
        0% {
          height: 0;
        }
        100% {
          height: 150px;
        }
      }
      .filter-items {
        margin-bottom: 5px;
        display: flex;
        flex-flow: nowrap;
        .search-select-1 {
          width: 10%;
          margin-right: 5px;
          min-width: 60px;
        }
        .search-select {
          width: 15%;
          margin-right: 5px;
          min-width: 100px;
        }
        .filter-input {
          flex: 1;
          ::v-deep .ivu-input {
            color: var(--font);
          }
        }
        .remove-btn {
          margin-left: 10px;
        }
        .add-btn {
          width: 100%;
        }
      }
    }
  }
  .grade-search-footer {
    margin-top: 15px;
    // line-height: 50px;
    text-align: center;
    &-btn {
      .reset-btn {
        width: 5%;
        transition: 0.6s;
        height: 35px;
      }
      .search-btn {
        height: 35px;
        margin-left: 8px;
        width: 20%;
        min-width: 64px;
        color: var(--theme);
        background: #fff;
        transition: 0.6s;
        font-weight: 600;
        letter-spacing: 2px;
        &:hover {
          background: var(--theme);
          color: #fff;
        }
      }
    }
    .grade-search {
      text-align: right;
      &-label {
        font-size: 15px;
        i {
          font-size: 18px;
        }
        &:hover {
          color: var(--font);
        }
      }
    }
  }
}
</style>

<style>
.form-error .ivu-input:hover,
.form-error .ivu-select-selection:hover {
  border-color: #ed4014 !important;
}
.form-error .ivu-input,
.form-error .ivu-select-selection {
  border: 1px solid #ed4014 !important;
}
.form-error .ivu-input:focus,
.form-error .ivu-select-selection:focus {
  box-shadow: 0 0 0 2px rgba(237, 64, 20, 0.2);
}
.form-error .ivu-input-icon,
.form-error .ivu-select-arrow {
  color: #ed4014 !important;
}
.filter-select,
.logic-select {
  text-align: center;
}
.ivu-select-item-selected,
.ivu-select-item-selected:hover {
  color: var(--theme);
}
.ivu-select-disabled i {
  display: none;
}
.ivu-select-disabled i::before {
  content: '';
}
.ivu-select-disabled .ivu-select-selection {
  cursor: default !important;
  background-color: #fff;
  color: #515a6e;
}
</style>
