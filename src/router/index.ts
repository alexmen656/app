import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { isOnboardingCompleted } from "../stores/userStore";

// Only the initial HomeView is eagerly imported. Every other view is
// lazy-loaded so it lands in its own chunk and is fetched on first navigation,
// keeping the initial bundle small.
const YesterdayView = () => import("../views/YesterdayView.vue");
const HistoryView = () => import("../views/HistoryView.vue");
const OnboardingView = () => import("../views/OnboardingView.vue");
const PaywallView = () => import("../views/PaywallView.vue");
const UpgradeView = () => import("../views/UpgradeView.vue");
const CouponView = () => import("../views/CouponView.vue");
const ScanView = () => import("../views/ScanView.vue");
const NutritionView = () => import("../views/NutritionView.vue");
const AnalyticsView = () => import("../views/AnalyticsView.vue");
const SettingsView = () => import("../views/SettingsView.vue");
const HealthKitSettingsView = () => import("../views/HealthKitSettingsView.vue");
const NotificationSettingsView = () => import("../views/NotificationSettingsView.vue");
const SourcesDisclaimerView = () => import("../views/SourcesDisclaimerView.vue");
const StreakView = () => import("../views/StreakView.vue");
const ProfileEditView = () => import("../views/ProfileEditView.vue");
const CaloriesDetailView = () => import("../views/CaloriesDetailView.vue");
const ProteinDetailView = () => import("../views/ProteinDetailView.vue");
const CarbsDetailView = () => import("../views/CarbsDetailView.vue");
const FatsDetailView = () => import("../views/FatsDetailView.vue");
const BMIDetailView = () => import("../views/BMIDetailView.vue");
const WeightDetailView = () => import("../views/WeightDetailView.vue");
const AllScansView = () => import("../views/AllScansView.vue");
const ScanDetailView = () => import("../views/ScanDetailView.vue");
const FoodDatabaseView = () => import("../views/FoodDatabaseView.vue");
const ManualFoodEntryView = () => import("../views/ManualFoodEntryView.vue");
const ChatView = () => import("../views/ChatView.vue");
const FeedbackView = () => import("../views/FeedbackView.vue");

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
    path: "/history",
    name: "History",
    component: HistoryView,
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
  {
    path: "/chat",
    name: "Chat",
    component: ChatView,
  },
  {
    path: "/feedback",
    name: "Feedback",
    component: FeedbackView,
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
