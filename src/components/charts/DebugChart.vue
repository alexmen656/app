<template>
  <div class="debug-chart-container">
    <div class="debug-chart-header">
      <h4 class="debug-chart-title">{{ title }}</h4>
      <span class="debug-badge">DEBUG</span>
    </div>
    
    <div class="debug-chart-content">
      <template v-if="type === 'performance'">
        <div class="performance-metrics">
          <div class="metric-item">
            <span class="metric-label">Scan Speed</span>
            <div class="metric-bar">
              <div class="metric-fill" :style="{ width: `${scanSpeed}%` }"></div>
            </div>
            <span class="metric-value">{{ scanSpeed }}ms</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Cache Hit Rate</span>
            <div class="metric-bar">
              <div class="metric-fill success" :style="{ width: `${cacheHitRate}%` }"></div>
            </div>
            <span class="metric-value">{{ cacheHitRate }}%</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">API Response</span>
            <div class="metric-bar">
              <div class="metric-fill warning" :style="{ width: `${apiResponse}%` }"></div>
            </div>
            <span class="metric-value">{{ apiResponse }}ms</span>
          </div>
        </div>
      </template>

      <template v-else-if="type === 'storage'">
        <div class="storage-breakdown">
          <div class="storage-chart">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <!-- Background circle -->
              <circle cx="60" cy="60" r="50" fill="none" stroke="#2a2d37" stroke-width="10"/>
              <!-- Scans circle -->
              <circle cx="60" cy="60" r="50" fill="none" stroke="#ff6b6b" stroke-width="10" 
                      :stroke-dasharray="circumference" 
                      :stroke-dashoffset="circumference - (circumference * storageData.scans / 100)"
                      stroke-linecap="round" transform="rotate(-90 60 60)"/>
              <!-- Cache circle -->
              <circle cx="60" cy="60" r="40" fill="none" stroke="#ffa726" stroke-width="8" 
                      :stroke-dasharray="circumference * 0.8" 
                      :stroke-dashoffset="circumference * 0.8 - (circumference * 0.8 * storageData.cache / 100)"
                      stroke-linecap="round" transform="rotate(-90 60 60)"/>
            </svg>
            <div class="storage-center">
              <span class="storage-total">{{ storageData.total }}MB</span>
            </div>
          </div>
          <div class="storage-legend">
            <div class="legend-item">
              <div class="legend-color" style="background: #ff6b6b;"></div>
              <span>Scans ({{ storageData.scans }}%)</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #ffa726;"></div>
              <span>Cache ({{ storageData.cache }}%)</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #42a5f5;"></div>
              <span>Settings ({{ storageData.settings }}%)</span>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="type === 'usage'">
        <div class="usage-heatmap">
          <div class="heatmap-header">
            <span class="heatmap-title">Scan Activity (Last 30 Days)</span>
          </div>
          <div class="heatmap-grid">
            <div v-for="(day, index) in usageData" :key="index" 
                 class="heatmap-cell" 
                 :class="getHeatmapClass(day.value)"
                 :title="`${day.date}: ${day.value} scans`">
            </div>
          </div>
          <div class="heatmap-legend">
            <span class="legend-label">Less</span>
            <div class="heatmap-scale">
              <div class="scale-cell level-0"></div>
              <div class="scale-cell level-1"></div>
              <div class="scale-cell level-2"></div>
              <div class="scale-cell level-3"></div>
              <div class="scale-cell level-4"></div>
            </div>
            <span class="legend-label">More</span>
          </div>
        </div>
      </template>

      <template v-else-if="type === 'trend'">
        <div class="trend-comparison">
          <div class="trend-periods">
            <div class="period-card this-week">
              <div class="period-header">
                <span class="period-label">This Week</span>
                <div class="trend-indicator up">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 2l4 4H8v4H4V6H2l4-4z"/>
                  </svg>
                  +12%
                </div>
              </div>
              <div class="period-value">2,347</div>
              <div class="period-unit">kcal avg</div>
              
              <!-- Mini chart for this week -->
              <div class="mini-chart">
                <svg width="120" height="40" viewBox="0 0 120 40">
                  <polyline 
                    :points="thisWeekPoints" 
                    fill="none" 
                    stroke="#4caf50" 
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <!-- Average line -->
                  <line x1="0" y1="25" x2="120" y2="25" stroke="#4caf50" stroke-width="1" stroke-dasharray="3,3" opacity="0.7"/>
                  <!-- Data points -->
                  <circle v-for="(point, index) in thisWeekData" :key="index"
                          :cx="point.x" :cy="point.y" r="2" fill="#4caf50"/>
                </svg>
              </div>
            </div>
            
            <div class="period-card last-week">
              <div class="period-header">
                <span class="period-label">Last Week</span>
                <div class="trend-indicator down">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 10L2 6h2V2h4v4h2l-4 4z"/>
                  </svg>
                  -5%
                </div>
              </div>
              <div class="period-value">2,094</div>
              <div class="period-unit">kcal avg</div>
              
              <!-- Mini chart for last week -->
              <div class="mini-chart">
                <svg width="120" height="40" viewBox="0 0 120 40">
                  <polyline 
                    :points="lastWeekPoints" 
                    fill="none" 
                    stroke="#ff9800" 
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <!-- Average line -->
                  <line x1="0" y1="30" x2="120" y2="30" stroke="#ff9800" stroke-width="1" stroke-dasharray="3,3" opacity="0.7"/>
                  <!-- Data points -->
                  <circle v-for="(point, index) in lastWeekData" :key="index"
                          :cx="point.x" :cy="point.y" r="2" fill="#ff9800"/>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Comparison chart -->
          <div class="comparison-chart">
            <div class="comparison-header">
              <span class="comparison-title">Weekly Comparison</span>
            </div>
            <svg width="300" height="120" viewBox="0 0 300 120" class="comparison-svg">
              <!-- Grid lines -->
              <defs>
                <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                </pattern>
              </defs>
              <rect width="300" height="120" fill="url(#grid)" />
              
              <!-- Last week line -->
              <polyline 
                :points="lastWeekComparisonPoints" 
                fill="none" 
                stroke="#ff9800" 
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="0.8"
              />
              
              <!-- This week line -->
              <polyline 
                :points="thisWeekComparisonPoints" 
                fill="none" 
                stroke="#4caf50" 
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              
              <!-- Average trend line for this week -->
              <line 
                x1="20" 
                :y1="thisWeekTrendStart" 
                x2="280" 
                :y2="thisWeekTrendEnd" 
                stroke="#4caf50" 
                stroke-width="2" 
                stroke-dasharray="5,5"
                opacity="0.9"
              />
              
              <!-- Data points -->
              <g v-for="(point, index) in thisWeekComparisonData" :key="`this-${index}`">
                <circle :cx="point.x" :cy="point.y" r="3" fill="#4caf50" stroke="white" stroke-width="1"/>
              </g>
              <g v-for="(point, index) in lastWeekComparisonData" :key="`last-${index}`">
                <circle :cx="point.x" :cy="point.y" r="2" fill="#ff9800" stroke="white" stroke-width="1"/>
              </g>
              
              <!-- Labels -->
              <g class="chart-labels">
                <text v-for="(day, index) in dayLabels" :key="index"
                      :x="40 + index * 37" y="110" 
                      text-anchor="middle" 
                      fill="rgba(255,255,255,0.6)" 
                      font-size="10">
                  {{ day }}
                </text>
              </g>
            </svg>
            
            <!-- Legend -->
            <div class="comparison-legend">
              <div class="legend-item">
                <div class="legend-line this-week"></div>
                <span>This Week</span>
              </div>
              <div class="legend-item">
                <div class="legend-line last-week"></div>
                <span>Last Week</span>
              </div>
              <div class="legend-item">
                <div class="legend-line trend"></div>
                <span>Trend</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface DebugChartProps {
  title: string
  type: 'performance' | 'storage' | 'usage' | 'trend'
}

defineProps<DebugChartProps>()

// Performance metrics (simulated)
const scanSpeed = ref(245)
const cacheHitRate = ref(87)
const apiResponse = ref(156)

// Storage data (simulated)
const storageData = ref({
  total: 24.7,
  scans: 65,
  cache: 28,
  settings: 7
})

// Usage heatmap data (simulated for last 30 days)
const usageData = ref<Array<{ date: string; value: number }>>([])

// Trend chart data (Apple Fitness style)
const thisWeekData = ref<Array<{ x: number; y: number; value: number }>>([])
const lastWeekData = ref<Array<{ x: number; y: number; value: number }>>([])
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const circumference = computed(() => 2 * Math.PI * 50)

// Trend chart computed properties
const thisWeekPoints = computed(() => {
  return thisWeekData.value.map(point => `${point.x},${point.y}`).join(' ')
})

const lastWeekPoints = computed(() => {
  return lastWeekData.value.map(point => `${point.x},${point.y}`).join(' ')
})

const thisWeekComparisonData = computed(() => {
  return thisWeekData.value.map((point, index) => ({
    x: 40 + index * 37,
    y: 90 - (point.value / 3000) * 60, // Scale to chart height
    value: point.value
  }))
})

const lastWeekComparisonData = computed(() => {
  return lastWeekData.value.map((point, index) => ({
    x: 40 + index * 37,
    y: 90 - (point.value / 3000) * 60, // Scale to chart height
    value: point.value
  }))
})

const thisWeekComparisonPoints = computed(() => {
  return thisWeekComparisonData.value.map(point => `${point.x},${point.y}`).join(' ')
})

const lastWeekComparisonPoints = computed(() => {
  return lastWeekComparisonData.value.map(point => `${point.x},${point.y}`).join(' ')
})

const thisWeekTrendStart = computed(() => {
  if (thisWeekComparisonData.value.length < 2) return 60
  const values = thisWeekComparisonData.value.map(p => p.y)
  return values[0]
})

const thisWeekTrendEnd = computed(() => {
  if (thisWeekComparisonData.value.length < 2) return 60
  const values = thisWeekComparisonData.value.map(p => p.y)
  const slope = (values[values.length - 1] - values[0]) / (values.length - 1)
  return values[0] + slope * (values.length - 1)
})

onMounted(() => {
  generateMockData()
})

function generateMockData() {
  // Generate performance metrics
  scanSpeed.value = Math.floor(Math.random() * 300) + 150
  cacheHitRate.value = Math.floor(Math.random() * 20) + 80
  apiResponse.value = Math.floor(Math.random() * 200) + 100

  // Generate storage data
  const totalScans = Math.floor(Math.random() * 40) + 60
  const totalCache = Math.floor(Math.random() * 20) + 20
  const totalSettings = 100 - totalScans - totalCache
  
  storageData.value = {
    total: Math.round((Math.random() * 50 + 10) * 10) / 10,
    scans: totalScans,
    cache: totalCache,
    settings: totalSettings
  }

  // Generate usage heatmap data for last 30 days
  const today = new Date()
  usageData.value = []
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const value = Math.floor(Math.random() * 15) // 0-14 scans per day
    
    usageData.value.push({
      date: date.toISOString().split('T')[0],
      value
    })
  }

  // Generate trend data for this week and last week
  generateTrendData()
}

function generateTrendData() {
  // Generate this week data (7 days) with slight upward trend
  thisWeekData.value = []
  for (let i = 0; i < 7; i++) {
    const baseValue = 2200 + Math.random() * 400 // 2200-2600 range
    const trendValue = baseValue + (i * 20) // Slight upward trend
    const finalValue = trendValue + (Math.random() - 0.5) * 200 // Add some variance
    
    thisWeekData.value.push({
      x: 10 + i * 15,
      y: 35 - (finalValue / 3000) * 25, // Scale for mini chart
      value: Math.round(finalValue)
    })
  }

  // Generate last week data (7 days) with slight downward trend
  lastWeekData.value = []
  for (let i = 0; i < 7; i++) {
    const baseValue = 2300 + Math.random() * 300 // 2300-2600 range
    const trendValue = baseValue - (i * 15) // Slight downward trend
    const finalValue = trendValue + (Math.random() - 0.5) * 150 // Add some variance
    
    lastWeekData.value.push({
      x: 10 + i * 15,
      y: 35 - (finalValue / 3000) * 25, // Scale for mini chart
      value: Math.round(finalValue)
    })
  }
}

function getHeatmapClass(value: number): string {
  if (value === 0) return 'level-0'
  if (value <= 3) return 'level-1'
  if (value <= 6) return 'level-2'
  if (value <= 10) return 'level-3'
  return 'level-4'
}
</script>

<style scoped>
.debug-chart-container {
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  margin-bottom: 16px;
}

.debug-chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.debug-chart-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: white;
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

/* Performance Metrics */
.performance-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.metric-label {
  min-width: 100px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.metric-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  background: #42a5f5;
  border-radius: 4px;
  transition: width 0.8s ease;
}

.metric-fill.success {
  background: #4caf50;
}

.metric-fill.warning {
  background: #ffa726;
}

.metric-value {
  min-width: 50px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

/* Storage Breakdown */
.storage-breakdown {
  display: flex;
  align-items: center;
  gap: 24px;
}

.storage-chart {
  position: relative;
  flex-shrink: 0;
}

.storage-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.storage-total {
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.storage-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

/* Usage Heatmap */
.usage-heatmap {
  width: 100%;
}

.heatmap-header {
  margin-bottom: 12px;
}

.heatmap-title {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 2px;
  margin-bottom: 12px;
}

.heatmap-cell {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.heatmap-cell:hover {
  transform: scale(1.1);
}

.heatmap-cell.level-0 {
  background: rgba(255, 255, 255, 0.05);
}

.heatmap-cell.level-1 {
  background: rgba(66, 165, 245, 0.3);
}

.heatmap-cell.level-2 {
  background: rgba(66, 165, 245, 0.5);
}

.heatmap-cell.level-3 {
  background: rgba(66, 165, 245, 0.7);
}

.heatmap-cell.level-4 {
  background: rgba(66, 165, 245, 0.9);
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.legend-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.heatmap-scale {
  display: flex;
  gap: 2px;
}

.scale-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.scale-cell.level-0 {
  background: rgba(255, 255, 255, 0.05);
}

.scale-cell.level-1 {
  background: rgba(66, 165, 245, 0.3);
}

.scale-cell.level-2 {
  background: rgba(66, 165, 245, 0.5);
}

.scale-cell.level-3 {
  background: rgba(66, 165, 245, 0.7);
}

.scale-cell.level-4 {
  background: rgba(66, 165, 245, 0.9);
}

/* Trend Charts Styles */
.trend-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.trend-card {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 16px;
  position: relative;
}

.trend-period {
  color: #888;
  font-size: 12px;
  margin-bottom: 4px;
}

.trend-avg {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.trend-change {
  font-size: 12px;
  margin-bottom: 12px;
}

.trend-up {
  color: #10b981;
}

.trend-down {
  color: #ef4444;
}

.trend-mini-chart {
  width: 100%;
  height: 40px;
}

.trend-line {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.trend-area {
  opacity: 0.1;
}

.trend-dots {
  r: 2;
  opacity: 0.8;
}

.trend-grid {
  stroke: #333;
  stroke-width: 0.5;
  opacity: 0.3;
}

.comparison-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 12px;
  font-size: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #888;
}

.legend-line {
  width: 16px;
  height: 2px;
  border-radius: 1px;
}

.legend-line.this-week {
  background: #42a5f5;
}

.legend-line.last-week {
  background: #ff9800;
}

.legend-line.trend {
  background: #10b981;
}
</style>
