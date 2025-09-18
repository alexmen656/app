<template>
    <div class="history-view" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
        <!-- Header -->
        <header class="header">
            <button class="back-btn" @click="goBack">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
            </button>
            <div class="logo-section">
                <h1 class="app-title"><span style="color: #007052;">KalBuddy</span></h1>
            </div>
            <div class="streak" @click="goToView('streak')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff6b35">
                    <path
                        d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
                </svg>
                <span class="streak-count">{{ currentStreak }}</span>
            </div>
        </header>

        <!-- Date Selection -->
        <div class="date-selection">
            <button class="date-nav-btn" @click="changeDate(-1)" :disabled="!canGoBack">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
            </button>
            <div class="selected-date">
                <h2 class="date-title">{{ formatSelectedDate() }}</h2>
                <p class="date-subtitle">{{ getDateSubtitle() }}</p>
            </div>
            <button class="date-nav-btn" @click="changeDate(1)" :disabled="!canGoForward">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
            </button>
        </div>

        <div class="main-card" @click="goToView('calories')">
            <div class="calories-section">
                <h2 class="calories-number">{{ caloriesNumberDisplay }}</h2>
                <p class="calories-label">{{ caloriesLabelDisplay }}</p>
            </div>
            <div class="progress-ring">
                <svg class="progress-svg" width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#2a2d37" stroke-width="6" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke="white" stroke-width="6" fill="none" stroke-dasharray="251.2"
                        :stroke-dashoffset="251.2 - (251.2 * caloriesProgress)" stroke-linecap="round"
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
            <div class="macro-card protein" @click="goToView('protein')">
                <div class="macro-amount">{{ proteinNumberDisplay }}</div>
                <div class="macro-label">{{ proteinLabelDisplay }}</div>
                <div class="macro-progress">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        <!-- Background circle -->
                        <circle cx="30" cy="30" r="24" stroke="#2a2d37" stroke-width="5" fill="none" />
                        <!-- Progress circle -->
                        <circle cx="30" cy="30" r="24" stroke="#ff6b6b" stroke-width="5" fill="none"
                            stroke-dasharray="150.8" :stroke-dashoffset="calculateMacroOffset(proteinProgress, 150.8)"
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

            <div class="macro-card carbs" @click="goToView('carbs')">
                <div class="macro-amount">{{ carbsNumberDisplay }}</div>
                <div class="macro-label">{{ carbsLabelDisplay }}</div>
                <div class="macro-progress">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        <!-- Background circle -->
                        <circle cx="30" cy="30" r="24" stroke="#2a2d37" stroke-width="5" fill="none" />
                        <!-- Progress circle -->
                        <circle cx="30" cy="30" r="24" stroke="#ffa726" stroke-width="5" fill="none"
                            stroke-dasharray="150.8" :stroke-dashoffset="calculateMacroOffset(carbsProgress, 150.8)"
                            stroke-linecap="round" transform="rotate(-90 30 30)" class="progress-circle" />
                    </svg>
                    <div class="macro-icon macro-icon-carbs">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            <path fill="#ffa726"
                                d="M79.7 234.6c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0L134.1 444.3 49.4 529c-9.4 9.4-24.5 9.4-33.9 0-9.4-9.4-9.4-24.6 0-33.9l84.7-84.7-30.5-30.5c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zm104-104c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zM495.2 15c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.2L529.2 49 414.7 163.4c7.7 1 15.2 3 22.5 5.9L495.5 111c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-52.7 52.7 39 39c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1c6.2-4.1 14.7-3.4 20.1 2.1l39 39 52.7-52.7c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-58.3 58.3c2.8 7.1 4.7 14.5 5.7 22.1L495.2 15z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="macro-card fats" @click="goToView('fats')">
                <div class="macro-amount">{{ fatsNumberDisplay }}</div>
                <div class="macro-label">{{ fatsLabelDisplay }}</div>
                <div class="macro-progress">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        <!-- Background circle -->
                        <circle cx="30" cy="30" r="24" stroke="#2a2d37" stroke-width="5" fill="none" />
                        <!-- Progress circle -->
                        <circle cx="30" cy="30" r="24" stroke="#42a5f5" stroke-width="5" fill="none"
                            stroke-dasharray="150.8" :stroke-dashoffset="calculateMacroOffset(fatsProgress, 150.8)"
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

        <!-- Historical Foods Section -->
        <div class="historical-section">
            <h3 class="section-title">{{ formatHistorySectionTitle() }}</h3>

            <div v-if="historicalFoods.length === 0" class="empty-state">
                <div class="empty-icon">📅</div>
                <p>{{ $t('history.noDataForDate') }}</p>
                <p class="empty-subtitle">{{ $t('history.noDataSubtitle') }}</p>
            </div>

            <div v-else class="food-item" @click="goToNutritionDetail(item)" v-for="item in historicalFoods" :key="item.id">
                <div class="food-image">
                    <img v-if="item.image && !item.image.includes('placeholder')" :src="item.image" :alt="item.name" />
                    <span v-else-if="item.icon" class="food-db-icon">{{ item.icon }}</span>
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
                            <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path fill="#ff6b6b"
                                    d="M224 329.2C224 337.7 220.6 345.8 214.6 351.8L187.8 378.6C175.5 390.9 155.3 390 138.4 385.8C133.8 384.7 128.9 384 123.9 384C90.8 384 63.9 410.9 63.9 444C63.9 477.1 90.8 504 123.9 504C130.2 504 135.9 509.7 135.9 516C135.9 549.1 162.8 576 195.9 576C229 576 255.9 549.1 255.9 516C255.9 511 255.3 506.2 254.1 501.5C249.9 484.6 248.9 464.4 261.3 452.1L288.1 425.3C294.1 419.3 302.2 415.9 310.7 415.9L399.9 415.9C406.2 415.9 412.3 415.6 418.4 414.9C430.3 413.7 434.8 399.4 429.2 388.9C420.7 373.1 415.9 355.1 415.9 335.9C415.9 274 466 223.9 527.9 223.9C535.9 223.9 543.6 224.7 551.1 226.3C562.8 228.8 575.2 220.4 573.1 208.7C558.4 126.4 486.4 63.9 399.9 63.9C302.7 63.9 223.9 142.7 223.9 239.9L223.9 329.1z" />
                            </svg>
                            {{ item.protein }}g
                        </span>
                        <span class="macro-item carbs-color">
                            <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path fill="#ffa726"
                                    d="M79.7 234.6c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0L134.1 444.3 49.4 529c-9.4 9.4-24.5 9.4-33.9 0-9.4-9.4-9.4-24.6 0-33.9l84.7-84.7-30.5-30.5c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zm104-104c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zM495.2 15c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.2L529.2 49 414.7 163.4c7.7 1 15.2 3 22.5 5.9L495.5 111c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-52.7 52.7 39 39c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1c6.2-4.1 14.7-3.4 20.1 2.1l39 39 52.7-52.7c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-58.3 58.3c2.8 7.1 4.7 14.5 5.7 22.1L495.2 15z" />
                            </svg>
                            {{ item.carbs }}g
                        </span>
                        <span class="macro-item fats-color">
                            <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path fill="#42a5f5"
                                    d="M240 64C240 46.3 254.3 32 272 32L368 32C385.7 32 400 46.3 400 64C400 81.7 385.7 96 368 96L368 199.3C432.9 219.7 480 280.3 480 352L480 544C480 579.3 451.3 608 416 608L224 608C188.7 608 160 579.3 160 544L160 352C160 280.4 207.1 219.7 272 199.3L272 96C254.3 96 240 81.7 240 64zM320 480C355.3 480 384 447.6 384 416C384 394.8 355.1 351.5 336.1 325.4C328 314.3 311.9 314.3 303.8 325.4C284.8 351.5 255.9 394.8 255.9 416C255.9 447.6 284.6 480 319.9 480z" />
                            </svg>
                            {{ item.fats }}g
                        </span>
                    </div>
                </div>
                <div class="food-time">{{ item.time }}</div>
            </div>
        </div>

        <BottomNavigation />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, type ComputedRef } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { dailyGoals, storeReady } from '../stores/userStore'
import { ScanHistory } from '../utils/storage'
import { StreakManager } from '../utils/widgetData'
import { getLocalizedName } from '../utils/localization'
import BottomNavigation from '../components/BottomNavigation.vue'

const router = useRouter()
const { t } = useI18n()

const selectedDate = ref(new Date())
const currentStreak = ref<number>(0)
const scanHistory = ref<any[]>([])
const selectedDateNutrition = ref({ calories: 0, protein: 0, carbs: 0, fats: 0 })

// Daily goals
const dailyCalories = computed(() => dailyGoals.calories)
const dailyProtein = computed(() => dailyGoals.protein)
const dailyCarbs = computed(() => dailyGoals.carbs)
const dailyFats = computed(() => dailyGoals.fats)

// Consumed values for selected date
const consumedCalories = computed(() => selectedDateNutrition.value.calories)
const consumedProtein = computed(() => selectedDateNutrition.value.protein)
const consumedCarbs = computed(() => selectedDateNutrition.value.carbs)
const consumedFats = computed(() => selectedDateNutrition.value.fats)

// Navigation constraints
const canGoBack = computed(() => {
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))
    return selectedDate.value > thirtyDaysAgo
})

const canGoForward = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selected = new Date(selectedDate.value)
    selected.setHours(0, 0, 0, 0)
    return selected < today
})

interface ScanData {
    id: number
    type: 'food' | 'barcode'
    timestamp: string
    time: string
    image?: string
    amount?: number
    icon?: string
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
    icon?: string
}

function createMacroCalculations(
    dailyValue: ComputedRef<number>,
    consumedValue: ComputedRef<number>,
    unit: string,
    overKey: string,
    leftKey: string
) {
    const diff = computed(() => Math.round(dailyValue.value - consumedValue.value))
    const isOver = computed(() => diff.value < 0)
    const abs = computed(() => Math.abs(diff.value))
    const numberDisplay = computed(() => isOver.value ? `${abs.value}${unit}` : `${diff.value}${unit}`)
    const labelDisplay = computed(() => isOver.value ? t(overKey) : t(leftKey))
    const progress = computed(() => Math.min(consumedValue.value / dailyValue.value, 1))

    return { diff, isOver, abs, numberDisplay, labelDisplay, progress }
}

function transformFoodScan(scan: ScanData): FoodItem {
    const total = scan.data.total
    const firstFood = scan.data.foods?.[0]
    return {
        id: scan.id,
        name: getLocalizedName(firstFood) || t('home.scannedFood'),
        calories: total.calories || 0,
        protein: total.protein || 0,
        carbs: total.carbs || 0,
        fats: total.fat || 0,
        time: scan.time,
        image: scan.image || '/api/placeholder/60/60',
        type: 'food',
        icon: scan.icon
    }
}

function transformBarcodeScan(scan: ScanData, amount: number): FoodItem {
    const nutriments = scan.data.nutriments || {}
    return {
        id: scan.id,
        name: getLocalizedName(scan.data) || t('home.unknownProduct'),
        calories: Math.round((nutriments.energy_kcal_100g || 0) * amount),
        protein: Math.round((nutriments.proteins_100g || 0) * amount),
        carbs: Math.round((nutriments.carbohydrates_100g || 0) * amount),
        fats: Math.round((nutriments.fat_100g || 0) * amount),
        time: scan.time,
        image: scan.image || '/api/placeholder/60/60',
        type: 'barcode',
        icon: undefined
    }
}

function transformScanToFoodItem(scan: ScanData): FoodItem | null {
    const amount = scan.amount || 1.0

    if (scan.type === 'food') {
        return transformFoodScan(scan)
    } else if (scan.type === 'barcode') {
        return transformBarcodeScan(scan, amount)
    }
    return null
}

async function loadDataForDate() {
    try {
        const history = await ScanHistory.get()
        const selectedDateString = selectedDate.value.toISOString().split('T')[0]

        // Filter scans for selected date
        const dateScans = history.filter(scan => {
            const scanDate = new Date(scan.timestamp).toISOString().split('T')[0]
            return scanDate === selectedDateString
        })

        scanHistory.value = dateScans

        // Calculate nutrition for selected date
        calculateNutritionFromHistory(dateScans)
    } catch (error) {
        console.error('Error loading scan history:', error)
        scanHistory.value = []
        selectedDateNutrition.value = { calories: 0, protein: 0, carbs: 0, fats: 0 }
    }
}

function calculateNutritionFromHistory(scans: ScanData[]) {
    try {
        let totalCalories = 0
        let totalProtein = 0
        let totalCarbs = 0
        let totalFats = 0

        scans.forEach(scan => {
            const amount = scan.amount || 1.0;

            if (scan.type === 'food' && scan.data.total) {
                totalCalories += scan.data.total.calories || 0
                totalProtein += scan.data.total.protein || 0
                totalCarbs += scan.data.total.carbs || 0
                totalFats += scan.data.total.fat || 0
            } else if (scan.type === 'barcode' && scan.data.nutriments) {
                totalCalories += (scan.data.nutriments.energy_kcal_100g || 0) * amount
                totalProtein += (scan.data.nutriments.proteins_100g || 0) * amount
                totalCarbs += (scan.data.nutriments.carbohydrates_100g || 0) * amount
                totalFats += (scan.data.nutriments.fat_100g || 0) * amount
            }
        })

        selectedDateNutrition.value = {
            calories: Math.round(totalCalories),
            protein: Math.round(totalProtein),
            carbs: Math.round(totalCarbs),
            fats: Math.round(totalFats)
        }
    } catch (error) {
        console.error('Error calculating nutrition:', error)
        selectedDateNutrition.value = { calories: 0, protein: 0, carbs: 0, fats: 0 }
    }
}

async function loadStreak() {
    try {
        currentStreak.value = await StreakManager.getCurrentStreak()
    } catch (error) {
        console.error('Error loading streak:', error)
        currentStreak.value = 0
    }
}

function changeDate(direction: number) {
    const newDate = new Date(selectedDate.value)
    newDate.setDate(newDate.getDate() + direction)
    
    if (direction < 0 && !canGoBack.value) return
    if (direction > 0 && !canGoForward.value) return
    
    selectedDate.value = newDate
}

function formatSelectedDate(): string {
    const today = new Date()
    const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000))
    
    const selectedDateString = selectedDate.value.toDateString()
    const todayString = today.toDateString()
    const yesterdayString = yesterday.toDateString()
    
    if (selectedDateString === todayString) {
        return t('app.today')
    } else if (selectedDateString === yesterdayString) {
        return t('app.yesterday')
    } else {
        return selectedDate.value.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        })
    }
}

function getDateSubtitle(): string {
    const today = new Date()
    const selectedDateString = selectedDate.value.toDateString()
    const todayString = today.toDateString()
    
    if (selectedDateString === todayString) {
        return ''
    }
    
    return selectedDate.value.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

function formatHistorySectionTitle(): string {
    const today = new Date()
    const selectedDateString = selectedDate.value.toDateString()
    const todayString = today.toDateString()
    
    if (selectedDateString === todayString) {
        return t('home.recentlyUploaded')
    } else {
        return t('history.mealsForDate')
    }
}

function goBack() {
    router.go(-1)
}

function goToView(view: string) {
    router.push(`/${view}`)
}

function goToNutritionDetail(item: FoodItem) {
    router.push({
        path: '/scan-detail',
        query: {
            scanId: item.id.toString()
        }
    })
}

const historicalFoods = computed((): FoodItem[] => {
    return scanHistory.value
        .map(transformScanToFoodItem)
        .filter((item): item is FoodItem => item !== null)
})

// Use the macro calculations function for all macronutrients
const calories = createMacroCalculations(dailyCalories, consumedCalories, '', 'home.caloriesOver', 'home.caloriesLeft')
const protein = createMacroCalculations(dailyProtein, consumedProtein, 'g', 'home.proteinOver', 'home.proteinLeft')
const carbs = createMacroCalculations(dailyCarbs, consumedCarbs, 'g', 'home.carbsOver', 'home.carbsLeft')
const fats = createMacroCalculations(dailyFats, consumedFats, 'g', 'home.fatsOver', 'home.fatsLeft')

// Aliases for template usage
const caloriesProgress = calories.progress
const proteinProgress = protein.progress
const carbsProgress = carbs.progress
const fatsProgress = fats.progress

const caloriesNumberDisplay = calories.numberDisplay
const caloriesLabelDisplay = calories.labelDisplay
const proteinNumberDisplay = protein.numberDisplay
const proteinLabelDisplay = protein.labelDisplay
const carbsNumberDisplay = carbs.numberDisplay
const carbsLabelDisplay = carbs.labelDisplay
const fatsNumberDisplay = fats.numberDisplay
const fatsLabelDisplay = fats.labelDisplay

function calculateMacroOffset(progress: number, circumference: number): number {
    const clampedProgress = Math.max(0, Math.min(1, progress))
    return circumference - (circumference * clampedProgress)
}

// Touch handling for swipe navigation
let touchStartX = 0
let touchStartY = 0
const swipeThreshold = 50

function handleTouchStart(event: TouchEvent) {
    touchStartX = event.touches[0].clientX
    touchStartY = event.touches[0].clientY
}

function handleTouchMove(event: TouchEvent) {
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

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < -swipeThreshold && canGoForward.value) {
            changeDate(1) // Swipe left = go forward in time
        } else if (deltaX > swipeThreshold && canGoBack.value) {
            changeDate(-1) // Swipe right = go back in time
        }
    }
}

// Watch for date changes and reload data
watch(selectedDate, () => {
    loadDataForDate()
}, { immediate: false })

onMounted(async () => {
    await storeReady
    loadStreak()
    loadDataForDate()
})
</script>

<style scoped>
.history-view {
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
    height: 44px;
    margin-bottom: 8px;
}

.back-btn {
    background: transparent;
    border: none;
    color: white;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-right: 8px;
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.logo-section {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    justify-content: center;
    margin-right: 40px; /* Compensate for back button space */
}

.app-title {
    font-size: 30px;
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
    cursor: pointer;
}

.date-selection {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding: 16px 0;
}

.date-nav-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.date-nav-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.date-nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.date-nav-btn:disabled:hover {
    background: rgba(255, 255, 255, 0.1);
}

.selected-date {
    text-align: center;
    flex: 1;
    margin: 0 16px;
}

.date-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 4px 0;
    line-height: 1.2;
}

.date-subtitle {
    font-size: 14px;
    opacity: 0.7;
    margin: 0;
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

.macro-progress > svg {
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
    padding-top: 2px;
}

.macro-icon > svg {
    width: 30px;
    height: 30px;
}

.macro-icon-carbs {
    padding-top: 4px;
}

.macro-icon-carbs > svg {
    width: 26px;
    height: 26px;
}

.historical-section {
    margin-bottom: 30px;
}

.section-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
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
    padding: 12px;
    margin-bottom: 12px;
    backdrop-filter: blur(10px);
    cursor: pointer;
    transition: all 0.2s ease;
}

.food-item:hover {
    background: rgba(255, 255, 255, 0.08);
}

.food-image {
    width: 69px;
    height: 69px;
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

.food-db-icon {
    font-size: 30px;
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
</style>
