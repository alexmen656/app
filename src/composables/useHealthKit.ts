import { ref, onMounted } from 'vue'
import { HealthKitService } from '../services/healthkit'
import type { HealthKitData } from '../services/healthkit'

const isHealthKitAvailable = ref(false)
const isHealthKitInitialized = ref(false)

export function useHealthKit() {
  // Initialize HealthKit on first use
  onMounted(async () => {
    if (!isHealthKitInitialized.value) {
      isHealthKitAvailable.value = await HealthKitService.initialize()
      isHealthKitInitialized.value = true
    }
  })

  /**
   * Sync nutrition data to HealthKit
   */
  const syncToHealthKit = async (data: HealthKitData): Promise<boolean> => {
    if (!isHealthKitAvailable.value) {
      console.log('HealthKit not available')
      return false
    }
    
    return await HealthKitService.syncNutritionData(data)
  }

  /**
   * Sync today's scan data to HealthKit
   */
  const syncTodaysData = async (): Promise<boolean> => {
    if (!isHealthKitAvailable.value) {
      console.log('HealthKit not available')
      return false
    }
    
    return await HealthKitService.syncTodaysData()
  }

  /**
   * Get nutrition data from HealthKit for a specific date
   */
  const getHealthKitData = async (date: string): Promise<HealthKitData | null> => {
    if (!isHealthKitAvailable.value) {
      console.log('HealthKit not available')
      return null
    }
    
    return await HealthKitService.getNutritionData(date)
  }

  /**
   * Get nutrition data from HealthKit for a date range
   */
  const getHealthKitDataRange = async (startDate: string, endDate: string): Promise<HealthKitData[]> => {
    if (!isHealthKitAvailable.value) {
      console.log('HealthKit not available')
      return []
    }
    
    return await HealthKitService.getNutritionDataRange(startDate, endDate)
  }

  return {
    isHealthKitAvailable: isHealthKitAvailable.value,
    syncToHealthKit,
    syncTodaysData,
    getHealthKitData,
    getHealthKitDataRange
  }
}
