import { createApp } from 'vue'
import './globals.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { premiumManager } from './utils/premiumManager'

premiumManager.updatePremiumStatus().catch(console.error)
premiumManager.loadUsageTracking().catch(console.error)

createApp(App).use(router).use(i18n).mount('#app')

// Screenshot UITests: jump straight to the screen under capture once the store
// (and its seeded demo data) is ready. No-op without the ui_test flag.
import('./utils/uiTestSeed').then(async ({ isUiTestMode, getUiTestStartRoute }) => {
  if (!(await isUiTestMode())) return
  const route = await getUiTestStartRoute()
  if (!route) return
  const { storeReady } = await import('./stores/userStore')
  await storeReady
  await router.replace(route).catch(() => {})
})