<template>
  <div class="analytics-view"
       @touchstart="handleTouchStart"
       @touchmove="handleTouchMove"
       @touchend="handleTouchEnd">
    <!-- Header -->
    <header class="header">
      <h1 class="title">{{ $t('app.analytics') }}</h1>
      <div class="date-picker">
        <select v-model="selectedPeriod" class="period-select" @change="checkPremiumAccess">
          <option value="week">{{ $t('analytics.thisWeek') }}</option>
          <option value="month">{{ $t('analytics.thisMonth') }}</option>
          <option value="year">{{ $t('analytics.thisYear') }}</option>
        </select>
      </div>
    </header>

    <!-- Premium Blocker for extended periods -->
    <PremiumBlocker
      v-if="showPremiumBlocker"
      :feature="'unlimited_analytics_history'"
      :title="$t('premium.analytics.title')"
      :description="$t('premium.analytics.description')"
      :features="[
        $t('premium.analytics.feature1'),
        $t('premium.analytics.feature2'),
        $t('premium.analytics.feature3')
      ]"
      @close="closePremiumBlocker"
      @upgrade="handleAnalyticsUpgrade"
    />

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-header">
          <h3>{{ $t('analytics.avgDailyCalories') }}</h3>
          <span class="trend up">{{ calorieTrend }}</span>
        </div>
        <div class="card-value">{{ analyticsData?.avgCalories || 0 }}</div>
      </div>
      
      <div class="summary-card">
        <div class="card-header">
          <h3>{{ $t('analytics.daysOnTrack') }}</h3>
          <span class="trend up">{{ daysOnTrackTrend }}</span>
        </div>
        <div class="card-value">{{ analyticsData?.daysOnTrack || 0 }}/7</div>
      </div>
    </div>

    <!-- Chart Section (with Premium overlay if needed) -->
    <div class="chart-section" :class="{ 'premium-locked': shouldShowPremiumOverlay }">
      <h3 class="section-title">{{ chartTitle }}</h3>
      
      <!-- Premium Overlay for Charts -->
      <div v-if="shouldShowPremiumOverlay" class="premium-chart-overlay" @click="showPremiumBlocker = true">
        <div class="premium-overlay-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#FFD700">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <h4>{{ $t('premium.analytics.upgradeTitle') }}</h4>
          <p>{{ $t('premium.analytics.upgradeSubtitle') }}</p>
          <button class="upgrade-btn">{{ $t('premium.upgrade.button') }}</button>
        </div>
      </div>
      
      <CalorieChart 
        v-else
        :data="getChartData()" 
        :period="selectedPeriod" 
        :goal="2500"
      />
    </div>

    <!-- Macro Breakdown -->
    <div class="macro-breakdown">
      <h3 class="section-title">{{ $t('analytics.macroDistribution') }}</h3>
      <div class="macro-charts">
        <div class="macro-chart">
          <div class="macro-ring">
            <svg width="80" height="80">
              <circle cx="40" cy="40" r="30" stroke="#2a2d37" stroke-width="8" fill="none"/>
              <circle 
                cx="40" 
                cy="40" 
                r="30" 
                stroke="#ff6b6b" 
                stroke-width="8" 
                fill="none"
                stroke-dasharray="188"
                :stroke-dashoffset="188 - (188 * (analyticsData?.macroBreakdown.protein || 0) / 100)"
                stroke-linecap="round"
              />
            </svg>
            <div class="macro-center">
              <span class="macro-percentage">{{ analyticsData?.macroBreakdown.protein || 0 }}%</span>
            </div>
          </div>
          <span class="macro-label">{{ $t('analytics.protein') }}</span>
        </div>

        <div class="macro-chart">
          <div class="macro-ring">
            <svg width="80" height="80">
              <circle cx="40" cy="40" r="30" stroke="#2a2d37" stroke-width="8" fill="none"/>
              <circle 
                cx="40" 
                cy="40" 
                r="30" 
                stroke="#ffa726" 
                stroke-width="8" 
                fill="none"
                stroke-dasharray="188"
                :stroke-dashoffset="188 - (188 * (analyticsData?.macroBreakdown.carbs || 0) / 100)"
                stroke-linecap="round"
              />
            </svg>
            <div class="macro-center">
              <span class="macro-percentage">{{ analyticsData?.macroBreakdown.carbs || 0 }}%</span>
            </div>
          </div>
          <span class="macro-label">{{ $t('analytics.carbs') }}</span>
        </div>

        <div class="macro-chart">
          <div class="macro-ring">
            <svg width="80" height="80">
              <circle cx="40" cy="40" r="30" stroke="#2a2d37" stroke-width="8" fill="none"/>
              <circle 
                cx="40" 
                cy="40" 
                r="30" 
                stroke="#42a5f5" 
                stroke-width="8" 
                fill="none"
                stroke-dasharray="188"
                :stroke-dashoffset="188 - (188 * (analyticsData?.macroBreakdown.fats || 0) / 100)"
                stroke-linecap="round"
              />
            </svg>
            <div class="macro-center">
              <span class="macro-percentage">{{ analyticsData?.macroBreakdown.fats || 0 }}%</span>
            </div>
          </div>
          <span class="macro-label">{{ $t('analytics.fats') }}</span>
        </div>
      </div>
    </div>

    <!-- Goals Section -->
    <div class="goals-section">
      <h3 class="section-title">{{ $t('analytics.goalProgress') }}</h3>
      <div class="goal-items">
        <div class="goal-item">
          <div class="goal-info">
            <span class="goal-name">{{ $t('analytics.dailyCalorieGoal') }}</span>
            <span class="goal-progress">{{ analyticsData?.goalProgress.calories.current || 0 }} / {{ analyticsData?.goalProgress.calories.target || 0 }} {{ $t('analytics.kcal') }}</span>
          </div>
          <div class="goal-bar">
            <div class="goal-fill" :style="{ width: Math.min((analyticsData?.goalProgress.calories.percentage || 0), 100) + '%' }"></div>
          </div>
        </div>

        <!-- Weight Goal Progress - Remove target display to avoid confusion -->
        <div class="goal-item">
          <div class="goal-info">
            <span class="goal-name">{{ $t('analytics.weightProgress') }}</span>
            <span class="goal-progress">
              {{ $t('common.current') }}: {{ analyticsData?.goalProgress.weight.current || 0 }} {{ $t('analytics.kg') }}
              <span v-if="analyticsData?.goalProgress.weight.change !== null" class="weight-change" 
                    :class="{ 'positive': (analyticsData?.goalProgress.weight.change || 0) >= 0, 'negative': (analyticsData?.goalProgress.weight.change || 0) < 0 }">
                ({{ (analyticsData?.goalProgress.weight.change || 0) >= 0 ? '+' : '' }}{{ Math.round((analyticsData?.goalProgress.weight.change || 0) * 10)/10 }}{{ $t('analytics.kg') }})
              </span>
            </span>
          </div>
          <div class="goal-bar">
            <div class="goal-fill weight-goal-fill" :style="{ width: Math.min((analyticsData?.goalProgress.weight.percentage || 0), 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- BMI Section -->
    <div v-if="analyticsData?.bmiData.value" class="bmi-section" @click="navigateToBMIDetail">
      <div class="section-header">
        <h3 class="section-title">
          {{ $t('analytics.bmiHealthStatus') }}
          <button class="info-btn" @click.stop="showBMIInfoModal = true">
            i
          </button>
        </h3>
        <button class="detail-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>
      <div class="bmi-container">
        <div class="bmi-display">
          <div class="bmi-value" :style="{ color: analyticsData?.bmiData.categoryColor || '#ffffff' }">
            {{ analyticsData?.bmiData.value }}
          </div>
          <div class="bmi-category" :style="{ color: analyticsData?.bmiData.categoryColor || '#ffffff' }">
            {{ analyticsData?.bmiData.category }}
          </div>
        </div>
        <div class="bmi-scale">
          <div class="bmi-scale-bar">
            <div class="bmi-indicator" :style="{ left: getBMIPosition(analyticsData?.bmiData.value) + '%' }"></div>
          </div>
          <div class="bmi-labels">
            <span class="bmi-label">18.5</span>
            <span class="bmi-label">25</span>
            <span class="bmi-label">30</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Weight Chart Section -->
    <div class="weight-section">
      <div class="section-header">
        <h3 class="section-title">{{ $t('analytics.weightProgress') }}</h3>
        <div class="header-buttons">
          <button @click="navigateToWeightDetail" class="detail-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
          <button @click="showWeightLogModal = true" class="log-weight-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            {{ $t('analytics.logWeight') }}
          </button>
        </div>
      </div>
      


    

        <!-- Enhanced Chart -->
        <WeightChart v-if="analyticsData?.goalProgress.weight.target" 
          :data="analyticsData?.weightChartData || []"
          :goal-weight="analyticsData?.goalProgress.weight.target || undefined"
          :current-weight="analyticsData?.goalProgress.weight.current || undefined"
        />
      
      <div v-else class="no-weight-data">
        <div class="no-data-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <p class="no-data-text">{{ $t('analytics.noWeightData') }}</p>
        <p class="no-data-subtitle">{{ $t('analytics.startLoggingWeight') }}</p>
      </div>
    </div>

    <!-- Weight Log Modal -->
    <div v-if="showWeightLogModal" class="modal-overlay" @click="showWeightLogModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('analytics.logYourWeight') }}</h3>
          <button @click="showWeightLogModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="weight-input-section">
            <label class="modal-label">{{ $t('analytics.weightKg') }}</label>
            <input 
              v-model="newWeight" 
              type="number" 
              step="0.1"
              min="30"
              max="300"
              class="modal-input"
              :placeholder="$t('analytics.enterCurrentWeight')"
            />
          </div>
          <div class="weight-input-section">
            <label class="modal-label">{{ $t('analytics.noteOptional') }}</label>
            <input 
              v-model="weightNote" 
              type="text"
              class="modal-input"
              :placeholder="$t('analytics.morningWeight')"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showWeightLogModal = false" class="modal-btn secondary">{{ $t('common.cancel') }}</button>
          <button @click="logWeight" class="modal-btn primary" :disabled="!newWeight">{{ $t('common.save') }}</button>
        </div>
      </div>
    </div>

    <!-- BMI Info Modal -->
    <div v-if="showBMIInfoModal" class="modal-overlay" @click="showBMIInfoModal = false">
      <div class="modal-content bmi-info-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('analytics.bmiExplanation.title') }}</h3>
          <button @click="showBMIInfoModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="bmi-info-section">
            <h4>{{ $t('analytics.bmiExplanation.whatIs') }}</h4>
            <p>{{ $t('analytics.bmiExplanation.description') }}</p>
          </div>
          
          <div class="bmi-info-section">
            <h4>{{ $t('analytics.bmiExplanation.calculation') }}</h4>
            <div class="formula-container">
              <code class="formula">BMI = {{ $t('analytics.bmiExplanation.formula') }}</code>
            </div>
            <p class="formula-note">{{ $t('analytics.bmiExplanation.formulaNote') }}</p>
          </div>

          <div class="bmi-info-section">
            <h4>{{ $t('analytics.bmiExplanation.categories') }}</h4>
            <div class="bmi-categories">
              <div class="category-item">
                <span class="category-range">&lt; 18.5</span>
                <span class="category-name">{{ $t('analytics.bmiExplanation.underweight') }}</span>
              </div>
              <div class="category-item">
                <span class="category-range">18.5 - 24.9</span>
                <span class="category-name">{{ $t('analytics.bmiExplanation.normal') }}</span>
              </div>
              <div class="category-item">
                <span class="category-range">25.0 - 29.9</span>
                <span class="category-name">{{ $t('analytics.bmiExplanation.overweight') }}</span>
              </div>
              <div class="category-item">
                <span class="category-range">≥ 30.0</span>
                <span class="category-name">{{ $t('analytics.bmiExplanation.obese') }}</span>
              </div>
            </div>
          </div>

          <div class="bmi-info-section">
            <h4>{{ $t('analytics.bmiExplanation.important') }}</h4>
            <p>{{ $t('analytics.bmiExplanation.disclaimer') }}</p>
            
            <div class="external-link-container">
              <a href="https://www.cdc.gov/bmi/about/?CDC_AAref_Val=https://www.cdc.gov/healthyweight/assessing/bmi/index.html" target="_blank" class="external-link">
                {{ $t('analytics.bmiExplanation.cdcLink') }}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="15,3 21,3 21,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showBMIInfoModal = false" class="modal-btn primary">{{ $t('common.understood') }}</button>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <router-link to="/" class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span class="nav-label">Home</span>
      </router-link>
      <router-link to="/analytics" class="nav-item active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
        <span class="nav-label">Analytics</span>
      </router-link>
      <router-link to="/settings" class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
        </svg>
        <span class="nav-label">Settings</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AnalyticsManager, type AnalyticsData } from '../utils/analyticsData'
import { WeightTracker } from '../utils/weightTracking'
import { StreakManager } from '../utils/widgetData'
import CalorieChart from '../components/charts/CalorieChart.vue'
import WeightChart from '../components/charts/WeightChart.vue'
import PremiumBlocker from '../components/PremiumBlocker.vue'
import { premiumManager, isPremiumUser, premiumFeatures } from '../utils/premiumManager'

const router = useRouter()

const selectedPeriod = ref<'week' | 'month' | 'year'>('week')
const analyticsData = ref<AnalyticsData | null>(null)
const loading = ref(true)
const previousAnalyticsData = ref<AnalyticsData | null>(null)

// Premium-related state
const showPremiumBlocker = ref(false)

// Weight logging modal
const showWeightLogModal = ref(false)
const newWeight = ref<number | null>(null)
const weightNote = ref('')

// BMI info modal
const showBMIInfoModal = ref(false)

// Premium access check
const shouldShowPremiumOverlay = computed(() => {
  return !isPremiumUser.value && (selectedPeriod.value === 'month' || selectedPeriod.value === 'year')
})

// Premium functions
const checkPremiumAccess = async () => {
  if (selectedPeriod.value !== 'week') {
    const canAccess = await premiumManager.canAccessFeature(premiumFeatures.UNLIMITED_ANALYTICS_HISTORY)
    if (!canAccess) {
      showPremiumBlocker.value = true
      selectedPeriod.value = 'week' // Reset to free tier
      return
    }
  }
}

const closePremiumBlocker = () => {
  showPremiumBlocker.value = false
  selectedPeriod.value = 'week' // Reset to free tier
}

const handleAnalyticsUpgrade = (feature: string) => {
  console.log('Upgrading for analytics feature:', feature)
  // Navigation zur Paywall erfolgt bereits in PremiumBlocker
}

// Load analytics data
async function loadAnalyticsData() {
    try {
        loading.value = true
        const currentData = await AnalyticsManager.getAnalyticsData(selectedPeriod.value as 'week' | 'month' | 'year')
        
        // Store previous data for comparison
        if (analyticsData.value) {
            previousAnalyticsData.value = { ...analyticsData.value }
        }
        
        analyticsData.value = currentData
    } catch (error) {
        console.error('Error loading analytics data:', error)
    } finally {
        loading.value = false
    }
}

// Watch for period changes
watch(selectedPeriod, () => {
    loadAnalyticsData()
})

// Computed properties for dynamic values
const calorieTrend = computed(() => {
    if (!analyticsData.value || !previousAnalyticsData.value) return '+0%'
    const current = analyticsData.value.avgCalories
    const previous = previousAnalyticsData.value.avgCalories
    if (previous === 0) return '+0%'
    const change = ((current - previous) / previous) * 100
    return `${change > 0 ? '+' : ''}${Math.round(change)}%`
})

const daysOnTrackTrend = computed(() => {
    if (!analyticsData.value || !previousAnalyticsData.value) return '+0'
    const current = analyticsData.value.daysOnTrack
    const previous = previousAnalyticsData.value.daysOnTrack
    const change = current - previous
    return `${change > 0 ? '+' : ''}${change}`
})

// Computed property for chart title
const chartTitle = computed(() => {
    switch (selectedPeriod.value) {
        case 'week':
            return 'Weekly Progress' // $t('analytics.weeklyProgress')
        case 'month':
            return 'Monthly Progress' // $t('analytics.monthlyProgress')
        case 'year':
            return 'Yearly Progress' // $t('analytics.yearlyProgress')
        default:
            return 'Weekly Progress' // $t('analytics.weeklyProgress')
    }
})

// Get actual streak value
const streakCount = ref(0)

function getChartData() {
    console.log('getChartData called', analyticsData.value?.weeklyData)
    
    if (!analyticsData.value?.weeklyData) {
        console.log('No weeklyData available')
        return []
    }
    
    if (selectedPeriod.value === 'year') {
        const quarterlyData = getQuarterlyData(analyticsData.value.weeklyData)
        console.log('Returning quarterly data:', quarterlyData)
        return quarterlyData
    } else {
        const mappedData = analyticsData.value.weeklyData.map(day => ({
            label: day.day,
            calories: day.calories
        }))
        console.log('Returning weekly/monthly data:', mappedData)
        return mappedData
    }
}

async function loadStreakData() {
    try {
        streakCount.value = await StreakManager.getCurrentStreak()
    } catch (error) {
        console.error('Error loading streak data:', error)
    }
}

onMounted(() => {
    loadAnalyticsData()
    loadStreakData()
})

// Helper functions for BMI and weight charts
function getBMIPosition(bmi: number | null): number {
    if (!bmi) return 0
    // Scale BMI from 15-35 to 0-100%
    const minBMI = 15
    const maxBMI = 35
    const position = ((bmi - minBMI) / (maxBMI - minBMI)) * 100
    return Math.max(0, Math.min(100, position))
}

// Get motivational message based on progress percentage
/*function getMotivationalMessage(percentage: number): string {
    if (percentage >= 90) return "Amazing progress! You're almost there!"
    if (percentage >= 70) return "Great job! Keep pushing forward!"
    if (percentage >= 50) return "You're doing well! Stay consistent!"
    if (percentage >= 25) return "Good start! Every step counts!"
    return "Let's begin this journey together!"
}*/

// Get quarterly data for yearly view (group months into quarters)
function getQuarterlyData(weeklyData: { day: string; calories: number }[]) {
    if (selectedPeriod.value !== 'year' || !weeklyData.length) return []
    
    // Group months into quarters
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
    
    // Average calories per quarter (divide by number of months in quarter)
    return quarters.map(quarter => ({
        label: quarter.label,
        calories: Math.round(quarter.calories / 3)
    }))
}

// Weight logging function
async function logWeight() {
    if (!newWeight.value) return
    
    try {
        await WeightTracker.addWeightEntry(newWeight.value, weightNote.value || undefined)
        
        // Reset modal
        showWeightLogModal.value = false
        newWeight.value = null
        weightNote.value = ''
        
        // Reload analytics data
        await loadAnalyticsData()
    } catch (error) {
        console.error('Error logging weight:', error)
    }
}

// Navigation functions
function navigateToBMIDetail() {
    router.push('/bmi-detail')
}

function navigateToWeightDetail() {
    router.push('/weight-detail')
}

// Touch/Swipe functionality
let touchStartX = 0
let touchStartY = 0
const swipeThreshold = 50 // Minimum distance for a swipe

function handleTouchStart(event: TouchEvent) {
    touchStartX = event.touches[0].clientX
    touchStartY = event.touches[0].clientY
}

function handleTouchMove(event: TouchEvent) {
    // Prevent default to avoid scrolling issues during swipe
    // Only prevent if we're in a horizontal swipe
    const currentX = event.touches[0].clientX
    const currentY = event.touches[0].clientY
    const deltaX = Math.abs(currentX - touchStartX)
    const deltaY = Math.abs(currentY - touchStartY)
    
    if (deltaX > deltaY && deltaX > 10) {
        event.preventDefault()
    }
}

function handleTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX
    const touchEndY = event.changedTouches[0].clientY
    
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY
    
    // Check if it's more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Swipe right (from left to right) - go back to home
        if (deltaX > swipeThreshold) {
            router.push('/')
        }
        // Swipe left (from right to left) - go to settings
        if (deltaX < -swipeThreshold) {
            router.push('/settings')
        }
    }
}
</script>

<style scoped>
.analytics-view {
  height: 100vh;
  height: 100dvh;
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
  color: white;
  padding: 16px;
  padding-top: max(44px, env(safe-area-inset-top, 44px));
  padding-bottom: max(80px, calc(80px + env(safe-area-inset-bottom, 0px)));
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  height: 44px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.period-select {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 8px 12px;
  font-size: 14px;
}

.summary-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.summary-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h3 {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  opacity: 0.8;
}

.trend {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
}

.chart-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;
  flex-shrink: 0;
}

.info-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  opacity: 1;
  transform: scale(1.1);
}

.chart-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  /*padding: 24px;*/
  backdrop-filter: blur(10px);
}

.chart {
  height: 200px;
}

.chart-bars {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 160px;
  margin-bottom: 16px;
}

.chart-bar {
  background: linear-gradient(to top, #ff6b6b, #ff8e8e);
  width: 30px;
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  display: flex;
  align-items: end;
  justify-content: center;
  transition: all 0.3s ease;
}

.chart-bar:hover {
  transform: scale(1.05);
}

.quarterly-bar {
  width: 60px;
  background: linear-gradient(to top, #42a5f5, #64b5f6);
}

.bar-value {
  position: absolute;
  top: -20px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  opacity: 0.7;
}

.macro-breakdown {
  margin-bottom: 32px;
}

.macro-charts {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.macro-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.macro-ring {
  position: relative;
}

.macro-ring svg {
  transform: rotate(-90deg);
}

.macro-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.macro-percentage {
  font-size: 14px;
  font-weight: 600;
}

.macro-label {
  font-size: 12px;
  opacity: 0.8;
}

.goals-section {
  margin-bottom: 32px;
}

.goal-items {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.goal-item {
  margin-bottom: 20px;
}

.goal-item:last-child {
  margin-bottom: 0;
}

.goal-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.goal-name {
  font-size: 14px;
  font-weight: 500;
}

.goal-progress {
  font-size: 12px;
  opacity: 0.7;
}

.goal-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.goal-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(30, 30, 46, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 20px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  height: 80px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-decoration: none;
  color: white;
  opacity: 0.6;
  transition: opacity 0.2s;
  min-width: 60px;
  height: 50px;
}

.nav-item.active {
  opacity: 1;
}

.nav-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.nav-label {
  font-size: 11px;
  font-weight: 500;
}

/* Weight and BMI specific styles */
.weight-change {
  font-size: 10px;
  margin-left: 4px;
}

.weight-change.positive {
  color: #4caf50;
}

.weight-change.negative {
  color: #ff6b6b;
}

.weight-goal-fill {
  background: linear-gradient(90deg, #42a5f5, #64b5f6);
}

.bmi-section {
  margin-bottom: 32px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.bmi-section:hover {
  transform: translateY(-2px);
}

.bmi-section:active {
  transform: translateY(0);
}

.bmi-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.bmi-display {
  text-align: center;
  margin-bottom: 24px;
}

.bmi-value {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 8px;
}

.bmi-category {
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.bmi-scale {
  position: relative;
  margin-top: 24px;
}

.bmi-scale-bar {
  height: 8px;
  background: linear-gradient(to right, #ffa726, #4caf50, #ff9800, #f44336);
  border-radius: 4px;
  position: relative;
}

.bmi-indicator {
  position: absolute;
  top: -4px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  border: 2px solid #1e1e2e;
  transform: translateX(-50%);
}

.bmi-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.7;
}

.weight-chart-section {
  margin-bottom: 32px;
}

.weight-section {
  margin-bottom: 32px;
}

.no-weight-data {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 40px 24px;
  backdrop-filter: blur(10px);
  text-align: center;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.no-weight-data:hover {
  border-color: rgba(66, 165, 245, 0.4);
  background: rgba(66, 165, 245, 0.02);
}

.no-data-icon {
  color: rgba(66, 165, 245, 0.6);
  margin-bottom: 16px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.8; }
}

.no-data-text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  color: rgba(255, 255, 255, 0.8);
}

.no-data-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.weight-chart-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 6px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

/* removed blue overlay so weight card matches other cards */

.weight-chart {
  height: 200px;
  position: relative;
  z-index: 1;
}

.weight-chart-grid {
  position: relative;
  height: 160px;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.chart-grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.weight-chart-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 4px rgba(66, 165, 245, 0.3));
}

.weight-point-svg {
  cursor: pointer;
  transition: all 0.2s ease;
  filter: drop-shadow(0 2px 6px rgba(66, 165, 245, 0.4));
}

.weight-point-svg:hover {
  r: 2.5;
  stroke-width: 1.2;
  filter: drop-shadow(0 4px 8px rgba(66, 165, 245, 0.6));
}

.weight-value-labels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.weight-value-label {
  position: absolute;
  font-size: 10px;
  font-weight: 600;
  color: #42a5f5;
  background: rgba(30, 30, 46, 0.9);
  padding: 3px 6px;
  border-radius: 6px;
  transform: translateX(-50%);
  white-space: nowrap;
  border: 1px solid rgba(66, 165, 245, 0.3);
  backdrop-filter: blur(4px);
}

.weight-chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  opacity: 0.7;
  margin-top: 8px;
}

.weight-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #42a5f5;
  border-radius: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  transition: all 0.2s ease;
}

.weight-point:hover {
  transform: translateX(-50%) scale(1.5);
}

.weight-point .weight-tooltip {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.weight-point:hover .weight-tooltip {
  opacity: 1;
}

.weight-chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  opacity: 0.7;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 8px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
}

.detail-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.log-weight-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.log-weight-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #2a2d37;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 20px 24px;
}

.weight-input-section {
  margin-bottom: 20px;
}

.modal-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.8);
}

.modal-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  padding: 12px 16px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.modal-input:focus {
  outline: none;
  border-color: #007052;
  background: rgba(255, 255, 255, 0.08);
}

.modal-footer {
  padding: 16px 24px 20px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.modal-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.modal-btn.primary {
  background: #007052;
  color: white;
}

.modal-btn.primary:hover {
  background: #005a42;
}

.modal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-btn:disabled:hover {
  background: #007052;
}

.weight-period-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  justify-content: center;
}

.period-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.period-btn.active {
  background: #007052;
  opacity: 1;
}

.period-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
}

.period-btn.active:hover {
  background: #005a42;
}

.weight-goal-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.weight-goal-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.goal-card-label {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 4px;
}

.goal-card-value {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.goal-card-progress {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.goal-card-fill {
  height: 100%;
  background: linear-gradient(90deg, #42a5f5, #64b5f6);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.weight-motivation {
  text-align: center;
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.motivation-text {
  font-size: 14px;
  color: #4caf50;
  font-weight: 500;
}

.enhanced-weight-chart {
  position: relative;
  height: 300px;
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
}

.chart-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(66, 165, 245, 0.1) 0%, 
    rgba(100, 181, 246, 0.05) 50%, 
    rgba(144, 202, 249, 0.1) 100%);
}

.y-axis {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 0;
}

.y-axis-label {
  font-size: 10px;
  opacity: 0.6;
  text-align: right;
  padding-right: 8px;
}

.chart-svg {
  position: absolute;
  left: 40px;
  right: 0;
  top: 20px;
  bottom: 40px;
}

.weight-chart-area {
  fill: url(#weightGradient);
  opacity: 0.3;
}

.weight-chart-line {
  fill: none;
  stroke: #42a5f5;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.trend-line {
  fill: none;
  stroke: #ff9800;
  stroke-width: 2;
  stroke-dasharray: 5,5;
  opacity: 0.7;
}

.weight-point {
  fill: #42a5f5;
  stroke: white;
  stroke-width: 2;
  cursor: pointer;
  transition: all 0.2s ease;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.weight-point:hover {
  fill: #1976d2;
  r: 6;
  stroke-width: 3;
}

.chart-labels {
  position: absolute;
  bottom: 0;
  left: 40px;
  right: 0;
  height: 40px;
  display: flex;
  align-items: center;
}

.chart-label {
  font-size: 10px;
  opacity: 0.6;
  flex: 1;
  text-align: center;
}

#weightGradient stop:first-child {
  stop-color: #42a5f5;
  stop-opacity: 0.8;
}

#weightGradient stop:last-child {
  stop-color: #42a5f5;
  stop-opacity: 0.1;
}

/* Premium Chart Overlay */
.premium-locked {
  position: relative;
}

.premium-chart-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(30, 30, 46, 0.95), rgba(42, 45, 55, 0.95));
  backdrop-filter: blur(10px);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.premium-chart-overlay:hover {
  background: linear-gradient(135deg, rgba(30, 30, 46, 0.98), rgba(42, 45, 55, 0.98));
}

.premium-overlay-content {
  text-align: center;
  color: white;
  padding: 32px;
}

.premium-overlay-content h4 {
  font-size: 20px;
  font-weight: 600;
  margin: 16px 0 8px 0;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.premium-overlay-content p {
  font-size: 14px;
  opacity: 0.8;
  margin: 0 0 20px 0;
  line-height: 1.4;
}

.upgrade-btn {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1e1e2e;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.3);
}

.upgrade-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

/* BMI Info Modal Styles */
.bmi-info-modal {
  max-width: 500px;
}

.bmi-info-section {
  margin-bottom: 24px;
}

.bmi-info-section h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: white;
}

.bmi-info-section p {
  line-height: 1.5;
  margin: 0 0 12px 0;
  color: rgba(255, 255, 255, 0.8);
}

.formula-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.formula {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 16px;
  color: #64b5f6;
  background: transparent;
  border: none;
  display: block;
  text-align: center;
}

.formula-note {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  margin: 8px 0 0 0;
}

.bmi-categories {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.category-range {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  color: #64b5f6;
  font-weight: 600;
}

.category-name {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.external-link-container {
  margin-top: 16px;
}

.external-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #64b5f6;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  border: 1px solid #64b5f6;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.external-link:hover {
  background: #64b5f6;
  color: #1e1e2e;
}
</style>
