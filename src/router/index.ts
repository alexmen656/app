import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ScanView from '../views/ScanView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'
import SettingsView from '../views/SettingsView.vue'

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
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: AnalyticsView
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
