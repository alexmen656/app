<template>
  <div class="healthkit-settings-view">
    <header class="header">
      <button class="back-button" @click="$router.go(-1)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
      <h1 class="title">{{ $t('settings.healthKit') }}</h1>
    </header>

    <div class="content">
      <!-- HealthKit Status -->
      <div class="settings-section">
        <div class="settings-card">
          <div class="setting-item">
            <div class="healthkit-status">
              <div class="healthkit-header">
                <div class="healthkit-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.35,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.04M17,13L12,18L7,13H10V9H14V13H17Z"/>
                  </svg>
                </div>
                <div class="healthkit-info">
                  <h4 class="healthkit-title">Apple Health</h4>
                  <p class="healthkit-description">{{ healthKitStatusText }}</p>
                </div>
                <div class="healthkit-indicator" :class="{ 'connected': healthKitStatus.isConnected }">
                  <div class="status-dot"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- HealthKit Actions -->
      <div v-if="!healthKitStatus.isConnected && healthKitStatus.isAvailable && isPremiumUser" class="settings-section">
        <div class="settings-card">
          <div class="setting-item">
            <button class="action-button healthkit-connect" @click="connectHealthKit">
              <span>{{ $t('settings.connectHealthKit') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Premium Required Message for HealthKit -->
      <div v-if="!healthKitStatus.isConnected && healthKitStatus.isAvailable && !isPremiumUser" class="settings-section">
        <div class="settings-card">
          <div class="setting-item">
            <div class="premium-required-message">
              <div class="premium-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div class="premium-message-content">
                <h4>Premium Feature</h4>
                <p>Apple Health integration requires a Premium subscription</p>
                <button class="upgrade-button" @click="goToUpgrade">
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Connected Actions -->
      <div v-if="healthKitStatus.isConnected" class="settings-section">
        <h3 class="section-title">Actions</h3>
        <div class="settings-card">
          <div class="setting-item">
            <button class="action-button" @click="syncHealthKit">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
              </svg>
              <span>{{ $t('settings.syncNow') }}</span>
            </button>
          </div>

          <div class="setting-item">
            <button class="action-button" @click="loadHealthKitStatus">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4C7.58,4 4,7.58 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12C6,8.69 8.69,6 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
              </svg>
              <span>Refresh Status</span>
            </button>
          </div>
        </div>
      </div>

      <!-- HealthKit Permissions -->
      <div v-if="healthKitStatus.isConnected" class="settings-section">
        <h3 class="section-title">{{ $t('settings.permissions') }}</h3>
        <div class="settings-card">
          <div class="permission-item" v-for="permission in healthKitPermissions" :key="permission.type">
            <div class="permission-info">
              <span class="permission-name">{{ permission.name }}</span>
              <span class="permission-description">{{ permission.description }}</span>
            </div>
            <div class="permission-status" :class="{ 'granted': permission.granted }">
              <svg v-if="permission.granted" width="16" height="16" viewBox="0 0 24 24" fill="#4CAF50">
                <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="#F44336">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- HealthKit Last Sync Info -->
      <div v-if="healthKitStatus.isConnected && healthKitStatus.lastSync" class="settings-section">
        <h3 class="section-title">Sync Information</h3>
        <div class="settings-card">
          <div class="setting-item">
            <div class="sync-info">
              <span class="sync-label">{{ $t('settings.lastSync') }}</span>
              <span class="sync-time">{{ formatLastSync(healthKitStatus.lastSync) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- HealthKit Disconnect Option -->
      <div v-if="healthKitStatus.isConnected" class="settings-section">
        <h3 class="section-title">Danger Zone</h3>
        <div class="settings-card">
          <div class="setting-item">
            <button class="action-button danger" @click="disconnectHealthKit">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
              </svg>
              <span>{{ $t('settings.disconnectHealthKit') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- HealthKit Unavailable Message -->
      <div v-if="!healthKitStatus.isAvailable" class="settings-section">
        <div class="settings-card">
          <div class="setting-item">
            <div class="healthkit-unavailable">
              <p>ℹ️ Apple Health ist auf diesem Gerät nicht verfügbar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { HealthKitService } from '../services/healthkit'
import { Capacitor } from '@capacitor/core'
import { isPremiumUser, onPremiumStatusChange } from '../utils/premiumManager'

const router = useRouter()

// HealthKit reactive variables
const healthKitStatus = ref({
  isConnected: false,
  isAvailable: false,
  lastSync: null as string | null
})

const healthKitPermissions = ref([
  { type: 'calories', name: 'Kalorien', description: 'Energiezufuhr in kcal', granted: false },
  { type: 'protein', name: 'Protein', description: 'Proteinzufuhr in Gramm', granted: false },
  { type: 'carbs', name: 'Kohlenhydrate', description: 'Kohlenhydratzufuhr in Gramm', granted: false },
  { type: 'fat', name: 'Fett', description: 'Fettzufuhr in Gramm', granted: false }
])

const healthKitStatusText = computed(() => {
  if (!healthKitStatus.value.isAvailable) {
    return 'Not available on this device'
  }
  return healthKitStatus.value.isConnected ? 'Connected & Syncing' : 'Not connected'
})

function goToUpgrade() {
  router.push('/upgrade')
}

// HealthKit functions
async function loadHealthKitStatus() {
  try {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
      healthKitStatus.value.isAvailable = false
      healthKitStatus.value.isConnected = false
      return
    }

    healthKitStatus.value.isAvailable = await HealthKitService.isHealthKitAvailable()
    healthKitStatus.value.isConnected = await HealthKitService.isAvailable()
    
    if (healthKitStatus.value.isConnected) {
      // Set all permissions as granted if HealthKit is connected
      healthKitPermissions.value.forEach(permission => {
        permission.granted = true
      })
      // Set a mock last sync time
      healthKitStatus.value.lastSync = new Date().toISOString()
    }
  } catch (error) {
    console.error('Error loading HealthKit status:', error)
  }
}

async function connectHealthKit() {
  try {
    await HealthKitService.initialize()
    await loadHealthKitStatus()
  } catch (error) {
    console.error('Error connecting to HealthKit:', error)
  }
}

async function disconnectHealthKit() {
  try {
    await HealthKitService.resetConnection()
    await loadHealthKitStatus()
  } catch (error) {
    console.error('Error disconnecting from HealthKit:', error)
  }
}

async function syncHealthKit() {
  try {
    await HealthKitService.syncTodaysData()
    healthKitStatus.value.lastSync = new Date().toISOString()
  } catch (error) {
    console.error('Error syncing HealthKit:', error)
  }
}

function formatLastSync(timestamp: string): string {
  try {
    const date = new Date(timestamp)
    return date.toLocaleString()
  } catch {
    return 'Unknown'
  }
}

onMounted(async () => {
  await loadHealthKitStatus()
  
  // Listen for premium status changes
  const unsubscribe = onPremiumStatusChange(async (isPremium) => {
    if (isPremium) {
      await loadHealthKitStatus()
    } else {
      // Reset HealthKit status when premium is lost
      healthKitStatus.value.isConnected = false
      healthKitStatus.value.lastSync = null
      healthKitPermissions.value.forEach(permission => {
        permission.granted = false
      })
    }
  })
  
  // Cleanup
  onUnmounted(() => {
    unsubscribe()
  })
})
</script>

<style scoped>
.healthkit-settings-view {
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
  align-items: center;
  margin-bottom: 24px;
  height: 44px;
}

.back-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  margin-right: 16px;
  border-radius: 50%;
  transition: background-color 0.2s;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.content {
  margin-bottom: 32px;
}

.settings-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  opacity: 0.9;
}

.settings-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.setting-item {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.setting-item:last-child {
  border-bottom: none;
}

.healthkit-status {
  width: 100%;
}

.healthkit-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.healthkit-icon {
  color: #4CAF50;
  flex-shrink: 0;
}

.healthkit-info {
  flex: 1;
}

.healthkit-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.healthkit-description {
  font-size: 14px;
  opacity: 0.7;
  margin: 0;
}

.healthkit-indicator {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #F44336;
}

.healthkit-indicator.connected .status-dot {
  background-color: #4CAF50;
}

.action-button {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 12px;
  padding: 16px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.action-button.danger {
  background: rgba(244, 67, 54, 0.2);
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.action-button.danger:hover {
  background: rgba(244, 67, 54, 0.3);
}

.action-button.healthkit-connect {
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.action-button.healthkit-connect:hover {
  background: rgba(76, 175, 80, 0.3);
}

.premium-required-message {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 12px;
  margin: 0;
}

.premium-icon {
  color: #FFC107;
  flex-shrink: 0;
}

.premium-message-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #FFC107;
}

.premium-message-content p {
  margin: 0 0 16px 0;
  font-size: 14px;
  opacity: 0.8;
}

.upgrade-button {
  background: linear-gradient(135deg, #FFD700, #FFA000);
  color: #1a1d26;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.upgrade-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.permission-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.permission-item:last-child {
  border-bottom: none;
}

.permission-info {
  flex: 1;
}

.permission-name {
  display: block;
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 14px;
}

.permission-description {
  display: block;
  font-size: 12px;
  opacity: 0.7;
}

.permission-status {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.sync-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.sync-label {
  font-weight: 500;
  font-size: 14px;
}

.sync-time {
  opacity: 0.7;
  font-size: 14px;
}

.healthkit-unavailable {
  text-align: center;
  padding: 32px 20px;
  opacity: 0.7;
}

.healthkit-unavailable p {
  margin: 0;
  font-size: 16px;
}
</style>
