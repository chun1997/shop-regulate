import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/welcome/Welcome')
const User = () => import('components/content/user/User.vue')
const Rights = () => import('components/content/power/Rights')
const Roles = () => import('components/content/power/Roles')
const Cate = () => import('components/content/goods/Cate')
const Params = () => import('components/content/goods/Params')
const List = () => import('components/content/goods/List')
const Add = () => import('components/content/goods/Add')
const Order = () => import('components/order/Order')
const Report = () => import('components/report/Report')

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Login',
  redirect: '/login'
},
{
  path: '/login',
  component: Login
},
{
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  },
  {
    path: '/users',
    component: User
  },
  {
    path: '/rights',
    component: Rights
  },
  {
    path: '/roles',
    component: Roles
  },
  {
    path: '/categories',
    component: Cate
  },
  {
    path: '/params',
    component: Params
  },
  {
    path: '/goods',
    component: List
  },
  {
    path: '/goods/add',
    component: Add
  },
  {
    path: '/orders',
    component: Order
  },
  {
    path: '/reports',
    component: Report
  },
  ]
},

]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router