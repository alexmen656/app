import { reactive, computed, ref } from 'vue'
import { Storage } from '../utils/storage'

interface UserProfile {
  name: string
  email: string
  age: number | null
  gender: 'male' | 'female' | ''
  height: number | null
  weight: number | null
  targetWeight: number | null
  activityLevel: string
  goal?: string
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
  targetWeight: null,
  activityLevel: '',
  goal: ''
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

// Load from Capacitor Preferences or use defaults
async function loadFromStorage<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const stored = await Storage.get(key)
    return stored !== null ? stored : defaultValue
  } catch {
    return defaultValue
  }
}

// Save to Capacitor Preferences
async function saveToStorage(key: string, data: any): Promise<void> {
  try {
    await Storage.set(key, data)
  } catch (error) {
    console.error(`Failed to save ${key} to storage:`, error)
  }
}

// Initialize reactive state with defaults first, then load from storage
export const userProfile = reactive<UserProfile>({ ...defaultUserProfile })
export const dailyGoals = reactive<DailyGoals>({ ...defaultGoals })
export const userPreferences = reactive<UserPreferences>({ ...defaultPreferences })

// Reactive onboarding completion state
const onboardingCompleted = ref(false)

// Reactive subscription status
const subscriptionStatus = reactive({
  isActive: false,
  plan: '',
  expiresAt: null as Date | null
})

// Load data from storage on initialization
async function initializeStore() {
  try {
    const [loadedProfile, loadedGoals, loadedPreferences, loadedOnboarding, loadedSubscription] = await Promise.all([
      loadFromStorage('userProfile', defaultUserProfile),
      loadFromStorage('dailyGoals', defaultGoals),
      loadFromStorage('userPreferences', defaultPreferences),
      Storage.get('onboardingCompleted'),
      loadFromStorage('subscriptionStatus', { isActive: false, plan: '', expiresAt: null })
    ])

    Object.assign(userProfile, loadedProfile)
    Object.assign(dailyGoals, loadedGoals)
    Object.assign(userPreferences, loadedPreferences)
    onboardingCompleted.value = loadedOnboarding === true || loadedOnboarding === 'true'
    Object.assign(subscriptionStatus, loadedSubscription)
  } catch (error) {
    console.error('Failed to initialize store:', error)
  }
}

// Initialize the store and export a ready promise so consumers can await storage load
export const storeReady = initializeStore()

// Computed values
export const isOnboardingCompleted = computed(() => {
  return onboardingCompleted.value
})

export const hasValidProfile = computed(() => {
  return userProfile.name && userProfile.age && userProfile.gender && 
         userProfile.height && userProfile.weight
})

// Export subscription status
export const isSubscriptionActive = computed(() => {
  return subscriptionStatus.isActive
})

export const subscriptionPlan = computed(() => {
  return subscriptionStatus.plan
})

// Actions
export async function updateUserProfile(updates: Partial<UserProfile>) {
  Object.assign(userProfile, updates)
  await saveToStorage('userProfile', userProfile)
}
export async function updateDailyGoals(updates: Partial<DailyGoals>) {
  Object.assign(dailyGoals, updates)
  await saveToStorage('dailyGoals', dailyGoals)
}

export async function updateUserPreferences(updates: Partial<UserPreferences>) {
  Object.assign(userPreferences, updates)
  await saveToStorage('userPreferences', userPreferences)
}

export async function updateSubscriptionStatus(isActive: boolean, plan: string = '', expiresAt: Date | null = null) {
  subscriptionStatus.isActive = isActive
  subscriptionStatus.plan = plan
  subscriptionStatus.expiresAt = expiresAt
  await saveToStorage('subscriptionStatus', subscriptionStatus)
}

export async function completeOnboarding() {
  await Storage.set('onboardingCompleted', true)
  onboardingCompleted.value = true
}

export async function resetOnboarding() {
  await Promise.all([
    Storage.remove('onboardingCompleted'),
    Storage.remove('userProfile'),
    Storage.remove('dailyGoals'),
    Storage.remove('userPreferences')
  ])
  
  // Reset reactive state
  Object.assign(userProfile, defaultUserProfile)
  Object.assign(dailyGoals, defaultGoals)
  Object.assign(userPreferences, defaultPreferences)
  onboardingCompleted.value = false
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
