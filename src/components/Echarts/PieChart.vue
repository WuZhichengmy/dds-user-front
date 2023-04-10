<template>
  <div :style="{ height, width }">
    <div class="inherit" />
  </div>
</template>

<script>
import mixin from './mixins'

export default {
  name: 'PieChart',
  mixins: [mixin],
  props: {
    config: {
      type: Object,
      required: false,
      default: () => {}
    },
    data: {
      type: Object,
      required: false,
      default: () => {
        return {
          title: '饼图',
          series: {
            data: [
              {
                name: 'name1',
                value: 100
              },
              {
                name: 'name2',
                value: 200
              },
              {
                name: 'name3',
                value: 700
              },
              {
                name: 'name4',
                value: 700
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
        title: {
          left: 'center',
          textStyle: {
            fontSize: '100%',
            color: '#000'
          }
        },
        toolbox: {
          show: true,
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
        tooltip: {
          show: true,
          trigger: 'item',
          triggerOn: 'mousemove|click',
          axisPointer: {
            type: 'line'
          },
          textStyle: {
            fontSize: '100%'
          },
          borderWidth: 0,
          formatter: '{b}: {c}({d}%)'
        },
        legend: {
          show: true,
          type: 'scroll',
          orient: 'horizontal',
          left: 'right',
          top: 'bottom'
        },
        series: {
          type: 'pie',
          label: {
            show: true,
            fontSize: '100%',
            formatter: '{b}: {c}({d}%)',
            position: 'outer',
            alignTo: 'labelLine'
          },
          radius: ['0%', '75%'],
          center: ['50%', '50%']
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
            series: {
              label: {
                position: 'inner'
              },
              labelLine: {
                show: false
              },
              emphasis: {
                labelLine: {
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
        text
      }
      this.initChart(data)
    }
  }
}
</script>
