import { Purchases } from "@revenuecat/purchases-capacitor";
import { Capacitor } from '@capacitor/core';
import i18n from '../i18n';

const t = (key: string) => i18n.global.t(key);

// Identifier of the entitlement that unlocks premium, as configured in the
// RevenueCat dashboard. Must match exactly (it is "Pro", not "premium").
const PREMIUM_ENTITLEMENT_ID = "Pro";

export interface SubscriptionPlan {
  id: string;
  title: string;
  description: string;
  price: string;
  period: string;        // raw key for logic ("month" | "year" | "lifetime" | "week")
  periodLabel: string;   // localized label for display
  isPopular?: boolean;
}

class RevenueCatService {
  private initialized = false;
  private cachedOfferings: SubscriptionPlan[] | null = null;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Replace with your actual RevenueCat API keys
      let apiKey = '';
      if (Capacitor.getPlatform() === 'ios') {
        apiKey = import.meta.env.VITE_REVENUECAT_API_KEY_IOS || "";
      } else if (Capacitor.getPlatform() === 'android') {
        apiKey = import.meta.env.VITE_REVENUECAT_API_KEY_ANDROID || "";
      }

      console.log(
        "Initializing RevenueCat with API key:",
        apiKey.substring(0, 10) + "..."
      );

      await Purchases.configure({
        apiKey,
      });

      this.initialized = true;
      console.log("RevenueCat initialized successfully");
    } catch (error) {
      console.error("Failed to initialize RevenueCat:", error);
      throw error;
    }
  }

  async getOfferings(): Promise<SubscriptionPlan[]> {
    try {
      if (this.cachedOfferings) {
        console.log("Returning cached RevenueCat offerings");
        return this.cachedOfferings;
      }

      if (!this.initialized) {
        await this.initialize();
      }

      console.log("Fetching RevenueCat offerings...");
      const offerings = await Purchases.getOfferings();
      console.log("RevenueCat offerings response:", offerings);

      const currentOffering = offerings.current;

      if (!currentOffering) {
        throw new Error(
          "No current offering configured in RevenueCat. Please configure offerings in your RevenueCat dashboard."
        );
      }

      if (
        !currentOffering.availablePackages ||
        currentOffering.availablePackages.length === 0
      ) {
        throw new Error(
          "No subscription packages available. Please configure products in your RevenueCat dashboard."
        );
      }

      console.log("Available packages:", currentOffering.availablePackages);

      const plans = currentOffering.availablePackages.map((pkg, index) => {
        console.log(`Package ${index}:`, pkg);
        return {
          id: pkg.identifier,
          title: this.getPackageTitle(pkg.identifier),
          description: this.getPackageDescription(pkg.identifier),
          price: pkg.product?.priceString || "Price unavailable",
          period: this.getPackagePeriod(pkg.packageType),
          periodLabel: this.getPackagePeriodLabel(pkg.packageType),
          isPopular: this.isPopularPackage(pkg.identifier),
        };
      });

      console.log("Mapped subscription plans:", plans);
      this.cachedOfferings = plans;
      
      return plans;
    } catch (error) {
      console.error("Failed to get offerings:", error);
      throw error; // Re-throw the error instead of using mock data
    }
  }
  
  async prefetchOfferings(): Promise<void> {
    try {
      await this.getOfferings();
      console.log("Offerings prefetched successfully");
    } catch (error) {
      console.warn("Failed to prefetch offerings:", error);
    }
  }

  async purchasePackage(packageId: string): Promise<boolean> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;

      if (!currentOffering) {
        throw new Error("No current offering available");
      }

      const packageToPurchase = currentOffering.availablePackages.find(
        (pkg) => pkg.identifier === packageId
      );

      if (!packageToPurchase) {
        throw new Error(`Package ${packageId} not found`);
      }

      const purchaseResult = await Purchases.purchasePackage({
        aPackage: packageToPurchase,
      });

      return this.checkPremiumAccess(purchaseResult.customerInfo);
    } catch (error) {
      console.error("Purchase failed:", error);
      throw error;
    }
  }

  async restorePurchases(): Promise<boolean> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const result = await Purchases.restorePurchases();
      return this.checkPremiumAccess(result.customerInfo);
    } catch (error) {
      console.error("Restore purchases failed:", error);
      throw error;
    }
  }

  async checkSubscriptionStatus(): Promise<boolean> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const result = await Purchases.getCustomerInfo();
      return this.checkPremiumAccess(result.customerInfo);
    } catch (error) {
      console.error("Failed to check subscription status:", error);
      return false;
    }
  }

  private checkPremiumAccess(customerInfo: any): boolean {
    // Grant premium access only for the dedicated premium entitlement.
    // (Checking any active entitlement would wrongly unlock premium if another
    // entitlement is ever added in RevenueCat.)
    return !!customerInfo.entitlements?.active?.[PREMIUM_ENTITLEMENT_ID];
  }

  async presentCodeRedemptionSheet(): Promise<void> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log("Presenting iOS code redemption sheet...");

      // Use RevenueCat's method to present Apple's native redemption sheet
      await Purchases.presentCodeRedemptionSheet();

      console.log("Code redemption sheet presented successfully");
    } catch (error) {
      console.error("Failed to present code redemption sheet:", error);
      throw error;
    }
  }

  private isPopularPackage(identifier: string): boolean {
    // Mark annual packages as popular
    const popularPackages = [
      "$rc_annual",
      "annual",
      "annual_premium",
      "com.kaloriq.annual",
    ];
    return popularPackages.includes(identifier.toLowerCase());
  }

  private getPackageTitle(identifier: string): string {
    const keys: Record<string, string> = {
      $rc_monthly: "monthly", $rc_annual: "annual", $rc_lifetime: "lifetime",
      monthly: "monthly", annual: "annual", lifetime: "lifetime",
      monthly_premium: "monthly", annual_premium: "annual", lifetime_premium: "lifetime",
    };
    const key = keys[identifier];
    return key ? t(`upgrade.plans.${key}`) : t("upgrade.plans.premium");
  }

  private getPackageDescription(identifier: string): string {
    const keys: Record<string, string> = {
      $rc_monthly: "monthlyDesc", $rc_annual: "annualDesc", $rc_lifetime: "lifetimeDesc",
      monthly: "monthlyDesc", annual: "annualDesc", lifetime: "lifetimeDesc",
      monthly_premium: "monthlyDesc", annual_premium: "annualDesc", lifetime_premium: "lifetimeDesc",
    };
    const key = keys[identifier];
    return key ? t(`upgrade.plans.${key}`) : t("upgrade.plans.premium");
  }

  // Raw period key used for logic (do not localize).
  private getPackagePeriod(packageType: string): string {
    const periods: Record<string, string> = {
      MONTHLY: "month",
      ANNUAL: "year",
      LIFETIME: "lifetime",
      WEEKLY: "week",
    };
    return periods[packageType] || "month";
  }

  // Localized period label for display.
  private getPackagePeriodLabel(packageType: string): string {
    const keys: Record<string, string> = {
      MONTHLY: "month",
      ANNUAL: "year",
      LIFETIME: "lifetimePeriod",
      WEEKLY: "week",
    };
    return t(`upgrade.plans.${keys[packageType] || "month"}`);
  }
}

export const revenueCatService = new RevenueCatService();
