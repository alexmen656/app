import { Storage } from '../utils/storage'
import { type NotificationSettings, NotificationService } from '../services/notifications'

const LAST_REVIEW_KEY = 'lastReviewPromptAt'
const NOTIFICATION_SETTINGS_KEY = 'notificationSettings'
const DEBUG_MODE_KEY = 'debugMode'

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
export async function getDebugMode(): Promise<boolean> {
  try {
    const value = await Storage.get(DEBUG_MODE_KEY)
    return value === 'true'
  } catch (e) {
    console.error('preferencesStore.getDebugMode error', e)
    return false
  }
}

export async function setDebugMode(enabled: boolean): Promise<void> {
  try {
    await Storage.set(DEBUG_MODE_KEY, enabled ? 'true' : 'false')
  } catch (e) {
    console.error('preferencesStore.setDebugMode error', e)
  }
}

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
}export default {
  getLastReviewPrompt,
  setLastReviewPrompt,
  shouldShowReviewPrompt,
  getNotificationSettings,
  setNotificationSettings
}