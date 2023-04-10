<template>
  <div class="search-info">
    <div
      :class="[
        'search-info-content',
        display === 'horizontal' ? 'horizontal' : ''
      ]"
    >
      <slot name="resource">
        <div class="search-info-items search-type" v-if="resourceIds">
          <div class="search-info-label">资源类型:</div>
          <span class="search-type-tags">
            <Tag
              :type="tagType"
              :color="tagColor"
              :closable="false"
              v-for="(item, index) in resourceIds"
              :key="index + '_searchInfo'"
              @on-close="handleDeleteTag('resources', item)"
              >{{ item.name }}</Tag
            >
          </span>
        </div>
      </slot>
      <slot name="field">
        <div class="search-info-items search-type" v-if="field">
          <div class="search-info-label">字段:</div>
          <span class="search-type-tags">
            <Tag
              :type="tagType"
              :color="tagColor"
              size="medium"
              :title="field"
              >{{ field }}</Tag
            >
          </span>
        </div>
      </slot>
      <slot name="formula">
        <div
          class="search-info-items search-formula"
          v-if="serchInfo && serchInfo !== ''"
        >
          <div class="search-info-label">关键词:</div>
          <Tag
            :type="tagType"
            :color="tagColor"
            :closable="false"
            @on-close="handleDeleteTag('searchInfo', false)"
            >{{ serchInfo }}</Tag
          >
        </div>
        <div
          class="search-info-items search-formula"
          v-if="searchLogic && searchLogic !== ''"
        >
          <div class="search-info-label">检索表达式:</div>
          <Tag
            :type="tagType"
            :color="tagColor"
            :closable="false"
            @on-close="handleDeleteTag('searchLogic', false)"
            >{{ searchLogic }}</Tag
          >
        </div>
      </slot>
      <slot name="filter">
        <div
          class="search-info-items search-filter"
          v-if="filter && filter.length !== 0"
        >
          <slot name="filterLabel">
            <div class="search-info-label">精炼条件:</div>
          </slot>
          <div>
            <Tag
              :type="tagType"
              :color="tagColor"
              v-for="(item, index) in filter"
              :key="index + '_searchInfo_filter'"
              :closable="closable"
              @on-close="handleDeleteTag('filter', index)"
              >{{ filterName(item.field) }}:
              <span
                v-for="(items, i) in item.values"
                :key="i + '_searchInfo_filter_value'"
                >{{ items }}
                <span v-if="i !== item.values.length - 1">、</span></span
              ></Tag
            >
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SearchInfo',
  props: {
    queryParameter: {
      type: Object,
      required: true
    },
    refine: {
      type: Array,
      required: true
    },
    closable: {
      type: Boolean,
      required: false,
      default: true
    },
    display: {
      type: String,
      required: false,
      default: 'vertical'
    },
    lastItemDisabled: {
      type: Boolean,
      required: false,
      default: true
    },
    tagColor: {
      type: String,
      required: false,
      default: 'default'
    },
    tagType: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      resourceIds: null,
      serchInfo: null,
      filter: null,
      searchLogic: null,
      field: null
    }
  },
  computed: {
    ...mapState('project', ['resources']),
    filterName() {
      return field => {
        console.log('f', field)
        let name = ''
        this.refine.map(item => {
          if (name) return
          if (item.field === field) {
            name = item.title
          }
        })
        console.log(name)
        return name
      }
    },
    resourceClosable() {
      const { resourceIds, closable, lastItemDisabled } = this
      if (resourceIds.length === 1) {
        return lastItemDisabled ? false : closable
      }
      return closable
    }
  },
  watch: {
    '$route.query': {
      handler() {
        // this.initSearchInfo()
      }
    },
    queryParameter: {
      handler(n) {
        console.log(n)
        this.initSearchInfo()
      },
      deep: true
    }
  },
  mounted() {
    this.initSearchInfo()
  },
  methods: {
    initSearchInfo() {
      // this.resourceIds = null
      // this.serchInfo = null
      // this.filter = null
      // this.searchLogic = null
      const {
        queryParameter: {
          resourceIds,
          searchLogic,
          keyword,
          refines,
          field,
          fieldLabel
        },
        resources
      } = this
      if (resourceIds) {
        this.resourceIds = resources
          .filter(item => {
            return resourceIds.indexOf(item.id) !== -1
          })
          .map(item => {
            return item
          })
      } else {
        this.resourceIds = null
      }
      this.serchInfo = keyword ? keyword : null
      this.field = fieldLabel ? fieldLabel : field ? field : null
      if (searchLogic) {
        let tempSearchLogic = ''
        let tempLogic = ''
        searchLogic.map((item, index) => {
          tempLogic = index === 0 ? '' : ' ' + item.logic
          tempSearchLogic +=
            tempLogic + item.field.split('-')[1] + ':(' + item.keyword + ')'
        })
        this.searchLogic = tempSearchLogic
      }
      this.filter = refines ? refines : null
    },
    handleDeleteTag(type, info) {
      this.$emit('on-delete-tag', {
        type,
        info
      })
    }
  }
}
</script>

<style scoped lang="scss">
.search {
  &-info {
    font-size: 14px;
    &-label {
      font-weight: 400;
      flex-shrink: 0;
      margin-right: 5px;
      color: var(--font);
      font-size: 15px;
      width: 5em;
    }
    &-content {
      &.horizontal {
        display: flex;
        flex-flow: wrap;
        align-items: initial;
        .search-info-items {
          display: flex;
        }
        .search-info-label {
          margin-right: 5px;
          flex-shrink: 0;
          width: initial;
        }
      }
      .search-info-items {
        display: flex;
        align-items: center;
        &.search-type {
          margin-bottom: 5px;
        }
        &.search-formula {
          margin-bottom: 5px;
        }
        &.search-filter {
          display: flex;
          // flex-flow: wrap;
        }
      }
      .search-type-tags {
      }
    }
    .ivu-tag {
      height: auto;
      font-size: 12px;
      // overflow: unset;
    }
  }
}
</style>
