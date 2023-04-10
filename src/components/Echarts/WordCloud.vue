<template>
  <div :style="{ height, width }">
    <div class="inherit" />
  </div>
</template>

<script>
import mixin from './mixins'
require('echarts-wordcloud')

export default {
  name: 'WordCloud',
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
          title: '词云图',
          series: {
            data: [
              {
                name: '花鸟市场',
                value: 1446
              },
              {
                name: '汽车',
                value: 928
              },
              {
                name: '视频',
                value: 906
              },
              {
                name: '电视',
                value: 825
              },
              {
                name: 'Lover Boy',
                value: 514
              },
              {
                name: '动漫',
                value: 486
              },
              {
                name: '音乐',
                value: 53
              },
              {
                name: '直播',
                value: 163
              },
              {
                name: '广播电台',
                value: 86
              },
              {
                name: '戏曲曲艺',
                value: 17
              },
              {
                name: '演出票务',
                value: 6
              },
              {
                name: '给陌生的你听',
                value: 1
              },
              {
                name: '资讯',
                value: 1437
              },
              {
                name: '商业财经',
                value: 422
              },
              {
                name: '娱乐八卦',
                value: 353
              },
              {
                name: '军事',
                value: 331
              },
              {
                name: '科技资讯',
                value: 313
              },
              {
                name: '社会时政',
                value: 307
              },
              {
                name: '时尚',
                value: 43
              },
              {
                name: '网络奇闻',
                value: 15
              },
              {
                name: '旅游出行',
                value: 438
              },
              {
                name: '景点类型',
                value: 957
              },
              {
                name: '国内游',
                value: 927
              },
              {
                name: '远途出行方式',
                value: 908
              },
              {
                name: '酒店',
                value: 693
              },
              {
                name: '关注景点',
                value: 611
              },
              {
                name: '旅游网站偏好',
                value: 512
              },
              {
                name: '出国游',
                value: 382
              }
            ]
          }
        }
      }
    }
  },
  data() {
    return {
      chart: null,
      baseConfig: {
        backgroundColor: '#fff',
        title: {
          show: false,
          left: 'center',
          textStyle: {
            fontSize: '100%',
            color: '#000'
          }
        },
        tooltip: {},
        toolbox: {
          show: false,
          orient: 'horizontal',
          itemSize: 15,
          itemGap: 10,
          left: '80%',
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
        series: {
          type: 'wordCloud',
          width: '100%',
          height: '100%',
          gridSize: 15,
          sizeRange: [0, 60],
          rotationRange: [0, 20],
          textStyle: {
            normal: {
              color: function() {
                return (
                  'rgb(' +
                  Math.round(Math.random() * 220) +
                  ', ' +
                  Math.round(Math.random() * 200) +
                  ', ' +
                  Math.round(Math.random() * 100) +
                  ')'
                )
              }
            }
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
            series: {}
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
