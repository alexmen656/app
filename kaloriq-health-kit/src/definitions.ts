declare module '@capacitor/core' {
  interface PluginRegistry {
    HealthKit: HealthKitPlugin;
  }
}

export interface HealthData {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  date?: string; // ISO date string
}

export interface HealthKitPermissions {
  read?: boolean;
  write?: boolean;
}

export interface HealthKitPlugin {
  /**
   * Check if HealthKit is available on this device
   */
  isAvailable(): Promise<{ available: boolean }>;

  /**
   * Request permissions for HealthKit
   */
  requestHealthKitPermissions(options: HealthKitPermissions): Promise<{ granted: boolean }>;

  /**
   * Write nutrition data to HealthKit
   */
  writeNutritionData(options: HealthData): Promise<{ success: boolean }>;

  /**
   * Read nutrition data from HealthKit for a specific date
   */
  readNutritionData(options: { date: string }): Promise<HealthData>;

  /**
   * Read nutrition data from HealthKit for a date range
   */
  readNutritionDataRange(options: { 
    startDate: string; 
    endDate: string 
  }): Promise<{ data: HealthData[] }>;
}
