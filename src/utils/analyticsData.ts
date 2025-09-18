import { ScanHistory } from './storage';//Storage, 
import { dailyGoals, userProfile } from '../stores/userStore';
import { WeightTracker } from './weightTracking';
import { getLocalizedName } from './localization';

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
    image?: string;
    icon?: string;
  }>;
}

export interface WeeklyData {
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
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
    /*exercise: { current: number; target: number; percentage: number };
    water: { current: number; target: number; percentage: number };*/
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
  private static getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static getDayDataFromHistory(date: Date, history: any[]): DayData {
    const dateStr = this.getDateString(date);
    
    console.log('📅 Getting day data for:', dateStr);
    console.log('📚 Using pre-loaded history:', history.length, 'items');
    
    const dayScans = history.filter(scan => {
      const scanDate = new Date(scan.timestamp).toISOString().split('T')[0];
      const matches = scanDate === dateStr;
      if (matches) {
        console.log('✅ Scan matches date:', {
          scanId: scan.id,
          scanDate,
          targetDate: dateStr,
          time: scan.time,
          type: scan.type
        });
      }
      return matches;
    });
    
    console.log('🔍 Found', dayScans.length, 'scans for date:', dateStr);

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
        name = getLocalizedName(scan.data.foods?.[0]) || 'Gescanntes Essen';
      } else if (scan.type === 'barcode' && scan.data.nutriments) {
        calories = scan.data.nutriments.energy_kcal_100g || 0;
        protein = scan.data.nutriments.proteins_100g || 0;
        carbs = scan.data.nutriments.carbohydrates_100g || 0;
        fats = scan.data.nutriments.fat_100g || 0;
        name = getLocalizedName(scan.data) || 'Unbekanntes Produkt';
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
        type: scan.type,
        image: scan.image,
        icon: scan.icon
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

  static async getDayData(date: Date): Promise<DayData> {
    const history = await ScanHistory.get();
    return this.getDayDataFromHistory(date, history);
  }

  static async getWeeklyData(): Promise<WeeklyData[]> {
    return this.getPeriodData('week');
  }

  static getPeriodDataFromHistory(period: 'day' | 'week' | 'month' | 'year', history: any[]): WeeklyData[] {
    const periodData: WeeklyData[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    switch (period) {
      case 'day':
        const today = new Date();
        const todayData = this.getDayDataFromHistory(today, history);
        const hourlyData: { [hour: string]: { calories: number; count: number } } = {};
        
        for (let hour = 0; hour < 24; hour++) {
          const hourStr = hour.toString().padStart(2, '0');
          hourlyData[hourStr] = { calories: 0, count: 0 };
        }
        
        todayData.foods.forEach((food: any) => {
          if (food.time) {
            const hour = food.time.split(':')[0];

            if (hourlyData[hour]) {
              hourlyData[hour].calories += food.calories;
              hourlyData[hour].count++;
            }
          }
        });
        
        const timeSlots = [
          { label: '6AM', hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'] },
          { label: '10AM', hours: ['10', '11'] },
          { label: '12PM', hours: ['12', '13'] },
          { label: '2PM', hours: ['14', '15', '16', '17'] },
          { label: '6PM', hours: ['18', '19'] },
          { label: '8PM', hours: ['20', '21', '22', '23'] }
        ];
        
        timeSlots.forEach(slot => {
          let slotCalories = 0;
          slot.hours.forEach(hour => {
            const hourCalories = hourlyData[hour]?.calories || 0;
            slotCalories += hourCalories;
          });
          periodData.push({
            day: slot.label,
            calories: Math.round(slotCalories),
            protein: 0,
            carbs: 0,
            fats: 0
          });
          console.log('📊 Final slot data:', slot.label, 'total:', Math.round(slotCalories), 'kcal');
        });
        break;
        
      case 'week':
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayData = this.getDayDataFromHistory(date, history);
          periodData.push({
            day: dayNames[date.getDay()],
            calories: dayData.calories,
            protein: dayData.protein,
            carbs: dayData.carbs,
            fats: dayData.fats
          });
        }
        break;
        
      case 'month':
        for (let i = 3; i >= 0; i--) {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() - (i * 7));
          const startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() - 6);
          
          let totalCalories = 0;
          let totalProtein = 0;
          let totalCarbs = 0;
          let totalFats = 0;
          let daysCount = 0;
          
          for (let j = 0; j < 7; j++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + j);
            const dayData = this.getDayDataFromHistory(date, history);
            totalCalories += dayData.calories;
            totalProtein += dayData.protein;
            totalCarbs += dayData.carbs;
            totalFats += dayData.fats;
            if (dayData.calories > 0) daysCount++;
          }
          
          const avgCalories = daysCount > 0 ? Math.round(totalCalories / 7) : 0;
          const avgProtein = daysCount > 0 ? Math.round(totalProtein / 7) : 0;
          const avgCarbs = daysCount > 0 ? Math.round(totalCarbs / 7) : 0;
          const avgFats = daysCount > 0 ? Math.round(totalFats / 7) : 0;
          const weekLabel = `W${4-i}`;
          
          periodData.push({
            day: weekLabel,
            calories: avgCalories,
            protein: avgProtein,
            carbs: avgCarbs,
            fats: avgFats
          });
        }
        break;
        
      case 'year':
        for (let i = 11; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          date.setDate(1);
          
          const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
          let totalCalories = 0;
          let totalProtein = 0;
          let totalCarbs = 0;
          let totalFats = 0;
          let daysCount = 0;
          
          for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(date.getFullYear(), date.getMonth(), day);
            if (dayDate <= new Date()) {
              const dayData = this.getDayDataFromHistory(dayDate, history);
              totalCalories += dayData.calories;
              totalProtein += dayData.protein;
              totalCarbs += dayData.carbs;
              totalFats += dayData.fats;
              if (dayData.calories > 0) daysCount++;
            }
          }
          
          const avgCalories = daysCount > 0 ? Math.round(totalCalories / Math.max(daysCount, 1)) : 0;
          const avgProtein = daysCount > 0 ? Math.round(totalProtein / Math.max(daysCount, 1)) : 0;
          const avgCarbs = daysCount > 0 ? Math.round(totalCarbs / Math.max(daysCount, 1)) : 0;
          const avgFats = daysCount > 0 ? Math.round(totalFats / Math.max(daysCount, 1)) : 0;
          
          periodData.push({
            day: monthNames[date.getMonth()],
            calories: avgCalories,
            protein: avgProtein,
            carbs: avgCarbs,
            fats: avgFats
          });
        }
        break;
    }

    return periodData;
  }

  static async getPeriodData(period: 'day' | 'week' | 'month' | 'year'): Promise<WeeklyData[]> {
    const history = await ScanHistory.get();
    return this.getPeriodDataFromHistory(period, history);
  }

  static async getAnalyticsData(period: 'day' | 'week' | 'month' | 'year' = 'day'): Promise<AnalyticsData> {
    const history = await ScanHistory.get();
    const weeklyData = this.getPeriodDataFromHistory(period, history);
    const totalCalories = weeklyData.reduce((sum, day) => sum + day.calories, 0);
    const avgCalories = Math.round(totalCalories / weeklyData.length);
    const daysOnTrack = weeklyData.filter(day => day.calories > 0).length;

    let macroBreakdown = { protein: 0, carbs: 0, fats: 0 };
    
    if (period === 'day') {
      const todayData = this.getDayDataFromHistory(new Date(), history);
      const totalMacroCalories = (todayData.protein * 4) + (todayData.carbs * 4) + (todayData.fats * 9);
      
      macroBreakdown = {
        protein: totalMacroCalories > 0 ? Math.round((todayData.protein * 4 / totalMacroCalories) * 100) : 0,
        carbs: totalMacroCalories > 0 ? Math.round((todayData.carbs * 4 / totalMacroCalories) * 100) : 0,
        fats: totalMacroCalories > 0 ? Math.round((todayData.fats * 9 / totalMacroCalories) * 100) : 0
      };
    } else {
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFats = 0;
      let daysWithData = 0;
      
      const daysToAnalyze = period === 'week' ? 7 : period === 'month' ? 30 : 365;
      
      for (let i = 0; i < daysToAnalyze; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayData = this.getDayDataFromHistory(date, history);
        
        if (dayData.calories > 0) {
          totalProtein += dayData.protein;
          totalCarbs += dayData.carbs;
          totalFats += dayData.fats;
          daysWithData++;
        }
      }
      
      if (daysWithData > 0) {
        const avgProtein = totalProtein / daysWithData;
        const avgCarbs = totalCarbs / daysWithData;
        const avgFats = totalFats / daysWithData;
        const totalMacroCalories = (avgProtein * 4) + (avgCarbs * 4) + (avgFats * 9);
        
        macroBreakdown = {
          protein: totalMacroCalories > 0 ? Math.round((avgProtein * 4 / totalMacroCalories) * 100) : 0,
          carbs: totalMacroCalories > 0 ? Math.round((avgCarbs * 4 / totalMacroCalories) * 100) : 0,
          fats: totalMacroCalories > 0 ? Math.round((avgFats * 9 / totalMacroCalories) * 100) : 0
        };
      }
    }
    
    // Mock exercise and water data (can be expanded later)
    //const exerciseData = await Storage.get('exerciseData') || { current: 4, target: 5 };
    //const waterData = await Storage.get('waterData') || { current: 1.8, target: 2.5 };

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

    // For calories goal progress, use appropriate data based on period
    const todayData = this.getDayDataFromHistory(new Date(), history);
    const currentCalories = period === 'day' ? todayData.calories : avgCalories;
    
    return {
      weeklyData,
      avgCalories,
      daysOnTrack,
      macroBreakdown,
      goalProgress: {
        calories: {
          current: currentCalories,
          target: dailyGoals.calories,
          percentage: Math.round((currentCalories / dailyGoals.calories) * 100)
        },
        /*exercise: {
          current: exerciseData.current,
          target: exerciseData.target,
          percentage: Math.round((exerciseData.current / exerciseData.target) * 100)
        },
        water: {
          current: waterData.current,
          target: waterData.target,
          percentage: Math.round((waterData.current / waterData.target) * 100)
        },*/
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

  static async getYesterdayData(): Promise<DayData> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.getDayData(yesterday);
  }
}
