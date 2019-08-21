import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);

import axios from 'axios';
Vue.prototype.GLOBALDATA = {
  userId:'',
  password:''
}
Vue.prototype.$http = axios.create({
  baseURL:'http://120.79.74.12:18080'
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
