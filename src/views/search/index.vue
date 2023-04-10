<template>
  <div
    class="search"
    v-wechat-title="
      `${currentSearchMode === 'base' ? '基础' : '高级'}检索 - ${
        logoOfGetter.titleCn
      }`
    "
  >
    <div class="search-page">
      <banner-item
        v-if="currentSearchMode && queryParameter"
        :data="
          currentSearchMode === 'advanced'
            ? advancedSearchConfig
            : baseSearchConfig
        "
        :mode="currentSearchMode"
        :queryParameter="queryParameter"
      />
      <div class="search-page-wrapper">
        <div class="page-header">
          <!-- <breadcrumb :showLabel="true" /> -->
        </div>
        <div class="search-content">
          <Spin size="large" v-if="isLoading" fix />
          <div class="search-content-left">
            <div class="search-content-left-header">
              <!-- 检索结果 -->
            </div>
            <div class="search-left-info">
              <items-header data="检索信息" />
              <div class="search-info-wrapper">
                <search-tags
                  tagColor="primary"
                  tagType="border"
                  :queryParameter="queryParameter"
                  :refine="listData.refineResults"
                  @on-delete-tag="handleDeleteTag"
                  v-if="listData.refineResults"
                />
              </div>
              <div class="article-header-search">
                <!-- <items-header data="精炼结果" /> -->
                <div class="checkbox-wrapper">
                  <Form ref="formInline" class="search-content-left-filter">
                    <checkbox-item
                      v-if="listData.refineResults"
                      :data="listData.refineResults"
                      :current-collapse="currentCollapse"
                      :currentRefines="currentRefines"
                      :length="length"
                      @on-click-filter-btn="handleFilterBtn"
                    />
                  </Form>
                </div>
              </div>
            </div>
          </div>
          <div class="search-content-center">
            <div class="search-tabs">
              <result-tabs
                @on-click-tabs="handleClickTabs"
                :active="currentResourceId"
                :resourceIds="resourceIds"
                :query="query"
                v-if="resourceIds"
              />
            </div>
            <div class="current-search-info">
              <div class="search-drawer">
                <hamburger
                  @toggleClick="drawerMenuValue = true"
                  :isActive="isOpen"
                />
              </div>
              <div class="current-search-info-cont">
                <search-tags
                  :queryParameter="queryParameter"
                  :refine="listData.refineResults"
                  :display="'horizontal'"
                  @on-delete-tag="handleDeleteTag"
                  v-if="listData.refineResults"
                />
              </div>
            </div>
            <div class="search-list-item">
              <list-item
                ref="listItem"
                v-if="listData.result"
                :data="listData.result"
                :fields="fields"
                :total="listData.total"
                :pageNo="query.pageNo ? query.pageNo : 1"
                :pageSize="limit"
                :padding="'0 8px'"
                :resourceId="currentResourceId"
                @on-page-change="handlePageChange"
                @on-click-analysis-btn="toAnalysisPage"
                @on-click-report-btn="toReportPage"
                @on-export="handleExport"
                @on-page-size-change="handlePageSizeChange"
              />
            </div>
          </div>
        </div>
      </div>
      <Drawer
        v-model="drawerMenuValue"
        title="精炼检索结果"
        :closable="true"
        placement="left"
        class-name="search"
      >
        <Form ref="formInline" class="search-content-left-filter">
          <checkbox-item
            v-if="listData.refineResults"
            :data="listData.refineResults"
            :currentCollapse="currentCollapse"
            :currentRefines="currentRefines"
            :length="length"
            @on-click-filter-btn="handleFilterBtn"
          />
        </Form>
      </Drawer>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { searchFields, advancedSearch, exportData } from '@/api/search'

import projectMixin from '@/mixins/project'
import searchMixin from '@/mixins/search'
import downloadMixin from '@/mixins/download'
import routerMixin from '@/mixins/router'

import { deepClone } from '@/utils'
import { setRefineId, setSearchId } from '@/utils/query-string'

import Breadcrumb from '@/components/Breadcrumb'
import BannerItem from '@/components/BannerItem'
import CheckboxItem from '@/components/CheckboxItem'
import ListItem from '@/components/ListItem'
import Hamburger from '@/components/Hamburger'
import ResultTabs from '@/components/ResultTabs'
import OrderItem from '@/components/OrderItem'
import SearchTags from '@/components/SearchTags'
import ItemsHeader from '@/components/ItemsHeader'
import SearchDefaultItem from '@/components/DefaultItem'

const SCROLL_TOP = 320

export default {
  name: 'Search',
  mixins: [projectMixin, searchMixin, downloadMixin, routerMixin],
  components: {
    CheckboxItem,
    ListItem,
    Breadcrumb,
    Hamburger,
    BannerItem,
    ResultTabs,
    OrderItem,
    SearchTags,
    ItemsHeader,
    SearchDefaultItem
  },
  data() {
    return {
      query: {},
      limit: 10,
      length: 5,
      isError: false,
      isLoading: false,
      resultFilter: null,
      currentResourceId: null,
      currentCollapse: [],
      fields: null,
      listData: {
        result: null,
        refineResults: null,
        total: '0'
      },
      isShow: false,
      isOpen: false,
      drawerMenuValue: false,
      screenWidth: document.body.clientWidth,
      baseSearchConfig: {
        name: 'SearchItem',
        config: {
          tabsStyle: 'border',
          style: 'border',
          size: 'middle'
        },
        data: [
          {
            id: 10001,
            name: '基本检索',
            value: 0,
            type: 'Search',
            icon: 'md-analytics',
            data: null
          }
        ]
      },
      advancedSearchConfig: {
        name: 'GradeSearch',
        config: {
          tabsStyle: 'border',
          style: 'border',
          size: 'default'
        },
        data: [
          {
            id: 10001,
            name: '高级检索',
            type: 'Search',
            value: 1,
            icon: 'md-analytics',
            data: null
          }
        ]
      },
      resourceIds: null,
      queryParameter: null,
      currentOrder: {
        orderType: '',
        orderColumn: ''
      },
      currentRefines: [],
      currentReq: null,
      resourceField: {}
    }
  },
  computed: {
    currentDrawerIcon() {
      return `ios-arrow-${this.drawerMenuValue ? 'back' : 'forward'}`
    }
  },
  watch: {
    $route: {
      handler() {
        this.initSearchConfig()
        this.initQueryParameter()
      },
      immediate: false
    },
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
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.initSearchConfig()
      this.initQueryParameter()
      window.onresize = () => {
        this.screenWidth = document.body.clientWidth
      }
    },
    onSearch() {
      this.isLoading = true
      const { currentSearchMode: mode, resourceField } = this
      const req =
        mode === 'base' ? this.onBaseSearch() : this.onAdvancedSearch()
      req.pageNo = this.query.pageNo ? this.query.pageNo : 1
      this.currentReq = req
      const isFieldExis = resourceField[req.resourceId] ? true : false
      try {
        Promise.all([
          advancedSearch(req),
          !isFieldExis ? searchFields(req.resourceId) : null
        ]).then(res => {
          this.isLoading = false
          if (!isFieldExis) {
            this.resourceField[req.resourceId] = res[1].map(item => {
              return {
                ...item,
                isLabelShow: true,
                isOpen: false,
                isValueShow: true,
                style: {}
              }
            })
          }
          this.fields = this.resourceField[req.resourceId]

          const res1 = res[0]
          this.listData.result = res1.searchResults.content
          this.listData.total = res1.searchResults.totalElements
          let tempRefine = [],
            tempCollspse = []
          res1.refineResults.map((item, index) => {
            tempRefine.push({
              ...item,
              isOpened: false
            })
            tempCollspse.push(index + '')
          })
          this.listData.refineResults = tempRefine
          this.currentCollapse = tempCollspse
        })
      } catch (error) {
        this.isError = true
        this.isLoading = false
        this.handleError()
      }
    },
    onBaseSearch() {
      const baseReq = this.setReq('base')
      const req = {
        ...deepClone(baseReq),
        field: undefined,
        keyword: undefined
      }
      if (baseReq.keyword) {
        req.searchLogic = [
          {
            field: baseReq.field,
            logic: 'AND',
            keyword: baseReq.keyword
          }
        ]
      }
      return req
    },
    onAdvancedSearch() {
      let req = this.setReq('advanced')
      if (this.isError) return
      return req
    },
    handleFilterBtn(refines) {
      this.scrollPage()
      const { queryParameter } = this
      this.drawerMenuValue = false
      let flag = false
      if (queryParameter.refines && queryParameter.refines.length) {
        queryParameter.refines.map(item => {
          if (item.field === refines.field) {
            flag = true
            item.values = refines.values
          }
        })
        if (!flag) {
          this.queryParameter.refines.push(refines)
        }
      } else {
        Vue.set(this.queryParameter, 'refines', [refines])
      }
      this.query.pageNo = 1
      this.$forceUpdate()
      this.$nextTick(() => {
        this.$refs.listItem.initCheckbox()
      })
      this.onSearch()
    },
    toAnalysisPage() {
      const {
        query,
        currentSearchMode: mode,
        currentResourceId: resourceId,
        queryParameter: { refines },
        listData: { refineResults }
      } = this
      let tempQuery = deepClone(query)
      const searchId = setSearchId({
        ...this.queryParameter,
        resourceIds: [resourceId],
        resourceId
      })
      tempQuery.searchId = searchId
      if (refines && refineResults) {
        let tempRefine = []
        refineResults.map(item => {
          refines.map(item2 => {
            if (item.field === item2.field) {
              tempRefine.push({
                field: item.field,
                title: item.title
              })
            }
          })
        })
        tempQuery.refineId = setRefineId(tempRefine)
      }
      this.$router.push({
        name: 'Analysis',
        query: {
          ...tempQuery,
          from: 'search'
        }
      })
    },
    toReportPage() {
      console.log(this.currentReq)
      // const {
      //   currentSearchMode: mode,
      //   query: { searchId }
      // } = this
      // this.$router.push({
      //   name: 'Report',
      //   params: { mode },
      //   query: {
      //     searchId,
      //     from: 'search'
      //   }
      // })
      const { currentReq, currentResourceId: r } = this
      const req = {}
      if (currentReq.searchLogic) {
        req.searchLogic = currentReq.searchLogic
      }
      if (currentReq.refines) {
        req.refines = currentReq.refines
      }
      this.openInNewTab(`/report?r=${r}&q=${JSON.stringify(req)}`)
    },
    scrollPage() {
      const top =
        this.currentSearchMode === 'base' ? SCROLL_TOP - 100 : SCROLL_TOP
      this.$nextTick(() => {
        window.scrollTo({ top, behavior: 'smooth' })
      })
    },
    handlePageChange(pageNo) {
      this.scrollPage()
      this.query.pageNo = pageNo
      this.onSearch()
    },
    handlePageSizeChange(pageSize) {
      this.scrollPage()
      this.limit = pageSize
      this.query.pageNo = 1
      this.onSearch()
    },
    //批量导出
    async handleExport(ids) {
      this.$Spin.show()
      const { currentResourceId: resourceId } = this
      try {
        const res = await exportData({
          ids,
          resourceId
        })
        this.onDownload(res, () => {
          this.$refs.listItem.initCheckbox()
          this.$Spin.hide()
        })
      } catch (error) {
        this.$Spin.hide()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.search {
  width: 100%;
  background: #fff;
  &-page {
    &-wrapper {
      width: 75%;
      margin: 0 auto;
      .page-header {
        font-weight: 400;
        line-height: 35px;
      }
      .search-default-item {
        min-height: calc(100vh - 303px);
        background: #fff;
      }
      .search-content {
        position: relative;
        display: flex;
        &-left {
          width: 20%;
          transition: width 0.5s;
          padding-top: 10px;
          .search-left-info {
            .search-info-wrapper {
              padding: 15px 10px;
              border: 1px solid #d8e1e5;
              border-top: none;
              margin-bottom: 15px;
            }
            .article-header-search {
              width: 100%;
              .checkbox-wrapper {
                min-height: 400px;
                .search-content-left-filter {
                  min-height: 600px;
                  position: relative;
                }
              }
            }
          }
        }
        &-center {
          position: relative;
          width: 80%;
          padding-bottom: 10px;
          padding: 10px 0 0 10px;
          .current-search-info {
            width: 100%;
            font-size: 14px;
            color: #515a6e;
            font-weight: 600;
            padding: 10px;
            display: none;
            border-bottom: 1px solid #dcdee2;
            position: relative;
            align-items: center;
            span {
              margin-right: 10px;
              vertical-align: middle;
            }
            &-cont {
              flex: 1;
            }
            .search-drawer {
              margin-right: 10px;
              ::v-deep .hamburger {
                width: 22px;
                height: 22px;
              }
            }
          }
        }
        .search-list-item {
          position: relative;
          z-index: 1;
          min-height: 500px;
        }
      }
    }
  }
}
@media screen and (max-width: 600px) {
  .current-search-info-tag {
    vertical-align: top !important;
  }
}
@media screen and (max-width: 1200px) {
  .search-page {
    width: 100% !important;
    margin: 0 !important;
  }
  .search-content-left {
    width: 0 !important;
  }
  .search-left-info {
    display: none;
  }
  .search-content-center {
    padding: 0 !important;
    width: 100% !important;
  }
  .search-list-item {
    padding: 0 8px;
  }
  .current-search-info {
    display: flex !important;
  }
  .current-search-info span {
    margin-right: 0 !important;
  }
  .search-page-wrapper {
    width: 100%;
  }
}
</style>

<style lang="scss">
@import '../../assets/styles/search-drawer.scss';
</style>
