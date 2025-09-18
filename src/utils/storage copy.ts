import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { getLocalizedName } from './localization';

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

// Image storage utilities using Capacitor Filesystem
export class ImageStorage {
  private static readonly IMAGE_DIR = 'kalbuddy_images';

  // Initialize image directory
  private static async ensureImageDir(): Promise<void> {
    try {
      await Filesystem.mkdir({
        path: this.IMAGE_DIR,
        directory: Directory.Data,
        recursive: true
      });
    } catch (error: any) {
      // Directory might already exist, that's ok
      if (!error.message?.includes('exists')) {
        console.error('Error creating image directory:', error);
      }
    }
  }

  // Save image from base64 string and return file path
  static async saveImage(base64Data: string, filename?: string): Promise<string | null> {
    try {
      await this.ensureImageDir();
      
      // Generate filename if not provided
      if (!filename) {
        filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.jpg`;
      }
      
      // Remove data URL prefix if present
      const base64Clean = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
      
      const filepath = `${this.IMAGE_DIR}/${filename}`;
      
      await Filesystem.writeFile({
        path: filepath,
        data: base64Clean,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
      
      console.log(`Image saved to: ${filepath}`);
      return filepath;
      
    } catch (error) {
      console.error('Error saving image:', error);
      return null;
    }
  }

  // Load image as base64 from file path
  static async loadImage(filepath: string): Promise<string | null> {
    try {
      const result = await Filesystem.readFile({
        path: filepath,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
      
      // Return as data URL
      return `data:image/jpeg;base64,${result.data}`;
      
    } catch (error) {
      console.error('Error loading image:', error);
      return null;
    }
  }

  // Delete image file
  static async deleteImage(filepath: string): Promise<boolean> {
    try {
      await Filesystem.deleteFile({
        path: filepath,
        directory: Directory.Data
      });
      
      console.log(`Image deleted: ${filepath}`);
      return true;
      
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // Get image URI for display (without loading full base64)
  static async getImageUri(filepath: string): Promise<string | null> {
    try {
      const result = await Filesystem.getUri({
        path: filepath,
        directory: Directory.Data
      });
      
      return result.uri;
      
    } catch (error) {
      console.error('Error getting image URI:', error);
      return null;
    }
  }

  // Clean up unused images (images not referenced in any storage)
  static async cleanupUnusedImages(): Promise<number> {
    try {
      await this.ensureImageDir();
      
      // Get all image files
      const dirContents = await Filesystem.readdir({
        path: this.IMAGE_DIR,
        directory: Directory.Data
      });
      
      // Get all referenced images from various storage classes
      const referencedImages = new Set<string>();
      
      // Check scan history
      const scanHistory = await ScanHistory.get();
      scanHistory.forEach(item => {
        if (item.imagePath) {
          referencedImages.add(item.imagePath);
        }
      });
      
      // Check favorites
      const favorites = await FavoriteFood.get();
      favorites.forEach(item => {
        if (item.imagePath) {
          referencedImages.add(item.imagePath);
        }
      });
      
      // Check barcode cache
      const allKeys = await Storage.keys();
      const cacheKeys = allKeys.filter(key => key.startsWith('barcode_cache_'));
      for (const key of cacheKeys) {
        const cached = await Storage.get(key);
        if (cached?.data?.imagePath) {
          referencedImages.add(cached.data.imagePath);
        }
      }
      
      // Delete unreferenced images
      let deletedCount = 0;
      for (const file of dirContents.files) {
        const fullPath = `${this.IMAGE_DIR}/${file.name}`;
        if (!referencedImages.has(fullPath) && file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
          const success = await this.deleteImage(fullPath);
          if (success) deletedCount++;
        }
      }
      
      console.log(`Cleaned up ${deletedCount} unused images`);
      return deletedCount;
      
    } catch (error) {
      console.error('Error during image cleanup:', error);
      return 0;
    }
  }

  // Get storage statistics
  static async getStats(): Promise<{ count: number, totalSizeBytes: number }> {
    try {
      await this.ensureImageDir();
      
      const dirContents = await Filesystem.readdir({
        path: this.IMAGE_DIR,
        directory: Directory.Data
      });
      
      let totalSize = 0;
      for (const file of dirContents.files) {
        try {
          const stat = await Filesystem.stat({
            path: `${this.IMAGE_DIR}/${file.name}`,
            directory: Directory.Data
          });
          totalSize += stat.size;
        } catch (error) {
          // Skip files that can't be accessed
        }
      }
      
      return {
        count: dirContents.files.length,
        totalSizeBytes: totalSize
      };
      
    } catch (error) {
      console.error('Error getting image stats:', error);
      return { count: 0, totalSizeBytes: 0 };
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
      
      // Handle image storage for barcode data
      let processedData = { ...data };
      if (data.image && typeof data.image === 'string' && data.image.startsWith('data:image')) {
        const imagePath = await ImageStorage.saveImage(data.image, `barcode_${barcode.replace(/[^a-zA-Z0-9]/g, '_')}`);
        if (imagePath) {
          processedData.imagePath = imagePath;
          delete processedData.image; // Remove base64 to save space
        }
      }
      
      const cacheData = {
        data: processedData,
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
      
      // Get cached data to check for images
      const cached = await Storage.get(cacheKey);
      if (cached?.data?.imagePath) {
        await ImageStorage.deleteImage(cached.data.imagePath);
      }
      
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
      
      // Delete associated images first
      for (const key of cacheKeys) {
        const cached = await Storage.get(key);
        if (cached?.data?.imagePath) {
          await ImageStorage.deleteImage(cached.data.imagePath);
        }
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

  // Load image for cached barcode data
  static async loadCachedImage(barcode: string): Promise<string | null> {
    try {
      const cached = await this.get(barcode);
      if (cached?.imagePath) {
        return await ImageStorage.loadImage(cached.imagePath);
      }
      // Fallback to old base64 image if still present
      if (cached?.image) {
        return cached.image;
      }
      return null;
    } catch (error) {
      console.error('Error loading cached barcode image:', error);
      return null;
    }
  }

  // Get image URI for cached barcode data
  static async getCachedImageUri(barcode: string): Promise<string | null> {
    try {
      const cached = await this.get(barcode);
      if (cached?.imagePath) {
        return await ImageStorage.getImageUri(cached.imagePath);
      }
      // Fallback to old base64 image if still present
      if (cached?.image) {
        return cached.image;
      }
      return null;
    } catch (error) {
      console.error('Error getting cached barcode image URI:', error);
      return null;
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
      
      // Handle image storage - save to filesystem if base64 image is present
      if (item.image && typeof item.image === 'string' && item.image.startsWith('data:image')) {
        const imagePath = await ImageStorage.saveImage(item.image, `scan_${item.id}`);
        if (imagePath) {
          // Replace base64 image with file path
          item.imagePath = imagePath;
          delete item.image; // Remove base64 to save space
        }
      }
      
      // Handle nested image data
      if (item.data?.image && typeof item.data.image === 'string' && item.data.image.startsWith('data:image')) {
        const imagePath = await ImageStorage.saveImage(item.data.image, `scan_data_${item.id}`);
        if (imagePath) {
          item.data.imagePath = imagePath;
          delete item.data.image;
        }
      }
      
      // Add to beginning
      history.unshift(item);
      
      // Keep only max items
      const trimmedHistory = history.slice(0, this.MAX_HISTORY_ITEMS);
      
      // Clean up images from removed items
      if (history.length > this.MAX_HISTORY_ITEMS) {
        const removedItems = history.slice(this.MAX_HISTORY_ITEMS);
        for (const removedItem of removedItems) {
          if (removedItem.imagePath) {
            await ImageStorage.deleteImage(removedItem.imagePath);
          }
          if (removedItem.data?.imagePath) {
            await ImageStorage.deleteImage(removedItem.data.imagePath);
          }
        }
      }
      
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
        const oldItem = history[index];
        
        // Handle image updates
        if (updatedItem.image && typeof updatedItem.image === 'string' && updatedItem.image.startsWith('data:image')) {
          // Delete old image if it exists
          if (oldItem.imagePath) {
            await ImageStorage.deleteImage(oldItem.imagePath);
          }
          
          // Save new image
          const imagePath = await ImageStorage.saveImage(updatedItem.image, `scan_${itemId}_updated`);
          if (imagePath) {
            updatedItem.imagePath = imagePath;
            delete updatedItem.image;
          }
        }
        
        // Handle nested image data updates
        if (updatedItem.data?.image && typeof updatedItem.data.image === 'string' && updatedItem.data.image.startsWith('data:image')) {
          // Delete old image if it exists
          if (oldItem.data?.imagePath) {
            await ImageStorage.deleteImage(oldItem.data.imagePath);
          }
          
          // Save new image
          const imagePath = await ImageStorage.saveImage(updatedItem.data.image, `scan_data_${itemId}_updated`);
          if (imagePath) {
            updatedItem.data.imagePath = imagePath;
            delete updatedItem.data.image;
          }
        }
        
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
      const itemToRemove = history.find(item => item.id === itemId);
      
      // Delete associated images
      if (itemToRemove) {
        if (itemToRemove.imagePath) {
          await ImageStorage.deleteImage(itemToRemove.imagePath);
        }
        if (itemToRemove.data?.imagePath) {
          await ImageStorage.deleteImage(itemToRemove.data.imagePath);
        }
      }
      
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
      const history = await this.get();
      
      // Delete all associated images
      for (const item of history) {
        if (item.imagePath) {
          await ImageStorage.deleteImage(item.imagePath);
        }
        if (item.data?.imagePath) {
          await ImageStorage.deleteImage(item.data.imagePath);
        }
      }
      
      await Storage.remove(this.HISTORY_KEY);
      
      // Dispatch event for UI updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('scanHistoryUpdated'));
      }
      
    } catch (error) {
      console.error('Scan history clear error:', error);
    }
  }

  // Load image for a scan history item
  static async loadItemImage(item: any): Promise<string | null> {
    try {
      if (item.imagePath) {
        return await ImageStorage.loadImage(item.imagePath);
      }
      if (item.data?.imagePath) {
        return await ImageStorage.loadImage(item.data.imagePath);
      }
      // Fallback to old base64 image if still present
      if (item.image) {
        return item.image;
      }
      if (item.data?.image) {
        return item.data.image;
      }
      return null;
    } catch (error) {
      console.error('Error loading scan history item image:', error);
      return null;
    }
  }

  // Get image URI for display (lighter than loading full base64)
  static async getItemImageUri(item: any): Promise<string | null> {
    try {
      if (item.imagePath) {
        return await ImageStorage.getImageUri(item.imagePath);
      }
      if (item.data?.imagePath) {
        return await ImageStorage.getImageUri(item.data.imagePath);
      }
      // Fallback to old base64 image if still present
      if (item.image) {
        return item.image;
      }
      if (item.data?.image) {
        return item.data.image;
      }
      return null;
    } catch (error) {
      console.error('Error getting scan history item image URI:', error);
      return null;
    }
  }
}

// Favorite food utilities
export class FavoriteFood {
  private static readonly FAVORITES_KEY = 'favoriteFood';

  // Get all favorite foods
  static async get(): Promise<any[]> {
    try {
      const favorites = await Storage.get(this.FAVORITES_KEY);
      return Array.isArray(favorites) ? favorites : [];
    } catch (error) {
      console.error('Favorite food get error:', error);
      return [];
    }
  }

  // Add food to favorites
  static async add(foodItem: any): Promise<void> {
    try {
      const favorites = await this.get();
      
      // Create a unique ID for the favorite item if it doesn't exist
      const favoriteItem = {
        id: foodItem.id || Date.now(),
        favoriteId: Date.now(), // Unique ID for the favorite entry
        name: getLocalizedName(foodItem.data || foodItem) || 'Unknown Food',
        type: foodItem.type || 'unknown', // 'food', 'barcode', etc.
        data: foodItem.data || foodItem,
        imagePath: null as string | null, // Will be set below if image exists
        dateAdded: new Date().toISOString(),
        // Store nutrition info for quick access
        nutrition: {
          calories: this.extractCalories(foodItem),
          protein: this.extractProtein(foodItem),
          carbs: this.extractCarbs(foodItem),
          fats: this.extractFats(foodItem)
        }
      };

      // Handle image storage
      const imageToSave = foodItem.image || foodItem.data?.image;
      if (imageToSave && typeof imageToSave === 'string' && imageToSave.startsWith('data:image')) {
        const imagePath = await ImageStorage.saveImage(imageToSave, `favorite_${favoriteItem.favoriteId}`);
        if (imagePath) {
          favoriteItem.imagePath = imagePath;
          // Clean image from data to save space
          if (favoriteItem.data?.image) {
            delete favoriteItem.data.image;
          }
        }
      } else if (foodItem.imagePath) {
        // If already has imagePath, keep it
        favoriteItem.imagePath = foodItem.imagePath;
      }

      // Check if already in favorites (by name and type)
      const exists = favorites.some(fav => 
        fav.name.toLowerCase() === favoriteItem.name.toLowerCase() && 
        fav.type === favoriteItem.type
      );

      if (!exists) {
        favorites.unshift(favoriteItem);
        await Storage.set(this.FAVORITES_KEY, favorites);
        
        // Dispatch event for UI updates
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('favoritesUpdated'));
        }
      }
      
    } catch (error) {
      console.error('Favorite food add error:', error);
    }
  }

  // Remove food from favorites
  static async remove(favoriteId: number): Promise<void> {
    try {
      const favorites = await this.get();
      const itemToRemove = favorites.find(fav => fav.favoriteId === favoriteId);
      
      // Delete associated image
      if (itemToRemove?.imagePath) {
        await ImageStorage.deleteImage(itemToRemove.imagePath);
      }
      
      const filteredFavorites = favorites.filter(fav => fav.favoriteId !== favoriteId);
      
      await Storage.set(this.FAVORITES_KEY, filteredFavorites);
      
      // Dispatch event for UI updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      }
      
    } catch (error) {
      console.error('Favorite food remove error:', error);
    }
  }

  // Check if food is in favorites
  static async isFavorite(foodItem: any): Promise<boolean> {
    try {
      const favorites = await this.get();
      const name = getLocalizedName(foodItem.data || foodItem) || 'Unknown Food';
      const type = foodItem.type || 'unknown';
      
      return favorites.some(fav => 
        fav.name.toLowerCase() === name.toLowerCase() && 
        fav.type === type
      );
      
    } catch (error) {
      console.error('Favorite food check error:', error);
      return false;
    }
  }

  // Toggle favorite status
  static async toggle(foodItem: any): Promise<boolean> {
    try {
      const isFav = await this.isFavorite(foodItem);
      
      if (isFav) {
        // Find and remove
        const favorites = await this.get();
        const name = getLocalizedName(foodItem.data || foodItem) || 'Unknown Food';
        const type = foodItem.type || 'unknown';
        
        const item = favorites.find(fav => 
          fav.name.toLowerCase() === name.toLowerCase() && 
          fav.type === type
        );
        
        if (item) {
          await this.remove(item.favoriteId);
        }
        return false;
      } else {
        await this.add(foodItem);
        return true;
      }
      
    } catch (error) {
      console.error('Favorite food toggle error:', error);
      return false;
    }
  }

  // Clear all favorites
  static async clear(): Promise<void> {
    try {
      const favorites = await this.get();
      
      // Delete all associated images
      for (const favorite of favorites) {
        if (favorite.imagePath) {
          await ImageStorage.deleteImage(favorite.imagePath);
        }
      }
      
      await Storage.remove(this.FAVORITES_KEY);
      
      // Dispatch event for UI updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      }
      
    } catch (error) {
      console.error('Favorite food clear error:', error);
    }
  }

  // Get favorites by type
  static async getByType(type: string): Promise<any[]> {
    try {
      const favorites = await this.get();
      return favorites.filter(fav => fav.type === type);
    } catch (error) {
      console.error('Favorite food getByType error:', error);
      return [];
    }
  }

  // Load image for a favorite food item
  static async loadItemImage(item: any): Promise<string | null> {
    try {
      if (item.imagePath) {
        return await ImageStorage.loadImage(item.imagePath);
      }
      // Fallback to old base64 image if still present
      if (item.image) {
        return item.image;
      }
      if (item.data?.image) {
        return item.data.image;
      }
      return null;
    } catch (error) {
      console.error('Error loading favorite food item image:', error);
      return null;
    }
  }

  // Get image URI for display (lighter than loading full base64)
  static async getItemImageUri(item: any): Promise<string | null> {
    try {
      if (item.imagePath) {
        return await ImageStorage.getImageUri(item.imagePath);
      }
      // Fallback to old base64 image if still present
      if (item.image) {
        return item.image;
      }
      if (item.data?.image) {
        return item.data.image;
      }
      return null;
    } catch (error) {
      console.error('Error getting favorite food item image URI:', error);
      return null;
    }
  }

  // Helper methods to extract nutrition from different food item formats
  private static extractCalories(foodItem: any): number {
    if (foodItem.nutrition?.calories) return foodItem.nutrition.calories;
    if (foodItem.data?.total?.calories) return foodItem.data.total.calories;
    if (foodItem.data?.nutriments?.energy_kcal_100g) return foodItem.data.nutriments.energy_kcal_100g;
    if (foodItem.calories) return foodItem.calories;
    return 0;
  }

  private static extractProtein(foodItem: any): number {
    if (foodItem.nutrition?.protein) return foodItem.nutrition.protein;
    if (foodItem.data?.total?.protein) return foodItem.data.total.protein;
    if (foodItem.data?.nutriments?.proteins_100g) return foodItem.data.nutriments.proteins_100g;
    if (foodItem.protein) return foodItem.protein;
    return 0;
  }

  private static extractCarbs(foodItem: any): number {
    if (foodItem.nutrition?.carbs) return foodItem.nutrition.carbs;
    if (foodItem.data?.total?.carbs) return foodItem.data.total.carbs;
    if (foodItem.data?.nutriments?.carbohydrates_100g) return foodItem.data.nutriments.carbohydrates_100g;
    if (foodItem.carbs) return foodItem.carbs;
    return 0;
  }

  private static extractFats(foodItem: any): number {
    if (foodItem.nutrition?.fats) return foodItem.nutrition.fats;
    if (foodItem.data?.total?.fat) return foodItem.data.total.fat;
    if (foodItem.data?.total?.fats) return foodItem.data.total.fats;
    if (foodItem.data?.nutriments?.fat_100g) return foodItem.data.nutriments.fat_100g;
    if (foodItem.fats || foodItem.fat) return foodItem.fats || foodItem.fat;
    return 0;
  }
}
