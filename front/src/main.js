/*
 * @Descripttion: 
 * @Author: yizheng.yuan
 * @Date: 2020-04-16 14:41:25
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2020-04-16 15:26:07
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

// element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import Axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, Axios);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
