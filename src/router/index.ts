import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import YesterdayView from "../views/YesterdayView.vue";
import OnboardingView from "../views/OnboardingView.vue";
import PaywallView from "../views/PaywallView.vue";
import CouponView from "../views/CouponView.vue";
import ScanView from "../views/ScanView.vue";
import NutritionView from "../views/NutritionView.vue";
import AnalyticsView from "../views/AnalyticsView.vue";
import SettingsView from "../views/SettingsView.vue";
import StreakView from "../views/StreakView.vue";
import ProfileEditView from "../views/ProfileEditView.vue";
import { subscriptionGuard } from "../utils/subscriptionGuard";
import { isOnboardingCompleted } from "../stores/userStore";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/yesterday",
    name: "Yesterday",
    component: YesterdayView,
  },
  {
    path: "/onboarding",
    name: "Onboarding",
    component: OnboardingView,
  },
  {
    path: "/paywall",
    name: "Paywall",
    component: PaywallView,
  },
  {
    path: "/coupon",
    name: "Coupon",
    component: CouponView,
  },
  {
    path: "/scan",
    name: "Scan",
    component: ScanView,
  },
  {
    path: "/analytics",
    name: "Analytics",
    component: AnalyticsView,
  },
  {
    path: "/settings",
    name: "Settings",
    component: SettingsView,
  },
  {
    path: "/nutrition",
    name: "Nutrition",
    component: NutritionView,
  },
  {
    path: "/streak",
    name: "Streak",
    component: StreakView,
  },
  {
    path: "/profile/edit",
    name: "ProfileEdit",
    component: ProfileEditView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Set up subscription guard
subscriptionGuard.setRouter(router)

// Global navigation guard for subscription checking
router.beforeEach(async (to, _from, next) => {
  // Wait for user store to be ready
  const { storeReady } = await import('../stores/userStore')
  await storeReady

  // Check if onboarding is completed
  if (!isOnboardingCompleted.value && to.name !== 'Onboarding') {
    return next('/onboarding')
  }

  // Routes that don't require subscription
  const freeRoutes = ['Onboarding', 'Paywall', 'Coupon']
  
  if (freeRoutes.includes(to.name as string)) {
    return next()
  }

  // Check subscription for protected routes
  const hasSubscription = await subscriptionGuard.requireSubscription(to.name as string)
  
  if (!hasSubscription && to.name !== 'Paywall') {
    // User will be redirected to paywall by the subscription guard
    return
  }

  next()
})

export default router;
