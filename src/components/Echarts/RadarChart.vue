<template>
  <div :style="{ height, width }">
    <div class="inherit" />
  </div>
</template>

<script>
import mixin from './mixins'

export default {
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
          title: '雷达图',
          radar: {
            indicator: [
              { name: 'Sales', max: 10000 },
              { name: 'Administration', max: 20000 },
              { name: 'Information Techology', max: 20000 },
              { name: 'Customer Support', max: 20000 },
              { name: 'Development', max: 20000 },
              { name: 'Marketing', max: 20000 }
            ]
          },
          series: {
            data: [
              {
                value: [5000, 7000, 12000, 11000, 15000, 14000],
                name: 'Allocated Budget'
              },
              {
                value: [4000, 9000, 15000, 15000, 13000, 11000],
                name: 'Expected Spending'
              },
              {
                value: [5500, 11000, 12000, 15000, 12000, 12000],
                name: 'Actual Spending'
              }
            ]
          }
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
        series: {},
        toolbox: {},
        radar: {}
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
            series: {}
          }
        }
      ]
    }
  },
  methods: {
    dataClean() {
      const { title: text, indicator, data: series } = this.data
      let max = 0
      series.map(item => {
        const current = item.value.sort((a, b) => {
          return b - a
        })[0]
        max = max >= current ? max : current
      })
      const data = {
        title: {
          text
        },
        radar: {
          indicator: indicator.map(item => {
            return {
              ...item,
              max
            }
          })
        },
        series: {
          data: series
        }
      }
      this.initChart(data)
    }
  }
}
</script>
