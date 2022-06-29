import App from './App'

// #ifndef VUE3
import Vue from 'vue'

import api from './api'
Vue.prototype.$api = api

import invite from './utils/invite'
Vue.use(invite)

import useMyComponents from './components/index'
Vue.use(useMyComponents)

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif