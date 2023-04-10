<template>
  <div class="echarts-item-wrapper" :id="data.id">
    <div
      :class="[
        'echarts-item-title',
        !level ? 'title-level-1' : 'title-level-2'
      ]"
    >
      <p>
        <Divider orientation="left" dashed v-if="!level">{{
          data.title
        }}</Divider>
        <span v-else>{{ data.title }}</span>
      </p>
    </div>
    <div v-if="!data.data">
      <loading :height="'200px'" />
    </div>
    <template v-else>
      <div
        class="echarts-item-content"
        v-for="(item, index) in data.data.components"
        :key="index + 'item_component'"
      >
        <div class="echarts-item-component">
          <component
            :is="componentName(item.type)"
            :data="item.data"
            :config="item.config ? JSON.parse(item.config) : {}"
            :theme="theme"
          />
          <div v-if="item.desc" class="desc" :title="item.desc">
            <div>{{ item.desc }}</div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="data.children">
      <echarts-child-item
        v-for="(item, index) in data.children"
        :data="item"
        :theme="theme"
        :level="1"
        :key="index + '_child'"
      />
    </template>
  </div>
</template>

<script>
import sysEnum from '@/common/sysEnum'

import {
  LineChart,
  PieChart,
  RadarChart,
  Sankey,
  WordCloud,
  BarChart,
  BubbleChart,
  GraphChart,
  TableItem
} from '@/components/Echarts'

import Information from './Information'
import Loading from '@/components/Loading'

export default {
  name: 'EchartsChildItem',
  components: {
    BarChart,
    LineChart,
    PieChart,
    RadarChart,
    Sankey,
    WordCloud,
    BubbleChart,
    GraphChart,
    TableItem,
    Information,
    Loading
  },
  props: {
    theme: String,
    data: {
      type: Object,
      required: true
    },
    level: Number
  },
  data() {
    return {
      isLoading: true
    }
  },
  computed: {
    componentName() {
      return type => {
        return sysEnum.echartWidgetTypes.getLabelByValue(type * 1)
      }
    }
  },
  watch: {},
  mounted() {}
}
</script>

<style scoped lang="scss">
.echarts-item {
  &-content {
    position: relative;
  }
  &-component {
    .desc {
      margin: 15px 20px 0 35px;
      padding: 15px 0px;
      background: #f5f6f7;
      border-radius: 5px;
      div {
        text-indent: 2em;
        font-size: 17px;
        word-break: break-all;
        color: var(--font);
        font-weight: 500;
      }
    }
  }
}
</style>
