import App from './App'
import store from './store'
import router from './router/index'

import Storage from 'vue-ls'
import VueWechatTitle from 'vue-wechat-title'

// require('./mock')

//style
import 'normalize.css/normalize.css'
import './assets/styles/iview/iview.css'
import './assets/styles/iview/custom.css'
import './assets/styles/index.scss'
import './assets/styles/common.css'
import 'echarts-wordcloud'

// icon
import './assets/icons'

import 'lib-flexible/flexible'

export const eventBus = new Vue()

Vue.config.productionTip = false

Vue.use(VueWechatTitle)

Vue.use(Storage, {
  namespace: 'vuejs__', // key键前缀
  name: 'ls', // 命名Vue变量.[ls]或this.[$ls],
  storage: 'local' // 存储名称: session, local, memory
})

const agent = navigator.userAgent.match(
  /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
)
Vue.prototype.USER_AGENT = agent ? 'mobile' : 'PC'

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
