import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import Routes from './routes'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(VueRouter)

Vue.directive('rainbow',{
	bind:function(el){
		el.style.color="#"+Math.random().toString(16).slice(2,8);
	}
})


Vue.directive('theme',{
	bind:function(el,binding,vnode){
		if(binding.value == 'wide'){
			el.style.maxWidth = "1260px";
		}else if(binding.value == 'narrow'){
			el.style.maxWidth = "560px";
		}

		if(binding.arg == "column"){
			el.style.background = "#6677cc";
			el.style.padding = "20px";
		}
	}
})

Vue.filter('to-uppercase',function(value){
	return value.toUpperCase();
})

Vue.filter('snippet',function(value){
	return value.slice(0,100) + "..."
})

const router = new VueRouter({
    routes:Routes,
    mode:"history"
})

new Vue({
   router,
  render: h => h(App),
}).$mount('#app')




