import { revenueCatService } from '../services/revenuecat'
import { isSubscriptionActive } from '../stores/userStore'
import type { Router } from 'vue-router'

export class SubscriptionGuard {
  private static instance: SubscriptionGuard
  private router: Router | null = null

  private constructor() {}

  static getInstance(): SubscriptionGuard {
    if (!SubscriptionGuard.instance) {
      SubscriptionGuard.instance = new SubscriptionGuard()
    }
    return SubscriptionGuard.instance
  }

  setRouter(router: Router) {
    this.router = router
  }

  async checkSubscriptionStatus(): Promise<boolean> {
    try {
      // Always check with RevenueCat for the most up-to-date status
      const hasActiveSubscription = await revenueCatService.checkSubscriptionStatus()
      
      if (hasActiveSubscription) {
        // Update local store if RevenueCat says we have an active subscription
        const { updateSubscriptionStatus } = await import('../stores/userStore')
        await updateSubscriptionStatus(true, 'Premium')
        return true
      }

      // If no active subscription, update local store accordingly
      const { updateSubscriptionStatus } = await import('../stores/userStore')
      await updateSubscriptionStatus(false, '')
      return false
    } catch (error) {
      console.error('Error checking subscription status:', error)
      // In case of error, be conservative and require subscription
      return false
    }
  }

  async requireSubscription(currentRouteName?: string): Promise<boolean> {
    const hasSubscription = await this.checkSubscriptionStatus()
    
    if (!hasSubscription && this.router) {
      // Only exempt paywall and onboarding from subscription requirement
      const exemptRoutes = ['onboarding', 'paywall', 'coupon']

      if (!exemptRoutes.includes(currentRouteName?.toLowerCase() || '')) {
        console.log('No active subscription found, redirecting to paywall')
        this.router.push('/paywall')
        return false
      }
    }
    
    return hasSubscription
  }

  // Check if premium features should be available
  canAccessPremiumFeatures(): boolean {
    return isSubscriptionActive.value
  }
}

export const subscriptionGuard = SubscriptionGuard.getInstance()
