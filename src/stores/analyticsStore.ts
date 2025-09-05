import { reactive, ref } from "vue";
import { AnalyticsManager } from "../utils/analyticsData";
import type { AnalyticsData } from "../utils/analyticsData";

interface AnalyticsStore {
  data: AnalyticsData | null;
  isLoading: boolean;
  currentPeriod: "week" | "month" | "year";
  error: string | null;
}

const analyticsStore = reactive<AnalyticsStore>({
  data: null,
  isLoading: false,
  currentPeriod: "week",
  error: null,
});

export const analyticsActions = {
  async loadAnalyticsData(period: "week" | "month" | "year" = "week") {
    analyticsStore.isLoading = true;
    analyticsStore.error = null;
    analyticsStore.currentPeriod = period;

    try {
      const data = await AnalyticsManager.getAnalyticsData(period);
      analyticsStore.data = data;
      analyticsStore.error = null;
      return data;
    } catch (error) {
      console.error("Error loading analytics data:", error);
      analyticsStore.error =
        error instanceof Error
          ? error.message
          : "Failed to load analytics data";
      throw error;
    } finally {
      analyticsStore.isLoading = false;
    }
  },

  async refreshAnalyticsData(period: "week" | "month" | "year" = "week") {
    return this.loadAnalyticsData(period);
  },

  getAnalyticsData(): AnalyticsData | null {
    return analyticsStore.data;
  },

  setPeriod(period: "week" | "month" | "year") {
    analyticsStore.currentPeriod = period;
  },
};

export { analyticsStore };

export const isAnalyticsLoading = ref(() => analyticsStore.isLoading);
export const analyticsData = ref(() => analyticsStore.data);
export const analyticsError = ref(() => analyticsStore.error);
export const analyticsPeriod = ref(() => analyticsStore.currentPeriod);
