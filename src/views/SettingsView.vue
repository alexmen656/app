<template>
  <div class="settings-view"
       @touchstart="handleTouchStart"
       @touchmove="handleTouchMove"
       @touchend="handleTouchEnd">
    <!-- Header -->
    <header class="header">
      <h1 class="title">{{ $t('app.settings') }}</h1>
    </header>

    <!-- Profile Section -->
    <div class="profile-section">
      <div class="profile-card">
        <div class="profile-avatar">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div class="profile-info">
          <h3 class="profile-name">{{ displayProfile.name }}</h3>
          <p class="profile-email">{{ displayProfile.email }}</p>
        </div>
        <button class="edit-button" @click="editProfile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Goals Section -->
    <div class="settings-section">
      <div class="section-header">
        <h3 class="section-title">{{ $t('settings.dailyGoals') }}</h3>
        <button @click="recalculateGoals" class="recalculate-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
          </svg>
          {{ $t('common.calculate') }}
        </button>
      </div>
      <div class="settings-card">
        <div class="setting-item">
          <label class="setting-label">{{ $t('nutrition.calories') }} Goal</label>
          <div class="setting-input">
            <input 
              type="number" 
              v-model="dailyGoals.calories" 
              @change="saveGoals"
              class="number-input"
            />
            <span class="unit">kcal</span>
          </div>
        </div>

        <div class="setting-item">
          <label class="setting-label">{{ $t('nutrition.protein') }} Goal</label>
          <div class="setting-input">
            <input 
              type="number" 
              v-model="dailyGoals.protein" 
              @change="saveGoals"
              class="number-input"
            />
            <span class="unit">g</span>
          </div>
        </div>

        <div class="setting-item">
          <label class="setting-label">{{ $t('nutrition.carbs') }} Goal</label>
          <div class="setting-input">
            <input 
              type="number" 
              v-model="dailyGoals.carbs" 
              @change="saveGoals"
              class="number-input"
            />
            <span class="unit">g</span>
          </div>
        </div>

        <div class="setting-item">
          <label class="setting-label">{{ $t('nutrition.fats') }} Goal</label>
          <div class="setting-input">
            <input 
              type="number" 
              v-model="dailyGoals.fats" 
              @change="saveGoals"
              class="number-input"
            />
            <span class="unit">g</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Language Section -->
    <div class="settings-section">
      <h3 class="section-title">{{ $t('settings.language') }}</h3>
      <div class="settings-card">
        <div class="setting-item">
          <label class="setting-label">{{ $t('settings.language') }}</label>
          <select v-model="currentLanguage" @change="changeLanguage" class="select-input">
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Preferences Section -->
    <div class="settings-section">
      <h3 class="section-title">{{ $t('settings.preferences') }}</h3>
      <div class="settings-card">
        <div class="setting-item">
          <label class="setting-label">{{ $t('settings.units') }}</label>
          <select v-model="userPreferences.units" @change="savePreferences" class="select-input">
            <option value="metric">{{ $t('settings.metric') }}</option>
            <option value="imperial">{{ $t('settings.imperial') }}</option>
          </select>
        </div>

        <div class="setting-item">
          <label class="setting-label">{{ $t('settings.notifications') }}</label>
          <div class="toggle-switch">
            <input 
              type="checkbox" 
              v-model="userPreferences.notifications" 
              @change="savePreferences"
              class="toggle-input"
            />
            <span class="toggle-slider"></span>
          </div>
        </div>

        <div class="setting-item">
          <label class="setting-label">{{ $t('settings.mealReminders') }}</label>
          <div class="toggle-switch">
            <input 
              type="checkbox" 
              v-model="userPreferences.mealReminders" 
              @change="savePreferences"
              class="toggle-input"
            />
            <span class="toggle-slider"></span>
          </div>
        </div>

        <div class="setting-item">
          <label class="setting-label">{{ $t('settings.weeklyReports') }}</label>
          <div class="toggle-switch">
            <input 
              type="checkbox" 
              v-model="userPreferences.weeklyReports" 
              @change="savePreferences"
              class="toggle-input"
            />
            <span class="toggle-slider"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Section -->
    <div class="settings-section">
      <h3 class="section-title">Data & Privacy</h3>
      <div class="settings-card">
        <button class="action-button" @click="exportData">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          <span>Export Data</span>
        </button>

        <button class="action-button" @click="clearCache">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
          </svg>
          <span>Clear Cache</span>
        </button>

        <button class="action-button" @click="clearBarcodeCache">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"/>
          </svg>
          <span>Clear Barcode Cache</span>
        </button>

        <button class="action-button danger" @click="deleteAccount">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"/>
          </svg>
          <span>Delete Account</span>
        </button>
      </div>
    </div>

    <!-- Developer/Debug Section -->
    <div v-if="showDebugInfo" class="settings-section">
      <div class="section-header">
        <h3 class="section-title">Debug Info</h3>
        <button @click="refreshDebugInfo" class="recalculate-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
          </svg>
          Refresh
        </button>
      </div>
      <div class="settings-card debug-card">
        <div class="debug-item">
          <span class="debug-label">Migration Status</span>
          <span class="debug-value" :class="{ 'success': debugInfo.migrationComplete }">
            {{ debugInfo.migrationComplete ? 'Complete' : 'Pending' }}
          </span>
        </div>
        <div class="debug-item">
          <span class="debug-label">Cached Barcodes</span>
          <span class="debug-value">{{ debugInfo.barcodeCache.count }}</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">Cache Size</span>
          <span class="debug-value">{{ formatBytes(debugInfo.barcodeCache.totalSize) }}</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">Scan History Items</span>
          <span class="debug-value">{{ debugInfo.scanHistoryCount }}</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">Capacitor Preferences</span>
          <span class="debug-value">{{ debugInfo.capacitorPreferencesItems }}</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">LocalStorage Items</span>
          <span class="debug-value">{{ debugInfo.localStorageItems }}</span>
        </div>
        
        <div class="debug-actions">
          <button class="debug-button" @click="forceMigration">Force Migration</button>
          <button class="debug-button" @click="exportDebugData">Export Debug Data</button>
        </div>
      </div>
    </div>

    <!-- About Section -->
    <div class="settings-section">
      <h3 class="section-title">About</h3>
      <div class="settings-card">
        <div class="setting-item">
          <span class="setting-label">Version</span>
          <span class="setting-value">1.0.0</span>
        </div>
        
        <div class="setting-item">
          <span class="setting-label">Build</span>
          <span class="setting-value">2024.08.001</span>
        </div>

        <button class="action-button" @click="checkUpdates">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21,10.12H14.22L16.96,7.3C14.23,4.6 9.81,4.5 7.08,7.2C4.35,9.91 4.35,14.28 7.08,17C9.81,19.7 14.23,19.7 16.96,17C18.32,15.65 19,14.08 19,12.1H21C21,14.08 20.12,16.65 18.36,18.39C14.85,21.87 9.15,21.87 5.64,18.39C2.14,14.92 2.11,9.28 5.62,5.81C9.13,2.34 14.76,2.34 18.27,5.81L21,3V10.12M12.5,8V12.25L16,14.33L15.28,15.54L11,13V8H12.5Z"/>
          </svg>
          <span>Check for Updates</span>
        </button>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <router-link to="/" class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span class="nav-label">Home</span>
      </router-link>
      <router-link to="/analytics" class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
        <span class="nav-label">Analytics</span>
      </router-link>
      <router-link to="/settings" class="nav-item active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
        </svg>
        <span class="nav-label">Settings</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
//import { useI18n } from 'vue-i18n'
import { 
  userProfile, 
  dailyGoals, 
  userPreferences,
  updateDailyGoals, 
  resetOnboarding,
  calculateRecommendedMacros
} from '../stores/userStore'
import { BarcodeCache, ScanHistory } from '../utils/storage'
import { setLanguage, getCurrentLanguage } from '../i18n'

const router = useRouter()
//const { t } = useI18n()

// Language functionality
const currentLanguage = ref(getCurrentLanguage())

const changeLanguage = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newLanguage = target.value as 'en' | 'de'
  setLanguage(newLanguage)
  currentLanguage.value = newLanguage
}

// Debug state
const showDebugInfo = ref(false)
const debugInfo = ref({
  migrationComplete: false,
  barcodeCache: { count: 0, totalSize: 0 },
  scanHistoryCount: 0,
  capacitorPreferencesItems: 0,
  localStorageItems: 0
})

// Check if debug mode should be enabled (e.g., if in development)
onMounted(() => {
  // Enable debug mode in development or if localStorage has debug flag
  showDebugInfo.value = localStorage.getItem('enableDebug') === 'true' || 
                        window.location.hostname === 'localhost'
  
  if (showDebugInfo.value) {
    refreshDebugInfo()
  }
})

// Use computed to display current user data
const displayProfile = computed(() => ({
  name: userProfile.name || 'Set up profile',
  email: userProfile.email || 'Add email address'
}))

function editProfile() {
  // Navigate to onboarding to edit profile
  router.push('/onboarding')
}

async function saveGoals() {
  console.log('Goals saved:', dailyGoals)
  await updateDailyGoals(dailyGoals)
}

function savePreferences() {
  console.log('Preferences saved:', userPreferences)
  // Preferences are automatically saved via the store
}

async function recalculateGoals() {
  if (userProfile.weight && userProfile.height && userProfile.age && userProfile.gender && userProfile.activityLevel) {
    const recommended = calculateRecommendedMacros(userProfile)
    await updateDailyGoals(recommended)
    alert('Goals updated based on your current profile!')
  } else {
    alert('Please complete your profile first to get personalized recommendations.')
  }
}

async function exportData() {
  const scanHistory = await ScanHistory.get()
  const data = {
    profile: userProfile,
    goals: dailyGoals,
    preferences: userPreferences,
    scanHistory,
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kaloriq-data-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

async function clearCache() {
  if (confirm('This will clear all cached data including scan history. Are you sure?')) {
    await ScanHistory.clear()
    alert('Cache cleared successfully!')
    if (showDebugInfo.value) {
      refreshDebugInfo()
    }
  }
}

async function clearBarcodeCache() {
  if (confirm('This will clear all cached barcode data. Are you sure?')) {
    await BarcodeCache.clearAll()
    alert('Barcode cache cleared successfully!')
    if (showDebugInfo.value) {
      refreshDebugInfo()
    }
  }
}

async function deleteAccount() {
  const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.')
  if (confirmed) {
    const doubleConfirm = confirm('This will permanently delete all your data. Continue?')
    if (doubleConfirm) {
      await resetOnboarding()
      await BarcodeCache.clearAll()
      await ScanHistory.clear()
      router.push('/onboarding')
    }
  }
}

function checkUpdates() {
  alert('You are using the latest version of Kaloriq!')
}

// Debug functions
async function refreshDebugInfo() {
  try {
    const [
      cacheStats,
      scanHistory
    ] = await Promise.all([
      BarcodeCache.getStats(),
      ScanHistory.get()
    ])

    debugInfo.value = {
      migrationComplete: true, // Migration removed
      barcodeCache: cacheStats,
      scanHistoryCount: scanHistory.length,
      capacitorPreferencesItems: 0, // No longer tracked
      localStorageItems: 0 // No longer tracked
    }
  } catch (error) {
    console.error('Error refreshing debug info:', error)
  }
}

async function forceMigration() {
  alert('Migration system has been removed. Data is now stored directly in Capacitor Preferences.')
}

async function exportDebugData() {
  await refreshDebugInfo()
  const debugData = {
    debugInfo: debugInfo.value,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    capacitorInfo: (window as any).Capacitor ? {
      isNative: (window as any).Capacitor.isNative,
      platform: (window as any).Capacitor.platform
    } : null
  }
  
  const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kaloriq-debug-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Touch/Swipe functionality
let touchStartX = 0
let touchStartY = 0
const swipeThreshold = 50 // Minimum distance for a swipe

function handleTouchStart(event: TouchEvent) {
    touchStartX = event.touches[0].clientX
    touchStartY = event.touches[0].clientY
}

function handleTouchMove(event: TouchEvent) {
    // Prevent default to avoid scrolling issues during swipe
    // Only prevent if we're in a horizontal swipe
    const currentX = event.touches[0].clientX
    const currentY = event.touches[0].clientY
    const deltaX = Math.abs(currentX - touchStartX)
    const deltaY = Math.abs(currentY - touchStartY)
    
    if (deltaX > deltaY && deltaX > 10) {
        event.preventDefault()
    }
}

function handleTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX
    const touchEndY = event.changedTouches[0].clientY
    
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY
    
    // Check if it's more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Swipe right (from left to right) - go back to analytics
        if (deltaX > swipeThreshold) {
            router.push('/analytics')
        }
        // Swipe left could be used for future navigation
        // if (deltaX < -swipeThreshold) {
        //     // Could navigate to another view if needed
        // }
    }
}
</script>

<style scoped>
.settings-view {
  height: 100vh;
  height: 100dvh;
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
  color: white;
  padding: 16px;
  padding-top: max(44px, env(safe-area-inset-top, 44px));
  padding-bottom: max(80px, calc(80px + env(safe-area-inset-bottom, 0px)));
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  height: 44px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.profile-section {
  margin-bottom: 32px;
}

.profile-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-avatar {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.profile-email {
  font-size: 14px;
  opacity: 0.7;
  margin: 0;
}

.edit-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.settings-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.recalculate-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 112, 82, 0.2);
  border: 1px solid rgba(0, 112, 82, 0.4);
  border-radius: 8px;
  color: #00a86b;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.recalculate-button:hover {
  background: rgba(0, 112, 82, 0.3);
  border-color: rgba(0, 112, 82, 0.6);
}

.settings-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-label {
  font-size: 16px;
  font-weight: 500;
}

.setting-value {
  font-size: 14px;
  opacity: 0.7;
}

.setting-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.number-input, .select-input {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 8px 12px;
  font-size: 14px;
  width: 80px;
}

.select-input {
  width: 150px;
}

.unit {
  font-size: 14px;
  opacity: 0.7;
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 26px;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3);
  transition: 0.3s;
  border-radius: 13px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-input:checked + .toggle-slider {
  background: #4caf50;
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.action-button {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 12px;
  color: white;
  padding: 16px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 12px;
}

.action-button:last-child {
  margin-bottom: 0;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

.action-button.danger {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.action-button.danger:hover {
  background: rgba(244, 67, 54, 0.3);
}

/* Debug styles */
.debug-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
}

.debug-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.debug-item:last-child {
  margin-bottom: 0;
}

.debug-label {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.8;
}

.debug-value {
  font-size: 14px;
  font-weight: 600;
  color: #64b5f6;
}

.debug-value.success {
  color: #4caf50;
}

.debug-actions {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.debug-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 120px;
}

.debug-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(30, 30, 46, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 20px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  height: 80px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-decoration: none;
  color: white;
  opacity: 0.6;
  transition: opacity 0.2s;
  min-width: 60px;
  height: 50px;
}

.nav-item.active {
  opacity: 1;
}

.nav-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.nav-label {
  font-size: 11px;
  font-weight: 500;
}
</style>
