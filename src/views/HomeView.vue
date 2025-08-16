<template>
  <div class="home-view">
    <!-- Header -->
    <header class="header">
      <div class="logo-section">
        <span class="logo">🍎</span>
        <h1 class="app-title">Cal AI</h1>
      </div>
      <div class="streak">
        <span class="fire-icon">🔥</span>
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
        <svg class="progress-svg" width="120" height="120">
          <circle 
            cx="60" 
            cy="60" 
            r="50" 
            stroke="#2a2d37" 
            stroke-width="8" 
            fill="none"
          />
          <circle 
            cx="60" 
            cy="60" 
            r="50" 
            stroke="white" 
            stroke-width="8" 
            fill="none"
            stroke-dasharray="314"
            :stroke-dashoffset="314 - (314 * caloriesProgress)"
            stroke-linecap="round"
            class="progress-circle"
          />
        </svg>
        <div class="flame-icon">🔥</div>
      </div>
    </div>

    <!-- Macros Grid -->
    <div class="macros-grid">
      <div class="macro-card protein">
        <div class="macro-amount">{{ proteinLeft }}g</div>
        <div class="macro-label">Protein over</div>
        <div class="macro-progress">
          <svg width="80" height="80">
            <circle cx="40" cy="40" r="30" stroke="#2a2d37" stroke-width="6" fill="none"/>
            <circle 
              cx="40" 
              cy="40" 
              r="30" 
              stroke="#ff6b6b" 
              stroke-width="6" 
              fill="none"
              stroke-dasharray="188"
              :stroke-dashoffset="188 - (188 * proteinProgress)"
              stroke-linecap="round"
            />
          </svg>
          <div class="macro-icon">⚡</div>
        </div>
      </div>

      <div class="macro-card carbs">
        <div class="macro-amount">{{ carbsLeft }}g</div>
        <div class="macro-label">Carbs left</div>
        <div class="macro-progress">
          <svg width="80" height="80">
            <circle cx="40" cy="40" r="30" stroke="#2a2d37" stroke-width="6" fill="none"/>
            <circle 
              cx="40" 
              cy="40" 
              r="30" 
              stroke="#ffa726" 
              stroke-width="6" 
              fill="none"
              stroke-dasharray="188"
              :stroke-dashoffset="188 - (188 * carbsProgress)"
              stroke-linecap="round"
            />
          </svg>
          <div class="macro-icon">🌾</div>
        </div>
      </div>

      <div class="macro-card fats">
        <div class="macro-amount">{{ fatsLeft }}g</div>
        <div class="macro-label">Fats left</div>
        <div class="macro-progress">
          <svg width="80" height="80">
            <circle cx="40" cy="40" r="30" stroke="#2a2d37" stroke-width="6" fill="none"/>
            <circle 
              cx="40" 
              cy="40" 
              r="30" 
              stroke="#42a5f5" 
              stroke-width="6" 
              fill="none"
              stroke-dasharray="188"
              :stroke-dashoffset="188 - (188 * fatsProgress)"
              stroke-linecap="round"
            />
          </svg>
          <div class="macro-icon">💧</div>
        </div>
      </div>
    </div>

    <!-- Recently Uploaded Section -->
    <div class="recent-section">
      <h3 class="section-title">Recently uploaded</h3>
      
      <div class="food-item" v-for="item in recentFoods" :key="item.id">
        <div class="food-image">
          <img :src="item.image" :alt="item.name" />
        </div>
        <div class="food-info">
          <h4 class="food-name">{{ item.name }}</h4>
          <div class="food-calories">
            <span class="fire-icon">🔥</span>
            <span>{{ item.calories }} kcal</span>
          </div>
          <div class="food-macros">
            <span class="macro-item protein-color">⚡ {{ item.protein }}g</span>
            <span class="macro-item carbs-color">🌾 {{ item.carbs }}g</span>
            <span class="macro-item fats-color">💧 {{ item.fats }}g</span>
          </div>
        </div>
        <div class="food-time">{{ item.time }}</div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <router-link to="/" class="nav-item active">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">Home</span>
      </router-link>
      <div class="nav-item">
        <span class="nav-icon">📊</span>
        <span class="nav-label">Analytics</span>
      </div>
      <div class="nav-item">
        <span class="nav-icon">⚙️</span>
        <span class="nav-label">Settings</span>
      </div>
    </nav>

    <!-- Add Button -->
    <router-link to="/scan" class="add-button">
      <span>+</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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

// Sample recent foods data
const recentFoods = ref([
  {
    id: 1,
    name: 'Apple Salmon salad...',
    calories: 500,
    protein: 78,
    carbs: 78,
    fats: 78,
    time: '9:00am',
    image: '/api/placeholder/60/60'
  },
  {
    id: 2,
    name: 'Apple Salmon salad...',
    calories: 500,
    protein: 78,
    carbs: 78,
    fats: 78,
    time: '9:00am',
    image: '/api/placeholder/60/60'
  }
])
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
  color: white;
  padding: 20px;
  padding-bottom: 100px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  font-size: 24px;
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
  gap: 10px;
  margin-bottom: 30px;
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
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
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
}

.progress-svg {
  transform: rotate(-90deg);
}

.progress-circle {
  transition: stroke-dashoffset 0.5s ease-in-out;
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
  gap: 15px;
  margin-bottom: 40px;
}

.macro-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(10px);
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
}

.macro-progress svg {
  transform: rotate(-90deg);
}

.macro-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
}

.recent-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
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
  padding: 15px 0 25px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: white;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.nav-item.active {
  opacity: 1;
}

.nav-icon {
  font-size: 20px;
}

.nav-label {
  font-size: 11px;
}

.add-button {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #1e1e2e;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.add-button:hover {
  transform: scale(1.1);
}
</style>
