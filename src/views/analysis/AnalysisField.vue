<template>
  <div
    class="analysis"
    id="analysis"
    v-wechat-title="`结果分析 - ${logoOfGetter.titleCn}`"
  >
    <div class="analysis-field">
      <div class="analysis-header">
        <breadcrumb :showLabel="true" :data="breadcrumb" />
        <Button class="retrun-btn">
          <span @click="$router.go(-1)" class="text-hover"> 返回</span>
        </Button>
      </div>
      <div class="analysis-content" v-if="!isError">
        <Spin v-if="isLoading" fix />
        <div class="analysis-left">
          <div class="analysis-left-header">
            <p>
              <Icon type="md-search" />
              检索信息
            </p>
          </div>
          <div class="search-tags">
            <search-tags
              v-if="queryParameter"
              :queryParameter="queryParameter"
              :refine="refine ? refine : []"
              :closable="false"
              tagColor="primary"
              tagType="border"
            />
          </div>
          <div class="analysis-left-header field">
            <p>
              <Icon type="md-podium" />
              分析字段
            </p>
          </div>
          <div class="analysis-left-content">
            <!-- <loading v-if="isLoading" height="150px" /> -->
            <div class="list" v-if="fieldData && !isLoading">
              <div
                v-for="(item, index) in fieldData"
                :key="item.label + index"
                :class="[
                  'list-item',
                  currentField.name === item.name ? 'active' : ''
                ]"
                @click="handleClickFiled(item)"
              >
                {{ item.label }}
              </div>
            </div>
          </div>
        </div>
        <div class="analysis-right">
          <div class="p-t-10 p-b-10 hamburger-wrapper">
            <hamburger
              class="hamburger"
              @toggleClick="drawerMenuValue = true"
              :isActive="isOpen"
            />
          </div>
          <div class="analysis-right-header">
            <div class="search-tabs">
              <result-tabs
                @on-click-tabs="handleClickTabs"
                :active="currentResourceId"
                :resourceIds="queryParameter.resourceIds"
                :query="query"
                v-if="queryParameter.resourceIds"
              />
            </div>
            <Button
              shape="circle"
              type="success"
              class="m-l-10"
              @click="handleDownloadPdf"
              :title="isLoading ? '图表加载中' : '下载PDF'"
              :disabled="isLoading"
              ><Icon type="md-download" /><span>下载PDF</span></Button
            >
          </div>
          <div class="analysis-right-content">
            <analysis-detail
              ref="analysisDetail"
              v-if="!isLoading && analysisResult"
              :field="currentField"
              :query="queryParameter"
              :data="analysisResult"
              :loading="loading2"
              :downloading="downloading"
            />
          </div>
        </div>
        <Drawer
          v-model="drawerMenuValue"
          title="分析字段"
          :closable="true"
          placement="left"
          class-name="analysis"
          :mask="drawerMenuValue"
        >
          <div class="analysis-left-content analysis-drawer-content">
            <div class="list" v-if="fieldData && !isLoading">
              <div
                v-for="(item, index) in fieldData"
                :key="item.label + index"
                :class="[
                  'list-item',
                  currentField.name === item.name ? 'active' : ''
                ]"
                @click="handleClickFiled(item)"
              >
                {{ item.label }}
              </div>
            </div>
          </div>
        </Drawer>
      </div>

      <error-item v-if="isError" />
    </div>
  </div>
</template>

<script>
import { statisticsFields, advancedStatistics } from '@/api/analysis'

import {
  getQueryParameterBySearchId,
  setSearchId,
  getRefineById
} from '@/utils/query-string'

import projectMixin from '@/mixins/project'
import searchMixin from '@/mixins/search'
import routerMixin from '@/mixins/router'
import exportDocMixin from '@/mixins/exportDoc'

import AnalysisDetail from '@/views/analysis/AnalysisDetail'
import ResultTabs from '@/components/ResultTabs'
import Breadcrumb from '@/components/Breadcrumb'
import ErrorItem from '@/components/ErrorItem'
import Loading from '@/components/Loading'
import Hamburger from '@/components/Hamburger'
import SearchTags from '@/components/SearchTags'
import ItemsHeader from '@/components/ItemsHeader'

const breadcrumb = [
  {
    path: '',
    name: '资源检索'
  },
  {
    path: '',
    name: '结果分析',
    noRedirect: true
  }
]

export default {
  name: 'AnalysisField',
  mixins: [projectMixin, searchMixin, routerMixin, exportDocMixin],
  components: {
    AnalysisDetail,
    Breadcrumb,
    Loading,
    ErrorItem,
    Hamburger,
    SearchTags,
    ItemsHeader,
    ResultTabs
  },
  data() {
    return {
      breadcrumb,
      query: null,
      params: null,
      queryParameter: {},
      currentResourceId: '',
      refine: null,
      fieldData: null,
      analysisResult: null,
      currentField: {},
      isLoading: false,
      isError: false,
      isOpen: false,
      drawerMenuValue: false,
      screenWidth: document.body.clientWidth,
      router: null,
      loading2: false,
      downloading: false
    }
  },
  watch: {
    drawerMenuValue: {
      handler() {
        this.isOpen = this.drawerMenuValue ? false : true
      }
    },
    screenWidth: {
      handler(nVal, oVal) {
        if (nVal > 900) {
          this.drawerMenuValue = false
        }
      },
      immediate: true
    }
  },
  created() {
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { query, params } = this.$route
      this.query = query
      this.params = params
      this.setBreadcrumb()
      const { refineId, from, searchId } = query
      if (refineId) {
        const refineInfo = getRefineById(query.refineId)
        if (refineInfo) this.refine = refineInfo
      }
      if (from) {
        const queryParameter = getQueryParameterBySearchId(searchId)
        if (!queryParameter) return (this.isError = true)
        this.queryParameter = queryParameter
      }
      this.currentResourceId = this.queryParameter.resourceId
      this.getAnalysisFields()
    },
    init1() {
      const {
        $route: { query },
        resources
      } = this
      this.query = query
      let { searchId, resourceId, field, refines } = query
      let queryObj = getQueryParameterBySearchId(searchId)
      if (!queryObj) {
        this.$Message.info('请先进行检索')
        this.$router.replace('/')
        return
      }
      const { resourceIds } = queryObj
      if (refines) {
        queryObj.refines = JSON.parse(refines)
      }
      Vue.set(this, 'queryParameter', queryObj)
      const tempIds = []
      resources.map(item => {
        resourceIds.map(id => {
          if (id === item.id) {
            tempIds.push(item.id)
          }
        })
      })
      this.currentResourceId =
        resourceId && resourceIds.indexOf(resourceId) !== -1
          ? resourceId
          : tempIds[0]
      if (field) {
        field = JSON.parse(field)
      }
      this.setBreadcrumb()
      this.getAnalysisFields(field)
    },
    setBreadcrumb() {
      const {
        query: { searchId },
        queryParameter
      } = this
      let mode = 'base'
      const { searchLogic } = queryParameter
      if (searchLogic) {
        mode = 'advanced'
      }
      this.breadcrumb[0].path = `/search/${mode}?searchId=${searchId}`
    },
    async getAnalysisFields(field) {
      this.isLoading = true
      this.isError = false
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      try {
        const { currentResourceId: id } = this
        const res = await statisticsFields(id).catch(err => {
          this.isError = true
          this.isLoading = false
        })
        this.fieldData = res
        this.currentField = field ? field : res[0]
        this.getAnalysisResult()
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        this.isError = true
      }
    },
    async getAnalysisResult() {
      this.loading2 = true
      this.isError = false
      try {
        const {
          currentResourceId,
          queryParameter,
          currentField: { name: aggregationField },
          query: { id }
        } = this
        const { field, keyword, searchLogic, refines } = queryParameter
        const req = {
          ...queryParameter,
          resourceId: currentResourceId,
          resourceIds: undefined,
          aggregationField,
          fieldLabel: undefined
        }
        if (field && keyword) {
          req.searchLogic = [
            {
              field: req.field,
              logic: 'AND',
              keyword: keyword ? keyword : ''
            }
          ]
          req.field = undefined
          req.keyword = undefined
        }
        if (id) {
          req.id = id
        }
        if (searchLogic) {
          req.searchLogic = req.searchLogic.map(item => {
            const str = item.field.split('-')[0]
            return {
              ...item,
              field: str
            }
          })
        }
        console.log('refines', refines)
        // if (refines) {
        //   console.log('refines', refines)
        //   refines.map(item => {
        //     item.values.map(item2 => {
        //       req.searchLogic.push({
        //         field: item.field,
        //         logic: 'AND',
        //         keyword: item2
        //       })
        //     })
        //   })
        // }
        // req.refines = undefined
        const res = await advancedStatistics(req)
        this.loading2 = false
        this.analysisResult = res
      } catch (error) {
        console.log(error)
        this.loading2 = false
        this.isError = true
      }
    },
    handleReturnBtn() {
      const {
        query: { searchId, pageNo, from },
        params: { mode }
      } = this
      const query = {}
      if (from === 'search') {
        query.searchId = searchId
      }
      if (pageNo) query.pageNo = pageNo
      this.$router.push({
        name: from[0].toUpperCase() + from.substring(1),
        params: { mode },
        query
      })
    },
    handleClickFiled(item) {
      this.drawerMenuValue = false
      this.currentField = item
      this.query.id = ''
      this.getAnalysisResult()
    },
    handleClickTabs(id) {
      this.currentResourceId = id
      this.query.id = ''
      this.getAnalysisFields()
    },
    //下载pdf
    handleDownloadPdf() {
      this.$Modal.confirm({
        title: '提示',
        content: `是否下载当前报告?`,
        loading: true,
        'lock-scroll': true,
        onOk: async () => {
          this.$Modal.remove()
          this.$Spin.show()
          this.downloading = true
          const { chartList } = this.$refs.analysisDetail
          const {
            currentField: { label }
          } = this
          const textArr = []
          chartList.map(item => {
            textArr.push(`${label} - ${item.cnName}`)
          })
          console.log(textArr)
          this.$nextTick(() => {
            this.imgToPdf('analysis', '分析报告', textArr, () => {
              this.$Spin.hide()
              this.downloading = false
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scope>
.analysis {
  background: #f5f5f7;
  &-field {
    width: 75%;
    margin: 0 auto;
    padding-bottom: 10px;
  }
  &-header {
    padding: 6px 0;
    display: flex;
    justify-content: space-between;
    align-content: center;
  }
  &-content {
    display: flex;
    min-height: calc(100vh - 221px);
    position: relative;
    .analysis-left {
      width: 18%;
      transition: width 0.6s;
      .search-tags {
        background: #fff;
        padding: 8px 10px;
        min-height: 68px;
        margin-bottom: 15px;
      }
      &-header {
        background: #fff;
        border-bottom: 1px solid #e8eaec;
        line-height: 45px;
        padding: 0 15px;
        font-size: 16px;
        color: var(--font);
        font-weight: 600;
        p {
          font-weight: 400;
          i {
            opacity: 0.8;
            color: var(--theme);
            font-size: 18px;
            vertical-align: text-top;
          }
        }
      }
      &-content {
        position: relative;
        max-height: 100vh;
        overflow-y: auto;
        .list-item {
        }
      }
    }
    .analysis-right {
      width: 82%;
      .hamburger-wrapper {
        display: none;
      }
      .hamburger {
        width: 23px;
        height: 23px;
      }
      &-header {
        margin-left: 10px;
        padding: 0 15px;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .search-tabs {
          line-height: 30px;
          .result-tabs {
            background: #fff !important;
          }
        }
        .search-tags {
        }
      }
      &-content {
        position: relative;
        .search-tabs {
          margin-left: 8px;
          margin-bottom: 15px;
          .result-tabs {
            background: #fff !important;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1200px) {
  .analysis {
    &-field {
      width: 95%;
    }
    &-content {
      display: flex;
      flex-direction: column;
      .analysis-left {
        width: 100%;
        .search-tags {
          margin-bottom: 0;
        }
        &-header {
          padding: 0 5px;
          &.field {
            display: none;
          }
        }
        &-content {
          display: none;

          .list-item {
          }
        }
      }
      .analysis-right {
        width: 100%;
        margin: 0;
        margin-top: 15px;
        .hamburger-wrapper {
          display: block !important;
        }
        &-header {
          margin: 0;

          padding: 5px 10px;
          .analysis-drawer {
          }
          .search-tags {
          }
        }
        &-content {
          margin: 0;
          .analysis-detail {
            margin-left: 0;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 900px) {
  // .analysis-left {
  //   width: 0px !important;
  //   border-right: none !important;
  // }
  // .analysis-drawer {
  //   display: flex !important;
  // }
  // .analysis-left-header {
  //   display: none !important;
  // }
  // .analysis-left-content1 {
  //   display: none !important;
  // }
  // .analysis-right {
  //   width: 100% !important;
  // }
  // .analysis-right .analysis-right-header {
  //   padding: 5px 10px !important;
  // }
}
@media screen and (max-width: 760px) {
  .analysis {
    &-field {
      width: 98%;
    }
    &-header {
    }
    &-content {
      .analysis-left {
        &-header {
          padding: 0 5px;
        }
        &-content {
        }
      }
      .analysis-right {
        width: 100%;
        &-header {
          .analysis-drawer {
          }
          .search-tags {
          }
        }
        &-content {
        }
      }
    }
  }
  .chart-box-header {
    flex-flow: wrap;
  }
  .analysis-select {
    margin-right: 0 !important;
    margin-left: 5px;
  }
  .prefix-text {
    display: none;
  }
  .analysis-select {
    min-width: 90px !important;
  }
}

@media screen and (max-width: 500px) {
  .analysis-table-item-footer .page,
  .analysis-table-item-footer .number {
    float: none !important;
  }
  .analysis-table-item-footer .number {
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
  }
  .analysis-table-item-footer .ivu-page {
    justify-content: flex-end;
  }
}
</style>

<style lang="scss">
.ivu-drawer-wrap {
  &.analysis {
    .ivu-drawer {
      width: 100% !important;
      top: 0 !important;
      .ivu-drawer-header-inner {
        font-weight: 400;
        letter-spacing: 1px;
        font-size: 16px;
        color: #000;
      }
      .ivu-drawer-body {
        padding: 0;
        background: var(--theme);
        * {
        }
        .analysis-left-content {
          &.analysis-drawer-content {
          }
          .list {
            &-item {
              border-bottom: 1px solid #fff;
              font-weight: 500;
              &.active,
              &.active:hover {
                color: #fff;
                opacity: 1;
              }
              &:hover {
                color: var(--theme);
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
}

.analysis-left-content {
  // box-shadow: 0 2px 3px 0 rgb(210 210 210 / 75%);
  &.analysis-drawer-content {
    padding: 0 !important;
  }
  .list {
    border-top: none;
    &-item {
      display: flex;
      align-items: center;
      padding: 10px 5px 10px 20px;
      // justify-content: center;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      background: #fff;
      color: var(--font);
      letter-spacing: 1px;
      &.active,
      &.active:hover {
        color: #fff;
        background: var(--theme);
      }
      &:hover {
        background-color: #e3ecfd;
        color: var(--theme);
      }
    }
  }
}
</style>
