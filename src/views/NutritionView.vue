<template>
    <div>
        <div v-if="product" class="nutrition-container">
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
                                <circle cx="12" cy="12" r="2"/>
                                <circle cx="12" cy="5" r="2"/>
                                <circle cx="12" cy="19" r="2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="nutrition-content">
                <div class="nutrition-time">{{ time }}</div>
                <div class="product-header">
                    <div class="product-info">
                        <h1 class="nutrition-name">{{ capitalizeIfLetter(product.name) }}</h1>
                        <!--<div v-if="product.brand" class="nutrition-brand">{{ product.brand }}</div>-->
                        <div v-if="product.servingSize && product.servingUnit" class="nutrition-serving">
                            {{ $t('nutrition.serving') }}: {{ product.servingSize }}{{ product.servingUnit }}
                            <!--<span v-if="product.packageSize" class="package-size">({{ product.packageSize }})</span>-->
                        </div>
                    </div>
                    <div class="nutrition-amount">
                        <button class="amount-btn minus" @click="decreaseAmount">−</button>
                        <span class="amount-number">{{ amount }}</span>
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
                            <div class="macro-value">{{ Math.round(product.calories * amount) }}</div>
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
                            <div class="macro-value">{{ Math.round(product.protein * amount) }}g</div>
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
                            <div class="macro-value">{{ Math.round(product.carbs * amount) }}g</div>
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
                            <div class="macro-value">{{ Math.round(product.fats * amount) }}g</div>
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
                        <div v-if="product.fiber > 0" class="additional-item">
                            <div class="additional-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#8b5cf6">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            </div>
                            <div class="additional-info">
                                <div class="additional-label">{{ $t('nutrition.fiber') }}</div>
                                <div class="additional-value">{{ Math.round(product.fiber * amount) }}g</div>
                            </div>
                        </div>
                        <div v-if="product.sugar > 0" class="additional-item">
                            <div class="additional-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <div class="additional-info">
                                <div class="additional-label">{{ $t('nutrition.sugar') }}</div>
                                <div class="additional-value">{{ Math.round(product.sugar * amount) }}g</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="nutrition-health">
                    <div class="health-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#22c55e">
                            <path
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                    <div class="health-info">
                        <div class="health-label">{{ $t('nutrition.healthScore') }}</div>
                        <div class="health-score">{{ product.healthScore }}/10</div>
                    </div>
                    <div class="health-bar">
                        <div class="health-bar-inner" :style="{ width: (product.healthScore * 10) + '%' }"></div>
                    </div>
                </div>
                <div class="nutrition-ingredients" v-if="product.ingredients && product.ingredients.length > 0">
                    <h3>{{ $t('nutrition.ingredients') }}</h3>
                    <div class="ingredient-text">{{ product.ingredients.join(', ') }}</div>
                </div>
                
                <!-- Detailed food breakdown for analyzed dishes -->
                <div class="nutrition-foods" v-if="product.foods && product.foods.length > 1">
                    <h3>{{ $t('nutrition.detectedIngredients') }}</h3>
                    <div class="foods-list">
                        <div v-for="food in product.foods" :key="food.name" class="food-item">
                            <div class="food-name">{{ food.name }}</div>
                            <div class="food-amount" v-if="food.amount">{{ food.amount }}</div>
                            <div class="food-macros">
                                <span class="food-macro">{{ Math.round(food.calories * amount) }} kcal</span>
                                <span class="food-macro">P: {{ Math.round(food.protein * amount) }}g</span>
                                <span class="food-macro">K: {{ Math.round(food.carbs * amount) }}g</span>
                                <span class="food-macro">F: {{ Math.round((food.fat || food.fats) * amount) }}g</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Analysis confidence and notes -->
                <div class="nutrition-analysis" v-if="product.type === 'food' && (product.confidence || product.notes)">
                    <div class="analysis-confidence" v-if="product.confidence">
                        <div class="confidence-label">{{ $t('nutrition.analysisConfidence') }}</div>
                        <div class="confidence-badge" :class="product.confidence">
                            {{ product.confidence === 'hoch' ? $t('nutrition.high') : product.confidence === 'medium' ? $t('nutrition.medium') : $t('nutrition.low') }}
                        </div>
                    </div>
                    <div class="analysis-notes" v-if="product.notes">
                        <div class="notes-label">{{ $t('nutrition.notes') }}</div>
                        <div class="notes-text">{{ product.notes }}</div>
                    </div>
                    <div class="analysis-error" v-if="product.analysisError">
                        <div class="error-icon">⚠️</div>
                        <div class="error-text">{{ $t('nutrition.analysisError') }}</div>
                    </div>
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
                    <button class="done-btn" @click="saveAndReturn">{{ $t('nutrition.done') }}</button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-else class="nutrition-loading">
            <div class="loading-spinner"></div>
            <span>{{ $t('nutrition.loading') }}</span>
        </div>

        <!-- Details Modal -->
        <div v-if="showDetailsModal" class="modal-overlay" @click="showDetailsModal = false">
            <div class="details-modal" @click.stop>
                <div class="details-header">
                    <h3>{{ $t('nutrition.allNutritionInfo') }}</h3>
                    <button @click="showDetailsModal = false" class="close-btn">×</button>
                </div>
                <div class="details-content">
                    <!-- Main Nutrition Values -->
                    <div class="details-section">
                        <h4>{{ $t('nutrition.mainNutrients') }} ({{ amount }}x {{ $t('nutrition.portion') }})</h4>
                        <div class="details-grid">
                            <div class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.calories') }}</span>
                                <span class="detail-value">{{ Math.round(product.calories * amount) }} kcal</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.protein') }}</span>
                                <span class="detail-value">{{ Math.round(product.protein * amount) }}g</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.carbs') }}</span>
                                <span class="detail-value">{{ Math.round(product.carbs * amount) }}g</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.fat') }}</span>
                                <span class="detail-value">{{ Math.round(product.fats * amount) }}g</span>
                            </div>
                            <div v-if="product.fiber > 0" class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.fiber') }}</span>
                                <span class="detail-value">{{ Math.round(product.fiber * amount) }}g</span>
                            </div>
                            <div v-if="product.sugar > 0" class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.sugar') }}</span>
                                <span class="detail-value">{{ Math.round(product.sugar * amount) }}g</span>
                            </div>
                            <div v-if="product.salt > 0" class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.salt') }}</span>
                                <span class="detail-value">{{ Math.round(product.salt * amount * 100) / 100 }}g</span>
                            </div>
                        </div>
                    </div>

                    <!-- Per 100g Values -->
                    <div v-if="product.nutritionPer100g" class="details-section">
                        <h4>{{ $t('nutrition.per100g') }}</h4>
                        <div class="details-grid">
                            <div class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.calories') }}</span>
                                <span class="detail-value">{{ product.nutritionPer100g.calories || 0 }} kcal</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.protein') }}</span>
                                <span class="detail-value">{{ product.nutritionPer100g.protein || 0 }}g</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.carbs') }}</span>
                                <span class="detail-value">{{ product.nutritionPer100g.carbs || 0 }}g</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.fat') }}</span>
                                <span class="detail-value">{{ product.nutritionPer100g.fats || 0 }}g</span>
                            </div>
                            <div v-if="product.nutritionPer100g.fiber > 0" class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.fiber') }}</span>
                                <span class="detail-value">{{ product.nutritionPer100g.fiber }}g</span>
                            </div>
                            <div v-if="product.nutritionPer100g.sugar > 0" class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.sugar') }}</span>
                                <span class="detail-value">{{ product.nutritionPer100g.sugar }}g</span>
                            </div>
                            <div v-if="product.nutritionPer100g.salt > 0" class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.salt') }}</span>
                                <span class="detail-value">{{ product.nutritionPer100g.salt }}g</span>
                            </div>
                        </div>
                    </div>

                    <!-- Per Serving Values -->
                    <div v-if="product.nutritionPerServing" class="details-section">
                        <h4>{{ $t('nutrition.perServing') }} ({{ product.servingSize }}{{ product.servingUnit }})</h4>
                        <div class="details-grid">
                            <div class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.calories') }}</span>
                                <span class="detail-value">{{ product.nutritionPerServing.calories || 0 }} kcal</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.protein') }}</span>
                                <span class="detail-value">{{ product.nutritionPerServing.protein || 0 }}g</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.carbs') }}</span>
                                <span class="detail-value">{{ product.nutritionPerServing.carbs || 0 }}g</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.fat') }}</span>
                                <span class="detail-value">{{ product.nutritionPerServing.fats || 0 }}g</span>
                            </div>
                            <div v-if="product.nutritionPerServing.fiber > 0" class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.fiber') }}</span>
                                <span class="detail-value">{{ product.nutritionPerServing.fiber }}g</span>
                            </div>
                            <div v-if="product.nutritionPerServing.sugar > 0" class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.sugar') }}</span>
                                <span class="detail-value">{{ product.nutritionPerServing.sugar }}g</span>
                            </div>
                            <div v-if="product.nutritionPerServing.salt > 0" class="detail-item">
                                <span class="detail-label">{{ $t('nutrition.salt') }}</span>
                                <span class="detail-value">{{ product.nutritionPerServing.salt }}g</span>
                            </div>
                        </div>
                    </div>

                    <!-- Product Information -->
                    <div class="details-section">
                        <h4>{{ $t('nutrition.productInfo') }}</h4>
                        <div class="product-details">
                            <div v-if="product.brand" class="product-detail">
                                <span class="detail-label">{{ $t('nutrition.brand') }}</span>
                                <span class="detail-value">{{ product.brand }}</span>
                            </div>
                            <div v-if="product.packageSize" class="product-detail">
                                <span class="detail-label">{{ $t('nutrition.packageSize') }}</span>
                                <span class="detail-value">{{ product.packageSize }}</span>
                            </div>
                            <div v-if="product.barcode" class="product-detail">
                                <span class="detail-label">{{ $t('nutrition.barcode') }}</span>
                                <span class="detail-value">{{ product.barcode }}</span>
                            </div>
                            <div class="product-detail">
                                <span class="detail-label">{{ $t('nutrition.healthScore') }}</span>
                                <span class="detail-value">{{ product.healthScore }}/10</span>
                            </div>
                            <div class="product-detail">
                                <span class="detail-label">{{ $t('nutrition.source') }}</span>
                                <span class="detail-value">{{ product.source }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Fix Modal -->
        <div v-if="showFixModal" class="modal-overlay" @click="showFixModal = false">
            <div class="modal" @click.stop>
                <h3>Fix Results</h3>
                <div class="fix-form">
                    <div class="form-group">
                        <label>Product Name</label>
                        <input v-model="editedProduct.name" type="text">
                    </div>
                    <div class="form-group">
                        <label>Calories</label>
                        <input v-model.number="editedProduct.calories" type="number">
                    </div>
                    <div class="form-group">
                        <label>Protein (g)</label>
                        <input v-model.number="editedProduct.protein" type="number" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Carbs (g)</label>
                        <input v-model.number="editedProduct.carbs" type="number" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Fats (g)</label>
                        <input v-model.number="editedProduct.fats" type="number" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Fiber (g)</label>
                        <input v-model.number="editedProduct.fiber" type="number" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Sugar (g)</label>
                        <input v-model.number="editedProduct.sugar" type="number" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Salt (g)</label>
                        <input v-model.number="editedProduct.salt" type="number" step="0.01">
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="cancel-btn" @click="showFixModal = false">Cancel</button>
                    <button class="save-btn" @click="applyFix">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { BarcodeCache, ScanHistory } from '../utils/storage';
import { WidgetDataManager, StreakManager } from '../utils/widgetData';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const product = ref(null);
const amount = ref(1);
const showFixModal = ref(false);
const showDetailsModal = ref(false);
const editedProduct = ref({});
const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function capitalizeIfLetter(value) {
  if (!value) return ''
  return /^[a-zA-Z]/.test(value)
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : value
}

const fetchProduct = async (barcode) => {
    try {
        // First check cache
        const cachedProduct = await BarcodeCache.get(barcode);
        if (cachedProduct) {
            console.log('Using cached product data for barcode:', barcode);
            
            // Handle both old and new format in cache
            let calories, protein, carbs, fats;
            if (cachedProduct.nutrition?.per100g) {
                // New format
                const nutrition = cachedProduct.nutrition.per100g;
                calories = nutrition.calories || 0;
                protein = nutrition.protein || 0;
                carbs = nutrition.carbs || 0;
                fats = nutrition.fats || 0;
            } else {
                // Old format (backward compatibility)
                calories = cachedProduct.calories || 0;
                protein = cachedProduct.protein || 0;
                carbs = cachedProduct.carbs || 0;
                fats = cachedProduct.fats || 0;
            }
            
            product.value = {
                name: cachedProduct.name || 'Unknown Product',
                calories,
                protein,
                carbs,
                fats,
                healthScore: cachedProduct.healthScore || 5,
                ingredients: cachedProduct.ingredients || [],
                barcode: cachedProduct.barcode || barcode,
                source: cachedProduct.source || 'Cache',
                brand: cachedProduct.brand || null,
                image: cachedProduct.image || null,
                servingSize: cachedProduct.servingSize || null,
                servingUnit: cachedProduct.servingUnit || null,
                packageSize: cachedProduct.packageSize || null,
                nutritionPer100g: cachedProduct.nutritionPer100g || null,
                nutritionPerServing: cachedProduct.nutritionPerServing || null
            };
            editedProduct.value = { ...product.value };
            return;
        }

        // If not cached, fetch from API
        console.log('Fetching product data from API for barcode:', barcode);
        const response = await fetch(`https://kaloriq-api.vercel.app/api/product/${barcode}`);
        
        if (!response.ok) {
            throw new Error(`KaloriQ API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success || !data.product) {
            throw new Error('Product not found in KaloriQ API');
        }

        // Map new API response format to internal format
        const nutrition = data.product.nutrition?.perServing || data.product.nutrition?.per100g || {};
        const productData = {
            name: data.product.name || 'Unknown Product',
            calories: nutrition.calories || 0,
            protein: nutrition.protein || 0,
            carbs: nutrition.carbs || 0,
            fats: nutrition.fats || 0,
            fiber: nutrition.fiber || 0,
            sugar: nutrition.sugar || 0,
            salt: nutrition.salt || 0,
            healthScore: data.product.healthScore || 5,
            ingredients: data.product.ingredients || [],
            barcode: data.product.barcode || barcode,
            source: data.product.source || 'KaloriQ',
            brand: data.product.brand || null,
            image: data.product.image || null,
            servingSize: data.product.servingSize || null,
            servingUnit: data.product.servingUnit || null,
            packageSize: data.product.packageSize || null,
            // Store both nutrition formats for potential future use
            nutritionPer100g: data.product.nutrition?.per100g || null,
            nutritionPerServing: data.product.nutrition?.perServing || null
        };

        product.value = productData;

        // Cache the product data
        await BarcodeCache.set(barcode, productData);

        // Initialize edited product for fix modal
        editedProduct.value = { ...product.value };
        
    } catch (e) {
        console.error('KaloriQ API failed:', e);
        
        // Fallback: Create unknown product
        product.value = {
            name: 'Unknown Product',
            image: null,
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            fiber: 0,
            sugar: 0,
            salt: 0,
            healthScore: 5,
            ingredients: [],
            barcode: barcode,
            source: 'Manual',
            brand: null,
            servingSize: null,
            servingUnit: null,
            packageSize: null
        };
        editedProduct.value = { ...product.value };
    }
};

// Initialize product data
onMounted(() => {
    if (route.query.barcode) {
        fetchProduct(route.query.barcode);
    } else if (route.query.foodData) {
        // Handle food scan data
        try {
            const foodData = JSON.parse(route.query.foodData);
            
            // Check if it's multiple foods (dish analysis) or single food
            if (foodData.foods && foodData.foods.length > 0) {
                // Use total values for multiple foods
                const total = foodData.total || {};
                const firstFood = foodData.foods[0] || {};
                
                product.value = {
                    name: foodData.foods.length > 1 
                        ? `Gericht mit ${foodData.foods.length} Zutaten`
                        : firstFood.name || 'Analysiertes Gericht',
                    image: route.query.photo,
                    calories: total.calories || firstFood.calories || 0,
                    protein: total.protein || firstFood.protein || 0,
                    carbs: total.carbs || firstFood.carbs || 0,
                    fats: total.fat || firstFood.fats || firstFood.fat || 0,
                    fiber: total.fiber || firstFood.fiber || 0,
                    sugar: total.sugar || firstFood.sugar || 0,
                    salt: total.salt || firstFood.salt || 0,
                    healthScore: foodData.healthScore || 7,
                    ingredients: foodData.foods.map(f => `${f.name} (${f.amount || 'ca. 100g'})`),
                    type: 'food',
                    confidence: foodData.confidence || 'medium',
                    notes: foodData.notes || '',
                    foods: foodData.foods, // Store individual foods for detailed view
                    analysisError: foodData.error || false
                };
            } else {
                // Fallback for old format
                product.value = {
                    name: foodData.name || 'Analysiertes Gericht',
                    image: route.query.photo,
                    calories: foodData.calories || 0,
                    protein: foodData.protein || 0,
                    carbs: foodData.carbs || 0,
                    fats: foodData.fats || 0,
                    fiber: foodData.fiber || 0,
                    sugar: foodData.sugar || 0,
                    salt: foodData.salt || 0,
                    healthScore: foodData.healthScore || 7,
                    ingredients: foodData.ingredients || [],
                    type: 'food'
                };
            }
            
            editedProduct.value = { ...product.value };
        } catch (e) {
            console.error('Error parsing food data:', e);
            
            // Create fallback product
            product.value = {
                name: 'Analysiertes Gericht',
                image: route.query.photo,
                calories: 0,
                protein: 0,
                carbs: 0,
                fats: 0,
                fiber: 0,
                sugar: 0,
                salt: 0,
                healthScore: 5,
                ingredients: [],
                type: 'food',
                analysisError: true
            };
            editedProduct.value = { ...product.value };
        }
    }
});

const backgroundStyle = computed(() => {
    const img = route.query.photo || (product.value && product.value.image);
    return img
        ? {
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${img}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '340px',
            position: 'relative',
            zIndex: 1,
        }
        : {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '340px',
            borderBottomLeftRadius: '32px',
            borderBottomRightRadius: '32px',
            position: 'relative',
            zIndex: 1,
        };
});

const hasAdditionalNutrition = computed(() => {
    return product.value && (
        (product.value.fiber && product.value.fiber > 0) ||
        (product.value.sugar && product.value.sugar > 0) ||
        (product.value.salt && product.value.salt > 0)
    );
});
// /        borderBottomLeftRadius: '32px',
//    borderBottomRightRadius: '32px',
// Amount controls
function increaseAmount() {
    amount.value += 1;
}

function decreaseAmount() {
    if (amount.value > 1) {
        amount.value -= 1;
    }
}

// Fix modal functions
function editMacro(type) {
    showFixModal.value = true;
}

function applyFix() {
    product.value = { ...editedProduct.value };
    showFixModal.value = false;
}

// Save and return function
async function saveAndReturn() {
    if (!product.value) return;

    try {
        // Create new scan entry
        const scanEntry = {
            id: Date.now(),
            type: product.value.type === 'food' ? 'food' : 'barcode',
            timestamp: new Date().toISOString(),
            time: time,
            image: route.query.photo || product.value.image,
            data: product.value.type === 'food' ? {
                // Food scan format
                total: {
                    calories: Math.round(product.value.calories * amount.value),
                    protein: Math.round(product.value.protein * amount.value),
                    carbs: Math.round(product.value.carbs * amount.value),
                    fat: Math.round(product.value.fats * amount.value)
                },
                foods: [{
                    name: product.value.name,
                    calories: Math.round(product.value.calories * amount.value),
                    protein: Math.round(product.value.protein * amount.value),
                    carbs: Math.round(product.value.carbs * amount.value),
                    fats: Math.round(product.value.fats * amount.value)
                }]
            } : {
                // Barcode scan format  
                product_name: product.value.name,
                nutriments: {
                    energy_kcal_100g: Math.round(product.value.calories * amount.value),
                    proteins_100g: Math.round(product.value.protein * amount.value),
                    carbohydrates_100g: Math.round(product.value.carbs * amount.value),
                    fat_100g: Math.round(product.value.fats * amount.value)
                }
            }
        };

        // Save to scan history using Capacitor Preferences
        await ScanHistory.add(scanEntry);

        // Update streak when food is logged
        await StreakManager.updateStreak();

        // Update widget data for iOS widgets
        await WidgetDataManager.updateWidgetData();

        // Dispatch event to update home view
        window.dispatchEvent(new CustomEvent('scanHistoryUpdated'));

        router.push({ path: '/' });

    } catch (error) {
        console.error('Error saving scan data:', error);
        // Still navigate back even if save fails
        router.push({ path: '/' });
    }
}
</script>

<style scoped>
/* Statusbar Space for iOS */
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

.nutrition-image-wrap {
    position: relative;
    width: 100%;
    height: 280px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    overflow: hidden;
    z-index: 1;
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

/* Time, Name, Amount */
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

.amount-number {
    font-size: 16px;
    font-weight: 600;
    min-width: 24px;
    text-align: center;
    color: #333;
}

/* Macros Grid */
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

/* Health Score */
.nutrition-health {
    background: #f8f9fa;
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
}

/* Additional Nutrition */
.nutrition-additional {
    margin-bottom: 24px;
}

.nutrition-additional h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #1a1a1a;
}

.additional-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
}

.additional-item {
    background: #f8f9fa;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 60px;
}

.additional-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.additional-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.additional-label {
    color: #666;
    font-size: 12px;
    font-weight: 500;
    margin: 0;
}

.additional-value {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
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

/* Ingredients */
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

/* Food breakdown */
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

/* Analysis info */
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

.confidence-badge.hoch {
    background: #d1fae5;
    color: #065f46;
}

.confidence-badge.medium {
    background: #fef3c7;
    color: #92400e;
}

.confidence-badge.niedrig,
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

.analysis-error {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px;
    background: #fee2e2;
    border-radius: 12px;
    border-left: 4px solid #dc2626;
}

.error-icon {
    flex-shrink: 0;
    font-size: 16px;
}

.error-text {
    font-size: 14px;
    color: #991b1b;
    line-height: 1.4;
}

/* Actions */
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

/* Modal Styles */
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

/* Loading State */
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
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Responsive Design */
@media (max-width: 390px) {
    .nutrition-image-wrap {
        height: 220px;
    }

    .nutrition-content {
        padding: 20px 16px 0 16px;
    }

    .nutrition-macros {
        gap: 12px;
    }

    .macro {
        padding: 16px 12px;
        min-height: 70px;
    }

    .macro-value {
        font-size: 18px;
    }

    .nutrition-actions {
        margin-bottom: 24px;
    }

    .additional-grid {
        grid-template-columns: 1fr;
        gap: 8px;
    }

    .additional-item {
        padding: 12px;
        min-height: 50px;
    }

    .additional-value {
        font-size: 14px;
    }
}

@media (max-width: 360px) {
    .nutrition-name {
        font-size: 22px;
    }

    .amount-btn {
        width: 36px;
        height: 36px;
        font-size: 18px;
    }

    .macro-value {
        font-size: 16px;
    }

    .nutrition-brand {
        font-size: 14px;
    }

    .nutrition-serving {
        font-size: 12px;
    }
}

/* Details Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
}

.details-modal {
    background: #1a1a1a;
    border-radius: 24px;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 24px 0;
    border-bottom: 1px solid #333;
    margin-bottom: 20px;
}

.details-header h3 {
    color: #00ff8c;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    color: #999;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background: #333;
    color: #fff;
}

.details-content {
    max-height: calc(80vh - 100px);
    overflow-y: auto;
    padding: 0 24px 24px;
}

.details-section {
    margin-bottom: 32px;
}

.details-section h4 {
    color: #00ff8c;
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 16px 0;
    border-bottom: 1px solid #333;
    padding-bottom: 8px;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
}

.detail-item {
    background: #2a2a2a;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.detail-label {
    color: #999;
    font-size: 14px;
    font-weight: 500;
}

.detail-value {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
}

.product-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.product-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #2a2a2a;
    border-radius: 12px;
}

@media (max-width: 768px) {
    .modal-overlay {
        padding: 10px;
    }
    
    .details-modal {
        max-height: 90vh;
    }
    
    .details-grid {
        grid-template-columns: 1fr;
    }
    
    .details-header {
        padding: 20px 20px 0;
    }
    
    .details-content {
        padding: 0 20px 20px;
    }
}
</style>
