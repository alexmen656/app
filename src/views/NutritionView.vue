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
                        <button class="nutrition-menu">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 12H12.01M12 6H12.01M12 18H12.01" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="nutrition-content">
                <div class="nutrition-time">{{ time }}</div>
                <div class="product-header">
                    <h1 class="nutrition-name">{{ product.name }}</h1>
                    <!--<div v-if="product.brand" class="nutrition-brand">{{ product.brand }}</div>
                    <div v-if="product.servingSize && product.servingUnit" class="nutrition-serving">
                        Serving: {{ product.servingSize }} {{ product.servingUnit }}
                    </div>-->
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
                            <div class="macro-label">Calories</div>
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
                            <div class="macro-label">Protein</div>
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
                            <div class="macro-label">Carbs</div>
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
                            <div class="macro-label">Fat</div>
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
                <div class="nutrition-health">
                    <div class="health-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#22c55e">
                            <path
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                    <div class="health-info">
                        <div class="health-label">Health Score</div>
                        <div class="health-score">{{ product.healthScore }}/10</div>
                    </div>
                    <div class="health-bar">
                        <div class="health-bar-inner" :style="{ width: (product.healthScore * 10) + '%' }"></div>
                    </div>
                </div>
                <div class="nutrition-ingredients" v-if="product.ingredients && product.ingredients.length > 0">
                    <h3>Ingredients</h3>
                    <div class="ingredient-text">{{ product.ingredients.join(', ') }}</div>
                </div>
                <div class="nutrition-actions">
                    <button class="fix-btn" @click="showFixModal = true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        Fix Results
                    </button>
                    <button class="done-btn" @click="saveAndReturn">Done</button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-else class="nutrition-loading">
            <div class="loading-spinner"></div>
            <span>Loading...</span>
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

const route = useRoute();
const router = useRouter();
const product = ref(null);
const amount = ref(1);
const showFixModal = ref(false);
const editedProduct = ref({});
const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const fetchProduct = async (barcode) => {
    try {
        // Use KaloriQ API as primary source
        const response = await fetch(`https://kaloriq-api.vercel.app/api/product/${barcode}`);
        
        if (!response.ok) {
            throw new Error(`KaloriQ API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success || !data.product) {
            throw new Error('Product not found in KaloriQ API');
        }

        // KaloriQ API already provides data in the correct format
        product.value = {
            ...data.product,
            // Ensure all required fields are present
            name: data.product.name || 'Unknown Product',
            calories: data.product.calories || 0,
            protein: data.product.protein || 0,
            carbs: data.product.carbs || 0,
            fats: data.product.fats || 0,
            healthScore: data.product.healthScore || 5,
            ingredients: data.product.ingredients || [],
            barcode: data.product.barcode || barcode,
            source: data.product.source || 'KaloriQ',
            brand: data.product.brand || null,
            image: data.product.image || null
        };

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
            healthScore: 5,
            ingredients: [],
            barcode: barcode,
            source: 'Manual',
            brand: null
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
            product.value = {
                name: foodData.name || 'Scanned Food',
                image: route.query.photo,
                calories: foodData.calories || 0,
                protein: foodData.protein || 0,
                carbs: foodData.carbs || 0,
                fats: foodData.fats || 0,
                healthScore: foodData.healthScore || 7,
                ingredients: foodData.ingredients || [],
                type: 'food'
            };
            editedProduct.value = { ...product.value };
        } catch (e) {
            console.error('Error parsing food data:', e);
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
function saveAndReturn() {
    if (!product.value) return;

    try {
        // Get existing scan history
        const existingHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');

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

        // Add to beginning of history
        existingHistory.unshift(scanEntry);

        // Keep only last 20 items
        const updatedHistory = existingHistory.slice(0, 20);

        // Save to localStorage
        localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));

        // Dispatch storage event to update other components
        window.dispatchEvent(new Event('storage'));

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
    padding: 16px 16px 0 16px;
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
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 16px;
}

.nutrition-name {
    font-size: 26px;
    font-weight: 700;
    margin: 0;
    word-break: break-word;
    color: #1a1a1a;
    flex: 1;
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
}
</style>
