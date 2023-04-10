<template>
  <div class="analysis-table-item" id="table-wrapper">
    <Table
      stripe
      :columns="columData"
      :data="tableData"
      @on-selection-change="handleSelectionChange"
    />
    <Table
      v-show="false"
      stripe
      ref="tableItem"
      :columns="columData"
      :data="selectionLength"
    />
    <Table
      v-show="false"
      stripe
      ref="tableItem2"
      :columns="columData"
      :data="dataList"
    />
    <div class="analysis-table-item-footer">
      <div
        class="page"
        style="float: right"
        v-if="data && data.length > perNum"
      >
        <Page
          :total="total"
          :current="current"
          @on-change="changePage"
          show-elevator
          show-total
        ></Page>
      </div>
      <div class="number" style="float: left" v-if="selectionLength.length > 0">
        <span
          >当前选中
          <span style="font-weight: 600">{{ selectionLength.length }}</span>
          条记录</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableItem',
  props: {
    data: Array,
    field: Object,
    hideSelection: Boolean
  },
  data() {
    return {
      tableData: [],
      columData: [],
      current: 1,
      perNum: 10,
      currentSelection: {},
      selectionLength: [],
      dataList: []
    }
  },
  watch: {
    hideSelection(nVal) {
      this.initData()
    }
  },
  computed: {
    total() {
      return this.data ? this.data.length : 0
    }
  },
  mounted() {},
  methods: {
    initData() {
      const { hideSelection } = this
      const columData = []
      if (!hideSelection)
        columData.push({
          type: 'selection',
          width: 60,
          align: 'center'
        })
      this.columData = [
        ...columData,
        {
          title: '序号',
          key: 'i',
          align: 'center',
          width: 80
        },
        {
          title: this.field.label,
          align: 'center',
          key: 'name',
          renderHeader: (h, index) => {
            return h('span', {}, '字段: ' + this.field.label)
          },
          render: (h, params) => {
            const { name } = params.row
            return h(
              'span',
              {
                domProps: {
                  title: `${name}`
                },
                class: 'table-item-field',
                style: {
                  color: 'var(--theme)',
                  fontWeight: 400,
                  'text-decoration': 'underline',
                  cursor: 'text'
                },
                on: {
                  click: () => {
                    this.$emit('on-click', params.row)
                  }
                }
              },
              name
            )
          }
        },
        {
          title: '记录数',
          key: 'value',
          width: 200
        },
        {
          title: '占比(%)',
          key: 'rate',
          width: 200
        }
      ]
      let t = this.data.map((item, index) => {
        return {
          i: index + 1,
          name: item.key,
          value: item.value,
          rate: item.rate,
          id: item.id
        }
      })
      this.dataList = t
      if (this.data.length > this.perNum) {
        this.tableData = t.slice(
          this.perNum * (this.current - 1),
          this.current * this.perNum
        )
        return
      }
      this.tableData = t
    },
    changePage(page) {
      this.current = page
      document.getElementById('table-wrapper').scrollIntoView()
      this.initData()
    },
    handleSelectionChange(selection) {
      this.currentSelection[this.current] = selection
      let keys = Object.keys(this.currentSelection).sort()
      let t = []
      keys.map(item => {
        if (this.currentSelection[item].length > 0) {
          t.push(...this.currentSelection[item])
        }
      })
      this.selectionLength = t
      this.$emit('on-get-selection', t)
    },
    exportData(type) {
      let name = type == 1 ? 'tableItem' : 'tableItem2'
      this.$refs[name].exportCsv({
        filename: ''
      })
      this.selectionLength = []
      this.currentSelection = {}
      this.initData()
    }
  }
}
</script>

<style scoped>
.analysis-table-item {
  min-height: 569px;
  padding: 5px 10px;
}
.analysis-table-item >>> .ivu-table {
  font-size: 16px;
  color: var(--font);
  border: 1px solid #e8eaec;
  border-bottom: none;
}
.analysis-table-item >>> .ivu-table-header th span {
  font-weight: normal;
}
.analysis-table-item >>> .ivu-table-overflowX {
  overflow: hidden;
}
.analysis-table-item >>> .table-item-field:hover {
  /* cursor: pointer; */
  text-decoration: underline;
}
.analysis-table-item >>> .ivu-page-options-elevator {
  vertical-align: baseline;
}
.analysis-table-item-footer {
  margin: 10px;
  overflow: hidden;
  line-height: 40px;
}
.analysis-table-item-footer >>> .ivu-page-prev,
.analysis-table-item-footer >>> .ivu-page-next,
.analysis-table-item-footer >>> .ivu-page-item-jump-prev,
.analysis-table-item-footer >>> .ivu-page-item-jump-next,
.analysis-table-item-footer >>> .ivu-page-item,
.analysis-table-item-footer >>> .ivu-page-options-elevator input,
.analysis-table-item-footer >>> .ivu-page-options,
.analysis-table-item-footer >>> .ivu-page-options-elevator {
  height: 32px;
  line-height: 30px;
}
.analysis-table-item-footer >>> .ivu-page-item {
  min-width: 25px !important;
}
.analysis-table-item-footer >>> .ivu-page-total {
  height: 32px;
  line-height: 32px;
  margin-right: 10px;
}
.analysis-table-item-footer >>> .ivu-page {
  display: flex;
  font-size: 14px !important;
}
.number {
  height: 32px;
  line-height: 32px;
  font-size: 14px;
}
</style>
