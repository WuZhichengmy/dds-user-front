<template>
  <div class="home-page" v-wechat-title="`首页 - ${logoOfGetter.titleCn}`">
    <div
      class="home-banner"
      :style="{
        backgroundImage: `url(${bannerImg ? IMG_URL + bannerImg : ''})`
      }"
    >
      <div class="banner-content">
        <div class="banner-content-title">资源检索</div>
        <search-item
          :data="searchInput.data"
          :config="searchInput.config"
          :theme="searchInput.theme"
          @on-search="onSearch"
        />
      </div>
    </div>
    <div class="wrapper">
      <div
        class="home-items-container"
        v-if="widgetIds.panelGroup || widgetIds.category"
      >
        <item-title cn="资源统计" en="Statistics" icon="md-stats" />
        <div class="home-items">
          <panel-group
            ref="panelGroup"
            v-if="panelGroup"
            :data="panelGroup"
            @on-click="handlePanelGroupItemClick"
          />
          <loading v-if="!panelGroup" :height="'120px'" />
          <Category :theme="categoryTheme" :data="category" v-if="category" />
          <loading v-if="null === category" :height="'450px'" />
        </div>
      </div>
      <div
        style="background: #E8EAEE;padding: 10px 0;"
        v-if="widgetIds.carousel && carousel"
      >
        <div class="home-items-container carousel" id="carousel">
          <div class="home-items">
            <item-title
              cn="精选资源"
              en="Selection"
              icon="md-cube"
              style="background: transparent"
            />
            <div class="home-items-wrapper" style="padding:10px 0;">
              <carousel-item
                class="relative"
                v-if="carousel"
                :config="carousel.config"
                :data="carousel.data"
                @on-click-carousel="linkToDetailPage"
              />
              <loading v-if="!carousel" :height="'300px'" />
            </div>
          </div>
        </div>
      </div>
      <div
        class="home-items-container"
        v-if="widgetIds.leaderBoard && leaderBoard !== null"
      >
        <!-- v-if="
          (widgetIds.leaderBoard && leaderBoard !== null) ||
            (widgetIds.hotwords && hotwords !== null)
        " -->
        <item-title cn="热点" en="Hotspot" icon="md-bulb" />
        <div class="home-items flex">
          <div class="home-board home-items-wrapper">
            <tabs-item
              :data="leaderBoard"
              v-if="leaderBoard"
              @on-click-item="linkToDetailPage"
            />
            <loading v-else :height="'400px'" />
          </div>
          <!-- <div class="home-tagscloud home-items-wrapper">
            <tabs-item :data="hotwords" v-if="hotwords.data" />
            <loading v-if="!hotwords" :height="'400px'" />
          </div> -->
        </div>
      </div>

      <div
        class="home-items-container"
        id="list"
        v-if="widgetIds.list && list !== null"
      >
        <item-title cn="最新资源" en="Newest" icon="md-book" />
        <div class="home-items-wrapper">
          <template v-if="list">
            <div
              class="m-b-10"
              :key="index + '_homeList'"
              v-for="(item, index) in list.data.ArticleList"
            >
              <tabs-item
                :data="{
                  ...list,
                  data: {
                    ArticleList: [item]
                  }
                }"
                @on-click-list="linkToDetailPage"
              >
                <!-- <span
                  slot="btn"
                  class="more-btn"
                  @click="linkToListPage({ resourceId: item.resourceId })"
                  title="查看更多"
                >
                  <span>查看更多>>></span>
                </span> -->
              </tabs-item>
            </div>
          </template>
          <loading v-else :height="'500px'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { eventBus } from '@/main.js'
import { IMG_URL } from '@/settings'

import { setSearchId } from '@/utils/query-string'
import projectMixin from '@/mixins/project'
import routerMixin from '@/mixins/router'

import { widgetInfo } from '@/api/widget'

// import backgroundImg from '@/assets/images/background.jpg'

import TabsItem from '@/components/TabsItem'
import SearchTabs from '@/components/SearchTabs'
import SearchItem from '@/components/SearchTabs/SearchItem'
import CarouselItem from '@/components/Carousel/CarouselItem.vue'
import Category from '@/components/Echarts/Category'
import PanelGroup from '@/components/PanelGroup'
import Loading from '@/components/Loading'
import ItemTitle from './components/ItemTitle'

export default {
  name: 'Home',
  mixins: [projectMixin, routerMixin],
  components: {
    SearchTabs,
    SearchItem,
    CarouselItem,
    Category,
    TabsItem,
    PanelGroup,
    Loading,
    ItemTitle
  },
  data() {
    return {
      collapseValue: '1',
      searchInput: {
        config: {
          style: 'dark',
          size: 'large'
        },
        theme: 'dark',
        data: {
          data: null,
          disabled: false
        }
      },
      bannerImg: 'null',
      panelGroup: null,
      leaderBoard: '',
      hotwords: '',
      list: '',
      carousel: '',
      category: null,
      categoryConfig: null,
      categoryTheme: '',
      IMG_URL
    }
  },
  watch: {},
  computed: {
    ...mapState('project', ['widgetIds']),
    ...mapGetters('permission', ['enableReport'])
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.initEventBus()
      this.initResources()
      this.initSearchConfig()
      this.getData()
      this.initCategoryTheme()
    },
    initSearchConfig() {
      // if (!this.enableReport) {
      //   this.searchInput.data[1].disabled = true
      // }
    },
    getData() {
      this.getBanner()
      this.getCarousel()
      this.getWidget('hotwords')
      this.getWidget('leaderBoard')
      this.getPanelGroup()
      this.getCategory()
      this.getWidget('list')
    },
    async getWidget(key, cb) {
      const { projectId } = this
      const widgetId = this.widgetIds[key]
      if (widgetId) {
        try {
          const { data: res } = await widgetInfo(projectId, widgetId)
          if (cb) {
            return cb(res)
          }
          this[key] = res
        } catch (error) {
          console.log(error)
          this[key] = null
        }
      } else {
        this[key] = ''
      }
    },
    getBanner() {
      const widgetId = this.widgetIds['banner']
      if (widgetId) {
        const ls = Vue.ls.get(widgetId)
        if (ls) {
          this.bannerImg = ls
          return
        }
      }
      this.getWidget('banner', res => {
        this.bannerImg = res.data[Object.keys(res.data)[0]]
        Vue.ls.set(widgetId, this.bannerImg, 1000 * 60 * 24 * 7)
      })
    },
    getCarousel() {
      this.getWidget('carousel', res => {
        const { data, config } = res
        this.carousel = {
          config,
          data: data[Object.keys(data)[0]]
        }
      })
    },
    getPanelGroup() {
      this.getWidget('panelGroup', res => {
        let tempPanelGroup = []
        const { config, data } = res
        tempPanelGroup = data[Object.keys(data)[0]].map((item, index) => {
          return {
            ...item,
            color: config.color[index],
            icon: config.icon[index]
          }
        })
        this.panelGroup = tempPanelGroup
      })
    },
    getCategory() {
      this.getWidget('category', res => {
        this.category = res.data[Object.keys(res.data)[0]]
        console.log(this.category)
      })
    },
    initCategoryTheme() {
      const setTheme = theme => {
        const { category: color, category2: color2 } = theme
        this.categoryTheme = {
          color,
          color2
        }
      }
      eventBus.$on('on-category-theme-change', theme => {
        setTheme(theme)
      })
      const theme = Vue.ls.get('system_theme')
      theme && setTheme(theme)
    },
    initEventBus() {
      eventBus.$on('on-category-theme-change', theme => {
        const { category: color, category2: color2 } = theme
        this.categoryTheme = {
          color,
          color2
        }
      })
    },
    initResources() {
      this.searchInput.data = this.resources
    },
    handleClickTabs(name) {
      this.currentCarousel = parseInt(name)
    },
    linkToListPage({ resourceId }) {
      this.$router.push({
        name: 'List',
        params: { resourceId }
      })
    },
    linkToDetailPage({ resourceId, id }) {
      console.log(resourceId, id)
      this.openInNewTab({
        name: 'Detail',
        params: {
          resourceId,
          id
        }
      })
    },
    handleClickKeyword({ resourceId, name }) {
      const query = {
        resourceIds: [resourceId],
        keyword: name
      }
      const searchId = setSearchId(query)
      this.$router.push({
        name: 'Search',
        params: { mode: 'base' },
        query: { searchId }
      })
    },
    onSearch({ mode, searchId }) {
      const options = {
        name: 'Search',
        params: { mode }
      }
      if (searchId) {
        options.query = { searchId }
      }
      this.$router.push(options)
    },
    handlePanelGroupItemClick({ resourceId }) {
      const query = {
        resourceIds: [resourceId]
      }
      const searchId = setSearchId(query)
      this.$router.push({
        name: 'Search',
        params: { mode: 'base' },
        query: { searchId }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  &-banner {
    width: 100%;
    // 政策项目
    // height: 250px;
    height: 350px;
    overflow: hidden;
    position: relative;
    z-index: 1;
    background: #fff;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    ::v-deep .search-operation {
      span {
        color: #fff !important;
      }
    }
    .banner-content {
      position: relative;
      width: 50%;
      &-title {
        font-size: 22px;
        line-height: 2;
        letter-spacing: 5px;
      }
    }
  }
  &-page {
    background: #fff;
    .wrapper {
      min-height: calc(100vh - 140px - 384px);
      .home-items-container:first-of-type {
        position: relative;
        z-index: 11;
      }
    }
    .home-items-container {
      width: 75%;
      margin: 0 auto 0;
      padding-bottom: 10px;
      background: #fff;
      // box-shadow: 0 2px 80px 0 rgba(0, 0, 0, 0.1);
      &:hover {
        ::v-deep .header {
          &::after {
            animation: demo 1s;
            transition-property: left, right;
            -webkit-transition-timing-function: ease-out;
            transition-timing-function: ease-out;
          }
          @keyframes demo {
            0% {
              width: 0;
            }
            100% {
              width: 100px;
            }
          }
        }
      }
      &.carousel {
        background: transparent;
      }
      .home-items {
        padding: 10px;
        &.flex {
          display: flex;
          justify-content: space-between;
        }
      }
      .home-items-wrapper {
        padding: 15px 20px;
        &.home-board {
          min-width: 300px;
          flex: 1;
          background: #fff;
          border: none;
        }
        &.home-tagscloud {
          width: 500px;
          background: transparent;
          text-align: center;
          border: none;
        }
      }
      /* extra */
      .more-btn {
        font-weight: 400;
        line-height: 32px;
        cursor: pointer;
        font-size: 14px;
        color: var(--font);
        span {
          vertical-align: middle;
        }
        i {
          font-size: 16px;
          color: var(--font);
          vertical-align: middle;
        }
      }
      .more-btn:hover {
        color: var(--theme);
        i {
          color: var(--theme);
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .home {
    &-banner {
      .banner-content {
        width: 90% !important;
      }
    }
    &-page {
      .home-items-container {
        width: 100%;
        margin: 0;
        margin-top: 10px;
        padding-bottom: 10px;
        .home-items {
          &.flex {
            display: block !important;
          }
        }
        .home-items-wrapper {
          padding: 15px 5px !important;

          &.home-board {
          }
          &.home-tagscloud {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
