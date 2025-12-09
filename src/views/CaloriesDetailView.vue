<template>
    <div class="detail-view">
        <!-- Header -->
        <header class="header">
            <button class="back-button" @click="goBack">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
            </button>
            <h1 class="title">{{ $t('detail.calories.title') }}</h1>
            <div class="header-spacer"></div>
        </header>

        <!-- Current Value Card -->
        <div class="current-value-card">
            <div class="progress-ring-large">
                <svg class="progress-svg-large" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="#2a2d37" stroke-width="8" fill="none" />
                    <circle cx="60" cy="60" r="50" stroke="#ff6b35" stroke-width="8" fill="none"
                        stroke-dasharray="314.16" :stroke-dashoffset="314.16 - (314.16 * progress)"
                        stroke-linecap="round" class="progress-circle-large" transform="rotate(-90 60 60)" />
                </svg>
                <div class="flame-icon-large">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff6b35">
                        <path
                            d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
                    </svg>
                </div>
            </div>
            <div class="value-section">
                <div class="current-value">{{ currentValue }}</div>
                <div class="value-unit">kcal</div>
            </div>
            <div class="goal-section">
                <div class="goal-label">{{ $t('detail.goal') }}</div>
                <div class="goal-value">{{ goalValue }} kcal</div>
                <div class="progress-indicator" :class="{ 'over-goal': isOverGoal }">
                    <span v-if="isOverGoal">+{{ Math.abs(difference) }} kcal {{ $t('detail.over') }}</span>
                    <span v-else>{{ difference }} kcal {{ $t('detail.remaining') }}</span>
                </div>
            </div>
        </div>

        <!-- Period Toggle -->
        <div class="period-toggle">
            <button v-for="period in periods" :key="period.value" class="period-btn"
                :class="{ active: selectedPeriod === period.value }" @click="selectedPeriod = period.value">
                {{ period.label }}
            </button>
        </div>

        <!-- Chart Section -->
        <div class="chart-section">
            <div class="chart-header">
                <h3>{{ $t('detail.calories.chartTitle') }}</h3>
                <div class="chart-period">{{ selectedPeriodLabel }}</div>
            </div>
            <div class="chart-container">
                <apexchart type="bar" height="300" :options="chartOptions" :series="chartSeries" />
            </div>
        </div>

        <!-- Trend Comparison Chart -->
        <div class="trend-section">
            <div class="trend-header">
                <h3>{{ $t('detail.calories.trendTitle') }}</h3>
                <div class="trend-subtitle">{{ trendComparisonText }}</div>
            </div>
            <div class="trend-container">
                <apexchart type="line" height="250" :options="trendChartOptions" :series="trendChartSeries" />
            </div>
        </div>

        <!-- Apple Health Style Trend Chart -->
        <div class="apple-health-trend-section">
            <div class="apple-health-trend-header">
                <h3>{{ $t('detail.trends.title') }}</h3>
                <span class="beta-badge">BETA</span>
            </div>
            <div class="apple-health-trend-container">
                <div class="trend-chart-wrapper">
                    <AppleHealthTrendChart :chart-data="chartData" :selected-period="selectedPeriod" color="#ff6b35" />
                </div>
            </div>
        </div>

        <!-- Statistics -->
        <div class="stats-section">
            <h3>{{ $t('detail.statistics') }}</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">{{ averageCalories }}</div>
                    <div class="stat-label">{{ $t('detail.average') }}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ maxCalories }}</div>
                    <div class="stat-label">{{ $t('detail.maximum') }}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ minCalories }}</div>
                    <div class="stat-label">{{ $t('detail.minimum') }}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ daysOnTrack }}</div>
                    <div class="stat-label">{{ $t('detail.daysOnTrack') }}</div>
                </div>
            </div>
        </div>

        <!-- Debug Charts Section (only visible in debug mode) -->
        <div v-if="showDebugInfo" class="debug-charts-section">
            <h3 class="section-title">
                🐛 Debug Analytics - Calories
                <span class="debug-badge">DEV</span>
            </h3>

            <div class="debug-charts-grid">
                <DebugChart title="Calorie Trends" type="trend" />

                <DebugChart title="Performance" type="performance" />
            </div>
        </div>

        <!-- Information Section -->
        <div class="info-section">
            <h3>{{ $t('detail.calories.aboutTitle') }}</h3>
            <p class="info-text">{{ $t('detail.calories.aboutText') }}</p>

            <div class="info-tips">
                <h4>{{ $t('detail.calories.tipsTitle') }}</h4>
                <ul class="tips-list">
                    <li>{{ $t('detail.calories.tip1') }}</li>
                    <li>{{ $t('detail.calories.tip2') }}</li>
                    <li>{{ $t('detail.calories.tip3') }}</li>
                    <li>{{ $t('detail.calories.tip4') }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { default as ApexCharts } from 'vue3-apexcharts'
import { dailyGoals } from '../stores/userStore'
import { ScanHistory } from '../utils/storage'
import DebugChart from '../components/charts/DebugChart.vue'
import AppleHealthTrendChart from '../components/charts/AppleHealthTrendChart.vue'
import { isDebugMode, initializeDebugMode } from '../stores/preferencesStore'

const apexchart = ApexCharts
const router = useRouter()
const { t } = useI18n()

// Data
const currentValue = ref(0)
const goalValue = computed(() => dailyGoals.calories)
const selectedPeriod = ref<'week' | 'month' | 'year'>('week')
const chartData = ref<Array<{ date: string; calories: number }>>([])
const trendData = ref<Array<{ date: string; current: number; previous: number }>>([])

// Debug mode (synchronized with global debug mode)
const showDebugInfo = ref(false)

const periods = [
    { value: 'week' as const, label: t('detail.week') },
    { value: 'month' as const, label: t('detail.month') },
    { value: 'year' as const, label: t('detail.year') }
]

// Computed
const difference = computed(() => goalValue.value - currentValue.value)
const isOverGoal = computed(() => currentValue.value > goalValue.value)
const progress = computed(() => Math.min(currentValue.value / goalValue.value, 1))

const selectedPeriodLabel = computed(() => {
    const period = periods.find(p => p.value === selectedPeriod.value)
    return period?.label || ''
})

const trendComparisonText = computed(() => {
    const current = selectedPeriod.value === 'week' ? 'Diese Woche' :
        selectedPeriod.value === 'month' ? 'Dieser Monat' : 'Dieses Jahr'
    const previous = selectedPeriod.value === 'week' ? 'vs. Letzte Woche' :
        selectedPeriod.value === 'month' ? 'vs. Letzter Monat' : 'vs. Letztes Jahr'
    return `${current} ${previous}`
})

const trendChartSeries = computed(() => [
    {
        name: 'Aktuell',
        data: trendData.value.map(item => item.current)
    },
    {
        name: 'Vorherig',
        data: trendData.value.map(item => item.previous)
    }
])

const trendChartOptions = computed(() => ({
    chart: {
        type: 'line',
        background: 'transparent',
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
    },
    theme: { mode: 'dark' },
    colors: ['#ff6b35', 'rgba(255, 107, 53, 0.5)'],
    stroke: {
        curve: 'smooth',
        width: 3
    },
    markers: {
        size: 6,
        strokeWidth: 2,
        fillOpacity: 1,
        strokeOpacity: 1
    },
    xaxis: {
        categories: trendData.value.map(item => formatTrendLabel(item.date)),
        labels: { style: { colors: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' } },
        axisBorder: { show: false },
        axisTicks: { show: false }
    },
    yaxis: {
        labels: {
            style: { colors: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' },
            formatter: (value: number) => `${Math.round(value)}`
        }
    },
    grid: { borderColor: 'rgba(255, 255, 255, 0.1)', strokeDashArray: 3 },
    tooltip: {
        theme: 'dark',
        style: { fontSize: '12px' },
        y: {
            formatter: (value: number) => `${Math.round(value)} kcal`
        }
    },
    legend: {
        show: true,
        position: 'top',
        labels: { colors: 'rgba(255, 255, 255, 0.8)' }
    }
}))

const chartSeries = computed(() => [
    {
        name: 'Kalorien',
        data: chartData.value.map(item => item.calories)
    }
])

const chartOptions = computed(() => ({
    chart: {
        type: 'bar',
        background: 'transparent',
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
    },
    theme: { mode: 'dark' },
    colors: ['#ff6b35'],
    plotOptions: {
        bar: {
            borderRadius: 8,
            columnWidth: '60%',
            distributed: false,
            dataLabels: { position: 'top' },
            borderRadiusApplication: 'end'
        }
    },
    stroke: { show: false },
    dataLabels: {
        enabled: true,
        formatter: (value: number) => `${value}`,
        offsetY: -18,
        style: { colors: ['#ffffff'], fontSize: '12px', fontWeight: '400' },
        background: { enabled: false }
    },
    legend: { show: false },
    fill: {
        type: 'gradient',
        gradient: {
            type: 'vertical',
            shade: 'light',
            shadeIntensity: 0.4,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            gradientToColors: ['#ff8a8a'],
            stops: [0, 100]
        }
    },
    xaxis: {
        categories: chartData.value.map(item => formatDateLabel(item.date)),
        labels: { style: { colors: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' } },
        axisBorder: { show: false },
        axisTicks: { show: false }
    },
    yaxis: {
        labels: { show: false }
    },
    grid: { borderColor: 'rgba(255, 255, 255, 0.1)', strokeDashArray: 3 },
    tooltip: {
        theme: 'dark',
        style: { fontSize: '12px' },
        y: {
            formatter: (value: number) => {
                const diff = value - goalValue.value
                const diffText = diff > 0 ? `+${diff}` : `${diff}`
                return `${value} kcal<br/>Ziel: ${goalValue.value} kcal<br/>Differenz: ${diffText} kcal`
            }
        }
    },
    annotations: {
        yaxis: [{
            y: goalValue.value,
            borderColor: 'rgba(255, 167, 38, 0.8)',
            strokeDashArray: 5,
            label: {
                text: `Ziel: ${goalValue.value} kcal`,
                style: { color: '#ffffff', background: 'rgba(255, 167, 38, 0.8)' }
            }
        }]
    }
}))

// Statistics
const averageCalories = computed(() => {
    if (chartData.value.length === 0) return '0'
    const sum = chartData.value.reduce((acc, item) => acc + item.calories, 0)
    return Math.round(sum / chartData.value.length).toString()
})

const maxCalories = computed(() => {
    if (chartData.value.length === 0) return '0'
    return Math.max(...chartData.value.map(item => item.calories)).toString()
})

const minCalories = computed(() => {
    if (chartData.value.length === 0) return '0'
    return Math.min(...chartData.value.map(item => item.calories)).toString()
})

const daysOnTrack = computed(() => {
    return chartData.value.filter(item => item.calories <= goalValue.value).length.toString()
})

function goBack() {
    router.back()
}

function formatDateLabel(dateStr: string): string {
    const date = new Date(dateStr)
    if (selectedPeriod.value === 'week') {
        return date.toLocaleDateString('de-DE', { weekday: 'short' })
    } else if (selectedPeriod.value === 'month') {
        return date.toLocaleDateString('de-DE', { day: '2-digit' })
    } else {
        return date.toLocaleDateString('de-DE', { month: 'short' })
    }
}

function formatTrendLabel(dateStr: string): string {
    const date = new Date(dateStr)
    if (selectedPeriod.value === 'week') {
        return date.toLocaleDateString('de-DE', { weekday: 'short' })
    } else if (selectedPeriod.value === 'month') {
        return `KW ${getWeekNumber(date)}`
    } else {
        return `Q${Math.ceil((date.getMonth() + 1) / 3)}`
    }
}

function getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

function aggregateDataByPeriod(data: Array<{ date: string; calories: number }>) {
    if (selectedPeriod.value === 'week') {
        return data // No aggregation needed for week
    }

    const aggregated: Array<{ date: string; calories: number }> = []

    if (selectedPeriod.value === 'month') {
        // Aggregate by weeks (4 weeks)
        for (let week = 0; week < 4; week++) {
            const weekStart = week * 7
            const weekEnd = Math.min(weekStart + 7, data.length)
            const weekData = data.slice(weekStart, weekEnd)

            if (weekData.length > 0) {
                const avgCalories = weekData.reduce((sum, item) => sum + item.calories, 0) / weekData.length
                const weekDate = weekData[Math.floor(weekData.length / 2)].date // Use middle date as representative
                aggregated.push({
                    date: weekDate,
                    calories: Math.round(avgCalories)
                })
            }
        }
    } else {
        // Aggregate by quarters (4 quarters)
        for (let quarter = 0; quarter < 4; quarter++) {
            const quarterStart = quarter * Math.floor(data.length / 4)
            const quarterEnd = quarter === 3 ? data.length : (quarter + 1) * Math.floor(data.length / 4)
            const quarterData = data.slice(quarterStart, quarterEnd)

            if (quarterData.length > 0) {
                const avgCalories = quarterData.reduce((sum, item) => sum + item.calories, 0) / quarterData.length
                const quarterDate = quarterData[Math.floor(quarterData.length / 2)].date
                aggregated.push({
                    date: quarterDate,
                    calories: Math.round(avgCalories)
                })
            }
        }
    }

    return aggregated
}

async function loadData() {
    try {
        const history = await ScanHistory.get()
        const today = new Date()

        // Calculate current day's calories
        const todayStr = today.toISOString().split('T')[0]
        const todaysScans = history.filter(scan => {
            const scanDate = new Date(scan.timestamp).toISOString().split('T')[0]
            return scanDate === todayStr
        })

        let todayCalories = 0
        todaysScans.forEach(scan => {
            if (scan.type === 'food' && scan.data.total) {
                todayCalories += scan.data.total.calories || 0
            } else if (scan.type === 'barcode' && scan.data.nutriments) {
                todayCalories += scan.data.nutriments.energy_kcal_100g || 0
            }
        })
        currentValue.value = Math.round(todayCalories)

        // Generate chart data based on selected period
        const rawData = []
        const days = selectedPeriod.value === 'week' ? 7 : selectedPeriod.value === 'month' ? 30 : 365

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]

            const dayScans = history.filter(scan => {
                const scanDate = new Date(scan.timestamp).toISOString().split('T')[0]
                return scanDate === dateStr
            })

            let dayCalories = 0
            dayScans.forEach(scan => {
                if (scan.type === 'food' && scan.data.total) {
                    dayCalories += scan.data.total.calories || 0
                } else if (scan.type === 'barcode' && scan.data.nutriments) {
                    dayCalories += scan.data.nutriments.energy_kcal_100g || 0
                }
            })

            rawData.push({
                date: dateStr,
                calories: Math.round(dayCalories)
            })
        }

        // Aggregate data for longer periods
        chartData.value = aggregateDataByPeriod(rawData)

        // Generate trend comparison data
        const trendRawData = []
        const previousPeriodDays = days * 2 // Get data for current + previous period

        for (let i = previousPeriodDays - 1; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]

            const dayScans = history.filter(scan => {
                const scanDate = new Date(scan.timestamp).toISOString().split('T')[0]
                return scanDate === dateStr
            })

            let dayCalories = 0
            dayScans.forEach(scan => {
                if (scan.type === 'food' && scan.data.total) {
                    dayCalories += scan.data.total.calories || 0
                } else if (scan.type === 'barcode' && scan.data.nutriments) {
                    dayCalories += scan.data.nutriments.energy_kcal_100g || 0
                }
            })

            trendRawData.push({
                date: dateStr,
                calories: Math.round(dayCalories)
            })
        }

        // Split into current and previous periods
        const currentPeriodData = aggregateDataByPeriod(trendRawData.slice(-days))
        const previousPeriodData = aggregateDataByPeriod(trendRawData.slice(0, days))

        // Create trend comparison data
        const trendComparison = []
        const maxLength = Math.max(currentPeriodData.length, previousPeriodData.length)

        for (let i = 0; i < maxLength; i++) {
            trendComparison.push({
                date: currentPeriodData[i]?.date || '',
                current: currentPeriodData[i]?.calories || 0,
                previous: previousPeriodData[i]?.calories || 0
            })
        }

        trendData.value = trendComparison
    } catch (error) {
        console.error('Error loading calories data:', error)
    }
}

onMounted(() => {
    loadData()

    // Initialize debug mode
    initializeDebugMode().then(() => {
        showDebugInfo.value = isDebugMode.value
    })
})

// Watch for period changes
watch(selectedPeriod, () => {
    loadData()
})

// Watch for debug mode changes
watch(isDebugMode, (newValue) => {
    showDebugInfo.value = newValue
}, { immediate: true })
</script>

<style scoped>
.detail-view {
    height: 100vh;
    height: 100dvh;
    background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
    color: white;
    overflow-y: auto;
    margin-top: max(44px, env(safe-area-inset-top, 44px));
    padding-bottom: max(20px, env(safe-area-inset-bottom, 20px));
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 20px;
    position: sticky;
    top: 0;
    background: rgba(30, 30, 46, 1);
    backdrop-filter: blur(10px);
    z-index: 10;
}

.back-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.title {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

.header-spacer {
    width: 40px;
}

.current-value-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 32px 24px;
    margin: 20px;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.value-section {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 16px;
}

.current-value {
    font-size: 48px;
    font-weight: 700;
    color: #ff6b35;
}

.value-unit {
    font-size: 20px;
    font-weight: 500;
    opacity: 0.8;
}

.goal-section {
    text-align: center;
    margin-bottom: 24px;
}

.goal-label {
    font-size: 14px;
    opacity: 0.7;
    margin-bottom: 4px;
}

.goal-value {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
}

.progress-indicator {
    font-size: 14px;
    padding: 6px 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
}

.progress-indicator.over-goal {
    background: rgba(255, 107, 53, 0.2);
    color: #ff6b35;
}

.progress-ring-large {
    position: relative;
    width: 120px;
    height: 120px;
}

.progress-circle-large {
    transition: stroke-dashoffset 0.8s ease-in-out;
}

.flame-icon-large {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.period-toggle {
    display: flex;
    gap: 8px;
    margin: 0 20px 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 4px;
}

.period-btn {
    flex: 1;
    background: transparent;
    border: none;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.period-btn.active {
    background: rgba(255, 255, 255, 0.15);
}

.chart-section {
    margin: 0 20px 32px;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.chart-header h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
}

.chart-period {
    font-size: 14px;
    opacity: 0.7;
}

.chart-container {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    /*padding: 20px;*/
    backdrop-filter: blur(10px);
}

.trend-section {
    margin: 0 20px 32px;
}

.trend-header {
    margin-bottom: 16px;
}

.trend-header h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 4px 0;
}

.trend-subtitle {
    font-size: 14px;
    opacity: 0.7;
}

.trend-container {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 20px;
    backdrop-filter: blur(10px);
}

.stats-section {
    margin: 0 20px 32px;
}

.stats-section h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px 0;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.stat-item {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    backdrop-filter: blur(10px);
}

.stat-value {
    font-size: 24px;
    font-weight: 600;
    color: #ff6b35;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 14px;
    opacity: 0.8;
}

.info-section {
    margin: 0 20px 40px;
}

.info-section h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px 0;
}

.info-text {
    font-size: 16px;
    line-height: 1.6;
    opacity: 0.9;
    margin-bottom: 24px;
}

.info-tips h4 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 12px 0;
}

.tips-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.tips-list li {
    font-size: 14px;
    line-height: 1.5;
    opacity: 0.8;
    margin-bottom: 8px;
    padding-left: 16px;
    position: relative;
}

.tips-list li:before {
    content: '•';
    color: #ff6b35;
    font-weight: bold;
    position: absolute;
    left: 0;
}

/* Debug Charts Styles */
.debug-charts-section {
    margin: 0 20px 32px;
}

.debug-charts-section .section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.debug-badge {
    background: rgba(255, 107, 53, 0.2);
    color: #ff6b35;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
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

/* Apple Health Style Trend Chart */
.apple-health-trend-section {
    margin: 0 20px 32px;
}

.apple-health-trend-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.apple-health-trend-header h3 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    color: white;
}

.beta-badge {
    background: rgba(255, 107, 53, 0.2);
    color: #ff6b35;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.apple-health-trend-container {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 8px;
    backdrop-filter: blur(10px);
}

.trend-insight {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.trend-insight:hover {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 8px;
    margin: -8px -8px 12px -8px;
}

.trend-icon {
    width: 40px;
    height: 40px;
    background: rgba(168, 85, 247, 0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.trend-content {
    flex: 1;
}

.trend-title {
    font-size: 16px;
    font-weight: 600;
    color: #a855f7;
    margin-bottom: 4px;
}

.trend-description {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.4;
}

.trend-arrow {
    opacity: 0.5;
    transition: opacity 0.2s ease;
}

.trend-insight:hover .trend-arrow {
    opacity: 1;
}

.trend-chart-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    /* Reduced margin for more chart space */
}

.chart-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
}

.chart-label.highlight {
    color: #a855f7;
    font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 480px) {
    .apple-health-trend-header h3 {
        font-size: 24px;
    }
}
</style>
