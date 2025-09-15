<template>
    <div>
        <div v-if="product" class="nutrition-container" 
             @touchstart="handleTouchStart" 
             @touchmove="handleTouchMove" 
             @touchend="handleTouchEnd">
            <div class="nutrition-header">
                <div class="nutrition-image-wrap" :style="backgroundStyle" @dblclick="showImagePreview">
                    <div class="statusbar-spacer"></div>
                    <div class="header-controls">
                        <button class="nutrition-back" @click="$router.go(-1)">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </button>
                        <div class="header-actions">
                            <button class="nutrition-share" @click="shareNutrition" :disabled="isSharing">
                                <!-- <svg v-if="!isSharing" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" stroke="currentColor" stroke-width="2"/>
                                </svg>
                                <svg v-if="!isSharing" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M448 256C501 256 544 213 544 160C544 107 501 64 448 64C395 64 352 107 352 160C352 165.4 352.5 170.8 353.3 176L223.6 248.1C206.7 233.1 184.4 224 160 224C107 224 64 267 64 320C64 373 107 416 160 416C184.4 416 206.6 406.9 223.6 391.9L353.3 464C352.4 469.2 352 474.5 352 480C352 533 395 576 448 576C501 576 544 533 544 480C544 427 501 384 448 384C423.6 384 401.4 393.1 384.4 408.1L254.7 336C255.6 330.8 256 325.5 256 320C256 314.5 255.5 309.2 254.7 304L384.4 231.9C401.3 246.9 423.6 256 448 256z"/></svg>
                                -->
                                <svg v-if="!isSharing" width="24" height="24" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" class="feather feather-share-2">
                                    <circle cx="18" cy="5" r="3"></circle>
                                    <circle cx="6" cy="12" r="3"></circle>
                                    <circle cx="18" cy="19" r="3"></circle>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                </svg>
                                <div v-else class="share-spinner"></div>
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
            </div>
            <div class="nutrition-content" :style="{ 
                transform: `translateY(${pullDistance * 0.2}px)`, 
                transition: isPulling ? 'none' : 'transform 0.3s ease-out',
                borderRadius: '35px 35px 0 0',
                marginTop: '-32px',
                position: 'relative',
                zIndex: 2
            }">
                <div class="nutrition-time">{{ time }}</div>
                <div class="product-header">
                    <div class="product-info">
                        <h1 class="nutrition-name">{{ capitalizeIfLetter(getLocalizedName(product)) }}</h1>
                        <!--<div v-if="product.brand" class="nutrition-brand">{{ product.brand }}</div>-->
                        <div v-if="product.servingSize && product.servingUnit" class="nutrition-serving">
                            {{ $t('nutrition.serving') }}: {{ product.servingSize }}{{ product.servingUnit }}
                            <!--<span v-if="product.packageSize" class="package-size">({{ product.packageSize }})</span>-->
                        </div>
                    </div>
                    <div class="nutrition-amount">
                        <button class="amount-btn minus" @click="decreaseAmount">−</button>
                        <input v-model.number="amount" class="amount-input" type="number" step="0.1" min="0.1"
                            @blur="validateAmount" />
                        <button class="amount-btn plus" @click="increaseAmount">+</button>
                    </div>
                </div>
                <div class="nutrition-macros">
                    <div class="macro calories">
                        <div class="macro-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="#ff6b35">
                                <path
                                    d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
                            </svg>
                        </div>
                        <div class="macro-info">
                            <div class="macro-label">{{ $t('nutrition.calories') }}</div>
                            <div class="macro-value">{{ Math.round(product.calories * amount) }}</div>
                            <button class="macro-edit" @click="editMacro('calories')">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
                            <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path fill="#ff6b6b"
                                    d="M224 329.2C224 337.7 220.6 345.8 214.6 351.8L187.8 378.6C175.5 390.9 155.3 390 138.4 385.8C133.8 384.7 128.9 384 123.9 384C90.8 384 63.9 410.9 63.9 444C63.9 477.1 90.8 504 123.9 504C130.2 504 135.9 509.7 135.9 516C135.9 549.1 162.8 576 195.9 576C229 576 255.9 549.1 255.9 516C255.9 511 255.3 506.2 254.1 501.5C249.9 484.6 248.9 464.4 261.3 452.1L288.1 425.3C294.1 419.3 302.2 415.9 310.7 415.9L399.9 415.9C406.2 415.9 412.3 415.6 418.4 414.9C430.3 413.7 434.8 399.4 429.2 388.9C420.7 373.1 415.9 355.1 415.9 335.9C415.9 274 466 223.9 527.9 223.9C535.9 223.9 543.6 224.7 551.1 226.3C562.8 228.8 575.2 220.4 573.1 208.7C558.4 126.4 486.4 63.9 399.9 63.9C302.7 63.9 223.9 142.7 223.9 239.9L223.9 329.1z" />
                            </svg>
                        </div>
                        <div class="macro-info">
                            <div class="macro-label">{{ $t('nutrition.protein') }}</div>
                            <div class="macro-value">{{ Math.round(product.protein * amount) }}g</div>
                            <button class="macro-edit" @click="editMacro('protein')">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
                            <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path fill="#ffa726"
                                    d="M79.7 234.6c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0L134.1 444.3 49.4 529c-9.4 9.4-24.5 9.4-33.9 0-9.4-9.4-9.4-24.6 0-33.9l84.7-84.7-30.5-30.5c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zm104-104c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zM495.2 15c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.2L529.2 49 414.7 163.4c7.7 1 15.2 3 22.5 5.9L495.5 111c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-52.7 52.7 39 39c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1c6.2-4.1 14.7-3.4 20.1 2.1l39 39 52.7-52.7c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-58.3 58.3c2.8 7.1 4.7 14.5 5.7 22.1L495.2 15z" />
                            </svg>
                        </div>
                        <div class="macro-info">
                            <div class="macro-label">{{ $t('nutrition.carbs') }}</div>
                            <div class="macro-value">{{ Math.round(product.carbs * amount) }}g</div>
                            <button class="macro-edit" @click="editMacro('carbs')">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
                            <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path fill="#42a5f5"
                                    d="M240 64C240 46.3 254.3 32 272 32L368 32C385.7 32 400 46.3 400 64C400 81.7 385.7 96 368 96L368 199.3C432.9 219.7 480 280.3 480 352L480 544C480 579.3 451.3 608 416 608L224 608C188.7 608 160 579.3 160 544L160 352C160 280.4 207.1 219.7 272 199.3L272 96C254.3 96 240 81.7 240 64zM320 480C355.3 480 384 447.6 384 416C384 394.8 355.1 351.5 336.1 325.4C328 314.3 311.9 314.3 303.8 325.4C284.8 351.5 255.9 394.8 255.9 416C255.9 447.6 284.6 480 319.9 480z" />
                            </svg>
                        </div>
                        <div class="macro-info">
                            <div class="macro-label">{{ $t('nutrition.fat') }}</div>
                            <div class="macro-value">{{ Math.round(product.fats * amount) }}g</div>
                            <button class="macro-edit" @click="editMacro('fats')">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
                                    <path
                                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
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
                        <!--<div class="health-label">{{ $t('nutrition.healthScore') }}</div>-->
                        <div class="health-score">{{ product.healthScore }}/10</div>
                    </div>
                    <div class="health-bar">
                        <div class="health-bar-inner" :style="{ width: (product.healthScore * 10) + '%' }"></div>
                    </div>
                </div>
                <div class="nutrition-ingredients"
                    v-if="(product.type === 'barcode' || product.type === 'label') && product.ingredients && product.ingredients.length > 0">
                    <h3>{{ $t('nutrition.ingredients') }}</h3>
                    <div class="ingredient-text">{{ product.ingredients.join(', ') }}</div>
                </div>

                <!-- Detailed food breakdown for analyzed dishes -->
                <div class="nutrition-foods" v-if="product.foods && product.foods.length > 1">
                    <h3>{{ $t('nutrition.detectedIngredients') }}</h3>
                    <div class="foods-list">
                        <div v-for="food in product.foods" :key="food.name" class="food-item">
                            <div class="food-name">{{ getLocalizedName(food) }}</div>
                            <div class="food-amount" v-if="food.amount">{{ getLocalizedAmount(food) }}</div>
                            <div class="food-macros">
                                <span class="food-macro">{{ Math.round(food.calories * amount) }} kcal</span>
                                <span class="food-macro">P: {{ Math.round(food.protein * amount) }}g</span>
                                <span class="food-macro">K: {{ Math.round(food.carbs * amount) }}g</span>
                                <span class="food-macro">F: {{ Math.round((food.fat || food.fats) * amount) }}g</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Analysis confidence and notes for food and manual entries -->
                <div class="nutrition-analysis"
                    v-if="(product.type === 'food' || product.type === 'manual') && (product.confidence || product.notes)">
                    <div class="analysis-confidence" v-if="product.confidence">
                        <div class="confidence-label">{{ $t('nutrition.analysisConfidence') }}</div>
                        <div class="confidence-badge" :class="product.confidence">
                            {{ product.confidence === 'hoch' ? $t('nutrition.high') : product.confidence === 'medium' ?
                                $t('nutrition.medium') : $t('nutrition.low') }}
                        </div>
                    </div>
                    <div class="analysis-notes" v-if="product.notes">
                        <div class="notes-label">{{ $t('nutrition.notes') }}</div>
                        <div class="notes-text">{{ getLocalizedNotes(product) }}</div>
                    </div>
                    <div class="analysis-error" v-if="product.analysisError">
                        <div class="error-icon">⚠️</div>
                        <div class="error-text">{{ $t('nutrition.analysisError') }}</div>
                    </div>
                    <!-- Original description for manual entries -->
                    <div class="original-description" v-if="product.type === 'manual' && product.originalText">
                        <div class="description-label">{{ $t('nutrition.originalDescription') }}:</div>
                        <div class="description-text">{{ product.originalText }}</div>
                    </div>
                </div>

                <!-- Source Information -->
                <div class="nutrition-source">
                    <span class="source-text">{{ $t('nutrition.source') }}: </span>
                    <button class="source-link" @click="showSourceModal = true">
                        {{ getSourceDisplay(product.source || product.type) }}
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
        <NutritionDetailsModal :show="showDetailsModal" :product="product" :amount="amount"
            @close="showDetailsModal = false" />

        <!-- Fix Modal -->
        <div v-if="showFixModal" class="modal-overlay" @click="showFixModal = false">
            <div class="modal fix-modal" @click.stop>
                <h3>{{ $t('nutrition.fixResults') }}</h3>

                <!-- Basic nutrition editing -->
                <div class="fix-form">
                    <div class="form-group">
                        <label>{{ $t('nutrition.productName') }}</label>
                        <input v-model="editedProductName" type="text">
                    </div>
                    <div class="form-group">
                        <label>{{ $t('nutrition.calories') }}</label>
                        <input v-model.number="editedProduct.calories" type="number">
                    </div>
                    <div class="form-group">
                        <label>{{ $t('nutrition.protein') }} (g)</label>
                        <input v-model.number="editedProduct.protein" type="number" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>{{ $t('nutrition.carbs') }} (g)</label>
                        <input v-model.number="editedProduct.carbs" type="number" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>{{ $t('nutrition.fat') }} (g)</label>
                        <input v-model.number="editedProduct.fats" type="number" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>{{ $t('nutrition.fiber') }} (g)</label>
                        <input v-model.number="editedProduct.fiber" type="number" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>{{ $t('nutrition.sugar') }} (g)</label>
                        <input v-model.number="editedProduct.sugar" type="number" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>{{ $t('nutrition.salt') }} (g)</label>
                        <input v-model.number="editedProduct.salt" type="number" step="0.01">
                    </div>
                </div>

                <!-- Foods editing for analyzed dishes -->
                <div v-if="editedProduct.foods && editedProduct.foods.length > 0" class="foods-editing">
                    <h4>{{ $t('nutrition.detectedFoods') }}</h4>
                    <div class="foods-list-edit">
                        <div v-for="(food, index) in editedProduct.foods" :key="index" class="food-edit-item">
                            <div class="food-edit-content">
                                <input :value="getLocalizedName(food)"
                                    @input="updateFoodName(index, $event.target.value)" class="food-name-input"
                                    :placeholder="$t('nutrition.foodName')">
                                <input :value="getLocalizedAmount(food)"
                                    @input="updateFoodAmount(index, $event.target.value)" class="food-amount-input"
                                    :placeholder="$t('nutrition.amount')">
                            </div>
                            <button class="remove-food-btn" @click="removeFood(index)">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button class="add-food-btn" @click="addFood">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
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
                    <div v-if="product.source === 'OpenFoodFacts'">
                        <h4>Open Food Facts</h4>
                        <p>{{ $t('nutrition.sourceExplanation.openFoodFacts') }}</p>
                        <div class="source-link-container">
                            <a href="https://world.openfoodfacts.org" target="_blank" class="external-link">
                                {{ $t('nutrition.visitOpenFoodFacts') }}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <polyline points="15,3 21,3 21,9" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                    <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div
                        v-else-if="product.source === 'KaloriQ' || product.source === 'Cache' || product.source === 'API'">
                        <h4>{{ $t('nutrition.database') }}</h4>
                        <p>{{ $t('nutrition.sourceExplanation.database') }}</p>
                    </div>
                    <div v-else-if="product.type === 'food' || product.source === 'AI'">
                        <h4>{{ $t('nutrition.aiAnalysis') }}</h4>
                        <p>{{ $t('nutrition.sourceExplanation.ai') }}</p>
                        <div class="accuracy-warning">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b">
                                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                                <path d="M12 8v4M12 16h.01" stroke="#fff" stroke-width="2" stroke-linecap="round" />
                            </svg>
                            <span>{{ $t('nutrition.accuracyWarning') }}</span>
                        </div>
                    </div>
                    <div v-else-if="product.type === 'manual' || product.source === 'manual'">
                        <h4>{{ $t('nutrition.manualEntry') }}</h4>
                        <p>{{ $t('nutrition.sourceExplanation.manual') }}</p>
                        <div class="accuracy-warning">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b">
                                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                                <path d="M12 8v4M12 16h.01" stroke="#fff" stroke-width="2" stroke-linecap="round" />
                            </svg>
                            <span>{{ $t('nutrition.aiAccuracyWarning') }}</span>
                        </div>
                    </div>
                    <div v-else>
                        <h4>{{ $t('nutrition.unknownSource') }}</h4>
                        <p>{{ $t('nutrition.sourceExplanation.unknown') }}</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="done-btn" @click="showSourceModal = false">{{ $t('common.understood') }}</button>
                </div>
            </div>
        </div>

        <!-- Image Preview Modal -->
        <div v-if="showImageModal" class="modal-overlay image-preview-overlay" @click="showImageModal = false">
            <div class="image-preview-modal" @click.stop>
                <div class="image-preview-header">
                    <button class="image-preview-close" @click="showImageModal = false">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" />
                        </svg>
                    </button>
                </div>
                <div class="image-preview-content">
                    <img v-if="productImage" :src="productImage" alt="Food image" class="preview-image" />
                    <div v-else class="no-image-placeholder">
                        <div class="no-image-icon">📷</div>
                        <p>{{ $t('nutrition.noImageAvailable') || 'No image available' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { BarcodeCache, ScanHistory } from '../utils/storage';
import { WidgetDataManager, StreakManager } from '../utils/widgetData';
import { getLocalizedName, getLocalizedNotes, getLocalizedAmount, capitalizeIfLetter } from '../utils/localization';
import { getCurrentLanguage } from '../i18n';
import NutritionDetailsModal from '../components/NutritionDetailsModal.vue';
import { analyticsActions } from '../stores/analyticsStore';
import { shareNutrition as shareNutritionUtil } from '../utils/nutritionShare';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const product = ref(null);
const amount = ref(1.0);
const showFixModal = ref(false);
const showDetailsModal = ref(false);
const showSourceModal = ref(false);
const showImageModal = ref(false);
const editedProduct = ref({});
const isLoading = ref(true);
const isSharing = ref(false);

// Touch handling for double-tap
const lastTap = ref(0);
const tapTimeout = ref(null);

// Pull-to-refresh / parallax effect
const pullDistance = ref(0);
const isPulling = ref(false);
const touchStartY = ref(0);

const time = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false });

// Computed property for editing the product name
const editedProductName = computed({
    get: () => getLocalizedName(editedProduct.value),
    set: (value) => {
        if (!editedProduct.value.names) {
            editedProduct.value.names = {};
        }
        const currentLanguage = getCurrentLanguage();
        editedProduct.value.names[currentLanguage] = value;
    }
});

const fetchProduct = async (barcode) => {
    try {
        // First check cache
        const cachedProduct = await BarcodeCache.get(barcode);
        if (cachedProduct) {
            console.log('Using cached product data for barcode:', barcode);

            let calories, protein, carbs, fats;
            if (cachedProduct.nutrition?.per100g) {
                const nutrition = cachedProduct.nutrition.per100g;
                calories = nutrition.calories || 0;
                protein = nutrition.protein || 0;
                carbs = nutrition.carbs || 0;
                fats = nutrition.fats || 0;
            } else {
                calories = cachedProduct.calories || 0;
                protein = cachedProduct.protein || 0;
                carbs = cachedProduct.carbs || 0;
                fats = cachedProduct.fats || 0;
            }

            product.value = {
                names: cachedProduct.names || { de: cachedProduct.name || 'Unbekanntes Produkt', en: cachedProduct.name || 'Unknown Product', es: cachedProduct.name || 'Unknown Product' },
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

        console.log('Fetching product data from API for barcode:', barcode);
        const response = await fetch(`https://api.kalbuddy.com/api/product/${barcode}`);

        if (!response.ok) {
            throw new Error(`KaloriQ API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.product) {
            throw new Error('Product not found in KaloriQ API');
        }

        const nutrition = data.product.nutrition?.perServing || data.product.nutrition?.per100g || {};
        const productData = {
            names: data.product.names || { de: data.product.name || 'Unbekanntes Produkt', en: data.product.name || 'Unknown Product', es: data.product.name || 'Unknown Product' },
            image: data.product.image || null,
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
            nutritionPer100g: data.product.nutrition?.per100g || null,
            nutritionPerServing: data.product.nutrition?.perServing || null
        };

        product.value = productData;
        await BarcodeCache.set(barcode, productData);
        editedProduct.value = { ...product.value };

    } catch (e) {
        console.error('KaloriQ API failed:', e);

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

onMounted(async () => {
    if (route.query.barcode) {
        fetchProduct(route.query.barcode);
    } else if (route.query.foodData) {
        try {
            const foodData = JSON.parse(route.query.foodData);
            console.log('🔍 DEBUG: Received foodData:', foodData);

            if (foodData.foods && foodData.foods.length > 0) {
                const total = foodData.total || {};
                const firstFood = foodData.foods[0] || {};

                product.value = {
                    names: foodData.names || { de: foodData.name || 'Unbekanntes Essen', en: foodData.name_en || 'Unknown Food' },
                    image: route.query.photo,
                    calories: total.calories || 0,
                    protein: total.protein || 0,
                    carbs: total.carbs || 0,
                    fats: total.fat || 0,
                    fiber: total.fiber || 0,
                    sugar: total.sugar || 0,
                    salt: total.salt || 0,
                    healthScore: foodData.healthScore || 7,
                    ingredients: foodData.foods.map(f => `${getLocalizedName(f)} (${getLocalizedAmount(f) || 'ca. 100g'})`),
                    type: 'food',
                    confidence: foodData.confidence || 'medium',
                    notes: foodData.notes || { de: foodData.notes || '', en: foodData.notes_en || '' },
                    foods: foodData.foods,
                    analysisError: foodData.error || false
                };
            }

            console.log('🔍 DEBUG: Final product value:', product.value);
            editedProduct.value = { ...product.value };
        } catch (e) {
            console.error('Error parsing food data:', e);

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
    } else if (route.query.manualData) {
        try {
            const manualData = JSON.parse(route.query.manualData);
            console.log('🔍 DEBUG: Received manualData:', manualData);

            const total = manualData.total || {};

            product.value = {
                names: manualData.names || { de: manualData.name || 'Manueller Eintrag', en: manualData.name || 'Manual Entry', es: manualData.name || 'Entrada Manual' },
                image: route.query.photo,
                calories: total.calories || 0,
                protein: total.protein || 0,
                carbs: total.carbs || 0,
                fats: total.fat || 0,
                fiber: total.fiber || 0,
                sugar: total.sugar || 0,
                salt: total.salt || 0,
                healthScore: manualData.healthScore || 7,
                ingredients: manualData.foods ? manualData.foods.map(f => `${getLocalizedName(f)} (${getLocalizedAmount(f) || 'ca. 100g'})`) : [],
                type: 'manual',
                source: 'manual',
                confidence: manualData.confidence || 'medium',
                notes: manualData.notes || null,
                foods: manualData.foods || [],
                originalText: manualData.originalText || null,
                analysisError: manualData.error || false
            };

            console.log('🔍 DEBUG: Final manual product value:', product.value);
            editedProduct.value = { ...product.value };
        } catch (e) {
            console.error('Error parsing manual data:', e);

            product.value = {
                names: { de: 'Manueller Eintrag', en: 'Manual Entry', es: 'Entrada Manual' },
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
                type: 'manual',
                source: 'manual',
                analysisError: true
            };
            editedProduct.value = { ...product.value };
        }
    } else if (route.query.labelData) {
        try {
            const labelData = JSON.parse(route.query.labelData);
            const nutrition = labelData.nutrition || {};

            product.value = {
                names: labelData.names || { de: labelData.name || 'Gescanntes Label', en: labelData.name_en || 'Scanned Label' },
                image: route.query.photo,
                calories: nutrition.calories || 0,
                protein: nutrition.protein || 0,
                carbs: nutrition.carbs || 0,
                fats: nutrition.fat || 0,
                fiber: nutrition.fiber || 0,
                sugar: nutrition.sugar || 0,
                salt: nutrition.salt || 0,
                healthScore: 7,
                ingredients: labelData.ingredients || [],
                brand: labelData.brand || '',
                allergens: labelData.allergens || [],
                claims: labelData.claims || [],
                type: 'label',
                confidence: labelData.confidence || 'medium',
                notes: labelData.notes || { de: labelData.notes || '', en: labelData.notes_en || '' },
                analysisError: labelData.error || false
            };

            editedProduct.value = { ...product.value };
        } catch (e) {
            console.error('Error parsing label data:', e);

            product.value = {
                name: 'Scanned Label',
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
                type: 'label',
                analysisError: true
            };
            editedProduct.value = { ...product.value };
        }
    }

    // Prevent hover effects for a short time after loading
    setTimeout(() => {
        isLoading.value = false;
    }, 300);
});

const backgroundStyle = computed(() => {
    console.log("Background Styles", route.query.photo);
    const rawImg = route.query.photo || product.value?.image;

    const baseStyle = {
        width: '100%',
        height: `${360 + pullDistance.value * 0.8}px`, // Stretch height instead of translate
        position: 'relative',
        zIndex: 1,
        transition: isPulling.value ? 'none' : 'height 0.3s ease-out',
    };

    if (!rawImg) {
        return {
            ...baseStyle,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderBottomLeftRadius: '32px',
            borderBottomRightRadius: '32px',
        };
    }

    return {
        ...baseStyle,
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${rawImg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
});

const productImage = computed(() => {
    return route.query.photo || product.value?.image;
});

const hasAdditionalNutrition = computed(() => {
    return product.value && (
        (product.value.fiber && product.value.fiber > 0) ||
        (product.value.sugar && product.value.sugar > 0) ||
        (product.value.salt && product.value.salt > 0)
    );
});

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

// Share nutrition function with preview image
async function shareNutrition() {
    if (!product.value || isSharing.value) return;

    // Create nutrition data object for the shared utility
    const nutritionData = {
        calories: product.value.calories,
        protein: product.value.protein,
        carbs: product.value.carbs,
        fats: product.value.fats,
        image: route.query.photo || product.value?.image,
        name: product.value.name,
        name_en: product.value.name_en,
        names: product.value.names
    };

    await shareNutritionUtil(nutritionData, amount.value, (sharing) => {
        isSharing.value = sharing;
    });
}

function showImagePreview() {
    if (productImage.value) {
        showImageModal.value = true;
    }
}

function handleTouchStart(event) {
    // Prevent default to avoid interfering with other touch events
    const now = Date.now();
    const timeSinceLastTap = now - lastTap.value;

    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
        // Double tap detected
        event.preventDefault();
        if (tapTimeout.value) {
            clearTimeout(tapTimeout.value);
            tapTimeout.value = null;
        }
        showImagePreview();
        lastTap.value = 0; // Reset to prevent triple tap
    } else {
        lastTap.value = now;
    }
    
    // Start tracking for pull effect
    touchStartY.value = event.touches[0].clientY;
    isPulling.value = true;
}

function handleTouchMove(event) {
    if (!isPulling.value) return;
    
    const currentY = event.touches[0].clientY;
    const deltaY = currentY - touchStartY.value;
    
    // Only allow pulling down and when at the top of the page
    if (deltaY > 0 && window.scrollY === 0) {
        pullDistance.value = Math.min(deltaY * 0.7, 120); // Max 120px pull
        event.preventDefault();
    }
}

function handleTouchEnd(event) {
    // Set a timeout to reset the tap if no second tap occurs
    if (tapTimeout.value) {
        clearTimeout(tapTimeout.value);
    }

    tapTimeout.value = setTimeout(() => {
        lastTap.value = 0;
        tapTimeout.value = null;
    }, 300);
    
    // Reset pull effect
    isPulling.value = false;
    pullDistance.value = 0;
}

function getSourceDisplay(source) {
    const sourceMap = {
        'KaloriQ': 'Database',
        'Cache': 'Database',
        'food': 'AI',
        'AI': 'AI',
        'Manual': 'Manual',
        'manual': 'Manual',
        'OpenFoodFacts': 'Open Food Facts',
        'API': 'Database'
    };
    return sourceMap[source] || 'Database';
}

function removeFood(index) {
    editedProduct.value.foods.splice(index, 1);
    // Recalculate totals
    recalculateTotals();
}

function addFood() {
    if (!editedProduct.value.foods) {
        editedProduct.value.foods = [];
    }
    editedProduct.value.foods.push({
        names: { de: '', en: '' },
        amount: { de: '', en: '' },
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    });
}

function updateFoodName(index, value) {
    const food = editedProduct.value.foods[index];
    if (!food.names) {
        food.names = {};
    }
    const currentLanguage = getCurrentLanguage();
    food.names[currentLanguage] = value;
}

function updateFoodAmount(index, value) {
    const food = editedProduct.value.foods[index];
    if (!food.amount) {
        food.amount = {};
    }
    const currentLanguage = getCurrentLanguage();
    food.amount[currentLanguage] = value;
}

function recalculateTotals() {
    if (!editedProduct.value.foods) return;

    const totals = editedProduct.value.foods.reduce((acc, food) => {
        acc.calories += food.calories || 0;
        acc.protein += food.protein || 0;
        acc.carbs += food.carbs || 0;
        acc.fats += (food.fats || food.fat || 0);
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

    editedProduct.value.calories = totals.calories;
    editedProduct.value.protein = totals.protein;
    editedProduct.value.carbs = totals.carbs;
    editedProduct.value.fats = totals.fats;
}

function editMacro(type) {
    showFixModal.value = true;
}

function applyFix() {
    // If foods were edited, recalculate totals
    if (editedProduct.value.foods && editedProduct.value.foods.length > 0) {
        recalculateTotals();
    }
    product.value = { ...editedProduct.value };
    showFixModal.value = false;
}

async function saveAndReturn() {
    if (!product.value) return;

    try {
        // Create new scan entry
        const scanEntry = {
            id: Date.now(),
            type: product.value.type === 'food' ? 'food' : 'barcode',
            timestamp: new Date().toISOString(),
            time: time,
            image: (() => {
                const imageData = route.query.photo || product.value.image;
                if (!imageData) return imageData;
                // Ensure image has proper data URI prefix
                return typeof imageData === 'string' && imageData.startsWith('data:')
                    ? imageData
                    : `data:image/jpeg;base64,${imageData}`;
            })(),
            data: product.value.type === 'food' ? {
                // Food scan format
                total: {
                    calories: Math.round(product.value.calories * amount.value),
                    protein: Math.round(product.value.protein * amount.value),
                    carbs: Math.round(product.value.carbs * amount.value),
                    fat: Math.round(product.value.fats * amount.value)
                },
                foods: [{
                    names: product.value.names || { de: product.value.name || 'Unbekannt', en: product.value.name_en || 'Unknown' },
                    amount: { de: '1 Portion', en: '1 serving' },
                    calories: Math.round(product.value.calories * amount.value),
                    protein: Math.round(product.value.protein * amount.value),
                    carbs: Math.round(product.value.carbs * amount.value),
                    fat: Math.round(product.value.fats * amount.value)
                }]
            } : {
                // Barcode scan format  
                product_name: getLocalizedName(product.value),
                nutriments: {
                    energy_kcal_100g: Math.round(product.value.calories * amount.value),
                    proteins_100g: Math.round(product.value.protein * amount.value),
                    carbohydrates_100g: Math.round(product.value.carbs * amount.value),
                    fat_100g: Math.round(product.value.fats * amount.value)
                }
            }
        };

        await ScanHistory.add(scanEntry);
        await StreakManager.updateStreak();
        await WidgetDataManager.updateWidgetData();

        try {
            analyticsActions.loadAnalyticsData('day')
        } catch (error) {
            console.warn('Failed to preload analytics data:', error)
        }
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
.statusbar-spacer {
    height: env(safe-area-inset-top, 44px);
    width: 100%;
}

.nutrition-container {
    background: #fff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    /* Prevent hover effects on initial load */
    pointer-events: auto;
}

.nutrition-container.loading {
    pointer-events: none;
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

.header-actions {
    display: flex;
    gap: 8px;
    align-items: center;
}

.nutrition-back,
.nutrition-menu,
.nutrition-share {
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

.nutrition-share:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.nutrition-back:hover,
.nutrition-menu:hover,
.nutrition-share:hover:not(:disabled) {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
}

.share-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #333;
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

.nutrition-content {
    background: #fff;
    border-radius: 35px 35px 0 0;
    margin-top: -32px;
    padding: 14px 14px 0 14px;
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
    padding-left: 4px;
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
    line-height: 1.1;
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
    padding: 18px 14px;
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
    gap: 1px;
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
    padding: 5px;
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
    padding: 18px 14px;
    margin-bottom: 10px;
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
    margin-bottom: 10px;
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

.original-description {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e1e5e9;
}

.description-label {
    font-size: 14px;
    font-weight: 500;
    color: #666;
    margin-bottom: 6px;
}

.description-text {
    font-size: 14px;
    line-height: 1.4;
    color: #333;
    font-style: italic;
    background: #f8f9fa;
    padding: 8px 12px;
    border-radius: 8px;
    border-left: 3px solid #007aff;
}

/* Source Information */
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

/* Source Modal */
.source-modal {
    max-width: 360px;
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

.source-link-container {
    margin-top: 16px;
}

.external-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #007aff;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 12px;
    border: 1px solid #007aff;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.external-link:hover {
    background: #007aff;
    color: white;
}

.accuracy-warning {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fef3c7;
    border-radius: 12px;
    padding: 12px;
    margin-top: 16px;
    border-left: 4px solid #f59e0b;
}

.accuracy-warning span {
    font-size: 14px;
    font-weight: 500;
    color: #92400e;
}

/* Fix Modal Improvements */
.fix-modal {
    max-width: 500px;
    max-height: 90vh;
}

.foods-editing {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 2px solid #f0f0f0;
}

.foods-editing h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
}

.foods-list-edit {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

.food-edit-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 12px;
}

.food-edit-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.food-name-input,
.food-amount-input {
    background: #fff;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 14px;
    transition: border-color 0.2s ease;
}

.food-name-input:focus,
.food-amount-input:focus {
    outline: none;
    border-color: #007aff;
}

.remove-food-btn {
    background: #fee2e2;
    border: none;
    border-radius: 8px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #dc2626;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.remove-food-btn:hover {
    background: #fecaca;
}

.add-food-btn {
    background: #f0f9ff;
    border: 2px solid #e0f2fe;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #0369a1;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
}

.add-food-btn:hover {
    background: #e0f2fe;
    border-color: #0369a1;
}

.nutrition-actions {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    padding-bottom: env(safe-area-inset-bottom, 20px);
    position: sticky;
    bottom: 0;
    right: 0;
    left: 0;
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

    .nutrition-additional h3,
    .nutrition-ingredients h3,
    .nutrition-foods h3 {
        color: #fff;
    }

    .additional-item {
        background: #1c1c1e;
    }

    .additional-label {
        color: #8e8e93;
    }

    .additional-value {
        color: #fff;
    }

    .ingredient-text {
        background: #1c1c1e;
        color: #8e8e93;
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

    .analysis-error {
        background: #3a1a1a;
    }

    .description-label {
        color: #8e8e93;
    }

    .description-text {
        color: #fff;
        background: #2c2c2e;
        border-color: #007aff;
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

    /* Modal Dark Mode */
    .modal {
        background: #1c1c1e;
        color: #fff;
    }

    .modal h3,
    .foods-editing h4 {
        color: #fff;
    }

    .form-group label {
        color: #fff;
    }

    .form-group input,
    .food-name-input,
    .food-amount-input {
        background: #2c2c2e;
        border-color: #3a3a3c;
        color: #fff;
    }

    .form-group input:focus,
    .food-name-input:focus,
    .food-amount-input:focus {
        border-color: #007aff;
    }

    .food-edit-item {
        background: #2c2c2e;
    }

    .food-name-input,
    .food-amount-input {
        background: #1c1c1e;
    }

    .remove-food-btn {
        background: #3a1a1a;
        color: #ff6b6b;
    }

    .remove-food-btn:hover {
        background: #4a2020;
    }

    .add-food-btn {
        background: #1a2c3a;
        border-color: #2c3e50;
        color: #64b5f6;
    }

    .add-food-btn:hover {
        background: #2c3e50;
        border-color: #64b5f6;
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

    .external-link {
        color: #64b5f6;
        border-color: #64b5f6;
    }

    .external-link:hover {
        background: #64b5f6;
        color: #000;
    }

    .accuracy-warning {
        background: #3a2f1a;
        border-color: #f59e0b;
    }

    .accuracy-warning span {
        color: #fbbf24;
    }

    .nutrition-loading {
        color: #8e8e93;
    }

    .loading-spinner {
        border-color: #3a3a3c;
        border-top-color: #fff;
    }

    /* Header buttons dark mode */
    .nutrition-back,
    .nutrition-menu,
    .nutrition-share {
        background: rgba(28, 28, 30, 0.9);
        color: #fff;
    }

    .nutrition-back:hover,
    .nutrition-menu:hover,
    .nutrition-share:hover:not(:disabled) {
        background: rgba(28, 28, 30, 1);
    }

    .share-spinner {
        border-color: #3a3a3c;
        border-top-color: #fff;
    }
}

/* Image Preview Modal */
.image-preview-overlay {
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
}

.image-preview-modal {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    background: transparent;
    border-radius: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
}

.image-preview-header {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 10;
}

.image-preview-close {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
}

.image-preview-close:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
}

.image-preview-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.preview-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 12px;
}

.no-image-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: white;
    text-align: center;
}

.no-image-icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.7;
}

.no-image-placeholder p {
    font-size: 18px;
    opacity: 0.8;
    margin: 0;
}
</style>
