<template>
    <div class="yesterday-view"
         @touchstart="handleTouchStart"
         @touchmove="handleTouchMove"
         @touchend="handleTouchEnd">
        <!-- Header -->
        <header class="header">
            <div class="logo-section">
                <h1 class="app-title"><span style="color: #007052;">Kal</span>oriq</h1>
            </div>
            <div class="streak">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff6b35">
                    <path
                        d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
                </svg>
                <span class="streak-count">{{ currentStreak }}</span>
            </div>
        </header>

        <!-- Today/Yesterday Toggle -->
        <div class="date-toggle">
            <router-link to="/" class="date-btn">{{ $t('app.today') }}</router-link>
            <button class="date-btn active">{{ $t('app.yesterday') }}</button>
        </div>

        <!-- Main Calories Card -->
        <div class="main-card">
            <div class="calories-section">
                <h2 class="calories-number">{{ yesterdayCaloriesLeft }}</h2>
                <p class="calories-label">{{ $t('yesterday.caloriesConsumed') }}</p>
            </div>
            <div class="progress-ring">
                <svg class="progress-svg" width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#2a2d37" stroke-width="6" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke="white" stroke-width="6" fill="none" stroke-dasharray="251.2"
                        :stroke-dashoffset="251.2 - (251.2 * yesterdayCaloriesProgress)" stroke-linecap="round"
                        class="progress-circle" transform="rotate(-90 50 50)" />
                </svg>
                <div class="flame-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path
                            d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Macros Grid -->
        <div class="macros-grid">
            <div class="macro-card protein">
                <div class="macro-amount">{{ yesterdayProtein }}g</div>
                <div class="macro-label">{{ $t('nutrition.protein') }}</div>
                <div class="macro-progress">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        <!-- Background circle -->
                        <circle cx="30" cy="30" r="24" stroke="#2a2d37" stroke-width="5" fill="none" />
                        <!-- Progress circle -->
                        <circle cx="30" cy="30" r="24" stroke="#ff6b6b" stroke-width="5" fill="none"
                            stroke-dasharray="150.8" :stroke-dashoffset="calculateMacroOffset(yesterdayProteinProgress, 150.8)"
                            stroke-linecap="round" transform="rotate(-90 30 30)" class="progress-circle" />
                    </svg>
                    <div class="macro-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path fill="#ff6b6b"
                                d="M224 329.2C224 337.7 220.6 345.8 214.6 351.8L187.8 378.6C175.5 390.9 155.3 390 138.4 385.8C133.8 384.7 128.9 384 123.9 384C90.8 384 63.9 410.9 63.9 444C63.9 477.1 90.8 504 123.9 504C130.2 504 135.9 509.7 135.9 516C135.9 549.1 162.8 576 195.9 576C229 576 255.9 549.1 255.9 516C255.9 511 255.3 506.2 254.1 501.5C249.9 484.6 248.9 464.4 261.3 452.1L288.1 425.3C294.1 419.3 302.2 415.9 310.7 415.9L399.9 415.9C406.2 415.9 412.3 415.6 418.4 414.9C430.3 413.7 434.8 399.4 429.2 388.9C420.7 373.1 415.9 355.1 415.9 335.9C415.9 274 466 223.9 527.9 223.9C535.9 223.9 543.6 224.7 551.1 226.3C562.8 228.8 575.2 220.4 573.1 208.7C558.4 126.4 486.4 63.9 399.9 63.9C302.7 63.9 223.9 142.7 223.9 239.9L223.9 329.1z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="macro-card carbs">
                <div class="macro-amount">{{ yesterdayCarbs }}g</div>
                <div class="macro-label">{{ $t('nutrition.carbs') }}</div>
                <div class="macro-progress">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        <!-- Background circle -->
                        <circle cx="30" cy="30" r="24" stroke="#2a2d37" stroke-width="5" fill="none" />
                        <!-- Progress circle -->
                        <circle cx="30" cy="30" r="24" stroke="#ffa726" stroke-width="5" fill="none"
                            stroke-dasharray="150.8" :stroke-dashoffset="calculateMacroOffset(yesterdayCarbsProgress, 150.8)"
                            stroke-linecap="round" transform="rotate(-90 30 30)" class="progress-circle" />
                    </svg>
                    <div class="macro-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            <path fill="#ffa726"
                                d="M79.7 234.6c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0L134.1 444.3 49.4 529c-9.4 9.4-24.5 9.4-33.9 0-9.4-9.4-9.4-24.6 0-33.9l84.7-84.7-30.5-30.5c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zm104-104c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zM495.2 15c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.2L529.2 49 414.7 163.4c7.7 1 15.2 3 22.5 5.9L495.5 111c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-52.7 52.7 39 39c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1c6.2-4.1 14.7-3.4 20.1 2.1l39 39 52.7-52.7c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-58.3 58.3c2.8 7.1 4.7 14.5 5.7 22.1L495.2 15z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="macro-card fats">
                <div class="macro-amount">{{ yesterdayFats }}g</div>
                <div class="macro-label">{{ $t('nutrition.fats') }}</div>
                <div class="macro-progress">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        <!-- Background circle -->
                        <circle cx="30" cy="30" r="24" stroke="#2a2d37" stroke-width="5" fill="none" />
                        <!-- Progress circle -->
                        <circle cx="30" cy="30" r="24" stroke="#42a5f5" stroke-width="5" fill="none"
                            stroke-dasharray="150.8" :stroke-dashoffset="calculateMacroOffset(yesterdayFatsProgress, 150.8)"
                            stroke-linecap="round" transform="rotate(-90 30 30)" class="progress-circle" />
                    </svg>
                    <div class="macro-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path fill="#42a5f5"
                                d="M240 64C240 46.3 254.3 32 272 32L368 32C385.7 32 400 46.3 400 64C400 81.7 385.7 96 368 96L368 199.3C432.9 219.7 480 280.3 480 352L480 544C480 579.3 451.3 608 416 608L224 608C188.7 608 160 579.3 160 544L160 352C160 280.4 207.1 219.7 272 199.3L272 96C254.3 96 240 81.7 240 64zM320 480C355.3 480 384 447.6 384 416C384 394.8 355.1 351.5 336.1 325.4C328 314.3 311.9 314.3 303.8 325.4C284.8 351.5 255.9 394.8 255.9 416C255.9 447.6 284.6 480 319.9 480z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Yesterday's Food Section -->
        <div class="recent-section">
            <h3 class="section-title">{{ $t('yesterday.title') }}</h3>

            <div v-if="yesterdayFoods.length === 0" class="empty-state">
                <div class="empty-icon">📅</div>
                <p>{{ $t('yesterday.emptyMessage') }}</p>
                <p class="empty-subtitle">{{ $t('yesterday.emptySubtitle') }}</p>
            </div>

            <div v-else class="food-item" v-for="item in yesterdayFoods" :key="item.id">
                <div class="food-image">
                    <img v-if="item.image && !item.image.includes('placeholder')" :src="item.image" :alt="item.name" />
                    <span v-else>{{ item.type === 'food' ? '🍽️' : '📦' }}</span>
                </div>
                <div class="food-info">
                    <h4 class="food-name">{{ item.name }}</h4>
                    <div class="food-calories">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff6b35">
                            <path
                                d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
                        </svg>
                        <span>{{ item.calories }} kcal</span>
                    </div>
                    <div class="food-macros">
                        <span class="macro-item protein-color">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z" />
                            </svg>
                            {{ item.protein }}g
                        </span>
                        <span class="macro-item carbs-color">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M4.5 12.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S6.83 14 6 14s-1.5-.67-1.5-1.5zm.5-2h2c.55 0 1-.45 1-1V8.5c0-.83-.67-1.5-1.5-1.5S5.5 7.67 5.5 8.5V9.5c0 .55-.45 1-1 1z" />
                            </svg>
                            {{ item.carbs }}g
                        </span>
                        <span class="macro-item fats-color">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M12 2c1.1 0 2 .9 2 2 0 .74-.4 1.38-1 1.72v2.56l7 7V17c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-1.72l7-7V5.72c-.6-.34-1-.98-1-1.72 0-1.1.9-2 2-2z" />
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
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                <span class="nav-label">{{ $t('app.home') }}</span>
            </router-link>
            <router-link to="/analytics" class="nav-item">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                </svg>
                <span class="nav-label">{{ $t('app.analytics') }}</span>
            </router-link>
            <router-link to="/settings" class="nav-item">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                </svg>
                <span class="nav-label">{{ $t('app.settings') }}</span>
            </router-link>
        </nav>

        <!-- Add Button -->
        <router-link to="/scan" class="add-button">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
//import { useI18n } from 'vue-i18n'
import { dailyGoals } from '../stores/userStore'
import { AnalyticsManager, type DayData } from '../utils/analyticsData'
import { StreakManager } from '../utils/widgetData'

const router = useRouter()
//const { t } = useI18n()

// Type definitions
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

// State
const yesterdayData = ref<DayData | null>(null)
const currentStreak = ref<number>(0)
const loading = ref(true)

// Daily targets from store
const dailyCalories = computed(() => dailyGoals.calories)
const dailyProtein = computed(() => dailyGoals.protein)
const dailyCarbs = computed(() => dailyGoals.carbs)
const dailyFats = computed(() => dailyGoals.fats)

// Load yesterday's data
async function loadYesterdayData() {
    try {
        loading.value = true
        yesterdayData.value = await AnalyticsManager.getYesterdayData()
        currentStreak.value = await StreakManager.getCurrentStreak()
    } catch (error) {
        console.error('Error loading yesterday data:', error)
    } finally {
        loading.value = false
    }
}

// Convert yesterdayData to food items format
const yesterdayFoods = computed((): FoodItem[] => {
    if (!yesterdayData.value) return []
    
    return yesterdayData.value.foods.map((food, index) => ({
        id: index + 1,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
        time: food.time,
        image: "/api/placeholder/60/60",
        type: food.type
    }))
})

// Yesterday calculations
const yesterdayCaloriesLeft = computed(() => yesterdayData.value?.calories || 0)
const yesterdayProtein = computed(() => yesterdayData.value?.protein || 0)
const yesterdayCarbs = computed(() => yesterdayData.value?.carbs || 0)
const yesterdayFats = computed(() => yesterdayData.value?.fats || 0)

// Progress calculations (0 to 1)
const yesterdayCaloriesProgress = computed(() => 
    Math.min((yesterdayData.value?.calories || 0) / dailyCalories.value, 1)
)
const yesterdayProteinProgress = computed(() => 
    Math.min((yesterdayData.value?.protein || 0) / dailyProtein.value, 1)
)
const yesterdayCarbsProgress = computed(() => 
    Math.min((yesterdayData.value?.carbs || 0) / dailyCarbs.value, 1)
)
const yesterdayFatsProgress = computed(() => 
    Math.min((yesterdayData.value?.fats || 0) / dailyFats.value, 1)
)

// Calculate stroke-dashoffset for macro circles
function calculateMacroOffset(progress: number, circumference: number): number {
    // Ensure progress is between 0 and 1
    const clampedProgress = Math.max(0, Math.min(1, progress))
    return circumference - (circumference * clampedProgress)
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
        // Swipe right (from left to right) - go back to today/home
        if (deltaX > swipeThreshold) {
            router.push('/')
        }
        // Swipe left (from right to left) - go to analytics
        if (deltaX < -swipeThreshold) {
            router.push('/analytics')
        }
    }
}

onMounted(() => {
    loadYesterdayData()
})
</script>

<style scoped>
.yesterday-view {
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
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
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

.app-title {
    font-size: 28px;
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
    text-decoration: none;
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
    margin-bottom: 12px;
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

.macro-progress>svg {
    width: 60px;
    height: 60px;
}

.macro-progress svg .progress-circle {
    transition: stroke-dashoffset 0.8s ease-in-out;
}

.macro-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 1;
}

.macro-icon>svg {
    width: 30px;
    height: 30px;
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

.protein-color {
    color: #ff6b6b;
}

.carbs-color {
    color: #ffa726;
}

.fats-color {
    color: #42a5f5;
}

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
