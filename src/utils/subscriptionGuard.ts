import { revenueCatService } from "../services/revenuecat";
import { isSubscriptionActive } from "../stores/userStore";

export class SubscriptionGuard {
  private static instance: SubscriptionGuard;

  private constructor() {}

  static getInstance(): SubscriptionGuard {
    if (!SubscriptionGuard.instance) {
      SubscriptionGuard.instance = new SubscriptionGuard();
    }
    return SubscriptionGuard.instance;
  }

  async checkSubscriptionStatus(): Promise<boolean> {
    try {
      const hasActiveSubscription =
        await revenueCatService.checkSubscriptionStatus();

      if (hasActiveSubscription) {
        const { updateSubscriptionStatus } = await import(
          "../stores/userStore"
        );
        await updateSubscriptionStatus(true, "Premium");
        return true;
      }

      const { updateSubscriptionStatus } = await import("../stores/userStore");
      await updateSubscriptionStatus(false, "");
      return false;
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return false;
    }
  }

  async requireSubscription(_currentRouteName?: string): Promise<boolean> {
    const hasSubscription = await this.checkSubscriptionStatus();
    return hasSubscription;
  }

  canAccessPremiumFeatures(): boolean {
    return isSubscriptionActive.value;
  }
}

export const subscriptionGuard = SubscriptionGuard.getInstance();
