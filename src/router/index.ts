import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import YesterdayView from "../views/YesterdayView.vue";
import OnboardingView from "../views/OnboardingView.vue";
import PaywallView from "../views/PaywallView.vue";
import ScanView from "../views/ScanView.vue";
import NutritionView from "../views/NutritionView.vue";
import AnalyticsView from "../views/AnalyticsView.vue";
import SettingsView from "../views/SettingsView.vue";
import StreakView from "../views/StreakView.vue";
import ProfileEditView from "../views/ProfileEditView.vue";

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

export default router;
