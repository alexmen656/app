import { Storage, ScanHistory } from './storage';
import { dailyGoals, userProfile } from '../stores/userStore';
import { WeightTracker } from './weightTracking';

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
    weight: { current: number | null; target: number | null; percentage: number; change: number | null };
  };
  bmiData: {
    value: number | null;
    category: string | null;
    categoryColor: string | null;
  };
  weightChartData: { date: string; weight: number }[];
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

  // Get data for the last N days
  static async getWeeklyData(): Promise<WeeklyData[]> {
    return this.getPeriodData('week');
  }

  // Get data for different periods
  static async getPeriodData(period: 'week' | 'month' | 'year'): Promise<WeeklyData[]> {
    const periodData: WeeklyData[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    switch (period) {
      case 'week':
        // 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayData = await this.getDayData(date);
          periodData.push({
            day: dayNames[date.getDay()],
            calories: dayData.calories
          });
        }
        break;
        
      case 'month':
        // 4 weeks (show weekly averages)
        for (let i = 3; i >= 0; i--) {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() - (i * 7));
          const startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() - 6);
          
          let totalCalories = 0;
          let daysCount = 0;
          
          for (let j = 0; j < 7; j++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + j);
            const dayData = await this.getDayData(date);
            totalCalories += dayData.calories;
            if (dayData.calories > 0) daysCount++;
          }
          
          const avgCalories = daysCount > 0 ? Math.round(totalCalories / 7) : 0;
          const weekLabel = `W${4-i}`;
          
          periodData.push({
            day: weekLabel,
            calories: avgCalories
          });
        }
        break;
        
      case 'year':
        // 12 months
        for (let i = 11; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          date.setDate(1);
          
          // Calculate average for the month
          const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
          let totalCalories = 0;
          let daysCount = 0;
          
          for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(date.getFullYear(), date.getMonth(), day);
            if (dayDate <= new Date()) { // Only include past days
              const dayData = await this.getDayData(dayDate);
              totalCalories += dayData.calories;
              if (dayData.calories > 0) daysCount++;
            }
          }
          
          const avgCalories = daysCount > 0 ? Math.round(totalCalories / Math.max(daysCount, 1)) : 0;
          
          periodData.push({
            day: monthNames[date.getMonth()],
            calories: avgCalories
          });
        }
        break;
    }

    return periodData;
  }

  // Calculate analytics data
  static async getAnalyticsData(period: 'week' | 'month' | 'year' = 'week'): Promise<AnalyticsData> {
    const weeklyData = await this.getPeriodData(period);
    
    // Calculate average calories
    const totalCalories = weeklyData.reduce((sum, day) => sum + day.calories, 0);
    const avgCalories = Math.round(totalCalories / weeklyData.length);

    // Calculate days on track (days with at least some calories logged)
    const daysOnTrack = weeklyData.filter(day => day.calories > 0).length;

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

    // Get weight and BMI data
    const weightStats = await WeightTracker.getWeightStats();
    const weightGoal = await WeightTracker.getWeightGoal();
    const weightChartData = await WeightTracker.getWeightChartData();
    
    // Calculate BMI if we have current weight and height
    let bmiData: { value: number | null; category: string | null; categoryColor: string | null } = { 
      value: null, 
      category: null, 
      categoryColor: null 
    };
    if (weightStats.currentWeight && userProfile.height) {
      const bmi = WeightTracker.calculateBMI(weightStats.currentWeight, userProfile.height);
      bmiData = {
        value: bmi.value,
        category: WeightTracker.getBMICategoryText(bmi.category),
        categoryColor: bmi.categoryColor
      };
    }

    // Calculate weight progress
    let weightProgress = 0;
    if (weightStats.currentWeight && weightGoal) {
      weightProgress = WeightTracker.calculateWeightProgress(weightStats.currentWeight, weightGoal);
    }

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
        },
        weight: {
          current: weightStats.currentWeight,
          target: weightGoal?.targetWeight || null,
          percentage: Math.round(weightProgress),
          change: weightStats.weightChange
        }
      },
      bmiData,
      weightChartData
    };
  }

  // Get yesterday's data
  static async getYesterdayData(): Promise<DayData> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.getDayData(yesterday);
  }
}
