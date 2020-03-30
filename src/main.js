import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import VueClipboard from 'vue-clipboard2'
import Meta from 'vue-meta'
import Print from '@/assets/js/print'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(Meta)
Vue.use(Print)
/**
 * 判断一个对象是否所有属性都有值
 * @param {Object} form 目标对象
 * @param {Array} except 排除该数组中的属性名
 * @returns {Boolean}
 */

Vue.prototype.$isFormReady = function(form, except) {
  for (const i in form) {
    if (except && except.indexOf(i) !== -1) continue
    if (!form[i]) return true
  }
  return false
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
