import Mock from 'mockjs'

const modulesFiles = require.context('./data', true, /\.json$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1').split('/')[1]
  const value = modulesFiles(modulePath)
  modules[moduleName] = value
  return modules
}, {})

// console.log('modules', modules)

Mock.mock(new RegExp('/analysis' + '.*'), options => {
  const { type, url } = options
  const urlArr = url.split('/')
  switch (urlArr[2]) {
    case 'menu':
      return modules.menu
    default:
      return modules.menuDetail
  }
})

Mock.mock(new RegExp('/resource' + '.*'), options => {
  const { type, url } = options
  const urlArr = url.split('/')
  if (['advancedStatistics', 'baseStatistics'].includes(urlArr[2]))
    return modules.analysisResult
  switch (urlArr[3]) {
    case 'resources':
      return modules.resources
    case 'getAdvancedSearch':
      return modules.gradeSearchConfig
    case 'search':
      return modules.fields
    case 'detail':
      return modules.detailFields
    case 'result':
      return modules.detailData
    case 'getSearchStatisticsFields':
      return modules.analysisFields
    default:
      return modules.searchResult
  }
})

Mock.mock(new RegExp('/widgets' + '.*'), options => {
  const { type, url } = options
  const urlArr = url.split('/')
  if (urlArr[2] === 'config') {
    return modules.widgetIds
  }
  const widget = urlArr[4]
  return modules[widget] ? modules[widget] : {}
})
