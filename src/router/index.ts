import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Seniority from '../views/Seniority.vue';
import SeniorityExplorer from '@/components/seniority/SeniorityExplorer.vue';
import SeniorityDirectory from '@/components/seniority/SeniorityDirectory.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/seniority',
    component: Seniority,
    children: [
      {
        path: '',
        component: SeniorityExplorer,
        name: 'SeniorityExplore'
      },
      {
        path: '/data/:id',
        component: SeniorityExplorer,
        name: 'SeniorityListDataShow'
      },
      {
        path: 'test',
        component: SeniorityDirectory,
        name: 'SeniorityDirectoryList'
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  console.log(to);
  next();
})

export default router
