<template>
    <div class="paywall-view">
        <!-- Header Section -->
        <div class="header-section">
            <div class="app-icon">
                <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path
                        d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
                </svg>
            </div>
            <h1 class="title">{{ $t('paywall.title') }}</h1>
            <p class="subtitle">{{ $t('paywall.subtitle') }}</p>
        </div>

        <!-- Features Grid -->
        <!-- <div class="features-section">
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
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                </div>
            </div>
        </div>-->

        <!-- Pricing Plans -->
        <div class="pricing-section" v-if="subscriptionPlans.length > 0">
            <!--<h2 class="pricing-title">{{ $t('paywall.choosePlan') }}</h2>-->

            <div class="plans-container">
                <div v-for="plan in subscriptionPlans" :key="plan.id" class="plan-card" :class="{
                    active: selectedPlan === plan.id,
                    popular: plan.isPopular,
                    loading: isLoading && selectedPlan === plan.id
                }" @click="selectPlan(plan.id)">
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

        <!-- Critical Error State - Force Retry -->
        <div v-else class="critical-error-state">
            <div class="error-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>
            <h3>Subscription Required</h3>
            <p>Unable to load subscription plans. Please check your internet connection and try again.</p>
            <button @click="forceRetryWithFallback" class="retry-button critical">
                Retry Loading Plans
            </button>
            <p class="critical-notice">This app requires an active subscription to continue.</p>
        </div>

        <!-- Action Buttons -->
        <div class="action-section">
            <button @click="purchaseSelected" class="purchase-button" :disabled="!selectedPlan || isLoading"
                :class="{ loading: isLoading }">
                <div v-if="isLoading" class="loading-spinner"></div>
                <span v-else>{{ getPurchaseButtonText }}</span>
            </button>

            <button @click="restorePurchases" class="restore-button" :disabled="isLoading">
                {{ $t('paywall.restorePurchases') }}
            </button>

            <!-- Terms and Privacy -->
            <div class="legal-links">
                <a href="#" @click.prevent="openTerms" class="legal-link">{{ $t('paywall.termsOfService') }}</a>
                <span class="separator">•</span>
                <a href="#" @click.prevent="openPrivacy" class="legal-link">{{ $t('paywall.privacyPolicy') }}</a>
                <span v-if="isIOS" class="separator">•</span>
                <a v-if="isIOS" href="#" @click.prevent="openMore" class="legal-link">{{ $t('paywall.redeemCode') }}</a>
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
import { Capacitor } from '@capacitor/core'

/*interface Feature {
    title: string
    description: string
    icon: string
}*/

const router = useRouter()

const selectedPlan = ref<string>('annual')
const subscriptionPlans = ref<SubscriptionPlan[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const showMenu = ref(false)
const isIOS = Capacitor.getPlatform() === 'ios'

/*const features: Feature[] = [
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
]*/

const getPurchaseButtonText = computed(() => {
    if (!selectedPlan.value) return 'Select a Plan'

    const plan = subscriptionPlans.value.find(p => p.id === selectedPlan.value)
    if (!plan) return 'Continue'

    if (plan.period === 'lifetime') {
        return `Get Lifetime Access - ${plan.price}`
    }

    return `Start ${plan.title} Plan - ${plan.price}`
})



async function loadSubscriptionPlans() {
    try {
        isLoading.value = true
        errorMessage.value = ''
        subscriptionPlans.value = await revenueCatService.getOfferings()

        if (subscriptionPlans.value.length === 0) {
            throw new Error('No subscription plans available - subscription required')
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
        errorMessage.value = 'Subscription required to access this app. Please check your internet connection and try again.'
    } finally {
        isLoading.value = false
    }
}

async function forceRetryWithFallback() {
    // Force retry with no fallback - user must purchase
    await loadSubscriptionPlans()

    // If still no plans after retry, show critical error but no bypass
    if (subscriptionPlans.value.length === 0) {
        errorMessage.value = 'Subscription required to continue. This app cannot be used without an active subscription.'
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
            errorMessage.value = 'Purchase failed. Please try again to access the app.'
        }
    } catch (error: any) {
        console.error('Purchase failed:', error)

        if (error.message?.includes('user cancelled')) {
            errorMessage.value = 'Purchase was cancelled. Subscription is required to access this app.'
        } else if (error.message?.includes('payment invalid')) {
            errorMessage.value = 'Payment method is invalid. Please check your payment information.'
        } else if (error.message?.includes('network')) {
            errorMessage.value = 'Network error. Please check your internet connection and try again.'
        } else {
            errorMessage.value = 'Purchase failed. Subscription is required to access this app.'
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
            errorMessage.value = 'No previous purchases found. Please purchase a subscription to access the app.'
        }
    } catch (error) {
        console.error('Restore failed:', error)
        errorMessage.value = 'Failed to restore purchases. Please purchase a subscription to access the app.'
    } finally {
        isLoading.value = false
    }
}

function openTerms() {
    location.href = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'
}

function openPrivacy() {
    location.href = 'https://kalbuddy.com/privacy-policy.html'
}

function openMore() {
    router.push('/coupon')
}

// Close menu when clicking outside
onMounted(async () => {
    await loadSubscriptionPlans()

    // Add click listener to close menu when clicking outside
    document.addEventListener('click', () => {
        showMenu.value = false
    })
})
</script>

<style scoped>
.paywall-view {
    height: 100vh;
    height: 100dvh;
    background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
    color: white;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: max(44px, env(safe-area-inset-top, 44px));
    padding-bottom: max(80px, calc(80px + env(safe-area-inset-bottom, 0px)));
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    position: relative;
}

.menu-container {
    position: absolute;
    top: max(54px, env(safe-area-inset-top, 54px));
    right: 20px;
    z-index: 20;
}

.menu-button {
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

.menu-button:hover {
    background: rgba(255, 255, 255, 0.2);
}

.dropdown-menu {
    position: absolute;
    top: 48px;
    right: 0;
    min-width: 200px;
    background: rgba(30, 30, 46, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.menu-item {
    width: 100%;
    background: transparent;
    border: none;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
}

.menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.menu-item svg {
    width: 16px;
    height: 16px;
    opacity: 0.7;
}

.header-section {
    text-align: center;
    margin-bottom: 30px;
    margin-top: 40px;
    padding: 0 12px;
}

.app-icon {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #007052, #00a86b);
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    color: white;
    box-shadow: 0 12px 40px rgba(0, 112, 82, 0.3);
}

.title {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #ffffff, #e0e0e0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.subtitle {
    font-size: 18px;
    opacity: 0.8;
    line-height: 1.5;
    /* max-width: 280px; */
    margin: 0 auto;
    font-weight: 400;
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

.critical-error-state {
    text-align: center;
    padding: 60px 20px;
    margin-bottom: 32px;
    background: rgba(255, 69, 58, 0.1);
    border: 2px solid rgba(255, 69, 58, 0.2);
    border-radius: 16px;
}

.error-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    color: rgba(255, 69, 58, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
}

.critical-error-state h3 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    color: rgba(255, 69, 58, 0.9);
}

.critical-error-state p {
    font-size: 14px;
    opacity: 0.8;
    margin-bottom: 20px;
    line-height: 1.5;
}

.critical-notice {
    font-size: 12px !important;
    color: rgba(255, 69, 58, 0.7) !important;
    font-weight: 600 !important;
    margin-top: 16px !important;
    padding: 8px 12px;
    background: rgba(255, 69, 58, 0.05);
    border-radius: 8px;
}

.retry-button.critical {
    background: rgba(255, 69, 58, 0.8);
    color: white;
    border: 2px solid rgba(255, 69, 58, 0.9);
    font-weight: 600;
}

.retry-button.critical:hover {
    background: rgba(255, 69, 58, 0.9);
    border-color: rgba(255, 69, 58, 1);
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
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
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

    /*.paywall-view {
        padding: 16px;
    }
*/
    .title {
        font-size: 28px;
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
