import { HealthKit } from 'kaloriq-health-kit';

export interface HealthKitData {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  date?: string;
}

export class HealthKitService {
  private static isPermissionGranted = false;

  /**
   * Initialize HealthKit and request permissions
   */
  static async initialize(): Promise<boolean> {
    try {
      const { available } = await HealthKit.isAvailable();
      
      if (!available) {
        console.log('HealthKit is not available on this device');
        return false;
      }

      const { granted } = await HealthKit.requestHealthKitPermissions({
        read: true,
        write: true
      });

      this.isPermissionGranted = granted;
      
      if (!granted) {
        console.log('HealthKit permissions not granted');
        return false;
      }

      console.log('HealthKit initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing HealthKit:', error);
      return false;
    }
  }

  /**
   * Check if HealthKit is available and permissions are granted
   */
  static async isAvailable(): Promise<boolean> {
    try {
      const { available } = await HealthKit.isAvailable();
      return available && this.isPermissionGranted;
    } catch (error) {
      console.error('Error checking HealthKit availability:', error);
      return false;
    }
  }

  /**
   * Sync nutrition data to HealthKit
   */
  static async syncNutritionData(data: HealthKitData): Promise<boolean> {
    try {
      if (!this.isPermissionGranted) {
        console.log('HealthKit permissions not granted');
        return false;
      }

      const { success } = await HealthKit.writeNutritionData({
        calories: data.calories || 0,
        protein: data.protein || 0,
        carbs: data.carbs || 0,
        fat: data.fat || 0,
        date: data.date || new Date().toISOString()
      });

      if (success) {
        console.log('Nutrition data synced to HealthKit successfully');
      }

      return success;
    } catch (error) {
      console.error('Error syncing nutrition data to HealthKit:', error);
      return false;
    }
  }

  /**
   * Read nutrition data from HealthKit for a specific date
   */
  static async getNutritionData(date: string): Promise<HealthKitData | null> {
    try {
      if (!this.isPermissionGranted) {
        console.log('HealthKit permissions not granted');
        return null;
      }

      const data = await HealthKit.readNutritionData({ date });
      return {
        calories: data.calories || 0,
        protein: data.protein || 0,
        carbs: data.carbs || 0,
        fat: data.fat || 0,
        date: date
      };
    } catch (error) {
      console.error('Error reading nutrition data from HealthKit:', error);
      return null;
    }
  }

  /**
   * Read nutrition data from HealthKit for a date range
   */
  static async getNutritionDataRange(startDate: string, endDate: string): Promise<HealthKitData[]> {
    try {
      if (!this.isPermissionGranted) {
        console.log('HealthKit permissions not granted');
        return [];
      }

      const result = await HealthKit.readNutritionDataRange({ startDate, endDate });
      return result.data.map(item => ({
        calories: item.calories || 0,
        protein: item.protein || 0,
        carbs: item.carbs || 0,
        fat: item.fat || 0,
        date: item.date
      }));
    } catch (error) {
      console.error('Error reading nutrition data range from HealthKit:', error);
      return [];
    }
  }

  /**
   * Sync today's scan data from Kaloriq to HealthKit
   */
  static async syncTodaysData(): Promise<boolean> {
    try {
      // Import your ScanHistory utility
      const { ScanHistory } = await import('../utils/storage');
      
      const history = await ScanHistory.get();
      const today = new Date().toISOString().split('T')[0];
      
      // Filter scans for today only
      const todaysScans = history.filter(scan => {
        const scanDate = new Date(scan.timestamp).toISOString().split('T')[0];
        return scanDate === today;
      });

      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFats = 0;

      todaysScans.forEach(scan => {
        if (scan.type === 'food' && scan.data.total) {
          totalCalories += scan.data.total.calories || 0;
          totalProtein += scan.data.total.protein || 0;
          totalCarbs += scan.data.total.carbs || 0;
          totalFats += scan.data.total.fat || 0;
        } else if (scan.type === 'barcode' && scan.data.nutriments) {
          totalCalories += scan.data.nutriments.energy_kcal_100g || 0;
          totalProtein += scan.data.nutriments.proteins_100g || 0;
          totalCarbs += scan.data.nutriments.carbohydrates_100g || 0;
          totalFats += scan.data.nutriments.fat_100g || 0;
        }
      });

      return await this.syncNutritionData({
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFats,
        date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error syncing today\'s data to HealthKit:', error);
      return false;
    }
  }
}
