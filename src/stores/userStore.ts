import { reactive, computed } from 'vue'

interface UserProfile {
  name: string
  email: string
  age: number | null
  gender: string
  height: number | null
  weight: number | null
  activityLevel: string
}

interface DailyGoals {
  calories: number
  protein: number
  carbs: number
  fats: number
}

interface UserPreferences {
  units: 'metric' | 'imperial'
  notifications: boolean
  mealReminders: boolean
  weeklyReports: boolean
}

// Default values
const defaultUserProfile: UserProfile = {
  name: '',
  email: '',
  age: null,
  gender: '',
  height: null,
  weight: null,
  activityLevel: ''
}

const defaultGoals: DailyGoals = {
  calories: 2500,
  protein: 125,
  carbs: 250,
  fats: 85
}

const defaultPreferences: UserPreferences = {
  units: 'metric',
  notifications: true,
  mealReminders: true,
  weeklyReports: false
}

// Load from localStorage or use defaults
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

// Save to localStorage
function saveToStorage(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error)
  }
}

// Reactive state
export const userProfile = reactive<UserProfile>(
  loadFromStorage('userProfile', defaultUserProfile)
)

export const dailyGoals = reactive<DailyGoals>(
  loadFromStorage('dailyGoals', defaultGoals)
)

export const userPreferences = reactive<UserPreferences>(
  loadFromStorage('userPreferences', defaultPreferences)
)

// Computed values
export const isOnboardingCompleted = computed(() => {
  return localStorage.getItem('onboardingCompleted') === 'true'
})

export const hasValidProfile = computed(() => {
  return userProfile.name && userProfile.age && userProfile.gender && 
         userProfile.height && userProfile.weight
})

// Actions
export function updateUserProfile(updates: Partial<UserProfile>) {
  Object.assign(userProfile, updates)
  saveToStorage('userProfile', userProfile)
}

export function updateDailyGoals(updates: Partial<DailyGoals>) {
  Object.assign(dailyGoals, updates)
  saveToStorage('dailyGoals', dailyGoals)
}

export function updateUserPreferences(updates: Partial<UserPreferences>) {
  Object.assign(userPreferences, updates)
  saveToStorage('userPreferences', userPreferences)
}

export function completeOnboarding() {
  localStorage.setItem('onboardingCompleted', 'true')
}

export function resetOnboarding() {
  localStorage.removeItem('onboardingCompleted')
  localStorage.removeItem('userProfile')
  localStorage.removeItem('dailyGoals')
  localStorage.removeItem('userPreferences')
  
  // Reset reactive state
  Object.assign(userProfile, defaultUserProfile)
  Object.assign(dailyGoals, defaultGoals)
  Object.assign(userPreferences, defaultPreferences)
}

// BMR calculation using Harris-Benedict equation
export function calculateBMR(profile: UserProfile): number {
  if (!profile.age || !profile.weight || !profile.height || !profile.gender) {
    return 0
  }

  if (profile.gender === 'male') {
    return 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age)
  } else {
    return 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age)
  }
}

// TDEE calculation (Total Daily Energy Expenditure)
export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile)
  
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extra: 1.9
  }

  const multiplier = activityMultipliers[profile.activityLevel as keyof typeof activityMultipliers] || 1.2
  return Math.round(bmr * multiplier)
}

// Recommended macros calculation
export function calculateRecommendedMacros(profile: UserProfile) {
  const tdee = calculateTDEE(profile)
  
  return {
    calories: tdee,
    protein: Math.round((profile.weight || 70) * 1.6), // 1.6g per kg body weight
    carbs: Math.round((tdee * 0.5) / 4), // 50% of calories from carbs (4 cal/g)
    fats: Math.round((tdee * 0.25) / 9) // 25% of calories from fats (9 cal/g)
  }
}
