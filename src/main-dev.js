import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// elementUI组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// axios发送请求
import axios from 'axios'
axios.defaults.baseURL = 'http://47.97.219.38:8808/api/private/v1/'
axios.interceptors.request.use(config => {
  NProgress.start() //显示进度条
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(res => {
  NProgress.done() //隐藏进度条
  return res
})

Vue.prototype.$http = axios

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')