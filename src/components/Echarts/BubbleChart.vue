<template>
  <div :style="{ height, width }">
    <div class="inherit" />
  </div>
</template>

<script>
import mixin from './mixins'

export default {
  name: 'BubbleEchart',
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
      default: () => {}
    }
  },
  data() {
    return {
      baseConfig: {
        title: {},
        legend: {},
        tooltip: {
          formatter: params => {
            return `${params.marker}
          ${params.seriesName} :
          ${params.value[2]}`
          }
        },
        grid: {},
        xAxis: {},
        yAxis: {
          formatter: function(value) {
            var res = value
            if (res.length >= 10) {
              res = res.substring(0, 9) + '...'
            }
            return res
          }
        },
        series: {
          symbolSize: val => {
            return val[2] * 15
          },
          animationDelay: function(idx) {
            return idx * 5
          }
        },
        toolbox: {}
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
              nameGap: 10
            },
            series: {}
          }
        }
      ]
    }
  },
  methods: {
    dataClean() {
      // var arr = [
      //   [0, 0, 5],
      //   [0, 1, 1],
      //   [0, 2, 0],
      //   [0, 3, 0],
      //   [1, 0, 7],
      //   [1, 1, 0],
      //   [1, 2, 0],
      //   [1, 3, 0],
      //   [2, 0, 1],
      //   [2, 1, 1],
      //   [2, 2, 0],
      //   [2, 3, 0],
      //   [3, 0, 7],
      //   [3, 1, 3],
      //   [3, 2, 0],
      //   [3, 3, 100],
      // ]
      // const data = {
      //   title: {
      //     text: '气泡图',
      //   },
      //   xAxis: {
      //     name: '时间',
      //     data: ['12a', '1a', '2a', '3a'],
      //   },
      //   yAxis: {
      //     name: '星期',
      //     data: ['Saturday', 'Friday', 'Thursday', 'Wednesday'],
      //   },
      //   series: {
      //     name: '数量',
      //     data: arr.map((item) => {
      //       return [item[0], item[1], item[2]]
      //     }),
      //   },
      // }
      const { title, arr, contentDesc, xAxis, yAxis } = this.data
      const data = {
        title: {
          text: title
        },
        xAxis,
        yAxis,
        series: {
          name: contentDesc,
          data: arr.map(item => {
            return [item[0], item[1], item[2]]
          })
        }
      }
      this.initChart(data)
    }
  }
}
</script>

<style scoped></style>
