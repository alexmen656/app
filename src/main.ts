import { createApp } from 'vue'
import './globals.css'
import App from './App.vue'
import router from './router'
import { DataMigration } from './utils/migration'

// Run data migration from localStorage to Capacitor Preferences
DataMigration.migrateFromLocalStorage().catch(error => {
  console.error('Migration failed, but app will continue:', error)
})

createApp(App).use(router).mount('#app')
