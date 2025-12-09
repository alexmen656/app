<template>
  <div class="notification-settings-view">
    <header class="header">
      <button class="back-button" @click="$router.go(-1)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
      </button>
      <h1 class="title">{{ $t('settings.notificationsSection') }}</h1>
    </header>

    <div class="content">
      <!-- Main Toggle -->
      <div class="settings-section">
        <div class="settings-card">
          <div class="setting-item">
            <label class="setting-label">{{ $t('settings.enableNotifications') }}</label>
            <div class="toggle-switch">
              <input type="checkbox" v-model="notificationSettings.enabled" @change="saveNotificationSettings"
                class="toggle-input" id="notifications-main-toggle" />
              <label for="notifications-main-toggle" class="toggle-slider"></label>
            </div>
          </div>
        </div>
      </div>

      <!-- Notification permission status -->
      <div v-if="!isNotificationSupported" class="settings-section">
        <div class="settings-card">
          <div class="setting-item">
            <div class="notification-warning">
              ⚠️ {{ $t('settings.notificationsOnlyMobile') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Meal Notifications -->
      <div v-if="notificationSettings.enabled && isNotificationSupported" class="settings-section">
        <h3 class="section-title">Meal Reminders</h3>
        <div class="settings-card">
          <!-- Breakfast -->
          <div class="setting-item meal-setting">
            <div class="meal-header">
              <label class="setting-label">{{ $t('settings.breakfast') }}</label>
              <div class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.breakfast.enabled"
                  @change="saveNotificationSettings" class="toggle-input" id="breakfast-toggle" />
                <label for="breakfast-toggle" class="toggle-slider"></label>
              </div>
            </div>
            <div v-if="notificationSettings.breakfast.enabled" class="time-setting">
              <input type="time" v-model="notificationSettings.breakfast.time" @change="saveNotificationSettings"
                class="time-input" />
            </div>
          </div>

          <!-- Lunch -->
          <div class="setting-item meal-setting">
            <div class="meal-header">
              <label class="setting-label">{{ $t('settings.lunch') }}</label>
              <div class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.lunch.enabled" @change="saveNotificationSettings"
                  class="toggle-input" id="lunch-toggle" />
                <label for="lunch-toggle" class="toggle-slider"></label>
              </div>
            </div>
            <div v-if="notificationSettings.lunch.enabled" class="time-setting">
              <input type="time" v-model="notificationSettings.lunch.time" @change="saveNotificationSettings"
                class="time-input" />
            </div>
          </div>

          <!-- Dinner -->
          <div class="setting-item meal-setting">
            <div class="meal-header">
              <label class="setting-label">{{ $t('settings.dinner') }}</label>
              <div class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.dinner.enabled" @change="saveNotificationSettings"
                  class="toggle-input" id="dinner-toggle" />
                <label for="dinner-toggle" class="toggle-slider"></label>
              </div>
            </div>
            <div v-if="notificationSettings.dinner.enabled" class="time-setting">
              <input type="time" v-model="notificationSettings.dinner.time" @change="saveNotificationSettings"
                class="time-input" />
            </div>
          </div>

          <!-- Snacks -->
          <div class="setting-item meal-setting">
            <div class="meal-header">
              <label class="setting-label">{{ $t('settings.snacks') }}</label>
              <div class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.snacks.enabled" @change="saveNotificationSettings"
                  class="toggle-input" id="snacks-toggle" />
                <label for="snacks-toggle" class="toggle-slider"></label>
              </div>
            </div>
            <div v-if="notificationSettings.snacks.enabled" class="time-setting">
              <input type="time" v-model="notificationSettings.snacks.time" @change="saveNotificationSettings"
                class="time-input" />
            </div>
          </div>
        </div>
      </div>

      <!-- Other Notifications -->
      <div v-if="notificationSettings.enabled && isNotificationSupported" class="settings-section">
        <h3 class="section-title">Other Reminders</h3>
        <div class="settings-card">
          <!-- Inactivity Reminders -->
          <div class="setting-item meal-setting">
            <div class="meal-header">
              <label class="setting-label">{{ $t('settings.inactivityReminders') }}</label>
              <div class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.inactivityReminders"
                  @change="saveNotificationSettings" class="toggle-input" id="inactivity-toggle" />
                <label for="inactivity-toggle" class="toggle-slider"></label>
              </div>
            </div>
            <div v-if="notificationSettings.inactivityReminders" class="time-setting">
              <small class="inactivity-description">{{ $t('settings.inactivityRemindersDesc') }}</small>
            </div>
          </div>

          <!-- Weekly Reports -->
          <div v-if="showDebugInfo" class="setting-item meal-setting">
            <div class="meal-header">
              <label class="setting-label">Weekly Reports</label>
              <div class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.weeklyReports" @change="saveNotificationSettings"
                  class="toggle-input" id="weekly-reports-toggle" />
                <label for="weekly-reports-toggle" class="toggle-slider"></label>
              </div>
            </div>
            <div v-if="notificationSettings.weeklyReports" class="time-setting">
              <small class="inactivity-description">Get weekly nutrition summary every Sunday</small>
            </div>
          </div>

          <!-- Goal Achievements -->
          <div v-if="showDebugInfo" class="setting-item meal-setting">
            <div class="meal-header">
              <label class="setting-label">Goal Achievements</label>
              <div class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.achievements" @change="saveNotificationSettings"
                  class="toggle-input" id="achievements-toggle" />
                <label for="achievements-toggle" class="toggle-slider"></label>
              </div>
            </div>
            <div v-if="notificationSettings.achievements" class="time-setting">
              <small class="inactivity-description">Celebrate when you reach your daily goals</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Status info when enabled -->
      <div v-if="notificationSettings.enabled && isNotificationSupported && showDebugInfo" class="settings-section">
        <div class="settings-card">
          <div class="setting-item">
            <div class="notification-status">
              ✅ {{ $t('settings.notificationsActive') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Test Notification -->
      <div v-if="notificationSettings.enabled && isNotificationSupported && showDebugInfo" class="settings-section">
        <h3 class="section-title">Test & Debug</h3>
        <div class="settings-card">
          <div class="setting-item">
            <button class="action-button" @click="testNotification">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z" />
              </svg>
              <span>Send Test Notification</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import {
  getNotificationSettings,
  setNotificationSettings as saveNotificationSettingsToStore
} from '../stores/preferencesStore'
import { NotificationService, type NotificationSettings } from '../services/notifications'
import { isDebugMode, initializeDebugMode } from '../stores/preferencesStore'

const showDebugInfo = ref(false)

// Extended interface for additional settings
interface ExtendedNotificationSettings extends NotificationSettings {
  weeklyReports?: boolean
  achievements?: boolean
}

const notificationSettings = ref<ExtendedNotificationSettings>(NotificationService.getDefaultSettings())
const isNotificationSupported = computed(() => NotificationService.isSupported())

// Add missing properties to the notification settings if they don't exist
const defaultSettings: ExtendedNotificationSettings = {
  ...NotificationService.getDefaultSettings(),
  weeklyReports: false,
  achievements: false
}

async function saveNotificationSettings() {
  try {
    // Save basic settings (without the extended properties)
    const basicSettings: NotificationSettings = {
      enabled: notificationSettings.value.enabled,
      breakfast: notificationSettings.value.breakfast,
      lunch: notificationSettings.value.lunch,
      dinner: notificationSettings.value.dinner,
      snacks: notificationSettings.value.snacks,
      inactivityReminders: notificationSettings.value.inactivityReminders
    }

    await saveNotificationSettingsToStore(basicSettings)

    if (notificationSettings.value.enabled) {
      await NotificationService.scheduleAllMealNotifications(basicSettings)
    } else {
      await NotificationService.cancelAllNotifications()
    }
  } catch (error) {
    console.error('Error saving notification settings:', error)
  }
}

async function testNotification() {
  try {
    // Create a simple test notification
    await NotificationService.initialize()
    // You could implement a test notification method in the service
    console.log('Test notification would be sent here')
  } catch (error) {
    console.error('Error sending test notification:', error)
  }
}

onMounted(async () => {
  try {
    const savedSettings = await getNotificationSettings()
    notificationSettings.value = {
      ...defaultSettings,
      ...savedSettings
    }

    // Initialize debug mode
    initializeDebugMode().then(() => {
      showDebugInfo.value = isDebugMode.value
    })
  } catch (error) {
    console.error('Error loading notification settings:', error)
    notificationSettings.value = defaultSettings
  }
})

watch(isDebugMode, (newValue) => {
  showDebugInfo.value = newValue
}, { immediate: true })
</script>

<style scoped>
.notification-settings-view {
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

.setting-label {
  font-size: 16px;
  font-weight: 500;
  color: white;
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 28px;
  flex-shrink: 0;
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
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.3s;
  border-radius: 28px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-input:checked+.toggle-slider {
  background-color: #4CAF50;
}

.toggle-input:checked+.toggle-slider:before {
  transform: translateX(22px);
}

.meal-setting {
  display: block;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.time-setting {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.time-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-size: 16px;
  width: 100%;
}

.time-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.inactivity-description {
  opacity: 0.7;
  font-size: 14px;
  line-height: 1.4;
  display: block;
}

.notification-warning {
  text-align: center;
  padding: 16px 20px;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 12px;
  color: #FFC107;
  font-size: 14px;
  margin: 0;
}

.notification-status {
  text-align: center;
  padding: 16px 20px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  color: #4CAF50;
  font-size: 14px;
  margin: 0;
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
</style>
