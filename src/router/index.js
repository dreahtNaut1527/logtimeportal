import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "about" */ '../views/dashboard')
  },
  {
    path: '/dashboardleaders',
    name: 'dashboardleaders',
    component: () => import(/* webpackChunkName: "about" */ '../views/dashboardleaders')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path !== '/' && store.state.logtimeuserinfo.EmployeeCode == undefined) {
    next('/') // Goto Login page
  } else if(to.path === '/' && store.state.logtimeuserinfo.EmployeeCode != undefined) { 
    if (store.state.logtimeuserinfo.UserLevel == 0) {
      next('/dashboard')
    } else {
      next('/dashboardleaders')
    }
  } else {
    next()
  }
})

export default router
