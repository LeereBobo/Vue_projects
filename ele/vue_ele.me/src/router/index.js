import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // 设置子路由时，父级路由不写name属性
    // name: 'Index',
    component: () => import('../views/Index.vue'),
    children:[
      {
        /* redirect：重定向，当访问index时，路由会被替换为/home，
        即自动设置index的默认展示页面为home，无需点击跳转 */
        path:'',
        redirect:'/home'
      }, {
        path: '/home',
        name:'home',
        component:() => import('../views/Home.vue')
      }, {
        path: '/order',
        name:'order',
        component: () => import('../views/Order.vue')
      }, {
        path: '/me',
        name:'me',
        component: () => import('../views/Me.vue')
      }, {
        path: '/address',
        name: 'address',
        component: () => import('../views/Address.vue')
      },
      {
        path: '/city',
        name: 'city',
        component: () => import('../views/City.vue')
      }

    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path:'/search',
    name:'Search',
    component:() => import('../views/Search.vue')
  }, {
    path: '/shop',
    name: 'Shop',
    redirect:'/goods',
    component: () => import('../views/shops/Shop.vue'),
    children:[
      {
        path: '/goods',
        name: 'Goods',
        component: () => import('../views/shops/Goods.vue')
      }, 
      {
        path: '/comments',
        name: 'Comments',
        component: () => import('../views/shops/Comments.vue')
      },
      {
        path: '/seller',
        name: 'Seller',
        component: () => import('../views/shops/Seller.vue')
      },
    ]
  }, {
    path: '/myAddress',
    name: 'MyAddress',
    component: () => import('../views/Orders/MyAddress.vue')
  }, {
    path: '/addAddress',
    name: 'AddAddress',
    component: () => import('../views/Orders/AddAddress.vue')
  },
  {
    path: '/settlement',
    name: 'Settlement',
    component: () => import('../views/Orders/Settlement.vue')
  }, {
    path: '/remark',
    name: 'Remark',
    component: () => import('../views/Orders/Remark.vue')
  }, {
    path: '/pay',
    name: 'Pay',
    component: () => import('../views/Orders/Pay.vue')
  },
  {
    path: '/orderInfo',
    name: 'OrderInfo',
    component: () => import('../views/Orders/OrderInfo.vue')
  }
]

const router = new VueRouter({
  mode:'history',
  linkActiveClass: 'active',
  routes
})

// 路由守卫
router.beforeEach((to,from,next) => {
  const isLogin = localStorage.ele_login ? true : false;
  if (to.path == '/login') {
    next();
  } else {
    // 是否在登录状态下
    isLogin ? next() : next('/login');
  }
})

export default router
