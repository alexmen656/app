import { Storage, ScanHistory } from './storage';
import { dailyGoals } from '../stores/userStore';
import { Preferences } from '@capacitor/preferences';

// Widget data structure for iOS widgets
export interface WidgetData {
  calories: {
    current: number;
    target: number;
    progress: number;
    remaining: number;
  };
  macros: {
    protein: { current: number; target: number; progress: number };
    carbs: { current: number; target: number; progress: number };
    fats: { current: number; target: number; progress: number };
  };
  streak: number;
  lastUpdated: string;
  todayFoods: Array<{
    name: string;
    calories: number;
    time: string;
  }>;
}

// Calculate today's nutrition data from scan history
export class WidgetDataManager {
  // Get today's date string in YYYY-MM-DD format
  private static getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Filter scan history for today only
  private static async getTodaysScans() {
    const history = await ScanHistory.get();
    const today = this.getTodayDateString();
    
    return history.filter(scan => {
      const scanDate = new Date(scan.timestamp).toISOString().split('T')[0];
      return scanDate === today;
    });
  }

  // Calculate nutrition totals from today's scans
  private static calculateTodaysNutrition(scans: any[]) {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    scans.forEach(scan => {
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

    return { totalCalories, totalProtein, totalCarbs, totalFats };
  }

  // Get streak count from storage
  private static async getStreakCount(): Promise<number> {
    try {
      const streak = await Storage.get('currentStreak');
      return streak || 0;
    } catch {
      return 0;
    }
  }

  // 🔥 NEW: Store data specifically for iOS widgets using App Group UserDefaults
  private static async storeDataForWidgets(widgetData: WidgetData): Promise<void> {
    try {
      // Store in normal preferences first (for app use)
      await Storage.set('widgetData', widgetData);
      
      // 🚨 CRITICAL: Store in shared App Group UserDefaults for iOS widgets
      // This uses the 'group' parameter to specify the App Group
      await Preferences.configure({
        group: 'group.com.kaloriq.shared'
      });
      
      // Store widget data as JSON string in shared UserDefaults
      const widgetDataJson = JSON.stringify(widgetData);
      await Preferences.set({
        key: 'widgetData',
        value: widgetDataJson
      });
      
      console.log('✅ Widget data stored in App Group UserDefaults:', widgetData);
      
      // Reset preferences back to default (app container)
      await Preferences.configure({
        group: undefined
      });
      
    } catch (error) {
      console.error('❌ Error storing widget data in App Group:', error);
    }
  }

  // Update widget data in Capacitor Preferences (accessible by iOS)
  static async updateWidgetData(): Promise<void> {
    try {
      const todaysScans = await this.getTodaysScans();
      const nutrition = this.calculateTodaysNutrition(todaysScans);
      const streak = await this.getStreakCount();

      // Prepare recent foods for widget
      const todayFoods = todaysScans.slice(0, 3).map(scan => ({
        name: scan.type === 'food' 
          ? (scan.data.foods?.[0]?.name || 'Gescanntes Essen')
          : (scan.data.product_name || 'Unbekanntes Produkt'),
        calories: scan.type === 'food'
          ? (scan.data.total?.calories || 0)
          : (scan.data.nutriments?.energy_kcal_100g || 0),
        time: scan.time
      }));

      const widgetData: WidgetData = {
        calories: {
          current: Math.round(nutrition.totalCalories),
          target: dailyGoals.calories,
          progress: Math.min(nutrition.totalCalories / dailyGoals.calories, 1),
          remaining: Math.max(dailyGoals.calories - nutrition.totalCalories, 0)
        },
        macros: {
          protein: {
            current: Math.round(nutrition.totalProtein),
            target: dailyGoals.protein,
            progress: Math.min(nutrition.totalProtein / dailyGoals.protein, 1)
          },
          carbs: {
            current: Math.round(nutrition.totalCarbs),
            target: dailyGoals.carbs,
            progress: Math.min(nutrition.totalCarbs / dailyGoals.carbs, 1)
          },
          fats: {
            current: Math.round(nutrition.totalFats),
            target: dailyGoals.fats,
            progress: Math.min(nutrition.totalFats / dailyGoals.fats, 1)
          }
        },
        streak,
        lastUpdated: new Date().toISOString(),
        todayFoods
      };

      // 🔥 Store data both in app storage AND App Group UserDefaults
      await this.storeDataForWidgets(widgetData);
      
      console.log('✅ Widget data updated successfully:', widgetData);
    } catch (error) {
      console.error('❌ Error updating widget data:', error);
    }
  }

  // Get current widget data
  static async getWidgetData(): Promise<WidgetData | null> {
    try {
      return await Storage.get('widgetData');
    } catch {
      return null;
    }
  }
}

// Streak management
export class StreakManager {
  private static readonly STREAK_KEY = 'currentStreak';
  private static readonly LAST_LOGGED_DATE_KEY = 'lastLoggedDate';

  // Get current streak
  static async getCurrentStreak(): Promise<number> {
    try {
      return await Storage.get(this.STREAK_KEY) || 0;
    } catch {
      return 0;
    }
  }

  // Update streak when user logs food
  static async updateStreak(): Promise<number> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastLoggedDate = await Storage.get(this.LAST_LOGGED_DATE_KEY);
      const currentStreak = await Storage.get(this.STREAK_KEY) || 0;

      // If already logged today, don't change streak
      if (lastLoggedDate === today) {
        return currentStreak;
      }

      // Calculate new streak
      let newStreak = currentStreak;
      
      if (lastLoggedDate) {
        const lastDate = new Date(lastLoggedDate);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day - increment streak
          newStreak = currentStreak + 1;
        } else if (diffDays > 1) {
          // Missed days - reset streak
          newStreak = 1;
        }
      } else {
        // First time logging
        newStreak = 1;
      }

      // Save updated values
      await Storage.set(this.STREAK_KEY, newStreak);
      await Storage.set(this.LAST_LOGGED_DATE_KEY, today);

      // Update longest streak if needed
      await this.updateLongestStreak(newStreak);

      return newStreak;
    } catch (error) {
      console.error('Error updating streak:', error);
      return 0;
    }
  }

  // Get longest streak
  static async getLongestStreak(): Promise<number> {
    try {
      return await Storage.get('longestStreak') || 0;
    } catch {
      return 0;
    }
  }

  // Update longest streak if current is higher
  static async updateLongestStreak(currentStreak: number): Promise<void> {
    try {
      const longestStreak = await this.getLongestStreak();
      if (currentStreak > longestStreak) {
        await Storage.set('longestStreak', currentStreak);
      }
    } catch (error) {
      console.error('Error updating longest streak:', error);
    }
  }

  // Reset streak (if needed)
  static async resetStreak(): Promise<void> {
    try {
      await Storage.set(this.STREAK_KEY, 0);
      await Storage.remove(this.LAST_LOGGED_DATE_KEY);
    } catch (error) {
      console.error('Error resetting streak:', error);
    }
  }
}
