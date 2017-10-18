// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import { Loading } from 'element-ui';
import 'element-ui/lib/theme-default/index.css'
import baseFun from '@/common/baseFun.js'
import axios from 'axios'

//axios异步传输
Vue.prototype.$http = axios.create({
  baseURL : 'http://localhost:53975',
  timeout: 120000
});
//公用方法
Vue.prototype.baseFun = baseFun;

//"加载"动画
Vue.prototype.$loading = Loading.service;

Vue.config.productionTip = false;
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
