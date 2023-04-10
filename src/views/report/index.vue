<template>
  <div
    class="page"
    v-wechat-title="`分析报告 - ${logoOfGetter.titleCn}`"
    id="report"
  >
    <!-- <banner-item
      v-if="currentSearchMode && queryParameter"
      :data="
        currentSearchMode === 'advanced'
          ? advancedSearchConfig
          : baseSearchConfig
      "
      :gradeSearch="false"
      :queryParameter="queryParameter"
    /> -->
    <div class="page-wrapper">
      <div class="page-header">
        <breadcrumb :showLabel="true" :data="breadcrumb" />
      </div>
      <div class="page-content">
        <Spin fix v-if="isLoading" />
        <div class="page-content-left">
          <Affix :offset-top="135">
            <!-- <div class="report-search-info" v-if="queryParameter">
              <items-header :data="'当前检索信息'" :itemStyle="style.header" />
              <search-tags
                class="search-tags"
                tagColor="primary"
                tagType="border"
                @on-delete-tag="handleDeleteTag"
                :queryParameter="queryParameter"
                :refine="[]"
              />
            </div> -->
            <items-header
              :data="'目录'"
              :itemStyle="style.header"
              icon="md-list"
            />
            <tree-menu :data="navData" class="p-t-10" @on-click="onClickNode" />
          </Affix>
        </div>
        <div
          class="page-content-right"
          :style="{ background: currentTheme.bg }"
        >
          <Spin fix v-if="isLoading" />
          <component
            :is="USER_AGENT === 'mobile' ? 'Affix' : 'div'"
            :offset-top="65"
          >
            <div class="page-content-right-affix">
              <div class="search-tabs">
                <result-tabs
                  @on-click-tabs="handleClickTabs"
                  :active="currentResourceId"
                  :resourceIds="resourceIds"
                  :query="query"
                  v-if="resourceIds"
                />
              </div>
              <div class="row-2">
                <hamburger
                  @toggleClick="toggleDrawer"
                  :isActive="isOpen"
                  style="display: none"
                  class="page-drawer"
                />
                <Button
                  shape="circle"
                  type="success"
                  class="m-l-10"
                  :title="!chartInfo.isReady ? '图表加载中' : '下载报告'"
                  :disabled="!chartInfo.isReady"
                  @click="handleDownloadPdf"
                  ><Icon type="md-download" /><span>下载报告</span></Button
                >
                <!-- <Button
                  shape="circle"
                  type="success"
                  class="m-l-10"
                  @click="createWord(test)"
                  ><Icon type="md-download" /><span>doc</span></Button
                > -->
                <theme-item
                  v-if="navData.length > 0"
                  :themes="themes"
                  :theme="currentTheme.name"
                  @on-change-theme="changeTheme"
                />
              </div>
            </div>
          </component>
          <echarts-item
            :data="navData"
            :theme="currentTheme.name"
            v-if="!isLoading"
          />
        </div>
      </div>
    </div>
    <Drawer
      v-model="drawerMenuValue"
      :closable="true"
      placement="left"
      class-name="list-drawer-class report"
    >
      <div
        class="report-search-info"
        v-if="queryParameter && Object.keys(queryParameter).length !== 0"
      >
        <items-header data="当前检索信息" />
        <search-tags
          class="search-tags"
          tagColor="primary"
          tagType="border"
          @on-delete-tag="handleDeleteTag"
          :queryParameter="queryParameter"
          :refine="[]"
        />
      </div>
      <items-header data="目录" icon="md-list" />
      <tree-menu :data="navData" @on-click="onClickNode" />
    </Drawer>
  </div>
</template>

<script>
// import Vue from 'vue'
import { mapGetters } from 'vuex'
import { eventBus } from '@/main'

import projectMixin from '@/mixins/project'
import searchMixin from '@/mixins/search'
import exportDocMixin from '@/mixins/exportDoc'

import { reportMenu, reportResult } from '@/api/report'

import { deepClone } from '@/utils'

import Breadcrumb from '@/components/Breadcrumb'
import BannerItem from '@/components/BannerItem'
import Hamburger from '@/components/Hamburger'
import SearchTags from '@/components/SearchTags'
import ItemsHeader from '@/components/ItemsHeader'
import ResultTabs from '@/components/ResultTabs'
import SearchDefaultItem from '@/components/DefaultItem'

import SelectItem from './components/SelectItem.vue'
import AnchorItem from './components/AnchorItem.vue'
import ThemeItem from './components/ThemeItem.vue'
import EchartsItem from './components/EchartsItem.vue'
import TreeMenu from './components/TreeMenu.vue'

const test = {
  companyDescription:
    '<w:p><w:pPr><w:rPr><w:color w:val="FF0000"/></w:rPr></w:pPr><w:r><w:rPr><w:color w:val="FF0000"/></w:rPr><w:t>My custom</w:t></w:r><w:r><w:rPr><w:color w:val="00FF00"/></w:rPr><w:t>XML</w:t></w:r></w:p>',
  img:
    'data:image/svg;base64,PHN2ZyBoZWlnaHQ9IjEwMCIgd2lkdGg9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0icmVkIi8+PC9zdmc+IA=='
}

const breadcrumb = [
  {
    path: '/',
    name: '首页'
  },
  {
    path: '/report/base',
    name: '分析报告',
    noRedirect: true
  }
]

const menu = [
  {
    id: '417481643058532352',
    parentId: '0',
    title: '1目录目录目录目录目录目录目录',
    isParent: true,
    projectId: '366773660297465856',
    resourceId: '01'
  },
  {
    id: '412748164305853',
    parentId: '417481643058532352',
    title: '1.1目录目录目录目录目录',
    isParent: false,
    projectId: '366773660297465856',
    resourceId: '01'
  },
  {
    id: '417481643012395008',
    parentId: '0',
    title: '2目录',
    isParent: true,
    projectId: '366773660297465856',
    resourceId: '01'
  },
  {
    id: '417481642764931072',
    parentId: '0',
    title: '3目录',
    isParent: true,
    projectId: '366773660297465856',
    resourceId: '01'
  },
  {
    id: '417481642823651328',
    parentId: '0',
    title: '4目录',
    isParent: false,
    projectId: '366773660297465856',
    resourceId: '01'
  },
  {
    id: '417481643142418432',
    parentId: '0',
    title: '5目录',
    isParent: true,
    projectId: '366773660297465856',
    resourceId: '01'
  },
  {
    id: '41748164276493142',
    parentId: '0',
    title: '6目录',
    isParent: true,
    projectId: '366773660297465856',
    resourceId: '01'
  },
  {
    id: '4174815888823651328',
    parentId: '0',
    title: '7目录',
    isParent: false,
    projectId: '366773660297465856',
    resourceId: '01'
  },
  {
    id: '4174142418432',
    parentId: '0',
    title: '8目录',
    isParent: true,
    projectId: '366773660297465856',
    resourceId: '01'
  },
  {
    id: '4174823651328',
    parentId: '0',
    title: '9目录',
    isParent: false,
    projectId: '366773660297465856',
    resourceId: '01'
  },
  {
    id: '41741424184325353',
    parentId: '0',
    title: '10目录',
    isParent: true,
    projectId: '366773660297465856',
    resourceId: '01'
  }
]
const menuDetail = {
  components: [
    {
      data: {
        title: '气泡图',
        arr: [
          [0, 0, 1],
          [0, 1, 1],
          [0, 2, 1],
          [1, 3, 1],
          [1, 4, 1],
          [1, 5, 1],
          [2, 3, 2],
          [3, 6, 1],
          [3, 7, 1],
          [3, 8, 1],
          [3, 9, 1],
          [3, 4, 3],
          [4, 6, 1],
          [4, 10, 1],
          [4, 11, 1],
          [5, 10, 1],
          [5, 3, 1],
          [5, 4, 1],
          [5, 5, 1],
          [6, 10, 1],
          [6, 2, 1],
          [6, 3, 1],
          [7, 10, 1],
          [7, 7, 1],
          [7, 9, 1],
          [7, 4, 1],
          [8, 6, 2],
          [8, 2, 1],
          [8, 9, 2]
        ],
        contentDesc: '统计量',
        xAxis: {
          data: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
          name: '重要性'
        },
        yAxis: {
          data: [
            'HYPRES to Develop Cryogenic Memory Solution for IARPA Superconducting Computers Program',
            'HYPRES’ role in IARPA C3 program referenced in IEEE Spectrum',
            'IARPA Launches "SuperTools" Program to Develop Superconducting Circuit Design Tools',
            'IARPA Launches Program to Develop a Superconducting Computer',
            'IARPA Taps IBM, Northrop, Raytheon BBN Teams for Cryogenic Computer Tech Program',
            'IARPA awards contracts for supercomputer development',
            'IARPA funding the scaling of superconducting computing for energy efficient exaflop computing',
            'IARPA releases RFI for Electronic Design Automation tools for Superconducting Electronics (EDA for SCE)',
            'IARPA releases solicitation for superconducting research in high-performance computing (HPC)',
            'IARPA to Develop a Superconducting SuperComputer',
            'Quantum Programs at IARPA',
            'US intelligence agency IARPA launches supercomputing research initiative'
          ],
          name: '标题'
        }
      },
      config: null,
      type: '4',
      desc:
        'Satellite-Based Estimation of Hourly PM2.5 Concentrations Using a Vertical-Humidity Correction Method from Himawari-AOD in Hebei.'
    },
    {
      data: {
        title: 'xxx',
        series: {
          data: ['1', '2', '1', '2', '1', '2', '1', '2', '1', '2']
        },
        xAxis: {
          data: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
          name: '重要性'
        }
      },
      config: null,
      type: '0',
      desc:
        'Satellite-Based Estimation of Hourly PM2.5 Concentrations Using a Vertical-Humidity Correction Method from Himawari-AOD in Hebei.'
    }
  ]
}
const SCROLL_TOP = 250

export default {
  name: 'Report',
  mixins: [projectMixin, searchMixin, exportDocMixin],
  components: {
    SelectItem,
    AnchorItem,
    EchartsItem,
    ThemeItem,
    Hamburger,
    BannerItem,
    SearchTags,
    ItemsHeader,
    ResultTabs,
    SearchDefaultItem,
    Breadcrumb,
    TreeMenu
  },
  data() {
    return {
      test,
      breadcrumb,
      currentTheme: '',
      isOpen: false,
      drawerMenuValue: false,
      // baseSearchConfig: {
      //   name: 'SearchItem',
      //   config: {
      //     tabsStyle: 'border',
      //     style: 'border',
      //     size: 'middle',
      //     disabledGradeSearch: true
      //   },
      //   data: [
      //     {
      //       id: 10001,
      //       name: '检索分析报告',
      //       type: 'Report',
      //       icon: 'md-analytics',
      //       value: 0,
      //       data: null
      //     }
      //   ]
      // },
      // advancedSearchConfig: {
      //   name: 'GradeSearch',
      //   config: {
      //     tabsStyle: 'border',
      //     style: 'border',
      //     size: 'middle'
      //   },
      //   data: [
      //     {
      //       id: 10002,
      //       name: '高级检索',
      //       type: 'Report',
      //       value: 1,
      //       icon: 'md-analytics',
      //       data: null
      //     }
      //   ]
      // },
      search: null,
      currentResourceId: null,
      resourceIds: [],
      navData: [],
      query: {},
      isError: false,
      queryParameter: null,
      currentRefines: null,
      screenWidth: document.body.clientWidth,
      style: {},
      themes: [
        {
          id: '00',
          name: 'macarons',
          colorList: ['#5ab1ef', '#b6a2de', '#d87a80', '#2ec7c9', '#ffb980'],
          bg: '#fff'
        },

        {
          id: '02',
          name: 'customed',
          colorList: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae'],
          bg: '#fff'
        },
        {
          id: '03',
          name: 'infographic',
          colorList: ['#27727B', '#E87C25', '#D4262F', '#FCCE10', '#D48265'],
          bg: '#fff'
        },
        {
          id: '05',
          name: 'shine',
          colorList: ['#E6B600', '#2B821D', '#C12E34', '#FDC800', '#0098D9'],
          bg: '#fff'
        },
        {
          id: '06',
          name: 'vintage',
          colorList: ['#D87C7C', '#919E8B', '#D7AB82', '#6E7074', '#61A0A8'],
          bg: '#FEF8EF'
        },
        {
          id: '07',
          name: 'purple-passion',
          colorList: ['#8A7CA8', '#E098C7', '#8FD3E8', '#CC70AF', '#D3758F'],
          bg: '#fff'
        },
        {
          id: '11',
          name: 'westeros',
          colorList: ['#93b7e3', '#59c4e6', '#edafda', '#93b7e3', '#a5e7f0'],
          bg: '#fff'
        }
        // {
        //   id: '12',
        //   name: 'chalk',
        //   colorList: ['#FC97AF', '#87F7CF', '#F7F494', '#72CCFF', '#D4A4EB'],
        //   bg: '#fff'
        // }
      ],
      currentQuery: {},
      chartInfo: {
        count: 0,
        isReady: false
      }
    }
  },
  computed: {
    ...mapGetters('project', ['resourceIdList'])
  },
  watch: {
    // $route: {
    //   handler(to, from) {
    //     this.initSearchConfig()
    //     this.initQueryParameter()
    //   },
    //   immediate: false
    // },
    screenWidth: {
      handler(nVal, oVal) {
        if (nVal >= 1200) {
          this.drawerMenuValue = false
        }
      },
      immediate: true
    }
  },
  created() {
    this.initEventBus()
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.initSearchConfig()
      this.getReportMenu()
      this.initTheme()
      window.onresize = () => {
        this.screenWidth = document.body.clientWidth
      }
    },
    initEventBus() {
      let num = 0
      eventBus.$on('on-loaded', () => {
        num += 1
        if (this.chartInfo.count === num) {
          this.chartInfo.isReady = true
          num = 0
        }
      })
    },
    //初始化请求参数
    initSearchConfig() {
      const { q = '', r = '' } = this.$route.query
      this.queryParameter = JSON.parse(q)
      this.currentResourceId = r
      console.log(this.queryParameter, r)
    },
    // 获取报告目录
    async getReportMenu(query = {}) {
      const { projectId, currentResourceId } = this
      const res = await reportMenu(projectId, currentResourceId)
      // const res = menu
      this.isLoading = false
      if (!res || res.length === 0) {
        this.navData = []
        this.chartInfo.isReady = false
        return
      }
      let res2 = res.map(item => {
        return {
          ...item,
          expand: true
        }
      })
      this.navData = this.cleanData(deepClone(res2))
      this.reqReportResult(res2, query)
    },
    // 获取报告结果
    reqReportResult(data, query) {
      const { queryParameter, currentResourceId } = this
      const temp = data
      data.map(async (item, index) => {
        const res = await reportResult(item.id, queryParameter)
        this.chartInfo.count += res.components.length
        temp[index].data = res ? res : []
        Vue.set(this, 'navData', this.cleanData(deepClone(temp)))
      })
    },
    cleanData(data) {
      let temp = []
      temp = data.filter(item => {
        return item.parentId == 0
      })
      temp.map(item => {
        item.children = data.filter(item2 => {
          return item2.parentId === item.id
        })
      })
      return temp
    },
    initTheme() {
      let t = Vue.ls.get('chart_theme')
      if (t) {
        return (this.currentTheme = t)
      }
      this.currentTheme = this.themes[0]
      Vue.ls.set('chart_theme', this.currentTheme)
    },
    toggleDrawer() {
      this.drawerMenuValue = !this.drawerMenuValue
      this.isOpen = !this.isOpen
    },
    changeTheme(item) {
      this.currentTheme = item
      Vue.ls.set('chart_theme', this.currentTheme)
    },
    onClickNode({ id }) {
      this.drawerMenuValue = false
      const element = document.getElementById(id)
      if (!element) return
      element.scrollIntoView({
        behavior: 'smooth'
      })
    },
    //下载pdf
    handleDownloadPdf() {
      this.$Modal.confirm({
        title: '提示',
        content: `是否下载当前报告?`,
        loading: true,
        'lock-scroll': true,
        onOk: async () => {
          // this.$Spin.show()
          this.pageToPdf('report', '分析报告', () => {
            // this.$Spin.hide()
            this.$Modal.remove()
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.page {
  font-size: 14px;
  background: var(--report-page);
  &-header {
    background: var(--report-page);
    font-size: 16px;
    font-weight: 600;
    line-height: 35px;
  }
  &-wrapper {
    width: 75%;
    margin: 5px auto;
  }
  &-content {
    display: flex;
    position: relative;
    border-top: 1px solid #dadce0;
    min-height: calc(100vh - 218px);
    &-left {
      width: 23%;
      background: var(--report-page);
      max-height: calc(100vh - 120px);
      max-width: 300px;
      transition: width 0.3s;
      .report-search-info {
        .search-tags {
          padding: 15px 10px;
        }
      }
    }
    &-right {
      border-left: 1px solid#dcdee2;
      flex: 1;
      ::v-deep .ivu-affix &-affix {
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.08);
        background: #fff;
        z-index: 10;
      }
      &-affix {
        .row-2 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0 15px 10px;
          .page-drawer {
            ::v-deep .hamburger {
              width: 22px;
              height: 22px;
            }
          }
        }
      }
      ::v-deep .ivu-spin-fix {
        .ivu-spin-main {
          top: calc(100vh / 2);
        }
      }
    }
  }
  &-default {
    min-height: calc(100vh - 385px);
    background: #fff;
  }
}
@media screen and (max-width: 1200px) {
  .page {
    &-wrapper {
      width: 100% !important;
    }
    &-content {
      &-left {
        width: 0 !important;
        div {
          display: none !important;
        }
        &-header {
          display: none !important;
        }
      }
      &-right {
        width: 100% !important;
      }
    }
    &-drawer {
      display: block !important;
    }
  }
}
</style>

<style lang="scss">
.list-drawer-class {
  &.report {
    .ivu-drawer {
      width: 100% !important;
      top: 0 !important;
      .ivu-drawer-close {
        i {
          color: var(--font);
          font-weight: 600;
        }
      }
      .ivu-drawer-body {
        .report-search-info {
          .search-tags {
            padding: 15px;
          }
        }
        .tree-menu {
          padding: 15px;
        }
      }
    }
  }
}
</style>
