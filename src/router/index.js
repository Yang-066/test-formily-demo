import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/jumppage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'homeIndex',
    component: Home,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'home-list',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: 'demo',
        name: 'demo-list',
        component: () => import('@/views/demo/index.vue')
      }
    ]
  }
]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch((err) => err)
}

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  next()
})
export default router
