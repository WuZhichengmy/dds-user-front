import {
  Enum
} from './Enum'

export default {
  // 页面中文名称
  pageCnName: new Enum()
    .add('List', 'List', '列表')
    .add('Search', 'Search', '检索')
    .add('list', 'list', '列表')
    .add('search', 'search', '检索')
    .add('Detail', 'Detail', '详情')
    .add('Analytices', 'Analytices', '数据可视化分析')
    .add('AnalyticesDetail', 'AnalyticesDetail', '数据可视化分析'),

  // 资源类型中文名称
  typeCnName: new Enum()
    .add('all', 'all', '全部')
    .add('news', 'news', '新闻')
    .add('paper', 'paper', '论文')
    .add('patent', 'patent', '专利'),

  // author字段名称
  auhtorName: new Enum()
    .add('all', 'all', '作者')
    .add('news', 'news', '作者')
    .add('paper', 'paper', '作者')
    .add('patent', 'patent', '发明者'),

  // content字段名称
  contentName: new Enum()
    .add('all', 'all', '详情')
    .add('news', 'news', '详情')
    .add('paper', 'paper', '摘要')
    .add('patent', 'patent', '介绍'),

  // 字段名称转换
  fieldEnName: new Enum()
    .add('all', '全部', 'all')
    .add('news', '新闻', 'news')
    .add('paper', '论文', 'paper')
    .add('patent', '专利', 'patent'),

  //排序图标
  orderIcon: new Enum()
    .add('asc', 0, 'M569.508769 653.352619l151.594419 0 0 108.819221-151.594419 0L569.508769 653.352619zM569.508769 65.693452l385.479045 0 0 108.828814L569.508569 174.522266 569.508769 65.693452 569.508769 65.693452zM569.508769 261.583239l307.513506 0 0 108.819021L569.508769 370.402259 569.508769 261.583239 569.508769 261.583239zM569.508769 457.463032l229.552363 0 0 108.821019-229.552363 0C569.508769 566.284051 569.508769 457.463032 569.508769 457.463032zM569.508769 849.232612l73.62868 0 0 108.826815-73.62868 0L569.508769 849.232612zM354.693414 427.846912l0 530.212516L203.94622 958.059428 203.94622 427.846912 62.754748 427.846912 279.308125 65.187795 495.87849 427.846912 354.693414 427.846912z')
    .add('desc', 1, 'M279.15323 958.059228l217.110799-363.160177-141.539436 0L354.724593 63.957829l-151.123938 0 0 530.943021L62.057421 594.900849 279.15323 958.059228 279.15323 958.059228zM570.078783 64.464885l386.443791 0 0 108.976114L570.078583 173.440999 570.078783 64.464885 570.078783 64.464885zM570.078783 369.594007 878.364965 369.594007l0-108.974515L570.078783 260.619492 570.078783 369.594007zM570.078783 565.747016l230.128573 0 0-108.976114L570.078783 456.770901 570.078783 565.747016 570.078783 565.747016zM570.078783 761.904621l151.972163 0L722.050945 652.930305l-151.972163 0L570.078783 761.904621zM570.078783 958.059228l73.813355 0 0-108.974315-73.813355 0L570.078783 958.059228z'),
  //页面对应中文名称
  pageCnName: new Enum()
    .add('home', 'home', '首页')
    .add('search', 'search', '资源检索')
    .add('list', 'list', '资源列表')
    .add('detail', 'detail', '详情')
    .add('analysis', 'analysis', '结果分析')
    .add('report', 'report', '分析报告'),

  //组件类型
  widgetTypes: new Enum()
    .add('banner', 'banner', 0)
    .add('list', 'list', 1)
    .add('carousel', 'carousel', 2)
    .add('hotwords', 'hotwords', 3)
    .add('panelGroup', 'panelGroup', 4)
    .add('logo', 'logo', 5)
    .add('copyright', 'copyright', 6)
    .add('leaderBoard', 'leaderBoard', 7)
    .add('category', 'category', 8),

  echartWidgetTypes: new Enum()
    .add(-1, 'Information', -1)
    .add(0, 'LineChart', 0)
    .add(1, 'BarChart', 1)
    .add(2, 'PieChart', 2)
    .add(3, 'GraphChart', 3)
    .add(4, 'BubbleChart', 4)
    .add(5, 'Sankey', 5)
    .add(6, 'RadarChart', 6)
    .add(7, 'TableItem', 7)
    .add(8, 'WordCloud', 8)
    .add(9,'MultiPart', 9)
}
