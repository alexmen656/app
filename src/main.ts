import { createApp } from 'vue'
import './globals.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { premiumManager } from './utils/premiumManager'

premiumManager.updatePremiumStatus().catch(console.error)
premiumManager.loadUsageTracking().catch(console.error)

createApp(App).use(router).use(i18n).mount('#app')
