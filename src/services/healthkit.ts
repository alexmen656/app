import { HealthKit } from 'kalbuddy-health-kit';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

export interface HealthKitData {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  date?: string;
}

export class HealthKitService {
  private static readonly PERMISSION_KEY = 'healthkit_permission_granted';
  private static readonly INITIALIZATION_KEY = 'healthkit_initialized';
  
  // Cache für bessere Performance
  private static permissionCache: boolean | null = null;
  private static initializationCache: boolean | null = null;

  /**
   * Persistente Speicherung der HealthKit-Berechtigung
   */
  private static async setPermissionGranted(granted: boolean): Promise<void> {
    try {
      await Preferences.set({
        key: this.PERMISSION_KEY,
        value: granted.toString()
      });
      this.permissionCache = granted;
    } catch (error) {
      console.error('Error saving HealthKit permission status:', error);
    }
  }

  /**
   * Abrufen der persistierten HealthKit-Berechtigung
   */
  private static async getPermissionGranted(): Promise<boolean> {
    try {
      if (this.permissionCache !== null) {
        return this.permissionCache;
      }

      const { value } = await Preferences.get({ key: this.PERMISSION_KEY });
      const granted = value === 'true';
      this.permissionCache = granted;
      return granted;
    } catch (error) {
      console.error('Error loading HealthKit permission status:', error);
      return false;
    }
  }

  /**
   * Persistente Speicherung des Initialisierungsstatus
   */
  private static async setInitialized(initialized: boolean): Promise<void> {
    try {
      await Preferences.set({
        key: this.INITIALIZATION_KEY,
        value: initialized.toString()
      });
      this.initializationCache = initialized;
    } catch (error) {
      console.error('Error saving HealthKit initialization status:', error);
    }
  }

  /**
   * Abrufen des persistierten Initialisierungsstatus
   */
  private static async getInitialized(): Promise<boolean> {
    try {
      if (this.initializationCache !== null) {
        return this.initializationCache;
      }

      const { value } = await Preferences.get({ key: this.INITIALIZATION_KEY });
      const initialized = value === 'true';
      this.initializationCache = initialized;
      return initialized;
    } catch (error) {
      console.error('Error loading HealthKit initialization status:', error);
      return false;
    }
  }

  /**
   * Initialize HealthKit and request permissions
   */
  static async initialize(): Promise<boolean> {
    try {
      // Check if we're on iOS
      if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
        console.log('HealthKit is only available on iOS devices');
        return false;
      }

      console.log('🩺 Initializing HealthKit...');
      
      const { available } = await HealthKit.isAvailable();
      console.log('🩺 HealthKit available:', available);
      
      if (!available) {
        console.log('❌ HealthKit is not available on this device (are you using the iOS Simulator?)');
        return false;
      }

      console.log('🩺 Requesting HealthKit permissions...');
      const { granted } = await HealthKit.requestHealthKitPermissions({
        read: true,
        write: true
      });

      console.log('🩺 HealthKit permissions granted:', granted);
      await this.setPermissionGranted(granted);
      await this.setInitialized(true);
      
      if (!granted) {
        console.log('❌ HealthKit permissions not granted by user');
        return false;
      }

      console.log('✅ HealthKit initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Error initializing HealthKit:', error);
      return false;
    }
  }

  /**
   * Check if HealthKit is available on the device (without permission check)
   */
  static async isHealthKitAvailable(): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
        return false;
      }

      const { available } = await HealthKit.isAvailable();
      console.log('🩺 HealthKit device availability check:', available);
      return available;
    } catch (error) {
      console.error('❌ Error checking HealthKit device availability:', error);
      return false;
    }
  }

  /**
   * Check if HealthKit is available and permissions are granted
   */
  static async isAvailable(): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
        return false;
      }

      const { available } = await HealthKit.isAvailable();
      const permissionGranted = await this.getPermissionGranted();
      
      console.log('🩺 HealthKit availability check:', available, 'Permissions:', permissionGranted);
      return available && permissionGranted;
    } catch (error) {
      console.error('❌ Error checking HealthKit availability:', error);
      return false;
    }
  }

  /**
   * Sync nutrition data to HealthKit
   */
  static async syncNutritionData(data: HealthKitData): Promise<boolean> {
    try {
      const permissionGranted = await this.getPermissionGranted();
      if (!permissionGranted) {
        console.log('🩺 HealthKit permissions not granted, skipping sync');
        return false;
      }

      console.log('🩺 Syncing nutrition data to HealthKit:', data);
      const { success } = await HealthKit.writeNutritionData({
        calories: data.calories || 0,
        protein: data.protein || 0,
        carbs: data.carbs || 0,
        fat: data.fat || 0,
        date: data.date || new Date().toISOString()
      });

      if (success) {
        console.log('✅ Nutrition data synced to HealthKit successfully');
      } else {
        console.log('❌ Failed to sync nutrition data to HealthKit');
      }

      return success;
    } catch (error) {
      console.error('❌ Error syncing nutrition data to HealthKit:', error);
      return false;
    }
  }

  /**
   * Read nutrition data from HealthKit for a specific date
   */
  static async getNutritionData(date: string): Promise<HealthKitData | null> {
    try {
      const permissionGranted = await this.getPermissionGranted();
      if (!permissionGranted) {
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
      const permissionGranted = await this.getPermissionGranted();
      if (!permissionGranted) {
        console.log('HealthKit permissions not granted');
        return [];
      }

      const result = await HealthKit.readNutritionDataRange({ startDate, endDate });
      return result.data.map((item) => ({
        calories: item.calories || 0,
        protein: item.protein || 0,
        carbs: item.carbs || 0,
        fat: item.fat || 0,
        date: item.date || startDate
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
      const permissionGranted = await this.getPermissionGranted();
      if (!permissionGranted) {
        console.log('🩺 HealthKit permissions not granted, skipping sync');
        return false;
      }

      console.log('🩺 Starting sync of today\'s data to HealthKit...');
      
      // Import your ScanHistory utility
      const { ScanHistory } = await import('../utils/storage');
      
      const history = await ScanHistory.get();
      const today = new Date().toISOString().split('T')[0];
      
      // Filter scans for today only
      const todaysScans = history.filter(scan => {
        const scanDate = new Date(scan.timestamp).toISOString().split('T')[0];
        return scanDate === today;
      });

      console.log('🩺 Found', todaysScans.length, 'scans for today');

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

      console.log('🩺 Total nutrition for today:', { 
        calories: totalCalories, 
        protein: totalProtein, 
        carbs: totalCarbs, 
        fat: totalFats 
      });

      return await this.syncNutritionData({
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFats,
        date: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error syncing today\'s data to HealthKit:', error);
      return false;
    }
  }

  /**
   * Debug method to check plugin status
   */
  static async debugStatus(): Promise<void> {
    try {
      const permissionGranted = await this.getPermissionGranted();
      const initialized = await this.getInitialized();
      
      console.log('🔍 HealthKit Debug Status:');
      console.log('- Platform:', Capacitor.getPlatform());
      console.log('- Is Native Platform:', Capacitor.isNativePlatform());
      console.log('- Plugin Available:', typeof HealthKit !== 'undefined');
      console.log('- Permissions Granted:', permissionGranted);
      console.log('- Is Initialized:', initialized);

      if (typeof HealthKit !== 'undefined') {
        try {
          const { available } = await HealthKit.isAvailable();
          console.log('- HealthKit Available:', available);
        } catch (error) {
          console.error('- Error checking availability:', error);
        }
      }
    } catch (error) {
      console.error('❌ Error in debug status:', error);
    }
  }

  /**
   * Reset HealthKit connection (for debugging/troubleshooting)
   */
  static async resetConnection(): Promise<void> {
    try {
      await this.setPermissionGranted(false);
      await this.setInitialized(false);
      this.permissionCache = null;
      this.initializationCache = null;
      console.log('🔄 HealthKit connection reset');
    } catch (error) {
      console.error('❌ Error resetting HealthKit connection:', error);
    }
  }
}
