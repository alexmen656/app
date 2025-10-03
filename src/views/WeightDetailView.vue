<template>
  <div class="weight-detail-view">
    <!-- Header -->
    <header class="header">
      <button @click="$router.back()" class="back-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
      <h1 class="title">{{ $t('weightDetail.title') }}</h1>
      <button @click="showWeightLogModal = true" class="add-weight-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </button>
    </header>

    <!-- Current Weight Summary -->
    <div class="weight-summary-section">
      <div class="weight-main-card">
        <div class="weight-display">
          <div class="current-weight">
            <span class="weight-number">{{ currentWeight }}</span>
            <span class="weight-unit">kg</span>
          </div>
          <div class="weight-change" :class="{ 'positive': weightChange >= 0, 'negative': weightChange < 0 }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path v-if="weightChange >= 0" d="M7 14l5-5 5 5H7z" />
              <path v-else d="M7 10l5 5 5-5H7z" />
            </svg>
            {{ weightChange >= 0 ? '+' : '' }}{{ Math.abs(weightChange).toFixed(1) }}kg
            <span class="change-period">{{ $t('weightDetail.thisWeek') }}</span>
          </div>
        </div>

        <div class="weight-stats">
          <div class="stat-item">
            <span class="stat-label">{{ $t('weightDetail.target') }}</span>
            <span class="stat-value">{{ targetWeight }}kg</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ $t('weightDetail.remaining') }}</span>
            <span class="stat-value" :class="{ 'achieved': isGoalAchieved }">
              {{ isGoalAchieved ? $t('weightDetail.achieved') : Math.abs(currentWeight - targetWeight).toFixed(1) + 'kg'
              }}
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ $t('weightDetail.progress') }}</span>
            <span class="stat-value">{{ progressPercentage }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Weight Chart -->
    <div class="weight-chart-section">
      <div class="chart-header">
        <h3 class="section-title">{{ $t('weightDetail.weightTrend') }}</h3>
        <div class="chart-controls">
          <select v-model="selectedChartPeriod" class="period-select">
            <option value="week">{{ $t('weightDetail.lastWeek') }}</option>
            <option value="month">{{ $t('weightDetail.lastMonth') }}</option>
            <option value="3months">{{ $t('weightDetail.last3Months') }}</option>
            <option value="6months">{{ $t('weightDetail.last6Months') }}</option>
            <option value="year">{{ $t('weightDetail.lastYear') }}</option>
            <option value="all">{{ $t('weightDetail.allTime') }}</option>
          </select>
        </div>
      </div>

      <WeightChart :data="getWeightChartData()" :goal-weight="targetWeight" :current-weight="currentWeight"
        :period="selectedChartPeriod" :show-statistics="true" />
    </div>

    <!-- Weight Statistics -->
    <div class="weight-stats-section">
      <h3 class="section-title">{{ $t('weightDetail.statistics') }}</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon average">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-title">{{ $t('weightDetail.averageWeight') }}</span>
            <span class="stat-number">{{ averageWeight }}kg</span>
            <span class="stat-period">{{ getPeriodLabel(selectedChartPeriod) }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon highest">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14l5-5 5 5H7z" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-title">{{ $t('weightDetail.highestWeight') }}</span>
            <span class="stat-number">{{ highestWeight }}kg</span>
            <span class="stat-period">{{ getHighestWeightDate() }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon lowest">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-title">{{ $t('weightDetail.lowestWeight') }}</span>
            <span class="stat-number">{{ lowestWeight }}kg</span>
            <span class="stat-period">{{ getLowestWeightDate() }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon change">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-title">{{ $t('weightDetail.totalChange') }}</span>
            <span class="stat-number" :class="{ 'positive': totalChange >= 0, 'negative': totalChange < 0 }">
              {{ totalChange >= 0 ? '+' : '' }}{{ totalChange.toFixed(1) }}kg
            </span>
            <span class="stat-period">{{ getPeriodLabel(selectedChartPeriod) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Weight History -->
    <div class="weight-history-section">
      <h3 class="section-title">{{ $t('weightDetail.recentEntries') }}</h3>
      <div class="history-list">
        <div v-for="entry in recentWeightEntries" :key="entry.id" class="history-entry">
          <div>
            <div class="entry-date">
              <span class="date">{{ formatDate(entry.date) }}</span>
              <span class="time">{{ formatTime(entry.date) }}</span>
            </div>
            <div class="entry-weight">
              <span class="weight">{{ entry.weight }}kg</span>
              <span v-if="entry.change" class="change"
                :class="{ 'positive': entry.change >= 0, 'negative': entry.change < 0 }">
                {{ entry.change >= 0 ? '+' : '' }}{{ entry.change.toFixed(1) }}
              </span>
            </div>
            <button @click="deleteWeightEntry(entry.id)" class="delete-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </button>
          </div>
          <div class="entry-note" v-if="entry.note">
            {{ entry.note }}
          </div>
        </div>
      </div>
    </div>

    <!-- Goals and Milestones -->
    <div class="goals-section">
      <h3 class="section-title">{{ $t('weightDetail.goalsAndMilestones') }}</h3>
      <div class="goals-container">
        <div class="goal-card">
          <div class="goal-header">
            <h4>{{ $t('weightDetail.currentGoal') }}</h4>
            <span class="goal-progress">{{ progressPercentage }}%</span>
          </div>
          <div class="goal-bar">
            <div class="goal-fill" :style="{ width: Math.min(progressPercentage, 100) + '%' }"></div>
          </div>
          <div class="goal-details">
            <span>{{ startWeight }}kg → {{ targetWeight }}kg</span>
            <span class="remaining">{{ Math.abs(currentWeight - targetWeight).toFixed(1) }}kg {{
              $t('weightDetail.remaining') }}</span>
          </div>
        </div>

        <div class="milestones">
          <h4>{{ $t('weightDetail.milestones') }}</h4>
          <div class="milestone-list">
            <div v-for="milestone in milestones" :key="milestone.id" class="milestone-item"
              :class="{ completed: milestone.completed }">
              <div class="milestone-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path v-if="milestone.completed" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                  <circle v-else cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
                </svg>
              </div>
              <div class="milestone-content">
                <span class="milestone-title">{{ milestone.title }}</span>
                <span class="milestone-desc">{{ milestone.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Weight Log Modal -->
    <div v-if="showWeightLogModal" class="modal-overlay" @click="showWeightLogModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('weightDetail.logWeight') }}</h3>
          <button @click="showWeightLogModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="weight-input-section">
            <label class="modal-label">{{ $t('weightDetail.weight') }} (kg)</label>
            <input v-model="newWeight" type="number" step="0.1" min="30" max="300" class="modal-input"
              :placeholder="$t('weightDetail.enterWeight')" />
          </div>
          <div class="weight-input-section">
            <label class="modal-label">{{ $t('weightDetail.date') }}</label>
            <input v-model="newWeightDate" type="datetime-local" class="modal-input" />
          </div>
          <div class="weight-input-section">
            <label class="modal-label">{{ $t('weightDetail.note') }} ({{ $t('common.optional') }})</label>
            <input v-model="weightNote" type="text" class="modal-input"
              :placeholder="$t('weightDetail.notePlaceholder')" />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showWeightLogModal = false" class="modal-btn secondary">{{ $t('common.cancel') }}</button>
          <button @click="logWeight" class="modal-btn primary" :disabled="!newWeight">{{ $t('common.save') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import WeightChart from '../components/charts/WeightChart.vue'
import { WeightTracker, type WeightEntry } from '../utils/weightTracking'

const { t } = useI18n()

// Weight data
const currentWeight = ref(0)
const targetWeight = ref(0)
const startWeight = ref(0)
const weightChange = ref(0)
const weightEntries = ref<WeightEntry[]>([])

// Chart settings
const selectedChartPeriod = ref('month')

// Modal
const showWeightLogModal = ref(false)
const newWeight = ref<number | null>(null)
const newWeightDate = ref('')
const weightNote = ref('')

// Computed properties
const isGoalAchieved = computed(() => {
  return Math.abs(currentWeight.value - targetWeight.value) <= 0.5
})

const progressPercentage = computed(() => {
  if (startWeight.value === 0 || targetWeight.value === 0) return 0
  const totalGoal = Math.abs(startWeight.value - targetWeight.value)
  const currentProgress = Math.abs(startWeight.value - currentWeight.value)
  return Math.min(Math.round((currentProgress / totalGoal) * 100), 100)
})

const averageWeight = computed(() => {
  const entries = getFilteredEntries()
  if (entries.length === 0) return currentWeight.value.toFixed(1)
  const sum = entries.reduce((acc, entry) => acc + entry.weight, 0)
  return (sum / entries.length).toFixed(1)
})

const highestWeight = computed(() => {
  const entries = getFilteredEntries()
  if (entries.length === 0) return currentWeight.value.toFixed(1)
  return Math.max(...entries.map(entry => entry.weight)).toFixed(1)
})

const lowestWeight = computed(() => {
  const entries = getFilteredEntries()
  if (entries.length === 0) return currentWeight.value.toFixed(1)
  return Math.min(...entries.map(entry => entry.weight)).toFixed(1)
})

const totalChange = computed(() => {
  const entries = getFilteredEntries()
  if (entries.length < 2) return 0
  const oldest = entries[entries.length - 1]
  const newest = entries[0]
  return newest.weight - oldest.weight
})

const milestones = computed(() => [
  {
    id: 1,
    title: t('weightDetail.milestone1'),
    description: t('weightDetail.milestone1Desc'),
    completed: Math.abs(startWeight.value - currentWeight.value) >= 2
  },
  {
    id: 2,
    title: t('weightDetail.milestone2'),
    description: t('weightDetail.milestone2Desc'),
    completed: Math.abs(startWeight.value - currentWeight.value) >= 5
  },
  {
    id: 3,
    title: t('weightDetail.milestone3'),
    description: t('weightDetail.milestone3Desc'),
    completed: progressPercentage.value >= 50
  },
  {
    id: 4,
    title: t('weightDetail.milestone4'),
    description: t('weightDetail.milestone4Desc'),
    completed: isGoalAchieved.value
  }
])

// Recent weight entries (last 10)
const recentWeightEntries = computed(() => {
  return weightEntries.value.slice(0, 10).map((entry, index) => {
    const prevEntry = weightEntries.value[index + 1]
    const change = prevEntry ? entry.weight - prevEntry.weight : null

    return {
      id: entry.timestamp,
      date: new Date(entry.date),
      weight: entry.weight,
      change,
      note: entry.note || ''
    }
  })
})

// Methods
const getWeightChartData = () => {
  const now = new Date()
  const cutoffDate = new Date()

  switch (selectedChartPeriod.value) {
    case 'week':
      cutoffDate.setDate(now.getDate() - 7)
      break
    case 'month':
      cutoffDate.setMonth(now.getMonth() - 1)
      break
    case '3months':
      cutoffDate.setMonth(now.getMonth() - 3)
      break
    case '6months':
      cutoffDate.setMonth(now.getMonth() - 6)
      break
    case 'year':
      cutoffDate.setFullYear(now.getFullYear() - 1)
      break
    case 'all':
      return weightEntries.value
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(entry => ({
          date: entry.date,
          weight: entry.weight
        }))
  }

  return weightEntries.value
    .filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate >= cutoffDate && entryDate <= now
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      date: entry.date,
      weight: entry.weight
    }))
}

const getFilteredEntries = () => {
  const now = new Date()
  const cutoffDate = new Date()

  switch (selectedChartPeriod.value) {
    case 'week':
      cutoffDate.setDate(now.getDate() - 7)
      break
    case 'month':
      cutoffDate.setMonth(now.getMonth() - 1)
      break
    case '3months':
      cutoffDate.setMonth(now.getMonth() - 3)
      break
    case '6months':
      cutoffDate.setMonth(now.getMonth() - 6)
      break
    case 'year':
      cutoffDate.setFullYear(now.getFullYear() - 1)
      break
    case 'all':
      return weightEntries.value
  }

  return weightEntries.value.filter(entry => new Date(entry.date) >= cutoffDate)
}

const getPeriodLabel = (period: string) => {
  switch (period) {
    case 'week': return t('weightDetail.lastWeek')
    case 'month': return t('weightDetail.lastMonth')
    case '3months': return t('weightDetail.last3Months')
    case '6months': return t('weightDetail.last6Months')
    case 'year': return t('weightDetail.lastYear')
    case 'all': return t('weightDetail.allTime')
    default: return ''
  }
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getHighestWeightDate = () => {
  const entries = getFilteredEntries()
  if (entries.length === 0) return ''
  const highestEntry = entries.find(entry => entry.weight === parseFloat(String(highestWeight.value)))
  return highestEntry ? formatDate(new Date(highestEntry.date)) : ''
}

const getLowestWeightDate = () => {
  const entries = getFilteredEntries()
  if (entries.length === 0) return ''
  const lowestEntry = entries.find(entry => entry.weight === parseFloat(String(lowestWeight.value)))
  return lowestEntry ? formatDate(new Date(lowestEntry.date)) : ''
}

const logWeight = async () => {
  if (!newWeight.value) return

  try {
    // Add the weight entry
    await WeightTracker.addWeightEntry(newWeight.value, weightNote.value)

    // Reload data
    await loadData()

    // Reset form
    newWeight.value = null
    newWeightDate.value = ''
    weightNote.value = ''
    showWeightLogModal.value = false
  } catch (error) {
    console.error('Error logging weight:', error)
  }
}

const deleteWeightEntry = async (timestamp: number) => {
  try {
    // Remove the entry from the array
    const updatedEntries = weightEntries.value.filter(entry => entry.timestamp !== timestamp)
    await import('../utils/storage').then(({ Storage }) => Storage.set('weightEntries', updatedEntries))

    // Reload data
    await loadData()
  } catch (error) {
    console.error('Error deleting weight entry:', error)
  }
}

const loadData = async () => {
  try {
    // Load weight entries
    weightEntries.value = await WeightTracker.getWeightEntries()

    // Load weight statistics
    const weightStats = await WeightTracker.getWeightStats()
    if (weightStats.currentWeight) {
      currentWeight.value = weightStats.currentWeight
    }

    // Load weight goal
    const goal = await WeightTracker.getWeightGoal()
    if (goal) {
      targetWeight.value = goal.targetWeight
      startWeight.value = goal.startWeight
    }

    // Calculate weekly weight change
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const weekOldEntry = weightEntries.value.find(entry =>
      new Date(entry.date) <= oneWeekAgo
    )

    if (weekOldEntry) {
      weightChange.value = currentWeight.value - weekOldEntry.weight
    }

  } catch (error) {
    console.error('Error loading weight data:', error)
  }
}

onMounted(() => {
  // Set default date to now
  const now = new Date()
  newWeightDate.value = now.toISOString().slice(0, 16)

  // Load data
  loadData()
})
</script>

<style scoped>
.weight-detail-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1d26 0%, #2a2d37 100%);
  color: #ffffff;
  padding-bottom: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 20px 20px 20px;
  position: sticky;
  top: 0;
  background: rgba(26, 29, 38, 0.95);
  backdrop-filter: blur(10px);
  z-index: 100;
}

.back-btn,
.add-weight-btn {
  background: none;
  border: none;
  color: #ffffff;
  padding: 8px;
  border-radius: 12px;
  transition: background-color 0.2s;
}

.back-btn:hover,
.add-weight-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.add-weight-btn {
  background: #007AFF;
}

.title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  flex: 1;
  text-align: center;
}

.weight-summary-section {
  padding: 0 20px 30px;
}

.weight-main-card {
  background: linear-gradient(135deg, #2a2d37 0%, #343a47 100%);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.weight-display {
  text-align: center;
  margin-bottom: 24px;
}

.current-weight {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.weight-number {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
  color: #007AFF;
}

.weight-unit {
  font-size: 18px;
  font-weight: 600;
  color: #9ca3af;
}

.weight-change {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
}

.weight-change.positive {
  color: #F44336;
}

.weight-change.negative {
  color: #4CAF50;
}

.change-period {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
}

.weight-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.stat-value.achieved {
  color: #4CAF50;
}

.weight-chart-section,
.weight-stats-section,
.weight-history-section,
.goals-section {
  padding: 0 20px;
  margin-bottom: 30px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.period-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (max-width: 380px) {
  .stats-grid {
    gap: 10px;
  }

  .stat-card {
    padding: 14px;
    min-height: 110px;
  }

  .stat-icon {
    width: 36px;
    height: 36px;
  }

  .stat-icon svg {
    width: 20px;
    height: 20px;
  }

  .stat-title {
    font-size: 12px;
  }

  .stat-number {
    font-size: 18px;
  }

  .stat-period {
    font-size: 10px;
  }
}

.stat-card {
  background: linear-gradient(135deg, #2a2d37 0%, #343a47 100%);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 120px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  align-self: flex-start;
}

.stat-icon.average {
  background: linear-gradient(135deg, #007AFF 0%, #0056b3 100%);
}

.stat-icon.highest {
  background: linear-gradient(135deg, #F44336 0%, #d32f2f 100%);
}

.stat-icon.lowest {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
}

.stat-icon.change {
  background: linear-gradient(135deg, #FF9800 0%, #e68900 100%);
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-title {
  display: block;
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.3;
}

.stat-number {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
}

.stat-number.positive {
  color: #F44336;
}

.stat-number.negative {
  color: #4CAF50;
}

.stat-period {
  display: block;
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.3;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-entry {
  background: linear-gradient(135deg, #2a2d37 0%, #343a47 100%);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.history-entry>div:first-child {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  width: 100%;
}

.entry-date {
  display: flex;
  flex-direction: column;
}

.date {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.time {
  font-size: 12px;
  color: #9ca3af;
}

.entry-weight {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.weight {
  font-size: 18px;
  font-weight: 700;
  color: #007AFF;
}

.change {
  font-size: 12px;
  font-weight: 600;
}

.change.positive {
  color: #F44336;
}

.change.negative {
  color: #4CAF50;
}

.entry-note {
  font-size: 14px;
  color: #9ca3af;
  font-style: italic;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

.delete-btn {
  background: none;
  border: none;
  color: #F44336;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.delete-btn:hover {
  background: rgba(244, 67, 54, 0.1);
}

.goals-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.goal-card {
  background: linear-gradient(135deg, #2a2d37 0%, #343a47 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.goal-header h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.goal-progress {
  font-size: 16px;
  font-weight: 700;
  color: #007AFF;
}

.goal-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.goal-fill {
  height: 100%;
  background: linear-gradient(90deg, #007AFF 0%, #0056b3 100%);
  transition: width 0.3s ease;
}

.goal-details {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #9ca3af;
}

.remaining {
  color: #007AFF;
  font-weight: 600;
}

.milestones h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #ffffff;
}

.milestone-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.milestone-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.2s;
}

.milestone-item.completed {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.milestone-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.milestone-item.completed .milestone-icon {
  color: #4CAF50;
}

.milestone-content {
  flex: 1;
}

.milestone-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
}

.milestone-desc {
  display: block;
  font-size: 12px;
  color: #9ca3af;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(135deg, #2a2d37 0%, #343a47 100%);
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
}

.close-btn {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 24px;
  padding: 4px;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.weight-input-section {
  margin-bottom: 20px;
}

.modal-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
}

.modal-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  color: #ffffff;
  transition: all 0.2s;
}

.modal-input:focus {
  outline: none;
  border-color: #007AFF;
  background: rgba(255, 255, 255, 0.15);
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px 24px;
}

.modal-btn {
  flex: 1;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.modal-btn.primary {
  background: #007AFF;
  color: #ffffff;
}

.modal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
