<template>
  <div class="banner-item">
    <div class="banner-item-wrapper">
      <div class="banner-item-left">
        <!-- <logo :data="logo" v-if="logo" /> -->
      </div>
      <div class="banner-item-center">
        <div v-if="!gradeSearch">
          <search-tabs
            :data="data"
            :config="{
              animated: false,
              type: 'card'
            }"
            v-on="$listeners"
            v-bind="$attrs"
            @handleToggleGradeSearch="handleToggleGradeSearch"
          />
        </div>
        <div v-if="gradeSearch">
          <search-tabs
            :data="data"
            :config="{
              animated: false,
              type: 'card',
              border: '2px solid #E6E6E6'
            }"
            v-on="$listeners"
            v-bind="$attrs"
            @handleToggleGradeSearch="handleToggleGradeSearch"
          />
        </div>
      </div>
      <div class="banner-item-right"></div>
    </div>
  </div>
</template>

<script>
import Logo from '@/layout/components/Logo'
import SearchTabs from '@/components/SearchTabs'

import projectMixin from '@/mixins/project'

export default {
  name: 'BannerItem',
  mixins: [projectMixin],
  components: {
    SearchTabs,
    Logo
  },
  props: {
    config: {
      type: Object,
      required: false,
      default: () => {
        return {
          style: 'dark',
          size: 'middle'
        }
      }
    },
    data: {
      type: Object,
      required: true
    },
    query: {
      type: Object,
      required: false
    },
    gradeSearch: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    handleToggleGradeSearch(result) {
      this.$emit('on-toggle-grade-search', result)
    }
  }
}
</script>

<style scoped>
.banner-item {
  background: #fff;
  border-bottom: 2px solid var(--color);
}
.banner-item-wrapper {
  width: 75%;
  margin: 0 auto;
  display: flex;
  padding: 25px 0 20px;
}
.banner-item-left {
  flex: 1;
  height: 100%;
}
.banner-item-center {
  flex: 4;
  margin: auto 0;
}
.banner-item-right {
  flex: 1;
}
@media screen and (max-width: 1200px) {
  .banner-item-wrapper {
    width: 95%;
  }
}
@media screen and (max-width: 1830px) {
  .banner-item-right,
  .banner-item-left {
    display: none;
  }
}
</style>
