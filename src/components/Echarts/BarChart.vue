<template>
  <div :style="{ height, width }">
    <div class="inherit" />
  </div>
</template>

<script>
import mixin from './mixins'

export default {
  name: 'BarChart',
  mixins: [mixin],
  props: {
    config: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },
    data: {
      type: Object,
      required: false,
      default: () => {
        return {
          title: '柱状图',
          xAxis: {
            type: 'category',
            name: '年份',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value',
            name: '发表量'
          },
          series: [
            {
              name: 'pageA',
              data: [30, 52, 200, 334, 390, 330, 220]
            },
            {
              name: 'pageB',
              data: [80, 52, 200, 334, 390, 330, 220]
            },
            {
              name: 'pageC',
              data: [30, 52, 200, 334, 390, 330, 220]
            }
          ]
        }
      }
    }
  },
  data() {
    return {
      baseConfig: {
        title: {},
        legend: {},
        tooltip: {},
        grid: {},
        xAxis: {},
        yAxis: {},
        toolbox: {},
        series: {}
      },
      media: [
        {
          query: {
            maxWidth: 500
          },
          option: {
            xAxis: {
              axisLabel: {
                rotate: 45
              },
              nameGap: 0
            },
            series: {
              label: {
                show: false
              },
              emphasis: {
                label: {
                  show: false
                }
              }
            }
          }
        }
      ]
    }
  },
  methods: {
    dataClean() {
      const { data } = this
      const text = data.title
      data.title = {
        text: text
      }
      this.initChart(data)
    }
  }
}
</script>
