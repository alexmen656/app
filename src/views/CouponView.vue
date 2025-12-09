<template>
  <div class="coupon-view">
    <div class="header-section">
      <button @click="goBack" class="back-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
      </button>
      <div class="header-content">
        <div class="coupon-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12.79 21L3 11.21v2c0 .53.21 1.04.59 1.41l7.79 7.79c.78.78 2.05.78 2.83 0l6.21-6.21c.78-.78.78-2.05 0-2.83L12.79 21z" />
            <path
              d="M11.38 17.41c.78.78 2.05.78 2.83 0l6.21-6.21c.78-.78.78-2.05 0-2.83L12.63.58C12.25.21 11.74 0 11.21 0H5C3.9 0 3 .9 3 2v6.21c0 .53.21 1.04.59 1.41l7.79 7.79z" />
            <circle cx="7.5" cy="6.5" r="1.5" />
          </svg>
        </div>
        <h1 class="title">{{ $t('coupon.title') }}</h1>
        <p class="subtitle">{{ $t('coupon.subtitle') }}</p>
      </div>
    </div>
    <div class="ios-redemption-section" v-if="isIOS">
      <button @click="openAppleRedemption" class="apple-redemption-button" :disabled="isLoading">
        <div class="apple-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
        </div>
        <div class="apple-text">
          <span class="apple-title">{{ $t('coupon.redeemWithApple') }}</span>
          <span class="apple-subtitle">{{ $t('coupon.appleSubtitle') }}</span>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </button>
    </div>

    <!-- Manual Coupon Input Section -->
    <!-- <div class="coupon-section">
      <div class="section-divider" v-if="isIOS">
        <span class="divider-text">{{ $t('coupon.orEnterManually') }}</span>
      </div>
      
      <div class="input-group">
        <label class="input-label">{{ $t('coupon.enterCode') }}</label>
        <div class="coupon-input-container">
          <input 
            v-model="couponCode" 
            type="text" 
            class="coupon-input"
            :placeholder="$t('coupon.placeholder')"
            @input="formatCouponCode"
            @keydown.enter="redeemCoupon"
            :disabled="isLoading"
            maxlength="20"
          />
          <button 
            @click="redeemCoupon" 
            class="redeem-button"
            :disabled="!couponCode.trim() || isLoading"
            :class="{ loading: isLoading }"
          >
            <div v-if="isLoading" class="loading-spinner"></div>
            <span v-else>{{ $t('coupon.redeem') }}</span>
          </button>
        </div>
        <p class="input-hint">{{ $t('coupon.hint') }}</p>
      </div>
    </div>

    <-- Available Offers Section --
    <div class="offers-section" v-if="availableOffers.length > 0">
      <h2 class="section-title">{{ $t('coupon.availableOffers') }}</h2>
      
      <div class="offers-grid">
        <div 
          v-for="offer in availableOffers" 
          :key="offer.id"
          class="offer-card"
          @click="selectOffer(offer)"
        >
          <div class="offer-badge" :class="offer.type">
            {{ offer.badge }}
          </div>
          <h3 class="offer-title">{{ offer.title }}</h3>
          <p class="offer-description">{{ offer.description }}</p>
          <div class="offer-validity">{{ offer.validity }}</div>
        </div>
      </div>
    </div>

    <-- Success Message --
    <div v-if="successMessage" class="success-message">
      <div class="success-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </div>
      <div class="success-content">
        <h3>{{ $t('coupon.success') }}</h3>
        <p>{{ successMessage }}</p>
      </div>
    </div>

    <-- Error Message --
    <div v-if="errorMessage" class="error-message">
      <div class="error-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <p>{{ errorMessage }}</p>
    </div>

    <-- FAQ Section --
    <div class="faq-section">
      <h2 class="section-title">{{ $t('coupon.faq.title') }}</h2>
      
      <div class="faq-item" v-for="(faq, index) in faqItems" :key="index">
        <button 
          @click="toggleFaq(index)" 
          class="faq-question"
          :class="{ active: activeFaq === index }"
        >
          <span>{{ $t(faq.question) }}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="faq-arrow">
            <path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42z"/>
          </svg>
        </button>
        
        <div class="faq-answer" v-show="activeFaq === index">
          <p>{{ $t(faq.answer) }}</p>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { updateSubscriptionStatus } from '../stores/userStore'
import { Capacitor } from '@capacitor/core'
import { revenueCatService } from '../services/revenuecat'

/*interface CouponOffer {
  id: string
  title: string
  description: string
  badge: string
  type: 'discount' | 'trial' | 'bonus'
  validity: string
  code?: string
}*/

const router = useRouter()

//const couponCode = ref('')
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
//const activeFaq = ref<number | null>(null)

// Check if running on iOS
const isIOS = Capacitor.getPlatform() === 'ios'

// Mock available offers - in production, these would come from your backend
/*const availableOffers = ref<CouponOffer[]>([
  {
    id: 'welcome50',
    title: '50% Off First Month',
    description: 'Perfect for new users to try premium features',
    badge: '50% OFF',
    type: 'discount',
    validity: 'Valid for 30 days',
    code: 'WELCOME50'
  },
  {
    id: 'trial7',
    title: '7-Day Free Trial',
    description: 'Unlock all premium features for one week',
    badge: 'FREE TRIAL',
    type: 'trial',
    validity: 'Valid for new subscriptions',
    code: 'FREETRIAL7'
  },
  {
    id: 'student',
    title: 'Student Discount',
    description: '30% off for students with valid ID',
    badge: '30% OFF',
    type: 'discount',
    validity: 'Requires student verification',
    code: 'STUDENT30'
  }
])

const faqItems = [
  {
    question: 'coupon.faq.howToUse',
    answer: 'coupon.faq.howToUseAnswer'
  },
  {
    question: 'coupon.faq.whereToFind',
    answer: 'coupon.faq.whereToFindAnswer'
  },
  {
    question: 'coupon.faq.expired',
    answer: 'coupon.faq.expiredAnswer'
  },
  {
    question: 'coupon.faq.multipleUse',
    answer: 'coupon.faq.multipleUseAnswer'
  }
]*/

function goBack() {
  router.back()
}

/*function formatCouponCode() {
  // Convert to uppercase and remove special characters
  couponCode.value = couponCode.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

async function redeemCoupon() {
  if (!couponCode.value.trim() || isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // In a real app, you would validate the coupon with your backend first
    const isValidCoupon = await validateCouponCode(couponCode.value)

    if (!isValidCoupon) {
      throw new Error('Invalid or expired coupon code')
    }

    // Apply the coupon through RevenueCat
    const result = await applyCouponToRevenueCat(couponCode.value)

    if (result.success) {
      if (result.type === 'subscription') {
        // Grant subscription access
        await updateSubscriptionStatus(true, result.planName || 'Premium')
        successMessage.value = `Coupon redeemed! ${result.message}`

        // Redirect to home after success
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        successMessage.value = result.message
      }

      couponCode.value = ''
    } else {
      throw new Error(result.message || 'Failed to redeem coupon')
    }
  } catch (error: any) {
    console.error('Coupon redemption failed:', error)

    if (error.message?.includes('already used')) {
      errorMessage.value = 'This coupon has already been used.'
    } else if (error.message?.includes('expired')) {
      errorMessage.value = 'This coupon has expired.'
    } else if (error.message?.includes('Invalid')) {
      errorMessage.value = 'Invalid coupon code. Please check and try again.'
    } else {
      errorMessage.value = 'Failed to redeem coupon. Please try again later.'
    }
  } finally {
    isLoading.value = false
  }
}*/

/*async function validateCouponCode(code: string): Promise<boolean> {
  // Mock validation - in production, this would be a backend call
  const validCoupons = ['WELCOME50', 'FREETRIAL7', 'STUDENT30', 'SAVE20', 'PREMIUM1MONTH']
  return validCoupons.includes(code)
}

async function applyCouponToRevenueCat(code: string): Promise<{
  success: boolean
  message: string
  type: 'discount' | 'subscription' | 'trial'
  planName?: string
}> {
  // Mock implementation - in production, integrate with RevenueCat promotional offers
  await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call

  const couponEffects: Record<string, any> = {
    'WELCOME50': {
      success: true,
      message: 'Welcome! You received 50% off your first month.',
      type: 'discount'
    },
    'FREETRIAL7': {
      success: true,
      message: 'Free trial activated! Enjoy 7 days of premium features.',
      type: 'subscription',
      planName: 'Trial'
    },
    'STUDENT30': {
      success: true,
      message: 'Student discount applied! 30% off for 6 months.',
      type: 'discount'
    },
    'PREMIUM1MONTH': {
      success: true,
      message: 'Free premium month activated!',
      type: 'subscription',
      planName: 'Monthly Premium'
    }
  }

  return couponEffects[code] || {
    success: false,
    message: 'Invalid coupon code',
    type: 'discount'
  }
}

function selectOffer(offer: CouponOffer) {
  if (offer.code) {
    couponCode.value = offer.code
  }
}

function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}
*/
async function openAppleRedemption() {
  if (!isIOS || isLoading.value) return

  try {
    isLoading.value = true
    errorMessage.value = ''

    // Use RevenueCat's presentCodeRedemptionSheet for iOS
    await revenueCatService.presentCodeRedemptionSheet()

    // After redemption, check subscription status
    const isSubscribed = await revenueCatService.checkSubscriptionStatus()
    if (isSubscribed) {
      await updateSubscriptionStatus(true, 'Premium')
      successMessage.value = 'Code successfully redeemed! Premium access activated.'

      // Redirect to home after success
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
  } catch (error: any) {
    console.error('Apple redemption failed:', error)

    if (error.message?.includes('cancelled')) {
      // User cancelled the redemption sheet - don't show error
      return
    } else if (error.message?.includes('invalid')) {
      errorMessage.value = 'Invalid redemption code. Please check and try again.'
    } else {
      errorMessage.value = 'Failed to redeem code. Please try again later.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.coupon-view {
  height: 100vh;
  height: 100dvh;
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
  color: white;
  padding: 20px;
  padding-top: max(44px, env(safe-area-inset-top, 44px));
  padding-bottom: max(20px, env(safe-area-inset-bottom, 20px));
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  overflow-y: auto;
}

.header-section {
  position: relative;
  margin-bottom: 32px;
}

.back-button {
  position: absolute;
  top: 0;
  left: 0;
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
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.header-content {
  text-align: center;
  padding-top: 20px;
}

.coupon-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff6b35, #ff8a50);
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
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  opacity: 0.8;
  line-height: 1.4;
}

.coupon-section {
  margin-bottom: 40px;
}

.ios-redemption-section {
  margin-bottom: 32px;
}

.apple-redemption-button {
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: white;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
}

.apple-redemption-button:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.apple-redemption-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.apple-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #007aff, #5856d6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.apple-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.apple-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.apple-subtitle {
  font-size: 14px;
  opacity: 0.7;
  margin: 0;
}

.arrow-icon {
  opacity: 0.6;
  flex-shrink: 0;
}

.section-divider {
  display: flex;
  align-items: center;
  margin: 32px 0 24px 0;
  text-align: center;
}

.section-divider::before,
.section-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.divider-text {
  padding: 0 20px;
  font-size: 14px;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

.input-group {
  max-width: 400px;
  margin: 0 auto;
}

.input-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
}

.coupon-input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.coupon-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: border-color 0.2s;
}

.coupon-input:focus {
  outline: none;
  border-color: #ff6b35;
}

.coupon-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
  text-transform: none;
  letter-spacing: normal;
}

.redeem-button {
  background: linear-gradient(135deg, #ff6b35, #ff8a50);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.redeem-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
}

.redeem-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.input-hint {
  font-size: 14px;
  opacity: 0.7;
  text-align: center;
  margin: 0;
}

.offers-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}

.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.offer-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.offer-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  border-color: #ff6b35;
}

.offer-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.offer-badge.discount {
  background: linear-gradient(135deg, #ff6b35, #ff8a50);
  color: white;
}

.offer-badge.trial {
  background: linear-gradient(135deg, #007052, #00a86b);
  color: white;
}

.offer-badge.bonus {
  background: linear-gradient(135deg, #9c27b0, #e91e63);
  color: white;
}

.offer-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  padding-right: 80px;
}

.offer-description {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 12px;
}

.offer-validity {
  font-size: 12px;
  opacity: 0.6;
  font-style: italic;
}

.success-message {
  background: rgba(0, 168, 107, 0.2);
  border: 1px solid rgba(0, 168, 107, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.success-icon {
  width: 24px;
  height: 24px;
  background: #00a86b;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.success-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #b3ffcc;
}

.success-content p {
  font-size: 14px;
  color: #b3ffcc;
  margin: 0;
}

.error-message {
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  color: #ffb3b3;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-icon {
  flex-shrink: 0;
}

.faq-section {
  max-width: 600px;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  width: 100%;
  background: none;
  border: none;
  color: white;
  padding: 20px 0;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.faq-arrow {
  transition: transform 0.3s ease;
  flex-shrink: 0;
  margin-left: 12px;
}

.faq-question.active .faq-arrow {
  transform: rotate(180deg);
}

.faq-answer {
  padding-bottom: 20px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.faq-answer p {
  margin: 0;
}

@media (max-width: 480px) {
  .coupon-input-container {
    flex-direction: column;
  }

  .offers-grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }
}
</style>
