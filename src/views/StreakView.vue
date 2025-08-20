<template>
  <div class="streak-view">
    <!-- Header -->
    <header class="header">
      <button @click="goBack" class="back-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
      <div class="streak-number">
        {{ currentStreak }}
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

    <!-- Achievement Rings -->
    <div class="achievements-section">
      <h3 class="section-title">{{ $t('streak.achievements') }}</h3>
      <div class="achievements-grid">
        <div v-for="achievement in achievements" :key="achievement.id" class="achievement-ring"
          :class="{ 'earned': achievement.earned }">
          <div class="ring-container">
            <svg class="ring-svg" viewBox="0 0 170 170">
              <!-- Background ring -->
              <circle cx="85" cy="85" r="75" fill="none" stroke="rgba(255, 255, 255, 0.2)" stroke-width="10" />
              <!-- Progress ring -->
              <circle cx="85" cy="85" r="75" fill="none" :stroke="achievement.color" stroke-width="10"
                stroke-linecap="round" :stroke-dasharray="471" :stroke-dashoffset="achievement.earned ? 0 : 471"
                :class="{ 'ring-animate': achievement.earned }" transform="rotate(-90 85 85)" />
            </svg>
            <div class="ring-center">
              <div class="achievement-icon" :style="{ color: achievement.color }">
                {{ achievement.iconSvg }}
              </div>
            </div>
          </div>
          <div class="achievement-info">
            <div class="achievement-name">{{ achievement.name }}</div>
            <div class="achievement-requirement">{{ achievement.requirement }}</div>
          </div>
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

onMounted(async () => {
  await loadStreakData()
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
  const milestones = [7, 14, 30, 50, 100, 200, 365, 1000]
  return milestones.find(m => m > currentStreak.value) || 1000
})

const milestoneProgress = computed(() => {
  const previous = currentStreak.value === 0 ? 0 :
    [0, 7, 14, 30, 50, 100, 200, 365, 1000].filter(m => m < currentStreak.value).pop() || 0

  return ((currentStreak.value - previous) / (nextMilestone.value - previous)) * 100
})

// Achievements system with 3D ring design
const achievements = computed(() => [
  {
    id: 'starter',
    iconSvg: '🔥',
    name: t('streak.achievementsList.starter'),
    requirement: '7 ' + t('streak.days'),
    earned: currentStreak.value >= 7,
    color: '#00D4AA'
  },
  {
    id: 'consistent',
    iconSvg: '⚡',
    name: t('streak.achievementsList.consistent'),
    requirement: '14 ' + t('streak.days'),
    earned: currentStreak.value >= 14,
    color: '#007AFF'
  },
  {
    id: 'dedicated',
    iconSvg: '💎',
    name: t('streak.achievementsList.dedicated'),
    requirement: '30 ' + t('streak.days'),
    earned: currentStreak.value >= 30,
    color: '#FF6B35'
  },
  {
    id: 'unstoppable',
    iconSvg: '🥇',
    name: t('streak.achievementsList.unstoppable'),
    requirement: '100 ' + t('streak.days'),
    earned: currentStreak.value >= 100,
    color: '#FFD60A'
  },
  {
    id: 'legendary',
    iconSvg: '👑',
    name: t('streak.achievementsList.legendary'),
    requirement: '365 ' + t('streak.days'),
    earned: currentStreak.value >= 365,
    color: '#FF2D92'
  },
  {
    id: 'eternal',
    iconSvg: '🏆',
    name: t('streak.achievementsList.eternal'),
    requirement: '1000 ' + t('streak.days'),
    earned: currentStreak.value >= 1000,
    color: '#8A2BE2'
  },

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
    14: '⚡️',
    30: '💎',
    100: '🥇',
    365: '👑',
    1000: '🏆'
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
    500: t('streak.rewards.master'),
    1000: t('streak.rewards.thousand')
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
  background: linear-gradient(135deg, #0a0c12 0%, #1a1d26 50%, #0f1419 100%);
  color: white;
  padding: 16px;
  padding-top: max(44px, env(safe-area-inset-top, 44px));
  padding-bottom: max(80px, calc(80px + env(safe-area-inset-bottom, 0px)));
}

.header {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
}

.back-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.75rem;
  margin-right: 1rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.02em;
}

.streak-hero {
  text-align: center;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.streak-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 107, 53, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.streak-icon {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
}

.flame-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #ff6b35, #ff8c42, #ff4757, #ff6b35);
  animation: rotate 3s linear infinite;
}

.flame-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60%;
  height: 60%;
  background: linear-gradient(135deg, #ff6b35, #ff4757);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 30px rgba(255, 107, 53, 0.6);
  animation: pulse 2s ease-in-out infinite alternate;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  from {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 30px rgba(255, 107, 53, 0.6);
  }

  to {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 0 40px rgba(255, 107, 53, 0.8);
  }
}

.streak-number {
  font-size: 4.5rem;
  font-weight: 800;
  color: #ff6b35;
  margin: 1rem 0;
  text-shadow: 0 0 30px rgba(255, 107, 53, 0.5);
  letter-spacing: -0.05em;
  background: linear-gradient(135deg, #ff6b35, #ff8c42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.streak-label {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.streak-message {
  font-size: 0.95rem;
  color: #00D4AA;
  font-weight: 600;
  background: rgba(0, 212, 170, 0.15);
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  display: inline-block;
  border: 1px solid rgba(0, 212, 170, 0.3);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 2.5rem 0 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: -0.02em;
}

.milestone-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  margin-bottom: 2rem;
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
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.achievement-ring {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;
}

.achievement-ring:hover {
  transform: translateY(-5px);
}

.ring-container {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
}

.ring-svg {
  width: 100%;
  height: 100%;
  transform: scale(1);
  transition: transform 0.3s ease;
}

.achievement-ring.earned .ring-svg {
  transform: scale(1.05);
}

.ring-animate {
  animation: ring-complete 1.5s ease-out;
}

@keyframes ring-complete {
  0% {
    stroke-dashoffset: 314;
  }

  70% {
    stroke-dashoffset: 0;
  }

  85% {
    stroke-dashoffset: -20;
  }

  100% {
    stroke-dashoffset: 0;
  }
}

.ring-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.achievement-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

.achievement-info {
  max-width: 120px;
}

.achievement-name {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: rgba(255, 255, 255, 0.9);
}

.achievement-requirement {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.3;
}

.history-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.75rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
  backdrop-filter: blur(20px);
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 0.8rem;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.calendar-day.active {
  background: linear-gradient(135deg, rgba(0, 212, 170, 0.3), rgba(0, 212, 170, 0.1));
  border-color: #00D4AA;
  box-shadow: 0 4px 15px rgba(0, 212, 170, 0.2);
}

.calendar-day.today {
  border: 2px solid #ff6b35;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.day-number {
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.day-indicator {
  position: absolute;
  bottom: 3px;
  right: 3px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #00D4AA;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #00D4AA, #007AFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.3;
}

.quote-card {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(0, 212, 170, 0.15));
  border-radius: 24px;
  padding: 2.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.quote-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.quote-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.quote-text {
  font-size: 1.1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  font-weight: 500;
  letter-spacing: -0.01em;
}
</style>
