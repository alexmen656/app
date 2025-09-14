<template>
  <div class="analytics-view" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <!-- Header -->
    <header class="header">
      <h1 class="title">{{ $t('app.analytics') }}</h1>
      <div class="date-picker">
        <select v-model="selectedPeriod" class="period-select" @change="checkPremiumAccess">
          <option value="day">{{ $t('analytics.today') }}</option>
          <option value="week">{{ $t('analytics.thisWeek') }}</option>
          <option value="month">{{ $t('analytics.thisMonth') }}</option>
          <option value="year">{{ $t('analytics.thisYear') }}</option>
        </select>
      </div>
    </header>

    <!-- Premium Blocker for extended periods -->
    <PremiumBlocker v-if="showPremiumBlocker" :feature="'unlimited_analytics_history'"
      :title="$t('premium.analytics.title')" :description="$t('premium.analytics.description')" :features="[
        $t('premium.analytics.feature1'),
        $t('premium.analytics.feature2'),
        $t('premium.analytics.feature3')
      ]" @close="closePremiumBlocker" @upgrade="handleAnalyticsUpgrade" />

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-header">
          <h3>{{ selectedPeriod === 'day' ? $t('analytics.todaysCalories') : $t('analytics.avgDailyCalories') }}</h3>
          <span class="trend up">{{ calorieTrend }}</span>
        </div>
        <div class="card-value">{{ selectedPeriod === 'day' ? (analyticsData?.goalProgress.calories.current || 0) :
          (analyticsData?.avgCalories || 0) }}</div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <h3>{{ selectedPeriod === 'day' ? $t('analytics.calorieGoal') : $t('analytics.daysOnTrack') }}</h3>
          <span class="trend up">{{ daysOnTrackTrend }}</span>
        </div>
        <div class="card-value">{{ selectedPeriod === 'day' ? (analyticsData?.goalProgress.calories.current || 0) + '/'
          + (analyticsData?.goalProgress.calories.target || 0) : (analyticsData?.daysOnTrack || 0) + '/' +
          (selectedPeriod === 'week' ? '7' : selectedPeriod === 'month' ? '30' : '365') }}</div>
      </div>
    </div>

    <!-- Chart Section (with Premium overlay if needed) -->
    <div class="chart-section" :class="{ 'premium-locked': shouldShowPremiumOverlay }">
      <h3 class="section-title">{{ chartTitle }}</h3>

      <!-- Premium Overlay for Charts -->
      <div v-if="shouldShowPremiumOverlay" class="premium-chart-overlay" @click="showPremiumBlocker = true">
        <div class="premium-overlay-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#FFD700">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <h4>{{ $t('premium.analytics.upgradeTitle') }}</h4>
          <p>{{ $t('premium.analytics.upgradeSubtitle') }}</p>
          <button class="upgrade-btn">{{ $t('premium.upgrade.button') }}</button>
        </div>
      </div>

      <CalorieChart v-else :data="getChartData()" :period="selectedPeriod" :goal="2500" />
    </div>

    <!-- Beta Trend Charts Slider (only visible for week, month, year periods) -->
    <div v-if="selectedPeriod !== 'day'" class="trend-charts-slider-section">
      <div class="trend-slider-header">
        <h3 class="section-title">{{ $t('analytics.trendAnalysis') }}</h3>
        <span class="beta-badge">BETA</span>
      </div>

      <div class="trend-charts-container">
        <div class="trend-charts-slider" :style="{ transform: `translateX(-${currentTrendIndex * 100}%)` }">
          <!-- Calories Trend Chart -->
          <div class="trend-chart-item">
            <div class="trend-chart-header">
              <div class="trend-icon calories">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div class="trend-chart-title">
                <h4>{{ $t('analytics.caloriesTrend') }}</h4>
                <span class="trend-period">{{ selectedPeriodLabel }}</span>
              </div>
            </div>
            <div class="trend-chart-wrapper">
              <AppleHealthTrendChart :chart-data="caloriesTrendData" :selected-period="selectedPeriod"
                color="#ff6b35" />
            </div>
          </div>

          <!-- Protein Trend Chart -->
          <div class="trend-chart-item">
            <div class="trend-chart-header">
              <div class="trend-icon protein">
                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                  <path fill="currentColor"
                    d="M224 329.2C224 337.7 220.6 345.8 214.6 351.8L187.8 378.6C175.5 390.9 155.3 390 138.4 385.8C133.8 384.7 128.9 384 123.9 384C90.8 384 63.9 410.9 63.9 444C63.9 477.1 90.8 504 123.9 504C130.2 504 135.9 509.7 135.9 516C135.9 549.1 162.8 576 195.9 576C229 576 255.9 549.1 255.9 516C255.9 511 255.3 506.2 254.1 501.5C249.9 484.6 248.9 464.4 261.3 452.1L288.1 425.3C294.1 419.3 302.2 415.9 310.7 415.9L399.9 415.9C406.2 415.9 412.3 415.6 418.4 414.9C430.3 413.7 434.8 399.4 429.2 388.9C420.7 373.1 415.9 355.1 415.9 335.9C415.9 274 466 223.9 527.9 223.9C535.9 223.9 543.6 224.7 551.1 226.3C562.8 228.8 575.2 220.4 573.1 208.7C558.4 126.4 486.4 63.9 399.9 63.9C302.7 63.9 223.9 142.7 223.9 239.9L223.9 329.1z" />
                </svg>
              </div>
              <div class="trend-chart-title">
                <h4>{{ $t('analytics.proteinTrend') }}</h4>
                <span class="trend-period">{{ selectedPeriodLabel }}</span>
              </div>
            </div>
            <div class="trend-chart-wrapper">
              <AppleHealthTrendChart :chart-data="proteinTrendData" :selected-period="selectedPeriod" color="#ff6b6b" />
            </div>
          </div>

          <!-- Carbs Trend Chart -->
          <div class="trend-chart-item">
            <div class="trend-chart-header">
              <div class="trend-icon carbs">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div class="trend-chart-title">
                <h4>{{ $t('analytics.carbsTrend') }}</h4>
                <span class="trend-period">{{ selectedPeriodLabel }}</span>
              </div>
            </div>
            <div class="trend-chart-wrapper">
              <AppleHealthTrendChart :chart-data="carbsTrendData" :selected-period="selectedPeriod" color="#ffa726" />
            </div>
          </div>

          <!-- Fats Trend Chart -->
          <div class="trend-chart-item">
            <div class="trend-chart-header">
              <div class="trend-icon fats">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div class="trend-chart-title">
                <h4>{{ $t('analytics.fatsTrend') }}</h4>
                <span class="trend-period">{{ selectedPeriodLabel }}</span>
              </div>
            </div>
            <div class="trend-chart-wrapper">
              <AppleHealthTrendChart :chart-data="fatsTrendData" :selected-period="selectedPeriod" color="#42a5f5" />
            </div>
          </div>
        </div>
      </div>

      <!-- Slider Navigation Dots -->
      <div class="trend-slider-dots">
        <button v-for="(chart, index) in trendCharts" :key="index" class="slider-dot"
          :class="{ active: currentTrendIndex === index }" @click="currentTrendIndex = index">
          <span class="sr-only">{{ chart.name }}</span>
        </button>
      </div>
    </div>

    <!-- Macro Breakdown -->
    <div class="macro-breakdown">
      <h3 class="section-title">{{ $t('analytics.macroDistribution') }}</h3>
      <div class="macro-charts">
        <div class="macro-chart">
          <div class="macro-ring">
            <svg width="80" height="80">
              <circle cx="40" cy="40" r="30" stroke="#2a2d37" stroke-width="8" fill="none" />
              <circle cx="40" cy="40" r="30" stroke="#ff6b6b" stroke-width="8" fill="none" stroke-dasharray="188"
                :stroke-dashoffset="188 - (188 * (analyticsData?.macroBreakdown.protein || 0) / 100)"
                stroke-linecap="round" />
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
              <circle cx="40" cy="40" r="30" stroke="#2a2d37" stroke-width="8" fill="none" />
              <circle cx="40" cy="40" r="30" stroke="#ffa726" stroke-width="8" fill="none" stroke-dasharray="188"
                :stroke-dashoffset="188 - (188 * (analyticsData?.macroBreakdown.carbs || 0) / 100)"
                stroke-linecap="round" />
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
              <circle cx="40" cy="40" r="30" stroke="#2a2d37" stroke-width="8" fill="none" />
              <circle cx="40" cy="40" r="30" stroke="#42a5f5" stroke-width="8" fill="none" stroke-dasharray="188"
                :stroke-dashoffset="188 - (188 * (analyticsData?.macroBreakdown.fats || 0) / 100)"
                stroke-linecap="round" />
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
            <span class="goal-progress">{{ analyticsData?.goalProgress.calories.current || 0 }} / {{
              analyticsData?.goalProgress.calories.target || 0 }} {{ $t('analytics.kcal') }}</span>
          </div>
          <div class="goal-bar">
            <div class="goal-fill"
              :style="{ width: Math.min((analyticsData?.goalProgress.calories.percentage || 0), 100) + '%' }"></div>
          </div>
        </div>

        <!-- Weight Goal Progress -->
        <div class="goal-item">
          <div class="goal-info">
            <span class="goal-name">{{ $t('analytics.weightProgress') }}</span>
            <span class="goal-progress">
              {{ $t('common.current') }}: {{ analyticsData?.goalProgress.weight.current || 0 }} {{ $t('analytics.kg') }}
              <span v-if="analyticsData?.goalProgress.weight.change !== null" class="weight-change"
                :class="{ 'positive': (analyticsData?.goalProgress.weight.change || 0) >= 0, 'negative': (analyticsData?.goalProgress.weight.change || 0) < 0 }">
                ({{ (analyticsData?.goalProgress.weight.change || 0) >= 0 ? '+' : '' }}{{
                  Math.round((analyticsData?.goalProgress.weight.change || 0) * 10) / 10 }}{{ $t('analytics.kg') }})
              </span>
            </span>
          </div>
          <div class="goal-bar">
            <div class="goal-fill weight-goal-fill"
              :style="{ width: Math.min((analyticsData?.goalProgress.weight.percentage || 0), 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Debug Charts Section (only visible in debug mode) -->
    <div v-if="showDebugInfo" class="debug-charts-section">
      <h3 class="section-title">
        🐛 Debug Analytics
        <span class="debug-badge">DEV</span>
      </h3>

      <div class="debug-charts-grid">
        <DebugChart title="Performance Metrics" type="performance" />

        <DebugChart title="Storage Analysis" type="storage" />

        <DebugChart title="Usage Pattern" type="usage" />
      </div>
    </div>

    <!-- BMI Section -->
    <div v-if="analyticsData?.bmiData.value" class="bmi-section" @click="navigateToBMIDetail">
      <h3 class="section-title">
        {{ $t('analytics.bmiHealthStatus') }}
      </h3>
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

    <div class="bmi-buttons">
      <button class="info-btn" @click.stop="showBMIInfoModal = true">
        info
      </button>
      <button @click="navigateToBMIDetail" class="detail-btn">
        Details
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      </button>
    </div>
    <!-- Weight Chart Section -->
    <div class="weight-section">
      <h3 class="section-title">{{ $t('analytics.weightProgress') }}</h3>

      <!-- Enhanced Chart -->
      <WeightChart v-if="analyticsData?.goalProgress.weight.target" :data="analyticsData?.weightChartData || []"
        :goal-weight="analyticsData?.goalProgress.weight.target || undefined"
        :current-weight="analyticsData?.goalProgress.weight.current || undefined" />

      <div v-else class="no-weight-data">
        <div class="no-data-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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
            <input v-model="newWeight" type="number" step="0.1" min="30" max="300" class="modal-input"
              :placeholder="$t('analytics.enterCurrentWeight')" />
          </div>
          <div class="weight-input-section">
            <label class="modal-label">{{ $t('analytics.noteOptional') }}</label>
            <input v-model="weightNote" type="text" class="modal-input" :placeholder="$t('analytics.morningWeight')" />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showWeightLogModal = false" class="modal-btn secondary">{{ $t('common.cancel') }}</button>
          <button @click="logWeight" class="modal-btn primary" :disabled="!newWeight">{{ $t('common.save') }}</button>
        </div>
      </div>
    </div>
    <div class="header-buttons">
      <button @click="showWeightLogModal = true" class="log-weight-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        {{ $t('analytics.logWeight') }}
      </button>
      <button @click="navigateToWeightDetail" class="detail-btn">
        Details
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      </button>
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
              <a href="https://www.cdc.gov/bmi/about/?CDC_AAref_Val=https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
                target="_blank" class="external-link">
                {{ $t('analytics.bmiExplanation.cdcLink') }}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <polyline points="15,3 21,3 21,9" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
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

    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { AnalyticsData } from '../utils/analyticsData'
import { WeightTracker } from '../utils/weightTracking'
import { StreakManager } from '../utils/widgetData'
import CalorieChart from '../components/charts/CalorieChart.vue'
import WeightChart from '../components/charts/WeightChart.vue'
import DebugChart from '../components/charts/DebugChart.vue'
import AppleHealthTrendChart from '../components/charts/AppleHealthTrendChart.vue'
import PremiumBlocker from '../components/PremiumBlocker.vue'
import { premiumManager, isPremiumUser, premiumFeatures } from '../utils/premiumManager'
import { analyticsStore, analyticsActions } from '../stores/analyticsStore'
import { isDebugMode, initializeDebugMode } from '../stores/preferencesStore'
import BottomNavigation from '../components/BottomNavigation.vue'

const router = useRouter()
const { t } = useI18n()

// Initialize
const selectedPeriod = ref<'day' | 'week' | 'month' | 'year'>('day')
const analyticsData = computed(() => analyticsStore.data)
const previousAnalyticsData = ref<AnalyticsData | null>(null)
const showPremiumBlocker = ref(false)
const showWeightLogModal = ref(false)
const newWeight = ref<number | null>(null)
const weightNote = ref('')
const showBMIInfoModal = ref(false)
const showDebugInfo = ref(false)
const currentTrendIndex = ref(0)

// Trend charts configuration
const trendCharts = [
  { name: 'Calories', color: '#ff6b35' },
  { name: 'Protein', color: '#ff6b6b' },
  { name: 'Carbs', color: '#ffa726' },
  { name: 'Fats', color: '#42a5f5' }
]

// Premium access check
const shouldShowPremiumOverlay = computed(() => {
  return !isPremiumUser.value && (selectedPeriod.value === 'month' || selectedPeriod.value === 'year')
})

// Premium functions
const checkPremiumAccess = async () => {
  if (selectedPeriod.value !== 'week' && selectedPeriod.value !== 'day') {
    const canAccess = await premiumManager.canAccessFeature(premiumFeatures.UNLIMITED_ANALYTICS_HISTORY)
    if (!canAccess) {
      showPremiumBlocker.value = true
      selectedPeriod.value = 'day'
      return
    }
  }
}

const closePremiumBlocker = () => {
  showPremiumBlocker.value = false
  selectedPeriod.value = 'day'
}

const handleAnalyticsUpgrade = (feature: string) => {
  console.log('Upgrading for analytics feature:', feature)
}

async function loadAnalyticsData() {
  try {
    await analyticsActions.loadAnalyticsData(selectedPeriod.value as 'day' | 'week' | 'month' | 'year')
  } catch (error) {
    console.error('Error loading analytics data:', error)
  }
}

// Refresh analytics data (force reload) - can be used for pull-to-refresh functionality
// async function refreshAnalyticsData() {
//     try {
//         // Store previous data for comparison before loading new data
//         if (analyticsStore.data) {
//             previousAnalyticsData.value = { ...analyticsStore.data }
//         }
//         
//         // Force refresh from store
//         await analyticsActions.refreshAnalyticsData(selectedPeriod.value as 'week' | 'month' | 'year')
//     } catch (error) {
//         console.error('Error refreshing analytics data:', error)
//     }
// }

watch(selectedPeriod, () => {
  loadAnalyticsData()
})

watch(isDebugMode, (newValue) => {
  console.log('Analytics: Debug mode changed to:', newValue)
  showDebugInfo.value = newValue
}, { immediate: true })

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

const chartTitle = computed(() => {
  switch (selectedPeriod.value) {
    case 'day':
      return t('analytics.dailyProgress')
    case 'week':
      return t('analytics.weeklyProgress')
    case 'month':
      return t('analytics.monthlyProgress')
    case 'year':
      return t('analytics.yearlyProgress')
    default:
      return t('analytics.dailyProgress')
  }
})

const selectedPeriodLabel = computed(() => {
  switch (selectedPeriod.value) {
    case 'week':
      return t('analytics.thisWeek')
    case 'month':
      return t('analytics.thisMonth')
    case 'year':
      return t('analytics.thisYear')
    default:
      return t('analytics.today')
  }
})

const caloriesTrendData = computed(() => {
  if (!analyticsData.value?.weeklyData) return []
  return analyticsData.value.weeklyData.map(item => ({
    date: item.day,
    calories: item.calories
  }))
})

const proteinTrendData = computed(() => {
  if (!analyticsData.value?.weeklyData) return []
  return analyticsData.value.weeklyData.map(item => ({
    date: item.day,
    calories: item.protein
  }))
})

const carbsTrendData = computed(() => {
  if (!analyticsData.value?.weeklyData) return []
  return analyticsData.value.weeklyData.map(item => ({
    date: item.day,
    calories: item.carbs
  }))
})

const fatsTrendData = computed(() => {
  if (!analyticsData.value?.weeklyData) return []
  return analyticsData.value.weeklyData.map(item => ({
    date: item.day,
    calories: item.fats
  }))
})

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

onMounted(async () => {
  await loadAnalyticsData()
  await loadStreakData()

  await initializeDebugMode()
  showDebugInfo.value = isDebugMode.value
  console.log('Analytics mounted - Debug mode:', isDebugMode.value, 'showDebugInfo:', showDebugInfo.value)
})

function getBMIPosition(bmi: number | null): number {
  if (!bmi) return 0
  const minBMI = 15
  const maxBMI = 35
  const position = ((bmi - minBMI) / (maxBMI - minBMI)) * 100
  return Math.max(0, Math.min(100, position))
}

function getQuarterlyData(weeklyData: { day: string; calories: number }[]) {
  if (selectedPeriod.value !== 'year' || !weeklyData.length) return []

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
    // Check if touch started within trend charts area
    const target = event.target as HTMLElement
    const trendChartElement = target.closest('.trend-charts-slider-section')

    if (trendChartElement && selectedPeriod.value !== 'day') {
      // Handle trend chart swiping
      if (deltaX > swipeThreshold && currentTrendIndex.value > 0) {
        // Swipe right - go to previous chart
        currentTrendIndex.value--
        return
      }
      if (deltaX < -swipeThreshold && currentTrendIndex.value < trendCharts.length - 1) {
        // Swipe left - go to next chart
        currentTrendIndex.value++
        return
      }
    }

    // Default navigation behavior if not in trend charts area
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
  height: calc(100vh - max(44px, env(safe-area-inset-top, 44px)));
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
  background-size: 100% 100vh;
  background-position: bottom;
  color: white;
  padding: 0 16px 16px 16px;
  margin-top: max(44px, env(safe-area-inset-top, 44px));
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
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 0 0 0 16px;
  width: 50%;
  color: white;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-btn:hover {
  background: rgba(255, 255, 255, 0.15);
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

.bmi-buttons {
  margin-bottom: 32px;
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.bmi-section {
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
  border-radius: 16px 16px 0 0;
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

/*.weight-section {
  margin-bottom: 32px;
}*/

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

  0%,
  100% {
    opacity: 0.6;
  }

  50% {
    opacity: 0.8;
  }
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
  border-radius: 16px 16px 0 0;
  padding: 6px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 0;
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

.header-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.detail-btn {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 0 0 16px 0;
  color: white;
  padding: 8px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 50%;
  height: 32px;
}

.detail-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.log-weight-btn {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 0 0 0 16px;
  width: 50%;
  color: white;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
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
  stroke-dasharray: 5, 5;
  opacity: 0.7;
}

.weight-point {
  fill: #42a5f5;
  stroke: white;
  stroke-width: 2;
  cursor: pointer;
  transition: all 0.2s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
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

/* Debug Charts Styles */
.debug-charts-section {
  margin-bottom: 32px;
  border: 2px dashed rgba(255, 193, 7, 0.3);
  border-radius: 16px;
  padding: 20px;
  background: rgba(255, 193, 7, 0.05);
}

.debug-charts-section .section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #FFC107;
}

.debug-badge {
  background: linear-gradient(135deg, #ff6b6b, #ffa726);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.debug-charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .debug-charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .debug-charts-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Trend Charts Slider Styles */
.trend-charts-slider-section {
  margin-bottom: 32px;
}

.trend-slider-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 0 4px;
}

.trend-slider-header .section-title {
  margin: 0;
}

.beta-badge {
  background: rgba(255, 167, 38, 0.2);
  color: #ffa726;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.trend-charts-container {
  overflow: hidden;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  touch-action: pan-x;
  /* Enable horizontal swipe gestures */
}

.trend-charts-slider {
  display: flex;
  transition: transform 0.3s ease-in-out;
  will-change: transform;
  /* Optimize for smooth transitions */
}

.trend-chart-item {
  min-width: 100%;
  padding: 16px;
  box-sizing: border-box;
}

.trend-chart-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.trend-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.trend-icon.calories {
  background: rgba(255, 107, 53, 0.2);
  color: #ff6b35;
}

.trend-icon.protein {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.trend-icon.carbs {
  background: rgba(255, 167, 38, 0.2);
  color: #ffa726;
}

.trend-icon.fats {
  background: rgba(66, 165, 245, 0.2);
  color: #42a5f5;
}

.trend-chart-title {
  flex: 1;
}

.trend-chart-title h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: white;
}

.trend-period {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.trend-chart-wrapper {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 8px;
  backdrop-filter: blur(5px);
  min-height: 280px;
  /* Ensure consistent height */
}

.trend-slider-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding: 0 20px;
}

.slider-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
  /* Optimize for touch */
}

.slider-dot.active {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.slider-dot:hover {
  background: rgba(255, 255, 255, 0.6);
}

/* Responsive improvements */
@media (min-width: 768px) {
  .trend-chart-item {
    padding: 24px;
  }

  .trend-icon {
    width: 40px;
    height: 40px;
  }

  .trend-chart-title h4 {
    font-size: 18px;
  }

  .trend-period {
    font-size: 14px;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
