<template>
    <div class="onboarding-view">
        <!-- Progress Indicator -->
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
            </div>
            <span class="progress-text">{{ currentStep }} {{ $t('onboarding.progressStep') }} {{ totalSteps }}</span>
        </div>

        <!-- Welcome Step -->
        <div v-if="currentStep === 1" class="step-container">
            <div class="hero-section">
                <div class="hero-icon">
                    <img src="../assets/kalbuddy.png" alt="Digmio" class="hero-logo" />
                </div>
                <h1 class="hero-title">{{ $t('onboarding.welcomeToDigmio').replace('Digmio', '') }}<span
                        class="brand">Digmio</span></h1>
                <p class="hero-subtitle">{{ $t('onboarding.welcomeDescription') }}</p>
            </div>

            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path
                                d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                            <circle cx="12" cy="13" r="3" />
                        </svg>
                    </div>
                    <div class="feature-content">
                        <h3>{{ $t('onboarding.features.aiFoodRecognition') }}</h3>
                        <p>{{ $t('onboarding.features.aiFoodDescription') }}</p>
                    </div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M18 20V10" />
                            <path d="M12 20V4" />
                            <path d="M6 20v-6" />
                        </svg>
                    </div>
                    <div class="feature-content">
                        <h3>{{ $t('onboarding.features.smartAnalytics') }}</h3>
                        <p>{{ $t('onboarding.features.smartAnalyticsDescription') }}</p>
                    </div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M16.2 7.8l-2 6.3-6.3 2 2-6.3 6.3-2z" />
                        </svg>
                    </div>
                    <div class="feature-content">
                        <h3>{{ $t('onboarding.features.personalGoals') }}</h3>
                        <p>{{ $t('onboarding.features.personalGoalsDescription') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Personal Info Step -->
        <div v-if="currentStep === 2" class="step-container">
            <div class="content-section">
                <h2 class="step-title">{{ $t('onboarding.personalInfo.title') }}</h2>
                <p class="step-subtitle">{{ $t('onboarding.personalInfo.subtitle') }}</p>

                <div class="form-group">
                    <input ref="nameInput" v-model="userInfo.name" type="text" class="form-input"
                        :placeholder="$t('onboarding.personalInfo.namePlaceholder')"
                        @keydown.enter="focusNextInput('ageInput')" />
                </div>

                <div class="form-row">
                    <input ref="ageInput" v-model="userInfo.age" type="number" class="form-input"
                        :placeholder="$t('onboarding.personalInfo.agePlaceholder')"
                        @keydown.enter="focusNextInput('heightInput')" />
                    <div class="input-with-unit">
                        <input ref="heightInput" v-model="userInfo.height" type="number" class="form-input"
                            :placeholder="$t('onboarding.personalInfo.heightPlaceholder')"
                            @keydown.enter="focusNextInput('weightInput')" />
                        <span class="unit">cm</span>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <div class="input-with-unit">
                            <input ref="weightInput" v-model="userInfo.weight" type="number" class="form-input"
                                :placeholder="$t('onboarding.personalInfo.weightPlaceholder')"
                                @keydown.enter="handleWeightEnter" />
                            <span class="unit">kg</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="gender-selector">
                            <button type="button" class="gender-option" :class="{ active: userInfo.gender === 'male' }"
                                @click="userInfo.gender = 'male'">
                                {{ $t('onboarding.personalInfo.male') }}
                            </button>
                            <button type="button" class="gender-option"
                                :class="{ active: userInfo.gender === 'female' }" @click="userInfo.gender = 'female'">
                                {{ $t('onboarding.personalInfo.female') }}
                            </button>
                            <button type="button" class="gender-option" :class="{ active: userInfo.gender === 'other' }"
                                @click="userInfo.gender = 'other'">
                                {{ $t('onboarding.personalInfo.other') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Activity Level Step -->
        <div v-if="currentStep === 3" class="step-container">
            <div class="content-section">
                <h2 class="step-title">{{ $t('onboarding.activityLevel.title') }}</h2>
                <p class="step-subtitle">{{ $t('onboarding.activityLevel.subtitle') }}</p>

                <div class="activity-options">
                    <div v-for="activity in activityLevels" :key="activity.value" class="activity-card"
                        :class="{ active: userInfo.activityLevel === activity.value }"
                        @click="userInfo.activityLevel = activity.value">
                        <div class="activity-icon">{{ activity.icon }}</div>
                        <h3 class="activity-title">{{ $t(`onboarding.activityLevel.${activity.translationKey}`) }}</h3>
                        <p class="activity-description">{{ $t(`onboarding.activityLevel.${activity.translationKey}Desc`)
                            }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Goal Selection Step -->
        <div v-if="currentStep === 4" class="step-container">
            <div class="content-section">
                <h2 class="step-title">{{ $t('onboarding.whatIsYourGoal') }}</h2>
                <p class="step-subtitle">{{ $t('onboarding.goalSubtitle') }}</p>

                <div class="goal-options">
                    <div v-for="goalOption in goalOptions" :key="goalOption.value" class="goal-option"
                        :class="{ active: userInfo.goal === goalOption.value }"
                        @click="userInfo.goal = goalOption.value">
                        <div class="goal-icon-large">{{ goalOption.icon }}</div>
                        <div class="goal-content">
                            <h3 class="goal-name">{{ goalOption.name }}</h3>
                            <p class="goal-description">{{ goalOption.description }}</p>
                            <div class="goal-details">{{ goalOption.details }}</div>
                        </div>
                        <div class="goal-arrow">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Target Weight Step -->
        <div v-if="currentStep === 5" class="step-container">
            <div class="content-section">
                <h2 class="step-title">{{ $t('onboarding.weightGoal.title') }}</h2>
                <p class="step-subtitle">{{ $t('onboarding.weightGoal.subtitle') }}</p>

                <div class="weight-goal-container">
                    <div class="current-weight-display">
                        <div class="weight-info">
                            <span class="weight-label">{{ $t('onboarding.weightGoal.currentWeight') }}</span>
                            <span class="weight-value">{{ userInfo.weight || 0 }} kg</span>
                        </div>
                    </div>

                    <div class="arrow-down">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.41 8.84L12 13.42l4.59-4.58L18 10.25l-6 6-6-6z" />
                        </svg>
                    </div>

                    <div class="target-weight-input">
                        <label class="form-label">{{ $t('onboarding.weightGoal.targetWeightLabel') }}</label>
                        <input v-model="userInfo.targetWeight" type="number"
                            :placeholder="$t('onboarding.weightGoal.targetWeightPlaceholder')"
                            class="form-input weight-input" min="30" max="300" step="0.1" />
                    </div>

                    <div v-if="userInfo.weight && userInfo.targetWeight" class="weight-goal-summary">
                        <div class="goal-calculation">
                            <div class="calculation-item">
                                <span class="calc-label">{{ $t('onboarding.weightGoal.weightChange') }}</span>
                                <span class="calc-value" :class="weightChangeClass">
                                    {{ weightChangeText }}
                                </span>
                            </div>
                            <div class="calculation-item">
                                <span class="calc-label">{{ $t('onboarding.weightGoal.goalType') }}</span>
                                <span class="calc-value">{{ goalTypeText }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Goals Step -->
        <div v-if="currentStep === 6" class="step-container">
            <div class="content-section">
                <h2 class="step-title">{{ $t('onboarding.dailyGoals.title') }}</h2>
                <p class="step-subtitle">{{ $t('onboarding.dailyGoals.subtitle') }}</p>

                <div class="goals-container">
                    <!-- Calories Goal -->
                    <div class="goal-card calories-goal">
                        <div class="goal-header">
                            <div class="goal-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
                                </svg>
                            </div>
                            <div class="goal-info">
                                <h3 class="goal-title">{{ $t('onboarding.dailyGoals.calories') }}</h3>
                                <p class="goal-subtitle">{{ $t('onboarding.dailyGoals.caloriesSubtitle') }}</p>
                            </div>
                        </div>
                        <div class="goal-input-container">
                            <input v-model="goals.calories" type="number" class="goal-input" step="50" />
                            <span class="goal-unit">{{ $t('onboarding.dailyGoals.unit.kcal') }}</span>
                        </div>
                        <div class="goal-slider">
                            <input v-model="goals.calories" type="range" min="1200" max="4000" step="50"
                                class="slider calories-slider" />
                        </div>
                    </div>

                    <!-- Protein Goal -->
                    <div class="goal-card protein-goal">
                        <div class="goal-header">
                            <div class="goal-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z" />
                                </svg>
                            </div>
                            <div class="goal-info">
                                <h3 class="goal-title">{{ $t('onboarding.dailyGoals.protein') }}</h3>
                                <p class="goal-subtitle">{{ $t('onboarding.dailyGoals.proteinSubtitle') }}</p>
                            </div>
                        </div>
                        <div class="goal-input-container">
                            <input v-model="goals.protein" type="number" class="goal-input" step="5" />
                            <span class="goal-unit">{{ $t('onboarding.dailyGoals.unit.g') }}</span>
                        </div>
                        <div class="goal-slider">
                            <input v-model="goals.protein" type="range" min="50" max="300" step="5"
                                class="slider protein-slider" />
                        </div>
                    </div>

                    <!-- Carbs Goal -->
                    <div class="goal-card carbs-goal">
                        <div class="goal-header">
                            <div class="goal-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M12 2c1.1 0 2 .9 2 2 0 .74-.4 1.38-1 1.72v2.56l7 7V17c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-1.72l7-7V5.72c-.6-.34-1-.98-1-1.72 0-1.1.9-2 2-2z" />
                                </svg>
                            </div>
                            <div class="goal-info">
                                <h3 class="goal-title">{{ $t('onboarding.dailyGoals.carbs') }}</h3>
                                <p class="goal-subtitle">{{ $t('onboarding.dailyGoals.carbsSubtitle') }}</p>
                            </div>
                        </div>
                        <div class="goal-input-container">
                            <input v-model="goals.carbs" type="number" class="goal-input" step="10" />
                            <span class="goal-unit">{{ $t('onboarding.dailyGoals.unit.g') }}</span>
                        </div>
                        <div class="goal-slider">
                            <input v-model="goals.carbs" type="range" min="100" max="500" step="10"
                                class="slider carbs-slider" />
                        </div>
                    </div>

                    <!-- Fats Goal -->
                    <div class="goal-card fats-goal">
                        <div class="goal-header">
                            <div class="goal-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" />
                                </svg>
                            </div>
                            <div class="goal-info">
                                <h3 class="goal-title">{{ $t('onboarding.dailyGoals.fats') }}</h3>
                                <p class="goal-subtitle">{{ $t('onboarding.dailyGoals.fatsSubtitle') }}</p>
                            </div>
                        </div>
                        <div class="goal-input-container">
                            <input v-model="goals.fats" type="number" class="goal-input" step="5" />
                            <span class="goal-unit">{{ $t('onboarding.dailyGoals.unit.g') }}</span>
                        </div>
                        <div class="goal-slider">
                            <input v-model="goals.fats" type="range" min="30" max="200" step="5"
                                class="slider fats-slider" />
                        </div>
                    </div>
                </div>

                <!-- Calculation Source Information -->
                <div class="calculation-source">
                    <h4 class="source-title">{{ $t('onboarding.calculationSource.title') }}</h4>
                    <div class="source-explanation">
                        <p>{{ $t('onboarding.calculationSource.description') }}</p>

                        <div class="formula-section">
                            <h5>{{ $t('onboarding.calculationSource.bmrFormula') }}</h5>
                            <div class="formula-container">
                                <div class="formula-item">
                                    <span class="formula-label">{{ $t('onboarding.calculationSource.menFormula')
                                        }}:</span>
                                    <code
                                        class="formula-code">BMR = 88.362 + (13.397 × weight) + (4.799 × height) - (5.677 × age)</code>
                                </div>
                                <div class="formula-item">
                                    <span class="formula-label">{{ $t('onboarding.calculationSource.womenFormula')
                                        }}:</span>
                                    <code
                                        class="formula-code">BMR = 447.593 + (9.247 × weight) + (3.098 × height) - (4.330 × age)</code>
                                </div>
                            </div>
                            <p class="formula-note">{{ $t('onboarding.calculationSource.formulaNote') }}</p>
                        </div>

                        <div class="activity-multipliers">
                            <h5>{{ $t('onboarding.calculationSource.activityMultipliers') }}</h5>
                            <ul class="multiplier-list">
                                <li>{{ $t('onboarding.calculationSource.sedentary') }}: 1.2</li>
                                <li>{{ $t('onboarding.calculationSource.lightlyActive') }}: 1.375</li>
                                <li>{{ $t('onboarding.calculationSource.moderatelyActive') }}: 1.55</li>
                                <li>{{ $t('onboarding.calculationSource.veryActive') }}: 1.725</li>
                                <li>{{ $t('onboarding.calculationSource.extraActive') }}: 1.9</li>
                            </ul>
                        </div>

                        <div class="source-link-section">
                            <button class="source-link" @click="showSourceModal = true">
                                {{ $t('onboarding.calculationSource.learnMore') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="navigation-buttons">
            <button v-if="currentStep > 1" @click="previousStep" class="nav-button secondary">
                {{ $t('common.back') }}
            </button>
            <button @click="nextStep" class="nav-button primary" :disabled="!canProceed">
                {{ currentStep === totalSteps ? $t('onboarding.getStarted') : $t('onboarding.continue') }}
            </button>
        </div>

        <!-- Calculation Source Modal -->
        <div v-if="showSourceModal" class="modal-overlay" @click="showSourceModal = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>{{ $t('onboarding.calculationSource.modalTitle') }}</h3>
                    <button @click="showSourceModal = false" class="close-button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="source-section">
                        <h4>{{ $t('onboarding.calculationSource.harrisTitle') }}</h4>
                        <p>{{ $t('onboarding.calculationSource.harrisDescription') }}</p>

                        <div class="formula-details">
                            <div class="formula-group">
                                <h5>{{ $t('onboarding.calculationSource.menFormula') }}</h5>
                                <code
                                    class="formula-display">BMR = 88.362 + (13.397 × weight) + (4.799 × height) - (5.677 × age)</code>
                            </div>
                            <div class="formula-group">
                                <h5>{{ $t('onboarding.calculationSource.womenFormula') }}</h5>
                                <code
                                    class="formula-display">BMR = 447.593 + (9.247 × weight) + (3.098 × height) - (4.330 × age)</code>
                            </div>
                        </div>

                        <p>{{ $t('onboarding.calculationSource.totalCalculation') }}</p>

                        <div class="reference-link">
                            <a href="https://www.calculator.net/bmr-calculator.html" target="_blank"
                                rel="noopener noreferrer">
                                {{ $t('onboarding.calculationSource.learnMoreLink') }}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15,3 21,3 21,9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { updateUserProfile, updateDailyGoals, completeOnboarding } from '../stores/userStore'
import { WeightTracker } from '../utils/weightTracking'
import { revenueCatService } from '../services/revenuecat'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const currentStep = ref(1)
const totalSteps = 6
const showSourceModal = ref(false)

// Refs for input fields
const nameInput = ref<HTMLInputElement>()
const ageInput = ref<HTMLInputElement>()
const heightInput = ref<HTMLInputElement>()
const weightInput = ref<HTMLInputElement>()

const userInfo = reactive({
    name: '',
    email: '',
    age: null as number | null,
    gender: '' as '' | 'male' | 'female' | 'other',
    height: null as number | null,
    weight: null as number | null,
    targetWeight: null as number | null,
    activityLevel: '',
    goal: ''
})

const goals = reactive({
    calories: 2500,
    protein: 125,
    carbs: 250,
    fats: 85
})

// Prefetch offerings on component mount
onMounted(async () => {
    try {
        console.log('Prefetching RevenueCat offerings...')
        await revenueCatService.prefetchOfferings()
        console.log('Offerings prefetched successfully')
    } catch (error) {
        console.warn('Failed to prefetch offerings:', error)
    }
})

const activityLevels = [
    {
        value: 'sedentary',
        icon: '🛋️',
        translationKey: 'sedentary',
        title: 'Sedentary',
        description: 'Little to no exercise, desk job'
    },
    {
        value: 'light',
        icon: '🚶',
        translationKey: 'light',
        title: 'Lightly Active',
        description: 'Light exercise 1-3 days/week'
    },
    {
        value: 'moderate',
        icon: '🏃',
        translationKey: 'moderate',
        title: 'Moderately Active',
        description: 'Moderate exercise 3-5 days/week'
    },
    {
        value: 'very',
        icon: '💪',
        translationKey: 'active',
        title: 'Very Active',
        description: 'Hard exercise 6-7 days/week'
    },
    {
        value: 'extra',
        icon: '🏋️',
        translationKey: 'extreme',
        title: 'Extremely Active',
        description: 'Very hard exercise, physical job'
    }
]

const goalOptions = [
    {
        value: 'lose',
        icon: '📉',
        name: 'Lose Weight',
        description: 'Reduce body weight and body fat',
        details: 'Target: 0.5-1kg per week'
    },
    {
        value: 'maintain',
        icon: '⚖️',
        name: 'Maintain Weight',
        description: 'Keep current weight and body composition',
        details: 'Focus on balanced nutrition'
    },
    {
        value: 'gain',
        icon: '📈',
        name: 'Gain Weight',
        description: 'Build muscle mass and strength',
        details: 'Target: 0.25-0.5kg per week'
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
            return userInfo.goal
        case 5:
            return userInfo.targetWeight
        case 6:
            return true
        default:
            return false
    }
})

const weightChangeText = computed(() => {
    if (!userInfo.weight || !userInfo.targetWeight) return ''
    const change = userInfo.targetWeight - userInfo.weight
    const absChange = Math.abs(change)
    if (change > 0) {
        return `+${absChange.toFixed(1)} kg`
    } else if (change < 0) {
        return `-${absChange.toFixed(1)} kg`
    } else {
        return t('onboarding.weightGoal.maintain')
    }
})

const weightChangeClass = computed(() => {
    if (!userInfo.weight || !userInfo.targetWeight) return ''
    const change = userInfo.targetWeight - userInfo.weight
    if (change > 0) return 'weight-gain'
    if (change < 0) return 'weight-loss'
    return 'weight-maintain'
})

const goalTypeText = computed(() => {
    if (!userInfo.weight || !userInfo.targetWeight) return ''
    const change = userInfo.targetWeight - userInfo.weight
    if (Math.abs(change) <= 1) return t('onboarding.weightGoal.maintain')
    if (change > 0) return t('onboarding.weightGoal.gain')
    return t('onboarding.weightGoal.lose')
})

// Input navigation functions
function focusNextInput(inputRefName: string) {
    const inputsMap: Record<string, typeof nameInput | typeof ageInput | typeof heightInput | typeof weightInput> = {
        nameInput,
        ageInput,
        heightInput,
        weightInput
    }

    const nextInput = inputsMap[inputRefName]
    if (nextInput?.value) {
        nextInput.value.focus()
    }
}

function handleWeightEnter() {
    // If all required fields are filled, proceed to next step
    if (canProceed.value) {
        nextStep()
    }
}

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
    let recommendedCalories = Math.round(bmr * multiplier)

    // Adjust calories based on goal
    if (userInfo.goal === 'lose') {
        recommendedCalories -= 500 // 500 calorie deficit for weight loss
    } else if (userInfo.goal === 'gain') {
        recommendedCalories += 300 // 300 calorie surplus for weight gain
    }
    // 'maintain' keeps the calculated TDEE

    goals.calories = recommendedCalories
    goals.protein = Math.round(userInfo.weight * 1.6) // 1.6g per kg body weight
    goals.carbs = Math.round((recommendedCalories * 0.5) / 4) // 50% of calories from carbs
    goals.fats = Math.round((recommendedCalories * 0.25) / 9) // 25% of calories from fats
}

function nextStep() {
    if (currentStep.value === 4) {
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

async function finishOnboarding() {
    // Create a copy of userInfo without weight (weight is now managed by WeightTracker)
    const { weight, targetWeight, ...profileWithoutWeight } = userInfo

    // Update user store with data (excluding weight)
    await updateUserProfile(profileWithoutWeight)
    await updateDailyGoals(goals)

    // Set up weight tracking if weight is provided
    if (weight) {
        // Add initial weight entry
        await WeightTracker.addWeightEntry(weight, 'Initial weight from onboarding')

        // Set weight goal if target weight is provided
        if (targetWeight) {
            const goalType = targetWeight > weight ? 'gain' :
                targetWeight < weight ? 'lose' : 'maintain'

            await WeightTracker.setWeightGoal({
                startWeight: weight,
                targetWeight: targetWeight,
                goalType,
                startDate: new Date().toISOString().split('T')[0]
            })
        }
    }

    await completeOnboarding()

    // Navigate to home for freemium model
    router.push('/')
}
</script>

<style scoped>
.onboarding-view {
    height: 100vh;
    height: calc(100vh - max(44px, env(safe-area-inset-top, 44px)));
    background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
    background-size: 100% 100vh;
    background-position: bottom;
    color: white;
    padding: 0 16px 0 16px;
    margin-top: max(44px, env(safe-area-inset-top, 44px));
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    position: relative;
}

.progress-container {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    padding-top: 16px;
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
    padding-bottom: 100px;
    /* Make room for fixed navigation buttons */
}

.hero-section {
    text-align: center;
    margin-bottom: 32px;
}

.hero-icon {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #007052, #00a86b);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    overflow: hidden;
}

.hero-logo {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
}

.brand {
    color: #007052;
}

.hero-subtitle {
    font-size: 16px;
    opacity: 0.8;
    line-height: 1.4;
    max-width: 400px;
    margin: 0 auto;
}

.features-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
}

.feature-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    text-align: left;
}

.feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    min-width: 48px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: #007052;
}

.feature-content {
    flex: 1;
}

.feature-card h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
}

.feature-card p {
    font-size: 13px;
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
    margin-bottom: 8px;
}

.step-subtitle {
    font-size: 16px;
    opacity: 0.8;
    text-align: center;
    margin-bottom: 24px;
}

.form-group {
    margin-bottom: 12px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
}

.form-label {
    display: block;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
}

.form-input,
.form-select {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: white;
    padding: 16px;
    font-size: 16px;
    transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
    outline: none;
    border-color: #007052;
}

.gender-selector {
    display: flex;
    gap: 8px;
    width: 100%;
}

.gender-option {
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: white;
    padding: 12px 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}

.gender-option:hover {
    background: rgba(255, 255, 255, 0.15);
}

.gender-option.active {
    background: rgba(0, 112, 82, 0.3);
    border-color: #007052;
    color: #00a86b;
    font-weight: 600;
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
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 16px;
    padding: 16px;
    padding-bottom: max(16px, calc(16px + env(safe-area-inset-bottom, 0px)));
    background: linear-gradient(to top, rgba(30, 30, 46, 0.98) 0%, rgba(30, 30, 46, 0.95) 80%, transparent 100%);
    backdrop-filter: blur(10px);
    z-index: 10;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
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

/* Goal Options Styling */
.goal-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
}

.goal-option {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.goal-option:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
}

.goal-option.active {
    background: rgba(0, 112, 82, 0.2);
    border-color: #007052;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 112, 82, 0.2);
}

.goal-icon-large {
    font-size: 3rem;
    width: 60px;
    text-align: center;
    flex-shrink: 0;
}

.goal-content {
    flex: 1;
}

.goal-name {
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: white;
}

.goal-description {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 0.5rem 0;
}

.goal-details {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
}

.goal-arrow {
    color: rgba(255, 255, 255, 0.4);
    transition: all 0.3s ease;
}

.goal-option.active .goal-arrow {
    color: #007052;
    transform: translateX(4px);
}

@media (max-width: 480px) {
    .step-container {
        padding-bottom: 120px;
        /* Extra room on mobile for fixed buttons */
    }

    .hero-icon {
        width: 90px;
        height: 90px;
        border-radius: 22px;
    }

    .features-grid {
        gap: 10px;
    }

    .feature-card {
        padding: 14px;
    }

    .feature-icon {
        width: 44px;
        height: 44px;
        min-width: 44px;
    }

    .form-row {
        grid-template-columns: 1fr;
    }

    .gender-selector {
        flex-direction: row;
    }

    .goal-input {
        width: 100px;
        font-size: 20px;
    }
}

/* Weight Goal Step Styles */
.weight-goal-container {
    max-width: 400px;
    margin: 0 auto;
    text-align: center;
}

.current-weight-display {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    backdrop-filter: blur(10px);
}

.weight-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.weight-label {
    font-size: 14px;
    opacity: 0.7;
    font-weight: 500;
}

.weight-value {
    font-size: 32px;
    font-weight: 700;
    color: #007052;
}

.arrow-down {
    color: rgba(255, 255, 255, 0.5);
    margin: 16px 0;
}

.target-weight-input {
    margin-bottom: 24px;
}

.weight-input {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: white;
    transition: all 0.3s ease;
}

.weight-input:focus {
    border-color: #007052;
    background: rgba(255, 255, 255, 0.08);
}

.weight-goal-summary {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 20px;
    backdrop-filter: blur(10px);
}

.goal-calculation {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.calculation-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.calc-label {
    font-size: 14px;
    opacity: 0.7;
    font-weight: 500;
}

.calc-value {
    font-size: 16px;
    font-weight: 600;
}

.calc-value.weight-loss {
    color: #ff6b6b;
}

.calc-value.weight-gain {
    color: #4caf50;
}

.calc-value.weight-maintain {
    color: #ffa726;
}

/* Calculation Source Styles */
.calculation-source {
    margin-top: 32px;
    padding: 24px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.source-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: white;
}

.source-explanation {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
}

.formula-section {
    margin: 20px 0;
    padding: 16px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.formula-section h5 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: white;
}

.formula-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.formula-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.formula-label {
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
}

.formula-code {
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    background: rgba(0, 0, 0, 0.3);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    color: #a8e6cf;
    border: 1px solid rgba(168, 230, 207, 0.2);
    overflow-x: auto;
    white-space: nowrap;
}

.formula-note {
    margin-top: 12px;
    font-size: 13px;
    font-style: italic;
    color: rgba(255, 255, 255, 0.7);
}

.activity-multipliers {
    margin: 20px 0;
}

.activity-multipliers h5 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: white;
}

.multiplier-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.multiplier-list li {
    padding: 8px 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.multiplier-list li:last-child {
    border-bottom: none;
}

.source-link-section {
    margin-top: 20px;
    text-align: center;
}

.source-link {
    background: linear-gradient(135deg, #007052, #009d6b);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
}

.source-link:hover {
    background: linear-gradient(135deg, #005a43, #008055);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 112, 82, 0.3);
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
}

.modal-content {
    background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
    border-radius: 20px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
    font-size: 20px;
    font-weight: 600;
    color: white;
    margin: 0;
}

.close-button {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.close-button:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.modal-body {
    padding: 24px;
}

.source-section h4 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: white;
}

.source-section p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin-bottom: 20px;
}

.formula-details {
    margin: 20px 0;
}

.formula-group {
    margin-bottom: 20px;
}

.formula-group h5 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: rgba(255, 255, 255, 0.9);
}

.formula-display {
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    background: rgba(0, 0, 0, 0.4);
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    color: #a8e6cf;
    border: 1px solid rgba(168, 230, 207, 0.2);
    display: block;
    overflow-x: auto;
    white-space: nowrap;
}

.reference-link {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.reference-link a {
    color: #a8e6cf;
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
}

.reference-link a:hover {
    color: #c7f2dd;
    text-decoration: underline;
}

.reference-link svg {
    width: 16px;
    height: 16px;
    opacity: 0.7;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
    .calculation-source {
        background: rgba(255, 255, 255, 0.03);
        border-color: rgba(255, 255, 255, 0.08);
    }

    .formula-section {
        background: rgba(0, 0, 0, 0.4);
        border-color: rgba(255, 255, 255, 0.08);
    }

    .modal-content {
        background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
    }
}
</style>
