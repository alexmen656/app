import { Preferences } from "@capacitor/preferences";
import { Filesystem, Directory } from "@capacitor/filesystem"; //Encoding
import { getLocalizedName } from './localization';

// Storage utility using Capacitor Preferences instead of localStorage
export class Storage {
  static async set(key: string, value: any): Promise<void> {
    try {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await Preferences.set({
        key,
        value: stringValue,
      });
    } catch (error) {
      console.error("Storage set error:", error);
    }
  }

  static async get(key: string): Promise<any> {
    try {
      const { value } = await Preferences.get({ key });
      if (value === null) return null;

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error("Storage remove error:", error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await Preferences.clear();
    } catch (error) {
      console.error("Storage clear error:", error);
    }
  }

  static async keys(): Promise<string[]> {
    try {
      const { keys } = await Preferences.keys();
      return keys;
    } catch (error) {
      console.error("Storage keys error:", error);
      return [];
    }
  }
}

export class BarcodeCache {
  private static readonly CACHE_KEY_PREFIX = "barcode_cache_";
  private static readonly CACHE_EXPIRY_DAYS = 7;

  static async get(barcode: string): Promise<any> {
    try {
      const cacheKey = this.CACHE_KEY_PREFIX + barcode;
      const cached = await Storage.get(cacheKey);

      if (!cached) return null;

      const now = Date.now();
      const cacheAge = now - cached.timestamp;
      const maxAge = this.CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

      if (cacheAge > maxAge) {
        await this.remove(barcode);
        return null;
      }

      //console.log(`Barcode ${barcode} found in cache (${Math.round(cacheAge / (1000 * 60 * 60))}h old)`);
      return cached.data;
    } catch (error) {
      console.error("Barcode cache get error:", error);
      return null;
    }
  }

  static async set(barcode: string, data: any): Promise<void> {
    try {
      const cacheKey = this.CACHE_KEY_PREFIX + barcode;
      const cacheData = {
        data,
        timestamp: Date.now(),
        barcode,
      };

      await Storage.set(cacheKey, cacheData);
      console.log(`Barcode ${barcode} cached successfully`);
    } catch (error) {
      console.error("Barcode cache set error:", error);
    }
  }

  static async remove(barcode: string): Promise<void> {
    try {
      const cacheKey = this.CACHE_KEY_PREFIX + barcode;
      await Storage.remove(cacheKey);
    } catch (error) {
      console.error("Barcode cache remove error:", error);
    }
  }

  // Clear all cached barcodes
  static async clearAll(): Promise<void> {
    try {
      const keys = await Storage.keys();
      const cacheKeys = keys.filter((key) =>
        key.startsWith(this.CACHE_KEY_PREFIX)
      );

      for (const key of cacheKeys) {
        await Storage.remove(key);
      }

      //console.log(`Cleared ${cacheKeys.length} cached barcodes`);
    } catch (error) {
      console.error("Barcode cache clear error:", error);
    }
  }

  static async getStats(): Promise<{ count: number; totalSize: number }> {
    try {
      const keys = await Storage.keys();
      const cacheKeys = keys.filter((key) =>
        key.startsWith(this.CACHE_KEY_PREFIX)
      );

      let totalSize = 0;
      for (const key of cacheKeys) {
        const data = await Storage.get(key);
        if (data) {
          totalSize += JSON.stringify(data).length;
        }
      }

      return {
        count: cacheKeys.length,
        totalSize,
      };
    } catch (error) {
      console.error("Barcode cache stats error:", error);
      return { count: 0, totalSize: 0 };
    }
  }
}

export class ScanHistory {
  private static readonly HISTORY_KEY = "scanHistory";
  private static readonly MAX_HISTORY_ITEMS = 200;

  static async get(): Promise<any[]> {
    try {
      const history = await Storage.get(this.HISTORY_KEY);
      return Array.isArray(history) ? history : [];
    } catch (error) {
      console.error("Scan history get error:", error);
      return [];
    }
  }

  static async add(item: any): Promise<void> {
    try {
      const history = await this.get();

      if (!item.id) {
        item.id = Date.now();
      }

      history.unshift(item);
      const trimmedHistory = history.slice(0, this.MAX_HISTORY_ITEMS);
      await Storage.set(this.HISTORY_KEY, trimmedHistory);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("scanHistoryUpdated"));
      }
    } catch (error) {
      console.error("Scan history add error:", error);
    }
  }

  static async update(itemId: number, updatedItem: any): Promise<void> {
    try {
      const history = await this.get();
      const index = history.findIndex((item) => item.id === itemId);

      if (index !== -1) {
        history[index] = { ...updatedItem, id: itemId };
        await Storage.set(this.HISTORY_KEY, history);

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("scanHistoryUpdated"));
        }
      } else {
        console.warn("Item with ID", itemId, "not found in scan history");
      }
    } catch (error) {
      console.error("Scan history update error:", error);
    }
  }

  static async remove(itemId: number): Promise<void> {
    try {
      const history = await this.get();
      const filteredHistory = history.filter((item) => item.id !== itemId);
      await Storage.set(this.HISTORY_KEY, filteredHistory);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("scanHistoryUpdated"));
      }
    } catch (error) {
      console.error("Scan history remove error:", error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await Storage.remove(this.HISTORY_KEY);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("scanHistoryUpdated"));
      }
    } catch (error) {
      console.error("Scan history clear error:", error);
    }
  }
}

export class FavoriteFood {
  private static readonly FAVORITES_KEY = "favoriteFood";

  // Get all favorite foods
  static async get(): Promise<any[]> {
    try {
      const favorites = await Storage.get(this.FAVORITES_KEY);
      return Array.isArray(favorites) ? favorites : [];
    } catch (error) {
      console.error("Favorite food get error:", error);
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
        names: foodItem.names || "Unknown Food",
        type: foodItem.type || "unknown", // 'food', 'barcode', etc.
        data: foodItem.data || foodItem,
        image: foodItem.image || foodItem.data?.image || null,
        dateAdded: new Date().toISOString(),
        // Store nutrition info for quick access
        nutrition: {
          calories: this.extractCalories(foodItem),
          protein: this.extractProtein(foodItem),
          carbs: this.extractCarbs(foodItem),
          fats: this.extractFats(foodItem),
        },
      };

      // Check if already in favorites (by name and type)
   /*   const exists = favorites.some(
        (fav) =>
          fav.name.toLowerCase() === favoriteItem.name.toLowerCase() &&
          fav.type === favoriteItem.type
      );

      if (!exists) {*/
        favorites.unshift(favoriteItem);
        await Storage.set(this.FAVORITES_KEY, favorites);

        // Dispatch event for UI updates
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("favoritesUpdated"));
        }
     // }
    } catch (error) {
      console.error("Favorite food add error:", error);
    }
  }

  // Remove food from favorites
  static async remove(favoriteId: number): Promise<void> {
    try {
      const favorites = await this.get();
      const filteredFavorites = favorites.filter(
        (fav) => fav.favoriteId !== favoriteId
      );

      await Storage.set(this.FAVORITES_KEY, filteredFavorites);

      // Dispatch event for UI updates
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("favoritesUpdated"));
      }
    } catch (error) {
      console.error("Favorite food remove error:", error);
    }
  }

  // Check if food is in favorites
  static async isFavorite(foodItem: any): Promise<boolean> {
    try {
      const favorites = await this.get();
      const name = getLocalizedName(foodItem) || "Unknown Food";
      const type = foodItem.type || "unknown";

      return favorites.some(
        (fav) =>
          fav.name.toLowerCase() === name.toLowerCase() && fav.type === type
      );
    } catch (error) {
      console.error("Favorite food check error:", error);
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
        const name = getLocalizedName(foodItem) || "Unknown Food";
        const type = foodItem.type || "unknown";

        const item = favorites.find(
          (fav) =>
            fav.name.toLowerCase() === name.toLowerCase() && fav.type === type
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
      console.error("Favorite food toggle error:", error);
      return false;
    }
  }

  // Clear all favorites
  static async clear(): Promise<void> {
    try {
      await Storage.remove(this.FAVORITES_KEY);

      // Dispatch event for UI updates
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("favoritesUpdated"));
      }
    } catch (error) {
      console.error("Favorite food clear error:", error);
    }
  }

  // Get favorites by type
  static async getByType(type: string): Promise<any[]> {
    try {
      const favorites = await this.get();
      return favorites.filter((fav) => fav.type === type);
    } catch (error) {
      console.error("Favorite food getByType error:", error);
      return [];
    }
  }

  // Helper methods to extract nutrition from different food item formats
  private static extractCalories(foodItem: any): number {
    if (foodItem.nutrition?.calories) return foodItem.nutrition.calories;
    if (foodItem.data?.total?.calories) return foodItem.data.total.calories;
    if (foodItem.data?.nutriments?.energy_kcal_100g)
      return foodItem.data.nutriments.energy_kcal_100g;
    if (foodItem.calories) return foodItem.calories;
    return 0;
  }

  private static extractProtein(foodItem: any): number {
    if (foodItem.nutrition?.protein) return foodItem.nutrition.protein;
    if (foodItem.data?.total?.protein) return foodItem.data.total.protein;
    if (foodItem.data?.nutriments?.proteins_100g)
      return foodItem.data.nutriments.proteins_100g;
    if (foodItem.protein) return foodItem.protein;
    return 0;
  }

  private static extractCarbs(foodItem: any): number {
    if (foodItem.nutrition?.carbs) return foodItem.nutrition.carbs;
    if (foodItem.data?.total?.carbs) return foodItem.data.total.carbs;
    if (foodItem.data?.nutriments?.carbohydrates_100g)
      return foodItem.data.nutriments.carbohydrates_100g;
    if (foodItem.carbs) return foodItem.carbs;
    return 0;
  }

  private static extractFats(foodItem: any): number {
    if (foodItem.nutrition?.fats) return foodItem.nutrition.fats;
    if (foodItem.data?.total?.fat) return foodItem.data.total.fat;
    if (foodItem.data?.total?.fats) return foodItem.data.total.fats;
    if (foodItem.data?.nutriments?.fat_100g)
      return foodItem.data.nutriments.fat_100g;
    if (foodItem.fats || foodItem.fat) return foodItem.fats || foodItem.fat;
    return 0;
  }
}

export class ImageFile {
  static async save(imageContent: string): Promise<string> {
    try {
      if (!imageContent || typeof imageContent !== "string") {
        console.warn("Invalid image content provided to ImageFile.save");
        return "";
      }

      const fileName = `image_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}.jpg`;

      const base64Data = imageContent.includes(",")
        ? imageContent.split(",")[1]
        : imageContent;

      if (!base64Data || base64Data.length === 0) {
        console.warn("Empty base64 data after processing");
        return "";
      }

      await Filesystem.writeFile({
        path: `images/${fileName}`,
        data: base64Data,
        directory: Directory.Data,
        recursive: true,
      });

      console.log(`Image file saved successfully: ${fileName}`);
      return fileName;
    } catch (error) {
      console.error("Image file save error:", error);
      return "";
    }
  }

  static async get(fileName: string): Promise<string | null> {
    try {
      // Read the file as base64 data
      const result = await Filesystem.readFile({
        path: `images/${fileName}`,
        directory: Directory.Data,
      });

      // Return as data URI for HTML display
      const base64Data = result.data;
      return `data:image/jpeg;base64,${base64Data}`;
    } catch (error) {
      console.error("Image file get error:", error);
      return null;
    }
  }
}
