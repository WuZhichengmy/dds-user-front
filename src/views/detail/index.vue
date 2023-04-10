<template>
  <div
    class="detail-page"
    v-wechat-title="`${title} - ${logoOfGetter.titleCn}`"
  >
    <error-item v-if="isError" :height="'calc(100vh - 145px)'" />
    <template v-if="!isError">
      <!-- <banner-item
        v-if="search.data[0].data && search.data[0].data.length > 0"
        :data="search"
        class="banner-item"
        id="detailPageContent"
      /> -->
      <div class="detail-page-wrapper">
        <div class="page-header">
          <breadcrumb :showLabel="true" :data="breadcrumb" />
          <Divider style="margin: 5px 0;" />
        </div>
        <div class="page-content">
          <Spin size="large" fix v-if="isLoading" />
          <div class="page-content-left">
            <div class="detail-content">
              <detail-item
                :data="detail"
                :fields="fields"
                v-if="detail && fields"
                ref="detailItem"
              />
            </div>
          </div>
          <div
            class="page-content-right"
            v-if="hotwords.data[0].data.length || recommendData.data.length"
          >
            <div
              class="detail-items hotwords-item"
              v-if="hotwords.data[0].data && hotwords.data[0].data.length > 0"
            >
              <div class="detail-items-header">推荐热词</div>
              <div class="detail-items-content">
                <tags-cloud
                  :data="hotwords.data[0].data"
                  :config="hotwords.config"
                />
              </div>
            </div>
            <div
              class="detail-items"
              v-if="recommendData.data && recommendData.data.length > 0"
            >
              <div class="detail-items-header">推荐文章</div>
              <div class="detail-items-content">
                <recommend-item :data="recommendData.data" @on-click="linkTo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import projectMixin from '@/mixins/project'

import { widgetInfo } from '@/api/widget'

import { detailFields, detailResult } from '@/api/detail'

import Breadcrumb from '@/components/Breadcrumb'
import TagsCloud from '@/components/TagsCloud'
import ArticleList from '@/components/ArticleList'
import BannerItem from '@/components/BannerItem'
import ErrorItem from '@/components/ErrorItem'

import DetailItem from './components/DetailItem'
import TabsItem from './components/TabsItem'
import RecommendItem from './components/RecommendItem'

const breadcrumb = [
  {
    path: '',
    name: '资源',
    noRedirect: true
  }
]

export default {
  name: 'Detail',
  mixins: [projectMixin],
  components: {
    Breadcrumb,
    DetailItem,
    TabsItem,
    TagsCloud,
    ArticleList,
    BannerItem,
    RecommendItem,
    ErrorItem
  },
  data() {
    return {
      isLoading: false,
      isError: false,
      fields: null,
      detail: null,
      relatedData: [],
      recommendData: {
        name: 'RecommendItem',
        config: {},
        data: []
      },
      hotwords: {
        name: 'TagsCloud',
        config: {
          width: 300,
          height: 300,
          speed: 1000,
          randomColor: true,
          border: 'none',
          color: [
            '#427dc9',
            '#a69fd5',
            '#4152b9',
            '#34418d',
            '#e59c6f',
            '#629667',
            '#85b7be',
            '#8dc9b0',
            '#f29a9e'
          ]
        },
        data: [
          {
            id: 10001,
            name: '热门检索',
            value: 'hotwords',
            data: []
          }
        ]
      },
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
            data: []
          }
        ]
      },
      query: {},
      title: '详情',
      breadcrumb
    }
  },
  computed: {
    ...mapState('project', ['widgetIds'])
  },
  watch: {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.isLoading = true
      this.query = this.$route.params
      this.initResources()
      this.getData()
    },
    getData() {
      const {
        widgetIds: { hotwords, list },
        projectId,
        query: { resourceId, id }
      } = this
      if (resourceId) {
        const name = this.getResourceLabelById(resourceId)
        this.breadcrumb = [
          {
            path: '',
            name,
            noRedirect: true
          }
        ]
      }
      Promise.all([
        detailFields(resourceId),
        detailResult(resourceId, id)
        // hotwords ? widgetInfo(projectId, hotwords) : null,
        // list ? widgetInfo(projectId, list) : null
      ])
        .then(res => {
          const [res1, res2, res3, res4] = res
          this.isLoading = false
          if (!res2) return (this.isError = true)
          let tempFields = res1
          let key = ''
          let flag = true
          this.fields = []
          tempFields.map(item => {
            if (flag && item.orderNumber === 1) {
              flag = false
              key = item.name
            }
            this.fields.push({
              ...item,
              isLabelShow: true,
              hightlight: false,
              isOpen: false,
              isExpand: null,
              isValueShow: true,
              align: 'left',
              style: {}
            })
          })
          this.detail = res2[0]
          this.title = key ? this.detail[key] : '详情'
          this.breadcrumb.push({
            path: this.$route.fullPath,
            name: this.detail[key],
            noRedirect: true
          })
          if (res3) {
            let tempHotwords = res3
            tempHotwords.data.TagsCloud.map(item => {
              if (item.resourceId === resourceId) {
                this.hotwords.data[0].data = item.data
              }
            })
          }
          if (res4) {
            let tempList = res4
            tempList.data.ArticleList.map(item => {
              if (item.resourceId === resourceId) {
                this.recommendData.data = item.data
              }
            })
          }
        })
        .catch(err => {
          this.isErrr = true
          this.isLoading = false
        })
    },
    initResources() {
      this.search.data.map(item => {
        item.data = this.resources
      })
    },
    linkTo({ id }) {
      this.openInNewTab({
        name: 'Detail',
        params: {
          resourceId: this.query.resourceId,
          id
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.detail {
  &-page {
    background: #fff;
    .banner-item {
      ::v-deep .banner-item-wrapper {
        padding: 15px 0;
      }
    }
    &-wrapper {
      width: 75%;
      margin: 4px auto;
      position: relative;

      min-height: calc(100vh - 162px);
      .page {
        padding: 15px 10px;
        &-header {
          background: #fff;
          font-size: 19px;
          font-weight: 600;
          line-height: 35px;
          text-align: left;
        }
        &-content {
          background: #fff;
          display: flex;
          &-left {
            flex: 1;
            height: 100%;
            .detail-content {
              padding-top: 10px;
              min-height: 400px;
            }
            &-header {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              background: #f5f7f9;
              padding: 10px;
              border-radius: 5px;
            }
          }
          &-right {
            margin-left: 1%;
            width: 300px;
            transition: width 0.5s ease;
            .detail-items {
              width: 100%;
              margin-top: 10px;
              border-radius: 4px;
              border: 1px solid #dcdee2;
              border-color: #e8eaec;
              overflow: hidden;
              transition: border-radius 0.5s ease-out;
              &:hover {
                border-radius: 15px;
                .detail-items-header:after {
                  width: 100%;
                }
              }
              &.hotwords-item {
                height: 350px;
              }
              &-header {
                position: relative;
                line-height: 45px;
                text-align: center;
                font-weight: 400;
                font-size: 16px;
                color: var(--font);
                border-bottom: 1px solid #d8dce0;
                &:after {
                  content: '';
                  position: absolute;
                  bottom: 0;
                  left: 50%;
                  transform: translateX(-50%);
                  height: 4px;
                  width: 60px;
                  background: var(--item-title);
                  transition: width 0.5s ease-out;
                }
              }
              &-content {
                cursor: pointer;
                min-height: 400px;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1200px) {
  .detail {
    &-page {
      background: #fff;
      &-wrapper {
        width: 100%;
        margin: 4px auto;
        .page {
          &-header {
            padding: 0;
          }
          &-content {
            min-height: 1000px;
            display: initial;
            padding: 0;
            &-left {
              width: 100%;
              padding: 0 20px;
              padding-bottom: 20px;
              .detail-content {
                min-height: 400px;
              }
            }
            &-right {
              margin-left: 0;
              width: 98%;
              margin: 0 auto;
              .detail-items {
                box-shadow: none;
                border-radius: 15px;
                &:hover {
                  .detail-items-header:after {
                    width: 50px;
                  }
                }
                &.hotwords-item {
                  height: 350px;
                }
                &-header {
                  &:after {
                    width: 5%;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
