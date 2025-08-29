<template>
  <div class="profile-edit-view">
    <!-- Header -->
    <header class="header">
      <button @click="goBack" class="back-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
      <h1 class="title">{{ $t('profile.editTitle') }}</h1>
      <button @click="saveProfile" class="save-button" :disabled="!isValid">
        {{ $t('common.save') }}
      </button>
    </header>

    <!-- Profile Image Section -->
    <div class="profile-section">
      <div class="profile-avatar-large" @click="selectProfilePicture">
        <img v-if="form.profilePicture" :src="form.profilePicture" alt="Profile" class="profile-image" />
        <svg v-else width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        <div class="profile-avatar-overlay">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 15.2l3.2-2.7L12 9.8l-3.2 2.7L12 15.2zM9 2l-1.8 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.2L15 2H9zm3 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/>
          </svg>
        </div>
      </div>
      <h2 class="profile-greeting">{{ $t('profile.editGreeting') }}</h2>
      <p class="profile-hint">Tap to change profile picture</p>
    </div>

    <!-- Form -->
    <div class="form-container">
      <!-- Basic Info -->
      <div class="form-section">
        <h3 class="section-title">{{ $t('profile.basicInfo') }}</h3>
        
        <div class="form-group">
          <label class="form-label">{{ $t('profile.name') }}</label>
          <input 
            type="text" 
            v-model="form.name" 
            class="form-input"
            :placeholder="$t('profile.namePlaceholder')"
          />
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('profile.email') }}</label>
          <input 
            type="email" 
            v-model="form.email" 
            class="form-input"
            :placeholder="$t('profile.emailPlaceholder')"
          />
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('profile.age') }}</label>
          <input 
            type="number" 
            v-model.number="form.age" 
            class="form-input"
            :placeholder="$t('profile.agePlaceholder')"
            min="10"
            max="120"
          />
        </div>
      </div>

      <!-- Physical Info -->
      <div class="form-section">
        <h3 class="section-title">{{ $t('profile.physicalInfo') }}</h3>
        
        <div class="form-group">
          <label class="form-label">{{ $t('profile.gender') }}</label>
          <div class="gender-buttons">
            <button 
              type="button" 
              class="gender-btn" 
              :class="{ active: form.gender === 'male' }" 
              @click="form.gender = 'male'"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A6,6 0 0,1 18,10C18,12.97 15.84,15.44 13,15.92V18H15V20H13V22H11V20H9V18H11V15.92C8.16,15.44 6,12.97 6,10A6,6 0 0,1 12,4M12,6A4,4 0 0,0 8,10A4,4 0 0,0 12,14A4,4 0 0,0 16,10A4,4 0 0,0 12,6Z"/>
              </svg>
              {{ $t('profile.male') }}
            </button>
            <button 
              type="button" 
              class="gender-btn" 
              :class="{ active: form.gender === 'female' }" 
              @click="form.gender = 'female'"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A6,6 0 0,1 18,10A6,6 0 0,1 12,16A6,6 0 0,1 6,10A6,6 0 0,1 12,4M12,6A4,4 0 0,0 8,10A4,4 0 0,0 12,14A4,4 0 0,0 16,10A4,4 0 0,0 12,6Z"/>
              </svg>
              {{ $t('profile.female') }}
            </button>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">{{ $t('profile.height') }}</label>
            <div class="input-with-unit">
              <input 
                type="number" 
                v-model.number="form.height" 
                class="form-input"
                :placeholder="$t('profile.heightPlaceholder')"
                min="100"
                max="250"
              />
              <span class="unit">cm</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ $t('profile.weight') }}</label>
            <div class="input-with-unit">
              <input 
                type="number" 
                v-model.number="form.weight" 
                class="form-input"
                :placeholder="$t('profile.weightPlaceholder')"
                min="30"
                max="300"
                step="0.1"
              />
              <span class="unit">kg</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Level -->
      <div class="form-section">
        <h3 class="section-title">{{ $t('profile.activityLevel') }}</h3>
        
        <div class="activity-options">
          <div 
            v-for="activity in activityLevels" 
            :key="activity.value"
            class="activity-option"
            :class="{ active: form.activityLevel === activity.value }"
            @click="form.activityLevel = activity.value"
          >
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-content">
              <div class="activity-name">{{ activity.name }}</div>
              <div class="activity-description">{{ activity.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Goals -->
      <div class="form-section">
        <h3 class="section-title">{{ $t('profile.goals') }}</h3>
        
        <div class="goal-options">
          <div 
            v-for="goal in goals" 
            :key="goal.value"
            class="goal-option"
            :class="{ active: form.goal === goal.value }"
            @click="form.goal = goal.value"
          >
            <div class="goal-icon">{{ goal.icon }}</div>
            <div class="goal-content">
              <div class="goal-name">{{ goal.name }}</div>
              <div class="goal-description">{{ goal.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calculated Goals Preview -->
      <div v-if="calculatedGoals" class="form-section">
        <h3 class="section-title">{{ $t('profile.calculatedGoals') }}</h3>
        <div class="goals-preview">
          <div class="goal-item">
            <span class="goal-label">{{ $t('nutrition.calories') }}</span>
            <span class="goal-value">{{ calculatedGoals.calories }} kcal</span>
          </div>
          <div class="goal-item">
            <span class="goal-label">{{ $t('nutrition.protein') }}</span>
            <span class="goal-value">{{ calculatedGoals.protein }}g</span>
          </div>
          <div class="goal-item">
            <span class="goal-label">{{ $t('nutrition.carbs') }}</span>
            <span class="goal-value">{{ calculatedGoals.carbs }}g</span>
          </div>
          <div class="goal-item">
            <span class="goal-label">{{ $t('nutrition.fats') }}</span>
            <span class="goal-value">{{ calculatedGoals.fats }}g</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showSuccessToast" class="toast success">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
      {{ $t('profile.savedSuccessfully') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { 
  userProfile, 
  updateUserProfile, 
  updateDailyGoals,
  calculateRecommendedMacros
} from '../stores/userStore'
import { ImageService } from '../services/imageService'

const router = useRouter()
const { t } = useI18n()

// Form data
const form = ref({
  name: '',
  email: '',
  age: 25,
  gender: 'male' as 'male' | 'female',
  height: 170,
  weight: 70,
  activityLevel: 'moderate' as string,
  goal: 'maintain' as string,
  profilePicture: undefined as string | undefined
})

const showSuccessToast = ref(false)

// Load current user data
onMounted(() => {
  form.value = {
    name: userProfile.name || '',
    email: userProfile.email || '',
    age: userProfile.age || 25,
    gender: (userProfile.gender as 'male' | 'female') || 'male',
    height: userProfile.height || 170,
    weight: userProfile.weight || 70,
    activityLevel: userProfile.activityLevel || 'moderate',
    goal: userProfile.goal || 'maintain',
    profilePicture: userProfile.profilePicture
  }
})

// Activity levels
const activityLevels = computed(() => [
  {
    value: 'sedentary',
    icon: '🛋️',
    name: t('profile.activityLevels.sedentary.name'),
    description: t('profile.activityLevels.sedentary.description')
  },
  {
    value: 'light',
    icon: '🚶',
    name: t('profile.activityLevels.light.name'),
    description: t('profile.activityLevels.light.description')
  },
  {
    value: 'moderate',
    icon: '🏃',
    name: t('profile.activityLevels.moderate.name'),
    description: t('profile.activityLevels.moderate.description')
  },
  {
    value: 'active',
    icon: '💪',
    name: t('profile.activityLevels.active.name'),
    description: t('profile.activityLevels.active.description')
  },
  {
    value: 'veryActive',
    icon: '🏋️',
    name: t('profile.activityLevels.veryActive.name'),
    description: t('profile.activityLevels.veryActive.description')
  }
])

// Goals
const goals = computed(() => [
  {
    value: 'lose',
    icon: '📉',
    name: t('profile.goalOptions.lose.name'),
    description: t('profile.goalOptions.lose.description')
  },
  {
    value: 'maintain',
    icon: '⚖️',
    name: t('profile.goalOptions.maintain.name'),
    description: t('profile.goalOptions.maintain.description')
  },
  {
    value: 'gain',
    icon: '📈',
    name: t('profile.goalOptions.gain.name'),
    description: t('profile.goalOptions.gain.description')
  }
])

// Form validation
const isValid = computed(() => {
  return form.value.name.trim().length > 0 && form.value.name.trim().length < 120 &&
         form.value.age >= 10 && form.value.age <= 120 &&
         form.value.height >= 100 && form.value.height <= 250 &&
         form.value.weight >= 30 && form.value.weight <= 300 &&
         form.value.gender &&
         form.value.activityLevel &&
         form.value.goal
})

// Calculate recommended goals
const calculatedGoals = computed(() => {
  if (!isValid.value) return null
  
  return calculateRecommendedMacros({
    name: form.value.name,
    email: form.value.email,
    age: form.value.age,
    gender: form.value.gender,
    height: form.value.height,
    weight: form.value.weight,
    activityLevel: form.value.activityLevel,
    goal: form.value.goal,
    targetWeight: userProfile.targetWeight
  })
})

function goBack() {
  router.back()
}

async function selectProfilePicture() {
  try {
    const imageData = await ImageService.showImageSelectionDialog()
    if (imageData) {
      form.value.profilePicture = imageData
    }
  } catch (error) {
    console.error('Error selecting profile picture:', error)
    alert(t('profile.imageError'))
  }
}

async function saveProfile() {
  try {
    // Update user profile
    await updateUserProfile(form.value)
    
    // Update daily goals with calculated values
    if (calculatedGoals.value) {
      await updateDailyGoals(calculatedGoals.value)
    }
    
    // Show success toast
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
      goBack()
    }, 2000)
    
  } catch (error) {
    console.error('Error saving profile:', error)
    alert(t('profile.saveError'))
  }
}
</script>

<style scoped>
.profile-edit-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1d26 0%, #2a2d37 100%);
  color: white;
  padding-top: max(44px, env(safe-area-inset-top, 44px));
  padding-bottom: max(80px, calc(80px + env(safe-area-inset-bottom, 0px)));
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  position: sticky;
  top: 0;
  background: rgba(26, 29, 38, 0.95);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.back-button, .save-button {
  background: none;
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s;
  font-size: 1rem;
}

.save-button {
  background: #007052;
  padding: 0.5rem 1rem;
  font-weight: 600;
}

.save-button:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
}

.back-button:hover, .save-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.save-button:hover:not(:disabled) {
  background: #00a76f;
}

.title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.profile-section {
  text-align: center;
  padding: 2rem 1rem;
}

.profile-avatar-large {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.profile-avatar-large:hover {
  border-color: #007052;
  transform: scale(1.02);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.profile-avatar-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #007052;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(26, 29, 38, 1);
}

.profile-hint {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0.5rem 0 0 0;
  font-style: italic;
}

.profile-greeting {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.form-container {
  padding: 0 1rem;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-input:focus {
  outline: none;
  border-color: #007052;
  background: rgba(255, 255, 255, 0.15);
}

.input-with-unit {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

.input-with-unit .form-input {
  border: none;
  background: transparent;
  flex: 1;
}

.unit {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.gender-buttons {
  display: flex;
  gap: 0.5rem;
}

.gender-btn {
  flex: 1;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.gender-btn.active {
  background: rgba(0, 112, 82, 0.3);
  border-color: #007052;
}

.activity-options, .goal-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-option, .goal-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.activity-option.active, .goal-option.active {
  background: rgba(0, 112, 82, 0.2);
  border-color: #007052;
}

.activity-icon, .goal-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.activity-content, .goal-content {
  flex: 1;
}

.activity-name, .goal-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.activity-description, .goal-description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.goals-preview {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.goal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.goal-item:last-child {
  border-bottom: none;
}

.goal-label {
  color: rgba(255, 255, 255, 0.8);
}

.goal-value {
  font-weight: 600;
  color: #007052;
}

.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #007052;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}
</style>
