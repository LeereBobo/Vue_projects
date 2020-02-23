import Home from './components/Home.vue'
import About from './components/About.vue'
import Add from './components/Add.vue'
import Details from './components/Details.vue'
import Edit from './components/Edit.vue'

export default [
  {path:'/',component:Home,name:'home'},
  {path:'/About',component:About},
  {path:'/add',component:Add},
  {path:'/details/:id',component:Details},
  {path:'/edit/:id',component:Edit}
]
