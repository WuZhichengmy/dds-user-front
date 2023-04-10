<template>
  <div :style="{ height, width }">
    <div class="inherit" />
  </div>
</template>

<script>
import mixin from '@/components/Echarts/mixins'

export default {
  name: 'PieChart',
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
    },
    showMsg: Boolean
  },
  data() {
    return {
      baseConfig: {
        title: {
          show: true
          // right: 0,
          // textStyle: {
          //   fontSize: '100%',
          //   color: '#000'
          // }
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
          borderWidth: 0,
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
          show: true,
          type: 'scroll',
          orient: 'horizontal',
          left: 'right',
          top: 'bottom',
          // bottom: 40,
          textStyle: {
            color: '#000',
            fontSize: 15
          }
        },
        series: {
          type: 'pie',
          label: {
            show: true,
            fontSize: 17,
            formatter: '{b}: {c}({d}%)',
            position: 'outer',
            alignTo: 'labelLine'
          },
          radius: ['0%', '70%'],
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
                show: false,
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
    init() {
      const data = {
        title: '',
        series: {
          data: this.data
        }
      }
      this.dataClean(data)
    },
    dataClean(data = this.data) {
      const text = data.title
      let title = {
        text: ''
      }
      if (this.showMsg) {
        title = {
          text:
            '*由于存在筛选单位与其他单位合作发文的情况，统计单位时，包含其他合作单位',
          bottom: 10,
          right: 10,
          padding: [10, 0, 0, 0]
        }
      }
      data.title = title
      this.initChart(data)
    }
  }
}
</script>
