import Mock from 'mockjs'
let newsDetail = "",
  newsDetailFields = "",
  paperDetail = "",
  paperDetailFields = "",
  newsSearchResult = "",
  newsSearchFields = "",
  paperSearchResult = "",
  paperSearchFields = "",
  resources = "",
  banner = "",
  carousel = "",
  copyright = "",
  hotwords = "",
  leaderBoard = "",
  homeList = "",
  logo = "",
  panelGroup = "",
  statistics = "",
  analysisFields = "",
  analysisData = "",
  gradeSearchConfig = "";

// 项目数据资源
// import("./data/resources.json").then((module) => {
//   resources = module
// })

// 组件
import("./data/widgets/banner.json").then((module) => {
  carousel = module
})
// import("./data/widgets/carousel.json").then((module) => {
//   carousel = module
// })
import("./data/widgets/copyright.json").then((module) => {
  copyright = module
})
import("./data/widgets/hotwords.json").then((module) => {
  hotwords = module
})
import("./data/widgets/leaderBoard.json").then((module) => {
  leaderBoard = module
})
import("./data/widgets/list.json").then((module) => {
  homeList = module
})
import("./data/widgets/logo.json").then((module) => {
  logo = module
})
import("./data/widgets/panelGroup.json").then((module) => {
  panelGroup = module
})
import("./data/widgets/statistics.json").then((module) => {
  statistics = module
})
// 详情
import("./data/detail/paper/data.json").then((module) => {
  paperDetail = module
})
import("./data/detail/paper/fields.json").then((module) => {
  paperDetailFields = module
})
import("./data/detail/news/data.json").then((module) => {
  newsDetail = module
})
import("./data/detail/news/fields.json").then((module) => {
  newsDetailFields = module
})

// 检索
import("./data/search/paper/data.json").then((module) => {
  paperSearchResult = module
})
import("./data/search/paper/fields.json").then((module) => {
  paperSearchFields = module
})
import("./data/search/news/data.json").then((module) => {
  newsSearchResult = module
})
import("./data/search/news/fields.json").then((module) => {
  newsSearchFields = module
})

// 字段分析
// import("./data/analysis/fields.json").then((module) => {
//   analysisFields = module
// })
// import("./data/analysis/data.json").then((module) => {
//   analysisData = module
// })

// 高级检索字段
// import("./data/gradeSearchConfig.json").then((module) => {
//   gradeSearchConfig = module
// })

// Mock.mock(new RegExp("^/resource/gradeSearch/config$"), (options) => {
//   console.log(1)
//   return Mock.mock(gradeSearchConfig)
// })



// 数据资源
// Mock.mock(new RegExp("^/resource/366773660297465856/resources$"), (options) => {
//   return Mock.mock(resources)
// })

// 组件
// banner
// Mock.mock(new RegExp("^/widgets/366773660297465856/widgets/0$"), (options) => {
//   return Mock.mock(banner)
// })
// 轮播图
// Mock.mock(new RegExp("^/widgets/366773660297465856/widgets/367042921863581696$"), (options) => {
//   return Mock.mock(carousel)
// })
// copyright
// Mock.mock(new RegExp("^/widgets/366773660297465856/widgets/2$"), (options) => {
//   return Mock.mock(copyright)
// })
// 热词
// Mock.mock(new RegExp("^/widgets/366773660297465856/widgets/367061741734989824$"), (options) => {
//   return Mock.mock(hotwords)
// })
// 排行榜
// Mock.mock(new RegExp("^/widgets/366773660297465856/widgets/4$"), (options) => {
//   return Mock.mock(leaderBoard)
// })
// 资源动态list
// Mock.mock(new RegExp("^/widgets/366773660297465856/widgets/5$"), (options) => {
//   return Mock.mock(homeList)
// })
// logo
// Mock.mock(new RegExp("^/widgets/366773660297465856/widgets/6$"), (options) => {
//   return Mock.mock(logo)
// })
// 统计panelGroup
// Mock.mock(new RegExp("^/widgets/366773660297465856/widgets/7$"), (options) => {
//   return Mock.mock(panelGroup)
// })
//statistics
// Mock.mock(new RegExp("^/widgets/366773660297465856/widgets/8$"), (options) => {
//   return Mock.mock(statistics)
// })


// 分析字段
// Mock.mock(new RegExp("^/analysis" + ".*\/result/analysis"), (options) => {
//   return Mock.mock(analysisFields);
// })

// 分析结果
// Mock.mock(new RegExp("^/resources" + ".*\/result/analysis/.*"), (options) => {
//   return Mock.mock(analysisData);
// })

//详情显示字段
// Mock.mock(new RegExp("^/resources" + ".*\/detail/fields$"), (options) => {
//   let resourceId = JSON.parse(options.body).resourceId;
//   switch (resourceId) {
//     case 366775090878091264:
//       return Mock.mock(newsDetailFields);
//     default:
//       return Mock.mock(paperDetailFields);
//   }
// })

//详情数据
// Mock.mock(new RegExp("^/resources" + ".*\/result/.*"), (options) => {
//   let resourceId = JSON.parse(options.body).resourceId;
//   switch (resourceId) {
//     case 366775090878091264:
//       return Mock.mock(newsDetail);
//     default:
//       return Mock.mock(paperDetail);
//   }
// })


//检索结果显示字段
// Mock.mock(new RegExp("^/resources" + ".*\/search/fields$"), (options) => {
//   let resourceId = JSON.parse(options.body).resourceId;
//   switch (resourceId) {
//     case 366775090878091264:
//       return Mock.mock(newsSearchFields);
//     default:
//       return Mock.mock(paperSearchFields);
//   }
// })

//基础检索
// Mock.mock(new RegExp("^/resource/baseSearch$"), (options) => {
//   let resourceId = JSON.parse(options.body).resourceId;
//   switch (resourceId) {
//     case 366775090878091264:
//       return Mock.mock(newsSearchResult);
//     default:
//       return Mock.mock(paperSearchResult);
//   }
// })

//高级检索
// Mock.mock(new RegExp("^/resource/advancedSearch$"), (options) => {
//   let resourceId = JSON.parse(options.body).resourceId;
//   switch (resourceId) {
//     case 366775090878091264:
//       return Mock.mock(newsSearchResult);
//     default:
//       return Mock.mock(paperSearchResult);
//   }
// })







