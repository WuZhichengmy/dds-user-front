<template>
  <div :style="{ height:'600px', width }">
    <div class="inherit" />
  </div>
</template>

<script>
import mixin from './mixins'
export default {
  name: 'GraphChart',
  mixins: [mixin],
  props: {
    config: {
      type: Object,
      required: false,
      default: () => {
        return {}
      },
    },
    shareItem: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      baseConfig: {
        title: {
          left: 'center',
          top: 0,
          textStyle: {
            fontSize: '100%',
            color: '#000',
          },
        },
        tooltip: {
          show: true,
          trigger: 'item',
          triggerOn: 'mousemove|click',
          formatter: function (params) {
            const { dataType, data } = params
            if (dataType === 'node') {
              return `${params.marker}
              ${data.name} :
              ${data.value}`
            } else if (dataType === 'edge') {
              return `${data.source} -
              ${data.value} -
              ${data.target}`
            }
          },
        },
        series: {
          categories: {},
          data: {},
          links: {},
          type: 'graph',
          layout: 'force',
          focusNodeAdjacency: true,
          roam: true,
          left: 'center',
          draggable: true,
          lineStyle: {
            width: 1,
            color: '#7c7c7c',
            opacity: 0.9,
            curveness: 0.3,
          },
          zoom: 1,
          legendHoverLink: true,
          hoverAnimation: true,
          label: {
            normal: {
              show: true,
              position: 'top',
            },
          },
          edgeSymbolSize: [4, 12],
          edgeLabel: {
            normal: {
              textStyle: {
                fontSize: '100%',
              },
            },
          },
          emphasis: {
            lineStyle: {
              color: '#000',
            },
          },
          force: {
            repulsion: 200,
            gravity: 0.1,
            edgeLength: 150,
          },
          itemStyle: {
            normal: {
              borderColor: '#fff',
              borderWidth: 1,
              color: function (params) {
                var colors = [
                  '#fda67e',
                  '#81cacc',
                  '#cca8ba',
                  '#88cc81',
                  '#82a0c5',
                  '#fddb7e',
                  '#735ba1',
                  '#bda29a',
                  '#6e7074',
                  '#546570',
                ]
                return colors[Math.floor(Math.random() * 10) + 1]
              },
            },
          },
        },
      },
      media: [
        {
          query: {
            maxWidth: 500,
          },
          option: {
            toolbox: {
              itemSize: '12',
            },
            series: {},
          },
        },
      ],
    }
  },
  methods: {
    dataClean() {
      const text = this.shareItem.data.title
      this.shareItem.data.title = {
        text,
      }
      this.initChart(this.shareItem.data)
    },
    dataRefresh() {
      this.initChart(this.shareItem.data)
    }

    // initChart(data) {
    //   this.chart = echarts.init(this.$el, 'macarons', {
    //     renderer: 'canvas',
    //   })
    //   this.chart.setOption({
    //     title: {
    //       text: data.title
    //     },
    //     tooltip: {
    //       show: true,
    //       formatter: function (params) {
    //         if (params.data.source) {
    //           return (
    //             params.data.source +
    //             '-' +
    //             params.data.target +
    //             ': ' +
    //             params.data.value
    //           )
    //         } else {
    //             return params.marker + params.name + ': ' + params.value
    //         }
    //       },
    //     },
    //     animationDuration: 1500,
    //     animationEasingUpdate: 'quinticInOut',
    //     series: [
    //       {
    //         type: 'graph',
    //         layout: 'force', //'circular','force'
    //         focusNodeAdjacency: true, //当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点
    //         roam: true,
    //         left: 'center',
    //         // nodeScaleRatio: 0.8,
    //         draggable: true, //指示节点是否可以拖动
    //         categories: data.categories,
    //         data: data.data,
    //         links: data.links,
    //         // zoom: zoom,
    //         legendHoverLink: true,
    //         hoverAnimation: true,
    //         label: {
    //           normal: {
    //             show: true,
    //             position: 'top',
    //           },
    //         },
    //         // edgeSymbol: ['none', 'arrow'],
    //         edgeSymbolSize: 12,
    //         edgeLabel: {
    //           normal: {
    //             textStyle: {
    //               fontSize: '100%',
    //             },
    //           },
    //         },
    //         emphasis: {
    //           lineStyle: {
    //             color: '#000',
    //           },
    //         },
    //         force: {
    //           repulsion: 200, //200
    //           gravity: 0.1,
    //           edgeLength: 150,
    //         },
    //         itemStyle: {
    //           normal: {
    //             lineStyle: {
    //               opacity: 0.9,
    //               curveness: 0.3,
    //               color: 'source',
    //             },
    //             borderColor: '#fff',
    //             // shadowBlur: 10,
    //             color: function (params) {
    //               // if (Vue.ls.get('echartsTheme') === 'blue') {
    //               var colors = [
    //                 '#fda67e',
    //                 '#81cacc',
    //                 '#cca8ba',
    //                 '#88cc81',
    //                 '#82a0c5',
    //                 '#fddb7e',
    //                 '#735ba1',
    //                 '#bda29a',
    //                 '#6e7074',
    //                 '#546570',
    //                 // "#c4ccd3",
    //               ]
    //               // } else if (Vue.ls.get('echartsTheme') === 'roma') {
    //               //   var colors = [
    //               //     '#516B91',
    //               //     '#59C4E6',
    //               //     '#EDAFDA',
    //               //     '#93B7E3',
    //               //     '#A5E7F0',
    //               //     '#CBB0E3',
    //               //     '#314656',
    //               //     '#8DC1A9',
    //               //     '#7cb4cc',
    //               //     '#26C0C0',
    //               //   ]
    //               // } else {
    //               //   var colors = [
    //               //     '#C1232B',
    //               //     '#27727B',
    //               //     '#FCCE10',
    //               //     '#E87C25',
    //               //     '#B5C334',
    //               //     '#FE8463',
    //               //     '#9BCA63',
    //               //     '#FAD860',
    //               //     '#F3A43B',
    //               //     '#60C0DD',
    //               //     // '#D7504B',
    //               //     // '#C6E579',
    //               //     // '#F4E001',
    //               //     // '#F0805A',
    //               //     // '#26C0C0'
    //               //   ]
    //               // }
    //               return colors[Math.floor(Math.random() * 10) + 1]
    //             },
    //           },
    //         },
    //       },
    //     ],
    //   })
    // },
  },
}
</script>

<style scoped>
/*.border {*/
/*  border: 1px solid #e8eaec;*/
/*}*/
/*.noBorder {*/
/*  border: 0 !important;*/
/*}*/

.notice {
  text-align: left;
  line-height: 22px;
  font-size: 14px;
  margin-left: 2.2%;
}
</style>
