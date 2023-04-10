<template>

</template>

<script>
export default {
  methods: {
    line() {
      const data = {
        title: {
          text: '折线图',
        },
        xAxis: {
          type: 'category',
          name: '年份',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
          name: '发表量',
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
              '378.88',
            ],
          },
          {
            name: '法国',
            data: ['47.71', '49.87', '51.85', '53.19', '62.4', '68.2', '72.3'],
          },
          {
            name: '中国',
            data: ['16.8', '20.3', '20.57', '23.44', '28.37', '37.91', '48.79'],
          },
          {
            name: '日本',
            data: [
              '122.48',
              '125.32',
              '135.22',
              '137.7',
              '143.71',
              '150.16',
              '150.15',
            ],
          },
        ],
      }
    },
    bar() {
      const data = {
        title: {
          text: '柱状图',
        },
        xAxis: {
          type: 'category',
          name: '年份',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
          name: '发表量',
        },
        series: [
          {
            name: 'pageA',
            data: [30, 52, 200, 334, 390, 330, 220],
          },
          {
            name: 'pageB',
            data: [80, 52, 200, 334, 390, 330, 220],
          },
          {
            name: 'pageC',
            data: [30, 52, 200, 334, 390, 330, 220],
          },
        ],
      }
    },
    pie() {
      const data = {
        title: {
          text: '饼图',
        },
        series: [{
          data: [
            {
              name: 'name1',
              value: 100,
            },
            {
              name: 'name2',
              value: 200,
            },
            {
              name: 'name3',
              value: 700,
            },
            {
              name: 'name4',
              value: 700,
            },
          ],
        }],
      }
    },
    bubble() {
      var arr = [
        [0, 0, 5],
        [0, 1, 1],
        [0, 2, 0],
        [0, 3, 0],
        [1, 0, 7],
        [1, 1, 0],
        [1, 2, 0],
        [1, 3, 0],
        [2, 0, 1],
        [2, 1, 1],
        [2, 2, 0],
        [2, 3, 0],
        [3, 0, 7],
        [3, 1, 3],
        [3, 2, 0],
        [3, 3, 100],
      ]
      const data = {
        title: {
          text: '气泡图',
        },
        xAxis: {
          name: '时间',
          data: ['12a', '1a', '2a', '3a'],
        },
        yAxis: {
          name: '星期',
          data: ['Saturday', 'Friday', 'Thursday', 'Wednesday'],
        },
        series: {
          name: '数量',
          data: arr.map((item) => {
            return [item[0], item[1], item[2]]
          }),
        },
      }
    },
    graph() {
      const data = {
        title: {
          text: '关系图',
        },
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
    sankey() {
      const data = {
        title: {
          text: '桑基图',
        },
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
    radar() {
      const data = {
        title: {
          text: '雷达图',
        },
        radar: {
          indicator: [
            { name: 'Sales', max: 10000 },
            { name: 'Administration', max: 20000 },
            { name: 'Information Techology', max: 20000 },
            { name: 'Customer Support', max: 20000 },
            { name: 'Development', max: 20000 },
            { name: 'Marketing', max: 20000 },
          ],
        },
        series: {
          data: [
            {
              value: [5000, 7000, 12000, 11000, 15000, 14000],
              name: 'Allocated Budget',
            },
            {
              value: [4000, 9000, 15000, 15000, 13000, 11000],
              name: 'Expected Spending',
            },
            {
              value: [5500, 11000, 12000, 15000, 12000, 12000],
              name: 'Actual Spending',
            },
          ],
        },
      }
    },
    table() {
      const data = {
        columns: [
          {
            title: '年份',
            key: 'name',
          },
          {
            title: '2010',
            key: '2010',
          },
          {
            title: '2011',
            key: '2011',
          },
          {
            title: '2012',
            key: '2012',
          },
          {
            title: '2013',
            key: '2013',
          },
          {
            title: '2014',
            key: '2014',
          },
          {
            title: '2015',
            key: '2015',
          },
        ],
        data: [
          {
            2010: 1457.86,
            2011: 1447.86,
            2012: 1447.86,
            2013: 1557.86,
            2014: 1557.86,
            2015: 15547.86,
            name: '发表数量',
          },
          {
            2010: 1457.86,
            2011: 1447.86,
            2012: 1447.86,
            2013: 1557.86,
            2014: 1557.86,
            2015: 15547.86,
            name: '发文量',
          },
        ],
      }
    },
    wordcloud() {
      const data = {
        title: {
          text: '词云图',
        },
        series: {
          data: [
            {
              name: '花鸟市场',
              value: 1446,
            },
            {
              name: '汽车',
              value: 928,
            },
            {
              name: '视频',
              value: 906,
            },
            {
              name: '电视',
              value: 825,
            },
            {
              name: 'Lover Boy',
              value: 514,
            },
            {
              name: '动漫',
              value: 486,
            },
            {
              name: '音乐',
              value: 53,
            },
            {
              name: '直播',
              value: 163,
            },
            {
              name: '广播电台',
              value: 86,
            },
            {
              name: '戏曲曲艺',
              value: 17,
            },
            {
              name: '演出票务',
              value: 6,
            },
            {
              name: '给陌生的你听',
              value: 1,
            },
            {
              name: '资讯',
              value: 1437,
            },
            {
              name: '商业财经',
              value: 422,
            },
            {
              name: '娱乐八卦',
              value: 353,
            },
            {
              name: '军事',
              value: 331,
            },
            {
              name: '科技资讯',
              value: 313,
            },
            {
              name: '社会时政',
              value: 307,
            },
            {
              name: '时尚',
              value: 43,
            },
            {
              name: '网络奇闻',
              value: 15,
            },
            {
              name: '旅游出行',
              value: 438,
            },
            {
              name: '景点类型',
              value: 957,
            },
            {
              name: '国内游',
              value: 927,
            },
            {
              name: '远途出行方式',
              value: 908,
            },
            {
              name: '酒店',
              value: 693,
            },
            {
              name: '关注景点',
              value: 611,
            },
            {
              name: '旅游网站偏好',
              value: 512,
            },
            {
              name: '出国游',
              value: 382,
            },
          ],
        },
      }
    },
  },
}
</script>

<style>
</style>
