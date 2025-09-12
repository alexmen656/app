<template>
    <div class="detail-view">
        <!-- Header -->
        <header class="header">
            <button class="back-button" @click="goBack">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
            </button>
            <h1 class="title">{{ $t('detail.fats.title') }}</h1>
            <div class="header-spacer"></div>
        </header>

        <!-- Current Value Card -->
        <div class="current-value-card">
            <div class="progress-ring-large">
                <svg class="progress-svg-large" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="#2a2d37" stroke-width="8" fill="none" />
                    <circle cx="60" cy="60" r="50" stroke="#42a5f5" stroke-width="8" fill="none"
                        stroke-dasharray="314.16" :stroke-dashoffset="314.16 - (314.16 * progress)"
                        stroke-linecap="round" class="progress-circle-large" transform="rotate(-90 60 60)" />
                </svg>
                <div class="fats-icon-large">
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path fill="#42a5f5"
                            d="M240 64C240 46.3 254.3 32 272 32L368 32C385.7 32 400 46.3 400 64C400 81.7 385.7 96 368 96L368 199.3C432.9 219.7 480 280.3 480 352L480 544C480 579.3 451.3 608 416 608L224 608C188.7 608 160 579.3 160 544L160 352C160 280.4 207.1 219.7 272 199.3L272 96C254.3 96 240 81.7 240 64zM320 480C355.3 480 384 447.6 384 416C384 394.8 355.1 351.5 336.1 325.4C328 314.3 311.9 314.3 303.8 325.4C284.8 351.5 255.9 394.8 255.9 416C255.9 447.6 284.6 480 319.9 480z" />
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
                <h3>{{ $t('detail.fats.chartTitle') }}</h3>
                <div class="chart-period">{{ selectedPeriodLabel }}</div>
            </div>
            <div class="chart-container">
                <apexchart type="bar" height="300" :options="chartOptions" :series="chartSeries" />
            </div>
        </div>

        <!-- Trend Comparison Chart -->
        <div class="trend-section">
            <div class="trend-header">
                <h3>{{ $t('detail.fats.trendTitle') }}</h3>
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
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#42a5f5">
                            <path d="M12 2L13.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L10.91 8.26L12 2Z"/>
                        </svg>
                    </div>
                    <div class="trend-content">
                        <div class="trend-title">{{ $t('detail.fats.title') }}</div>
                        <div class="trend-description">
                            {{ $t('detail.trends.stable', { period: $t('detail.trends.days') }) }}
                        </div>
                    </div>
                </div>
                <div class="trend-chart-wrapper">
                    <AppleHealthTrendChart 
                        :chart-data="fatsChartData"
                        :selected-period="selectedPeriod"
                    />
                </div>
            </div>
        </div>

        <!-- Statistics -->
        <div class="stats-section">
            <h3>{{ $t('detail.statistics') }}</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">{{ averageFats }}</div>
                    <div class="stat-label">{{ $t('detail.average') }}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ maxFats }}</div>
                    <div class="stat-label">{{ $t('detail.maximum') }}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ minFats }}</div>
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
            <h3>{{ $t('detail.fats.aboutTitle') }}</h3>
            <p class="info-text">{{ $t('detail.fats.aboutText') }}</p>

            <div class="info-tips">
                <h4>{{ $t('detail.fats.tipsTitle') }}</h4>
                <ul class="tips-list">
                    <li>{{ $t('detail.fats.tip1') }}</li>
                    <li>{{ $t('detail.fats.tip2') }}</li>
                    <li>{{ $t('detail.fats.tip3') }}</li>
                    <li>{{ $t('detail.fats.tip4') }}</li>
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
import AppleHealthTrendChart from '../components/charts/AppleHealthTrendChart.vue'

const apexchart = ApexCharts
const router = useRouter()
const { t } = useI18n()

// Data
const currentValue = ref(0)
const goalValue = computed(() => dailyGoals.fats)
const selectedPeriod = ref<'week' | 'month' | 'year'>('week')
const chartData = ref<Array<{ date: string; fats: number }>>([])
const trendData = ref<Array<{ date: string; current: number; previous: number }>>([])

// Transform chartData for AppleHealthTrendChart component
const fatsChartData = computed(() => {
    return chartData.value.map(item => ({
        date: item.date,
        calories: item.fats // AppleHealthTrendChart expects calories property
    }))
})

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
    colors: ['#42a5f5', 'rgba(66, 165, 245, 0.5)'],
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
        name: 'Fette',
        data: chartData.value.map(item => item.fats)
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
    colors: ['#42a5f5'],
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
            gradientToColors: ['#90caf9'],
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
                return `${value}g Fette<br/>Ziel: ${goalValue.value}g<br/>Differenz: ${diffText}g`
            }
        }
    },
    annotations: {
        yaxis: [{
            y: goalValue.value,
            borderColor: 'rgba(66, 165, 245, 0.8)',
            strokeDashArray: 5,
            label: {
                text: `Ziel: ${goalValue.value}g`,
                style: { color: '#ffffff', background: 'rgba(66, 165, 245, 0.8)' }
            }
        }]
    }
}))

// Statistics
const averageFats = computed(() => {
    if (chartData.value.length === 0) return '0g'
    const sum = chartData.value.reduce((acc, item) => acc + item.fats, 0)
    return Math.round(sum / chartData.value.length) + 'g'
})

const maxFats = computed(() => {
    if (chartData.value.length === 0) return '0g'
    return Math.max(...chartData.value.map(item => item.fats)) + 'g'
})

const minFats = computed(() => {
    if (chartData.value.length === 0) return '0g'
    return Math.min(...chartData.value.map(item => item.fats)) + 'g'
})

const daysOnTrack = computed(() => {
    return chartData.value.filter(item => item.fats <= goalValue.value).length.toString()
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

function aggregateDataByPeriod(data: Array<{ date: string; fats: number }>) {
    if (selectedPeriod.value === 'week') {
        return data // No aggregation needed for week
    }
    
    const aggregated: Array<{ date: string; fats: number }> = []
    
    if (selectedPeriod.value === 'month') {
        // Aggregate by weeks (4 weeks)
        for (let week = 0; week < 4; week++) {
            const weekStart = week * 7
            const weekEnd = Math.min(weekStart + 7, data.length)
            const weekData = data.slice(weekStart, weekEnd)
            
            if (weekData.length > 0) {
                const avgFats = weekData.reduce((sum, item) => sum + item.fats, 0) / weekData.length
                const weekDate = weekData[Math.floor(weekData.length / 2)].date // Use middle date as representative
                aggregated.push({
                    date: weekDate,
                    fats: Math.round(avgFats)
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
                const avgFats = quarterData.reduce((sum, item) => sum + item.fats, 0) / quarterData.length
                const quarterDate = quarterData[Math.floor(quarterData.length / 2)].date
                aggregated.push({
                    date: quarterDate,
                    fats: Math.round(avgFats)
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

        // Calculate current day's fats
        const todayStr = today.toISOString().split('T')[0]
        const todaysScans = history.filter(scan => {
            const scanDate = new Date(scan.timestamp).toISOString().split('T')[0]
            return scanDate === todayStr
        })

        let todayFats = 0
        todaysScans.forEach(scan => {
            if (scan.type === 'food' && scan.data.total) {
                todayFats += scan.data.total.fat || 0
            } else if (scan.type === 'barcode' && scan.data.nutriments) {
                todayFats += scan.data.nutriments.fat_100g || 0
            }
        })
        currentValue.value = Math.round(todayFats)

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

            let dayFats = 0
            dayScans.forEach(scan => {
                if (scan.type === 'food' && scan.data.total) {
                    dayFats += scan.data.total.fat || 0
                } else if (scan.type === 'barcode' && scan.data.nutriments) {
                    dayFats += scan.data.nutriments.fat_100g || 0
                }
            })

            rawData.push({
                date: dateStr,
                fats: Math.round(dayFats)
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

            let dayFats = 0
            dayScans.forEach(scan => {
                if (scan.type === 'food' && scan.data.total) {
                    dayFats += scan.data.total.fat || 0
                } else if (scan.type === 'barcode' && scan.data.nutriments) {
                    dayFats += scan.data.nutriments.fat_100g || 0
                }
            })

            trendRawData.push({
                date: dateStr,
                fats: Math.round(dayFats)
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
                current: currentPeriodData[i]?.fats || 0,
                previous: previousPeriodData[i]?.fats || 0
            })
        }

        trendData.value = trendComparison
    } catch (error) {
        console.error('Error loading fats data:', error)
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
    color: #42a5f5;
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
    background: rgba(66, 165, 245, 0.2);
    color: #42a5f5;
}

.progress-ring-large {
    position: relative;
    width: 120px;
    height: 120px;
}

.progress-circle-large {
    transition: stroke-dashoffset 0.8s ease-in-out;
}

.fats-icon-large {
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
    color: #42a5f5;
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
    color: #42a5f5;
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
    background: rgba(66, 165, 245, 0.2);
    color: #42a5f5;
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
    background: rgba(66, 165, 245, 0.2);
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
    color: #42a5f5;
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
    color: #42a5f5;
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
