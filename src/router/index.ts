import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ScanView from '../views/ScanView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/scan',
    name: 'Scan',
    component: ScanView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
