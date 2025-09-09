import { Preferences } from '@capacitor/preferences';

// Storage utility using Capacitor Preferences instead of localStorage
export class Storage {
  
  // Set a value
  static async set(key: string, value: any): Promise<void> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await Preferences.set({
        key,
        value: stringValue
      });
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }

  // Get a value
  static async get(key: string): Promise<any> {
    try {
      const { value } = await Preferences.get({ key });
      if (value === null) return null;
      
      // Try to parse as JSON, if it fails return as string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  // Remove a value
  static async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }

  // Clear all
  static async clear(): Promise<void> {
    try {
      await Preferences.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  // Get all keys
  static async keys(): Promise<string[]> {
    try {
      const { keys } = await Preferences.keys();
      return keys;
    } catch (error) {
      console.error('Storage keys error:', error);
      return [];
    }
  }
}

// Barcode cache utilities
export class BarcodeCache {
  private static readonly CACHE_KEY_PREFIX = 'barcode_cache_';
  private static readonly CACHE_EXPIRY_DAYS = 7; // Cache for 7 days

  // Get cached barcode data
  static async get(barcode: string): Promise<any> {
    try {
      const cacheKey = this.CACHE_KEY_PREFIX + barcode;
      const cached = await Storage.get(cacheKey);
      
      if (!cached) return null;
      
      // Check if cache is expired
      const now = Date.now();
      const cacheAge = now - cached.timestamp;
      const maxAge = this.CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // Convert to ms
      
      if (cacheAge > maxAge) {
        // Cache expired, remove it
        await this.remove(barcode);
        return null;
      }
      
      console.log(`Barcode ${barcode} found in cache (${Math.round(cacheAge / (1000 * 60 * 60))}h old)`);
      return cached.data;
      
    } catch (error) {
      console.error('Barcode cache get error:', error);
      return null;
    }
  }

  // Cache barcode data
  static async set(barcode: string, data: any): Promise<void> {
    try {
      const cacheKey = this.CACHE_KEY_PREFIX + barcode;
      const cacheData = {
        data,
        timestamp: Date.now(),
        barcode
      };
      
      await Storage.set(cacheKey, cacheData);
      console.log(`Barcode ${barcode} cached successfully`);
      
    } catch (error) {
      console.error('Barcode cache set error:', error);
    }
  }

  // Remove cached barcode data
  static async remove(barcode: string): Promise<void> {
    try {
      const cacheKey = this.CACHE_KEY_PREFIX + barcode;
      await Storage.remove(cacheKey);
      
    } catch (error) {
      console.error('Barcode cache remove error:', error);
    }
  }

  // Clear all cached barcodes
  static async clearAll(): Promise<void> {
    try {
      const keys = await Storage.keys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_KEY_PREFIX));
      
      for (const key of cacheKeys) {
        await Storage.remove(key);
      }
      
      console.log(`Cleared ${cacheKeys.length} cached barcodes`);
      
    } catch (error) {
      console.error('Barcode cache clear error:', error);
    }
  }

  // Get cache statistics
  static async getStats(): Promise<{ count: number, totalSize: number }> {
    try {
      const keys = await Storage.keys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_KEY_PREFIX));
      
      let totalSize = 0;
      for (const key of cacheKeys) {
        const data = await Storage.get(key);
        if (data) {
          totalSize += JSON.stringify(data).length;
        }
      }
      
      return {
        count: cacheKeys.length,
        totalSize
      };
      
    } catch (error) {
      console.error('Barcode cache stats error:', error);
      return { count: 0, totalSize: 0 };
    }
  }
}

// Scan history utilities
export class ScanHistory {
  private static readonly HISTORY_KEY = 'scanHistory';
  private static readonly MAX_HISTORY_ITEMS = 50;

  // Get scan history
  static async get(): Promise<any[]> {
    try {
      const history = await Storage.get(this.HISTORY_KEY);
      return Array.isArray(history) ? history : [];
    } catch (error) {
      console.error('Scan history get error:', error);
      return [];
    }
  }

  // Add item to scan history
  static async add(item: any): Promise<void> {
    try {
      const history = await this.get();
      
      // Ensure item has an ID
      if (!item.id) {
        item.id = Date.now();
      }
      
      // Add to beginning
      history.unshift(item);
      
      // Keep only max items
      const trimmedHistory = history.slice(0, this.MAX_HISTORY_ITEMS);
      
      await Storage.set(this.HISTORY_KEY, trimmedHistory);
      
      // Dispatch event for UI updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('scanHistoryUpdated'));
      }
      
    } catch (error) {
      console.error('Scan history add error:', error);
    }
  }

  // Update existing item in scan history
  static async update(itemId: number, updatedItem: any): Promise<void> {
    try {
      const history = await this.get();
      const index = history.findIndex(item => item.id === itemId);
      
      if (index !== -1) {
        // Keep the original ID and update the item
        history[index] = { ...updatedItem, id: itemId };
        
        await Storage.set(this.HISTORY_KEY, history);
        
        // Dispatch event for UI updates
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('scanHistoryUpdated'));
        }
      } else {
        console.warn('Item with ID', itemId, 'not found in scan history');
      }
      
    } catch (error) {
      console.error('Scan history update error:', error);
    }
  }

  // Remove item from scan history
  static async remove(itemId: number): Promise<void> {
    try {
      const history = await this.get();
      const filteredHistory = history.filter(item => item.id !== itemId);
      
      await Storage.set(this.HISTORY_KEY, filteredHistory);
      
      // Dispatch event for UI updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('scanHistoryUpdated'));
      }
      
    } catch (error) {
      console.error('Scan history remove error:', error);
    }
  }

  // Clear scan history
  static async clear(): Promise<void> {
    try {
      await Storage.remove(this.HISTORY_KEY);
      
      // Dispatch event for UI updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('scanHistoryUpdated'));
      }
      
    } catch (error) {
      console.error('Scan history clear error:', error);
    }
  }
}
