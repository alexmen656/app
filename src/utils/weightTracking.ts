import { Storage } from './storage'

export interface WeightEntry {
  weight: number
  date: string
  timestamp: number
  note?: string
}

export interface WeightGoal {
  startWeight: number
  targetWeight: number
  goalType: 'lose' | 'gain' | 'maintain'
  startDate: string
  targetDate?: string
  isActive: boolean
}

export interface BMIData {
  value: number
  category: 'underweight' | 'normal' | 'overweight' | 'obese'
  categoryColor: string
}

export class WeightTracker {
  // Save a new weight entry
  static async addWeightEntry(weight: number, note?: string): Promise<void> {
    const entries = await this.getWeightEntries()
    const newEntry: WeightEntry = {
      weight,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      note
    }
    
    entries.unshift(newEntry) // Add to beginning
    await Storage.set('weightEntries', entries)
  }

  // Get all weight entries
  static async getWeightEntries(): Promise<WeightEntry[]> {
    try {
      const entries = await Storage.get('weightEntries')
      return entries || []
    } catch {
      return []
    }
  }

  // Get latest weight entry
  static async getLatestWeight(): Promise<number | null> {
    const entries = await this.getWeightEntries()
    return entries.length > 0 ? entries[0].weight : null
  }

  // Set weight goal
  static async setWeightGoal(goal: Omit<WeightGoal, 'isActive'>): Promise<void> {
    const weightGoal: WeightGoal = { ...goal, isActive: true }
    await Storage.set('weightGoal', weightGoal)
  }

  // Get current weight goal
  static async getWeightGoal(): Promise<WeightGoal | null> {
    try {
      const goal = await Storage.get('weightGoal')
      return goal || null
    } catch {
      return null
    }
  }

  // Calculate BMI
  static calculateBMI(weight: number, height: number): BMIData {
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    
    let category: BMIData['category']
    let categoryColor: string

    if (bmi < 18.5) {
      category = 'underweight'
      categoryColor = '#ffa726'
    } else if (bmi < 25) {
      category = 'normal'
      categoryColor = '#4caf50'
    } else if (bmi < 30) {
      category = 'overweight'
      categoryColor = '#ff9800'
    } else {
      category = 'obese'
      categoryColor = '#f44336'
    }

    return {
      value: Math.round(bmi * 10) / 10,
      category,
      categoryColor
    }
  }

  // Get BMI category text
  static getBMICategoryText(category: BMIData['category'], language: 'en' | 'de' = 'de'): string {
    const categories = {
      en: {
        underweight: 'Underweight',
        normal: 'Normal weight',
        overweight: 'Overweight',
        obese: 'Obesity'
      },
      de: {
        underweight: 'Untergewicht',
        normal: 'Normalgewicht',
        overweight: 'Übergewicht',
        obese: 'Adipositas'
      }
    }
    return categories[language][category]
  }

  // Calculate weight progress percentage
  static calculateWeightProgress(currentWeight: number, goal: WeightGoal): number {
    if (goal.goalType === 'maintain') {
      const difference = Math.abs(currentWeight - goal.targetWeight)
      const maxAllowedDifference = 2 // kg
      return Math.max(0, Math.min(100, (1 - difference / maxAllowedDifference) * 100))
    }

    const totalWeightChange = Math.abs(goal.targetWeight - goal.startWeight)
    const currentWeightChange = Math.abs(currentWeight - goal.startWeight)
    
    if (totalWeightChange === 0) return 100
    
    return Math.min(100, (currentWeightChange / totalWeightChange) * 100)
  }

  // Get weight data for chart (last 30 days)
  static async getWeightChartData(): Promise<{ date: string; weight: number }[]> {
    const entries = await this.getWeightEntries()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    return entries
      .filter(entry => new Date(entry.date) >= thirtyDaysAgo)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(entry => ({
        date: entry.date,
        weight: entry.weight
      }))
  }

  // Get weight statistics
  static async getWeightStats(): Promise<{
    currentWeight: number | null
    startWeight: number | null
    weightChange: number | null
    averageWeeklyChange: number | null
  }> {
    const entries = await this.getWeightEntries()
    const goal = await this.getWeightGoal()
    
    if (entries.length === 0) {
      return {
        currentWeight: null,
        startWeight: goal?.startWeight || null,
        weightChange: null,
        averageWeeklyChange: null
      }
    }

    const currentWeight = entries[0].weight
    const startWeight = goal?.startWeight || entries[entries.length - 1].weight
    const weightChange = currentWeight - startWeight

    // Calculate average weekly change (if we have at least 2 weeks of data)
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    
    const recentEntries = entries.filter(entry => new Date(entry.date) >= twoWeeksAgo)
    let averageWeeklyChange = null
    
    if (recentEntries.length >= 2) {
      const oldestRecent = recentEntries[recentEntries.length - 1]
      const newestRecent = recentEntries[0]
      const daysDiff = (new Date(newestRecent.date).getTime() - new Date(oldestRecent.date).getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysDiff > 0) {
        const totalChange = newestRecent.weight - oldestRecent.weight
        averageWeeklyChange = (totalChange / daysDiff) * 7
      }
    }

    return {
      currentWeight,
      startWeight,
      weightChange,
      averageWeeklyChange: averageWeeklyChange ? Math.round(averageWeeklyChange * 10) / 10 : null
    }
  }
}
