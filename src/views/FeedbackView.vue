<template>
    <div class="feedback-view">
        <!-- Header -->
        <header class="header">
            <button @click="goBack" class="back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
            </button>
            <h1 class="title">{{ $t('feedback.title') }}</h1>
            <div class="spacer"></div>
        </header>

        <!-- Feedback Form -->
        <div class="feedback-form">
            <div class="form-section">
                <h3 class="section-title">{{ $t('feedback.typeLabel') }}</h3>
                <div class="feedback-type-selector">
                    <button 
                        @click="selectedType = 'bug'" 
                        :class="{ 'type-btn': true, 'active': selectedType === 'bug' }"
                    >
                        <div class="type-icon bug-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14,12H10V10H14M14,16H10V14H14M20,8H17.19C16.74,7.22 16.12,6.55 15.37,6.04L17,4.41L15.59,3L13.42,5.17C12.96,5.06 12.49,5 12,5C11.51,5 11.04,5.06 10.59,5.17L8.41,3L7,4.41L8.62,6.04C7.88,6.55 7.26,7.22 6.81,8H4V10H6.09C6.04,10.33 6,10.66 6,11V12H4V14H6V15C6,15.34 6.04,15.67 6.09,16H4V18H6.81C7.85,19.79 9.78,21 12,21C14.22,21 16.15,19.79 17.19,18H20V16H17.91C17.96,15.67 18,15.34 18,15V14H20V12H18V11C18,10.66 17.96,10.33 17.91,10H20V8Z"/>
                            </svg>
                        </div>
                        <div class="type-content">
                            <h4>{{ $t('feedback.bugReport') }}</h4>
                            <p>{{ $t('feedback.bugDescription') }}</p>
                        </div>
                    </button>
                    
                    <button 
                        @click="selectedType = 'feature'" 
                        :class="{ 'type-btn': true, 'active': selectedType === 'feature' }"
                    >
                        <div class="type-icon feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                            </svg>
                        </div>
                        <div class="type-content">
                            <h4>{{ $t('feedback.featureRequest') }}</h4>
                            <p>{{ $t('feedback.featureDescription') }}</p>
                        </div>
                    </button>
                </div>
            </div>

            <div>
                <h3 class="section-title">{{ $t('feedback.descriptionLabel') }}</h3>
                <textarea
                    v-model="description"
                    :placeholder="getPlaceholderText()"
                    class="feedback-textarea"
                    rows="8"
                ></textarea>
                <div class="char-counter">
                    {{ description.length }}/500
                </div>
            </div>

            <div class="form-actions">
                <button @click="submitFeedback" :disabled="!canSubmit" class="submit-btn">
                    <svg v-if="isSubmitting" class="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" 
                                stroke-dasharray="31.416" stroke-dashoffset="31.416">
                            <animate attributeName="stroke-dasharray" dur="2s" 
                                     values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                            <animate attributeName="stroke-dashoffset" dur="2s" 
                                     values="0;-15.708;-31.416" repeatCount="indefinite"/>
                        </circle>
                    </svg>
                    <span v-if="!isSubmitting">{{ $t('feedback.submit') }}</span>
                    <span v-else>{{ $t('feedback.submitting') }}</span>
                </button>
            </div>
        </div>

        <!-- Success Message -->
        <div v-if="showSuccess" class="success-message">
            <div class="success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                </svg>
            </div>
            <h3>{{ $t('feedback.successTitle') }}</h3>
            <p>{{ $t('feedback.successMessage') }}</p>
            <button @click="goBack" class="success-btn">
                {{ $t('feedback.backToHome') }}
            </button>
        </div>

        <BottomNavigation />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BottomNavigation from '../components/BottomNavigation.vue'

const router = useRouter()
const { t } = useI18n()

const selectedType = ref<'bug' | 'feature' | null>(null)
const description = ref('')
const isSubmitting = ref(false)
const showSuccess = ref(false)

const canSubmit = computed(() => {
    return selectedType.value && description.value.trim().length >= 10 && description.value.length <= 500
})

function getPlaceholderText(): string {
    if (selectedType.value === 'bug') {
        return t('feedback.bugPlaceholder')
    } else if (selectedType.value === 'feature') {
        return t('feedback.featurePlaceholder')
    }
    return t('feedback.defaultPlaceholder')
}

async function submitFeedback() {
    if (!canSubmit.value || isSubmitting.value) return

    isSubmitting.value = true

    try {
        const feedbackData = {
            type: selectedType.value === 'feature' ? 'feedback' : 'bug',
            description: description.value.trim()
        }
        
        const response = await fetch('https://api.kalbuddy.com/api/feedback/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData)
        })
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        console.log('Feedback submitted successfully:', result)
        
        showSuccess.value = true
        selectedType.value = null
        description.value = ''
        
    } catch (error) {
        console.error('Error submitting feedback:', error)
        showSuccess.value = true
        selectedType.value = null
        description.value = ''
    } finally {
        isSubmitting.value = false
    }
}

function goBack() {
    router.back()
}
</script>

<style scoped>
.feedback-view {
    height: 100vh;
    height: calc(100vh - max(44px, env(safe-area-inset-top, 44px)));
    background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
    background-size: 100% 100vh;
    background-position: bottom;
    color: white;
    padding: 0 16px 16px 16px;
    margin-top: max(44px, env(safe-area-inset-top, 44px));
    padding-bottom: max(80px, calc(80px + env(safe-area-inset-bottom, 0px)));
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    overflow-y: auto;
    overflow-x: hidden;
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    height: 44px;
}

.back-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 12px;
    width: 40px;
    height: 40px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.title {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    flex: 1;
    text-align: center;
}

.spacer {
    width: 40px;
}

.feedback-form {
    max-width: 600px;
    margin: 0 auto;
}

.form-section {
    margin-bottom: 32px;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: white;
}

.feedback-type-selector {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.type-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 16px;
    text-align: left;
    color: white;
    width: 100%;
}

.type-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
}

.type-btn.active {
    background: rgba(0, 112, 82, 0.15);
    border-color: #007052;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 112, 82, 0.2);
}

.type-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.bug-icon {
    background: linear-gradient(135deg, #ff6b6b, #ff5252);
}

.feature-icon {
    background: linear-gradient(135deg, #4caf50, #66bb6a);
}

.type-content {
    flex: 1;
}

.type-content h4 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px 0;
}

.type-content p {
    font-size: 14px;
    opacity: 0.8;
    margin: 0;
    line-height: 1.4;
}

.feedback-textarea {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    color: white;
    padding: 16px;
    font-size: 16px;
    font-family: inherit;
    resize: vertical;
    min-height: 120px;
    transition: all 0.3s ease;
    line-height: 1.5;
}

.feedback-textarea:focus {
    outline: none;
    border-color: #007052;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 4px rgba(0, 112, 82, 0.1);
}

.feedback-textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.char-counter {
    text-align: right;
    font-size: 12px;
    opacity: 0.6;
    margin-top: 8px;
}

.form-actions {
    display: flex;
    justify-content: center;
    /*margin-top: 40px;*/
}

.submit-btn {
    background: linear-gradient(135deg, #007052, #005a42);
    border: none;
    border-radius: 16px;
    color: white;
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 160px;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(0, 112, 82, 0.3);
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 112, 82, 0.4);
}

.submit-btn:disabled {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.loading-spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.success-message {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px;
    z-index: 1000;
}

.success-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #4caf50, #66bb6a);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    color: white;
}

.success-message h3 {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 12px 0;
    color: white;
}

.success-message p {
    font-size: 16px;
    opacity: 0.8;
    margin: 0 0 32px 0;
    line-height: 1.5;
    max-width: 400px;
}

.success-btn {
    background: linear-gradient(135deg, #007052, #005a42);
    border: none;
    border-radius: 12px;
    color: white;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.success-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 112, 82, 0.3);
}

@media (min-width: 768px) {
    .feedback-type-selector {
        flex-direction: row;
    }
    
    .type-btn {
        flex: 1;
    }
}
</style>
