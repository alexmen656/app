import { Purchases } from "@revenuecat/purchases-capacitor";
import { Capacitor } from '@capacitor/core';

export interface SubscriptionPlan {
  id: string;
  title: string;
  description: string;
  price: string;
  period: string;
  isPopular?: boolean;
}

class RevenueCatService {
  private initialized = false;

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
          isPopular: this.isPopularPackage(pkg.identifier),
        };
      });

      console.log("Mapped subscription plans:", plans);
      return plans;
    } catch (error) {
      console.error("Failed to get offerings:", error);
      throw error; // Re-throw the error instead of using mock data
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
    // Check if user has active premium entitlement
    if (customerInfo.entitlements?.active?.premium) {
      return true;
    }

    // Check if user has any active entitlements
    const activeEntitlements = customerInfo.entitlements?.active || {};
    return Object.keys(activeEntitlements).length > 0;
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
    const titles: Record<string, string> = {
      $rc_monthly: "Monthly",
      $rc_annual: "Annual",
      $rc_lifetime: "Lifetime",
      monthly: "Monthly",
      annual: "Annual",
      lifetime: "Lifetime",
      monthly_premium: "Monthly",
      annual_premium: "Annual",
      lifetime_premium: "Lifetime",
    };
    return titles[identifier] || "Premium";
  }

  private getPackageDescription(identifier: string): string {
    const descriptions: Record<string, string> = {
      $rc_monthly: "Perfect for trying out",
      $rc_annual: "Best value - Save 50%",
      $rc_lifetime: "One-time payment",
      monthly: "Perfect for trying out",
      annual: "Best value - Save 50%",
      lifetime: "One-time payment",
      monthly_premium: "Perfect for trying out",
      annual_premium: "Best value - Save 50%",
      lifetime_premium: "One-time payment",
    };
    return descriptions[identifier] || "Premium access";
  }

  private getPackagePeriod(packageType: string): string {
    const periods: Record<string, string> = {
      MONTHLY: "month",
      ANNUAL: "year",
      LIFETIME: "lifetime",
      WEEKLY: "week",
    };
    return periods[packageType] || "month";
  }
}

export const revenueCatService = new RevenueCatService();
