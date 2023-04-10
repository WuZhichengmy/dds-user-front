<template>
  <div class="chart-select-item">
    <Collapse accordion class="chart-select-item-collapse">
      <Panel name="1">
        <span> 资源统计 </span>
        <div slot="content" class="collapse-content-wrapper">
          <Collapse simple>
            <Panel v-for="(item, index) in data" :key="index + 'selectItem'">
              <span class="items-collspse-header">{{ item.chinese_name }}</span>
              <p slot="content" class="items-collspse-content">
                <CheckboxGroup
                  style="padding-left: 10px"
                >
                  <Checkbox
                    v-for="(items, i) in item.items"
                    :key="items.name"
                    :label="item.data_table_filter_id + '-' + items.name"
                  >
                    <span class="checkbox-items">{{
                      items.name + ' (' + items.total + '条)'
                    }}</span>
                  </Checkbox>
                </CheckboxGroup>
              </p>
            </Panel>
          </Collapse>
        </div>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
export default {
  name: 'SelectItem',
  props: {
    data: {
      type: Array,
      required: false,
      default: () => [
        {
          data_table_filter_id: 0,
          field_name: 'year',
          chinese_name: '年份',
          association_table_name: '',
          model: '',
          items: [
            {
              name: '新闻2010',
              total: 100,
            },
            {
              name: '2011',
              total: 100,
            },
            {
              name: '2012',
              total: 100,
            },
            {
              name: '2013',
              total: 100,
            },
            {
              name: '2014',
              total: 100,
            },
            {
              name: '2015',
              total: 100,
            },
            {
              name: '2016',
              total: 100,
            },
            {
              name: '新闻2010',
              total: 100,
            },
            {
              name: '20d1',
              total: 100,
            },
            {
              name: '2d12',
              total: 100,
            },
            {
              name: '2ee3',
              total: 100,
            },
            {
              name: '2dd4',
              total: 100,
            },
            {
              name: '20ee',
              total: 100,
            },
            {
              name: '20ww',
              total: 100,
            },
          ],
        },
        {
          data_table_filter_id: 1,
          field_name: 'org',
          chinese_name: '机构',
          model: '',
          association_table_name: '',
          items: [
            {
              name: '机构1',
              total: 100,
            },
            {
              name: '机构2',
              total: 100,
            },
            {
              name: '机构3',
              total: 100,
            },
            {
              name: '机构4',
              total: 100,
            },
            {
              name: '机构5',
              total: 100,
            },
            {
              name: '机构6',
              total: 100,
            },
            {
              name: '机构7',
              total: 100,
            },
          ],
        },
      ],
    },
  },
  data() {
    return {
      value: null,
    }
  },
  computed: {},
}
</script>

<style scoped>
.chart-select-item {
  --line-height: 45px;
  background: #f1f1f1;
  line-height: var(--line-height);
}
.chart-select-item .chart-select-item-collapse {
  background: #f1f1f1;
  line-height: var(--line-height);
  border-top-color: transparent;
}

.chart-select-item .chart-select-item-collapse >>> .ivu-collapse-header {
  line-height: var(--line-height);
  height: var(--line-height);
}

.chart-select-item >>> .ivu-collapse-content,
.chart-select-item >>> .ivu-collapse-content > .ivu-collapse-content-box {
  padding: 0;
}
.chart-select-item .collapse-content-wrapper {
  max-height: 250px;
  overflow: auto;
}
/* 选择框 */

/* 按钮 */
.btn-items {
  width: 100px;
}
.btn-items button {
  width: 100%;
  font-size: 15px;
  height: 40px;
  font-weight: 600;
  color: var(--theme);
  border-color: var(--theme);
}
.btn-items button:hover {
  background: var(--theme);
  color: #fff;
}
</style>
