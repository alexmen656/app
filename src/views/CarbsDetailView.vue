<template>
    <div class="detail-view">
        <!-- Header -->
        <header class="header">
            <button class="back-button" @click="goBack">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
            </button>
            <h1 class="title">{{ $t('detail.carbs.title') }}</h1>
            <div class="header-spacer"></div>
        </header>

        <!-- Current Value Card -->
        <div class="current-value-card">
            <div class="progress-ring-large">
                <svg class="progress-svg-large" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="#2a2d37" stroke-width="8" fill="none" />
                    <circle cx="60" cy="60" r="50" stroke="#ffa726" stroke-width="8" fill="none"
                        stroke-dasharray="314.16" :stroke-dashoffset="314.16 - (314.16 * progress)"
                        stroke-linecap="round" class="progress-circle-large" transform="rotate(-90 60 60)" />
                </svg>
                <div class="carbs-icon-large">
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="#ffa726"
                            d="M79.7 234.6c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0L134.1 444.3 49.4 529c-9.4 9.4-24.5 9.4-33.9 0-9.4-9.4-9.4-24.6 0-33.9l84.7-84.7-30.5-30.5c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zm104-104c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zM495.2 15c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.2L529.2 49 414.7 163.4c7.7 1 15.2 3 22.5 5.9L495.5 111c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-52.7 52.7 39 39c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1c6.2-4.1 14.7-3.4 20.1 2.1l39 39 52.7-52.7c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-58.3 58.3c2.8 7.1 4.7 14.5 5.7 22.1L495.2 15z" />
                    </svg>
                </div>
            </div>
            <div class="value-section">
                <div class="current-value">{{ currentValue }}</div>
                <div class="value-unit">g</div>
            </div>
            <div class="goal-section">
                <div class="goal-label">{{ $t('detail.goal') }}</div>
                <div class="goal-value">{{ goalValue }} g</div>
                <div class="progress-indicator" :class="{ 'over-goal': isOverGoal }">
                    <span v-if="isOverGoal">+{{ Math.abs(difference) }}g {{ $t('detail.over') }}</span>
                    <span v-else>{{ difference }}g {{ $t('detail.remaining') }}</span>
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
                <h3>{{ $t('detail.carbs.chartTitle') }}</h3>
                <div class="chart-period">{{ selectedPeriodLabel }}</div>
            </div>
            <div class="chart-container">
                <apexchart type="bar" height="300" :options="chartOptions" :series="chartSeries" />
            </div>
        </div>

        <!-- Trend Comparison Chart -->
        <div class="trend-section">
            <div class="trend-header">
                <h3>{{ $t('detail.carbs.trendTitle') }}</h3>
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
                <div class="trend-insight">
                    <div class="trend-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffa726">
                            <path d="M12 2L13.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L10.91 8.26L12 2Z"/>
                        </svg>
                    </div>
                    <div class="trend-content">
                        <div class="trend-title">{{ $t('detail.carbs.title') }}</div>
                        <div class="trend-description">
                            {{ $t('detail.trends.stable', { period: $t('detail.trends.days') }) }}
                        </div>
                    </div>
                </div>
                <div class="trend-chart-wrapper">
                    <div class="trend-chart-labels">
                        <span class="chart-label">{{ $t('detail.trends.longTermWeeks') }}</span>
                        <span class="chart-label highlight">{{ $t('detail.trends.shortTermWeeks') }}</span>
                    </div>
                    <div class="trend-chart">
                        <svg width="100%" height="120" viewBox="0 0 300 120">
                            <!-- Simplified static trend for demo -->
                            <path d="M 20 80 Q 50 75 80 70 Q 110 75 140 80 Q 170 85 200 80 Q 230 75 260 70 Q 280 65 290 60" 
                                  stroke="rgba(255, 255, 255, 0.3)" stroke-width="2" fill="none"/>
                            <path d="M 140 80 Q 170 75 200 70 Q 230 65 260 60 Q 280 55 290 50" 
                                  stroke="#ffa726" stroke-width="3" fill="none"/>
                            <circle cx="290" cy="50" r="4" fill="#ffa726"/>
                            <text x="295" y="45" fill="#ffa726" font-size="12" font-weight="600">{{ currentValue }}g</text>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Statistics -->
        <div class="stats-section">
            <h3>{{ $t('detail.statistics') }}</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">{{ averageCarbs }}</div>
                    <div class="stat-label">{{ $t('detail.average') }}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ maxCarbs }}</div>
                    <div class="stat-label">{{ $t('detail.maximum') }}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ minCarbs }}</div>
                    <div class="stat-label">{{ $t('detail.minimum') }}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ daysOnTrack }}</div>
                    <div class="stat-label">{{ $t('detail.daysOnTrack') }}</div>
                </div>
            </div>
        </div>

        <!-- Information Section -->
        <div class="info-section">
            <h3>{{ $t('detail.carbs.aboutTitle') }}</h3>
            <p class="info-text">{{ $t('detail.carbs.aboutText') }}</p>

            <div class="info-tips">
                <h4>{{ $t('detail.carbs.tipsTitle') }}</h4>
                <ul class="tips-list">
                    <li>{{ $t('detail.carbs.tip1') }}</li>
                    <li>{{ $t('detail.carbs.tip2') }}</li>
                    <li>{{ $t('detail.carbs.tip3') }}</li>
                    <li>{{ $t('detail.carbs.tip4') }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { default as ApexCharts } from 'vue3-apexcharts'
import { dailyGoals } from '../stores/userStore'
import { ScanHistory } from '../utils/storage'

const apexchart = ApexCharts
const router = useRouter()
const { t } = useI18n()

// Data
const currentValue = ref(0)
const goalValue = computed(() => dailyGoals.carbs)
const selectedPeriod = ref<'week' | 'month' | 'year'>('week')
const chartData = ref<Array<{ date: string; carbs: number }>>([])
const trendData = ref<Array<{ date: string; current: number; previous: number }>>([])

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
    colors: ['#ffa726', 'rgba(255, 167, 38, 0.5)'],
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
            formatter: (value: number) => `${Math.round(value)}g`
        }
    },
    grid: { borderColor: 'rgba(255, 255, 255, 0.1)', strokeDashArray: 3 },
    tooltip: {
        theme: 'dark',
        style: { fontSize: '12px' },
        y: {
            formatter: (value: number) => `${Math.round(value)}g`
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
        name: 'Kohlenhydrate',
        data: chartData.value.map(item => item.carbs)
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
    colors: ['#ffa726'],
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
        formatter: (value: number) => `${value}g`,
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
            gradientToColors: ['#ffcc80'],
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
                return `${value}g Kohlenhydrate<br/>Ziel: ${goalValue.value}g<br/>Differenz: ${diffText}g`
            }
        }
    },
    annotations: {
        yaxis: [{
            y: goalValue.value,
            borderColor: 'rgba(255, 167, 38, 0.8)',
            strokeDashArray: 5,
            label: {
                text: `Ziel: ${goalValue.value}g`,
                style: { color: '#ffffff', background: 'rgba(255, 167, 38, 0.8)' }
            }
        }]
    }
}))

// Statistics
const averageCarbs = computed(() => {
    if (chartData.value.length === 0) return '0g'
    const sum = chartData.value.reduce((acc, item) => acc + item.carbs, 0)
    return Math.round(sum / chartData.value.length) + 'g'
})

const maxCarbs = computed(() => {
    if (chartData.value.length === 0) return '0g'
    return Math.max(...chartData.value.map(item => item.carbs)) + 'g'
})

const minCarbs = computed(() => {
    if (chartData.value.length === 0) return '0g'
    return Math.min(...chartData.value.map(item => item.carbs)) + 'g'
})

const daysOnTrack = computed(() => {
    return chartData.value.filter(item => item.carbs <= goalValue.value).length.toString()
})

// Functions
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

function aggregateDataByPeriod(data: Array<{ date: string; carbs: number }>) {
    if (selectedPeriod.value === 'week') {
        return data // No aggregation needed for week
    }
    
    const aggregated: Array<{ date: string; carbs: number }> = []
    
    if (selectedPeriod.value === 'month') {
        // Aggregate by weeks (4 weeks)
        for (let week = 0; week < 4; week++) {
            const weekStart = week * 7
            const weekEnd = Math.min(weekStart + 7, data.length)
            const weekData = data.slice(weekStart, weekEnd)
            
            if (weekData.length > 0) {
                const avgCarbs = weekData.reduce((sum, item) => sum + item.carbs, 0) / weekData.length
                const weekDate = weekData[Math.floor(weekData.length / 2)].date // Use middle date as representative
                aggregated.push({
                    date: weekDate,
                    carbs: Math.round(avgCarbs)
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
                const avgCarbs = quarterData.reduce((sum, item) => sum + item.carbs, 0) / quarterData.length
                const quarterDate = quarterData[Math.floor(quarterData.length / 2)].date
                aggregated.push({
                    date: quarterDate,
                    carbs: Math.round(avgCarbs)
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

        // Calculate current day's carbs
        const todayStr = today.toISOString().split('T')[0]
        const todaysScans = history.filter(scan => {
            const scanDate = new Date(scan.timestamp).toISOString().split('T')[0]
            return scanDate === todayStr
        })

        let todayCarbs = 0
        todaysScans.forEach(scan => {
            if (scan.type === 'food' && scan.data.total) {
                todayCarbs += scan.data.total.carbs || 0
            } else if (scan.type === 'barcode' && scan.data.nutriments) {
                todayCarbs += scan.data.nutriments.carbohydrates_100g || 0
            }
        })
        currentValue.value = Math.round(todayCarbs)

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

            let dayCarbs = 0
            dayScans.forEach(scan => {
                if (scan.type === 'food' && scan.data.total) {
                    dayCarbs += scan.data.total.carbs || 0
                } else if (scan.type === 'barcode' && scan.data.nutriments) {
                    dayCarbs += scan.data.nutriments.carbohydrates_100g || 0
                }
            })

            rawData.push({
                date: dateStr,
                carbs: Math.round(dayCarbs)
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

            let dayCarbs = 0
            dayScans.forEach(scan => {
                if (scan.type === 'food' && scan.data.total) {
                    dayCarbs += scan.data.total.carbs || 0
                } else if (scan.type === 'barcode' && scan.data.nutriments) {
                    dayCarbs += scan.data.nutriments.carbohydrates_100g || 0
                }
            })

            trendRawData.push({
                date: dateStr,
                carbs: Math.round(dayCarbs)
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
                current: currentPeriodData[i]?.carbs || 0,
                previous: previousPeriodData[i]?.carbs || 0
            })
        }

        trendData.value = trendComparison
    } catch (error) {
        console.error('Error loading carbs data:', error)
    }
}

onMounted(() => {
    loadData()
})

// Watch for period changes
import { watch } from 'vue'
watch(selectedPeriod, () => {
    loadData()
})
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
    color: #ffa726;
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
    background: rgba(255, 167, 38, 0.2);
    color: #ffa726;
}

.progress-ring-large {
    position: relative;
    width: 120px;
    height: 120px;
}

.progress-circle-large {
    transition: stroke-dashoffset 0.8s ease-in-out;
}

.carbs-icon-large {
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
    color: #ffa726;
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
    color: #ffa726;
    font-weight: bold;
    position: absolute;
    left: 0;
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
    background: rgba(255, 167, 38, 0.2);
    color: #ffa726;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.apple-health-trend-container {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 20px;
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
    background: rgba(255, 167, 38, 0.2);
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
    color: #ffa726;
    margin-bottom: 4px;
}

.trend-description {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.4;
}

.trend-chart-wrapper {
    margin-top: 20px;
}

.trend-chart-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
}

.chart-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
}

.chart-label.highlight {
    color: #ffa726;
    font-weight: 600;
}

.trend-chart {
    height: 120px;
    width: 100%;
}

.trend-chart svg {
    width: 100%;
    height: 100%;
}
</style>
