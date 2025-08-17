<template>
    <div class="onboarding-view">
        <!-- Progress Indicator -->
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
            </div>
            <span class="progress-text">{{ currentStep }} of {{ totalSteps }}</span>
        </div>

        <!-- Welcome Step -->
        <div v-if="currentStep === 1" class="step-container">
            <div class="hero-section">
                <div class="hero-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
                    </svg>
                </div>
                <h1 class="hero-title">Welcome to <span class="brand">Kaloriq</span></h1>
                <p class="hero-subtitle">Track your nutrition with AI-powered food recognition and achieve your health goals with personalized insights.</p>
            </div>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                            <path d="M12 18h.01"/>
                        </svg>
                    </div>
                    <h3>AI Food Recognition</h3>
                    <p>Simply take a photo of your meal</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 3v5h5"/>
                            <path d="M21 21v-5h-5"/>
                            <path d="M8 8l13 13"/>
                            <path d="M3 8v10a2 2 0 0 0 2 2h10"/>
                        </svg>
                    </div>
                    <h3>Smart Analytics</h3>
                    <p>Track macros and calories effortlessly</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M16.2 7.8l-2 6.3-6.3 2 2-6.3 6.3-2z"/>
                        </svg>
                    </div>
                    <h3>Personal Goals</h3>
                    <p>Set and achieve your nutrition targets</p>
                </div>
            </div>
        </div>

        <!-- Personal Info Step -->
        <div v-if="currentStep === 2" class="step-container">
            <div class="content-section">
                <h2 class="step-title">Tell us about yourself</h2>
                <p class="step-subtitle">This helps us personalize your experience</p>
                
                <div class="form-group">
                    <label class="form-label">Name</label>
                    <input 
                        v-model="userInfo.name" 
                        type="text" 
                        class="form-input"
                        placeholder="Enter your name"
                    />
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Age</label>
                        <input 
                            v-model="userInfo.age" 
                            type="number" 
                            class="form-input"
                            placeholder="25"
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Gender</label>
                        <select v-model="userInfo.gender" class="form-select">
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Height</label>
                        <div class="input-with-unit">
                            <input 
                                v-model="userInfo.height" 
                                type="number" 
                                class="form-input"
                                placeholder="175"
                            />
                            <span class="unit">cm</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Weight</label>
                        <div class="input-with-unit">
                            <input 
                                v-model="userInfo.weight" 
                                type="number" 
                                class="form-input"
                                placeholder="70"
                            />
                            <span class="unit">kg</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Activity Level Step -->
        <div v-if="currentStep === 3" class="step-container">
            <div class="content-section">
                <h2 class="step-title">What's your activity level?</h2>
                <p class="step-subtitle">This helps us calculate your calorie needs</p>
                
                <div class="activity-options">
                    <div 
                        v-for="activity in activityLevels" 
                        :key="activity.value"
                        class="activity-card"
                        :class="{ active: userInfo.activityLevel === activity.value }"
                        @click="userInfo.activityLevel = activity.value"
                    >
                        <div class="activity-icon">{{ activity.icon }}</div>
                        <h3 class="activity-title">{{ activity.title }}</h3>
                        <p class="activity-description">{{ activity.description }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Goals Step -->
        <div v-if="currentStep === 4" class="step-container">
            <div class="content-section">
                <h2 class="step-title">Set your daily goals</h2>
                <p class="step-subtitle">Based on your profile, we recommend these targets</p>
                
                <div class="goals-container">
                    <!-- Calories Goal -->
                    <div class="goal-card calories-goal">
                        <div class="goal-header">
                            <div class="goal-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
                                </svg>
                            </div>
                            <div class="goal-info">
                                <h3 class="goal-title">Calories</h3>
                                <p class="goal-subtitle">Daily energy target</p>
                            </div>
                        </div>
                        <div class="goal-input-container">
                            <input 
                                v-model="goals.calories" 
                                type="number" 
                                class="goal-input"
                                step="50"
                            />
                            <span class="goal-unit">kcal</span>
                        </div>
                        <div class="goal-slider">
                            <input 
                                v-model="goals.calories" 
                                type="range" 
                                min="1200" 
                                max="4000" 
                                step="50"
                                class="slider calories-slider"
                            />
                        </div>
                    </div>

                    <!-- Protein Goal -->
                    <div class="goal-card protein-goal">
                        <div class="goal-header">
                            <div class="goal-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
                                </svg>
                            </div>
                            <div class="goal-info">
                                <h3 class="goal-title">Protein</h3>
                                <p class="goal-subtitle">Muscle building support</p>
                            </div>
                        </div>
                        <div class="goal-input-container">
                            <input 
                                v-model="goals.protein" 
                                type="number" 
                                class="goal-input"
                                step="5"
                            />
                            <span class="goal-unit">g</span>
                        </div>
                        <div class="goal-slider">
                            <input 
                                v-model="goals.protein" 
                                type="range" 
                                min="50" 
                                max="300" 
                                step="5"
                                class="slider protein-slider"
                            />
                        </div>
                    </div>

                    <!-- Carbs Goal -->
                    <div class="goal-card carbs-goal">
                        <div class="goal-header">
                            <div class="goal-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2c1.1 0 2 .9 2 2 0 .74-.4 1.38-1 1.72v2.56l7 7V17c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-1.72l7-7V5.72c-.6-.34-1-.98-1-1.72 0-1.1.9-2 2-2z"/>
                                </svg>
                            </div>
                            <div class="goal-info">
                                <h3 class="goal-title">Carbs</h3>
                                <p class="goal-subtitle">Energy for activities</p>
                            </div>
                        </div>
                        <div class="goal-input-container">
                            <input 
                                v-model="goals.carbs" 
                                type="number" 
                                class="goal-input"
                                step="10"
                            />
                            <span class="goal-unit">g</span>
                        </div>
                        <div class="goal-slider">
                            <input 
                                v-model="goals.carbs" 
                                type="range" 
                                min="100" 
                                max="500" 
                                step="10"
                                class="slider carbs-slider"
                            />
                        </div>
                    </div>

                    <!-- Fats Goal -->
                    <div class="goal-card fats-goal">
                        <div class="goal-header">
                            <div class="goal-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"/>
                                </svg>
                            </div>
                            <div class="goal-info">
                                <h3 class="goal-title">Fats</h3>
                                <p class="goal-subtitle">Essential nutrients</p>
                            </div>
                        </div>
                        <div class="goal-input-container">
                            <input 
                                v-model="goals.fats" 
                                type="number" 
                                class="goal-input"
                                step="5"
                            />
                            <span class="goal-unit">g</span>
                        </div>
                        <div class="goal-slider">
                            <input 
                                v-model="goals.fats" 
                                type="range" 
                                min="30" 
                                max="200" 
                                step="5"
                                class="slider fats-slider"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="navigation-buttons">
            <button 
                v-if="currentStep > 1" 
                @click="previousStep" 
                class="nav-button secondary"
            >
                Back
            </button>
            <button 
                @click="nextStep" 
                class="nav-button primary"
                :disabled="!canProceed"
            >
                {{ currentStep === totalSteps ? 'Get Started' : 'Continue' }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { updateUserProfile, updateDailyGoals, completeOnboarding } from '../stores/userStore'

const router = useRouter()

const currentStep = ref(1)
const totalSteps = 4

const userInfo = reactive({
    name: '',
    age: null as number | null,
    gender: '',
    height: null as number | null,
    weight: null as number | null,
    activityLevel: ''
})

const goals = reactive({
    calories: 2500,
    protein: 125,
    carbs: 250,
    fats: 85
})

const activityLevels = [
    {
        value: 'sedentary',
        icon: '🛋️',
        title: 'Sedentary',
        description: 'Little to no exercise, desk job'
    },
    {
        value: 'light',
        icon: '🚶',
        title: 'Lightly Active',
        description: 'Light exercise 1-3 days/week'
    },
    {
        value: 'moderate',
        icon: '🏃',
        title: 'Moderately Active',
        description: 'Moderate exercise 3-5 days/week'
    },
    {
        value: 'very',
        icon: '💪',
        title: 'Very Active',
        description: 'Hard exercise 6-7 days/week'
    },
    {
        value: 'extra',
        icon: '🏋️',
        title: 'Extremely Active',
        description: 'Very hard exercise, physical job'
    }
]

const canProceed = computed(() => {
    switch (currentStep.value) {
        case 1:
            return true
        case 2:
            return userInfo.name && userInfo.age && userInfo.gender && userInfo.height && userInfo.weight
        case 3:
            return userInfo.activityLevel
        case 4:
            return true
        default:
            return false
    }
})

function calculateRecommendedCalories() {
    if (!userInfo.age || !userInfo.weight || !userInfo.height || !userInfo.gender || !userInfo.activityLevel) {
        return
    }

    // Harris-Benedict equation
    let bmr: number
    if (userInfo.gender === 'male') {
        bmr = 88.362 + (13.397 * userInfo.weight) + (4.799 * userInfo.height) - (5.677 * userInfo.age)
    } else {
        bmr = 447.593 + (9.247 * userInfo.weight) + (3.098 * userInfo.height) - (4.330 * userInfo.age)
    }

    // Activity multipliers
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        very: 1.725,
        extra: 1.9
    }

    const multiplier = activityMultipliers[userInfo.activityLevel as keyof typeof activityMultipliers]
    const recommendedCalories = Math.round(bmr * multiplier)

    goals.calories = recommendedCalories
    goals.protein = Math.round(userInfo.weight * 1.6) // 1.6g per kg body weight
    goals.carbs = Math.round((recommendedCalories * 0.5) / 4) // 50% of calories from carbs
    goals.fats = Math.round((recommendedCalories * 0.25) / 9) // 25% of calories from fats
}

function nextStep() {
    if (currentStep.value === 3) {
        calculateRecommendedCalories()
    }
    
    if (currentStep.value < totalSteps) {
        currentStep.value++
    } else {
        finishOnboarding()
    }
}

function previousStep() {
    if (currentStep.value > 1) {
        currentStep.value--
    }
}

function finishOnboarding() {
    // Update user store with data
    updateUserProfile(userInfo)
    updateDailyGoals(goals)
    completeOnboarding()
    
    // Navigate to home
    router.push('/')
}
</script>

<style scoped>
.onboarding-view {
    height: 100vh;
    height: 100dvh;
    background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
    color: white;
    padding: 20px;
    padding-top: max(44px, env(safe-area-inset-top, 44px));
    padding-bottom: max(20px, env(safe-area-inset-bottom, 20px));
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.progress-container {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
}

.progress-bar {
    flex: 1;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #007052, #00a86b);
    transition: width 0.3s ease;
    border-radius: 2px;
}

.progress-text {
    font-size: 14px;
    opacity: 0.7;
    min-width: 60px;
    text-align: right;
}

.step-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.hero-section {
    text-align: center;
    margin-bottom: 48px;
}

.hero-icon {
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #007052, #00a86b);
    border-radius: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    color: white;
}

.hero-title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 16px;
}

.brand {
    color: #007052;
}

.hero-subtitle {
    font-size: 18px;
    opacity: 0.8;
    line-height: 1.4;
    max-width: 400px;
    margin: 0 auto;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 24px;
    margin-top: 32px;
}

.feature-card {
    text-align: center;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    backdrop-filter: blur(10px);
}

.feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    margin: 0 auto 12px;
    color: #007052;
}

.feature-card h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
}

.feature-card p {
    font-size: 14px;
    opacity: 0.7;
    margin: 0;
}

.content-section {
    max-width: 400px;
    margin: 0 auto;
    width: 100%;
}

.step-title {
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 12px;
}

.step-subtitle {
    font-size: 16px;
    opacity: 0.8;
    text-align: center;
    margin-bottom: 32px;
}

.form-group {
    margin-bottom: 24px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.form-label {
    display: block;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
}

.form-input, .form-select {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: white;
    padding: 16px;
    font-size: 16px;
    transition: border-color 0.2s;
}

.form-input:focus, .form-select:focus {
    outline: none;
    border-color: #007052;
}

.input-with-unit {
    position: relative;
}

.unit {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.7;
    font-size: 16px;
}

.activity-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.activity-card {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 16px;
}

.activity-card.active {
    background: rgba(0, 112, 82, 0.2);
    border-color: #007052;
}

.activity-icon {
    font-size: 24px;
    min-width: 40px;
}

.activity-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
}

.activity-description {
    font-size: 14px;
    opacity: 0.7;
    margin: 0;
}

.goals-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.goal-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 24px;
    backdrop-filter: blur(10px);
}

.goal-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
}

.goal-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.calories-goal .goal-icon {
    background: linear-gradient(135deg, #ff6b35, #ff8a50);
}

.protein-goal .goal-icon {
    background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
}

.carbs-goal .goal-icon {
    background: linear-gradient(135deg, #ffa726, #ffb74d);
}

.fats-goal .goal-icon {
    background: linear-gradient(135deg, #42a5f5, #64b5f6);
}

.goal-info {
    flex: 1;
}

.goal-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
}

.goal-subtitle {
    font-size: 14px;
    opacity: 0.7;
    margin: 0;
}

.goal-input-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
}

.goal-input {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: white;
    padding: 12px 16px;
    font-size: 24px;
    font-weight: 600;
    width: 120px;
    text-align: center;
}

.goal-unit {
    font-size: 16px;
    opacity: 0.7;
    font-weight: 500;
}

.goal-slider {
    margin-top: 8px;
}

.slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.calories-slider {
    background: linear-gradient(90deg, #ff6b35, #ff8a50);
}

.protein-slider {
    background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
}

.carbs-slider {
    background: linear-gradient(90deg, #ffa726, #ffb74d);
}

.fats-slider {
    background: linear-gradient(90deg, #42a5f5, #64b5f6);
}

.navigation-buttons {
    display: flex;
    gap: 16px;
    margin-top: 32px;
    padding-top: 20px;
}

.nav-button {
    flex: 1;
    padding: 16px 24px;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.nav-button.primary {
    background: linear-gradient(135deg, #007052, #00a86b);
    color: white;
}

.nav-button.primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 112, 82, 0.3);
}

.nav-button.primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.nav-button.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.nav-button.secondary:hover {
    background: rgba(255, 255, 255, 0.15);
}

@media (max-width: 480px) {
    .hero-title {
        font-size: 28px;
    }
    
    .hero-subtitle {
        font-size: 16px;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .goal-input {
        width: 100px;
        font-size: 20px;
    }
}
</style>
