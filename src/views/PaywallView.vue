<template>
  <div class="paywall-view">
    <!-- Close Button -->
    <button @click="skipPaywall" class="close-button" v-if="showCloseButton">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>

    <!-- Header Section -->
    <div class="header-section">
      <div class="app-icon">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
        </svg>
      </div>
      <h1 class="title">{{ $t('paywall.title') }}</h1>
      <p class="subtitle">{{ $t('paywall.subtitle') }}</p>
    </div>

    <!-- Features Grid -->
    <div class="features-section">
      <div class="feature-item" v-for="feature in features" :key="feature.title">
        <div class="feature-icon">
          <component :is="'div'" v-html="feature.icon"></component>
        </div>
        <div class="feature-content">
          <h3 class="feature-title">{{ $t(feature.title) }}</h3>
          <p class="feature-description">{{ $t(feature.description) }}</p>
        </div>
        <div class="feature-check">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Pricing Plans -->
    <div class="pricing-section" v-if="subscriptionPlans.length > 0">
      <h2 class="pricing-title">{{ $t('paywall.choosePlan') }}</h2>
      
      <div class="plans-container">
        <div 
          v-for="plan in subscriptionPlans" 
          :key="plan.id"
          class="plan-card"
          :class="{ 
            active: selectedPlan === plan.id, 
            popular: plan.isPopular,
            loading: isLoading && selectedPlan === plan.id
          }"
          @click="selectPlan(plan.id)"
        >
          <div v-if="plan.isPopular" class="popular-badge">{{ $t('paywall.mostPopular') }}</div>
          
          <div class="plan-header">
            <h3 class="plan-title">{{ plan.title }}</h3>
            <div class="plan-price">
              <span class="price">{{ plan.price }}</span>
              <span class="period" v-if="plan.period !== 'lifetime'">/ {{ plan.period }}</span>
            </div>
          </div>
          
          <p class="plan-description">{{ plan.description }}</p>
          
          <div class="plan-savings" v-if="plan.id === 'annual'">
            {{ $t('paywall.savingsText') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="loading-state">
      <div class="loading-spinner-large"></div>
      <p>Loading subscription plans...</p>
    </div>

    <!-- No Plans Available Message -->
    <div v-else-if="!errorMessage" class="no-plans-message">
      <div class="no-plans-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      </div>
      <h3>No subscription plans available</h3>
      <p>Please configure RevenueCat offerings and try again.</p>
      <button @click="loadSubscriptionPlans" class="retry-button">
        Retry
      </button>
    </div>

    <!-- Action Buttons -->
    <div class="action-section">
      <button 
        @click="purchaseSelected" 
        class="purchase-button"
        :disabled="!selectedPlan || isLoading"
        :class="{ loading: isLoading }"
      >
        <div v-if="isLoading" class="loading-spinner"></div>
        <span v-else>{{ getPurchaseButtonText }}</span>
      </button>

      <button @click="restorePurchases" class="restore-button" :disabled="isLoading">
        {{ $t('paywall.restorePurchases') }}
      </button>

      <button @click="openCouponView" class="coupon-button" :disabled="isLoading">
        🎫 Have a coupon code?
      </button>

      <!-- Terms and Privacy -->
      <div class="legal-links">
        <a href="#" @click.prevent="openTerms" class="legal-link">{{ $t('paywall.termsOfService') }}</a>
        <span class="separator">•</span>
        <a href="#" @click.prevent="openPrivacy" class="legal-link">{{ $t('paywall.privacyPolicy') }}</a>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { revenueCatService, type SubscriptionPlan } from '../services/revenuecat'
import { updateSubscriptionStatus } from '../stores/userStore'

interface Feature {
  title: string
  description: string
  icon: string
}

const router = useRouter()

const selectedPlan = ref<string>('annual')
const subscriptionPlans = ref<SubscriptionPlan[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const showCloseButton = ref(true)

const features: Feature[] = [
  {
    title: 'paywall.features.unlimitedScans',
    description: 'paywall.features.unlimitedScansDesc',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>'
  },
  {
    title: 'paywall.features.advancedAnalytics',
    description: 'paywall.features.advancedAnalyticsDesc',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>'
  },
  {
    title: 'paywall.features.customGoals',
    description: 'paywall.features.customGoalsDesc',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M16.2 7.8l-2 6.3-6.3 2 2-6.3 6.3-2z"/></svg>'
  },
  {
    title: 'paywall.features.mealPlanning',
    description: 'paywall.features.mealPlanningDesc',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v18H3zM5 7h14v2H5zM5 11h14v2H5zM5 15h14v2H5z"/></svg>'
  },
  {
    title: 'paywall.features.exportData',
    description: 'paywall.features.exportDataDesc',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>'
  },
  {
    title: 'paywall.features.prioritySupport',
    description: 'paywall.features.prioritySupportDesc',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
  }
]

const getPurchaseButtonText = computed(() => {
  if (!selectedPlan.value) return 'Select a Plan'
  
  const plan = subscriptionPlans.value.find(p => p.id === selectedPlan.value)
  if (!plan) return 'Continue'
  
  if (plan.period === 'lifetime') {
    return `Get Lifetime Access - ${plan.price}`
  }
  
  return `Start ${plan.title} Plan - ${plan.price}`
})

onMounted(async () => {
  await loadSubscriptionPlans()
})

async function loadSubscriptionPlans() {
  try {
    isLoading.value = true
    errorMessage.value = ''
    subscriptionPlans.value = await revenueCatService.getOfferings()
    
    if (subscriptionPlans.value.length === 0) {
      throw new Error('No subscription plans available')
    }
    
    // Auto-select the popular plan
    const popularPlan = subscriptionPlans.value.find(p => p.isPopular)
    if (popularPlan) {
      selectedPlan.value = popularPlan.id
    } else if (subscriptionPlans.value.length > 0) {
      selectedPlan.value = subscriptionPlans.value[0].id
    }
  } catch (error: any) {
    console.error('Failed to load subscription plans:', error)
    
    if (error.message?.includes('No current offering')) {
      errorMessage.value = 'RevenueCat not configured. Please configure offerings in RevenueCat dashboard.'
    } else if (error.message?.includes('No subscription packages')) {
      errorMessage.value = 'No subscription products available. Please configure products in RevenueCat dashboard.'
    } else if (error.message?.includes('your_revenuecat_api_key_here')) {
      errorMessage.value = 'RevenueCat API key not configured. Please update your .env file.'
    } else {
      errorMessage.value = `Failed to load subscription plans: ${error.message || 'Unknown error'}`
    }
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
      // Update subscription status in the store
      const selectedPlanData = subscriptionPlans.value.find(p => p.id === selectedPlan.value)
      await updateSubscriptionStatus(true, selectedPlanData?.title || 'Premium')
      
      // Navigate to home after successful purchase
      router.push('/')
    } else {
      errorMessage.value = 'Purchase was not completed. Please try again.'
    }
  } catch (error: any) {
    console.error('Purchase failed:', error)
    
    if (error.message?.includes('user cancelled')) {
      errorMessage.value = 'Purchase was cancelled.'
    } else if (error.message?.includes('payment invalid')) {
      errorMessage.value = 'Payment method is invalid. Please check your payment information.'
    } else if (error.message?.includes('network')) {
      errorMessage.value = 'Network error. Please check your internet connection.'
    } else {
      errorMessage.value = 'Purchase failed. Please try again later.'
    }
  } finally {
    isLoading.value = false
  }
}

async function restorePurchases() {
  if (isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const hasActivePurchases = await revenueCatService.restorePurchases()
    
    if (hasActivePurchases) {
      // Update subscription status in the store
      await updateSubscriptionStatus(true, 'Premium')
      
      // Navigate to home after successful restore
      router.push('/')
    } else {
      errorMessage.value = 'No previous purchases found to restore.'
    }
  } catch (error) {
    console.error('Restore failed:', error)
    errorMessage.value = 'Failed to restore purchases. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function skipPaywall() {
  // For demo purposes, allow skipping in development
  if (import.meta.env.DEV) {
    router.push('/')
  }
}

function openTerms() {
  // Open terms of service
  console.log('Open Terms of Service')
}

function openPrivacy() {
  // Open privacy policy
  console.log('Open Privacy Policy')
}

function openCouponView() {
  router.push('/coupon')
}
</script>

<style scoped>
.paywall-view {
  height: 100vh;
  height: 100dvh;
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
  color: white;
  padding: 20px;
  padding-top: max(44px, env(safe-area-inset-top, 44px));
  padding-bottom: max(20px, env(safe-area-inset-bottom, 20px));
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
}

.close-button {
  position: absolute;
  top: max(54px, env(safe-area-inset-top, 54px));
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 20px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  z-index: 10;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.header-section {
  text-align: center;
  margin-bottom: 32px;
  margin-top: 20px;
}

.app-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #007052, #00a86b);
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
}

.brand {
  color: #007052;
}

.subtitle {
  font-size: 16px;
  opacity: 0.8;
  line-height: 1.4;
  max-width: 350px;
  margin: 0 auto;
}

.features-section {
  margin-bottom: 32px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: rgba(0, 112, 82, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #007052;
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.feature-description {
  font-size: 14px;
  opacity: 0.7;
  margin: 0;
}

.feature-check {
  color: #007052;
  flex-shrink: 0;
}

.pricing-section {
  margin-bottom: 32px;
}

.pricing-title {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
}

.no-plans-message {
  text-align: center;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin-bottom: 32px;
}

.no-plans-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-plans-message h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: white;
}

.no-plans-message p {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 20px;
}

.retry-button {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  margin-bottom: 32px;
}

.loading-spinner-large {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-state p {
  font-size: 16px;
  opacity: 0.7;
  margin: 0;
}

.plans-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.plan-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.plan-card.active {
  background: rgba(0, 112, 82, 0.2);
  border-color: #007052;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 112, 82, 0.2);
}

.plan-card.popular {
  border-color: #ff6b35;
}

.plan-card.popular.active {
  border-color: #007052;
}

.popular-badge {
  position: absolute;
  top: -1px;
  right: 20px;
  background: linear-gradient(135deg, #ff6b35, #ff8a50);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 0 0 8px 8px;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
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
  font-size: 24px;
  font-weight: 700;
  color: #007052;
}

.period {
  font-size: 14px;
  opacity: 0.7;
}

.plan-description {
  font-size: 14px;
  opacity: 0.8;
  margin: 0 0 8px 0;
}

.plan-savings {
  font-size: 12px;
  color: #00a86b;
  font-weight: 500;
  background: rgba(0, 168, 107, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
}

.action-section {
  margin-top: auto;
}

.purchase-button {
  width: 100%;
  background: linear-gradient(135deg, #007052, #00a86b);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 18px 24px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 56px;
}

.purchase-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 112, 82, 0.3);
}

.purchase-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.purchase-button.loading {
  opacity: 0.8;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.restore-button {
  width: 100%;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;
}

.restore-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.restore-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.coupon-button {
  width: 100%;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 107, 53, 0.3);
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;
}

.coupon-button:hover:not(:disabled) {
  background: rgba(255, 107, 53, 0.1);
  border-color: rgba(255, 107, 53, 0.5);
  color: white;
}

.coupon-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.legal-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.legal-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.legal-link:hover {
  color: rgba(255, 255, 255, 0.8);
}

.separator {
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}

.error-message {
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  color: #ffb3b3;
  font-size: 14px;
  margin-top: 16px;
  text-align: center;
}

@media (max-width: 480px) {
  .paywall-view {
    padding: 16px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 14px;
  }
  
  .plan-header {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
  
  .plan-price {
    text-align: left;
  }
}
</style>
