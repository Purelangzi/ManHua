import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'




import '@/icons' // icon
import '@/permission' // permission control


import * as API from '@/api'
// 引入抽离出来的全局公共组件
import categorySearch from '@/components/categorySearch'
import categoryTable from '@/components/categoryTable'
import categoryDialog from '@/components/categoryDialog'
/**
*如果您不想使用mock服务器
*您想将MockJs用于mock-api
*可以执行：mockXHR（）
*
*目前MockJ将用于生产环境中，
*对
 */
if (process.env.NODE_ENV === 'development') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
// 注册全局组件


Vue.component('categorySearch',categorySearch)
Vue.component('categoryTable',categoryTable)
Vue.component('categoryDialog',categoryDialog)
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)


Vue.prototype.$API = API
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
