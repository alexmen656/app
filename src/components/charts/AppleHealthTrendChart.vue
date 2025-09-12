<template>
    <div class="apple-health-trend-chart">
        <svg width="100%" height="290" viewBox="0 0 415 290" class="dynamic-trend-chart">
            <!-- Grid lines (horizontal trend lines) -->
            <defs>
                <pattern id="grid" width="50" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1"/>
                </pattern>
            </defs>
            <rect width="405" height="240" x="5" y="25" fill="url(#grid)" opacity="0.3"/>
            
            <!-- Horizontal reference lines -->
            <line v-if="chartData.length > 0" 
                  x1="15" y1="50" x2="405" y2="50" 
                  stroke="rgba(255, 255, 255, 0.15)" stroke-width="2" stroke-dasharray="3,3"/>
            <line v-if="chartData.length > 0" 
                  x1="15" y1="120" x2="405" y2="120" 
                  stroke="rgba(255, 255, 255, 0.15)" stroke-width="2" stroke-dasharray="3,3"/>
            <line v-if="chartData.length > 0" 
                  x1="15" y1="190" x2="405" y2="190" 
                  stroke="rgba(255, 255, 255, 0.15)" stroke-width="2" stroke-dasharray="3,3"/>
            <line v-if="chartData.length > 0" 
                  x1="15" y1="260" x2="405" y2="260" 
                  stroke="rgba(255, 255, 255, 0.15)" stroke-width="2" stroke-dasharray="3,3"/>
            
            <!-- Background: Individual data points curve -->
            <path v-if="individualDataPath" 
                  :d="individualDataPath" 
                  stroke="rgba(255, 255, 255, 0.2)" stroke-width="6" fill="none"
                  stroke-linecap="round" stroke-linejoin="round"/>
            
            <!-- Background: Individual data points -->
            <g v-for="(point, index) in individualDataPoints" :key="'data-' + index">
                <circle :cx="point.x" :cy="point.y" r="4" 
                        fill="rgba(255, 255, 255, 0.3)" 
                        stroke="rgba(30, 30, 46, 0.8)" stroke-width="1">
                    <title>{{ formatDateLabel(point.date) }}: {{ point.value }} kcal</title>
                </circle>
            </g>
            
            <!-- Background line (older period average) - FULL WIDTH on left half -->
            <path v-if="longTermTrendPath" 
                  :d="longTermTrendPath" 
                  stroke="rgba(255, 255, 255, 0.4)" stroke-width="6" fill="none"
                  stroke-linecap="round"/>
            
            <!-- Background average value label -->
            <g v-if="longTermTrendPoints.length > 0">
                <text :x="longTermTrendPoints[0].x + 60" :y="longTermTrendPoints[0].y - 8" 
                      fill="rgba(255, 255, 255, 0.6)" font-size="16" font-weight="700">
                    Ø {{ baselineTrendValue }}
                </text>
            </g>
            
            <!-- Foreground line (recent 3-day average) - FULL WIDTH on right half -->
            <path v-if="shortTermTrendPath" 
                  :d="shortTermTrendPath" 
                  stroke="#ff6b35" stroke-width="8" fill="none"
                  stroke-linecap="round"/>
            
            <!-- Foreground average value label -->
            <g v-if="shortTermTrendPoints.length > 0">
                <text :x="shortTermTrendPoints[1].x - 60" :y="shortTermTrendPoints[0].y - 8" 
                      fill="#ff6b35" font-size="16" font-weight="800">
                    Ø {{ currentTrendValue }}
                </text>
            </g>
            
            <!-- Period labels -->
            <g v-if="chartData.length >= 6">
                <text x="140" y="280" fill="rgba(255, 255, 255, 0.5)" font-size="14" font-weight="600" text-anchor="middle">
                    Vorherige Periode
                </text>
                <text x="310" y="280" fill="rgba(255, 255, 255, 0.5)" font-size="14" font-weight="600" text-anchor="middle">
                    Letzte 3 Tage
                </text>
            </g>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface ChartDataPoint {
    date: string
    calories: number
}

const props = defineProps<{
    chartData: ChartDataPoint[]
    selectedPeriod: 'week' | 'month' | 'year'
}>()

// Chart dimensions - using full width
const svgWidth = 415  // Increased by 15% for better width usage
const svgHeight = 290  // Increased by 15% for proportional height
const padding = 5     // Minimal padding for maximum width usage
const usableWidth = svgWidth - 2 * padding
const usableHeight = svgHeight - 50

// Computed properties for trend calculations
const longTermTrendPoints = computed(() => {
    if (props.chartData.length < 6) return []
    
    // Split data into two halves
    const halfPoint = Math.floor(props.chartData.length / 2)
    const olderData = props.chartData.slice(0, halfPoint)
    
    if (olderData.length === 0) return []
    
    // Calculate average of older period
    const olderAverage = olderData.reduce((sum, item) => sum + item.calories, 0) / olderData.length
    
    const points: Array<{ x: number; y: number; value: number }> = []
    
    // Use all data for scaling
    const allValues = props.chartData.map(item => item.calories)
    const maxValue = Math.max(...allValues)
    const minValue = Math.min(...allValues)
    const valueRange = maxValue - minValue || 1
    
    // Create horizontal line for older period average
    const normalizedValue = (olderAverage - minValue) / valueRange
    const y = padding + 20 + ((1 - normalizedValue) * usableHeight)
    
    // Gray line spans from left edge to EXACTLY the middle (transition point)
    const startX = padding + 10
    const endX = svgWidth / 2  // Exactly half of the SVG width
    
    points.push({ x: startX, y, value: olderAverage })
    points.push({ x: endX, y, value: olderAverage })
    
    return points
})

const shortTermTrendPoints = computed(() => {
    if (props.chartData.length < 6) return []
    
    // Get last 3 days for recent trend
    const recentData = props.chartData.slice(-3)
    
    if (recentData.length === 0) return []
    
    // Calculate average of recent 3 days
    const recentAverage = recentData.reduce((sum, item) => sum + item.calories, 0) / recentData.length
    
    const points: Array<{ x: number; y: number; value: number }> = []
    
    // Use all data for scaling
    const allValues = props.chartData.map(item => item.calories)
    const maxValue = Math.max(...allValues)
    const minValue = Math.min(...allValues)
    const valueRange = maxValue - minValue || 1
    
    // Create horizontal line for recent period average
    const normalizedValue = (recentAverage - minValue) / valueRange
    const y = padding + 20 + ((1 - normalizedValue) * usableHeight)
    
    // Orange line spans from EXACTLY the middle to right edge
    const startX = svgWidth / 2  // Exactly half of the SVG width
    const endX = svgWidth - padding - 10
    
    points.push({ x: startX, y, value: recentAverage })
    points.push({ x: endX, y, value: recentAverage })
    
    return points
})

const individualDataPoints = computed(() => {
    if (props.chartData.length === 0) return []
    
    const points: Array<{ x: number; y: number; value: number; date: string }> = []
    
    // Use all data for scaling
    const allValues = props.chartData.map(item => item.calories)
    const maxValue = Math.max(...allValues)
    const minValue = Math.min(...allValues)
    const valueRange = maxValue - minValue || 1
    
    // Create points for EACH individual day/period
    props.chartData.forEach((item, index) => {
        const x = padding + 10 + (index / Math.max(props.chartData.length - 1, 1)) * (usableWidth - 20)
        const normalizedValue = (item.calories - minValue) / valueRange
        const y = padding + 20 + ((1 - normalizedValue) * usableHeight)
        points.push({ x, y, value: item.calories, date: item.date })
    })
    
    return points
})

const individualDataPath = computed(() => {
    if (individualDataPoints.value.length < 2) return ''
    
    const points = individualDataPoints.value
    
    // Use smooth curve (Bézier curves) for better visualization
    let path = `M ${points[0].x} ${points[0].y}`
    
    for (let i = 1; i < points.length; i++) {
        const prevPoint = points[i - 1]
        const currentPoint = points[i]
        
        // Calculate control points for smooth curves
        const cp1x = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.3
        const cp1y = prevPoint.y
        const cp2x = currentPoint.x - (currentPoint.x - prevPoint.x) * 0.3
        const cp2y = currentPoint.y
        
        path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${currentPoint.x} ${currentPoint.y}`
    }
    
    return path
})

const longTermTrendPath = computed(() => {
    if (longTermTrendPoints.value.length < 2) return ''
    
    const points = longTermTrendPoints.value
    // Simple straight line for average
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
})

const shortTermTrendPath = computed(() => {
    if (shortTermTrendPoints.value.length < 2) return ''
    
    const points = shortTermTrendPoints.value
    // Simple straight line for average
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
})

const currentTrendValue = computed(() => {
    if (props.chartData.length < 3) return '0'
    const recent3Days = props.chartData.slice(-3)
    const average = recent3Days.reduce((sum, item) => sum + item.calories, 0) / recent3Days.length
    return `${Math.round(average)}`
})

const baselineTrendValue = computed(() => {
    if (props.chartData.length < 6) return '0'
    const halfPoint = Math.floor(props.chartData.length / 2)
    const olderData = props.chartData.slice(0, halfPoint)
    const average = olderData.reduce((sum, item) => sum + item.calories, 0) / olderData.length
    return `${Math.round(average)}`
})

// Helper function
function formatDateLabel(dateStr: string): string {
    const date = new Date(dateStr)
    if (props.selectedPeriod === 'week') {
        return date.toLocaleDateString('de-DE', { weekday: 'short' })
    } else if (props.selectedPeriod === 'month') {
        return date.toLocaleDateString('de-DE', { day: '2-digit' })
    } else {
        return date.toLocaleDateString('de-DE', { month: 'short' })
    }
}
</script>

<style scoped>
.apple-health-trend-chart {
    height: 290px;
    width: 100%;
    min-width: 0;
    overflow: visible;
}

.apple-health-trend-chart svg {
    width: 100%;
    height: 100%;
}

/* Advanced Chart Animations */
.dynamic-trend-chart {
    overflow: visible;
}

.dynamic-trend-chart path {
    transition: stroke-width 0.3s ease;
}

.dynamic-trend-chart:hover path {
    stroke-width: 4px;
}

.dynamic-trend-chart circle {
    transition: all 0.3s ease;
}

.dynamic-trend-chart:hover circle {
    r: 5;
}

/* Grid pattern styling */
.dynamic-trend-chart rect {
    opacity: 0.2;
    transition: opacity 0.3s ease;
}

.dynamic-trend-chart:hover rect {
    opacity: 0.4;
}

/* Value indicators styling */
.dynamic-trend-chart rect[fill*="rgba(255, 107, 53"] {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.dynamic-trend-chart rect[fill*="rgba(255, 255, 255"] {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* Responsive adjustments */
@media (max-width: 480px) {
    .apple-health-trend-chart {
        height: 250px;
    }
}
</style>
