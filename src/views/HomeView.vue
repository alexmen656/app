<template>
  <div class="home-view">
    <!-- Header -->
    <header class="header">
      <div class="logo-section">
        <svg class="logo" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <h1 class="app-title">Cal AI</h1>
      </div>
      <div class="streak">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff6b35">
          <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
        </svg>
        <span class="streak-count">15</span>
      </div>
    </header>

    <!-- Today/Yesterday Toggle -->
    <div class="date-toggle">
      <button class="date-btn active">Today</button>
      <button class="date-btn">Yesterday</button>
    </div>

    <!-- Main Calories Card -->
    <div class="main-card">
      <div class="calories-section">
        <h2 class="calories-number">{{ caloriesLeft }}</h2>
        <p class="calories-label">Calories left</p>
      </div>
      <div class="progress-ring">
        <svg class="progress-svg" width="100" height="100" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            stroke="#2a2d37" 
            stroke-width="6" 
            fill="none"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            stroke="white" 
            stroke-width="6" 
            fill="none"
            stroke-dasharray="251.2"
            :stroke-dashoffset="251.2 - (251.2 * caloriesProgress)"
            stroke-linecap="round"
            class="progress-circle"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div class="flame-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Macros Grid -->
    <div class="macros-grid">
      <div class="macro-card protein">
        <div class="macro-amount">{{ proteinLeft }}g</div>
        <div class="macro-label">Protein over</div>
        <div class="macro-progress">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="24" stroke="#2a2d37" stroke-width="4" fill="none"/>
            <circle 
              cx="30" 
              cy="30" 
              r="24" 
              stroke="#ff6b6b" 
              stroke-width="4" 
              fill="none"
              stroke-dasharray="150.8"
              :stroke-dashoffset="150.8 - (150.8 * proteinProgress)"
              stroke-linecap="round"
              transform="rotate(-90 30 30)"
            />
          </svg>
          <div class="macro-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff6b6b">
              <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="macro-card carbs">
        <div class="macro-amount">{{ carbsLeft }}g</div>
        <div class="macro-label">Carbs left</div>
        <div class="macro-progress">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="24" stroke="#2a2d37" stroke-width="4" fill="none"/>
            <circle 
              cx="30" 
              cy="30" 
              r="24" 
              stroke="#ffa726" 
              stroke-width="4" 
              fill="none"
              stroke-dasharray="150.8"
              :stroke-dashoffset="150.8 - (150.8 * carbsProgress)"
              stroke-linecap="round"
              transform="rotate(-90 30 30)"
            />
          </svg>
          <div class="macro-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffa726">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="macro-card fats">
        <div class="macro-amount">{{ fatsLeft }}g</div>
        <div class="macro-label">Fats left</div>
        <div class="macro-progress">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="24" stroke="#2a2d37" stroke-width="4" fill="none"/>
            <circle 
              cx="30" 
              cy="30" 
              r="24" 
              stroke="#42a5f5" 
              stroke-width="4" 
              fill="none"
              stroke-dasharray="150.8"
              :stroke-dashoffset="150.8 - (150.8 * fatsProgress)"
              stroke-linecap="round"
              transform="rotate(-90 30 30)"
            />
          </svg>
          <div class="macro-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#42a5f5">
              <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 2c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Recently Uploaded Section -->
    <div class="recent-section">
      <h3 class="section-title">Recently uploaded</h3>
      
      <div v-if="recentFoods.length === 0" class="empty-state">
        <div class="empty-icon">📱</div>
        <p>Noch keine Scans vorhanden</p>
        <p class="empty-subtitle">Nutzen Sie den Scan-Button um Ihr erstes Essen zu scannen!</p>
      </div>
      
      <div v-else class="food-item" v-for="item in recentFoods" :key="item.id">
        <div class="food-image">
          <img v-if="item.image && !item.image.includes('placeholder')" :src="item.image" :alt="item.name" />
          <span v-else>{{ item.type === 'food' ? '🍽️' : '📦' }}</span>
        </div>
        <div class="food-info">
          <h4 class="food-name">{{ item.name }}</h4>
          <div class="food-calories">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff6b35">
              <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
            </svg>
            <span>{{ item.calories }} kcal</span>
          </div>
          <div class="food-macros">
            <span class="macro-item protein-color">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
              </svg>
              {{ item.protein }}g
            </span>
            <span class="macro-item carbs-color">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 12.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S6.83 14 6 14s-1.5-.67-1.5-1.5zm.5-2h2c.55 0 1-.45 1-1V8.5c0-.83-.67-1.5-1.5-1.5S5.5 7.67 5.5 8.5V9.5c0 .55-.45 1-1 1z"/>
              </svg>
              {{ item.carbs }}g
            </span>
            <span class="macro-item fats-color">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c1.1 0 2 .9 2 2 0 .74-.4 1.38-1 1.72v2.56l7 7V17c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-1.72l7-7V5.72c-.6-.34-1-.98-1-1.72 0-1.1.9-2 2-2z"/>
              </svg>
              {{ item.fats }}g
            </span>
          </div>
        </div>
        <div class="food-time">{{ item.time }}</div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <router-link to="/" class="nav-item active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span class="nav-label">Home</span>
      </router-link>
      <router-link to="/analytics" class="nav-item">
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

    <!-- Add Button -->
    <router-link to="/scan" class="add-button">
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Type definitions
interface ScanData {
  id: number
  type: 'food' | 'barcode'
  timestamp: string
  time: string
  image?: string
  data: any
}

interface FoodItem {
  id: number
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  time: string
  image: string
  type: string
}

// Daily targets
const dailyCalories = 3000
const dailyProtein = 150
const dailyCarbs = 300
const dailyFats = 100

// Consumed amounts
const consumedCalories = ref(500)
const consumedProtein = ref(105)
const consumedCarbs = ref(211)
const consumedFats = ref(52)

// Scan history from localStorage
const scanHistory = ref<ScanData[]>([])

// Load scan history from localStorage
function loadScanHistory() {
  try {
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]') as ScanData[]
    scanHistory.value = history.slice(0, 10) // Show only last 10 items
  } catch (error) {
    console.error('Error loading scan history:', error)
    scanHistory.value = []
  }
}

// Convert scan history to food items format
const recentFoods = computed((): FoodItem[] => {
  return scanHistory.value.map((scan: ScanData): FoodItem | null => {
    if (scan.type === 'food') {
      // For food scans, use total nutrition data
      const total = scan.data.total
      const firstFood = scan.data.foods?.[0]
      return {
        id: scan.id,
        name: firstFood?.name || 'Gescanntes Essen',
        calories: total.calories || 0,
        protein: total.protein || 0,
        carbs: total.carbs || 0,
        fats: total.fat || 0,
        time: scan.time,
        image: scan.image || '/api/placeholder/60/60',
        type: 'food'
      }
    } else if (scan.type === 'barcode') {
      // For barcode scans, use product data
      const nutriments = scan.data.nutriments || {}
      return {
        id: scan.id,
        name: scan.data.product_name || 'Unbekanntes Produkt',
        calories: Math.round(nutriments.energy_kcal_100g || 0),
        protein: Math.round(nutriments.proteins_100g || 0),
        carbs: Math.round(nutriments.carbohydrates_100g || 0),
        fats: Math.round(nutriments.fat_100g || 0),
        time: scan.time,
        image: '/api/placeholder/60/60',
        type: 'barcode'
      }
    }
    return null
  }).filter((item): item is FoodItem => item !== null)
})

// Calculated remaining amounts
const caloriesLeft = computed(() => dailyCalories - consumedCalories.value)
const proteinLeft = computed(() => consumedProtein.value - dailyProtein)
const carbsLeft = computed(() => dailyCarbs - consumedCarbs.value)
const fatsLeft = computed(() => dailyFats - consumedFats.value)

// Progress calculations (0 to 1)
const caloriesProgress = computed(() => consumedCalories.value / dailyCalories)
const proteinProgress = computed(() => consumedProtein.value / dailyProtein)
const carbsProgress = computed(() => consumedCarbs.value / dailyCarbs)
const fatsProgress = computed(() => consumedFats.value / dailyFats)

// Load scan history when component mounts
onMounted(() => {
  loadScanHistory()
  
  // Listen for storage changes to update in real-time
  window.addEventListener('storage', loadScanHistory)
  
  // Also listen for focus events to refresh when returning to app
  window.addEventListener('focus', loadScanHistory)
})
</script>

<style scoped>
.home-view {
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height for mobile */
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
  color: white;
  padding: 16px;
  padding-top: max(44px, env(safe-area-inset-top, 44px));
  padding-bottom: max(80px, calc(80px + env(safe-area-inset-bottom, 0px)));
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
  /* Prevent text selection */
  -webkit-user-select: none;
  user-select: none;
  /* Prevent touch callouts */
  -webkit-touch-callout: none;
  /* Prevent tap highlights */
  -webkit-tap-highlight-color: transparent;
  /* Prevent zoom on double tap */
  touch-action: manipulation;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  height: 44px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 24px;
  height: 24px;
}

.app-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.streak {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 20px;
}

.date-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  height: 32px;
}

.date-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 8px 0;
  font-size: 16px;
  cursor: pointer;
  position: relative;
}

.date-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: white;
  border-radius: 1px;
}

.main-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  height: 140px;
}

.calories-number {
  font-size: 48px;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.calories-label {
  font-size: 16px;
  opacity: 0.8;
  margin: 5px 0 0 0;
}

.progress-ring {
  position: relative;
  width: 100px;
  height: 100px;
}

.progress-circle {
  transition: stroke-dashoffset 0.8s ease-in-out;
}

.flame-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
}

.macros-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}

.macro-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 16px;
  text-align: center;
  backdrop-filter: blur(10px);
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.macro-amount {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
}

.macro-label {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 15px;
}

.macro-progress {
  position: relative;
  display: flex;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin: 0 auto;
}

.macro-progress svg {
  width: 60px;
  height: 60px;
}

.macro-progress svg circle:last-child {
  transition: stroke-dashoffset 0.8s ease-in-out;
}

.macro-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  pointer-events: none;
  z-index: 1;
}

.recent-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin-bottom: 8px;
}

.empty-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px !important;
  margin-bottom: 0 !important;
}

.food-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 15px;
  backdrop-filter: blur(10px);
}

.food-image {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  overflow: hidden;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.food-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.food-info {
  flex: 1;
}

.food-name {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.food-calories {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
  font-size: 14px;
}

.food-macros {
  display: flex;
  gap: 10px;
  font-size: 12px;
}

.macro-item {
  display: flex;
  align-items: center;
  gap: 2px;
}

.protein-color { color: #ff6b6b; }
.carbs-color { color: #ffa726; }
.fats-color { color: #42a5f5; }

.food-time {
  font-size: 14px;
  opacity: 0.6;
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

.add-button {
  position: fixed;
  bottom: 90px;
  right: 16px;
  width: 56px;
  height: 56px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e1e2e;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.add-button:hover {
  transform: scale(1.1);
}
</style>
