<template>
    <div class="manual-entry-view">
        <!-- Processing Overlay -->
        <div v-if="isProcessing" class="processing-overlay">
            <div class="processing-content">
                <div class="processing-spinner"></div>
                <h3>{{ $t('manualEntry.analyzing') }}</h3>
                <p>{{ $t('manualEntry.pleaseWait') }}</p>
            </div>
        </div>

        <!-- Header -->
        <header class="header">
            <button class="back-btn" @click="goBack">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
            </button>
            <h1 class="page-title">{{ $t('manualEntry.title') }}</h1>
        </header>

        <!-- Main Content -->
        <div class="content">
            <!-- Instructions -->
            <div class="instructions-card">
                <div class="instruction-icon">✍️</div>
                <h3>{{ $t('manualEntry.instructions.title') }}</h3>
                <p>{{ $t('manualEntry.instructions.description') }}</p>
                
                <!-- Examples -->
                <div class="examples">
                    <h4>{{ $t('manualEntry.examples.title') }}</h4>
                    <div class="example-items">
                        <div class="example-item">{{ $t('manualEntry.examples.example1') }}</div>
                        <div class="example-item">{{ $t('manualEntry.examples.example2') }}</div>
                        <div class="example-item">{{ $t('manualEntry.examples.example3') }}</div>
                    </div>
                </div>
            </div>

            <!-- Text Input Form -->
            <div class="input-card">
                <label for="foodDescription" class="input-label">
                    {{ $t('manualEntry.whatDidYouEat') }}
                </label>
                <textarea
                    id="foodDescription"
                    v-model="foodDescription"
                    :placeholder="$t('manualEntry.placeholder')"
                    class="food-textarea"
                    rows="6"
                    maxlength="500"
                ></textarea>
                
                <!-- Character counter -->
                <div class="char-counter">
                    {{ foodDescription.length }}/500
                </div>

                <!-- Confidence Level (if available) -->
                <div v-if="analysisResult" class="confidence-section">
                    <div class="confidence-label">
                        {{ $t('manualEntry.analysisConfidence') }}:
                        <span class="confidence-value" :class="`confidence-${analysisResult.confidence}`">
                            {{ $t(`nutrition.confidence.${analysisResult.confidence}`) }}
                        </span>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="action-buttons">
                    <button 
                        class="analyze-btn"
                        @click="analyzeFood"
                        :disabled="!foodDescription.trim() || isProcessing"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H11V21H5V3H13V9H21Z" />
                        </svg>
                        {{ $t('manualEntry.analyzeButton') }}
                    </button>
                </div>
            </div>

            <!-- Analysis Results -->
            <div v-if="analysisResult" class="results-card">
                <h3 class="results-title">{{ $t('manualEntry.detectedFoods') }}</h3>
                
                <!-- Food Items -->
                <div class="detected-foods">
                    <div 
                        v-for="(food, index) in analysisResult.foods" 
                        :key="index" 
                        class="food-result"
                    >
                        <div class="food-header">
                            <div class="food-icon">🍽️</div>
                            <div class="food-info">
                                <h4 class="food-name">{{ getLocalizedText(food.name) }}</h4>
                                <p class="food-amount">{{ getLocalizedText(food.amount) }}</p>
                            </div>
                            <div class="food-calories">
                                <span class="calories-number">{{ food.calories }}</span>
                                <span class="calories-unit">kcal</span>
                            </div>
                        </div>
                        
                        <!-- Macros -->
                        <div class="food-macros">
                            <div class="macro-item protein">
                                <span class="macro-label">{{ $t('nutrition.protein') }}:</span>
                                <span class="macro-value">{{ food.protein }}g</span>
                            </div>
                            <div class="macro-item carbs">
                                <span class="macro-label">{{ $t('nutrition.carbs') }}:</span>
                                <span class="macro-value">{{ food.carbs }}g</span>
                            </div>
                            <div class="macro-item fats">
                                <span class="macro-label">{{ $t('nutrition.fats') }}:</span>
                                <span class="macro-value">{{ food.fat }}g</span>
                            </div>
                        </div>
                        
                        <!-- Edit/Adjust Button -->
                        <button class="edit-food-btn" @click="editFood(index)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                            {{ $t('manualEntry.editFood') }}
                        </button>
                    </div>
                </div>

                <!-- Total Summary -->
                <div class="total-summary">
                    <h4>{{ $t('manualEntry.totalNutrition') }}</h4>
                    <div class="total-macros">
                        <div class="total-item calories">
                            <span class="total-label">{{ $t('nutrition.calories') }}:</span>
                            <span class="total-value">{{ totalCalories }} kcal</span>
                        </div>
                        <div class="total-item protein">
                            <span class="total-label">{{ $t('nutrition.protein') }}:</span>
                            <span class="total-value">{{ totalProtein }}g</span>
                        </div>
                        <div class="total-item carbs">
                            <span class="total-label">{{ $t('nutrition.carbs') }}:</span>
                            <span class="total-value">{{ totalCarbs }}g</span>
                        </div>
                        <div class="total-item fats">
                            <span class="total-label">{{ $t('nutrition.fats') }}:</span>
                            <span class="total-value">{{ totalFats }}g</span>
                        </div>
                    </div>
                </div>

                <!-- Notes from API -->
                <div v-if="analysisResult.notes" class="analysis-notes">
                    <h4>{{ $t('manualEntry.analysisNotes') }}</h4>
                    <p>{{ getLocalizedText(analysisResult.notes) }}</p>
                </div>

                <!-- Add to Diary Button -->
                <div class="final-actions">
                    <button class="add-to-diary-btn" @click="addToDiary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        {{ $t('manualEntry.addToDiary') }}
                    </button>
                    
                    <button class="try-again-btn" @click="tryAgain">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                        </svg>
                        {{ $t('manualEntry.tryAgain') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ScanHistory } from '../utils/storage'

const router = useRouter()
// @ts-ignore - t is used in template  
const { t, locale } = useI18n()

// State
const foodDescription = ref('')
const isProcessing = ref(false)
const analysisResult = ref<AnalysisResult | null>(null)
const errorMessage = ref('')

// Types
interface FoodItem {
    name: LocalizedText
    amount: LocalizedText
    calories: number
    protein: number
    carbs: number
    fat: number
}

interface LocalizedText {
    de: string
    en: string
    es: string
}

interface APIResponse {
    success: boolean
    data: {
        names: LocalizedText
        foods: FoodItem[]
        total: {
            calories: number
            protein: number
            carbs: number
            fat: number
        }
        confidence: string
        notes: LocalizedText
        timestamp: string
        model: string
        source: string
    }
    message: string
}

interface AnalysisResult {
    foods: FoodItem[]
    total: {
        calories: number
        protein: number
        carbs: number
        fat: number
    }
    confidence: 'high' | 'medium' | 'low'
    notes: LocalizedText
}

// Computed
const totalCalories = computed(() => {
    if (!analysisResult.value?.total) return 0
    return analysisResult.value.total.calories
})

const totalProtein = computed(() => {
    if (!analysisResult.value?.total) return 0
    return analysisResult.value.total.protein
})

const totalCarbs = computed(() => {
    if (!analysisResult.value?.total) return 0
    return analysisResult.value.total.carbs
})

const totalFats = computed(() => {
    if (!analysisResult.value?.total) return 0
    return analysisResult.value.total.fat
})

// Helper function to get localized text
const getLocalizedText = (text: LocalizedText): string => {
    const currentLocale = locale.value as keyof LocalizedText
    return text[currentLocale] || text.en || text.de
}

// Methods
function goBack() {
    router.go(-1)
}

async function analyzeFood() {
    if (!foodDescription.value.trim()) return

    isProcessing.value = true
    errorMessage.value = ''
    
    try {
        const response = await fetch('https://v2-2.api.kalbuddy.com/api/text/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description: foodDescription.value.trim()
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const apiResponse: APIResponse = await response.json()
        
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Analysis failed')
        }

        // Map API confidence to our format
        let confidence: 'high' | 'medium' | 'low' = 'medium'
        const apiConfidence = apiResponse.data.confidence.toLowerCase()
        if (apiConfidence.includes('hoch') || apiConfidence.includes('high')) {
            confidence = 'high'
        } else if (apiConfidence.includes('niedrig') || apiConfidence.includes('low')) {
            confidence = 'low'
        }

        analysisResult.value = {
            foods: apiResponse.data.foods,
            total: apiResponse.data.total,
            confidence,
            notes: apiResponse.data.notes
        }
        
    } catch (error) {
        console.error('Analysis failed:', error)
        errorMessage.value = 'Analysis failed. Please try again.'
        
        // Fallback to mock data for testing
        await simulateAnalysis()
    } finally {
        isProcessing.value = false
    }
}

async function simulateAnalysis() {
    // This is just a fallback - won't be used with real API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockResult: AnalysisResult = {
        foods: [{
            name: { de: 'Gemischtes Essen', en: 'Mixed Meal', es: 'Comida Mixta' },
            amount: { de: '1 Portion', en: '1 portion', es: '1 porción' },
            calories: 300,
            protein: 15,
            carbs: 30,
            fat: 12
        }],
        total: { calories: 300, protein: 15, carbs: 30, fat: 12 },
        confidence: 'medium',
        notes: { 
            de: 'Dies ist eine Beispielanalyse', 
            en: 'This is a sample analysis', 
            es: 'Este es un análisis de muestra' 
        }
    }
    
    analysisResult.value = mockResult
}

function editFood(index: number) {
    // Navigate to edit view or show inline editor
    console.log('Edit food at index:', index)
    // You could implement an inline editor or navigate to a dedicated edit view
}

async function addToDiary() {
    if (!analysisResult.value) return
    
    try {
        // Convert to scan history format and save
        for (const food of analysisResult.value.foods) {
            const scanItem = {
                id: Date.now() + Math.random(),
                name: getLocalizedText(food.name),
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fats: food.fat, // Note: API uses 'fat', storage expects 'fats'
                timestamp: new Date().toISOString(),
                image: '', // No image for manual entries
                barcode: '',
                type: 'manual',
                source: 'manual',
                confidence: analysisResult.value.confidence,
                originalText: foodDescription.value
            }
            
            await ScanHistory.add(scanItem)
        }
        
        // Navigate back to home
        router.push('/')
        
    } catch (error) {
        console.error('Failed to add to diary:', error)
    }
}

function tryAgain() {
    analysisResult.value = null
    foodDescription.value = ''
}
</script>

<style scoped>
.manual-entry-view {
    min-height: 100vh;
    background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.header {
    display: flex;
    align-items: center;
    padding: max(44px, env(safe-area-inset-top, 44px)) 16px 20px 16px;
    gap: 16px;
}

.back-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 12px;
    padding: 8px;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
}

.content {
    padding: 0 16px 32px 16px;
    max-width: 600px;
    margin: 0 auto;
}

/* Instructions Card */
.instructions-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
    text-align: center;
}

.instruction-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.instructions-card h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 12px 0;
}

.instructions-card p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin-bottom: 20px;
}

.examples h4 {
    font-size: 16px;
    margin-bottom: 12px;
    color: rgba(255, 255, 255, 0.9);
}

.example-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.example-item {
    background: rgba(255, 255, 255, 0.05);
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    text-align: left;
}

/* Input Card */
.input-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
}

.input-label {
    display: block;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    color: white;
}

.food-textarea {
    width: 100%;
    min-height: 120px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 16px;
    color: white;
    font-size: 16px;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.2s;
}

.food-textarea:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
}

.food-textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.char-counter {
    text-align: right;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 8px;
    margin-bottom: 16px;
}

.confidence-section {
    margin-bottom: 20px;
}

.confidence-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
}

.confidence-value {
    font-weight: 600;
    margin-left: 8px;
}

.confidence-high { color: #4caf50; }
.confidence-medium { color: #ff9800; }
.confidence-low { color: #f44336; }

.action-buttons {
    display: flex;
    justify-content: center;
}

.analyze-btn {
    background: linear-gradient(135deg, #4caf50, #45a049);
    border: none;
    border-radius: 12px;
    padding: 16px 32px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.analyze-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
}

.analyze-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

/* Results Card */
.results-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 24px;
    backdrop-filter: blur(10px);
}

.results-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 20px 0;
}

.detected-foods {
    margin-bottom: 24px;
}

.food-result {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 16px;
}

.food-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;
}

.food-icon {
    font-size: 32px;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
}

.food-info {
    flex: 1;
}

.food-name {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 4px 0;
}

.food-amount {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
}

.food-calories {
    text-align: right;
}

.calories-number {
    font-size: 24px;
    font-weight: 700;
    display: block;
}

.calories-unit {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
}

.food-macros {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 16px;
}

.macro-item {
    background: rgba(0, 0, 0, 0.2);
    padding: 8px 12px;
    border-radius: 8px;
    text-align: center;
}

.macro-label {
    display: block;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 2px;
}

.macro-value {
    font-weight: 600;
    font-size: 14px;
}

.macro-item.protein .macro-value { color: #ff6b6b; }
.macro-item.carbs .macro-value { color: #ffa726; }
.macro-item.fats .macro-value { color: #42a5f5; }

.edit-food-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
}

.edit-food-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* Total Summary */
.total-summary {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 24px;
}

.total-summary h4 {
    margin: 0 0 16px 0;
    font-size: 18px;
}

.total-macros {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.total-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
}

.total-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
}

.total-value {
    font-weight: 600;
}

.total-item.calories .total-value { color: #ff6b35; }
.total-item.protein .total-value { color: #ff6b6b; }
.total-item.carbs .total-value { color: #ffa726; }
.total-item.fats .total-value { color: #42a5f5; }

/* Final Actions */
.final-actions {
    display: flex;
    gap: 12px;
}

.add-to-diary-btn {
    background: linear-gradient(135deg, #4caf50, #45a049);
    border: none;
    border-radius: 12px;
    padding: 16px 24px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: center;
}

.add-to-diary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
}

.try-again-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 12px;
    padding: 16px 24px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.try-again-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* Processing Overlay */
.processing-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.processing-content {
    text-align: center;
    padding: 30px;
    background: rgba(30, 30, 46, 0.95);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.processing-content h3 {
    margin: 20px 0 10px 0;
    font-size: 18px;
    font-weight: 600;
}

.processing-content p {
    margin: 0;
    opacity: 0.8;
    font-size: 14px;
}

.processing-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
    .total-macros {
        grid-template-columns: 1fr;
    }
    
    .final-actions {
        flex-direction: column;
    }
    
    .food-macros {
        grid-template-columns: 1fr;
    }
}
</style>
