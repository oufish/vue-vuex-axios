// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'normalize.css'
import './style/common.css'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import router from './router'
import 'element-ui/lib/theme-default/index.css'
import store from './vuex/store'

import axios from './http';


Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.axios = axios;
/* eslint-disable no-new */
var vm=new Vue({
  el: '#app',
  store,
  router,
  axios,
  template: '<App/>',
  components: { App }
})

window.addEventListener("resize",function(){
     let clientH= document.documentElement.clientHeight-70-42-30-36-38-30;
     store.commit('COM_CHANGE_TABHEIGHT',clientH)
},false)