import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import md5 from 'md5'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login')
  },
  {
    path: `/${md5('dashboard')}`,
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "about" */ '../views/dashboard')
  },
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
    next(`/${md5('dashboard')}`)
  } else {
    next()
  }
})

export default router
