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
      },
    },
    data: {
      type: Object,
      required: false,
      default: () => {
        return {
          title: '桑基图',
          series: {
            data: [
              {
                name: 'a',
              },
              {
                name: 'b',
              },
              {
                name: 'a1',
              },
              {
                name: 'a2',
              },
              {
                name: 'b1',
              },
              {
                name: 'c',
              },
            ],
            links: [
              {
                source: 'a',
                target: 'a1',
                value: 5,
              },
              {
                source: 'a',
                target: 'a2',
                value: 3,
              },
              {
                source: 'b',
                target: 'b1',
                value: 8,
              },
              {
                source: 'a',
                target: 'b1',
                value: 3,
              },
              {
                source: 'b1',
                target: 'a1',
                value: 1,
              },
              {
                source: 'b1',
                target: 'c',
                value: 2,
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
            fontSize: '120%',
            color: '#000',
          },
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
              type: 'png',
            },
            restore: {
              show: true,
              title: 'restore',
            },
            dataView: {
              show: true,
              title: 'data view',
              readOnly: false,
            },
            dataZoom: {
              show: true,
              title: {
                zoom: 'data zoom',
                back: 'data zoom restore',
              },
            },
          },
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',
          textStyle: {
            fontSize: '100%',
          },
        },
        series: {
          type: 'sankey',
          layout: 'none',
          focusNodeAdjacency: 'allEdges',
          left: 'center',
          width: '80%',
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
  },
}
</script>
