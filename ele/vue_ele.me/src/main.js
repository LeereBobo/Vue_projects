import Vue from 'vue'
import App from './App.vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import router from './router'
import store from './store'
import axios from 'axios'
// import qs from 'qs'

// 请求动画
import { Indicator } from 'mint-ui';

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

Vue.use(MintUI);

// 为axios设置根域名
// axios.defaults.baseURL = "https://ele-interface.herokuapp.com/";

// 请求拦截 -- 开启
axios.interceptors.request.use(
  config => {
    /* if(config.method == 'post'){
      config.data = qs.stringify(config.data);
    } */
    // 加载动画
    Indicator.open();
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截 -- 关闭
axios.interceptors.response.use(
  response => {
    Indicator.close();
    return response;
  }, 
  error => {
    // 错误提醒
    Indicator.close();
    return Promise.reject(error);
});




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
