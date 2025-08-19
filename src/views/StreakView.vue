<template>
  <div class="streak-view">
    <!-- Header -->
    <header class="header">
      <button @click="goBack" class="back-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z" />
        </svg>
      </button>
      <h1 class="title">{{ $t('streak.title') }}</h1>
    </header>

    <!-- Main Streak Display -->
    <div class="streak-hero">
      <div class="streak-flame">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="url(#flameGradient)">
          <defs>
            <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#ff8c42;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#ff4757;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path
            d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
        </svg>
      </div>
      <div class="streak-number" ref="streakCounter">
        {{ displayStreak }}
      </div>
      <div class="streak-label">{{ $t('streak.daysStreak') }}</div>

      <div class="streak-message">
        {{ getStreakMessage() }}
      </div>
    </div>

    <!-- Progress to Next Milestone -->
    <div class="milestone-section">
      <h3 class="section-title">{{ $t('streak.nextMilestone') }}</h3>
      <div class="milestone-card">
        <div class="milestone-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: milestoneProgress + '%' }"></div>
          </div>
          <div class="progress-text">
            {{ currentStreak }} / {{ nextMilestone }} {{ $t('streak.days') }}
          </div>
        </div>
        <div class="milestone-reward">
          <div class="reward-icon">{{ getMilestoneIcon(nextMilestone) }}</div>
          <div class="reward-text">{{ getMilestoneReward(nextMilestone) }}</div>
        </div>
      </div>
    </div>

    <!-- Achievement Badges -->
    <div class="achievements-section">
      <h3 class="section-title">{{ $t('streak.achievements') }}</h3>
      <div class="achievements-grid">
        <div v-for="achievement in achievements" :key="achievement.id" class="achievement-badge"
          :class="{ 'earned': achievement.earned, 'locked': !achievement.earned }">
          <div class="badge-icon">{{ achievement.icon }}</div>
          <div class="badge-name">{{ achievement.name }}</div>
          <div class="badge-requirement">{{ achievement.requirement }}</div>
        </div>
      </div>
    </div>

    <!-- Streak History -->
    <div class="history-section">
      <h3 class="section-title">{{ $t('streak.history') }}</h3>
      <div class="history-calendar">
        <div v-for="day in last30Days" :key="day.date" class="calendar-day"
          :class="{ 'active': day.hasLog, 'today': day.isToday }">
          <div class="day-number">{{ day.dayNumber }}</div>
          <div class="day-indicator">
            <svg v-if="day.hasLog" width="16" height="16" viewBox="0 0 24 24" fill="#007052">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Motivational Stats -->
    <div class="stats-section">
      <h3 class="section-title">{{ $t('streak.stats') }}</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">{{ totalLogged }}</div>
          <div class="stat-label">{{ $t('streak.totalDaysLogged') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ longestStreak }}</div>
          <div class="stat-label">{{ $t('streak.longestStreak') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ averageCalories }}</div>
          <div class="stat-label">{{ $t('streak.avgCalories') }}</div>
        </div>
      </div>
    </div>

    <!-- Motivational Quote -->
    <div class="motivation-section">
      <div class="quote-card">
        <div class="quote-icon">💪</div>
        <div class="quote-text">{{ getMotivationalQuote() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { StreakManager } from '../utils/widgetData'
import { ScanHistory } from '../utils/storage'

const router = useRouter()
const { t } = useI18n()

const currentStreak = ref(0)
const longestStreak = ref(0)
const totalLogged = ref(0)
const averageCalories = ref(0)
const streakCounter = ref<HTMLElement>()
const displayStreak = ref(0)

// Animation for counting effect
const countUp = (target: number) => {
  let current = 0
  const increment = target / 60 // Animate over 1 second (60 frames)

  const animate = () => {
    current += increment
    if (current < target) {
      displayStreak.value = Math.floor(current)
      requestAnimationFrame(animate)
    } else {
      displayStreak.value = target
    }
  }

  animate()
}

onMounted(async () => {
  await loadStreakData()
  // Start counting animation
  countUp(currentStreak.value)
})

async function loadStreakData() {
  try {
    currentStreak.value = await StreakManager.getCurrentStreak()
    longestStreak.value = await StreakManager.getLongestStreak()

    // Load scan history for stats
    const history = await ScanHistory.get()
    totalLogged.value = history.length

    if (history.length > 0) {
      const totalCals = history.reduce((sum, scan) => {
        if (scan.type === 'food') {
          return sum + (scan.data.total?.calories || 0)
        } else if (scan.type === 'barcode') {
          return sum + (scan.data.nutriments?.energy_kcal_100g || 0)
        }
        return sum
      }, 0)
      averageCalories.value = Math.round(totalCals / history.length)
    }
  } catch (error) {
    console.error('Error loading streak data:', error)
  }
}

function goBack() {
  router.back()
}

// Milestone calculations
const nextMilestone = computed(() => {
  const milestones = [7, 14, 30, 50, 100, 200, 365]
  return milestones.find(m => m > currentStreak.value) || 500
})

const milestoneProgress = computed(() => {
  const previous = currentStreak.value === 0 ? 0 :
    [0, 7, 14, 30, 50, 100, 200, 365].filter(m => m < currentStreak.value).pop() || 0

  return ((currentStreak.value - previous) / (nextMilestone.value - previous)) * 100
})

// Achievements system
const achievements = computed(() => [
  {
    id: 'starter',
    icon: '🔥',
    name: t('streak.achievementsList.starter'),
    requirement: '7 ' + t('streak.days'),
    earned: currentStreak.value >= 7
  },
  {
    id: 'consistent',
    icon: '⚡',
    name: t('streak.achievementsList.consistent'),
    requirement: '14 ' + t('streak.days'),
    earned: currentStreak.value >= 14
  },
  {
    id: 'dedicated',
    icon: '💎',
    name: t('streak.achievementsList.dedicated'),
    requirement: '30 ' + t('streak.days'),
    earned: currentStreak.value >= 30
  },
  {
    id: 'unstoppable',
    icon: '👑',
    name: t('streak.achievementsList.unstoppable'),
    requirement: '100 ' + t('streak.days'),
    earned: currentStreak.value >= 100
  },
  {
    id: 'legendary',
    icon: '🏆',
    name: t('streak.achievementsList.legendary'),
    requirement: '365 ' + t('streak.days'),
    earned: currentStreak.value >= 365
  }
])

// Calendar for last 30 days
const last30Days = computed(() => {
  const days = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    days.push({
      date: date.toISOString().split('T')[0],
      dayNumber: date.getDate(),
      isToday: i === 0,
      hasLog: i < currentStreak.value // Simplified - could be improved with actual history
    })
  }

  return days
})

function getStreakMessage() {
  if (currentStreak.value === 0) {
    return t('streak.messages.start')
  } else if (currentStreak.value < 7) {
    return t('streak.messages.beginning')
  } else if (currentStreak.value < 30) {
    return t('streak.messages.building')
  } else if (currentStreak.value < 100) {
    return t('streak.messages.strong')
  } else {
    return t('streak.messages.incredible')
  }
}

function getMilestoneIcon(milestone: number) {
  const icons: Record<number, string> = {
    7: '🔥',
    14: '⚡',
    30: '💎',
    50: '🌟',
    100: '👑',
    200: '🏆',
    365: '🎖️',
    500: '🌈'
  }
  return icons[milestone] || '🎯'
}

function getMilestoneReward(milestone: number) {
  const rewards: Record<number, string> = {
    7: t('streak.rewards.week'),
    14: t('streak.rewards.twoWeeks'),
    30: t('streak.rewards.month'),
    50: t('streak.rewards.fiftyDays'),
    100: t('streak.rewards.hundred'),
    200: t('streak.rewards.twoHundred'),
    365: t('streak.rewards.year'),
    500: t('streak.rewards.master')
  }
  return rewards[milestone] || t('streak.rewards.amazing')
}

function getMotivationalQuote() {
  const quotes = [
    t('streak.quotes.consistency'),
    t('streak.quotes.progress'),
    t('streak.quotes.journey'),
    t('streak.quotes.habits'),
    t('streak.quotes.discipline')
  ]

  // Use streak count to pick quote for consistency
  return quotes[currentStreak.value % quotes.length]
}
</script>

<style scoped>
.streak-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1d26 0%, #2a2d37 100%);
  color: white;
  padding: 16px;
  padding-top: max(44px, env(safe-area-inset-top, 44px));
  padding-bottom: max(80px, calc(80px + env(safe-area-inset-bottom, 0px)));
}

.header {
  display: flex;
  align-items: center;
  padding: 1rem;
  position: sticky;
  top: 0;
  background: rgba(26, 29, 38, 0.95);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.back-button {
  background: none;
  border: none;
  color: white;
  padding: 0.5rem;
  margin-right: 1rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.streak-hero {
  text-align: center;
  padding: 2rem 1rem;
/*  margin: 1rem;*/
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.streak-flame {
  margin-bottom: 1rem;
  animation: flicker 2s ease-in-out infinite alternate;
}

@keyframes flicker {
  0% {
    transform: scale(1) rotate(-2deg);
  }

  100% {
    transform: scale(1.05) rotate(2deg);
  }
}

.streak-number {
  font-size: 4rem;
  font-weight: bold;
  color: #ff6b35;
  margin: 1rem 0;
  text-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
}

.streak-label {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
}

.streak-message {
  font-size: 1rem;
  color: #007052;
  font-weight: 500;
  background: rgba(0, 112, 82, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  display: inline-block;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 2rem 1rem 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.milestone-section,
.achievements-section,
.history-section,
.stats-section,
.motivation-section {
/*  margin: 1rem;*/
}

.milestone-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-bar {
  background: rgba(255, 255, 255, 0.2);
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  background: linear-gradient(90deg, #007052, #00a76f);
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
}

.milestone-reward {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.reward-icon {
  font-size: 2rem;
}

.reward-text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.achievement-badge {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.achievement-badge.earned {
  background: rgba(0, 112, 82, 0.2);
  border-color: #007052;
}

.achievement-badge.locked {
  opacity: 0.5;
}

.badge-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.badge-name {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.badge-requirement {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.history-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 0.8rem;
  position: relative;
}

.calendar-day.active {
  background: rgba(0, 112, 82, 0.3);
  border: 1px solid #007052;
}

.calendar-day.today {
  border: 2px solid #ff6b35;
}

.day-number {
  margin-bottom: 0.25rem;
}

.day-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem 1rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #007052;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.quote-card {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(0, 112, 82, 0.2));
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.quote-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.quote-text {
  font-size: 1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}
</style>
