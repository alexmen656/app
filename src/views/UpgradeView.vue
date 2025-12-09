<template>
  <div class="upgrade-view">
    <div class="header">
      <button @click="goBack" class="back-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <h1 class="title">Upgrade to Premium</h1>
    </div>

    <div class="content">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="premium-badge">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>Premium</span>
        </div>
        <h2 class="hero-title">Unlock the Full Potential</h2>
        <p class="hero-subtitle">Get advanced features and detailed insights to reach your nutrition goals faster</p>
      </div>

      <!-- Features Grid -->
      <div class="features-section">
        <div class="feature-item">
          <div class="feature-icon premium">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div class="feature-content">
            <h3>iOS Widgets</h3>
            <p>Track your calories and macros directly from your home screen</p>
          </div>
          <div class="feature-lock">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon premium">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
          </div>
          <div class="feature-content">
            <h3>Advanced Analytics</h3>
            <p>Detailed nutrition trends and personalized insights</p>
          </div>
          <div class="feature-lock">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon premium">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div class="feature-content">
            <h3>HealthKit Sync</h3>
            <p>Automatic synchronization with Apple Health</p>
          </div>
          <div class="feature-lock">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon premium">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div class="feature-content">
            <h3>Premium Support</h3>
            <p>Priority customer support and exclusive features</p>
          </div>
          <div class="feature-lock">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Pricing -->
      <div class="pricing-section" v-if="subscriptionPlans.length > 0">
        <div class="plans-container">
          <div v-for="plan in subscriptionPlans" :key="plan.id" class="plan-card"
            :class="{ active: selectedPlan === plan.id, popular: plan.isPopular }" @click="selectPlan(plan.id)">
            <div v-if="plan.isPopular" class="popular-badge">Most Popular</div>
            <div class="plan-header">
              <h3 class="plan-title">{{ plan.title }}</h3>
              <div class="plan-price">
                <span class="price">{{ plan.price }}</span>
                <span class="period">{{ plan.period }}</span>
              </div>
            </div>
            <p class="plan-description">{{ plan.description }}</p>
            <div v-if="plan.description.includes('Save')" class="plan-savings">
              {{ plan.description }}
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="loading-state">
        <div class="loading-spinner-large"></div>
        <p>Loading subscription plans...</p>
      </div>

      <!-- Error State -->
      <div v-else class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Unable to load plans</h3>
        <p>Please check your internet connection and try again.</p>
        <button @click="loadSubscriptionPlans" class="retry-button">
          Retry
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="action-section" v-if="subscriptionPlans.length > 0">
        <button @click="purchaseSelected" :disabled="!selectedPlan || isLoading" class="upgrade-button"
          :class="{ loading: isLoading }">
          <div v-if="isLoading" class="loading-spinner"></div>
          {{ getPurchaseButtonText }}
        </button>

        <button @click="restorePurchases" :disabled="isLoading" class="restore-button">
          Restore Purchases
        </button>

        <!-- Legal Links -->
        <div class="legal-links">
          <a href="#" @cxlick.prevent="openTerms" class="legal-link">Terms of Service</a>
          <span class="separator">•</span>
          <a href="#" @click.prevent="openPrivacy" class="legal-link">Privacy Policy</a>
          <span v-if="isIOS" class="separator">•</span>
          <a v-if="isIOS" href="#" @click.prevent="openMore" class="legal-link">{{ $t('paywall.redeemCode') }}</a>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { revenueCatService, type SubscriptionPlan } from '../services/revenuecat'
import { updateSubscriptionStatus } from '../stores/userStore'
import { PremiumManager } from '../utils/premiumManager'
import { Capacitor } from '@capacitor/core'

const router = useRouter()

const selectedPlan = ref<string>('annual')
const subscriptionPlans = ref<SubscriptionPlan[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const isIOS = Capacitor.getPlatform() === 'ios'

const getPurchaseButtonText = computed(() => {
  if (!selectedPlan.value) return 'Select a Plan'

  const plan = subscriptionPlans.value.find(p => p.id === selectedPlan.value)
  if (!plan) return 'Continue'

  if (plan.period === 'lifetime') {
    return `Upgrade Now - ${plan.price}`
  }

  return `Start ${plan.title} - ${plan.price}`
})

function goBack() {
  router.go(-1)
}

async function loadSubscriptionPlans() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const plans = await revenueCatService.getOfferings()
    subscriptionPlans.value = plans

    // Auto-select the popular plan
    const popularPlan = plans.find((p: SubscriptionPlan) => p.isPopular)
    if (popularPlan) {
      selectedPlan.value = popularPlan.id
    } else if (plans.length > 0) {
      selectedPlan.value = plans[0].id
    }
  } catch (error: any) {
    console.error('Failed to load subscription plans:', error)
    errorMessage.value = 'Unable to load subscription plans. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function selectPlan(planId: string) {
  if (isLoading.value) return
  selectedPlan.value = planId
  errorMessage.value = ''
}

async function purchaseSelected() {
  if (!selectedPlan.value || isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const success = await revenueCatService.purchasePackage(selectedPlan.value)

    if (success) {
      await updateSubscriptionStatus(true, 'Premium')
      // Force update premium status für immediate UI updates
      await PremiumManager.forceUpdatePremiumStatus()

      console.log('🎉 Purchase successful - navigating to home')
      router.push('/')
    } else {
      errorMessage.value = 'Purchase failed. Please try again.'
    }
  } catch (error: any) {
    console.error('Purchase error:', error)
    errorMessage.value = error.message || 'Purchase failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

async function restorePurchases() {
  if (isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const success = await revenueCatService.restorePurchases()

    if (success) {
      await updateSubscriptionStatus(true, 'Premium')
      // Force update premium status für immediate UI updates
      await PremiumManager.forceUpdatePremiumStatus()

      console.log('🎉 Restore successful - navigating to home')
      router.push('/')
    } else {
      errorMessage.value = 'No purchases found to restore.'
    }
  } catch (error) {
    console.error('Restore error:', error)
    errorMessage.value = 'Failed to restore purchases. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function openTerms() {
  window.open('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/', '_blank')
}

function openPrivacy() {
  window.open('https://kalbuddy.com/privacy-policy.html', '_blank')
}

function openMore() {
  router.push('/coupon')
}

onMounted(async () => {
  await loadSubscriptionPlans()
})
</script>

<style scoped>
.upgrade-view {
  height: 100vh;
  height: 100dvh;
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
  color: white;
  padding: 16px;
  padding-top: max(44px, env(safe-area-inset-top, 44px));
  padding-bottom: max(80px, calc(80px + env(safe-area-inset-bottom, 0px)));
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.back-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 40px;
}

.premium-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1e1e2e;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 24px;
}

.hero-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 16px;
  opacity: 0.8;
  line-height: 1.5;
  margin: 0 auto;
  max-width: 400px;
}

.features-section {
  margin-bottom: 40px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin-bottom: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon.premium {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1e1e2e;
}

.feature-content {
  flex: 1;
}

.feature-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.feature-content p {
  font-size: 14px;
  opacity: 0.7;
  margin: 0;
  line-height: 1.4;
}

.feature-lock {
  opacity: 0.5;
}

.pricing-section {
  margin-bottom: 32px;
}

.plans-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
  position: relative;
}

.plan-card:hover {
  background: rgba(255, 255, 255, 0.08);
}

.plan-card.active {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.1);
}

.plan-card.popular {
  border-color: #FFD700;
}

.popular-badge {
  position: absolute;
  top: -8px;
  left: 20px;
  background: #FFD700;
  color: #1e1e2e;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.plan-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.plan-price {
  text-align: right;
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: #FFD700;
}

.period {
  font-size: 14px;
  opacity: 0.7;
  margin-left: 4px;
}

.plan-description {
  font-size: 14px;
  opacity: 0.8;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.plan-savings {
  font-size: 12px;
  color: #4CAF50;
  font-weight: 600;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 40px 20px;
}

.loading-spinner-large {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #FFD700;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto 16px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-state h3 {
  font-size: 18px;
  margin: 0 0 8px 0;
}

.error-state p {
  opacity: 0.8;
  margin: 0 0 20px 0;
}

.retry-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.action-section {
  text-align: center;
}

.upgrade-button {
  width: 100%;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1e1e2e;
  border: none;
  padding: 16px 24px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.upgrade-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
}

.upgrade-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.restore-button {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 24px;
  width: 100%;
}

.restore-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.restore-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(30, 30, 46, 0.3);
  border-radius: 50%;
  border-top-color: #1e1e2e;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.legal-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.legal-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.legal-link:hover {
  color: white;
}

.separator {
  color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
}

.error-message {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  color: #ff6b6b;
  padding: 12px 16px;
  border-radius: 12px;
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}

@media (max-width: 480px) {
  .upgrade-view {
    padding-left: 16px;
    padding-right: 16px;
  }

  .hero-title {
    font-size: 24px;
  }

  .hero-subtitle {
    font-size: 14px;
  }

  .plan-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .plan-price {
    text-align: left;
  }
}
</style>
