<template>
  <div class="bar-echarts" style="position: relative">
    <div style="height: 480px; width: 100%; margin: 0 auto" :id="name"></div>
  </div>
</template>

<script>
// import Vue from "vue";
import echarts from 'echarts'

export default {
  name: 'BarChart',
  props: {
    name: String,
    data: Array,
    display: String,
    showMsg: Boolean
  },
  data() {
    return {
      seriesData: [],
      dataAxis: [],
      max: 0,
      isLabelShow: true,
      chart: null,
      displayInfo: {
        horizontal: {
          //横向
          xAxis: {
            type: 'value',
            axisTick: {
              show: true
            },
            axisLine: {
              show: true
            },
            axisLabel: {
              show: true,
              fontSize: 15
            },
            z: 10
          },
          yAxis: {
            type: 'category',
            splitLine: {
              show: false
            },
            axisLine: {
              show: true
            },
            axisTick: {
              show: true
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#000'
              },
              fontSize: 16,
              formatter: function(value) {
                const zhPattern = new RegExp('[\u4E00-\u9FA5]+')
                var str = value
                let length = 0
                for (let i = 0; i < str.length; i++) {
                  if (zhPattern.test(str.charAt(i))) {
                    length += 2
                  } else {
                    length += 1
                  }
                }
                if (length > 15) {
                  str = str.substring(0, 15) + '..'
                }
                return str
              }
            }
          },
          grid: {
            top: 30,
            left: '17%',
            right: 50,
            bottom: 60
          }
        },
        vertical: {
          //竖向
          grid: {
            top: 30,
            left: 80,
            right: 40,
            bottom: '28%'
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              inside: false,
              textStyle: {
                color: '#000'
              },
              fontSize: 16,
              rotate: 45,
              formatter: function(value) {
                const zhPattern = new RegExp('[\u4E00-\u9FA5]+')
                var str = value
                let length = 0
                for (let i = 0; i < str.length; i++) {
                  if (zhPattern.test(str.charAt(i))) {
                    length += 2
                  } else {
                    length += 1
                  }
                }
                if (length > 15) {
                  str = str.substring(0, 15) + '..'
                }
                return str
              }
            },
            axisTick: {
              show: true
            },
            axisLine: {
              show: true
            },
            z: 10
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              fontSize: 17,
              textStyle: {
                color: '#000'
              }
            }
          }
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  computed: {},
  methods: {
    init() {
      this.seriesData = []
      this.dataAxis = []
      let t = 0
      this.data.map((item, index) => {
        // if (index < this.spliceNum) {
        //   if (item.value >= t) {
        //     t = item.value
        //   }
        this.dataAxis.push(item.name)
        this.seriesData.push(item.value)
        // }
      })
      this.max = t
      this.isLabelShow = this.dataAxis.length <= 40 ? true : false
      this.drawEcharts()
    },
    drawEcharts() {
      let obj = this.displayInfo[this.display]
      let keys = Object.keys(obj)
      keys.map(item => {
        if (item !== 'grid' && obj[item].type === 'category') {
          this.displayInfo[this.display][item].data = this.dataAxis
        }
      })
      let orient = this.display === 'vertical' ? 'horizontal' : 'vertical'
      this.chart = echarts.init(document.getElementById(this.name))
      let title = {
        text: ''
      }
      if (this.showMsg) {
        title = {
          text:
            '*由于存在筛选单位与其他单位合作发文的情况，统计单位时，包含其他合作单位',
          bottom: 10,
          right: 10,
          padding: [10, 0, 0, 0],
          textStyle: {
            fontWeight: 500
          }
        }
      }
      var option = {
        title,
        // animation: false,
        tooltip: {
          formatter: function(params) {
            let r = ''
            params.forEach(function(item) {
              r +=
                item.name +
                '<br />' +
                '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#2E97F1;"></span>' +
                item.value +
                '篇' +
                '<br />'
            })
            return r
          },
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: 'rgba(255,255,255,1)',
          textStyle: {
            color: '#000',
            fontWeight: 'bold',
            fontSize: 16,
            padding: 10
          },
          extraCssText: 'box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);',
          borderWidth: 0
        },
        legend: {
          zlevel: 100,
          top: 10,
          data: this.dataAxis
        },
        grid: this.displayInfo[this.display].grid,
        xAxis: this.displayInfo[this.display].xAxis,
        yAxis: this.displayInfo[this.display].yAxis,
        dataZoom: [
          {
            type: 'inside',
            orient: orient
          }
        ],
        series: [
          {
            type: 'bar',
            barWidth: '70%',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ])
              }
            },
            label: {
              show: this.isLabelShow,
              color: '#000',
              fontSize: 16,
              position: this.display === 'vertical' ? 'outside' : 'right'
            },
            data: this.seriesData,
            triggerEvent: true
          }
        ]
      }
      this.chart.setOption(option, true)
      window.addEventListener('resize', () => {
        this.chart.resize()
      })

      this.chart.on('click', params => {
        // this.$router.push({
        //   name: "List",
        //   query: {
        //     type: "paper",
        //     filter_id: this.$store.state.filter["year"],
        //     filter_value: params.name,
        //     page: 1,
        //   },
        // });
      })
      this.chart.on('rendered', params => {
        let picBase64 = this.chart.getDataURL({
          type: 'png',
          backgroundColor: '#fff'
        })
        this.$emit('on-echarts-loaded', {
          url: picBase64,
          name: '柱状图'
        })
      })
    }
  },
  components: {}
}
</script>

<style scoped></style>
