<template>
  <div class="settings-view" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <header class="header">
      <h1 class="title">{{ $t('app.settings') }}</h1>
    </header>
    <div class="profile-section">
      <div class="profile-card">
        <div class="profile-avatar">
          <img v-if="userProfile.profilePicture" :src="userProfile.profilePicture" alt="Profile" class="profile-image" />
          <svg v-else width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <div class="profile-info">
          <h3 class="profile-name">{{ displayProfile.name }}</h3>
          <p class="profile-email">{{ displayProfile.email }}</p>
        </div>
        <button class="edit-button" @click="editProfile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </div>
      
      <!-- Premium Upgrade Card -->
      <div v-if="!isSubscriptionActive" class="upgrade-card" @click="goToUpgrade">
        <div class="upgrade-content">
          <div class="upgrade-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="upgrade-info">
            <h3 class="upgrade-title">Upgrade to Premium</h3>
            <p class="upgrade-description">Unlock advanced features & premium budgets</p>
          </div>
          <div class="upgrade-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Premium Status Card (for subscribed users) -->
      <div v-else class="premium-status-card">
        <div class="premium-content">
          <div class="premium-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="premium-info">
            <h3 class="premium-title">Premium Active</h3>
            <p class="premium-description">All features unlocked</p>
          </div>
          <div class="premium-badge">
            <span>PRO</span>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <!--<div class="section-header">-->
      <h3 class="section-title">{{ $t('settings.dailyGoals') }}</h3>
      <!--<button @click="recalculateGoals" class="recalculate-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" />
          </svg>
          {{ $t('common.calculate') }}
        </button>-->
      <!-- </div>-->
      <div class="settings-card">
        <div class="setting-item">
          <label class="setting-label">{{ $t('nutrition.calories') }} Goal</label>
          <div class="setting-input">
            <input type="number" v-model="dailyGoals.calories" @change="saveGoals" class="number-input" />
            <span class="unit">kcal</span>
          </div>
        </div>

        <div class="setting-item">
          <label class="setting-label">{{ $t('nutrition.protein') }} Goal</label>
          <div class="setting-input">
            <input type="number" v-model="dailyGoals.protein" @change="saveGoals" class="number-input" />
            <span class="unit">g</span>
          </div>
        </div>

        <div class="setting-item">
          <label class="setting-label">{{ $t('nutrition.carbs') }} Goal</label>
          <div class="setting-input">
            <input type="number" v-model="dailyGoals.carbs" @change="saveGoals" class="number-input" />
            <span class="unit">g</span>
          </div>
        </div>

        <div class="setting-item">
          <label class="setting-label">{{ $t('nutrition.fats') }} Goal</label>
          <div class="setting-input">
            <input type="number" v-model="dailyGoals.fats" @change="saveGoals" class="number-input" />
            <span class="unit">g</span>
          </div>
        </div>
      </div>
    </div>

    <!-- HealthKit Section -->
    <div class="settings-section">
      <div class="section-header">
        <h3 class="section-title">{{ $t('settings.healthKit') }}</h3>
        <button @click="loadHealthKitStatus" class="recalculate-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4C7.58,4 4,7.58 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12C6,8.69 8.69,6 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
          </svg>
          Refresh
        </button>
      </div>
      <div class="settings-card">
        <!-- HealthKit Status -->
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

        <!-- HealthKit Actions -->
        <div v-if="!healthKitStatus.isConnected && healthKitStatus.isAvailable && isPremiumUser" class="setting-item">
          <button class="action-button healthkit-connect" @click="connectHealthKit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
            </svg>
            <span>{{ $t('settings.connectHealthKit') }}</span>
          </button>
        </div>

        <!-- Premium Required Message for HealthKit -->
        <div v-if="!healthKitStatus.isConnected && healthKitStatus.isAvailable && !isPremiumUser" class="setting-item">
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

        <div v-if="healthKitStatus.isConnected" class="setting-item">
          <button class="action-button" @click="syncHealthKit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
            </svg>
            <span>{{ $t('settings.syncNow') }}</span>
          </button>
        </div>

        <!-- HealthKit Permissions -->
        <div v-if="healthKitStatus.isConnected" class="healthkit-permissions">
          <div class="permissions-header">
            <h5 class="permissions-title">{{ $t('settings.permissions') }}</h5>
          </div>
          
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

        <!-- HealthKit Last Sync Info -->
        <div v-if="healthKitStatus.isConnected && healthKitStatus.lastSync" class="setting-item">
          <div class="sync-info">
            <span class="sync-label">{{ $t('settings.lastSync') }}</span>
            <span class="sync-time">{{ formatLastSync(healthKitStatus.lastSync) }}</span>
          </div>
        </div>

        <!-- HealthKit Disconnect Option -->
        <div v-if="healthKitStatus.isConnected" class="setting-item">
          <button class="action-button danger" @click="disconnectHealthKit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
            </svg>
            <span>{{ $t('settings.disconnectHealthKit') }}</span>
          </button>
        </div>

        <!-- HealthKit Unavailable Message -->
        <div v-if="!healthKitStatus.isAvailable" class="setting-item">
          <div class="healthkit-unavailable">
            <p>ℹ️ Apple Health ist auf diesem Gerät nicht verfügbar</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Goal Selection Section -->
    <!--  <div class="settings-section">
      <h3 class="section-title">{{ $t('settings.primaryGoal') }}</h3>
      <div class="settings-card">
        <div class="goal-selection">
          <div 
            v-for="goalOption in goalOptions" 
            :key="goalOption.value"
            class="goal-option-small"
            :class="{ active: currentGoal === goalOption.value }"
            @click="updateGoal(goalOption.value)"
          >
            <div class="goal-icon-small">{{ goalOption.icon }}</div>
            <div class="goal-content-small">
              <div class="goal-name-small">{{ goalOption.name }}</div>
              <div class="goal-description-small">{{ goalOption.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>-->

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

    <!-- Notifications Section -->
    <div class="settings-section">
      <h3 class="section-title">{{ $t('settings.notificationsSection') }}</h3>
      <div class="settings-card">
        <div class="setting-item">
          <label class="setting-label">{{ $t('settings.enableNotifications') }}</label>
          <div class="toggle-switch">
            <input type="checkbox" v-model="notificationSettings.enabled" @change="saveNotificationSettings"
              class="toggle-input" id="notifications-main-toggle" />
            <label for="notifications-main-toggle" class="toggle-slider"></label>
          </div>
        </div>

        <!-- Notification permission status -->
        <div v-if="!isNotificationSupported" class="setting-item">
          <div class="notification-warning">
            ⚠️ {{ $t('settings.notificationsOnlyMobile') }}
          </div>
        </div>

        <div v-if="notificationSettings.enabled && isNotificationSupported">
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
        </div>

        <!-- Status info when enabled -->
        <div v-if="notificationSettings.enabled && isNotificationSupported" class="setting-item">
          <div class="notification-status">
            ✅ {{ $t('settings.notificationsActive') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Preferences Section -->
    <div v-if="showDebugInfo" class="settings-section">
      <h3 class="section-title">{{ $t('settings.preferences') }}</h3>
      <div class="settings-card">
        <div class="setting-item">
          <label class="setting-label">{{ $t('settings.units') }}</label>
          <select v-model="userPreferences.units" @change="savePreferences" class="select-input">
            <option value="metric">{{ $t('settings.metric') }}</option>
            <option value="imperial">{{ $t('settings.imperial') }}</option>
          </select>
        </div>

        <div v-if="showDebugInfo" class="setting-item">
          <label class="setting-label">{{ $t('settings.notifications') }}</label>
          <div class="toggle-switch">
            <input type="checkbox" v-model="userPreferences.notifications" @change="savePreferences"
              class="toggle-input" id="notifications-toggle" />
            <label for="notifications-toggle" class="toggle-slider"></label>
          </div>
        </div>

        <div v-if="showDebugInfo" class="setting-item">
          <label class="setting-label">{{ $t('settings.mealReminders') }}</label>
          <div class="toggle-switch">
            <input type="checkbox" v-model="userPreferences.mealReminders" @change="savePreferences"
              class="toggle-input" id="meal-reminders-toggle" />
            <label for="meal-reminders-toggle" class="toggle-slider"></label>
          </div>
        </div>

        <div v-if="showDebugInfo" class="setting-item">
          <label class="setting-label">{{ $t('settings.weeklyReports') }}</label>
          <div class="toggle-switch">
            <input type="checkbox" v-model="userPreferences.weeklyReports" @change="savePreferences"
              class="toggle-input" id="weekly-reports-toggle" />
            <label for="weekly-reports-toggle" class="toggle-slider"></label>
          </div>
        </div>

        <div v-if="showDebugInfo" class="setting-item">
          <label class="setting-label">Mock Data (Screenshots)</label>
          <div class="toggle-switch">
            <input type="checkbox" v-model="mockDataEnabled" @change="toggleMockData" class="toggle-input"
              id="mock-data-toggle" />
            <label for="mock-data-toggle" class="toggle-slider"></label>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Section -->
    <div class="settings-section">
      <h3 class="section-title">{{ $t('settings.dataPrivacy') }}</h3>
      <div class="settings-card">
        <button class="action-button" @click="exportData" data-export>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
          <span>{{ $t('settings.exportData') }}</span>
        </button>

        <button class="action-button" @click="clearCache">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
          </svg>
          <span>{{ $t('settings.clearCache') }}</span>
        </button>

        <button class="action-button" @click="clearBarcodeCache">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
          </svg>
          <span>{{ $t('settings.clearBarcodeCache') }}</span>
        </button>

        <button class="action-button danger" @click="deleteAccount">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
          </svg>
          <span>{{ $t('settings.deleteAccount') }}</span>
        </button>
      </div>
    </div>

    <!-- Developer/Debug Section -->
    <div v-if="showDebugInfo" class="settings-section">
      <div class="section-header">
        <h3 class="section-title">{{ $t('settings.debugInfo') }}</h3>
        <button @click="refreshDebugInfo" class="recalculate-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" />
          </svg>
          {{ $t('settings.refresh') }}
        </button>
      </div>
      <div class="settings-card debug-card">
        <div class="debug-item">
          <span class="debug-label">{{ $t('settings.migrationStatus') }}</span>
          <span class="debug-value" :class="{ 'success': debugInfo.migrationComplete }">
            {{ debugInfo.migrationComplete ? $t('settings.migrationComplete') : $t('settings.migrationPending') }}
          </span>
        </div>
        <div class="debug-item">
          <span class="debug-label">{{ $t('settings.cachedBarcodes') }}</span>
          <span class="debug-value">{{ debugInfo.barcodeCache.count }}</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">{{ $t('settings.cacheSize') }}</span>
          <span class="debug-value">{{ formatBytes(debugInfo.barcodeCache.totalSize) }}</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">{{ $t('settings.scanHistoryItems') }}</span>
          <span class="debug-value">{{ debugInfo.scanHistoryCount }}</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">{{ $t('settings.capacitorPreferences') }}</span>
          <span class="debug-value">{{ debugInfo.capacitorPreferencesItems }}</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">{{ $t('settings.localStorageItems') }}</span>
          <span class="debug-value">{{ debugInfo.localStorageItems }}</span>
        </div>

        <div class="debug-actions">
          <button class="debug-button" @click="forceMigration">{{ $t('settings.forceMigration') }}</button>
          <button class="debug-button" @click="exportDebugData">{{ $t('settings.exportDebugData') }}</button>
          <button class="debug-button danger" @click="disableDebugMode">🔧 Disable Debug Mode</button>
        </div>
      </div>
    </div>

    <!-- Legal Section -->
    <div class="settings-section">
      <h3 class="section-title">{{ $t('settings.legal') }}</h3>
      <div class="settings-card">
         <div class="setting-item">
          <router-link to="/sources-disclaimer" class="setting-link">{{ $t('sourcesDisclaimer.title') }}</router-link>
        </div>
        <div class="setting-item">
          <a class="setting-link" href="https://kaloriq.sites.control-center.eu/privacy-policy.html" target="_blank"
            rel="noopener">{{ $t('settings.privacy') }}</a>
        </div>
        <div class="setting-item">
          <a class="setting-link" href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
            target="_blank" rel="noopener">{{ $t('settings.terms') }}</a>
        </div>
      </div>
    </div>

    <!-- About Section -->
    <div class="settings-section">
      <h3 class="section-title">{{ $t('settings.about') }}</h3>
      <div class="settings-card">
        <div class="setting-item">
          <span class="setting-label">{{ $t('settings.version') }}</span>
          <span class="setting-value">2.0.0</span>
        </div>

        <div class="setting-item">
          <span class="setting-label">{{ $t('settings.build') }}</span>
          <span class="setting-value build-clickable" @click="handleBuildClick">2024.09.001</span>
        </div>

        <!--<button class="action-button" @click="checkUpdates">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21,10.12H14.22L16.96,7.3C14.23,4.6 9.81,4.5 7.08,7.2C4.35,9.91 4.35,14.28 7.08,17C9.81,19.7 14.23,19.7 16.96,17C18.32,15.65 19,14.08 19,12.1H21C21,14.08 20.12,16.65 18.36,18.39C14.85,21.87 9.15,21.87 5.64,18.39C2.14,14.92 2.11,9.28 5.62,5.81C9.13,2.34 14.76,2.34 18.27,5.81L21,3V10.12M12.5,8V12.25L16,14.33L15.28,15.54L11,13V8H12.5Z"/>
          </svg>
          <span>{{ $t('settings.checkUpdates') }}</span>
        </button>-->
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <router-link to="/" class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        <span class="nav-label">{{ $t('app.home') }}</span>
      </router-link>
      <router-link to="/analytics" class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
        </svg>
        <span class="nav-label">{{ $t('app.analytics') }}</span>
      </router-link>
      <router-link to="/settings" class="nav-item active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
        </svg>
        <span class="nav-label">{{ $t('app.settings') }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  userProfile,
  dailyGoals,
  userPreferences,
  updateDailyGoals,
  updateUserPreferences,
  isSubscriptionActive,
  //updateUserProfile,
  resetOnboarding,
  //calculateRecommendedMacros
} from '../stores/userStore'
import { BarcodeCache, ScanHistory } from '../utils/storage'
import { MockDataManager } from '../utils/mockData'
import { setLanguage, getCurrentLanguage } from '../i18n'
import {
  getNotificationSettings,
  setNotificationSettings as saveNotificationSettingsToStore,
  getDebugMode,
  setDebugMode,
  toggleDebugMode
} from '../stores/preferencesStore'
import { NotificationService, type NotificationSettings } from '../services/notifications'
import { HealthKitService } from '../services/healthkit'
import { Capacitor } from '@capacitor/core'
import { isPremiumUser } from '../utils/premiumManager'
//, premiumManager, premiumFeatures
const router = useRouter()
const currentLanguage = ref(getCurrentLanguage())
const mockDataEnabled = ref(false)
const notificationSettings = ref<NotificationSettings>(NotificationService.getDefaultSettings())
const isNotificationSupported = computed(() => NotificationService.isSupported())

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
  console.log('HealthKit status text computed:', {
    isAvailable: healthKitStatus.value.isAvailable,
    isConnected: healthKitStatus.value.isConnected,
    isPremium: isPremiumUser.value
  })
  
  if (!healthKitStatus.value.isAvailable) {
    return 'Not available on this device'
  }
  return healthKitStatus.value.isConnected ? 'Connected & Syncing' : 'Not connected'
})

function goToUpgrade() {
  router.push('/upgrade')
}

const changeLanguage = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newLanguage = target.value as 'en' | 'de'
  setLanguage(newLanguage)
  currentLanguage.value = newLanguage
}

// Goal management
//const currentGoal = ref(userProfile.goal || 'maintain')

/*const goalOptions = computed(() => [
  {
    value: 'lose',
    icon: '📉',
    name: t('profile.goalOptions.lose.name'),
    description: t('profile.goalOptions.lose.description')
  },
  {
    value: 'maintain',
    icon: '⚖️',
    name: t('profile.goalOptions.maintain.name'),
    description: t('profile.goalOptions.maintain.description')
  },
  {
    value: 'gain',
    icon: '📈',
    name: t('profile.goalOptions.gain.name'),
    description: t('profile.goalOptions.gain.description')
  }
])*/

/*async function updateGoal(newGoal: string) {
  currentGoal.value = newGoal
  try {
    await updateUserProfile({ ...userProfile, goal: newGoal })
    
    // Recalculate goals based on new target
    if (userProfile.weight && userProfile.height && userProfile.age && userProfile.gender && userProfile.activityLevel) {
      const recommended = calculateRecommendedMacros({
        ...userProfile,
        goal: newGoal
      })
      await updateDailyGoals(recommended)
    }
  } catch (error) {
    console.error('Error updating goal:', error)
  }
}*/

// Debug state
const showDebugInfo = ref(false)
const debugInfo = ref({
  migrationComplete: false,
  barcodeCache: { count: 0, totalSize: 0 },
  scanHistoryCount: 0,
  capacitorPreferencesItems: 0,
  localStorageItems: 0
})

// Easter egg for debug mode
const buildClickCount = ref(0)
const buildClickTimeout = ref<number | null>(null)

// Check if debug mode should be enabled (e.g., if in development)
onMounted(async () => {
  // Load debug mode state
  showDebugInfo.value = await getDebugMode()
  
  if (showDebugInfo.value) {
    refreshDebugInfo()
  }

  // Load mock data state
  mockDataEnabled.value = await MockDataManager.isEnabled()

  // Load notification settings
  try {
    notificationSettings.value = await getNotificationSettings()
  } catch (error) {
    console.error('Error loading notification settings:', error)
  }

  // Initialize HealthKit status only for premium users
  //if (isPremiumUser.value) {
    await loadHealthKitStatus()
  //}
  
  // Also ensure we're watching for changes correctly
  console.log('Settings view mounted - Premium status:', isPremiumUser.value, 'HealthKit status:', healthKitStatus.value)
})

// Watch for premium status changes to load HealthKit when user upgrades
watch(isPremiumUser, async (newValue, oldValue) => {
  console.log('Premium status changed:', { from: oldValue, to: newValue })
  if (newValue && !oldValue) {
    // User just became premium - reload HealthKit status
    await loadHealthKitStatus()
  } else if (!newValue && oldValue) {
    // User lost premium - reset HealthKit status
    healthKitStatus.value.isConnected = false
    healthKitStatus.value.lastSync = null
    healthKitPermissions.value.forEach(permission => {
      permission.granted = false
    })
  }
}, { immediate: false })

// Use computed to display current user data with truncated name
function truncateName(name?: string, max = 20): string {
  const s = name || ''
  return s.length > max ? s.slice(0, max) + '...' : s
}

const displayProfile = computed(() => {
  const rawName = userProfile.name || 'Set up profile'
  const rawEmail = userProfile.email || 'Add email address'
  return {
    name: truncateName(rawName, 20),
    email: truncateName(rawEmail, 24)
  }
})

function editProfile() {
  router.push('/profile/edit')
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
      healthKitPermissions.value.forEach(permission => {
        permission.granted = true
      })
      
      // Nur lastSync setzen wenn wirklich verbunden
      healthKitStatus.value.lastSync = new Date().toISOString()
    } else {
      // Sicherstellen, dass Permissions auf false gesetzt sind wenn nicht verbunden
      healthKitPermissions.value.forEach(permission => {
        permission.granted = false
      })
      healthKitStatus.value.lastSync = null
    }

    console.log('HealthKit status loaded:', healthKitStatus.value)
  } catch (error) {
    console.error('Error loading HealthKit status:', error)
    healthKitStatus.value.isAvailable = false
    healthKitStatus.value.isConnected = false
    healthKitPermissions.value.forEach(permission => {
      permission.granted = false
    })
    healthKitStatus.value.lastSync = null
  }
}

async function connectHealthKit() {
  if (!isPremiumUser.value) {
    alert('❌ Apple Health integration requires a Premium subscription.')
    goToUpgrade()
    return
  }

  try {
    const success = await HealthKitService.initialize()
    if (success) {
      // Force reload the status to ensure UI is updated
      await loadHealthKitStatus()
      alert('✅ HealthKit erfolgreich verbunden!')
    } else {
      alert('❌ HealthKit Verbindung fehlgeschlagen. Bitte versuche es erneut.')
    }
  } catch (error) {
    console.error('Error connecting HealthKit:', error)
    alert('❌ Fehler beim Verbinden mit HealthKit.')
  }
}

async function syncHealthKit() {
  try {
    const success = await HealthKitService.syncTodaysData()
    if (success) {
      healthKitStatus.value.lastSync = new Date().toISOString()
      alert('✅ Daten erfolgreich mit HealthKit synchronisiert!')
    } else {
      alert('❌ Synchronisation fehlgeschlagen.')
    }
  } catch (error) {
    console.error('Error syncing HealthKit:', error)
    alert('❌ Fehler bei der Synchronisation.')
  }
}

async function disconnectHealthKit() {
  const confirmed = confirm('Möchtest du die HealthKit-Verbindung wirklich trennen?')
  if (confirmed) {
    try {
      // Reset the HealthKit connection in the service
      await HealthKitService.resetConnection()
      
      // Update UI state
      healthKitStatus.value.isConnected = false
      healthKitStatus.value.lastSync = null
      healthKitPermissions.value.forEach(permission => {
        permission.granted = false
      })
      
      alert('✅ HealthKit-Verbindung getrennt.')
    } catch (error) {
      console.error('Error disconnecting HealthKit:', error)
      alert('❌ Fehler beim Trennen der HealthKit-Verbindung.')
    }
  }
}

function formatLastSync(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Gerade eben'
  if (diffMins < 60) return `vor ${diffMins} Min`
  if (diffMins < 1440) return `vor ${Math.floor(diffMins / 60)} Std`
  return `vor ${Math.floor(diffMins / 1440)} Tagen`
}

// Easter egg: Build number click handler
function handleBuildClick() {
  buildClickCount.value++
  
  // Clear previous timeout
  if (buildClickTimeout.value) {
    clearTimeout(buildClickTimeout.value)
  }
  
  // Reset click count after 2 seconds
  buildClickTimeout.value = setTimeout(() => {
    buildClickCount.value = 0
  }, 2000)
  
  // Enable debug mode after 5 rapid clicks
  if (buildClickCount.value >= 5) {
    buildClickCount.value = 0
    if (buildClickTimeout.value) {
      clearTimeout(buildClickTimeout.value)
    }
    
    toggleDebugMode().then((enabled) => {
      showDebugInfo.value = enabled
      if (enabled) {
        refreshDebugInfo()
        alert('🐛 Debug mode activated!')
      } else {
        alert('🔧 Debug mode deactivated!')
      }
    })
  }
}

async function disableDebugMode() {
  await setDebugMode(false)
  showDebugInfo.value = false
  alert('🔧 Debug mode disabled!')
}

async function saveGoals() {
  console.log('Goals saved:', dailyGoals)
  await updateDailyGoals(dailyGoals)
}

async function savePreferences() {
  console.log('Preferences saved:', userPreferences)
  await updateUserPreferences(userPreferences)
}

async function saveNotificationSettings() {
  try {
    // If user is enabling notifications, request permission first
    if (notificationSettings.value.enabled && isNotificationSupported.value) {
      const permission = await NotificationService.requestPermissions()
      if (!permission.granted) {
        notificationSettings.value.enabled = false
        alert('Benachrichtigungen können nicht aktiviert werden. Bitte erlaube Benachrichtigungen in den Systemeinstellungen.')
        return
      }
    }

    await saveNotificationSettingsToStore(notificationSettings.value)
    console.log('Notification settings saved:', notificationSettings.value)
  } catch (error) {
    console.error('Error saving notification settings:', error)
    alert('Fehler beim Speichern der Benachrichtigungseinstellungen')
  }
}

async function toggleMockData() {
  try {
    await MockDataManager.setEnabled(mockDataEnabled.value)
    if (mockDataEnabled.value) {
      alert('📦 Mock data activated! Perfect for screenshots.')
    } else {
      alert('🧹 Mock data removed! Back to real data.')
    }
  } catch (error) {
    console.error('Error toggling mock data:', error)
    alert('❌ Failed to toggle mock data.')
  }
}

/*async function recalculateGoals() {
  if (userProfile.weight && userProfile.height && userProfile.age && userProfile.gender && userProfile.activityLevel) {
    const recommended = calculateRecommendedMacros(userProfile)
    await updateDailyGoals(recommended)
    alert('Goals updated based on your current profile!')
  } else {
    alert('Please complete your profile first to get personalized recommendations.')
  }
}*/

async function exportData() {
  try {
    const exportButton = document.querySelector('.action-button[data-export]') as HTMLButtonElement
    if (exportButton) {
      exportButton.disabled = true
      exportButton.textContent = 'Exporting...'
    }

    const scanHistory = await ScanHistory.get()
    const barcodeStats = await BarcodeCache.getStats()

    const data = {
      profile: userProfile,
      goals: dailyGoals,
      preferences: userPreferences,
      scanHistory,
      statistics: {
        totalScans: scanHistory.length,
        barcodesCached: barcodeStats.count,
        cacheSize: barcodeStats.totalSize
      },
      exportDate: new Date().toISOString(),
      exportVersion: '1.0',
      appVersion: '2.0.0'
    }

    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })

    // Helper: convert Blob to data URL (base64)
    const blobToBase64 = (b: Blob) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(b)
    })

    const tryCapacitorExport = async () => {
      try {
        const FilesystemModule: any = await import('@capacitor/filesystem')
        const ShareModule: any = await import('@capacitor/share')

        const Filesystem = FilesystemModule.Filesystem
        const Directory = FilesystemModule.Directory
        const Share = ShareModule.Share

        const dateStr = new Date().toISOString().split('T')[0]
        const fileName = `kaloriq-data-${dateStr}.json`

        const dataUrl = await blobToBase64(blob)
        const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl

        await Filesystem.writeFile({ path: fileName, data: base64, directory: Directory.Documents })

        const uriResult = await Filesystem.getUri({ directory: Directory.Documents, path: fileName })
        await Share.share({ title: 'Kaloriq Export', text: 'Exported Kaloriq data', url: uriResult.uri })

        return true
      } catch (err) {
        console.warn('Capacitor filesystem/share export failed or not available:', err)
        return false
      }
    }

    await tryCapacitorExport()

    /*
    ----- No Web ------
    const usedNative = 
    if (!usedNative) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `kaloriq-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }*/

    alert('Data exported successfully!')

  } catch (error) {
    console.error('Export failed:', error)
    alert('Failed to export data. Please try again.')
  } finally {
    const exportButton = document.querySelector('.action-button[data-export]') as HTMLButtonElement
    if (exportButton) {
      exportButton.disabled = false
      exportButton.textContent = 'Export Data'
    }
  }
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
      migrationComplete: true,
      barcodeCache: cacheStats,
      scanHistoryCount: scanHistory.length,
      capacitorPreferencesItems: 0,
      localStorageItems: 0,
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

let touchStartX = 0
let touchStartY = 0
const swipeThreshold = 50

function handleTouchStart(event: TouchEvent) {
  touchStartX = event.touches[0].clientX
  touchStartY = event.touches[0].clientY
}

function handleTouchMove(event: TouchEvent) {
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
  overflow: hidden;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
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

.number-input,
.select-input {
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
  position: absolute;
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
  display: block;
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

.toggle-input:checked+.toggle-slider {
  background: #4caf50;
}

.toggle-input:checked+.toggle-slider:before {
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

/* HealthKit Styles */
.healthkit-status {
  width: 100%;
}

.healthkit-header {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.healthkit-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  color: white;
}

.healthkit-description {
  font-size: 14px;
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
}

.healthkit-indicator {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: background 0.2s;
}

.healthkit-indicator.connected .status-dot {
  background: #4CAF50;
}

.healthkit-connect {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.4);
}

.healthkit-connect:hover {
  background: rgba(76, 175, 80, 0.3);
  border-color: rgba(76, 175, 80, 0.6);
}

.healthkit-permissions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.permissions-header {
  margin-bottom: 12px;
}

.permissions-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
}

.permission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.permission-item:last-child {
  border-bottom: none;
}

.permission-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.permission-name {
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.permission-description {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.permission-status {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sync-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.sync-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.sync-time {
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.healthkit-unavailable {
  padding: 16px;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 8px;
  text-align: center;
}

.healthkit-unavailable p {
  margin: 0;
  color: #FFC107;
  font-size: 14px;
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

.debug-button.danger {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border-color: rgba(244, 67, 54, 0.4);
}

.debug-button.danger:hover {
  background: rgba(244, 67, 54, 0.3);
  border-color: rgba(244, 67, 54, 0.6);
}

.build-clickable {
  cursor: pointer;
  transition: color 0.2s;
  user-select: none;
}

.build-clickable:hover {
  color: #4caf50;
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

a {
  color: white;
  /*text-decoration: none;*/
}

/* Goal options styling */
.goal-option-small {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 8px 0;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.goal-option-small:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(74, 222, 128, 0.3);
}

.goal-option-small.selected {
  background: rgba(74, 222, 128, 0.2);
  border-color: #4ade80;
}

.goal-option-small .goal-icon {
  font-size: 24px;
  margin-right: 16px;
}

.goal-option-small .goal-text h4 {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.goal-option-small .goal-text p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
}

/* Notification Settings Styles */
.meal-setting {
  flex-direction: column;
  align-items: stretch !important;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
}

.time-setting {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.time-input {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 8px 12px;
  font-size: 14px;
  width: 120px;
}

.time-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

.notification-warning {
  color: #ffa726;
  font-size: 14px;
  padding: 12px;
  background: rgba(255, 167, 38, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 167, 38, 0.2);
}

.notification-status {
  color: #4caf50;
  font-size: 14px;
  padding: 12px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.inactivity-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-style: italic;
}

/* Upgrade/Premium Cards */
.upgrade-card {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.upgrade-card:hover {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.15));
  border-color: rgba(255, 215, 0, 0.5);
  transform: translateY(-1px);
}

.upgrade-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.upgrade-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e1e2e;
  flex-shrink: 0;
}

.upgrade-info {
  flex: 1;
}

.upgrade-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #FFD700;
}

.upgrade-description {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
  line-height: 1.3;
}

.upgrade-arrow {
  opacity: 0.6;
  color: #FFD700;
}

.premium-status-card {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1));
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
  backdrop-filter: blur(10px);
}

.premium-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.premium-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.premium-info {
  flex: 1;
}

.premium-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #4CAF50;
}

.premium-description {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
  line-height: 1.3;
}

.premium-badge {
  background: #4CAF50;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

/* Premium Required Message */
.premium-required-message {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1));
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.premium-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #FFD700, #FFA000);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1d26;
  flex-shrink: 0;
}

.premium-message-content {
  flex: 1;
}

.premium-message-content h4 {
  margin: 0 0 4px 0;
  color: #FFD700;
  font-size: 16px;
  font-weight: 600;
}

.premium-message-content p {
  margin: 0 0 12px 0;
  color: #ffffff;
  opacity: 0.9;
  font-size: 14px;
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
</style>
