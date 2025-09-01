<template>
    <div class="all-scans-view">
        <!-- Header -->
        <header class="header">
            <button class="back-button" @click="goBack">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
            </button>
            <h1 class="title">{{ $t('allScans.title') }}</h1>
            <div class="header-spacer"></div>
        </header>

        <!-- Search and Filter Section -->
        <div class="search-filter-section">
            <!-- Search Bar -->
            <div class="search-bar">
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
                    <path
                        d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input v-model="searchQuery" type="text" :placeholder="$t('allScans.searchPlaceholder')"
                    class="search-input" />
                <button v-if="searchQuery" @click="clearSearch" class="clear-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            </div>

            <!-- Filter Buttons -->
            <div class="filter-buttons">
                <button v-for="filter in filterOptions" :key="filter.value" class="filter-btn"
                    :class="{ active: selectedFilter === filter.value }" @click="selectedFilter = filter.value">
                    {{ filter.label }}
                </button>
            </div>

            <!-- Sort Options -->
            <div class="sort-section">
                <label class="sort-label">{{ $t('allScans.sortBy') }}:</label>
                <select v-model="sortBy" class="sort-select">
                    <option value="newest">{{ $t('allScans.newest') }}</option>
                    <option value="oldest">{{ $t('allScans.oldest') }}</option>
                    <option value="name">{{ $t('allScans.name') }}</option>
                    <option value="calories">{{ $t('allScans.calories') }}</option>
                </select>
            </div>
        </div>

        <!-- Results Info -->
        <div class="results-info">
            <span>{{ filteredScans.length }} {{ $t('allScans.results') }}</span>
            <button v-if="hasActiveFilters" @click="clearAllFilters" class="clear-filters-btn">
                {{ $t('allScans.clearFilters') }}
            </button>
        </div>

        <!-- Scans List -->
        <div class="scans-list">
            <div v-if="filteredScans.length === 0" class="empty-state">
                <div class="empty-icon">🔍</div>
                <p>{{ $t('allScans.noResults') }}</p>
                <p class="empty-subtitle">{{ $t('allScans.noResultsSubtitle') }}</p>
            </div>

            <div v-else class="scan-item" v-for="scan in paginatedScans" :key="scan.id" @click="viewScanDetails(scan)">
                <div class="scan-image">
                    <img v-if="scan.image && !scan.image.includes('placeholder')" :src="scan.image" :alt="scan.name" />
                    <span v-else class="scan-type-icon">{{ scan.type === 'food' ? '🍽️' : '📦' }}</span>
                </div>

                <div class="scan-info">
                    <div class="scan-header">
                        <h4 class="scan-name">{{ scan.name }}</h4>
                        <span class="scan-type-badge" :class="scan.type">
                            {{ scan.type === 'food' ? $t('allScans.foodScan') : $t('allScans.barcodeScan') }}
                        </span>
                    </div>

                    <div class="scan-nutrition">
                        <div class="nutrition-item calories">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff6b35">
                                <path
                                    d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
                            </svg>
                            <span>{{ scan.calories }} kcal</span>
                        </div>

                        <div class="nutrition-macros">
                            <span class="macro-item protein-color">
                                <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                    <path fill="#ff6b6b"
                                        d="M224 329.2C224 337.7 220.6 345.8 214.6 351.8L187.8 378.6C175.5 390.9 155.3 390 138.4 385.8C133.8 384.7 128.9 384 123.9 384C90.8 384 63.9 410.9 63.9 444C63.9 477.1 90.8 504 123.9 504C130.2 504 135.9 509.7 135.9 516C135.9 549.1 162.8 576 195.9 576C229 576 255.9 549.1 255.9 516C255.9 511 255.3 506.2 254.1 501.5C249.9 484.6 248.9 464.4 261.3 452.1L288.1 425.3C294.1 419.3 302.2 415.9 310.7 415.9L399.9 415.9C406.2 415.9 412.3 415.6 418.4 414.9C430.3 413.7 434.8 399.4 429.2 388.9C420.7 373.1 415.9 355.1 415.9 335.9C415.9 274 466 223.9 527.9 223.9C535.9 223.9 543.6 224.7 551.1 226.3C562.8 228.8 575.2 220.4 573.1 208.7C558.4 126.4 486.4 63.9 399.9 63.9C302.7 63.9 223.9 142.7 223.9 239.9L223.9 329.1z" />
                                </svg>
                                {{ scan.protein }}g
                            </span>
                            <span class="macro-item carbs-color">
                                <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path fill="#ffa726"
                                        d="M79.7 234.6c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0L134.1 444.3 49.4 529c-9.4 9.4-24.5 9.4-33.9 0-9.4-9.4-9.4-24.6 0-33.9l84.7-84.7-30.5-30.5c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zm104-104c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zM495.2 15c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.2L529.2 49 414.7 163.4c7.7 1 15.2 3 22.5 5.9L495.5 111c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-52.7 52.7 39 39c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1c6.2-4.1 14.7-3.4 20.1 2.1l39 39 52.7-52.7c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-58.3 58.3c2.8 7.1 4.7 14.5 5.7 22.1L495.2 15z" />
                                </svg>
                                {{ scan.carbs }}g
                            </span>
                            <span class="macro-item fats-color">
                                <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                    <path fill="#42a5f5"
                                        d="M240 64C240 46.3 254.3 32 272 32L368 32C385.7 32 400 46.3 400 64C400 81.7 385.7 96 368 96L368 199.3C432.9 219.7 480 280.3 480 352L480 544C480 579.3 451.3 608 416 608L224 608C188.7 608 160 579.3 160 544L160 352C160 280.4 207.1 219.7 272 199.3L272 96C254.3 96 240 81.7 240 64zM320 480C355.3 480 384 447.6 384 416C384 394.8 355.1 351.5 336.1 325.4C328 314.3 311.9 314.3 303.8 325.4C284.8 351.5 255.9 394.8 255.9 416C255.9 447.6 284.6 480 319.9 480z" />
                                </svg>
                                {{ scan.fats }}g
                            </span>
                        </div>
                    </div>

                    <div class="scan-meta">
                        <span class="scan-date">{{ formatDate(scan.timestamp) }}</span>
                        <span class="scan-time">{{ scan.time }}</span>
                    </div>
                </div>

                <div class="scan-actions">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreScans" class="load-more-section">
            <button @click="loadMoreScans" class="load-more-btn">
                {{ $t('allScans.loadMore') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ScanHistory } from '../utils/storage'

const router = useRouter()
const { t } = useI18n()

interface ScanData {
    id: number
    type: 'food' | 'barcode'
    timestamp: string
    time: string
    image?: string
    data: any
    name: string
    calories: number
    protein: number
    carbs: number
    fats: number
}

// Data
const allScans = ref<ScanData[]>([])
const searchQuery = ref('')
const selectedFilter = ref<'all' | 'food' | 'barcode'>('all')
const sortBy = ref<'newest' | 'oldest' | 'name' | 'calories'>('newest')
const currentPage = ref(1)
const itemsPerPage = 20

// Filter options
const filterOptions = [
    { value: 'all' as const, label: t('allScans.all') },
    { value: 'food' as const, label: t('allScans.foodScans') },
    { value: 'barcode' as const, label: t('allScans.barcodeScans') }
]

// Computed properties
const hasActiveFilters = computed(() =>
    searchQuery.value !== '' || selectedFilter.value !== 'all'
)

const filteredScans = computed(() => {
    let filtered = [...allScans.value]

    // Apply search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(scan =>
            scan.name.toLowerCase().includes(query)
        )
    }

    // Apply type filter
    if (selectedFilter.value !== 'all') {
        filtered = filtered.filter(scan => scan.type === selectedFilter.value)
    }

    // Apply sorting
    filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'newest':
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            case 'oldest':
                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            case 'name':
                return a.name.localeCompare(b.name)
            case 'calories':
                return b.calories - a.calories
            default:
                return 0
        }
    })

    return filtered
})

const paginatedScans = computed(() => {
    return filteredScans.value.slice(0, currentPage.value * itemsPerPage)
})

const hasMoreScans = computed(() => {
    return filteredScans.value.length > currentPage.value * itemsPerPage
})

// Functions
function goBack() {
    router.back()
}

function clearSearch() {
    searchQuery.value = ''
}

function clearAllFilters() {
    searchQuery.value = ''
    selectedFilter.value = 'all'
}

function loadMoreScans() {
    currentPage.value++
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const isToday = date.toDateString() === today.toDateString()
    const isYesterday = date.toDateString() === yesterday.toDateString()

    if (isToday) {
        return t('allScans.today')
    } else if (isYesterday) {
        return t('allScans.yesterday')
    } else {
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }
}

function viewScanDetails(scan: ScanData) {
    // Navigate to scan detail view with scan ID
    router.push({
        path: '/scan-detail',
        query: { scanId: scan.id.toString() }
    })
}

async function loadAllScans() {
    try {
        const history = await ScanHistory.get()

        allScans.value = history.map((scan): ScanData => {
            if (scan.type === 'food') {
                const total = scan.data.total || {}
                const firstFood = scan.data.foods?.[0]
                return {
                    id: scan.id,
                    type: scan.type,
                    timestamp: scan.timestamp,
                    time: scan.time,
                    image: scan.image,
                    data: scan.data,
                    name: firstFood?.name || t('home.scannedFood'),
                    calories: Math.round(total.calories || 0),
                    protein: Math.round(total.protein || 0),
                    carbs: Math.round(total.carbs || 0),
                    fats: Math.round(total.fat || 0)
                }
            } else {
                const nutriments = scan.data.nutriments || {}
                return {
                    id: scan.id,
                    type: scan.type,
                    timestamp: scan.timestamp,
                    time: scan.time,
                    image: scan.image,
                    data: scan.data,
                    name: scan.data.product_name || t('home.unknownProduct'),
                    calories: Math.round(nutriments.energy_kcal_100g || 0),
                    protein: Math.round(nutriments.proteins_100g || 0),
                    carbs: Math.round(nutriments.carbohydrates_100g || 0),
                    fats: Math.round(nutriments.fat_100g || 0)
                }
            }
        })
    } catch (error) {
        console.error('Error loading all scans:', error)
        allScans.value = []
    }
}

onMounted(() => {
    loadAllScans()
})
</script>

<style scoped>
.all-scans-view {
    height: 100vh;
    height: 100dvh;
    background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
    color: white;
    overflow-y: auto;
    margin-top: max(44px, env(safe-area-inset-top, 44px));
    padding-bottom: max(20px, env(safe-area-inset-bottom, 20px));
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    position: sticky;
    top: 0;
    background: rgba(30, 30, 46, 0.95);
    backdrop-filter: blur(10px);
    z-index: 10;
}

.back-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.title {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

.header-spacer {
    width: 40px;
}

.search-filter-section {
    padding: 20px;
}

.search-bar {
    position: relative;
    margin-bottom: 20px;
}

.search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
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

.clear-button {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
}

.filter-buttons {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    overflow-x: auto;
    padding-bottom: 4px;
}

.filter-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
}

.filter-btn.active {
    background: rgba(255, 255, 255, 0.2);
}

.sort-section {
    display: flex;
    align-items: center;
    gap: 12px;
}

.sort-label {
    font-size: 14px;
    opacity: 0.8;
}

.sort-select {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
}

.sort-select option {
    background: #2a2d37;
    color: white;
}

.results-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 16px;
    font-size: 14px;
    opacity: 0.8;
}

.clear-filters-btn {
    background: none;
    border: none;
    color: #ff6b35;
    cursor: pointer;
    font-size: 14px;
    text-decoration: underline;
}

.scans-list {
    padding: 0 20px;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    backdrop-filter: blur(10px);
}

.empty-icon {
    font-size: 3rem;
    margin-bottom: 16px;
    opacity: 0.6;
}

.empty-state p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    margin-bottom: 8px;
}

.empty-subtitle {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px !important;
    margin-bottom: 0 !important;
}

.scan-item {
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    backdrop-filter: blur(10px);
    cursor: pointer;
    transition: all 0.2s;
}

.scan-item:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
}

.scan-image {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
}

.scan-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.scan-type-icon {
    font-size: 20px;
}

.scan-info {
    flex: 1;
}

.scan-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.scan-name {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    flex: 1;
    margin-right: 12px;
}

.scan-type-badge {
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 500;
}

.scan-type-badge.food {
    background: rgba(255, 107, 107, 0.2);
    color: #ff6b6b;
}

.scan-type-badge.barcode {
    background: rgba(66, 165, 245, 0.2);
    color: #42a5f5;
}

.scan-nutrition {
    margin-bottom: 8px;
}

.nutrition-item {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    font-size: 14px;
}

.nutrition-macros {
    display: flex;
    gap: 12px;
    font-size: 12px;
}

.macro-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.protein-color {
    color: #ff6b6b;
}

.carbs-color {
    color: #ffa726;
}

.fats-color {
    color: #42a5f5;
}

.scan-meta {
    display: flex;
    gap: 12px;
    font-size: 12px;
    opacity: 0.7;
}

.scan-actions {
    flex-shrink: 0;
}

.load-more-section {
    padding: 20px;
    text-align: center;
}

.load-more-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.load-more-btn:hover {
    background: rgba(255, 255, 255, 0.15);
}
</style>
