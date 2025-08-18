<template>
  <div class="analytics-view"
       @touchstart="handleTouchStart"
       @touchmove="handleTouchMove"
       @touchend="handleTouchEnd">
    <!-- Header -->
    <header class="header">
      <h1 class="title">Analytics</h1>
      <div class="date-picker">
        <select v-model="selectedPeriod" class="period-select">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
    </header>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-header">
          <h3>Avg Daily Calories</h3>
          <span class="trend up">+5%</span>
        </div>
        <div class="card-value">{{ analyticsData?.avgCalories || 0 }}</div>
      </div>
      
      <div class="summary-card">
        <div class="card-header">
          <h3>Days on Track</h3>
          <span class="trend up">+2</span>
        </div>
        <div class="card-value">{{ analyticsData?.daysOnTrack || 0 }}/7</div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="chart-section">
      <h3 class="section-title">Weekly Progress</h3>
      <div class="chart-container">
        <div class="chart">
          <div class="chart-bars">
            <div 
              v-for="(day, index) in (analyticsData?.weeklyData || [])" 
              :key="index"
              class="chart-bar"
              :style="{ height: (day.calories / 3000) * 100 + '%' }"
            >
              <div class="bar-value">{{ day.calories }}</div>
            </div>
          </div>
          <div class="chart-labels">
            <span v-for="day in (analyticsData?.weeklyData || [])" :key="day.day">{{ day.day }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Macro Breakdown -->
    <div class="macro-breakdown">
      <h3 class="section-title">Macro Distribution</h3>
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
                stroke-dashoffset="50"
                stroke-linecap="round"
              />
            </svg>
            <div class="macro-center">
              <span class="macro-percentage">{{ analyticsData?.macroBreakdown.protein || 0 }}%</span>
            </div>
          </div>
          <span class="macro-label">Protein</span>
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
                stroke-dashoffset="75"
                stroke-linecap="round"
              />
            </svg>
            <div class="macro-center">
              <span class="macro-percentage">{{ analyticsData?.macroBreakdown.carbs || 0 }}%</span>
            </div>
          </div>
          <span class="macro-label">Carbs</span>
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
                stroke-dashoffset="141"
                stroke-linecap="round"
              />
            </svg>
            <div class="macro-center">
              <span class="macro-percentage">{{ analyticsData?.macroBreakdown.fats || 0 }}%</span>
            </div>
          </div>
          <span class="macro-label">Fats</span>
        </div>
      </div>
    </div>

    <!-- Goals Section -->
    <div class="goals-section">
      <h3 class="section-title">Goal Progress</h3>
      <div class="goal-items">
        <div class="goal-item">
          <div class="goal-info">
            <span class="goal-name">Daily Calorie Goal</span>
            <span class="goal-progress">{{ analyticsData?.goalProgress.calories.current || 0 }} / {{ analyticsData?.goalProgress.calories.target || 0 }} kcal</span>
          </div>
          <div class="goal-bar">
            <div class="goal-fill" :style="{ width: Math.min((analyticsData?.goalProgress.calories.percentage || 0), 100) + '%' }"></div>
          </div>
        </div>

        <div class="goal-item">
          <div class="goal-info">
            <span class="goal-name">Weekly Exercise</span>
            <span class="goal-progress">{{ analyticsData?.goalProgress.exercise.current || 0 }} / {{ analyticsData?.goalProgress.exercise.target || 0 }} days</span>
          </div>
          <div class="goal-bar">
            <div class="goal-fill" :style="{ width: Math.min((analyticsData?.goalProgress.exercise.percentage || 0), 100) + '%' }"></div>
          </div>
        </div>

        <div class="goal-item">
          <div class="goal-info">
            <span class="goal-name">Water Intake</span>
            <span class="goal-progress">{{ analyticsData?.goalProgress.water.current || 0 }} / {{ analyticsData?.goalProgress.water.target || 0 }} L</span>
          </div>
          <div class="goal-bar">
            <div class="goal-fill" :style="{ width: Math.min((analyticsData?.goalProgress.water.percentage || 0), 100) + '%' }"></div>
          </div>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AnalyticsManager, type AnalyticsData } from '../utils/analyticsData'

const router = useRouter()

const selectedPeriod = ref('week')
const analyticsData = ref<AnalyticsData | null>(null)
const loading = ref(true)

// Load analytics data
async function loadAnalyticsData() {
    try {
        loading.value = true
        analyticsData.value = await AnalyticsManager.getAnalyticsData()
    } catch (error) {
        console.error('Error loading analytics data:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadAnalyticsData()
})

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
}

.chart-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
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
}

.bar-value {
  position: absolute;
  top: -20px;
  font-size: 10px;
  font-weight: 600;
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
</style>
