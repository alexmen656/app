<template>
    <div>
        <div v-if="scanData" class="nutrition-container">
            <div class="nutrition-header">
                <div class="nutrition-image-wrap" :style="backgroundStyle">
                    <div class="statusbar-spacer"></div>
                    <div class="header-controls">
                        <button class="nutrition-back" @click="$router.go(-1)">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </button>
                        <button class="nutrition-menu" @click="showDetailsModal = true">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="12" cy="5" r="2" />
                                <circle cx="12" cy="19" r="2" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="nutrition-content">
                <div class="nutrition-time">{{ time }}</div>
                <div class="product-header">
                    <div class="product-info">
                        <h1 class="nutrition-name">{{ capitalizeIfLetter(displayName) }}</h1>
                        <div v-if="servingInfo" class="nutrition-serving">
                            {{ servingInfo }}
                        </div>
                    </div>
                    <div class="nutrition-amount">
                        <button class="amount-btn minus" @click="decreaseAmount">−</button>
                        <input 
                            v-model.number="amount" 
                            class="amount-input" 
                            type="number" 
                            step="0.1" 
                            min="0.1"
                            @blur="validateAmount"
                        />
                        <button class="amount-btn plus" @click="increaseAmount">+</button>
                    </div>
                </div>
                <div class="nutrition-macros">
                    <div class="macro calories">
                        <div class="macro-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff6b35">
                                <path
                                    d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
                            </svg>
                        </div>
                        <div class="macro-info">
                            <div class="macro-label">{{ $t('nutrition.calories') }}</div>
                            <div class="macro-value">{{ Math.round(calculatedNutrition.calories) }}</div>
                            <button class="macro-edit" @click="editMacro('calories')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="macro protein">
                        <div class="macro-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff6b6b">
                                <path
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                        <div class="macro-info">
                            <div class="macro-label">{{ $t('nutrition.protein') }}</div>
                            <div class="macro-value">{{ Math.round(calculatedNutrition.protein) }}g</div>
                            <button class="macro-edit" @click="editMacro('protein')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="macro carbs">
                        <div class="macro-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffa726">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                        <div class="macro-info">
                            <div class="macro-label">{{ $t('nutrition.carbs') }}</div>
                            <div class="macro-value">{{ Math.round(calculatedNutrition.carbs) }}g</div>
                            <button class="macro-edit" @click="editMacro('carbs')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="macro fats">
                        <div class="macro-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#42a5f5">
                                <path
                                    d="M9 11H7v9h2v-9zm4 0h-2v9h2v-9zm4 0h-2v9h2v-9zm2-7H4v2h1v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4zm-2 13H6V6h12v11z" />
                            </svg>
                        </div>
                        <div class="macro-info">
                            <div class="macro-label">{{ $t('nutrition.fat') }}</div>
                            <div class="macro-value">{{ Math.round(calculatedNutrition.fats) }}g</div>
                            <button class="macro-edit" @click="editMacro('fats')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Additional Nutrition Information -->
                <div v-if="hasAdditionalNutrition" class="nutrition-additional">
                    <h3>{{ $t('nutrition.additionalNutrients') }}</h3>
                    <div class="additional-grid">
                        <div v-if="additionalNutrition.fiber > 0" class="additional-item">
                            <div class="additional-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#8b5cf6">
                                    <path
                                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </div>
                            <div class="additional-info">
                                <div class="additional-label">{{ $t('nutrition.fiber') }}</div>
                                <div class="additional-value">{{ Math.round(additionalNutrition.fiber * amount) }}g</div>
                            </div>
                        </div>
                        <div v-if="additionalNutrition.sugar > 0" class="additional-item">
                            <div class="additional-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </div>
                            <div class="additional-info">
                                <div class="additional-label">{{ $t('nutrition.sugar') }}</div>
                                <div class="additional-value">{{ Math.round(additionalNutrition.sugar * amount) }}g</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Health Score (nur für Barcode-Produkte) -->
                <div v-if="healthScore > 0" class="nutrition-health">
                    <div class="health-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#22c55e">
                            <path
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                    <div class="health-info">
                        <div class="health-label">{{ $t('nutrition.healthScore') }}</div>
                        <div class="health-score">{{ healthScore }}/10</div>
                    </div>
                    <div class="health-bar">
                        <div class="health-bar-inner" :style="{ width: (healthScore * 10) + '%' }"></div>
                    </div>
                </div>

                <!-- Zutaten für Barcode-Produkte -->
                <div class="nutrition-ingredients" v-if="scanData.type === 'barcode' && scanData.data.ingredients_text">
                    <h3>{{ $t('nutrition.ingredients') }}</h3>
                    <div class="ingredient-text">{{ scanData.data.ingredients_text }}</div>
                </div>

                <!-- Food breakdown für Food-Scans -->
                <div class="nutrition-foods" v-if="scanData.type === 'food' && scanData.data.foods && scanData.data.foods.length > 1">
                    <h3>{{ $t('nutrition.detectedIngredients') }}</h3>
                    <div class="foods-list">
                        <div v-for="food in scanData.data.foods" :key="food.name" class="food-item">
                            <div class="food-name">{{ capitalizeIfLetter(food.name) }}</div>
                            <div class="food-amount" v-if="food.amount">{{ food.amount }}</div>
                            <div class="food-macros">
                                <span class="food-macro">{{ Math.round((food.calories || 0) * amount) }} kcal</span>
                                <span class="food-macro">P: {{ Math.round((food.protein || 0) * amount) }}g</span>
                                <span class="food-macro">K: {{ Math.round((food.carbs || 0) * amount) }}g</span>
                                <span class="food-macro">F: {{ Math.round((food.fat || food.fats || 0) * amount) }}g</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Analysis confidence and notes -->
                <div class="nutrition-analysis" v-if="scanData.type === 'food' && (scanData.data.confidence || scanData.data.notes)">
                    <div class="analysis-confidence" v-if="scanData.data.confidence">
                        <div class="confidence-label">{{ $t('nutrition.analysisConfidence') }}</div>
                        <div class="confidence-badge" :class="confidenceClass">
                            {{ getConfidenceText(scanData.data.confidence) }}
                        </div>
                    </div>
                    <div class="analysis-notes" v-if="scanData.data.notes">
                        <div class="notes-label">{{ $t('nutrition.notes') }}</div>
                        <div class="notes-text">{{ scanData.data.notes }}</div>
                    </div>
                    <div class="analysis-error" v-if="scanData.data.analysisError">
                        <div class="error-icon">⚠️</div>
                        <div class="error-text">{{ $t('nutrition.analysisError') }}</div>
                    </div>
                </div>

                <!-- Source Information -->
                <div class="nutrition-source">
                    <span class="source-text">{{ $t('nutrition.source') }}: </span>
                    <button class="source-link" @click="showSourceModal = true">
                        {{ getSourceDisplay(scanData.type === 'food' ? 'AI' : 'Database') }}
                    </button>
                </div>

                <div class="nutrition-actions">
                    <button class="fix-btn" @click="showFixModal = true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        {{ $t('nutrition.fixResults') }}
                    </button>
                    <button class="done-btn" @click="updateAndReturn">{{ $t('nutrition.done') }}</button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-else class="nutrition-loading">
            <div class="loading-spinner"></div>
            <span>{{ $t('nutrition.loading') }}</span>
        </div>

        <!-- Details Modal -->
        <NutritionDetailsModal :show="showDetailsModal" :product="productForModal" :amount="amount"
            @close="showDetailsModal = false" />

        <!-- Fix Modal -->
        <div v-if="showFixModal" class="modal-overlay" @click="showFixModal = false">
            <div class="modal fix-modal" @click.stop>
                <h3>{{ $t('nutrition.fixResults') }}</h3>
                
                <!-- Basic nutrition editing -->
                <div class="fix-form">
                    <div class="form-group">
                        <label>{{ $t('nutrition.productName') }}</label>
                        <input v-model="editedNutrition.name" type="text">
                    </div>
                    <div class="form-group">
                        <label>{{ $t('nutrition.calories') }}</label>
                        <input v-model.number="editedNutrition.calories" type="number">
                    </div>
                    <div class="form-group">
                        <label>{{ $t('nutrition.protein') }} (g)</label>
                        <input v-model.number="editedNutrition.protein" type="number" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>{{ $t('nutrition.carbs') }} (g)</label>
                        <input v-model.number="editedNutrition.carbs" type="number" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>{{ $t('nutrition.fat') }} (g)</label>
                        <input v-model.number="editedNutrition.fats" type="number" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>{{ $t('nutrition.fiber') }} (g)</label>
                        <input v-model.number="editedNutrition.fiber" type="number" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>{{ $t('nutrition.sugar') }} (g)</label>
                        <input v-model.number="editedNutrition.sugar" type="number" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>{{ $t('nutrition.salt') }} (g)</label>
                        <input v-model.number="editedNutrition.salt" type="number" step="0.01">
                    </div>
                </div>

                <!-- Foods editing for analyzed dishes -->
                <div v-if="editedNutrition.foods && editedNutrition.foods.length > 0" class="foods-editing">
                    <h4>{{ $t('nutrition.detectedFoods') }}</h4>
                    <div class="foods-list-edit">
                        <div v-for="(food, index) in editedNutrition.foods" :key="index" class="food-edit-item">
                            <div class="food-edit-content">
                                <input v-model="food.name" class="food-name-input" :placeholder="$t('nutrition.foodName')">
                                <input v-model="food.amount" class="food-amount-input" :placeholder="$t('nutrition.amount')">
                            </div>
                            <button class="remove-food-btn" @click="removeFood(index)">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button class="add-food-btn" @click="addFood">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        {{ $t('nutrition.addFood') }}
                    </button>
                </div>

                <div class="modal-actions">
                    <button class="cancel-btn" @click="showFixModal = false">{{ $t('common.cancel') }}</button>
                    <button class="save-btn" @click="applyFix">{{ $t('common.save') }}</button>
                </div>
            </div>
        </div>

        <!-- Source Modal -->
        <div v-if="showSourceModal" class="modal-overlay" @click="showSourceModal = false">
            <div class="modal source-modal" @click.stop>
                <h3>{{ $t('nutrition.aboutSource') }}</h3>
                <div class="source-explanation">
                    <h4>{{ getSourceDisplay(scanData?.type === 'food' ? 'AI' : 'Database') }}</h4>
                    <p v-if="scanData?.type === 'food'">
                        {{ $t('nutrition.sourceExplanation.ai') }}
                    </p>
                    <p v-else>
                        {{ $t('nutrition.sourceExplanation.database') }}
                    </p>
                </div>
                <div class="accuracy-warning" v-if="scanData?.type === 'food'">
                    <span>⚠️</span>
                    <span>{{ $t('nutrition.accuracyWarning') }}</span>
                </div>
                <div class="modal-actions">
                    <button class="save-btn" @click="showSourceModal = false">{{ $t('common.close') }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ScanHistory } from '../utils/storage';
import { WidgetDataManager, StreakManager } from '../utils/widgetData';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const scanData = ref(null);
const amount = ref(1.0);
const showFixModal = ref(false);
const showSourceModal = ref(false);
const editedNutrition = ref({});

const time = computed(() => {
    if (!scanData.value) return '';
    return scanData.value.time || new Date(scanData.value.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});

const displayName = computed(() => {
    if (!scanData.value) return '';
    
    if (scanData.value.type === 'food') {
        const firstFood = scanData.value.data.foods?.[0];
        return firstFood?.name || t('home.scannedFood');
    } else {
        return scanData.value.data.product_name || t('home.unknownProduct');
    }
});

const servingInfo = computed(() => {
    if (!scanData.value || scanData.value.type !== 'barcode') return null;
    
    const data = scanData.value.data;
    if (data.serving_size) {
        return `Portion: ${data.serving_size}`;
    }
    return null;
});

const packageInfo = computed(() => {
    if (!scanData.value || scanData.value.type !== 'barcode') return null;
    
    const data = scanData.value.data;
    if (data.quantity) {
        return data.quantity;
    }
    return null;
});

const baseNutrition = computed(() => {
    if (!scanData.value) return { calories: 0, protein: 0, carbs: 0, fats: 0 };
    
    if (scanData.value.type === 'food') {
        const total = scanData.value.data.total || {};
        return {
            calories: total.calories || 0,
            protein: total.protein || 0,
            carbs: total.carbs || 0,
            fats: total.fat || total.fats || 0
        };
    } else {
        const nutriments = scanData.value.data.nutriments || {};
        return {
            calories: nutriments.energy_kcal_100g || 0,
            protein: nutriments.proteins_100g || 0,
            carbs: nutriments.carbohydrates_100g || 0,
            fats: nutriments.fat_100g || 0
        };
    }
});

const calculatedNutrition = computed(() => {
    const base = baseNutrition.value;
    return {
        calories: base.calories * amount.value,
        protein: base.protein * amount.value,
        carbs: base.carbs * amount.value,
        fats: base.fats * amount.value
    };
});

const healthScore = computed(() => {
    if (!scanData.value || scanData.value.type !== 'barcode') return 0;
    return scanData.value.data.nutriscore_grade ? getNutriscoreScore(scanData.value.data.nutriscore_grade) : 5;
});

const confidenceClass = computed(() => {
    if (!scanData.value || scanData.value.type !== 'food') return '';
    const confidence = scanData.value.data.confidence || 'medium';
    return confidence.toLowerCase();
});

const backgroundStyle = computed(() => {
    const baseStyle = {
        width: '100%',
        height: '340px',
        position: 'relative',
        zIndex: 1,
    };

    if (!scanData.value?.image) {
        return {
            ...baseStyle,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        };
    }

    return {
        ...baseStyle,
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${scanData.value.image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
});

function capitalizeIfLetter(value) {
    if (!value) return '';
    return /^[a-zA-Z]/.test(value) 
        ? value.charAt(0).toUpperCase() + value.slice(1) 
        : value;
}

function increaseAmount() {
    amount.value = Math.round((amount.value + 0.1) * 10) / 10;
}

function decreaseAmount() {
    if (amount.value > 0.1) {
        amount.value = Math.round((amount.value - 0.1) * 10) / 10;
    }
}

function validateAmount() {
    if (amount.value < 0.1) {
        amount.value = 0.1;
    }
    amount.value = Math.round(amount.value * 10) / 10;
}

function getNutriscoreScore(grade) {
    const scoreMap = { 'a': 9, 'b': 7, 'c': 5, 'd': 3, 'e': 1 };
    return scoreMap[grade?.toLowerCase()] || 5;
}

function getConfidenceText(confidence) {
    const confidenceMap = {
        'high': t('nutrition.confidenceHigh'),
        'medium': t('nutrition.confidenceMedium'),
        'low': t('nutrition.confidenceLow')
    };
    return confidenceMap[confidence] || t('nutrition.confidenceMedium');
}

function getSourceDisplay(source) {
    const sourceMap = {
        'food': 'AI',
        'AI': 'AI',
        'barcode': 'Database',
        'Database': 'Database',
        'Manual': 'Manual'
    };
    return sourceMap[source] || 'Database';
}

function editMacro(type) {
    editedNutrition.value = { ...baseNutrition.value };
    showFixModal.value = true;
}

function applyFix() {
    // Update base nutrition values
    if (scanData.value.type === 'food') {
        if (!scanData.value.data.total) {
            scanData.value.data.total = {};
        }
        scanData.value.data.total.calories = editedNutrition.value.calories || 0;
        scanData.value.data.total.protein = editedNutrition.value.protein || 0;
        scanData.value.data.total.carbs = editedNutrition.value.carbs || 0;
        scanData.value.data.total.fat = editedNutrition.value.fats || 0;
    } else {
        if (!scanData.value.data.nutriments) {
            scanData.value.data.nutriments = {};
        }
        scanData.value.data.nutriments.energy_kcal_100g = editedNutrition.value.calories || 0;
        scanData.value.data.nutriments.proteins_100g = editedNutrition.value.protein || 0;
        scanData.value.data.nutriments.carbohydrates_100g = editedNutrition.value.carbs || 0;
        scanData.value.data.nutriments.fat_100g = editedNutrition.value.fats || 0;
    }
    
    showFixModal.value = false;
}

async function updateAndReturn() {
    if (!scanData.value) return;

    try {
        // Create updated scan entry
        const updatedScan = {
            ...scanData.value,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // If amount was changed, update the values
        if (amount.value !== 1.0) {
            if (scanData.value.type === 'food') {
                updatedScan.data.total = {
                    calories: Math.round(baseNutrition.value.calories * amount.value),
                    protein: Math.round(baseNutrition.value.protein * amount.value),
                    carbs: Math.round(baseNutrition.value.carbs * amount.value),
                    fat: Math.round(baseNutrition.value.fats * amount.value)
                };
            } else {
                updatedScan.data.nutriments = {
                    ...scanData.value.data.nutriments,
                    energy_kcal_100g: Math.round(baseNutrition.value.calories * amount.value),
                    proteins_100g: Math.round(baseNutrition.value.protein * amount.value),
                    carbohydrates_100g: Math.round(baseNutrition.value.carbs * amount.value),
                    fat_100g: Math.round(baseNutrition.value.fats * amount.value)
                };
            }
        }

        await ScanHistory.add(updatedScan);
        await StreakManager.updateStreak();
        await WidgetDataManager.updateWidgetData();
        window.dispatchEvent(new CustomEvent('scanHistoryUpdated'));
        router.push({ path: '/' });

    } catch (error) {
        console.error('Error updating scan data:', error);
        router.push({ path: '/' });
    }
}

async function loadScanData(scanId) {
    try {
        const history = await ScanHistory.get();
        const scan = history.find(s => s.id === parseInt(scanId));
        
        if (!scan) {
            console.error('Scan not found:', scanId);
            router.push({ path: '/' });
            return;
        }

        scanData.value = scan;
        editedNutrition.value = { ...baseNutrition.value };
    } catch (error) {
        console.error('Error loading scan data:', error);
        router.push({ path: '/' });
    }
}

onMounted(() => {
    const scanId = route.query.scanId;
    if (scanId) {
        loadScanData(scanId);
    } else {
        console.error('No scan ID provided');
        router.push({ path: '/' });
    }
});
</script>

<style scoped>
/* Same styles as ProductDetail.vue but adapted for scan data */
.statusbar-spacer {
    height: env(safe-area-inset-top, 44px);
    width: 100%;
}

.nutrition-container {
    background: #fff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.nutrition-header {
    position: relative;
    background: #f5f5f5;
    overflow: hidden;
    padding-bottom: 0;
}

.header-controls {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0 16px;
    position: absolute;
    top: env(safe-area-inset-top, 44px);
    left: 0;
    right: 0;
    z-index: 3;
}

.nutrition-back,
.nutrition-menu {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    cursor: pointer;
    transition: all 0.2s ease;
}

.nutrition-back:hover,
.nutrition-menu:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
}

.nutrition-content {
    background: #fff;
    border-radius: 32px 32px 0 0;
    margin-top: -32px;
    padding: 24px 20px 0 20px;
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.06);
    flex: 1;
    position: relative;
    z-index: 2;
}

.nutrition-time {
    color: #666;
    font-size: 14px;
    margin-bottom: 8px;
    margin-top: 8px;
    font-weight: 500;
}

.product-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 16px;
}

.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.nutrition-name {
    font-size: 26px;
    font-weight: 700;
    margin: 0;
    word-break: break-word;
    color: #1a1a1a;
    line-height: 1.2;
}

.nutrition-brand {
    font-size: 16px;
    font-weight: 500;
    color: #666;
    margin: 0;
}

.nutrition-serving {
    font-size: 14px;
    font-weight: 500;
    color: #007aff;
    margin: 0;
}

.package-size {
    color: #666;
    font-weight: 400;
    margin-left: 4px;
}

.nutrition-amount {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #f8f9fa;
    border-radius: 20px;
    padding: 6px 12px;
    flex-shrink: 0;
}

.amount-btn {
    background: #fff;
    border: 2px solid #e1e5e9;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #333;
    line-height: 5px;
}

.amount-btn:hover {
    background: #f0f0f0;
    border-color: #ccc;
}

.amount-btn.minus {
    color: #666;
}

.amount-btn.plus {
    background: #000;
    color: #fff;
    border-color: #000;
}

.amount-input {
    background: transparent;
    border: none;
    font-size: 16px;
    font-weight: 600;
    width: 32px;
    text-align: center;
    color: #333;
    outline: none;
    appearance: none;
    -moz-appearance: textfield;
}

.amount-input::-webkit-outer-spin-button,
.amount-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.nutrition-macros {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 10px;
}

.macro {
    background: #f8f9fa;
    border-radius: 20px;
    padding: 20px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 80px;
    position: relative;
    transition: all 0.2s ease;
}

.macro:hover {
    background: #f0f0f0;
}

.macro-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.macro-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.macro-label {
    color: #666;
    font-size: 13px;
    font-weight: 500;
    margin: 0;
}

.macro-value {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
}

.macro-edit {
    background: transparent;
    border: none;
    padding: 4px;
    border-radius: 8px;
    opacity: 0.7;
    transition: all 0.2s ease;
    cursor: pointer;
    position: absolute;
    top: 12px;
    right: 12px;
}

.macro-edit:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.05);
}

.nutrition-health {
    background: #f8f9fa;
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
}

.health-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.health-info {
    flex: 1;
}

.health-label {
    color: #666;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 4px;
}

.health-score {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
}

.health-bar {
    background: #e1e5e9;
    border-radius: 10px;
    height: 8px;
    width: 100%;
    overflow: hidden;
}

.health-bar-inner {
    background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
    height: 100%;
    border-radius: 10px;
    transition: width 0.3s ease;
}

.nutrition-foods {
    margin-bottom: 24px;
}

.nutrition-foods h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #1a1a1a;
}

.foods-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.food-item {
    background: #f8f9fa;
    border-radius: 16px;
    padding: 16px;
    border-left: 4px solid #007aff;
}

.food-name {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
}

.food-amount {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
}

.food-macros {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.food-macro {
    background: #fff;
    border-radius: 8px;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 500;
    color: #333;
    border: 1px solid #e1e5e9;
}

.nutrition-ingredients {
    margin-bottom: 32px;
}

.nutrition-ingredients h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #1a1a1a;
}

.ingredient-text {
    background: #f8f9fa;
    border-radius: 16px;
    padding: 16px;
    font-size: 14px;
    line-height: 1.5;
    color: #666;
}

.nutrition-analysis {
    background: #f8f9fa;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 24px;
}

.analysis-confidence {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.confidence-label {
    font-size: 14px;
    font-weight: 500;
    color: #666;
}

.confidence-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.confidence-badge.high {
    background: #d1fae5;
    color: #065f46;
}

.confidence-badge.medium {
    background: #fef3c7;
    color: #92400e;
}

.confidence-badge.low {
    background: #fee2e2;
    color: #991b1b;
}

.analysis-notes {
    margin-bottom: 12px;
}

.notes-label {
    font-size: 14px;
    font-weight: 500;
    color: #666;
    margin-bottom: 6px;
}

.notes-text {
    font-size: 14px;
    line-height: 1.4;
    color: #333;
}

.nutrition-source {
    background: #f8f9fa;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.source-text {
    font-size: 14px;
    font-weight: 500;
    color: #666;
}

.source-link {
    background: none;
    border: none;
    color: #007aff;
    font-size: 14px;
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s ease;
}

.source-link:hover {
    color: #0056cc;
}

.nutrition-actions {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    padding-bottom: env(safe-area-inset-bottom, 20px);
}

.fix-btn {
    flex: 1;
    background: #fff;
    border: 2px solid #000;
    border-radius: 20px;
    padding: 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
    cursor: pointer;
}

.fix-btn:hover {
    background: #f8f9fa;
}

.done-btn {
    flex: 1;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 20px;
    padding: 16px 0;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.2s ease;
    cursor: pointer;
}

.done-btn:hover {
    background: #333;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal {
    background: #fff;
    border-radius: 24px;
    padding: 24px;
    max-width: 400px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
}

.modal h3 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #1a1a1a;
}

.fix-form {
    margin-bottom: 24px;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 6px;
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    font-size: 16px;
    transition: border-color 0.2s ease;
}

.form-group input:focus {
    outline: none;
    border-color: #000;
}

.modal-actions {
    display: flex;
    gap: 12px;
}

.cancel-btn {
    flex: 1;
    background: #fff;
    border: 2px solid #e1e5e9;
    border-radius: 16px;
    padding: 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: #666;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cancel-btn:hover {
    background: #f8f9fa;
}

.save-btn {
    flex: 1;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 16px;
    padding: 12px 0;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.save-btn:hover {
    background: #333;
}

.source-explanation {
    margin-bottom: 24px;
    line-height: 1.5;
    color: #333;
}

.source-explanation h4 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 12px 0;
    color: #1a1a1a;
}

.nutrition-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-size: 18px;
    color: #666;
    font-weight: 500;
    gap: 16px;
}

.loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #f0f0f0;
    border-top: 3px solid #333;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
    .nutrition-container {
        background: #000;
        color: #fff;
    }

    .nutrition-content {
        background: #000;
        color: #fff;
    }

    .nutrition-time {
        color: #8e8e93;
    }

    .nutrition-name {
        color: #fff;
    }

    .nutrition-brand {
        color: #8e8e93;
    }

    .nutrition-serving {
        color: #007aff;
    }

    .nutrition-amount {
        background: #1c1c1e;
    }

    .amount-btn {
        background: #2c2c2e;
        border-color: #3a3a3c;
        color: #fff;
    }

    .amount-btn:hover {
        background: #3a3a3c;
        border-color: #4a4a4c;
    }

    .amount-btn.plus {
        background: #fff;
        color: #000;
        border-color: #fff;
    }

    .amount-input {
        color: #fff;
    }

    .macro {
        background: #1c1c1e;
    }

    .macro:hover {
        background: #2c2c2e;
    }

    .macro-label {
        color: #8e8e93;
    }

    .macro-value {
        color: #fff;
    }

    .macro-edit:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .nutrition-health {
        background: #1c1c1e;
    }

    .health-label {
        color: #8e8e93;
    }

    .health-score {
        color: #fff;
    }

    .health-bar {
        background: #3a3a3c;
    }

    .nutrition-foods h3,
    .nutrition-ingredients h3 {
        color: #fff;
    }

    .food-item {
        background: #1c1c1e;
    }

    .food-name {
        color: #fff;
    }

    .food-amount {
        color: #8e8e93;
    }

    .food-macro {
        background: #2c2c2e;
        color: #fff;
        border-color: #3a3a3c;
    }

    .ingredient-text {
        background: #1c1c1e;
        color: #8e8e93;
    }

    .nutrition-analysis {
        background: #1c1c1e;
    }

    .confidence-label,
    .notes-label {
        color: #8e8e93;
    }

    .notes-text {
        color: #fff;
    }

    .nutrition-source {
        background: #1c1c1e;
    }

    .source-text {
        color: #8e8e93;
    }

    .fix-btn {
        background: #1c1c1e;
        border-color: #fff;
        color: #fff;
    }

    .fix-btn:hover {
        background: #2c2c2e;
    }

    .done-btn {
        background: #fff;
        color: #000;
    }

    .done-btn:hover {
        background: #e5e5e7;
    }

    .modal {
        background: #1c1c1e;
        color: #fff;
    }

    .modal h3 {
        color: #fff;
    }

    .form-group label {
        color: #fff;
    }

    .form-group input {
        background: #2c2c2e;
        border-color: #3a3a3c;
        color: #fff;
    }

    .form-group input:focus {
        border-color: #007aff;
    }

    .cancel-btn {
        background: #1c1c1e;
        border-color: #3a3a3c;
        color: #8e8e93;
    }

    .cancel-btn:hover {
        background: #2c2c2e;
    }

    .save-btn {
        background: #fff;
        color: #000;
    }

    .save-btn:hover {
        background: #e5e5e7;
    }

    .source-explanation {
        color: #e5e5e7;
    }

    .source-explanation h4 {
        color: #fff;
    }

    .nutrition-loading {
        color: #8e8e93;
    }

    .loading-spinner {
        border-color: #3a3a3c;
        border-top-color: #fff;
    }

    .nutrition-back,
    .nutrition-menu {
        background: rgba(28, 28, 30, 0.9);
        color: #fff;
    }

    .nutrition-back:hover,
    .nutrition-menu:hover {
        background: rgba(28, 28, 30, 1);
    }
}
</style>
