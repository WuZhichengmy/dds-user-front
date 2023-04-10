<template>
  <div class="containter">
    <p v-if="data">{{ data.title }}</p>
    <div class="table-item" :style="{ width }">
      <Table
        :columns="table.columns"
        border
        :data="table.data"
        class="table-items"
        :disabled-hover="false"
      />
    </div>
  </div>
</template>

<script>
import { eventBus } from '@/main'

export default {
  name: 'TableItem',
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
    },
    config: {
      type: Object,
      required: false,
      default: () => {
        columns: {
          key: 'year'
        }
      }
    },
    data: {
      type: Object,
      required: false,
      default: () => {
        return {
          columns: [
            {
              title: '年份',
              key: 'name'
            },
            {
              title: '2010',
              key: '2010'
            },
            {
              title: '2011',
              key: '2011'
            },
            {
              title: '2012',
              key: '2012'
            },
            {
              title: '2013',
              key: '2013'
            },
            {
              title: '2014',
              key: '2014'
            },
            {
              title: '2015',
              key: '2015'
            }
          ],
          data: [
            {
              2010: 1457.86,
              2011: 1447.86,
              2012: 1447.86,
              2013: 1557.86,
              2014: 1557.86,
              2015: 15547.86,
              name: '发表数量'
            },
            {
              2010: 1457.86,
              2011: 1447.86,
              2012: 1447.86,
              2013: 1557.86,
              2014: 1557.86,
              2015: 15547.86,
              name: '发文量'
            }
          ]
        }
      }
    }
  },
  data() {
    return {
      basecConfig: {
        align: 'center',
        width: 100
      },
      table: {
        columns: [],
        data: []
      }
    }
  },
  mounted() {
    this.dataClean()
  },
  methods: {
    dataClean() {
      let { basecConfig, config, data } = this
      // if (typeof config === 'string') {
      //   config = JSON.parse(config)
      // }
      const columns = []
      data.columns.map((item, index) => {
        columns.push({
          ...item,
          key: item.key + '',
          title: item.title + '',
          ...basecConfig,
          ...config,
          fixed: index !== 0 ? 'center' : 'left'
        })
      })
      this.table = {
        ...data,
        columns
      }
      this.$nextTick(() => {
        eventBus.$emit('on-loaded')
      })
    }
  }
}
</script>

<style scoped>
.containter p {
  text-align: center;
  font-size: 15px;
  padding-bottom: 10px;
}
.table-item {
  overflow-x: auto;
  display: flex;
  justify-content: center;
}
.table-items {
  max-width: 900px;
  margin: 0 auto;
}
.table-items >>> .ivu-table:before {
  background-color: transparent;
}
</style>
