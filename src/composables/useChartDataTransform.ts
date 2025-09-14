import { computed, type ComputedRef } from 'vue'
import type { AnalyticsData, WeeklyData } from '../utils/analyticsData'

export interface ChartDataTransformOptions {
  period: 'day' | 'week' | 'month' | 'year'
}

export function useChartDataTransform(
  analyticsData: ComputedRef<AnalyticsData | null>,
  options: ComputedRef<ChartDataTransformOptions>
) {
  
  // Single memoized computation for all chart data transformations
  const chartDataCache = computed(() => {
    if (!analyticsData.value?.weeklyData) {
      return {
        daily: [],
        quarterly: [],
        trends: { calories: [], protein: [], carbs: [], fats: [] }
      }
    }

    const weeklyData = analyticsData.value.weeklyData
    
    // Transform for daily/weekly/monthly charts
    const dailyData = weeklyData.map(day => ({
      label: day.day,
      calories: day.calories
    }))

    // Transform for yearly (quarterly) view
    const quarterlyData = options.value.period === 'year' 
      ? getQuarterlyData(weeklyData)
      : []

    // Transform for trend charts (all macros at once)
    const trends = {
      calories: weeklyData.map(item => ({ date: item.day, calories: item.calories })),
      protein: weeklyData.map(item => ({ date: item.day, calories: item.protein })),
      carbs: weeklyData.map(item => ({ date: item.day, calories: item.carbs })),
      fats: weeklyData.map(item => ({ date: item.day, calories: item.fats }))
    }

    return { daily: dailyData, quarterly: quarterlyData, trends }
  })

  // Individual computed properties for specific chart types
  const chartData = computed(() => {
    const cache = chartDataCache.value
    return options.value.period === 'year' ? cache.quarterly : cache.daily
  })

  const trendData = computed(() => chartDataCache.value.trends)

  return {
    chartData,
    trendData,
    caloriesTrendData: computed(() => trendData.value.calories),
    proteinTrendData: computed(() => trendData.value.protein),
    carbsTrendData: computed(() => trendData.value.carbs),
    fatsTrendData: computed(() => trendData.value.fats)
  }
}

function getQuarterlyData(weeklyData: WeeklyData[]) {
  if (!weeklyData.length) return []

  const quarters = [
    { label: 'Q1', calories: 0, months: ['Jan', 'Feb', 'Mar'] },
    { label: 'Q2', calories: 0, months: ['Apr', 'May', 'Jun'] },
    { label: 'Q3', calories: 0, months: ['Jul', 'Aug', 'Sep'] },
    { label: 'Q4', calories: 0, months: ['Oct', 'Nov', 'Dec'] }
  ]

  weeklyData.forEach(data => {
    quarters.forEach(quarter => {
      if (quarter.months.includes(data.day)) {
        quarter.calories += data.calories
      }
    })
  })

  return quarters.map(quarter => ({
    label: quarter.label,
    calories: Math.round(quarter.calories / 3)
  }))
}
