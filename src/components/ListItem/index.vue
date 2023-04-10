<template>
  <div class="list-item">
    <Row
      class="list-header"
      type="flex"
      justify="space-between"
      v-if="listData"
      :style="{ padding }"
    >
      <Col class="list-header-left" :lg="12" :md="24">
        <span class="m-r-1 list-item-total"
          >共找到
          <span class="list-item-total-text">{{ total }}</span>
          条结果</span
        >

        <Tag
          v-if="
            checkPermission('report') &&
              enableReport &&
              listData &&
              listData.length > 0
          "
          class="list-item-tag list-item-tag-analysis"
          @click.native="toReportPage"
        >
          <Icon type="md-pie" />
          <i>分析报告</i>
        </Tag>
      </Col>
      <Col class="list-header-right" :lg="12" :md="24">
        <Page
          :current="parseInt(pageNo)"
          :total="parseInt(total)"
          @on-change="handlePageChange"
          size="small"
          :page-size="Number(pageSize)"
          show-sizer
          class="page-mini"
          @on-page-size-change="handlePageSizeChange"
          v-if="listData && listData.length > 0"
        />
      </Col>
    </Row>
    <slot name="divider">
      <div class="divider" v-if="listData && listData.length > 0" />
    </slot>
    <div class="tags-row"></div>
    <Row class="list-operation" type="flex" justify="space-between">
      <Col class="list-operation-left" :sm="12" :xs="24">
        <div class="list-operation-item flex m-r-1">
          <Checkbox
            v-model="checkbox.all"
            :disabled="listData.length === 0"
            @on-change="handleCheckAll"
            >全选</Checkbox
          >
          <div class="label m-r-1" v-if="listData.length > 0">
            已选:
            <span class="primary">
              {{ checkbox.list.length }}
            </span>
          </div>
          <div
            v-if="listData.length > 0 && checkbox.list.length > 0"
            class="text-btn label"
            title="清除"
            @click="initCheckbox"
          >
            清除
          </div>
        </div>
        <div class="list-operation-item">
          <Button
            v-if="checkPermission('export')"
            size="small"
            type="info"
            :disabled="!listData || !listData.length"
            @click="handleOperationBtnClick('export')"
            >批量导出</Button
          >
          <Button
            v-if="
              checkPermission('statistic') && listData && listData.length > 0
            "
            @click="toAnalysisPage"
            type="warning"
            size="small"
            class="m-l-1"
          >
            <Icon type="md-podium" />
            <span>结果分析</span>
          </Button>
          <Button
            v-if="
              checkPermission('statistic') && listData && listData.length > 0
            "
            @click="toReportPage"
            type="warning"
            size="small"
            class="m-l-1"
          >
            <Icon type="md-podium" />
            <span>分析报告</span>
          </Button>
        </div>
      </Col>
      <Col class="list-operation-right" :sm="12" :xs="24">
        <div class="list-operation-item"></div>
        <!-- <div class="list-operation-item sort">
          <span class="label">
            排序:
          </span>
          <ButtonGroup size="small">
            <Button type="info">
              <span>发表时间</span>
              <Icon type="md-arrow-dropdown" />
            </Button>
            <Button>M</Button>
            <Button>M</Button>
          </ButtonGroup>
        </div> -->
        <div class="list-operation-item">
          <Button
            size="small"
            icon="md-grid"
            :class="{ 'btn-active': displayMode === 0 }"
            @click="displayMode = 0"
          />
          <Button
            size="small"
            icon="md-list-box"
            :class="{ 'btn-active': displayMode === 1 }"
            @click="displayMode = 1"
          />
        </div>
      </Col>
    </Row>
    <div class="list-content-wrapper" :style="{ padding: 0 }">
      <CheckboxGroup
        v-model="checkbox.list"
        ref="checkboxGroup"
        @on-change="handleCheckboxItemChange"
      >
        <template v-if="displayMode === 1">
          <div
            v-for="(item, index) in data"
            :key="index + '_listItems'"
            class="list-items"
          >
            <div class="flex p-10 list-items-content">
              <div class="list-items-index">
                <Checkbox :label="item.id" class="v-a-t" :key="item.id">
                  <span v-show="false"></span>
                  <span>{{ index + 1 }}</span>
                </Checkbox>
              </div>
              <div class="list-items-cont">
                <div
                  v-for="(item2, index2) in rows"
                  :key="index2 + '_listItemsRow'"
                  :class="[
                    'list-row',
                    { 'list-row-flex': item2 && item2.length > 1 }
                  ]"
                >
                  <div
                    :class="[
                      'list-cell',
                      { 'cell-title': item3.orderNumber === 1 }
                    ]"
                    v-for="(item3, index3) in item2"
                    :key="index3 + '_listItemsCell'"
                  >
                    <div
                      v-if="item3.isLabelShow && item3.orderNumber !== 1"
                      :title="open('label', item3) ? item[item3.name] : ''"
                      :class="labelClassName(item3)"
                    >
                      {{ item3.label }}
                      <span v-if="item3.isValueShow && item[item3.name]"
                        >:
                      </span>
                    </div>
                    <div
                      :class="valueClassName(item3)"
                      v-if="item[item3.name] && item3.isValueShow"
                      :style="{
                        '-webkit-line-clamp':
                          item[item3.name] &&
                          item[item3.name].length > item3.maxWords
                            ? 3
                            : 0,
                        ...item3.style
                      }"
                    >
                      <span
                        :title="item[item3.name]"
                        @click="
                          item3.orderNumber === 1
                            ? toDetailPage(item.id)
                            : openDir(open('value', item3), item[item3.name])
                        "
                        v-html="
                          item3.orderNumber === 1
                            ? `` +
                              `<span class='cell-value-text'>${
                                item[item3.name]
                              }</span>`
                            : `<span class='cell-value-text'>${
                                item[item3.name]
                              }</span>`
                        "
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="list-items-bottom">
              <Button
                size="small"
                class="btn-active"
                icon="md-book"
                @click="toDetailPage(item.id)"
                title="查看详情"
              />
            </div>
          </div>
        </template>
        <template v-else>
          <Table
            :data="data"
            :columns="tableCloumns"
            border
            stripe
            class="m-t-1 table"
          />
        </template>
      </CheckboxGroup>
    </div>
    <div
      v-if="listData && listData.length > 0"
      class="list-footer"
      :style="{ padding: padding }"
    >
      <div class="list-footer-left">
        <span class="list-item-total"
          >共找到
          <span class="list-item-total-text">{{ total }}</span>
          条结果</span
        >
        <Button
          v-if="checkPermission('statistic') && listData && listData.length > 0"
          @click.native="toAnalysisPage"
          type="warning"
          size="small"
        >
          <Icon type="md-podium" size="16" />
          <span>结果分析</span>
        </Button>
        <Tag
          v-if="
            checkPermission('report') &&
              enableReport &&
              listData &&
              listData.length > 0
          "
          class="list-item-tag list-item-tag-analysis"
          @click.native="toReportPage"
        >
          <Icon type="md-pie" size="16" />
          <i>分析报告</i>
        </Tag>
      </div>
      <Page
        :current="parseInt(pageNo)"
        :total="parseInt(total)"
        :page-size="Number(pageSize)"
        show-sizer
        show-elevator
        class="list-footer-page page-mini"
        @on-change="handlePageChange"
        @on-page-size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { eventBus } from '@/main'
import { sortBy } from '@/utils/utils'
import projectMixin from '@/mixins/project'
import { mapState } from 'vuex'
import routerMixin from '@/mixins/router'
import { deepClone } from '@/utils'

export default {
  name: 'ListItem',
  mixins: [projectMixin, routerMixin],
  props: {
    data: {
      type: Array,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
    total: {
      type: String,
      required: true
    },
    pageNo: {
      type: Number | String,
      required: true
    },
    pageSize: {
      type: Number | String,
      required: true
    },
    resourceId: {
      type: String | Number,
      required: true
    },
    padding: String,
    operation: {
      type: Array,
      default: () => ['sort', 'export', 'statistic']
    }
  },
  data() {
    return {
      listData: null,
      query: {},
      rows: [],
      checkbox: {
        all: false,
        list: []
      },
      displayMode: 1, //展示形式 0-表格 1-列表
      tableCloumns: [],
      baseCloumns: [
        {
          title: ' ',
          key: 'id',
          width: 100,
          render: (h, params) => {
            // return h('div', params.index + 1)
            return h('div', [
              h(
                'Checkbox',
                {
                  props: { label: params.row.id, size: 'small' }
                },
                params.index + 1
              )
            ])
          }
        },
        {
          title: '操作',
          key: 'operation',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h(
              'div',
              {
                domProps: {
                  className: 'flex justify-c'
                }
              },
              [
                this.checkPermission('delete')
                  ? h(
                      'Button',
                      {
                        props: {
                          size: 'small',
                          type: 'error'
                        },
                        domProps: {
                          title: '删除'
                        },
                        style: {
                          'margin-right': '5px'
                        },
                        on: {
                          click: () => {
                            this.$emit('on-delete', [params.row.id])
                          }
                        }
                      },
                      [h('Icon', { props: { type: 'md-trash' }, size: 16 })]
                    )
                  : '',
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    domProps: {
                      title: '查看详情'
                    },
                    style: {
                      color: 'var(--theme)',
                      'background-color': '#fff',
                      'border-color': 'var(--theme)'
                    },
                    on: {
                      click: () => {
                        this.toDetailPage(params.row.id)
                      }
                    }
                  },
                  [h('Icon', { props: { type: 'md-book' }, size: 16 })]
                )
              ]
            )
          }
        }
      ]
    }
  },
  computed: {
    ...mapState('project', ['resources']),
    ...mapGetters('permission', ['enableReport']),
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
            'cell-value-open': item.isValueShow && item.isOpen
          }
        ]
      }
    },
    typeLabel() {
      let name = ''
      this.resources.map(items => {
        if (items.id === this.resourceId) {
          name = items.name
        }
      })
      return name
    },
    checkPermission() {
      return value => {
        const { operation } = this
        return operation.includes(value)
      }
    }
  },
  watch: {
    data: {
      handler(nVal, oVal) {
        if (!nVal) return
        this.initData()
        this.listData = this.data
          ? this.data.map(item => {
              return {
                ...item,
                isOpened: false
              }
            })
          : null
        this.query = this.$route.query
      },
      immediate: true
    },
    resourceId: {
      handler(n) {
        this.initCheckbox()
      },
      immediate: true
    }
  },
  methods: {
    initCheckbox(type = 1) {
      if (type === 2) {
        const {
          data,
          checkbox: { list }
        } = this
        const current = data.filter(item => list.includes(item.id))
        this.checkbox.all =
          data.length !== 0 && current.length === data.length ? true : false
        return
      }
      this.checkbox.all = false
      this.checkbox.list = []
    },
    initData() {
      this.initCheckbox(2)
      this.setTableColumns()
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
    },
    setTableColumns() {
      const { fields, baseCloumns } = this
      const columns = fields
        .filter(item => item.orderNumber <= 2)
        .sort(sortBy('orderNumber', 1))
        .splice(0, 3)
        .map(item => {
          const { name: key, label: title, orderNumber: order } = item
          return {
            title,
            key,
            ellipsis: true,
            minWidth: order === 1 ? 300 : 50,
            render: (h, params) => {
              const content = params.row[key]
              const [field] = this.fields.filter(item => item.name === key)
              const isTitle = field && field.orderNumber === 1
              return h(
                'span',
                {
                  domProps: {
                    title: content,
                    className: isTitle ? 'cursor hover' : ''
                  },
                  on: {
                    click: () => {
                      if (!isTitle) return
                      this.toDetailPage(params.row.id)
                    }
                  }
                },
                content
              )
            }
          }
        })
      this.tableCloumns = deepClone(baseCloumns)
      this.tableCloumns.splice(1, 0, ...columns)
    },
    openDir(isOpen, url) {
      if (!isOpen) return
      window.open(url, '_blank')
    },
    handleDownloadBtn() {
      eventBus.$emit('on-handle-modal', {
        num: this.total,
        ...this.$route.query
      })
    },
    handleDisplayBtn(index) {
      this.listData[index].isOpened = !this.listData[index].isOpened
    },
    handleCheckAll(value) {
      const {
        data,
        checkbox: { list }
      } = this
      if (!value) {
        this.data.map(item => {
          const i = list.indexOf(item.id)
          if (i !== -1) {
            this.checkbox.list.splice(i, 1)
          }
        })
        return
      }
      const nData = data
        .filter(item => list.indexOf(item.id) === -1)
        .map(item => item.id)
      list.push(...nData)
      this.checkbox.list = list
    },
    handleCheckboxItemChange() {
      const { childrens } = this.$refs.checkboxGroup
      let flag = true
      childrens.map(item => {
        if (!item.currentValue) return (flag = false)
      })

      this.checkbox.all = flag
    },
    handleClearCheckedList() {
      this.checkbox.all = false
      this.checkbox.list = []
    },
    handleOperationBtnClick(type) {
      const { list } = this.checkbox
      console.log('l', list)
      if (list.length === 0) {
        this.$Message['warning']({
          background: true,
          content: '您还未选择要操作的数据'
        })
        return
      }
      const content = '是否导出当前选中的数据'
      this.$Modal.confirm({
        title: '提示',
        content,
        loading: true,
        'lock-scroll': true,
        onOk: () => {
          this.$Modal.remove()
          this.$emit(`on-${type}`, list)
        }
      })
    },
    toDetailPage(id) {
      this.openInNewTab({
        name: 'Detail',
        params: {
          resourceId: this.resourceId,
          id
        }
      })
    },
    toAnalysisPage() {
      this.$emit('on-click-analysis-btn')
    },
    toReportPage() {
      this.$emit('on-click-report-btn')
    },
    handlePageChange(page) {
      this.$emit('on-page-change', page)
    },
    handlePageSizeChange(size) {
      this.initCheckbox()
      this.$emit('on-page-size-change', size)
    }
  }
}
</script>

<style scoped lang="scss">
.list-item {
  .list-footer {
    font-weight: 600;
    line-height: 65px;
    min-height: 65px;
    background: #fff;
    display: flex;
    flex-flow: wrap;
    flex-wrap: wrap-reverse;
    justify-content: space-between;
  }
  .list-header {
    background: #fff;
    font-weight: 600;
    padding: 20px 0 !important;
    &-left {
      display: flex;
      align-items: center;
    }
    &-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .list-operation {
    align-items: center;
    line-height: 40px;
    background: #f6f8fa;
    border: 1px solid #e0e5ed;
    padding: 0 15px;
    &-left,
    &-right {
      display: flex;
      align-items: center;
    }
    &-right {
      justify-content: flex-end;
    }
    @media screen and (max-width: 567px) {
      .list-operation-left,
      .list-operation-right {
        justify-content: space-between;
      }
    }
    .label {
      font-size: 14px;
      color: var(--font);
      margin-right: 10px;
    }
    &-item {
      &.sort {
        flex-shrink: 0;
        margin-right: 30px;
      }
    }
  }
  .list-footer {
    &-left {
    }
    &-page {
    }
  }
  .page-mini {
    font-weight: normal;
  }
  .tags-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  &-tag {
    line-height: 30px;
    height: 30px;
    text-align: center;
    font-size: 14px;
    padding: 0 12px;
    margin-right: 12px;
    cursor: pointer;
    &-analysis {
      i {
        vertical-align: middle;
        font-style: normal;
      }
    }
  }
  &-total {
    vertical-align: middle;
    margin-right: 16px;
    font-size: 14px;
    color: #000;
    &-text {
      font-weight: 600;
      color: var(--theme);
      font-size: 15px;
    }
  }
  .list-content-wrapper {
    margin-top: 15px;
    @media screen and (max-width: 1200px) {
      & {
        padding-left: 0px !important;
        padding-right: 0px !important;
        .list-items {
          padding-left: 5px !important;
          padding-right: 5px !important;
        }
      }
    }
    .list-items {
      border: 1px solid #e0e5ed;
      display: flex;
      width: 100%;
      margin-bottom: 5px;
      transition: background 0.6s;
      &:hover {
        background: #f6f8fa;
      }
      &-index {
        width: 50px;
        flex-shrink: 0;
        padding-top: 3px;
        color: var(--font-d);
        font-size: 16px;
      }
      &-cont {
        flex: 1;
        .list-row {
          &-flex {
            display: flex;
            flex-flow: wrap;
            .list-cell {
              margin-right: 15px;
              &:last-child {
                margin-right: 0;
              }
            }
          }
          .list-cell {
            font-size: 15px;
            display: flex;
            flex-flow: wrap;
            margin-bottom: 5px;
            &.cell-title {
              line-height: 28px;
              font-size: 18px;
              font-weight: 500;
              color: var(--theme);
              span {
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                }
              }

              .cell-value-text {
                color: var(--font);
                transition: 0.6s;
                :hover {
                  color: var(--list-actived);
                }
              }
            }
            .cell-label {
              font-size: 14px;
              font-weight: 600;
              padding-right: 4px;
              color: rgb(63, 62, 62);
              flex-shrink: 0;
            }
            .cell-value {
              word-break: break-all;
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              flex: 1;
              &-text {
                font-size: 15px;
              }
              &-open {
              }
            }
          }
        }
      }
      .list-items-content {
        flex: 1;
        padding: 8px 16px;
      }
      .list-items-bottom {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--list-label);
        width: 100px;
        flex-shrink: 0;
        background: #f7f9f8;
        padding: 10px;
        border-left: 1px solid #e7e7e7;
      }
    }
    .divider {
      width: 100%;
      border-bottom: 1px solid #d8e1e5;
      margin-bottom: 5px;
    }
    .table {
      ::v-deep .ivu-table {
        color: var(--font) !important;
      }
    }
  }
  ::v-deep .btn-items {
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
    color: var(--font);
    display: flex;
    padding: 5px 10px;
    background: #efefef;
    opacity: 0.8;
    transition: 0.8s;
    align-items: center;
    &.delete {
    }
    &:hover {
      opacity: 1;
    }
    i {
      vertical-align: middle;
      font-size: 16px;
      &:last-child {
        margin-left: 3px;
      }
    }
  }
  ::v-deep {
    .ivu-checkbox-checked {
      .ivu-checkbox-inner {
        opacity: 0.8;
      }
    }
    .ivu-checkbox-wrapper-checked,
    .ivu-checkbox-wrapper * {
      font-weight: 600;
      color: #000;
    }
  }
}
</style>
