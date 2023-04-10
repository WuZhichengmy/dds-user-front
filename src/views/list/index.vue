<template>
  <div class="list-page" v-wechat-title="`资源列表 - ${logoOfGetter.titleCn}`">
    <error-item v-if="isError" />
    <template v-if="!isError">
      <!-- <banner-item :data="search" v-if="search.data[0].data" /> -->
      <div class="list-content">
        <!-- <div class="page-header">
          <breadcrumb :showLabel="true" />
        </div> -->
        <div class="list-content-info">
          <Spin size="large" v-if="isLoading" fix />
          <div class="list-content-info-left">
            <div class="list-content-info-left-card">
              <div class="search-info" v-if="req.refines.length">
                <items-header :data="'当前精炼条件'" />
                <search-tags
                  class="search-tags"
                  tagColor="primary"
                  tagType="border"
                  :queryParameter="{ refines: req.refines }"
                  :refine="listData.refineResults"
                  @on-delete-tag="handleDeleteTag"
                  v-if="listData.refineResults"
                />
              </div>
              <!-- <items-header :data="'资源统计'" /> -->
              <Form v-if="listData.refineResults" ref="formInline">
                <checkbox-item
                  v-if="listData.refineResults"
                  :data="listData.refineResults"
                  :current-collapse="currentCollapse"
                  :currentRefines="req.refines"
                  :length="length"
                  @on-click-filter-btn="handleFilterBtn"
                />
              </Form>
            </div>
          </div>
          <div class="list-content-info-right">
            <div class="list-content-info-right-header">
              <div class="list-drawer">
                <hamburger @toggleClick="toggleDrawer" :isActive="isOpen" />
              </div>
              <search-tags
                v-if="req.refines.length"
                class="search-tags"
                :display="'horizontal'"
                :queryParameter="{ refines: req.refines }"
                :refine="listData.refineResults"
                @on-delete-tag="handleDeleteTag"
              />
            </div>
            <div class="list-content-info-bg">
              <list-item
                ref="listItem"
                v-if="listData.result"
                :data="listData.result"
                :fields="fields"
                :total="listData.total"
                :resourceId="resourceId"
                :pageNo="req.pageNo"
                :padding="'0 15px'"
                :pageSize="req.pageSize"
                @on-page-change="handlePageChange"
                @on-click-analysis-btn="linkTo('Analysis')"
                @on-click-report-btn="linkTo('Report')"
              >
              </list-item>
            </div>
          </div>
        </div>
      </div>
      <Drawer
        v-model="drawerMenuValue"
        title="资源统计"
        :closable="true"
        placement="left"
        class-name="search"
      >
        <Form
          v-if="listData.refineResults"
          ref="formInline"
          class="search-content-left-filter"
        >
          <checkbox-item
            v-if="listData.refineResults"
            :data="listData.refineResults"
            :current-collapse="currentCollapse"
            :currentRefines="req.refines"
            :length="length"
            @on-click-filter-btn="handleFilterBtn"
          />
        </Form>
      </Drawer>
    </template>
  </div>
</template>

<script>
import projectMixin from '@/mixins/project'

import { searchFields, baseSearch } from '@/api/search'

import { setSearchId, setRefineId } from '@/utils/query-string'

import CheckboxItem from '@/components/CheckboxItem'
import ListItem from '@/components/ListItem'
import Hamburger from '@/components/Hamburger'
import BannerItem from '@/components/BannerItem'
import OrderItem from '@/components/OrderItem'
import ItemsHeader from '@/components/ItemsHeader'
import SearchTags from '@/components/SearchTags'
import ErrorItem from '@/components/ErrorItem'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'List',
  mixins: [projectMixin],
  components: {
    Breadcrumb,
    CheckboxItem,
    ListItem,
    Hamburger,
    BannerItem,
    OrderItem,
    ItemsHeader,
    SearchTags,
    ErrorItem
  },
  data() {
    return {
      resourceId: '',
      query: {},
      isError: false,
      isLoading: false,
      listData: {
        result: null,
        refineResults: null,
        total: '0'
      },
      resultFilter: null,
      currentCollapse: [],
      length: 5,
      isOpen: false,
      drawerMenuValue: false,
      screenWidth: document.body.clientWidth,
      sortData: [
        {
          name: '相关度',
          value: '1',
          default: 0
        },
        {
          name: '发布时间',
          value: '2',
          default: 0
        },
        {
          name: '被引频次',
          value: '3',
          default: 0
        },
        {
          name: '下载量',
          value: '4',
          default: 0
        },
        {
          name: '相关度1',
          value: '5',
          default: 0
        },
        {
          name: '相关度2',
          value: '6',
          default: 0
        }
      ],
      search: {
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
            type: 'Search',
            icon: 'md-analytics',
            data: null
          }
        ]
      },
      refines: null,
      req: {
        pageNo: 1,
        pageSize: 10,
        refines: []
      }
    }
  },
  computed: {},
  watch: {
    $route: {
      handler(to, from) {
        this.query = this.$route.query
        this.req.pageNo = 1
        this.listData.total = '0'
        this.req.refines = []
        this.getList()
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
      const {
        query,
        params: { resourceId }
      } = this.$route
      this.resourceId = resourceId
      this.query = query
      this.initResources()
      this.getList()
      window.onresize = () => {
        this.screenWidth = document.body.clientWidth
      }
    },
    handlePageChange(page) {
      this.pageNo = page
      this.getList()
    },
    getList() {
      window.scrollTo(0, 0)
      this.isLoading = true
      this.isError = false
      const {
        req: { pageNo, pageSize, refines },
        resourceId
      } = this
      const req = {
        resourceId,
        pageNo,
        pageSize
      }
      if (refines.length) {
        req.refines = refines
      }
      Promise.all([searchFields(resourceId), baseSearch(req)])
        .then(res => {
          const [res1, res2] = res
          this.isLoading = false
          this.fields = res1.map(item => {
            return {
              ...item,
              isLabelShow: true,
              isOpen: false,
              isValueShow: true,
              style: {}
            }
          })
          this.listData.result = res2.searchResults.content
          this.listData.total = res2.searchResults.totalElements
          let tempRefine = [],
            tempCollspse = []
          res2.refineResults.map((item, index) => {
            tempRefine.push({
              ...item,
              isOpened: false
            })
            tempCollspse.push(index + '')
          })
          this.listData.refineResults = tempRefine
          this.currentCollapse = tempCollspse
        })
        .catch(err => {
          this.isLoading = false
          this.isError = true
        })
    },
    initResources() {
      this.search.data.map(item => {
        item.data = this.resources
      })
    },
    handleFilterBtn(data) {
      this.drawerMenuValue = false
      let flag = false
      const {
        req: { refines }
      } = this
      if (refines.length) {
        refines.map(item => {
          if (item.field === data.field) {
            flag = true
            item.values = data.values
          }
        })
        if (!flag) {
          this.req.refines.push(data)
        }
      } else {
        this.req.refines = []
        this.req.refines.push(data)
      }
      this.req.pageNo = 1
      this.getList()
    },
    handleDeleteTag(obj) {
      let query = this.query
      // 删除资源类型
      if (obj.type === 'filter') {
        this.refines.splice(obj.info, 1)
        this.getList()
      }
    },
    linkTo(name) {
      const {
        resourceId,
        req: { refines },
        listData: { refineResults }
      } = this
      const queryInfo = {
        resourceIds: [resourceId * 1]
      }
      if (refines.length) {
        queryInfo.refines = refines
      }
      const query = {
        searchId: setSearchId(queryInfo),
        from: 'list'
      }
      const params = {
        mode: 'base'
      }
      if (name === 'Analysis') {
        params.resourceId = resourceId
        if (refines.length) {
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
          query.refineId = setRefineId(tempRefine)
        }
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    toggleDrawer() {
      this.drawerMenuValue = true
    }
  }
}
</script>

<style scoped lang="scss">
.list {
  &-page {
    background: #fff;
  }
  &-content {
    width: 75%;
    margin: 0 auto;
    min-height: calc(100vh - 125px);
    .page-header {
      padding: 0 15px;
      background: #fff;
      border-bottom: 1px solid #e3e8f9;
      font-size: 20px;
      font-weight: 600;
      line-height: 50px;
    }
    &-info {
      position: relative;
      display: flex;
      &-left {
        width: 20%;
        transition: width 0.5s;
        &-card {
          min-height: 500px;
          padding-top: 10px;
          .search-info {
            .search-tags {
              padding: 10px;
            }
          }
        }
      }
      &-right {
        width: 80%;
        padding: 0 10px;
        border-top: none;
        border-right: none;
        position: relative;
        &-header {
          display: none;
          padding: 10px;
          .list-drawer {
            margin-right: 10px;
            ::v-deep .hamburger {
              width: 22px;
              height: 22px;
            }
          }
        }
        .list-content-info-bg {
          background: #fff;
          min-height: 700px;
        }
      }
    }
  }
}
@media screen and (max-width: 1200px) {
  .list-content {
    width: 100% !important;
    margin: 0 !important;
    border: none !important;
    padding: 0 10px !important;
    &-info-right {
      border: none !important;
      padding: 0 !important;
      width: 100% !important;
      &-header {
        display: flex !important;
      }
    }
    &-info-left {
      width: 0 !important;
      min-width: 0px !important;
      div {
        display: none;
      }
    }
  }
}
// @media screen and (max-width: 1600px) {
//   .list-content {
//     width: 90%;
//   }
// }
</style>

<style lang="scss">
@import '../../assets/styles/search-drawer.scss';
</style>
