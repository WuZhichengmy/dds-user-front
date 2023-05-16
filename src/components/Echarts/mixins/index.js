// echarts mixin
import echarts from 'echarts'

import 'echarts/theme/macarons'
import 'echarts/theme/shine'
import 'echarts/theme/vintage'
import 'echarts/theme/infographic'
import 'echarts/theme/azul'
import '@/assets/js/echarts/purple'
import '@/assets/js/echarts/westeros'

import { eventBus } from '@/main'

import { debounce } from '@/utils'

export default {
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    theme: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      echarts,
      chart: null,
      current: {
        options: {}
      }
    }
  },
  watch: {
    theme: {
      handler() {
        this.chart.dispose()
        this.chart = null
        this.initChart()
      }
    }
  },
  mounted() {
    this.dataClean()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
    if (this.chart) {
      this.chart.dispose();
      this.chart = null
    }
  },
  methods: {
    initChart(data = null) {
      const { media, baseConfig, config, theme, $el } = this
      this.chart = this.echarts.init($el, theme, {
        renderer: 'canvas'
      })
      this.chart.off();
      this.chart.on('finished', () => {
        eventBus.$emit('on-loaded')
      })
      this.chart.off();
      this.chart.on('rendered', params => {
        let picBase64 = this.chart.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#fff'
        })
        this.$emit('on-echarts-loaded', {
          url: picBase64
        })
      })
      window.addEventListener('resize', () => {
        this.chart.resize()
      })
      if (data) {
        this.current.options = {
          baseOption: this.baseOption({
            baseConfig,
            config,
            data
          }),
          media: media.map(item => {
            return {
              ...item,
              option: this.setMedia(data, item)
            }
          })
        }
      }
      this.chart.clear();
      this.chart.setOption(this.current.options);
    },
    // 处理图表基本配置
    baseOption({ baseConfig, config, data }) {
      const baseOption = {
        ...baseConfig
      }
      Object.keys(baseConfig).map(key => {
        let flag = false
        let temp = {}
        if (data[key] && data[key].length) {
          const arr = []
          data[key].map(item => {
            let obj = {
              ...baseConfig[key],
              ...item
            }
            if (config[key]) {
              obj = {
                ...obj,
                ...config[key]
              }
            }
            arr.push(obj)
          })
          baseOption[key] = arr
          flag = true
        }
        if (!flag) {
          temp = {
            ...(config[key] ? config[key] : {}),
            ...(data[key] ? data[key] : {})
          }
          Object.keys(temp).length > 0
            ? (baseOption[key] = {
                ...baseOption[key],
                ...temp
              })
            : null
        }
      })
      // console.log(data, baseOption)
      return baseOption
    },
    // 处理图表移动端适应配置
    setMedia(data, media) {
      const base = {}
      Object.keys(media.option).map(key => {
        if (data[key] && data[key].length) {
          const arr = []
          data[key].map(item => {
            arr.push(media.option[key])
          })
          base[key] = arr
        } else {
          base[key] = media.option[key]
        }
      })
      return base
    }
  }
}
