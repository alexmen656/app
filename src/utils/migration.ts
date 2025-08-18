import { Storage } from './storage';

// Migration from localStorage to Capacitor Preferences
export class DataMigration {
  private static readonly MIGRATION_COMPLETE_KEY = 'migration_v1_complete';

  // Check if migration is needed and completed
  static async isMigrationComplete(): Promise<boolean> {
    try {
      const migrationComplete = await Storage.get(this.MIGRATION_COMPLETE_KEY);
      return migrationComplete === true;
    } catch (error) {
      console.error('Error checking migration status:', error);
      return false;
    }
  }

  // Migrate all localStorage data to Capacitor Preferences
  static async migrateFromLocalStorage(): Promise<void> {
    try {
      console.log('Starting migration from localStorage to Capacitor Preferences...');

      // Check if migration already completed
      if (await this.isMigrationComplete()) {
        console.log('Migration already completed, skipping...');
        return;
      }

      const migratedItems: string[] = [];

      // List of keys to migrate
      const keysToMigrate = [
        'userProfile',
        'dailyGoals', 
        'userPreferences',
        'onboardingCompleted',
        'scanHistory'
      ];

      // Migrate each key
      for (const key of keysToMigrate) {
        try {
          const localStorageValue = localStorage.getItem(key);
          if (localStorageValue !== null) {
            // Parse JSON if possible, otherwise keep as string
            let value;
            try {
              value = JSON.parse(localStorageValue);
            } catch {
              value = localStorageValue;
            }

            // Special handling for onboardingCompleted
            if (key === 'onboardingCompleted') {
              value = localStorageValue === 'true';
            }

            await Storage.set(key, value);
            migratedItems.push(key);
            console.log(`Migrated ${key}:`, value);
          }
        } catch (error) {
          console.error(`Error migrating ${key}:`, error);
        }
      }

      // Migrate barcode cache (all items starting with specific prefix)
      try {
        const allLocalStorageKeys = Object.keys(localStorage);
        const barcodeKeys = allLocalStorageKeys.filter(key => 
          key.startsWith('barcode_') || key.startsWith('product_')
        );

        for (const key of barcodeKeys) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const parsedValue = JSON.parse(value);
              await Storage.set(key, parsedValue);
              migratedItems.push(key);
            }
          } catch (error) {
            console.error(`Error migrating barcode cache ${key}:`, error);
          }
        }
      } catch (error) {
        console.error('Error migrating barcode cache:', error);
      }

      // Mark migration as complete
      await Storage.set(this.MIGRATION_COMPLETE_KEY, true);

      console.log(`Migration completed successfully! Migrated ${migratedItems.length} items:`, migratedItems);

      // Optionally clear localStorage after successful migration
      // await this.clearLocalStorageAfterMigration();

    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  // Clear localStorage after successful migration (optional)
  static async clearLocalStorageAfterMigration(): Promise<void> {
    try {
      const keysToRemove = [
        'userProfile',
        'dailyGoals', 
        'userPreferences',
        'onboardingCompleted',
        'scanHistory'
      ];

      // Remove migrated items from localStorage
      for (const key of keysToRemove) {
        localStorage.removeItem(key);
      }

      // Remove barcode cache from localStorage
      const allKeys = Object.keys(localStorage);
      const barcodeKeys = allKeys.filter(key => 
        key.startsWith('barcode_') || key.startsWith('product_')
      );

      for (const key of barcodeKeys) {
        localStorage.removeItem(key);
      }

      console.log('LocalStorage cleaned up after migration');

    } catch (error) {
      console.error('Error cleaning up localStorage:', error);
    }
  }

  // Force re-migration (for development/testing)
  static async forceMigration(): Promise<void> {
    await Storage.remove(this.MIGRATION_COMPLETE_KEY);
    await this.migrateFromLocalStorage();
  }

  // Get migration statistics
  static async getMigrationStats(): Promise<{
    migrationComplete: boolean;
    capacitorPreferencesItems: number;
    localStorageItems: number;
  }> {
    try {
      const migrationComplete = await this.isMigrationComplete();
      const capacitorKeys = await Storage.keys();
      const localStorageKeys = Object.keys(localStorage);

      return {
        migrationComplete,
        capacitorPreferencesItems: capacitorKeys.length,
        localStorageItems: localStorageKeys.length
      };
    } catch (error) {
      console.error('Error getting migration stats:', error);
      return {
        migrationComplete: false,
        capacitorPreferencesItems: 0,
        localStorageItems: 0
      };
    }
  }
}
