<template>
    <div class="home-view">
        <IsProcessingPhoto v-if="isProcessingPhoto" />
        <IsProcessingLabel v-if="isProcessingLabel" />
        <HomeHeader v-model="selectedDate" />
        <QuickActions @chat="goToView('chat')" @log-weight="openWeightModal" @feedback="goToView('feedback')"
            @favorites="goToFavorites" />
        <MainCaloriesCard :calories-display="caloriesNumberDisplay" :label-display="caloriesLabelDisplay"
            :current-streak="currentStreak" :progress="caloriesProgress" @click="goToView('calories')"
            @streak-click="goToView('streak')" />
        <HomePremiumBanner :show="!isPremiumUser && showPremiumBanner" @upgrade="goToView('upgrade')"
            @close="hidePremiumBanner" />
        <MacrosGrid :protein-display="proteinNumberDisplay" :protein-label="proteinLabelDisplay"
            :protein-progress="proteinProgress" :carbs-display="carbsNumberDisplay" :carbs-label="carbsLabelDisplay"
            :carbs-progress="carbsProgress" :fats-display="fatsNumberDisplay" :fats-label="fatsLabelDisplay"
            :fats-progress="fatsProgress" @protein-click="goToView('protein')" @carbs-click="goToView('carbs')"
            @fats-click="goToView('fats')" />
        <RecentFoodsList :foods="recentFoods" :image-uris="imageUris" :deleting-items="deletingItems"
            @item-click="goToNutritionDetail" @delete="deleteFoodItem" />
        <BottomNavigation />
        <div @click="toggleAddFoodModal(true)" class="add-button">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
        </div>
        <AddFoodModal :show="isAddFoodModalVisible" @close="toggleAddFoodModal(false)"
            @select-scanner="handleSelectScanner" @select-database="handleSelectDatabase"
            @select-manual="handleSelect('manual-entry')" />
        <PremiumBlocker v-if="showScanLimitBlocker" feature="unlimited_food_scans"
            :title="$t('premium.scanLimit.title')" :description="$t('premium.scanLimit.description')" :features="[
                $t('premium.scanLimit.feature1'),
                $t('premium.scanLimit.feature2'),
                $t('premium.scanLimit.feature3')
            ]" :show-usage-info="true" :scans-used="currentScanUsage?.currentCount || 0"
            :scans-total="currentScanUsage?.limit || 10" @close="closeScanLimitBlocker"
            @upgrade="handleScanLimitUpgrade" />
        <WeightLogModal :show="showWeightModal" @close="closeWeightModal" @logged="handleWeightLogged" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, type ComputedRef } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { dailyGoals, isOnboardingCompleted, storeReady } from '../stores/userStore'
import { ScanHistory, ImageFile, FavoriteFood, Storage } from '../utils/storage' //BarcodeCache,
import { WidgetDataManager, StreakManager } from '../utils/widgetData'
import { HealthKitService } from '../services/healthkit'
import { InAppReview } from '@capacitor-community/in-app-review';
import { shouldShowReviewPrompt, setLastReviewPrompt, getNotificationSettings } from '../stores/preferencesStore'
import { NotificationService } from '../services/notifications'
import { useBarcodeScanner } from '../composables/useBarcodeScanner'
import { isPremiumUser, onPremiumStatusChange } from '../utils/premiumManager' //premiumManager
import { getLocalizedName, migrateToNamesFormat, migrateFoodsArray } from '../utils/localization'
import { WeightTracker } from '../utils/weightTracking'
import PremiumBlocker from '../components/PremiumBlocker.vue'
import BottomNavigation from '../components/BottomNavigation.vue'
import AddFoodModal from '../components/AddFoodModal.vue'
import WeightLogModal from '../components/WeightLogModal.vue'
import IsProcessingLabel from '../components/home/IsProcessingLabel.vue'
import IsProcessingPhoto from '../components/home/IsProcessingPhoto.vue'
import HomeHeader from '../components/home/HomeHeader.vue'
import QuickActions from '../components/home/QuickActions.vue'
import MainCaloriesCard from '../components/home/MainCaloriesCard.vue'
import MacrosGrid from '../components/home/MacrosGrid.vue'
import RecentFoodsList from '../components/home/RecentFoodsList.vue'
import HomePremiumBanner from '../components/home/HomePremiumBanner.vue'

const router = useRouter()
const { t } = useI18n()
const { startScanning, isProcessingPhoto, isProcessingLabel, checkScanLimit, getScanUsage } = useBarcodeScanner()

const showPremiumBanner = ref(true)
const showScanLimitBlocker = ref(false)
const currentScanUsage = ref<any>(null)
const isAddFoodModalVisible = ref(false)
const showWeightModal = ref(false)
const imageUris = ref(new Map<string, string>())

// Temporary migration function to convert base64 images to files
async function migrateBase64ImagesToFiles() {
    try {
        console.log('🔄 Starting base64 image migration...');
        const history = await ScanHistory.get();
        let migrationCount = 0;
        let updatedHistory = [...history];

        for (let i = 0; i < updatedHistory.length; i++) {
            const scan = updatedHistory[i];
            if (scan.image && typeof scan.image === 'string' && scan.image.startsWith('data:image/')) {
                try {
                    const fileName = await ImageFile.save(scan.image);
                    if (fileName) {
                        updatedHistory[i] = {
                            ...scan,
                            image: fileName
                        };
                        migrationCount++;
                        console.log(`✅ Migrated image for scan ${scan.id}: ${fileName}`);
                    }
                } catch (error) {
                    console.error(`❌ Failed to migrate image for scan ${scan.id}:`, error);
                }
            }
        }

        if (migrationCount > 0) {
            await ScanHistory.clear();
            for (let i = updatedHistory.length - 1; i >= 0; i--) {
                await ScanHistory.add(updatedHistory[i]);
            }

            console.log(`🎉 Migration completed! Converted ${migrationCount} base64 images to files.`);
        } else {
            console.log('ℹ️ No base64 images found to migrate.');
        }
    } catch (error) {
        console.error('❌ Error during base64 image migration:', error);
    }
}

async function migrateNamesToStandardFormat() {
    try {
        console.log('🔄 Starting names format migration...');

        const history = await ScanHistory.get();
        let historyMigrationCount = 0;
        let updatedHistory = [...history];

        for (let i = 0; i < updatedHistory.length; i++) {
            const scan = updatedHistory[i];

            const needsMigration = (
                scan.data?.name ||
                scan.data?.name_en ||
                scan.data?.product_name ||
                (scan.data?.foods && scan.data.foods.some((f: any) => f.name || f.name_en || f.product_name))
            );

            if (needsMigration) {
                try {
                    const migratedScan = { ...scan };
                    if (migratedScan.data) {
                        migratedScan.data = migrateFoodsArray(migratedScan.data);
                    }

                    updatedHistory[i] = migratedScan;
                    historyMigrationCount++;
                    console.log(`✅ Migrated names for scan ${scan.id}`);
                } catch (error) {
                    console.error(`❌ Failed to migrate names for scan ${scan.id}:`, error);
                }
            }
        }

        if (historyMigrationCount > 0) {
            await ScanHistory.clear();
            for (let i = updatedHistory.length - 1; i >= 0; i--) {
                await ScanHistory.add(updatedHistory[i]);
            }
            console.log(`🎉 Scan history migration completed! Migrated ${historyMigrationCount} items.`);
        }

        const cacheKeys = await Storage.keys();
        const barcodeKeys = cacheKeys.filter(key => key.startsWith('barcode_cache_'));
        let cacheMigrationCount = 0;

        for (const key of barcodeKeys) {
            try {
                const cached = await Storage.get(key);
                if (cached?.data && (cached.data.name || cached.data.name_en || cached.data.product_name)) {
                    const migratedData = {
                        ...cached,
                        data: migrateToNamesFormat(cached.data)
                    };
                    await Storage.set(key, migratedData);
                    cacheMigrationCount++;
                    console.log(`✅ Migrated cache for barcode: ${key}`);
                }
            } catch (error) {
                console.error(`❌ Failed to migrate cache ${key}:`, error);
            }
        }

        if (cacheMigrationCount > 0) {
            console.log(`🎉 Barcode cache migration completed! Migrated ${cacheMigrationCount} items.`);
        }

        const favorites = await FavoriteFood.get();
        let favoritesMigrationCount = 0;
        let updatedFavorites = [...favorites];

        for (let i = 0; i < updatedFavorites.length; i++) {
            const fav = updatedFavorites[i];

            if (fav.name || fav.name_en || fav.product_name || (fav.data?.name || fav.data?.name_en || fav.data?.product_name)) {
                try {
                    const migratedFav = migrateToNamesFormat(fav);
                    if (migratedFav.data) {
                        migratedFav.data = migrateFoodsArray(migratedFav.data);
                    }

                    updatedFavorites[i] = migratedFav;
                    favoritesMigrationCount++;
                    console.log(`✅ Migrated favorite: ${fav.favoriteId}`);
                } catch (error) {
                    console.error(`❌ Failed to migrate favorite ${fav.favoriteId}:`, error);
                }
            }
        }

        if (favoritesMigrationCount > 0) {
            await Storage.set('favoriteFood', updatedFavorites);
            console.log(`🎉 Favorites migration completed! Migrated ${favoritesMigrationCount} items.`);
        }

        if (historyMigrationCount + cacheMigrationCount + favoritesMigrationCount === 0) {
            console.log('ℹ️ No items found that need names format migration.');
        } else {
            console.log(`🎉 Names migration completed! Total migrated: ${historyMigrationCount + cacheMigrationCount + favoritesMigrationCount} items.`);
        }

    } catch (error) {
        console.error('❌ Error during names format migration:', error);
    }
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

async function startScanningWithMode(mode: 'barcode' | 'photo' | 'label') {
    try {
        await startScanning({
            mode: mode,
            timeout: 0,
            showControls: true
        })

        loadScanHistory("startScanningWithMode")
        await getScanUsage()
    } catch (error) {
        console.error('Failed to open scanner:', error)

        if (error instanceof Error && error.message?.includes('SCAN_LIMIT_REACHED')) {
            showScanLimitBlocker.value = true
        }
    }
}

function closeScanLimitBlocker() {
    showScanLimitBlocker.value = false
}

function handleScanLimitUpgrade() {
    showScanLimitBlocker.value = false
    router.push('/upgrade')
}

function loadScanHistoryAndStreak() {
    loadScanHistory("loadScanHistoryAndStreak")
    loadStreak()
}

setTimeout(async () => {
    try {
        if (recentFoods.value.length > 9) {
            const canShow = await shouldShowReviewPrompt(5)
            if (canShow) {
                const result = await InAppReview.requestReview();
                await setLastReviewPrompt(Date.now())
                console.log('InAppReview requested:', result)
            }
        }
    } catch (err) {
        console.error('Error requesting in-app review:', err)
    }
}, 20000);

onMounted(async () => {
    await storeReady

    if (!isOnboardingCompleted.value) {
        router.push('/onboarding')
        return
    }

    loadScanHistoryAndStreak()

    try {
        await migrateBase64ImagesToFiles()
    } catch (error) {
        console.error('Error during image migration:', error)
    }

    try {
        await migrateNamesToStandardFormat()
    } catch (error) {
        console.error('Error during names migration:', error)
    }

    try {
        const notificationSettings = await getNotificationSettings()
        if (notificationSettings.enabled && NotificationService.isSupported()) {
            await NotificationService.scheduleAllMealNotifications(notificationSettings)
            console.log('📅 Meal notifications scheduled')
        }
    } catch (error) {
        console.error('Error loading notification settings:', error)
    }

    window.addEventListener('scanHistoryUpdated', loadScanHistoryAndStreak)
    window.addEventListener('focus', loadScanHistoryAndStreak)

    const unsubscribe = onPremiumStatusChange((isPremium) => {
        console.log('🎉 Premium status changed in HomeView:', isPremium)
        if (isPremium) {
            showPremiumBanner.value = false
        }
    })

    window.addEventListener('beforeunload', unsubscribe)
})

onUnmounted(() => {
    window.removeEventListener('scanHistoryUpdated', loadScanHistoryAndStreak)
    window.removeEventListener('focus', loadScanHistoryAndStreak)
})

interface ScanData {
    id: number
    type: 'food' | 'barcode' | 'favorite' | 'manual'
    timestamp: string
    time: string
    image?: string
    amount?: number
    icon?: string
    data: any
}

interface FoodItem {
    id: number
    name: string
    calories: number
    protein: number
    carbs: number
    fats: number
    time: string
    image: string
    type: string
    icon?: string
}

const dailyCalories = computed(() => dailyGoals.calories)
const dailyProtein = computed(() => dailyGoals.protein)
const dailyCarbs = computed(() => dailyGoals.carbs)
const dailyFats = computed(() => dailyGoals.fats)
const todaysNutrition = ref({ calories: 0, protein: 0, carbs: 0, fats: 0 })
const consumedCalories = computed(() => todaysNutrition.value.calories)
const consumedProtein = computed(() => todaysNutrition.value.protein)
const consumedCarbs = computed(() => todaysNutrition.value.carbs)
const consumedFats = computed(() => todaysNutrition.value.fats)
const scanHistory = ref<ScanData[]>([])
const currentStreak = ref<number>(0)
const selectedDate = ref(new Date())

function createMacroCalculations(
    dailyValue: ComputedRef<number>,
    consumedValue: ComputedRef<number>,
    unit: string,
    overKey: string,
    leftKey: string
) {
    const diff = computed(() => Math.round(dailyValue.value - consumedValue.value))
    const isOver = computed(() => diff.value < 0)
    const abs = computed(() => Math.abs(diff.value))
    const numberDisplay = computed(() => isOver.value ? `${abs.value}${unit}` : `${diff.value}${unit}`)
    const labelDisplay = computed(() => isOver.value ? t(overKey) : t(leftKey))
    const progress = computed(() => Math.min(consumedValue.value / dailyValue.value, 1))

    return { diff, isOver, abs, numberDisplay, labelDisplay, progress }
}

function transformFoodScan(scan: ScanData): FoodItem {
    const total = scan.data.total
    const firstFood = scan.data.foods?.[0]
    return {
        id: scan.id,
        name: getLocalizedName(firstFood) || t('home.scannedFood'),
        calories: total.calories || 0,
        protein: total.protein || 0,
        carbs: total.carbs || 0,
        fats: total.fat || 0,
        time: scan.time,
        image: scan.image || '/api/placeholder/60/60',
        type: 'food',
        icon: scan.icon
    }
}

function transformBarcodeScan(scan: ScanData, amount: number): FoodItem {
    const nutriments = scan.data.nutriments || {}
    return {
        id: scan.id,
        name: getLocalizedName(scan.data) || t('home.unknownProduct'),
        calories: Math.round((nutriments.energy_kcal_100g || 0) * amount),
        protein: Math.round((nutriments.proteins_100g || 0) * amount),
        carbs: Math.round((nutriments.carbohydrates_100g || 0) * amount),
        fats: Math.round((nutriments.fat_100g || 0) * amount),
        time: scan.time,
        image: scan.image || '/api/placeholder/60/60',
        type: 'barcode',
        icon: undefined
    }
}

function transformScanToFoodItem(scan: ScanData): FoodItem | null {
    const amount = scan.amount || 1.0

    if (scan.type === 'food' || scan.type === 'favorite') {
        return transformFoodScan(scan)
    } else if (scan.type === 'barcode') {
        return transformBarcodeScan(scan, amount)
    }
    return null
}

async function loadScanHistory(context: string) {
    console.log(`Loading scan history called from: ${context}`)
    try {
        const history = await ScanHistory.get()
        const selectedDateString = selectedDate.value.toISOString().split('T')[0]
        const today = new Date().toISOString().split('T')[0]

        if (selectedDateString === today) {
            scanHistory.value = history.slice(0, 10)
        } else {
            const dateScans = history.filter(scan => {
                const scanDate = new Date(scan.timestamp).toISOString().split('T')[0]
                return scanDate === selectedDateString
            })
            scanHistory.value = dateScans.slice(0, 10)
        }

        calculateNutritionFromHistory(history)
        await loadImageUris(scanHistory.value)

        if (selectedDateString === today) {
            Promise.allSettled([
                WidgetDataManager.updateWidgetData().catch(err =>
                    console.error('Widget update failed:', err)
                ),
                syncToHealthKit().catch(err =>
                    console.error('HealthKit sync failed:', err)
                ),
                NotificationService.resetInactivityTimer().catch(err =>
                    console.error('Notification reset failed:', err)
                )
            ]).then(() => {
                console.log('✅ Background sync operations completed')
            }).catch(err => {
                console.error('Background sync operations failed:', err)
            })
        }
    } catch (error) {
        console.error('Error loading scan history:', error)
        scanHistory.value = []
        todaysNutrition.value = { calories: 0, protein: 0, carbs: 0, fats: 0 }
    }
}

function calculateNutritionFromHistory(history: ScanData[]) {
    console.log('`Calculating nutrition called`')
    try {
        const selectedDateString = selectedDate.value.toISOString().split('T')[0]

        const dateScans = history.filter(scan => {
            const scanDate = new Date(scan.timestamp).toISOString().split('T')[0]
            return scanDate === selectedDateString
        })

        let totalCalories = 0
        let totalProtein = 0
        let totalCarbs = 0
        let totalFats = 0

        dateScans.forEach(scan => {
            const amount = scan.amount || 1.0;

            if ((scan.type === 'food' || scan.type === 'favorite') && scan.data.total) {
                totalCalories += scan.data.total.calories || 0
                totalProtein += scan.data.total.protein || 0
                totalCarbs += scan.data.total.carbs || 0
                totalFats += scan.data.total.fat || 0
            } else if (scan.type === 'barcode' && scan.data.nutriments) {
                totalCalories += (scan.data.nutriments.energy_kcal_100g || 0) * amount
                totalProtein += (scan.data.nutriments.proteins_100g || 0) * amount
                totalCarbs += (scan.data.nutriments.carbohydrates_100g || 0) * amount
                totalFats += (scan.data.nutriments.fat_100g || 0) * amount
            }
        })

        todaysNutrition.value = {
            calories: Math.round(totalCalories),
            protein: Math.round(totalProtein),
            carbs: Math.round(totalCarbs),
            fats: Math.round(totalFats)
        }
    } catch (error) {
        console.error('Error calculating nutrition:', error)
        todaysNutrition.value = { calories: 0, protein: 0, carbs: 0, fats: 0 }
    }
}

async function loadStreak() {
    try {
        currentStreak.value = await StreakManager.getCurrentStreak()
    } catch (error) {
        console.error('Error loading streak:', error)
        currentStreak.value = 0
    }
}

async function syncToHealthKit() {
    try {
        if (!isPremiumUser.value) {
            console.log('🔒 HealthKit sync skipped - Premium feature');
            return;
        }

        await HealthKitService.syncTodaysData()
    } catch (error) {
        console.error('Error syncing to HealthKit:', error)
    }
}

function goToView(view: string) {
    router.push(`/${view}`)
}

function goToFavorites() {
    router.push('/food-database?category=favorites')
}

function openWeightModal() {
    showWeightModal.value = true
}

function closeWeightModal() {
    showWeightModal.value = false
}

async function handleWeightLogged(weight: number, notes: string) {
    try {
        console.log('Weight logged:', weight, 'kg', notes ? `Notes: ${notes}` : '')
        await WeightTracker.addWeightEntry(weight, notes || undefined)

        closeWeightModal()

        try {
            await HealthKitService.syncTodaysData()
        } catch (healthKitError) {
            console.log('HealthKit sync not available or failed:', healthKitError)
        }

        console.log('Weight successfully saved!')
    } catch (error) {
        console.error('Error saving weight:', error)
        closeWeightModal()
    }
}

function toggleAddFoodModal(val: boolean) {
    isAddFoodModalVisible.value = val
}

async function handleSelectScanner(mode: 'barcode' | 'photo' | 'label') {
    toggleAddFoodModal(false)

    try {
        const usage = await checkScanLimit()
        currentScanUsage.value = usage

        if (!usage.canScan && !usage.isPremium) {
            console.log(`Scan limit reached: ${usage.currentCount}/${usage.limit} scans used today`)
            showScanLimitBlocker.value = true
            return
        }

        await startScanningWithMode(mode)
    } catch (error) {
        console.error('Failed to check scan limits:', error)
        await startScanningWithMode(mode)
    }
}

function handleSelectDatabase(category: 'all' | 'favorites' = 'all') {
    toggleAddFoodModal(false)
    if (category === 'favorites') {
        router.push('/food-database?category=favorites')
    } else {
        router.push('/food-database')
    }
}

function handleSelect(view: string) {
    toggleAddFoodModal(false)
    router.push(`/${view}`)
}

function hidePremiumBanner() {
    showPremiumBanner.value = false
}

function goToNutritionDetail(item: FoodItem) {
    router.push({
        path: '/scan-detail',
        query: {
            scanId: item.id.toString()
        }
    })
}

const recentFoods = computed((): FoodItem[] => {
    return scanHistory.value
        .map(transformScanToFoodItem)
        .filter((item): item is FoodItem => item !== null)
})

const calories = createMacroCalculations(dailyCalories, consumedCalories, '', 'home.caloriesOver', 'home.caloriesLeft')
const protein = createMacroCalculations(dailyProtein, consumedProtein, 'g', 'home.proteinOver', 'home.proteinLeft')
const carbs = createMacroCalculations(dailyCarbs, consumedCarbs, 'g', 'home.carbsOver', 'home.carbsLeft')
const fats = createMacroCalculations(dailyFats, consumedFats, 'g', 'home.fatsOver', 'home.fatsLeft')

const caloriesProgress = calories.progress
const proteinProgress = protein.progress
const carbsProgress = carbs.progress
const fatsProgress = fats.progress

const caloriesNumberDisplay = calories.numberDisplay
const caloriesLabelDisplay = calories.labelDisplay
const proteinNumberDisplay = protein.numberDisplay
const proteinLabelDisplay = protein.labelDisplay
const carbsNumberDisplay = carbs.numberDisplay
const carbsLabelDisplay = carbs.labelDisplay
const fatsNumberDisplay = fats.numberDisplay
const fatsLabelDisplay = fats.labelDisplay

watch(selectedDate, () => {
    loadScanHistoryAndStreak()
}, { immediate: false })

const deletingItems = ref<Set<number>>(new Set())

async function deleteFoodItem(itemId: number) {
    try {
        deletingItems.value.add(itemId)

        setTimeout(() => {
            const itemToDelete = scanHistory.value.find(item => item.id === itemId)
            if (itemToDelete) {
                scanHistory.value = scanHistory.value.filter(item => item.id !== itemId)

                const itemNutrition = extractNutritionFromScan(itemToDelete)
                todaysNutrition.value = {
                    calories: Math.max(0, todaysNutrition.value.calories - itemNutrition.calories),
                    protein: Math.max(0, todaysNutrition.value.protein - itemNutrition.protein),
                    carbs: Math.max(0, todaysNutrition.value.carbs - itemNutrition.carbs),
                    fats: Math.max(0, todaysNutrition.value.fats - itemNutrition.fats)
                }
            }

            deletingItems.value.delete(itemId)

            performBackgroundDelete(itemId)
        }, 300)
    } catch (error) {
        console.error('Error deleting food item:', error)
        deletingItems.value.delete(itemId)
        await loadScanHistory("Error deleting food item")
    }
}

function extractNutritionFromScan(scan: any) {
    const amount = scan.amount || 1.0

    if ((scan.type === 'food' || scan.type === 'favorite') && scan.data.total) {
        return {
            calories: scan.data.total.calories || 0,
            protein: scan.data.total.protein || 0,
            carbs: scan.data.total.carbs || 0,
            fats: scan.data.total.fat || 0
        }
    } else if (scan.type === 'barcode' && scan.data.nutriments) {
        return {
            calories: (scan.data.nutriments.energy_kcal_100g || 0) * amount,
            protein: (scan.data.nutriments.proteins_100g || 0) * amount,
            carbs: (scan.data.nutriments.carbohydrates_100g || 0) * amount,
            fats: (scan.data.nutriments.fat_100g || 0) * amount
        }
    }

    return { calories: 0, protein: 0, carbs: 0, fats: 0 }
}

async function performBackgroundDelete(itemId: number) {
    try {
        await ScanHistory.remove(itemId)

        const backgroundOperations = [
            WidgetDataManager.updateWidgetData().catch(err =>
                console.error('Widget update failed:', err)
            ),
            syncToHealthKit().catch(err =>
                console.error('HealthKit sync failed:', err)
            ),
            NotificationService.resetInactivityTimer().catch(err =>
                console.error('Notification reset failed:', err)
            )
        ]

        Promise.allSettled(backgroundOperations).then(() => {
            console.log('✅ All background operations completed')
        }).catch(err => {
            console.error('Background operations failed:', err)
        })

        console.log('✅ Item deleted from storage successfully')
    } catch (error) {
        console.error('❌ Failed to delete item from storage:', error)
        console.log('🔄 Rolling back UI state due to storage error')
        await loadScanHistory("loadScanHistoryAndStreak Failed")
    }
}
</script>

<style scoped>
.home-view {
    height: 100vh;
    height: calc(100vh - max(44px, env(safe-area-inset-top, 44px)));
    background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
    background-size: 100% 100vh;
    background-position: bottom;
    color: white;
    padding: 0 14px 16px;
    margin-top: max(44px, env(safe-area-inset-top, 44px));
    padding-bottom: max(80px, calc(80px + env(safe-area-inset-bottom, 0px)));
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;

}



.add-button {
    position: fixed;
    bottom: 90px;
    right: 10px;
    width: 56px;
    height: 56px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1e1e2e;
    text-decoration: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;
}

a {
    text-decoration: none;
}
</style>
