// UI-test support for automated App Store screenshots (Marteso).
//
// The screenshot UITest launches the app with these Capacitor Preferences flags
// (passed as `-CapacitorStorage.<key> <value>` launch arguments, which land in
// UserDefaults and are readable via @capacitor/preferences):
//
//   ui_test_mode        "1"   -> seed demo data, force premium, skip onboarding
//   ui_test_start_route "/.." -> navigate straight to the screen to capture
//
// None of this runs in production builds: without the flag every helper is a
// no-op after a single cheap Preferences read.

import { Preferences } from '@capacitor/preferences'
import { Storage } from './storage'
import { setLanguage } from '../i18n'

let cachedMode: boolean | null = null

export async function isUiTestMode(): Promise<boolean> {
  if (cachedMode !== null) return cachedMode
  try {
    const { value } = await Preferences.get({ key: 'ui_test_mode' })
    cachedMode = value === '1' || value === 'true'
  } catch {
    cachedMode = false
  }
  return cachedMode
}

export async function getUiTestStartRoute(): Promise<string | null> {
  try {
    const { value } = await Preferences.get({ key: 'ui_test_start_route' })
    return value || null
  } catch {
    return null
  }
}

function isoDaysAgo(days: number, hour: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, 15, 0, 0)
  return d.toISOString()
}

interface Meal {
  names: { en: string; de: string; es: string }
  total: { calories: number; protein: number; carbs: number; fat: number }
  hour: number
}

const MEAL_TEMPLATES: Meal[] = [
  { names: { en: 'Oatmeal with Berries', de: 'Haferbrei mit Beeren', es: 'Avena con frutos rojos' }, total: { calories: 320, protein: 12, carbs: 54, fat: 7 }, hour: 8 },
  { names: { en: 'Grilled Chicken Salad', de: 'Gegrillter Hähnchensalat', es: 'Ensalada de pollo a la parrilla' }, total: { calories: 540, protein: 43, carbs: 22, fat: 28 }, hour: 13 },
  { names: { en: 'Salmon with Vegetables', de: 'Lachs mit Gemüse', es: 'Salmón con verduras' }, total: { calories: 610, protein: 46, carbs: 24, fat: 34 }, hour: 19 },
  { names: { en: 'Greek Yogurt & Apple', de: 'Griechischer Joghurt & Apfel', es: 'Yogur griego y manzana' }, total: { calories: 210, protein: 17, carbs: 28, fat: 4 }, hour: 16 },
]

function buildScanHistory(): any[] {
  const items: any[] = []
  let id = Date.now()
  // 5 days of history (today + 4 previous) so Home and the analytics trend
  // charts both look populated.
  for (let day = 0; day < 5; day++) {
    const meals = day === 0 ? MEAL_TEMPLATES.slice(0, 3) : MEAL_TEMPLATES
    for (const meal of meals) {
      items.push({
        id: id++,
        type: 'food',
        timestamp: isoDaysAgo(day, meal.hour),
        // analyticsData groups the day chart by `scan.time` (HH:MM), separate
        // from the ISO timestamp — without it the day chart stays empty.
        time: `${String(meal.hour).padStart(2, '0')}:15`,
        data: {
          names: meal.names,
          foods: [{ names: meal.names }],
          total: meal.total,
          confidence: 'high',
        },
      })
    }
  }
  // newest first, matching how ScanHistory.add stores entries
  return items.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
}

function dateDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

function buildWeightEntries(): any[] {
  // newest first (WeightTracker reads entries[0] as the latest)
  const entries: any[] = []
  let weight = 80.1
  for (let day = 0; day <= 30; day += 3) {
    entries.push({ weight: Math.round(weight * 10) / 10, date: dateDaysAgo(day) })
    weight += 0.4
  }
  return entries
}

let seeded = false

export async function seedUiTestData(): Promise<void> {
  if (seeded) return
  seeded = true

  // Deterministic language from the device language forwarded by the UITest.
  const lang = (navigator.language || 'en').split('-')[0]
  if (lang === 'de' || lang === 'es') setLanguage(lang)
  else setLanguage('en')

  await Storage.set('onboardingCompleted', true)
  await Storage.set('userProfile', {
    name: 'Alex',
    email: '',
    age: 28,
    gender: 'male',
    height: 182,
    targetWeight: 78,
    activityLevel: 'moderate',
    goal: 'lose',
  })
  await Storage.set('dailyGoals', { calories: 2500, protein: 150, carbs: 250, fats: 80 })
  await Storage.set('subscriptionStatus', { isActive: true, plan: 'Premium', expiresAt: null })
  await Storage.set('scanHistory', buildScanHistory())
  await Storage.set('weightEntries', buildWeightEntries())
  await Storage.set('currentStreak', 12)
  await Storage.set('longestStreak', 18)
  await Storage.set('lastLoggedDate', new Date().toISOString().split('T')[0])
}
