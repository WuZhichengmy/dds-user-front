<template>
  <div :style="{ height, width }">
    <div :class="config.className" :style="{ height: '100%', width: '100%' }" />
  </div>
</template>

<script>
import echartMixin from './mixins'

export default {
  mixins: [echartMixin],
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    theme: {
      type: Object,
      required: false,
      default: () => {
        return {
          color: '#83bff6',
          color2: '#188df0'
        }
      }
    },
    config: {
      type: Object,
      required: false,
      default: () => {
        return {
          className: 'category',
          title: [
            {
              text: '',
              left: 'center',
              textStyle: {
                fontSize: 15,
                color: '#000'
              }
            }
          ],
          toolbox: {
            show: false,
            orient: 'horizontal'
          },
          legend: {
            show: true,
            type: 'plain',
            orient: 'horizontal',
            left: 'right',
            top: 'bottom'
          },
          xAxis: {
            type: 'category',
            name: '类型',
            nameTextStyle: {
              fontSize: 14
            },
            axisLabel: {
              show: true,
              rotate: 0,
              fontSize: 14,
              interval: 'auto'
            },
            splitLine: {
              show: true
            },
            axisPointer: {
              show: true
            }
          },
          yAxis: {
            type: 'value',
            position: 'left',
            name: '数量',
            nameTextStyle: {
              fontSize: 14
            },
            axisLabel: {
              show: true,
              rotate: 0,
              fontSize: 14,
              interval: 'auto'
            },
            axisLine: {},
            splitLine: {
              show: true
            },
            axisPointer: {
              show: false
            }
          },
          series: [
            {
              barWidth: '50%',
              type: 'bar',
              label: {
                show: false,
                color: '#000',
                fontWeight: 500,
                fontSize: 14,
                position: 'outside'
              },
              markPoint: {
                data: [
                  { type: 'max', name: '最大值' },
                  { type: 'min', name: '最小值' }
                ]
              }
            }
          ]
        }
      }
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      xAxis: {},
      yAxis: {},
      options: [],
      timeLine: [],
      media: [
        {
          query: {
            maxWidth: 500
          },
          option: {
            grid: {
              bottom: 50,
              left: 20,
              right: 60,
              top: 70
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
      ]
    }
  },
  computed: {
    itemColor() {
      return (type = 1) => {
        const { color, color2 } = this.theme
        return new this.echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: type === 1 ? color : color2 },
          { offset: 0.5, color: color2 },
          { offset: 1, color: type === 1 ? color2 : color }
        ])
      }
    }
  },
  watch: {
    theme(n) {
      this.initChart()
    }
  },
  methods: {
    dataClean() {
      const {
        config: { xAxis, yAxis },
        data: { axis, data }
      } = this
      this.xAxis = xAxis
      this.yAxis = yAxis
      xAxis.type === 'category'
        ? (this.xAxis.data = axis)
        : (this.yAxis.data = axis)
      let tempOptions = []
      let tempTimeline = []
      data.map((item, index) => {
        tempOptions.push({
          title: { text: item.title + '资源统计' },
          series: [
            {
              data: item.data,
              itemStyle: {
                color: this.itemColor()
              },
              emphasis: {
                itemStyle: {
                  color: this.itemColor(2)
                }
              }
            }
            // {
            //   data: item.data.map((item, index) => {
            //     return {
            //       name: axis[index],
            //       value: item
            //     }
            //   })
            // }
          ]
        })
        tempTimeline.push(item.title)
      })
      this.options = tempOptions
      this.timeline = tempTimeline
      this.initChart()
    },
    initChart() {
      this.chart = this.echarts.init(this.$el)
      const {
        timeline,
        xAxis,
        yAxis,
        options,
        config: { series }
      } = this
      this.chart.setOption({
        baseOption: {
          timeline: {
            axisType: 'category',
            autoPlay: true,
            playInterval: 3000,
            data: timeline
          },
          title: {
            left: 'center',
            top: '2%',
            textStyle: {
              fontSize: 22,
              color: '#000',
              fontWeight: 500
            }
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255,255,255,1)',
            borderColor: 'rgba(51, 51, 51, 1)',
            borderWidth: 1,
            textStyle: {
              color: '#666'
            },
            axisPointer: {
              type: 'shadow',
              label: {
                show: true,
                formatter: function(params) {
                  return params.value.replace('\n', '')
                }
              }
            }
          },
          calculable: true,
          grid: {
            containLabel: true,
            bottom: 70,
            left: 70,
            right: 90,
            top: 90
          },
          xAxis: {
            ...xAxis,
            // axisLabel: {
            //   interval: 0,
            //   rotate: 0,
            //   width: 80,
            //   overflow: 'truncate'
            // },
            axisTick: {
              alignWithLabel: true
            },
            splitLine: { show: false }
          },
          yAxis,
          series
        },
        options,
        media: this.media
      })
    }
  }
}
</script>
