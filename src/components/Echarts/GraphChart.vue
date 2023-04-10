<template>
  <div :style="{ height, width }">
    <div class="inherit" />
  </div>
</template>

<script>
import mixin from './mixins'
// let data = require('./data.json')
// let links = require('./link.json')
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
    data: {
      type: Object,
      required: false,
      default: () => {
        return {
          title: '关系图',
          series: {
            data: [
              {
                name: 'Annelli Sandbæk(10)',
                value: 10,
                symbolSize: 9.486832980505138,
              },
              {
                name: 'Torsten Lauritzen(15)',
                value: 15,
                symbolSize: 11.618950038622252,
              },
              {
                name: '杨跃进(24)',
                value: 24,
                symbolSize: 14.696938456699067,
              },
              {
                name: '吴永健(23)',
                value: 23,
                symbolSize: 14.387494569938157,
              },
              {
                name: '徐波(11)',
                value: 11,
                symbolSize: 9.9498743710662,
              },
            ],
            links: [
              {
                source: 'Annelli Sandbæk(10)',
                target: 'Torsten Lauritzen(15)',
                value: '10',
              },
              {
                source: '杨跃进(24)',
                target: '徐波(11)',
                value: '10',
              },
              {
                source: '吴永健(23)',
                target: '陈纪林(12)',
                value: '10',
              },
              {
                source: '杨慧霞(54)',
                target: '孙伟杰(10)',
                value: '10',
              },
              {
                source: 'Fereidoun Azizi(14)',
                target: 'Farzad Hadaegh(11)',
                value: '10',
              },
              {
                source: '王守力(10)',
                target: '韩雅玲(15)',
                value: '10',
              },
              {
                source: '王天松(11)',
                target: '李新明(14)',
                value: '10',
              },
              {
                source: '裴汉军(11)',
                target: '宋光远(14)',
                value: '10',
              },
              {
                source: '陈纪林(12)',
                target: '乔树宾(17)',
                value: '10',
              },
              {
                source: 'Shoichiro Tsugane(15)',
                target: 'Manami Inoue(10)',
                value: '10',
              },
              {
                source: 'Peter Rossing(12)',
                target: 'Hans-Henrik Parving(12)',
                value: '10',
              },
              {
                source: '王薇(26)',
                target: '孙佳艺(11)',
                value: '10',
              },
              {
                source: '宋光远(14)',
                target: '杨跃进(24)',
                value: '10',
              },
            ],
          },
        }
      },
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
          type: 'graph',
          layout: 'force',
          focusNodeAdjacency: true,
          roam: true,
          left: 'center',
          draggable: true,
          lineStyle: {
            width: 1,
            color: '#dedede',
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
          edgeSymbolSize: 12,
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
          lineStyle: {
            normal: {
              opacity: 0.9,
              curveness: 0.3,
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
      const { data } = this
      const text = data.title
      data.title = {
        text,
      }
      this.initChart(data)
    },
    // initChart() {
    //   this.chart = echarts.init(this.$el, 'macarons', {
    //     renderer: 'canvas',
    //   })
    //   let categories = ['关键词']
    //   this.chart.setOption({
    //     title: {
    //       // text: '一个关联分析结果'
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
    //           if (
    //             _this.query.searchType === 'SCHOLARS_COOPERATION_NETWORK_ATLAS'
    //           ) {
    //             return params.marker + params.name
    //           } else {
    //             return params.marker + params.name + ': ' + params.value
    //           }
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
    //         categories,
    //         data,
    //         links,
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
    //             borderColor: '#fff',
    //             borderWidth: 1,
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
    //         lineStyle: {
    //           normal: {
    //             opacity: 0.9,
    //             curveness: 0.3,
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
.border {
  border: 1px solid #e8eaec;
}
.noBorder {
  border: 0 !important;
}

.notice {
  text-align: left;
  line-height: 22px;
  font-size: 14px;
  margin-left: 2.2%;
}
</style>
