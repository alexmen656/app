import { Storage } from '../utils/storage'
import { type NotificationSettings, NotificationService } from '../services/notifications'
import { ref, watch } from 'vue'

const LAST_REVIEW_KEY = 'lastReviewPromptAt'
const NOTIFICATION_SETTINGS_KEY = 'notificationSettings'
const DEBUG_MODE_KEY = 'debugMode'

// Reactive debug mode state
export const isDebugMode = ref(false)

// Auto-initialize debug mode when store is imported
let isInitialized = false

// Initialize debug mode from storage
export async function initializeDebugMode() {
  if (isInitialized) return
  
  try {
    const stored = await Storage.get(DEBUG_MODE_KEY)
    isDebugMode.value = stored === 'true'
    isInitialized = true
    console.log('Debug mode initialized:', isDebugMode.value)
  } catch (e) {
    console.error('Failed to initialize debug mode:', e)
    isDebugMode.value = false
    isInitialized = true
  }
}

// Auto-initialize on import
initializeDebugMode()

// Watch for debug mode changes and persist to storage
watch(isDebugMode, async (newValue) => {
  try {
    console.log('Debug mode changed, saving to storage:', newValue)
    await Storage.set(DEBUG_MODE_KEY, String(newValue))
  } catch (e) {
    console.error('Failed to save debug mode:', e)
  }
})

export async function getDebugMode(): Promise<boolean> {
  try {
    const stored = await Storage.get(DEBUG_MODE_KEY)
    return stored === 'true'
  } catch (e) {
    console.error('preferencesStore.getDebugMode error', e)
    return false
  }
}

export async function setDebugMode(enabled: boolean): Promise<void> {
  try {
    console.log('Setting debug mode to:', enabled)
    isDebugMode.value = enabled
    await Storage.set(DEBUG_MODE_KEY, String(enabled))
    console.log('Debug mode set successfully:', isDebugMode.value)
  } catch (e) {
    console.error('preferencesStore.setDebugMode error', e)
  }
}

export async function getLastReviewPrompt(): Promise<number | null> {
  try {
    const v = await Storage.get(LAST_REVIEW_KEY)
    if (!v) return null
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  } catch (e) {
    console.error('preferencesStore.getLastReviewPrompt error', e)
    return null
  }
}

export async function setLastReviewPrompt(timestamp: number): Promise<void> {
  try {
    await Storage.set(LAST_REVIEW_KEY, String(timestamp))
  } catch (e) {
    console.error('preferencesStore.setLastReviewPrompt error', e)
  }
}

export async function shouldShowReviewPrompt(days = 5): Promise<boolean> {
    console.log("Checking if review prompt should be shown")
  try {
    const last = await getLastReviewPrompt()
    if (!last) return true
    const msSince = Date.now() - last
    const threshold = days * 24 * 60 * 60 * 1000
    console.log(msSince >= threshold);
    return msSince >= threshold
  } catch (e) {
    console.error('preferencesStore.shouldShowReviewPrompt error', e)
    return true
  }
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
  const stored = await Storage.get(NOTIFICATION_SETTINGS_KEY)
  if (stored) return stored as NotificationSettings
  return NotificationService.getDefaultSettings()
  } catch (e) {
    console.error('preferencesStore.getNotificationSettings error', e)
    return NotificationService.getDefaultSettings()
  }
}

export async function setNotificationSettings(settings: NotificationSettings): Promise<void> {
  try {
    await Storage.set(NOTIFICATION_SETTINGS_KEY, settings)
  } catch (e) {
    console.error('preferencesStore.setNotificationSettings error', e)
  }
}

// Debug mode functions
export async function toggleDebugMode(): Promise<boolean> {
  try {
    const current = await getDebugMode()
    const newValue = !current
    await setDebugMode(newValue)
    
    return newValue
  } catch (e) {
    console.error('preferencesStore.toggleDebugMode error', e)
    return false
  }
}

export default {
  getLastReviewPrompt,
  setLastReviewPrompt,
  shouldShowReviewPrompt,
  getNotificationSettings,
  setNotificationSettings
}