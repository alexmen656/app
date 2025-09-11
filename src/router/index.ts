import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import YesterdayView from "../views/YesterdayView.vue";
import OnboardingView from "../views/OnboardingView.vue";
import PaywallView from "../views/PaywallView.vue";
import UpgradeView from "../views/UpgradeView.vue";
import CouponView from "../views/CouponView.vue";
import ScanView from "../views/ScanView.vue";
import NutritionView from "../views/NutritionView.vue";
import AnalyticsView from "../views/AnalyticsView.vue";
import SettingsView from "../views/SettingsView.vue";
import HealthKitSettingsView from "../views/HealthKitSettingsView.vue";
import NotificationSettingsView from "../views/NotificationSettingsView.vue";
import SourcesDisclaimerView from "../views/SourcesDisclaimerView.vue";
import StreakView from "../views/StreakView.vue";
import ProfileEditView from "../views/ProfileEditView.vue";
import CaloriesDetailView from "../views/CaloriesDetailView.vue";
import ProteinDetailView from "../views/ProteinDetailView.vue";
import CarbsDetailView from "../views/CarbsDetailView.vue";
import FatsDetailView from "../views/FatsDetailView.vue";
import BMIDetailView from "../views/BMIDetailView.vue";
import WeightDetailView from "../views/WeightDetailView.vue";
import AllScansView from "../views/AllScansView.vue";
import ScanDetailView from "../views/ScanDetailView.vue";
import FoodDatabaseView from "../views/FoodDatabaseView.vue";
import ManualFoodEntryView from "../views/ManualFoodEntryView.vue";
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
    path: "/upgrade",
    name: "Upgrade",
    component: UpgradeView,
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
    path: "/settings/healthkit",
    name: "HealthKitSettings",
    component: HealthKitSettingsView,
  },
  {
    path: "/settings/notifications",
    name: "NotificationSettings",
    component: NotificationSettingsView,
  },
  {
    path: "/sources-disclaimer",
    name: "SourcesDisclaimer",
    component: SourcesDisclaimerView,
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
  {
    path: "/calories",
    name: "CaloriesDetail",
    component: CaloriesDetailView,
  },
  {
    path: "/protein",
    name: "ProteinDetail",
    component: ProteinDetailView,
  },
  {
    path: "/carbs",
    name: "CarbsDetail",
    component: CarbsDetailView,
  },
  {
    path: "/fats",
    name: "FatsDetail",
    component: FatsDetailView,
  },
  {
    path: "/all-scans",
    name: "AllScans",
    component: AllScansView,
  },
  {
    path: "/scan-detail",
    name: "ScanDetail",
    component: ScanDetailView,
  },
  {
    path: "/bmi-detail",
    name: "BMIDetail",
    component: BMIDetailView,
  },
  {
    path: "/weight-detail",
    name: "WeightDetail",
    component: WeightDetailView,
  },
  {
    path: "/food-database",
    name: "FoodDatabase",
    component: FoodDatabaseView,
  },
  {
    path: "/manual-entry",
    name: "ManualFoodEntry",
    component: ManualFoodEntryView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  try {
    const { storeReady } = await import('../stores/userStore')
    await storeReady

    if (!isOnboardingCompleted.value && to.name !== 'Onboarding') {
      return next('/onboarding')
    }

    next()
  } catch (error) {
    console.error('Router guard error:', error)
    next()
  }
})

export default router;
