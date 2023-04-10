<template>
  <div class="analysis-detail">
    <Spin size="large" fix v-if="loading" />
    <template v-if="!isError">
      <div class="result-box row">
        <div class="result-box-header chart-box-header">
          <span class="result-box-header-left">
            <Select v-model="tableConfig.orderType" class="order-btn">
              <span slot="prefix" size="small">
                <img :src="svg" class="svg" />
                <span class="prefix-text">
                  排序
                </span>
              </span>
              <Option
                v-for="item in orderOptions"
                :value="item.value"
                :key="item.value"
              >
                {{ item.label }}</Option
              >
            </Select>
          </span>
          <div class="result-box-header-right">
            <div class="result-box-header-right-content">
              <RadioGroup v-model="tableConfig.downloadType" vertical>
                <Radio label="1">
                  <Icon type="social-apple"></Icon>
                  <span>当前选中的记录</span>
                </Radio>
                <Radio label="2">
                  <Icon type="social-android"></Icon>
                  <span>全部记录</span>
                </Radio>
              </RadioGroup>
            </div>
            <Button
              type="primary"
              style="margin-left: 0.5em"
              @click="handleDownloadResultBtn"
              :disabled="loading"
              title="下载数据表"
              ><Icon type="md-download" size="15" />下载数据表</Button
            >
          </div>
        </div>
        <div class="result-box-content">
          <div class="chart-wrap">
            <div class="title" v-show="downloading">
              {{ field.label + ' - 表格' }}
            </div>
            <table-item
              :data="tableData"
              v-if="tableData"
              :hideSelection="downloading"
              ref="tableItem"
              :field="field"
              @on-click="
                data => {
                  this.$emit('on-search', data)
                }
              "
              @on-get-selection="getSelection"
            />
          </div>
        </div>
      </div>
      <div class="chart-box">
        <div class="chart-box-content">
          <template v-for="(item, index) in chartList">
            <div class="row line-chart" :key="item.name" v-if="!item.disabled">
              <div class="chart-box-header">
                <div class="chart-box-header-select">
                  <Select
                    v-if="item.currentNum !== undefined"
                    v-model="item.currentNum"
                    class="analysis-select analysis-select-display"
                    @on-change="handleCurrentNumChange(index)"
                  >
                    <span slot="prefix" size="small"
                      ><Icon type="logo-buffer" size="16" class="v-a-m" />
                      <span class="v-a-m prefix-text">显示结果数</span>
                    </span>
                    <Option
                      v-for="item in numOptions"
                      :value="item.value"
                      :key="item.value + 'numOptions'"
                      >{{ item.label }}</Option
                    >
                  </Select>
                  <Select
                    v-if="item.currentDisplay !== undefined"
                    v-model="item.currentDisplay"
                    class="analysis-select analysis-select-display2"
                    @on-change="handleCurrentDisplayChange(item.name)"
                  >
                    <span slot="prefix" size="small"
                      ><Icon
                        size="16"
                        class="v-a-m"
                        :type="currentDisplayIcon(item.currentDisplay)"
                      />
                      <span class="v-a-m prefix-text">显示</span>
                    </span>
                    <Option
                      v-for="item in displayOptions"
                      :value="item.value"
                      :key="item.value + 'displayOptions'"
                      >{{ item.label }}</Option
                    >
                  </Select>
                </div>
                <div class="chart-box-header-btn">
                  <Button
                    type="primary"
                    class="analysis-btn download-btn"
                    :disabled="loading"
                    title="下载为图片"
                    ><Icon type="md-download" size="15" />
                    <span style="padding-left: 2em"></span>
                    <a :download="item.name" :href="item.currentImgUrl">下载</a>
                  </Button>
                  <Button
                    v-if="!item.resetDisable"
                    type="primary"
                    class="analysis-btn"
                    @click="handleResetBtn(item.name)"
                    title="还原图表"
                    ><Icon type="md-refresh"
                  /></Button>
                </div>
              </div>
              <div class="chart-wrap">
                <div class="title" v-show="downloading">
                  {{ field.label + ' - ' }}{{ item.cnName }}
                </div>
                <component
                  :is="item.name"
                  theme="shine"
                  :ref="item.name"
                  :name="item.name"
                  :data="item.data"
                  class="chart"
                  :display="
                    item.currentDisplay !== undefined
                      ? item.currentDisplay
                      : undefined
                  "
                  :showMsg="
                    field && field.name && field.name === 'organization'
                  "
                  v-if="orginalData"
                  @on-echarts-loaded="
                    info => {
                      getImgUrl(info, index)
                    }
                  "
                  :style="item.style"
                  @on-click="handleChartClick"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
    <template v-if="isError">
      <error-item class="error-item" height="calc(100vh -180px)">
        <p slot="text">暂无分析结果</p>
        <span slot="button"></span>
      </error-item>
    </template>
  </div>
</template>

<script>
import projectMixin from '@/mixins/project'

import { sortBy } from '@/utils/utils'
import { deepClone } from '@/utils'

import ErrorItem from '@/components/ErrorItem'

import TreeMap from './components/TreeMap.vue'
import BarChart from './components/BarEcharts.vue'
import TableItem from './components/TableItem.vue'
import PieChart from './components/PieChart.vue'
import LineChart from './components/LineChart.vue'

import ascSvg from '@/assets/images/svg/asc.svg'
import descSvg from '@/assets/images/svg/desc.svg'

const orderOptions = [
  {
    label: '倒序',
    value: -1
  },
  {
    label: '正序',
    value: 1
  }
]
const displayOptions = [
  {
    label: '垂直',
    value: 'vertical',
    icon: 'md-stats'
  },
  {
    label: '水平',
    value: 'horizontal',
    icon: 'md-list'
  }
]
const chartList = [
  {
    name: 'TreeMap',
    cnName: '树状图',
    currentNum: '',
    currentImgUrl: '',
    currentImgName: '',
    style: {},
    disabled: false
  },
  {
    name: 'BarChart',
    cnName: '柱状图',
    currentDisplay: 'vertical',
    currentNum: '',
    currentImgUrl: '',
    currentImgName: '',
    style: {
      padding: '8px'
    }
  },
  {
    name: 'LineChart',
    cnName: '折线图',
    currentNum: '',
    currentImgUrl: '',
    currentImgName: '',
    style: {
      padding: '8px'
    },
    resetDisable: true
  },
  {
    name: 'PieChart',
    cnName: '饼图',
    currentNum: '',
    currentImgUrl: '',
    currentImgName: '',
    style: {
      padding: '8px'
    },
    resetDisable: true
  }
]

const tableConfig = {
  orderType: -1,
  downloadType: '1',
  selection: []
}

export default {
  mixins: [projectMixin],
  components: {
    TreeMap,
    BarChart,
    TableItem,
    ErrorItem,
    PieChart,
    LineChart
  },
  props: {
    field: {
      type: Object,
      required: true
    },
    query: {
      type: Object,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    downloading: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      ascSvg,
      descSvg,
      orderOptions,
      displayOptions,
      chartList: [],
      tableConfig,
      orginalData: '',
      tableData: null,
      numOptions: [],
      currentTableSelection: [],
      currentImgUrl: '',
      currentImgName: '',
      isError: false,
      treeMapHide: false
    }
  },

  computed: {
    svg() {
      return this.currentOrderType === -1 ? descSvg : ascSvg
    },
    currentDisplayIcon() {
      return display => {
        let t = ''
        this.displayOptions.map(item => {
          if (item.value === display) {
            t = item.icon
          }
        })
        return t
      }
    }
  },
  watch: {
    field: {
      handler(n) {
        // this.getAnalysisResult()
      },
      deep: true
    },
    'tableConfig.orderType': {
      handler(n) {
        this.tableData = this.tableData.sort(sortBy('value', n))
        this.$nextTick(() => {
          this.$refs.tableItem.current = 1
          this.$refs.tableItem.initData()
        })
      }
    },
    data: {
      handler(n) {
        this.init()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // this.init()
  },
  methods: {
    init() {
      this.tableConfig = deepClone(tableConfig)
      this.chartList = deepClone(chartList)
      this.isError = false
      if (!this.data.length) {
        this.isError = true
        this.orginalData = []
        return
      }
      this.setCharts()
    },
    //设置图表
    setCharts() {
      const { data } = this
      console.log('data', data)
      // if (!data.length) return (this.isError = true)
      const { chartList, currentOrderType } = this
      const valueArr = []
      let t = data.map(item => {
        if (parseInt(item.value) > 0) {
          valueArr.push(item)
        }
        return {
          key: item.key,
          value: parseInt(item.value),
          rate: item.rate,
          id: item.id ? item.id : undefined
        }
      })
      this.chartList[0].disabled = valueArr.length ? false : true
      this.tableData = t.sort(sortBy('value', currentOrderType))
      this.orginalData = t.map(item => {
        return {
          name: item.key,
          value: item.value,
          id: item.id ? item.id : undefined
        }
      })
      this.initNumOption(t)
      const [currentNum] = this.numOptions
      this.chartList = chartList.map(item => {
        return {
          ...item,
          data:
            item.currentNum !== undefined
              ? this.orginalData.slice(0, currentNum.value)
              : this.orginalData,
          currentNum:
            item.currentNum !== undefined ? currentNum.value : undefined
        }
      })
      this.$nextTick(() => {
        this.chartList.map(item => {
          if (!item.disabled) {
            this.$refs[item.name][0].init()
          }
        })
        this.$refs.tableItem.current = 1
        this.$refs.tableItem.initData()
      })
    },
    handleCurrentNumChange(index) {
      const { name, currentNum: num } = this.chartList[index]
      this.chartList[index].data = this.orginalData.slice(0, num)
      this.$nextTick(() => {
        this.$refs[name][0].init()
      })
    },
    //获取图表的下载地址和名称
    getImgUrl({ url, name }, index) {
      this.chartList[index].currentImgUrl = url
      this.chartList[index].currentImgName = name + '.png'
    },
    //初始化结果数下拉框数据
    initNumOption(data) {
      let min = Math.floor(data.length / 10)
      let max = Math.ceil(data.length / 10)
      let t = []
      if (data.length > 10) {
        min = max === min ? min - 1 : min
        for (let i = 1; i <= min; i++) {
          t.push({
            value: i * 10,
            label: i * 10
          })
        }
      }
      t.push({
        value: data.length,
        label: '全部'
      })
      this.numOptions = t
    },
    //还原图表位置
    handleResetBtn(name) {
      this.$nextTick(() => {
        this.$refs[name][0].drawEcharts()
      })
    },
    //下载表格数据
    handleDownloadResultBtn() {
      const { selection, downloadType } = this.tableConfig
      if (selection && selection.length == 0 && downloadType == 1) {
        this.$Message.warning('请选择要下载的记录')
        return
      }
      this.$nextTick(() => {
        this.$refs.tableItem.exportData(downloadType)
      })
    },
    getSelection(selection) {
      this.tableConfig.selection = selection
    },
    handleCurrentDisplayChange(name) {
      this.$nextTick(() => {
        this.$refs[name][0].init()
      })
    },
    handleChartClick(data) {
      this.$emit('on-search-organziation', data)
    }
  }
}
</script>

<style scoped lang="scss">
.analysis-detail {
  margin-left: 10px;
  .chart-wrap {
    .title {
      font-size: 16px;
      text-align: center;
      color: #000;
    }
  }
  .error-item {
    ::v-deep .error-box {
      width: 100%;
      border-radius: 0;
    }
  }
  .row {
    background: #fff;
    box-shadow: 0 1px 1px 1px rgb(210 210 210 / 90%);
    border-radius: 5px;
    margin: 5px 0 25px 0;
  }
  .chart-box-header {
    padding: 8px 6px;
    border-bottom: 1px solid #e8eaec;
    margin-bottom: 5px;
  }
  .chart-box {
    &-content {
      .row {
        .chart-box-header {
          &-select {
            &-display {
            }
          }
          &-btn {
            .analysis-btn {
            }
            .download-btn {
            }
          }
        }
        &.tree-map {
        }
        &.line-chart {
        }
        .chart {
          // height: 480px;
          // border: 1px solid #e8eaec;
          // background: #f5f6f7;
        }
      }
      .bubble-chart {
        padding: 10px;
      }
    }
  }
  .result-box {
    &-header {
      &-left {
      }
      &-right {
      }
    }
    &-content {
      padding-bottom: 10px;
    }
  }
}
</style>

<style scoped>
.chart-box-content {
}
.analysis-detail {
  position: relative;
}
.analysis-detail >>> .ivu-select-dropdown {
  text-align: right;
}
.loading-box {
  position: relative;
  min-height: 480px;
  width: 100%;
}
.result-box {
  margin-top: 20px;
}

.chart-box-header >>> .ivu-select-prefix,
.analysis-select >>> .ivu-icon,
.chart-box-header >>> .ivu-select-placeholder,
.chart-box-header >>> .ivu-select-selected-value {
  font-weight: 400;
  line-height: 30px;
}
.chart-box-header >>> .ivu-select-selected-value {
}
.svg {
  height: 16px;
  vertical-align: middle;
}
.chart-box-header >>> .ivu-select-prefix {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chart-box-header >>> .ivu-select-selection {
  border: 1px solid #000;
}

.chart-box-header >>> .ivu-select-visible .ivu-select-selection {
  box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;
}

/* 图表模块-头部 */
.chart-box-header {
  display: flex;
  justify-content: space-between;
}
.chart-box-header-select {
  width: 80%;
  display: flex;
}
.chart-box-header-btn {
  width: 20%;
  display: flex;
  justify-content: flex-end;
}
/* 下拉框、按钮 */
.analysis-select {
  margin-right: 5px;
  margin-bottom: 5px;
  width: 30%;
  min-width: 180px;
}
.analysis-select-display {
  width: 20%;
  min-width: 170px;
}
.analysis-select-display2 {
  width: 20%;
  min-width: 120px;
}
.analysis-btn {
  position: relative;
  margin-left: 5px;
  margin-bottom: 5px;
}
.download-btn {
  margin-left: 0;
}
.download-btn a {
  color: #fff !important;
  position: absolute;
  right: -0.2rem;
  width: 100%;
}

.result-box-header >>> .ivu-radio-group-vertical .ivu-radio-wrapper {
  height: 20px;
  line-height: 20px;
  font-weight: 500;
}
.result-box-footer {
  text-align: right;
  padding: 0 40px;
  margin-top: 15px;
}
.analysis-detail >>> .ivu-btn-primary {
  background-color: var(--theme);
  border-color: var(--theme);
}
.analysis-detail >>> .ivu-radio-checked .ivu-radio-inner {
  border-color: var(--theme);
}
.analysis-detail >>> .ivu-radio-inner:after {
  background-color: var(--theme);
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

.order-btn {
  width: auto;
}

.result-box-header-right {
  float: right;
  height: 35px;
}
.result-box-header-right-content {
  display: inline-block;
  margin-left: 14px;
}
</style>
