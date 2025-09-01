import { ref, computed, watch } from 'vue'
import { revenueCatService } from '../services/revenuecat'

// State für Premium-Status
export const isPremiumUser = ref(false)
export const subscriptionType = ref<string>('')

// Callback functions für Premium-Status-Änderungen
type PremiumStatusCallback = (isPremium: boolean, type: string) => void
const premiumStatusCallbacks: Set<PremiumStatusCallback> = new Set()

export function onPremiumStatusChange(callback: PremiumStatusCallback) {
  premiumStatusCallbacks.add(callback)
  return () => premiumStatusCallbacks.delete(callback)
}

// Watch für automatische Callbacks
watch([isPremiumUser, subscriptionType], ([newIsPremium, newType], [oldIsPremium, oldType]) => {
  if (newIsPremium !== oldIsPremium || newType !== oldType) {
    console.log('🎉 Premium status changed:', { from: oldIsPremium, to: newIsPremium, type: newType })
    premiumStatusCallbacks.forEach(callback => {
      try {
        callback(newIsPremium, newType)
      } catch (error) {
        console.error('Error in premium status callback:', error)
      }
    })
  }
}, { immediate: false })

// Premium-Features Konfiguration
export const premiumFeatures = {
  // Analytics Features
  UNLIMITED_ANALYTICS_HISTORY: 'unlimited_analytics_history',
  EXPORT_DATA: 'export_data', 
  DETAILED_CHARTS: 'detailed_charts',
  
  // Scanning Features
  UNLIMITED_FOOD_SCANS: 'unlimited_food_scans',
  ADVANCED_FOOD_ANALYSIS: 'advanced_food_analysis',
  
  // Widget Features  
  IOS_WIDGETS: 'ios_widgets',
  ADVANCED_WIDGETS: 'advanced_widgets',
  
  // HealthKit Features
  HEALTHKIT_SYNC: 'healthkit_sync',
  AUTO_BACKUP: 'auto_backup',
  
  // Other Features
  STREAK_INSIGHTS: 'streak_insights',
  CUSTOM_GOALS: 'custom_goals',
  MEAL_PLANNING: 'meal_planning'
} as const

// Free User Limits
export const freeLimits = {
  DAILY_FOOD_SCANS: 10,
  ANALYTICS_HISTORY_DAYS: 7,
  WIDGET_ACCESS: false,
  HEALTHKIT_SYNC: false,
  EXPORT_FUNCTIONS: false
}

// Usage Tracking für Free Users (deprecated - now using native Swift tracking)
export const usageTracking = ref({
  dailyFoodScans: 0,
  lastResetDate: new Date().toDateString()
})

export class PremiumManager {
  private static instance: PremiumManager
  
  private constructor() {}
  
  static getInstance(): PremiumManager {
    if (!PremiumManager.instance) {
      PremiumManager.instance = new PremiumManager()
    }
    return PremiumManager.instance
  }
  
  /**
   * Überprüfe ob ein Feature verfügbar ist
   */
  async canAccessFeature(feature: string): Promise<boolean> {
    const isSubscribed = await this.checkSubscriptionStatus()
    
    if (isSubscribed) {
      return true
    }
    
    // Feature-spezifische Checks für Free Users
    switch (feature) {
      case premiumFeatures.UNLIMITED_FOOD_SCANS:
        return await this.checkDailyFoodScanLimit()
        
      case premiumFeatures.UNLIMITED_ANALYTICS_HISTORY:
        return false // Premium only
        
      case premiumFeatures.IOS_WIDGETS:
        return false // Premium only
        
      case premiumFeatures.HEALTHKIT_SYNC:
        return false // Premium only
        
      case premiumFeatures.EXPORT_DATA:
        return false // Premium only
        
      case premiumFeatures.DETAILED_CHARTS:
        return false // Premium only für Detail-Views
        
      default:
        return true // Basis-Features sind frei
    }
  }
  
  /**
   * Premium-Status aktualisieren und mit nativem System synchronisieren
   */
  async updatePremiumStatus(): Promise<void> {
    try {
      const hasSubscription = await revenueCatService.checkSubscriptionStatus()
      isPremiumUser.value = hasSubscription
      
      if (hasSubscription) {
        // Subscription-Typ ermitteln (falls nötig)
        subscriptionType.value = 'Premium'
      } else {
        subscriptionType.value = ''
      }
      
      // NEW: Synchronisiere mit nativem Scan-Limit-System
      await this.syncWithNativeScanLimits(hasSubscription)
      
      console.log('Premium status updated:', { isPremiumUser: isPremiumUser.value })
    } catch (error) {
      console.error('Error updating premium status:', error)
      isPremiumUser.value = false
    }
  }

  /**
   * Manueller Premium-Status Update (für nach Purchase/Restore)
   */
  static async forceUpdatePremiumStatus(): Promise<void> {
    try {
      const instance = PremiumManager.getInstance()
      await instance.updatePremiumStatus()
      
      console.log('🎉 Premium status force updated - callbacks will be triggered automatically')
    } catch (error) {
      console.error('Error force updating premium status:', error)
    }
  }
  
  /**
   * Synchronisiere Premium-Status mit nativem Swift Scan-Limit-System
   */
  private async syncWithNativeScanLimits(isPremium: boolean, expiryDate?: Date): Promise<void> {
    try {
      // Importiere das Barcode Scanner Plugin dynamisch
      const { KaloriqBarcodeScanner } = await import('kaloriq-barcode-scanner')
      
      // Setze Premium-Status im nativen System
      await (KaloriqBarcodeScanner as any).setPremiumStatus({
        isPremium,
        expiryDate: expiryDate ? expiryDate.getTime() : undefined
      })
      
      console.log('Native scan limits synchronized with premium status:', isPremium)
    } catch (error) {
      console.error('Error syncing with native scan limits:', error)
    }
  }
  
  /**
   * Subscription-Status prüfen
   */
  private async checkSubscriptionStatus(): Promise<boolean> {
    try {
      return await revenueCatService.checkSubscriptionStatus()
    } catch (error) {
      console.error('Error checking subscription:', error)
      return false
    }
  }
  
  /**
   * Tägliches Food-Scan-Limit prüfen
   */
  private async checkDailyFoodScanLimit(): Promise<boolean> {
    await this.resetDailyCountersIfNeeded()
    return usageTracking.value.dailyFoodScans < freeLimits.DAILY_FOOD_SCANS
  }
  
  /**
   * Food-Scan-Usage erhöhen
   */
  async incrementFoodScanUsage(): Promise<void> {
    await this.resetDailyCountersIfNeeded()
    usageTracking.value.dailyFoodScans++
    await this.saveUsageTracking()
  }
  
  /**
   * Tägliche Counter zurücksetzen falls neuer Tag
   */
  private async resetDailyCountersIfNeeded(): Promise<void> {
    const today = new Date().toDateString()
    
    if (usageTracking.value.lastResetDate !== today) {
      usageTracking.value.dailyFoodScans = 0
      usageTracking.value.lastResetDate = today
      await this.saveUsageTracking()
    }
  }
  
  /**
   * Usage-Daten speichern
   */
  private async saveUsageTracking(): Promise<void> {
    try {
      const { Preferences } = await import('@capacitor/preferences')
      await Preferences.set({
        key: 'usage_tracking',
        value: JSON.stringify(usageTracking.value)
      })
    } catch (error) {
      console.error('Error saving usage tracking:', error)
    }
  }
  
  /**
   * Usage-Daten laden
   */
  async loadUsageTracking(): Promise<void> {
    try {
      const { Preferences } = await import('@capacitor/preferences')
      const result = await Preferences.get({ key: 'usage_tracking' })
      
      if (result.value) {
        const data = JSON.parse(result.value)
        usageTracking.value = {
          dailyFoodScans: data.dailyFoodScans || 0,
          lastResetDate: data.lastResetDate || new Date().toDateString()
        }
      }
    } catch (error) {
      console.error('Error loading usage tracking:', error)
    }
  }
  
  /**
   * Premium-Upgrade anzeigen
   */
  showUpgradePrompt(feature: string): void {
    // Navigation zur Upgrade-View mit Feature-Kontext
    if (typeof window !== 'undefined' && (window as any).router) {
      (window as any).router.push({
        name: 'Upgrade',
        query: { feature }
      })
    }
  }
  
  /**
   * Verbleibende Free-Scans für heute
   */
  getRemainingFoodScans(): number {
    return Math.max(0, freeLimits.DAILY_FOOD_SCANS - usageTracking.value.dailyFoodScans)
  }
}

// Computed Properties für Templates
export const remainingFoodScans = computed(() => {
  return Math.max(0, freeLimits.DAILY_FOOD_SCANS - usageTracking.value.dailyFoodScans)
})

export const hasUnlimitedScans = computed(() => {
  return isPremiumUser.value
})

export const canUseWidgets = computed(() => {
  return isPremiumUser.value
})

export const canExportData = computed(() => {
  return isPremiumUser.value
})

// Premium Manager Instance
export const premiumManager = PremiumManager.getInstance()
