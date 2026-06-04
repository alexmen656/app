// Central API configuration.
//
// Base URLs are read from Vite env vars so they can be pointed at a staging or
// local backend without touching code. The production defaults are used when no
// env var is set (e.g. in CI builds).
//
//   VITE_API_BASE_URL  – main backend (food/label/text analysis, chat, product…)
//   VITE_FOOD_DB_URL   – legacy food-database PHP endpoints

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || "https://api.kalbuddy.com/api";

export const FOOD_DB_BASE_URL: string =
  import.meta.env.VITE_FOOD_DB_URL || "https://alex.polan.sk/kalbuddy";
