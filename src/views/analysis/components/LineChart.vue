<template>
  <div :style="{ height, width }">
    <div class="inherit" />
  </div>
</template>

<script>
import mixin from '@/components/Echarts/mixins'

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
      type: Object | Array,
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
            }
          ]
        }
      }
    }
  },
  data() {
    return {
      baseConfig: {
        title: {
          show: true
        },
        legend: {
          show: false,
          top: 'bottom',
          left: 'right',
          type: 'plain',
          orient: 'horizontal',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          show: true,
          trigger: 'item',
          triggerOn: 'mousemove|click',
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
        xAxis: {
          show: true,
          scale: false,
          nameLocation: 'end',
          nameTextStyle: {
            show: true,
            position: 'top',
            margin: 8,
            fontSize: 16
          },
          axisLabel: {
            show: true,
            position: 'top',
            margin: 8,
            fontSize: 16,
            rotate: 45,
            color: '#000',
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
          inverse: false,
          offset: 0,
          minInterval: 0,
          axisTick: {
            show: true
          },
          splitLine: {
            show: false,
            lineStyle: {
              width: 1,
              opacity: 1,
              curveness: 0,
              type: 'solid'
            }
          }
        },
        grid: {
          top: 30,
          left: 80,
          right: 40,
          bottom: '28%'
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          }
        ],
        yAxis: {
          show: true,
          scale: false,
          nameLocation: 'end',
          nameGap: 15,
          axisTick: {
            show: true
          },
          nameTextStyle: {
            show: true,
            position: 'top',
            margin: 5,
            fontSize: 16
          },
          axisLabel: {
            show: true,
            position: 'top',
            margin: 8,
            fontSize: 17,
            color: '#000'
          },
          inverse: false,
          offset: 0,
          // splitNumber: 5,
          // minInterval: 0,
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              opacity: 1,
              curveness: 0,
              type: 'solid'
            }
          }
        },
        toolbox: {
          show: false,
          orient: 'horizontal',
          itemSize: '15',
          itemGap: 10,
          top: 20,
          feature: {
            saveAsImage: {
              show: true,
              title: 'save as image',
              type: 'png'
            },
            restore: {
              show: true,
              title: 'restore'
            },
            magicType: {
              type: ['line', 'bar', 'stack', 'tiled']
            },
            dataView: {
              show: true,
              title: 'data view',
              readOnly: false
            },
            dataZoom: {
              show: true,
              title: {
                zoom: 'data zoom',
                back: 'data zoom restore'
              }
            }
          }
        },
        series: {
          type: 'line',
          connectNulls: false,
          symbol: 'emptyCircle',
          symbolSize: 12,
          showSymbol: true,
          smooth: false,
          step: false,
          hoverAnimation: true,
          label: {
            show: true,
            position: 'top',
            margin: 5,
            color: '#000',
            fontSize: 16
          },
          lineStyle: {
            width: 3,
            opacity: 1,
            curveness: 0,
            type: 'solid'
          },
          areaStyle: {
            opacity: 0
          }
        }
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
    init() {
      const { data } = this
      const data2 = {
        title: '',
        xAxis: {
          type: 'category',
          data: data.map(item => item.name)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '',
            data: data.map(item => item.value)
          }
        ]
      }
      this.dataClean(data2)
    },
    dataClean(data = this.data) {
      const text = data.title
      let title = {
        text: ''
      }
      data.title = title
      this.initChart(data)
    }
  }
}
</script>

<style scoped></style>
