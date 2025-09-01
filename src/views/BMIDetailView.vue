<template>
  <div class="bmi-detail-view">
    <!-- Header -->
    <header class="header">
      <button @click="$router.back()" class="back-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      <h1 class="title">{{ $t('bmiDetail.title') }}</h1>
    </header>

    <!-- Current BMI Section -->
    <div class="current-bmi-section">
      <div class="bmi-main-card">
        <div class="bmi-value-display">
          <span class="bmi-number" :style="{ color: currentBMI.categoryColor }">
            {{ currentBMI.value }}
          </span>
          <span class="bmi-unit">BMI</span>
        </div>
        <div class="bmi-category" :style="{ color: currentBMI.categoryColor }">
          {{ currentBMI.category }}
        </div>
        <div class="bmi-description">
          {{ currentBMI.description }}
        </div>
      </div>

      <!-- BMI Scale -->
      <div class="bmi-scale-container">
        <h3 class="section-subtitle">{{ $t('bmiDetail.bmiScale') }}</h3>
        <div class="bmi-scale-detailed">
          <div class="bmi-scale-bar">
            <div class="scale-segment underweight"></div>
            <div class="scale-segment normal"></div>
            <div class="scale-segment overweight"></div>
            <div class="scale-segment obese"></div>
            <div class="bmi-indicator" :style="{ left: getBMIPosition(currentBMI.value) + '%' }">
              <div class="indicator-dot"></div>
              <div class="indicator-label">{{ currentBMI.value }}</div>
            </div>
          </div>
          <div class="scale-labels">
            <div class="scale-label">
              <span class="label-value">< 18.5</span>
              <span class="label-text">{{ $t('bmiDetail.underweight') }}</span>
            </div>
            <div class="scale-label">
              <span class="label-value">18.5 - 24.9</span>
              <span class="label-text">{{ $t('bmiDetail.normal') }}</span>
            </div>
            <div class="scale-label">
              <span class="label-value">25 - 29.9</span>
              <span class="label-text">{{ $t('bmiDetail.overweight') }}</span>
            </div>
            <div class="scale-label">
              <span class="label-value">≥ 30</span>
              <span class="label-text">{{ $t('bmiDetail.obese') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BMI History Chart -->
    <div class="bmi-chart-section">
      <h3 class="section-title">{{ $t('bmiDetail.bmiHistory') }}</h3>
      <div class="chart-period-selector">
        <button 
          v-for="period in chartPeriods" 
          :key="period.value"
          @click="selectedChartPeriod = period.value"
          :class="['period-btn', { active: selectedChartPeriod === period.value }]"
        >
          {{ period.label }}
        </button>
      </div>
      <BMIChart 
        :data="getBMIChartData()"
        :period="selectedChartPeriod"
      />
    </div>

    <!-- Health Information -->
    <div class="health-info-section">
      <h3 class="section-title">{{ $t('bmiDetail.healthInformation') }}</h3>
      
      <div class="info-cards">
        <div class="info-card">
          <div class="info-icon healthy-weight">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="info-content">
            <h4>{{ $t('bmiDetail.healthyWeightRange') }}</h4>
            <p>{{ getHealthyWeightRange() }} kg</p>
            <span class="info-description">{{ $t('bmiDetail.healthyWeightDescription') }}</span>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon target-weight">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div class="info-content">
            <h4>{{ $t('bmiDetail.targetBMI') }}</h4>
            <p>{{ targetBMI }}</p>
            <span class="info-description">{{ $t('bmiDetail.targetBMIDescription') }}</span>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon weight-to-goal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
            </svg>
          </div>
          <div class="info-content">
            <h4>{{ weightToGoalTitle }}</h4>
            <p>{{ weightToGoal }} kg</p>
            <span class="info-description">{{ weightToGoalDescription }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Health Tips -->
    <div class="health-tips-section">
      <h3 class="section-title">{{ $t('bmiDetail.healthTips') }}</h3>
      <div class="tips-container">
        <div v-for="tip in getHealthTips()" :key="tip.id" class="tip-card">
          <div class="tip-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4-4H7v2h10V7zM5 5h14v2H5V5z"/>
            </svg>
          </div>
          <div class="tip-content">
            <h4>{{ tip.title }}</h4>
            <p>{{ tip.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- BMI Calculator -->
    <div class="bmi-calculator-section">
      <h3 class="section-title">{{ $t('bmiDetail.bmiCalculator') }}</h3>
      <div class="calculator-card">
        <div class="calculator-inputs">
          <div class="input-group">
            <label>{{ $t('bmiDetail.height') }} (cm)</label>
            <input 
              v-model.number="calculatorHeight" 
              type="number" 
              min="100" 
              max="250"
              class="calculator-input"
            />
          </div>
          <div class="input-group">
            <label>{{ $t('bmiDetail.weight') }} (kg)</label>
            <input 
              v-model.number="calculatorWeight" 
              type="number" 
              min="30" 
              max="300" 
              step="0.1"
              class="calculator-input"
            />
          </div>
        </div>
        <div v-if="calculatedBMI" class="calculator-result">
          <div class="result-bmi">
            <span class="result-label">{{ $t('bmiDetail.calculatedBMI') }}:</span>
            <span class="result-value" :style="{ color: getCalculatedBMICategory().color }">
              {{ calculatedBMI }}
            </span>
          </div>
          <div class="result-category" :style="{ color: getCalculatedBMICategory().color }">
            {{ getCalculatedBMICategory().category }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BMIChart from '../components/charts/BMIChart.vue'
import { WeightTracker, type WeightEntry } from '../utils/weightTracking'
import { userProfile } from '../stores/userStore'

const { t } = useI18n()

// BMI Data
const currentBMI = ref({
  value: 0,
  category: 'Normal',
  categoryColor: '#4CAF50',
  description: 'Berechnung läuft...'
})

// Weight entries for BMI calculation
const weightEntries = ref<WeightEntry[]>([])
const userHeight = ref<number>(175)

// Reactive values for weight goal info
const weightToGoalTitle = ref<string>('')
const weightToGoal = ref<string>('0.0')
const weightToGoalDescription = ref<string>('')

// Chart periods
const chartPeriods = ref([
  { value: '3months', label: t('bmiDetail.last3Months') },
  { value: '6months', label: t('bmiDetail.last6Months') },
  { value: '1year', label: t('bmiDetail.lastYear') },
  { value: 'all', label: t('bmiDetail.allTime') }
])

const selectedChartPeriod = ref('3months')

// BMI Calculator
const calculatorHeight = ref<number>(175)
const calculatorWeight = ref<number>(70)

const targetBMI = computed(() => '22.0')

const calculatedBMI = computed(() => {
  if (calculatorHeight.value && calculatorWeight.value) {
    const heightInM = calculatorHeight.value / 100
    const bmi = calculatorWeight.value / (heightInM * heightInM)
    return Math.round(bmi * 10) / 10
  }
  return null
})

// Methods
const getBMIPosition = (bmi: number): number => {
  // Map BMI value to position on scale (0-100%)
  if (bmi < 18.5) return (bmi / 18.5) * 25
  if (bmi < 25) return 25 + ((bmi - 18.5) / 6.5) * 25
  if (bmi < 30) return 50 + ((bmi - 25) / 5) * 25
  return Math.min(75 + ((bmi - 30) / 10) * 25, 100)
}

const getBMIChartData = () => {
  // Filter entries based on selected period
  const now = new Date()
  const cutoffDate = new Date()
  
  switch (selectedChartPeriod.value) {
    case '3months':
      cutoffDate.setMonth(now.getMonth() - 3)
      break
    case '6months':
      cutoffDate.setMonth(now.getMonth() - 6)
      break
    case '1year':
      cutoffDate.setFullYear(now.getFullYear() - 1)
      break
    case 'all':
      cutoffDate.setFullYear(2020) // Far back enough to include all data
      break
  }
  
  const filteredEntries = weightEntries.value
    .filter(entry => new Date(entry.date) >= cutoffDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  // Calculate BMI for each weight entry
  return filteredEntries.map(entry => {
    const heightInM = userHeight.value / 100
    const bmi = entry.weight / (heightInM * heightInM)
    return {
      date: entry.date,
      bmi: Math.round(bmi * 10) / 10
    }
  })
}

const getHealthyWeightRange = (): string => {
  const height = userHeight.value
  const heightInM = height / 100
  const minWeight = Math.round(18.5 * heightInM * heightInM * 10) / 10
  const maxWeight = Math.round(24.9 * heightInM * heightInM * 10) / 10
  return `${minWeight} - ${maxWeight}`
}

const getCalculatedBMICategory = () => {
  if (!calculatedBMI.value) return { category: '', color: '#ffffff' }
  
  const bmi = calculatedBMI.value
  if (bmi < 18.5) return { category: t('bmiDetail.underweight'), color: '#2196F3' }
  if (bmi < 25) return { category: t('bmiDetail.normal'), color: '#4CAF50' }
  if (bmi < 30) return { category: t('bmiDetail.overweight'), color: '#FF9800' }
  return { category: t('bmiDetail.obese'), color: '#F44336' }
}

const getHealthTips = () => {
  const bmi = currentBMI.value.value
  
  if (bmi < 18.5) {
    return [
      {
        id: 1,
        title: t('bmiDetail.tip1UnderweightTitle'),
        description: t('bmiDetail.tip1UnderweightDesc')
      },
      {
        id: 2,
        title: t('bmiDetail.tip2UnderweightTitle'),
        description: t('bmiDetail.tip2UnderweightDesc')
      }
    ]
  } else if (bmi >= 25) {
    return [
      {
        id: 1,
        title: t('bmiDetail.tip1OverweightTitle'),
        description: t('bmiDetail.tip1OverweightDesc')
      },
      {
        id: 2,
        title: t('bmiDetail.tip2OverweightTitle'),
        description: t('bmiDetail.tip2OverweightDesc')
      }
    ]
  } else {
    return [
      {
        id: 1,
        title: t('bmiDetail.tip1NormalTitle'),
        description: t('bmiDetail.tip1NormalDesc')
      },
      {
        id: 2,
        title: t('bmiDetail.tip2NormalTitle'),
        description: t('bmiDetail.tip2NormalDesc')
      }
    ]
  }
}

const loadData = async () => {
  try {
    // Load weight entries
    weightEntries.value = await WeightTracker.getWeightEntries()
    
    // Get user height
    userHeight.value = userProfile.height || 175
    
    // Calculate current BMI
    const weightStats = await WeightTracker.getWeightStats()
    if (weightStats.currentWeight && userHeight.value) {
      const bmiData = WeightTracker.calculateBMI(weightStats.currentWeight, userHeight.value)
      currentBMI.value = {
        value: bmiData.value,
        category: WeightTracker.getBMICategoryText(bmiData.category),
        categoryColor: bmiData.categoryColor,
        description: getBMIDescription(bmiData.value)
      }
      
      // Update calculator with current values
      calculatorHeight.value = userHeight.value
      calculatorWeight.value = weightStats.currentWeight
    }
    
    // Load weight goal information
    await loadWeightGoalInfo()
  } catch (error) {
    console.error('Error loading BMI data:', error)
  }
}

const loadWeightGoalInfo = async () => {
  try {
    const weightStats = await WeightTracker.getWeightStats()
    const goal = await WeightTracker.getWeightGoal()
    
    if (!weightStats.currentWeight || !goal) {
      weightToGoalTitle.value = t('bmiDetail.weightMaintained')
      weightToGoal.value = '0.0'
      weightToGoalDescription.value = t('bmiDetail.weightMaintainedDescription')
      return
    }
    
    const currentWeight = weightStats.currentWeight
    const targetWeight = goal.targetWeight
    const difference = Math.abs(currentWeight - targetWeight)
    
    weightToGoal.value = difference.toFixed(1)
    
    if (currentWeight > targetWeight) {
      weightToGoalTitle.value = t('bmiDetail.weightToLose')
      weightToGoalDescription.value = t('bmiDetail.weightToLoseDescription')
    } else if (currentWeight < targetWeight) {
      weightToGoalTitle.value = t('bmiDetail.weightToGain')
      weightToGoalDescription.value = t('bmiDetail.weightToGainDescription')
    } else {
      weightToGoalTitle.value = t('bmiDetail.weightMaintained')
      weightToGoalDescription.value = t('bmiDetail.weightMaintainedDescription')
    }
  } catch (error) {
    console.error('Error loading weight goal info:', error)
  }
}

onMounted(() => {
  loadData()
})

const getBMIDescription = (bmi: number): string => {
  if (bmi < 18.5) return t('bmiDetail.underweightDescription')
  if (bmi < 25) return t('bmiDetail.normalDescription')
  if (bmi < 30) return t('bmiDetail.overweightDescription')
  return t('bmiDetail.obeseDescription')
}
</script>

<style scoped>
.bmi-detail-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1d26 0%, #2a2d37 100%);
  color: #ffffff;
  padding-bottom: 20px;
}

.header {
  display: flex;
  align-items: center;
  padding: 60px 20px 20px 20px;
  position: sticky;
  top: 0;
  background: rgba(26, 29, 38, 0.95);
  backdrop-filter: blur(10px);
  z-index: 100;
}

.back-btn {
  background: none;
  border: none;
  color: #ffffff;
  padding: 8px;
  margin-right: 12px;
  border-radius: 12px;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.current-bmi-section {
  padding: 0 20px 30px;
}

.bmi-main-card {
  background: linear-gradient(135deg, #2a2d37 0%, #343a47 100%);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bmi-value-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.bmi-number {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
}

.bmi-unit {
  font-size: 18px;
  font-weight: 600;
  color: #9ca3af;
}

.bmi-category {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.bmi-description {
  font-size: 16px;
  color: #9ca3af;
  line-height: 1.4;
}

.bmi-scale-container {
  margin-top: 24px;
}

.section-subtitle {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ffffff;
}

.bmi-scale-detailed {
  background: linear-gradient(135deg, #2a2d37 0%, #343a47 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bmi-scale-bar {
  position: relative;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  margin-bottom: 20px;
}

.scale-segment {
  flex: 1;
  height: 100%;
}

.scale-segment.underweight {
  background: #2196F3;
}

.scale-segment.normal {
  background: #4CAF50;
}

.scale-segment.overweight {
  background: #FF9800;
}

.scale-segment.obese {
  background: #F44336;
}

.bmi-indicator {
  position: absolute;
  top: -8px;
  transform: translateX(-50%);
  z-index: 10;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
  margin: 0 auto 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.indicator-label {
  font-size: 12px;
  font-weight: 600;
  background: #ffffff;
  color: #1a1d26;
  padding: 2px 6px;
  border-radius: 8px;
  white-space: nowrap;
}

.scale-labels {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.scale-label {
  text-align: center;
}

.label-value {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
}

.label-text {
  display: block;
  font-size: 11px;
  color: #9ca3af;
}

.bmi-chart-section,
.health-info-section,
.health-tips-section,
.bmi-calculator-section {
  padding: 0 20px;
  margin-bottom: 30px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.chart-period-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.period-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s;
}

.period-btn.active {
  background: #007AFF;
  border-color: #007AFF;
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  background: linear-gradient(135deg, #2a2d37 0%, #343a47 100%);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon.healthy-weight {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
}

.info-icon.target-weight {
  background: linear-gradient(135deg, #007AFF 0%, #0056b3 100%);
}

.info-icon.weight-to-goal {
  background: linear-gradient(135deg, #FF9800 0%, #e68900 100%);
}

.info-content h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #ffffff;
}

.info-content p {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #007AFF;
}

.info-description {
  font-size: 14px;
  color: #9ca3af;
  line-height: 1.4;
}

.tips-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-card {
  background: linear-gradient(135deg, #2a2d37 0%, #343a47 100%);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  gap: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tip-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #007AFF 0%, #0056b3 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tip-content h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #ffffff;
}

.tip-content p {
  font-size: 14px;
  color: #9ca3af;
  line-height: 1.5;
  margin: 0;
}

.calculator-card {
  background: linear-gradient(135deg, #2a2d37 0%, #343a47 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.calculator-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
}

.calculator-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  color: #ffffff;
  transition: all 0.2s;
}

.calculator-input:focus {
  outline: none;
  border-color: #007AFF;
  background: rgba(255, 255, 255, 0.15);
}

.calculator-result {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.result-bmi {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.result-label {
  font-size: 16px;
  color: #9ca3af;
}

.result-value {
  font-size: 24px;
  font-weight: 700;
}

.result-category {
  font-size: 18px;
  font-weight: 600;
}
</style>
