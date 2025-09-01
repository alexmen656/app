<template>
  <div class="premium-blocker-overlay">
    <div class="premium-blocker-content">
      <!-- Premium Icon -->
      <div class="premium-icon">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
          <path 
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
            fill="#FFD700" 
            stroke="#FFD700" 
            stroke-width="1"
          />
        </svg>
      </div>

      <!-- Title -->
      <h2 class="premium-title">{{ title || $t('premium.upgrade.title') }}</h2>
      
      <!-- Description -->
      <p class="premium-description">
        {{ description || getFeatureDescription(feature) }}
      </p>

      <!-- Feature List (if provided) -->
      <div v-if="features.length > 0" class="premium-features">
        <div 
          v-for="(feature, index) in features" 
          :key="index" 
          class="premium-feature-item"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD700">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <span>{{ feature }}</span>
        </div>
      </div>

      <!-- Usage Info (for scan limits) -->
      <div v-if="showUsageInfo" class="usage-info">
        <div class="usage-bar">
          <div 
            class="usage-progress" 
            :style="{ width: usagePercentage + '%' }"
          ></div>
        </div>
        <p class="usage-text">
          {{ $t('premium.scans.used', { used: scansUsed, total: scansTotal }) }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="premium-actions">
        <button @click="upgradeNow" class="upgrade-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          {{ $t('premium.upgrade.button') }}
        </button>
        
        <button 
          v-if="showCloseButton" 
          @click="closeBlocker" 
          class="close-button"
        >
          {{ $t('premium.close') }}
        </button>
      </div>

      <!-- Legal Text -->
      <p class="premium-legal">
        {{ $t('premium.legal.text') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usageTracking, freeLimits } from '../utils/premiumManager'

interface Props {
  feature: string
  title?: string
  description?: string
  features?: string[]
  showUsageInfo?: boolean
  showCloseButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  features: () => [],
  showUsageInfo: false,
  showCloseButton: true
})

const emit = defineEmits<{
  close: []
  upgrade: [feature: string]
}>()

const router = useRouter()
const { t } = useI18n()

// Usage Information
const scansUsed = computed(() => usageTracking.value.dailyFoodScans)
const scansTotal = computed(() => freeLimits.DAILY_FOOD_SCANS)
const usagePercentage = computed(() => 
  Math.min((scansUsed.value / scansTotal.value) * 100, 100)
)

// Feature Descriptions
const getFeatureDescription = (feature: string): string => {
  const descriptions: Record<string, string> = {
    'unlimited_food_scans': t('premium.features.unlimited_scans_desc'),
    'ios_widgets': t('premium.features.widgets_desc'),
    'unlimited_analytics_history': t('premium.features.analytics_desc'),
    'export_data': t('premium.features.export_desc'),
    'healthkit_sync': t('premium.features.healthkit_desc'),
    'detailed_charts': t('premium.features.charts_desc')
  }
  
  return descriptions[feature] || t('premium.features.default_desc')
}

// Actions
const upgradeNow = () => {
  emit('upgrade', props.feature)
  router.push({
    name: 'Paywall',
    query: { feature: props.feature }
  })
}

const closeBlocker = () => {
  emit('close')
}
</script>

<style scoped>
.premium-blocker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.premium-blocker-content {
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
  border-radius: 24px;
  padding: 32px 24px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  color: white;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.premium-icon {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
  border-radius: 50%;
  margin: 0 auto 24px;
}

.premium-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.premium-description {
  font-size: 16px;
  line-height: 1.5;
  opacity: 0.9;
  margin: 0 0 24px 0;
  color: #e0e0e0;
}

.premium-features {
  margin: 24px 0;
  text-align: left;
}

.premium-feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  font-size: 14px;
  color: #e0e0e0;
}

.usage-info {
  margin: 24px 0;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.usage-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.usage-progress {
  height: 100%;
  background: linear-gradient(90deg, #FFD700, #FF6B35);
  transition: width 0.3s ease;
}

.usage-text {
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
}

.premium-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.upgrade-button {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1e1e2e;
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 8px 24px rgba(255, 215, 0, 0.3);
}

.upgrade-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 215, 0, 0.4);
}

.close-button {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
}

.premium-legal {
  font-size: 12px;
  opacity: 0.6;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 480px) {
  .premium-blocker-overlay {
    padding: 16px;
  }
  
  .premium-blocker-content {
    padding: 24px 20px;
  }
  
  .premium-title {
    font-size: 20px;
  }
  
  .premium-description {
    font-size: 14px;
  }
}
</style>
