<template>
  <div :style="{ height, width }">
    <div class="inherit" />
  </div>
</template>

<script>
import mixin from './mixins'

export default {
  name: 'LineChart',
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
          title: '折线图',
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
              name: '美国',
              data: [
                '237.08',
                '248.73',
                '261.71',
                '281.65',
                '306.93',
                '337.2',
                '378.88'
              ]
            },
            {
              name: '法国',
              data: ['47.71', '49.87', '51.85', '53.19', '62.4', '68.2', '72.3']
            },
            {
              name: '中国',
              data: [
                '16.8',
                '20.3',
                '20.57',
                '23.44',
                '28.37',
                '37.91',
                '48.79'
              ]
            },
            {
              name: '日本',
              data: [
                '122.48',
                '125.32',
                '135.22',
                '137.7',
                '143.71',
                '150.16',
                '150.15'
              ]
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
            toolbox: {
              itemSize: '12'
            },
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
      ],
      symbol: ['circle', 'pin', 'diamond', 'arrow', 'triangle', 'rect']
    }
  },
  methods: {
    dataClean() {
      const { data } = this
      const msg = data.title
      data.title = {
        msg,
      }
      this.initChart(data)
    }
  }
}
</script>

<style scoped></style>
