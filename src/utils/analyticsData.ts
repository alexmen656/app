import { Storage, ScanHistory } from './storage';
import { dailyGoals } from '../stores/userStore';

export interface DayData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  foods: Array<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    time: string;
    type: string;
  }>;
}

export interface WeeklyData {
  day: string;
  calories: number;
}

export interface AnalyticsData {
  weeklyData: WeeklyData[];
  avgCalories: number;
  daysOnTrack: number;
  macroBreakdown: {
    protein: number;
    carbs: number;
    fats: number;
  };
  goalProgress: {
    calories: { current: number; target: number; percentage: number };
    exercise: { current: number; target: number; percentage: number };
    water: { current: number; target: number; percentage: number };
  };
}

export class AnalyticsManager {
  // Get date string in YYYY-MM-DD format
  private static getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Get data for a specific date
  static async getDayData(date: Date): Promise<DayData> {
    const dateStr = this.getDateString(date);
    const history = await ScanHistory.get();
    
    // Filter scans for the specific date
    const dayScans = history.filter(scan => {
      const scanDate = new Date(scan.timestamp).toISOString().split('T')[0];
      return scanDate === dateStr;
    });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    const foods: DayData['foods'] = [];

    dayScans.forEach(scan => {
      let calories = 0;
      let protein = 0;
      let carbs = 0;
      let fats = 0;
      let name = '';

      if (scan.type === 'food' && scan.data.total) {
        calories = scan.data.total.calories || 0;
        protein = scan.data.total.protein || 0;
        carbs = scan.data.total.carbs || 0;
        fats = scan.data.total.fat || 0;
        name = scan.data.foods?.[0]?.name || 'Gescanntes Essen';
      } else if (scan.type === 'barcode' && scan.data.nutriments) {
        calories = scan.data.nutriments.energy_kcal_100g || 0;
        protein = scan.data.nutriments.proteins_100g || 0;
        carbs = scan.data.nutriments.carbohydrates_100g || 0;
        fats = scan.data.nutriments.fat_100g || 0;
        name = scan.data.product_name || 'Unbekanntes Produkt';
      }

      totalCalories += calories;
      totalProtein += protein;
      totalCarbs += carbs;
      totalFats += fats;

      foods.push({
        name,
        calories: Math.round(calories),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fats: Math.round(fats),
        time: scan.time,
        type: scan.type
      });
    });

    return {
      date: dateStr,
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fats: Math.round(totalFats),
      foods
    };
  }

  // Get data for the last 7 days
  static async getWeeklyData(): Promise<WeeklyData[]> {
    const weekData: WeeklyData[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayData = await this.getDayData(date);
      const dayName = dayNames[date.getDay()];
      
      weekData.push({
        day: dayName,
        calories: dayData.calories
      });
    }

    return weekData;
  }

  // Calculate analytics data
  static async getAnalyticsData(): Promise<AnalyticsData> {
    const weeklyData = await this.getWeeklyData();
    
    // Calculate average calories
    const totalCalories = weeklyData.reduce((sum, day) => sum + day.calories, 0);
    const avgCalories = Math.round(totalCalories / 7);

    // Calculate days on track (within 200 calories of goal)
    const tolerance = 200;
    const daysOnTrack = weeklyData.filter(day => 
      Math.abs(day.calories - dailyGoals.calories) <= tolerance
    ).length;

    // Get today's data for macro breakdown
    const todayData = await this.getDayData(new Date());
    const totalMacroCalories = (todayData.protein * 4) + (todayData.carbs * 4) + (todayData.fats * 9);
    
    const macroBreakdown = {
      protein: totalMacroCalories > 0 ? Math.round((todayData.protein * 4 / totalMacroCalories) * 100) : 0,
      carbs: totalMacroCalories > 0 ? Math.round((todayData.carbs * 4 / totalMacroCalories) * 100) : 0,
      fats: totalMacroCalories > 0 ? Math.round((todayData.fats * 9 / totalMacroCalories) * 100) : 0
    };

    // Mock exercise and water data (can be expanded later)
    const exerciseData = await Storage.get('exerciseData') || { current: 4, target: 5 };
    const waterData = await Storage.get('waterData') || { current: 1.8, target: 2.5 };

    return {
      weeklyData,
      avgCalories,
      daysOnTrack,
      macroBreakdown,
      goalProgress: {
        calories: {
          current: todayData.calories,
          target: dailyGoals.calories,
          percentage: Math.round((todayData.calories / dailyGoals.calories) * 100)
        },
        exercise: {
          current: exerciseData.current,
          target: exerciseData.target,
          percentage: Math.round((exerciseData.current / exerciseData.target) * 100)
        },
        water: {
          current: waterData.current,
          target: waterData.target,
          percentage: Math.round((waterData.current / waterData.target) * 100)
        }
      }
    };
  }

  // Get yesterday's data
  static async getYesterdayData(): Promise<DayData> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.getDayData(yesterday);
  }
}
