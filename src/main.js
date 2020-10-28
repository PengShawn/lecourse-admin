import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/fonts/iconfont.css'  //导入字体图标
import './assets/css/global.css'   //导入全局样式表

import global_ from './Base.vue'
Vue.prototype.GLOBAL = global_;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
