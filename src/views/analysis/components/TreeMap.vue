<template>
  <div class="tree-map p-10">
    <div style="height: 480px; width: 100%; margin: 0 auto" :id="name"></div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'TreeMap',
  props: {
    name: String,
    data: Array
  },
  data() {
    return {
      seriesData: null,
      splice: 10,
      chart: null
    }
  },
  watch: {},
  mounted() {
    this.init()
  },
  watch: {},
  methods: {
    init() {
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }
      this.seriesData = this.data
      this.drawEcharts()
    },
    drawEcharts() {
      this.chart = echarts.init(document.getElementById(this.name), 'shine')
      let title = {
        text: ''
      }
      var option = {
        title,
        tooltip: {
          trigger: 'item',
          formatter: params => {
            let r =
              params.name + '<br/>' + params.marker + '发文量: ' + params.value
            return r
          }
        },
        animation: true,
        grid: {},
        series: [
          {
            type: 'treemap',
            width: '100%',
            height: '100%',
            roma: true,
            breadcrumb: 'false',
            levels: [
              {
                itemStyle: {
                  gapWidth: 3
                },
                childrenVisibleMin: 1
              }
            ],
            tooltip: {
              backgroundColor: 'rgba(255,255,255,1)',
              textStyle: {
                color: '#000',
                fontWeight: 'bold',
                fontSize: 16,
                padding: 10
              },
              extraCssText: 'box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);'
            },
            itemStyle: {},
            label: {
              formatter: '{b} - {c}',
              fontWeight: 'bold',
              fontSize: 16
            },
            data: this.seriesData
          }
        ]
      }
      this.chart.setOption(option)
      window.addEventListener('resize', () => {
        this.chart.resize()
      })
      this.chart.on('rendered', params => {
        let picBase64 = this.chart.getDataURL({
          type: 'png',
          backgroundColor: '#fff'
        })
        this.$emit('on-echarts-loaded', {
          url: picBase64,
          name: '树状图'
        })
      })
    }
  }
}
</script>

<style></style>
