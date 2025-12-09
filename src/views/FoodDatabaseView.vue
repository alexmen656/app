<template>
    <div class="food-database-view">
        <header class="header">
            <button class="back-button" @click="goBack">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                </svg>
            </button>
            <h1 class="page-title">{{ $t('foodDatabase.title') }}</h1>
            <div class="header-spacer"></div>
        </header>
        <div class="search-section">
            <div class="search-input-container">
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input v-model="searchQuery" type="text" :placeholder="$t('foodDatabase.searchPlaceholder')"
                    class="search-input">
            </div>
        </div>
        <div class="categories-section">
            <h3 class="section-title">{{ $t('foodDatabase.categories') }}</h3>
            <div class="categories-grid">
                <button v-for="category in categories" :key="category.id" class="category-button"
                    :class="{ active: selectedCategory === category.id }" @click="selectCategory(category.id)">
                    <span class="category-icon">{{ category.icon }}</span>
                    <span class="category-name">{{ category.name || $t(`foodDatabase.categoryNames.${category.id}`)
                        }}</span>
                </button>
            </div>
        </div>
        <div class="food-items-section">
            <h3 class="section-title">
                {{ selectedCategory === 'all' ? $t('foodDatabase.allFoods') :
                    $t(`foodDatabase.categoryNames.${selectedCategory}`) }}
            </h3>
            <div class="food-grid">
                <div v-for="food in filteredFoods" :key="food.id" class="food-card" @click="selectFood(food)">
                    <div class="food-icon">
                        <img v-if="food.image && !food.image.includes('placeholder') && !food.image.startsWith('image_')"
                            :src="food.image" :alt="food.names?.[0]" />
                        <img v-else-if="food.image && food.image.startsWith('image_')" :src="getItemImageSrc(food)"
                            :alt="food.names?.[0]" />
                        <span v-else class="food-db-icon">{{ food.icon }}</span>
                    </div>
                    <div class="food-info">
                        <h4 class="food-name">{{ getLocalizedName({ names: food.names }) ||
                            $t(`foodDatabase.foods.${food.id}.name`) }}</h4>
                        <div class="food-calories">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff6b35">
                                <path
                                    d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
                            </svg>
                            <span>{{ food.calories }} kcal/{{ food.unit_name || $t(`foodDatabase.units.${food.unit}`)
                                }}</span>
                        </div>
                        <div class="food-macros">
                            <span class="macro protein">P: {{ food.protein }}g</span>
                            <span class="macro carbs">C: {{ food.carbs }}g</span>
                            <span class="macro fats">F: {{ food.fats }}g</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="selectedFood" class="modal-overlay" @click="closeFoodModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>{{ getLocalizedName({ names: selectedFood?.names }) ||
                        $t(`foodDatabase.foods.${selectedFood?.id}.name`) }}</h3>
                    <button class="close-button" @click="closeFoodModal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="food-preview">
                        <div class="food-large-icon">
                            <img v-if="selectedFood?.image && !selectedFood.image.includes('placeholder') && !selectedFood.image.startsWith('image_')"
                                :src="selectedFood.image" :alt="selectedFood.names?.[0]" />
                            <img v-else-if="selectedFood?.image && selectedFood.image.startsWith('image_')"
                                :src="getItemImageSrc(selectedFood)" :alt="selectedFood.names?.[0]" />
                            <span v-else class="food-db-icon">{{ selectedFood?.icon }}</span>
                        </div>
                        <div class="food-nutrition">
                            <div class="nutrition-item">
                                <span class="nutrition-label">{{ $t('foodDatabase.calories') }}</span>
                                <span class="nutrition-value">{{ Math.round((selectedFood?.calories || 0) *
                                    selectedAmount) }} kcal</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">{{ $t('foodDatabase.protein') }}</span>
                                <span class="nutrition-value">{{ Math.round((selectedFood?.protein || 0) *
                                    selectedAmount) }}g</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">{{ $t('foodDatabase.carbs') }}</span>
                                <span class="nutrition-value">{{ Math.round((selectedFood?.carbs || 0) * selectedAmount)
                                    }}g</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">{{ $t('foodDatabase.fats') }}</span>
                                <span class="nutrition-value">{{ Math.round((selectedFood?.fats || 0) * selectedAmount)
                                    }}g</span>
                            </div>
                        </div>
                    </div>
                    <div class="amount-section">
                        <label class="amount-label">{{ $t('foodDatabase.amount') }}</label>
                        <div class="amount-input-container">
                            <button class="amount-button" @click="decreaseAmount">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 13H5v-2h14v2z" />
                                </svg>
                            </button>
                            <input v-model.number="selectedAmount" type="number" step="0.1" min="0.1"
                                class="amount-input">
                            <button class="amount-button" @click="increaseAmount">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                </svg>
                            </button>
                        </div>
                        <span class="unit-label">{{ selectedFood?.unit_name ||
                            $t(`foodDatabase.units.${selectedFood?.unit}`) }}</span>
                    </div>
                    <div class="quick-amounts">
                        <button v-for="quickAmount in getQuickAmounts(selectedFood?.unit || 'piece')"
                            :key="quickAmount.value" class="quick-amount-btn"
                            :class="{ active: selectedAmount === quickAmount.value }"
                            @click="selectedAmount = quickAmount.value">
                            {{ quickAmount.label }}
                        </button>
                    </div>
                    <button class="add-food-button" @click="addFoodToHistory" :disabled="isAdding">
                        <svg v-if="!isAdding" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        <div v-else class="loading-spinner"></div>
                        {{ isAdding ? $t('foodDatabase.adding') : $t('foodDatabase.addToMeals') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ScanHistory, FavoriteFood, ImageFile } from '../utils/storage'
import { getLocalizedName } from '../utils/localization'

interface Category {
    id: string
    icon: string
    name?: string
    dbId: number
}

interface Food {
    id: string
    dbId: number
    category: string
    icon: string
    image?: string
    names?: { [key: string]: string }
    calories: number
    protein: number
    carbs: number
    fats: number
    unit: string
    unit_name?: string
}

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const API_BASE = 'https://alex.polan.sk/kalbuddy'

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedFood = ref<Food | null>(null)
const selectedAmount = ref(1)
const isAdding = ref(false)
const isLoading = ref(false)

const imageUris = ref(new Map())

function getItemImageSrc(item: any) {
    if (!item.image) return '';

    if (item.image.includes('placeholder')) return item.image;

    if (item.image.startsWith('image_')) {
        return imageUris.value.get(item.image) || '';
    }

    return item.image;
}

async function loadImageUris(items: any[]) {
    const imagesToLoad = items
        .map(item => item.image)
        .filter(image => image && typeof image === 'string' && image.startsWith('image_'))
        .filter(image => !imageUris.value.has(image))

    if (imagesToLoad.length === 0) return;

    await Promise.allSettled(
        imagesToLoad.map(async (imagePath) => {
            try {
                const uri = await ImageFile.get(imagePath);
                if (uri) {
                    imageUris.value.set(imagePath, uri);
                }
            } catch (error) {
                console.error(`Failed to load image ${imagePath}:`, error);
            }
        })
    );
}

const categories = ref<Category[]>([])
const foods = ref<Food[]>([])
const allFoods = ref<Food[]>([])
const favoriteFoods = ref<Food[]>([])

async function loadCategories() {
    try {
        isLoading.value = true
        const response = await fetch(`${API_BASE}/get_categories.php`)
        const data = await response.json()

        if (data.success) {
            const allCategories = [
                { id: 'all', icon: '🍽️', name: t('foodDatabase.categoryNames.all'), dbId: 0 },
                { id: 'favorites', icon: '❤️', name: t('foodDatabase.categoryNames.favorites'), dbId: -1 },
                ...data.data.map((cat: any) => ({
                    id: cat.code,
                    icon: cat.icon,
                    name: getLocalizedName(cat),
                    dbId: cat.id
                }))
            ]
            categories.value = allCategories
        } else {
            console.error('Failed to load categories:', data.error)
        }
    } catch (error) {
        console.error('Error loading categories:', error)
    } finally {
        isLoading.value = false
    }
}

async function loadFoods() {
    try {
        isLoading.value = true
        const response = await fetch(`${API_BASE}/get_foods.php`)
        const data = await response.json()

        if (data.success) {
            allFoods.value = data.data.map((food: any) => ({
                id: food.code,
                dbId: food.id,
                category: getCategoryCodeById(food.category_id),
                icon: food.icon,
                names: food.names,
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fats: food.fats,
                unit: food.unit,
                unit_name: food.unit_names ? getLocalizedName({ names: food.unit_names }) : food.unit
            }))
        } else {
            console.error('Failed to load foods:', data.error)
        }
    } catch (error) {
        console.error('Error loading foods:', error)
    } finally {
        isLoading.value = false
    }
}

function getCategoryCodeById(categoryId: number): string {
    const category = categories.value.find(cat => cat.dbId === categoryId)
    return category ? category.id : 'all'
}

async function loadFavorites() {
    try {
        const favorites = await FavoriteFood.get()
        favoriteFoods.value = favorites.map((fav: any) => ({
            id: `fav_${fav.favoriteId}`,
            dbId: fav.favoriteId,
            category: 'favorites',
            icon: '❤️',
            image: fav.image || '',
            names: fav.names,
            calories: fav.nutrition.calories,
            protein: fav.nutrition.protein,
            carbs: fav.nutrition.carbs,
            fats: fav.nutrition.fats,
            unit: 'piece',
            unit_name: t('foodDatabase.units.piece')
        }))

        await loadImageUris(favoriteFoods.value)
    } catch (error) {
        console.error('Error loading favorites:', error)
        favoriteFoods.value = []
    }
}

const filteredFoods = computed(() => {
    let result: Food[] = []

    if (selectedCategory.value === 'favorites') {
        result = favoriteFoods.value
    } else {
        result = allFoods.value

        if (selectedCategory.value !== 'all') {
            result = result.filter(food => food.category === selectedCategory.value)
        }
    }

    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(food => {
            const name = getLocalizedName({ names: food.names }) || t(`foodDatabase.foods.${food.id}.name`)
            return name.toLowerCase().includes(query)
        })
    }

    return result
})

function selectCategory(categoryId: string) {
    selectedCategory.value = categoryId

    if (categoryId === 'favorites') {
        loadFavorites()
    }
}

function selectFood(food: Food) {
    selectedFood.value = food
    selectedAmount.value = 1
}

function closeFoodModal() {
    selectedFood.value = null
    selectedAmount.value = 1
}

function increaseAmount() {
    selectedAmount.value = Math.round((selectedAmount.value + 0.1) * 10) / 10
}

function decreaseAmount() {
    if (selectedAmount.value > 0.1) {
        selectedAmount.value = Math.round((selectedAmount.value - 0.1) * 10) / 10
    }
}

function getQuickAmounts(unit: string) {
    switch (unit) {
        case 'piece':
            return [
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '3', value: 3 }
            ]
        case '100g':
        case '100ml':
            return [
                { label: '50g', value: 0.5 },
                { label: '100g', value: 1 },
                { label: '200g', value: 2 },
                { label: '300g', value: 3 }
            ]
        case 'slice':
            return [
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '4', value: 4 }
            ]
        case 'cup':
            return [
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '3', value: 3 }
            ]
        default:
            return [
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '3', value: 3 }
            ]
    }
}

async function addFoodToHistory() {
    if (!selectedFood.value || isAdding.value) return

    isAdding.value = true

    try {
        const food = selectedFood.value
        const amount = selectedAmount.value
        const totalCalories = Math.round(food.calories * amount)
        const totalProtein = Math.round(food.protein * amount * 10) / 10
        const totalCarbs = Math.round(food.carbs * amount * 10) / 10
        const totalFats = Math.round(food.fats * amount * 10) / 10

        console.log('Adding food to history:', { food, amount, selectedCategory: selectedCategory.value })

        const scanEntry = {
            id: Date.now(),
            type: selectedCategory.value === 'favorites' ? 'favorite' : 'food' as const,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            amount: amount,
            image: food.image || '',
            icon: food.icon,
            data: {
                foods: [{
                    names: food.names || {
                        de: getLocalizedName({ names: food.names }) || 'Unbekanntes Essen',
                        en: getLocalizedName({ names: food.names }) || 'Unknown Food',
                        es: getLocalizedName({ names: food.names }) || 'Comida Desconocida'
                    }
                }],
                total: {
                    calories: totalCalories,
                    protein: totalProtein,
                    carbs: totalCarbs,
                    fat: totalFats
                }
            }
        }

        await ScanHistory.add(scanEntry)
        window.dispatchEvent(new CustomEvent('scanHistoryUpdated'))

        closeFoodModal()
        router.push('/')

    } catch (error) {
        console.error('Error adding food to history:', error)
    } finally {
        isAdding.value = false
    }
}

function goBack() {
    router.back()
}

onMounted(async () => {
    await loadCategories()
    await loadFoods()

    foods.value = allFoods.value

    const categoryParam = route.query.category as string
    if (categoryParam) {
        selectedCategory.value = categoryParam
        if (categoryParam === 'favorites') {
            await loadFavorites()
        }
    }

    window.addEventListener('favoritesUpdated', () => {
        if (selectedCategory.value === 'favorites') {
            loadFavorites()
        }
    })
})
</script>

<style scoped>
.food-database-view {
    min-height: 100vh;
    background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
    color: white;
    padding: 16px;
    padding-top: max(44px, env(safe-area-inset-top, 44px));
    padding-bottom: max(80px, calc(80px + env(safe-area-inset-bottom, 0px)));
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    height: 44px;
}

.back-button {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 12px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.back-button:hover {
    background: rgba(255, 255, 255, 0.2);
}

.page-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

.header-spacer {
    width: 44px;
}

.search-section {
    margin-bottom: 24px;
}

.search-input-container {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 16px;
    color: rgba(255, 255, 255, 0.6);
    z-index: 1;
}

.search-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 12px;
    padding: 16px 16px 16px 48px;
    color: white;
    font-size: 16px;
    backdrop-filter: blur(10px);
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.search-input:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
}

.categories-section {
    margin-bottom: 24px;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
}

.categories-grid {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 8px;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.categories-grid::-webkit-scrollbar {
    display: none;
}

.category-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 12px;
    padding: 16px 12px;
    min-width: 80px;
    cursor: pointer;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
}

.category-button.active {
    background: rgba(255, 255, 255, 0.2);
}

.category-button:hover {
    background: rgba(255, 255, 255, 0.15);
}

.category-icon {
    font-size: 24px;
}

.category-name {
    color: white;
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
}

.food-items-section {
    margin-bottom: 24px;
}

.food-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
}

.food-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
}

.food-card:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.food-icon {
    font-size: 40px;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    flex-shrink: 0;
    overflow: hidden;
}

.food-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.food-db-icon {
    font-size: 40px;
}

.food-info {
    flex: 1;
}

.food-name {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 8px 0;
}

.food-calories {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
}

.food-macros {
    display: flex;
    gap: 12px;
    font-size: 12px;
}

.macro {
    color: rgba(255, 255, 255, 0.7);
}

.macro.protein {
    color: #ff6b6b;
}

.macro.carbs {
    color: #ffa726;
}

.macro.fats {
    color: #42a5f5;
}

/* Modal Styles */
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
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: #2a2d37;
    border-radius: 20px;
    width: 100%;
    max-width: 400px;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 0;
}

.modal-header h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

.close-button {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
}

.modal-body {
    padding: 20px;
}

.food-preview {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
}

.food-large-icon {
    font-size: 60px;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    flex-shrink: 0;
    overflow: hidden;
}

.food-large-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.food-large-icon .food-db-icon {
    font-size: 60px;
}

.food-nutrition {
    flex: 1;
}

.nutrition-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.nutrition-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
}

.nutrition-value {
    font-weight: 600;
    font-size: 14px;
}

.amount-section {
    margin-bottom: 20px;
}

.amount-label {
    display: block;
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 600;
}

.amount-input-container {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
}

.amount-button {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: all 0.2s;
}

.amount-button:hover {
    background: rgba(255, 255, 255, 0.2);
}

.amount-input {
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    padding: 12px;
    color: white;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
}

.amount-input:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
}

.unit-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
}

.quick-amounts {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
}

.quick-amount-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
}

.quick-amount-btn.active {
    background: rgba(255, 255, 255, 0.2);
}

.quick-amount-btn:hover {
    background: rgba(255, 255, 255, 0.15);
}

.add-food-button {
    width: 100%;
    background: linear-gradient(135deg, #007052, #005f4a);
    border: none;
    border-radius: 12px;
    padding: 16px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.add-food-button:hover {
    background: linear-gradient(135deg, #008c63, #007052);
    transform: translateY(-1px);
}

.add-food-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
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
</style>
