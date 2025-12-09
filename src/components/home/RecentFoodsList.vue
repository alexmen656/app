<template>
    <div class="recent-section">
        <h3 class="section-title">{{ $t('home.recentlyUploaded') }}</h3>
        <div v-if="foods.length === 0" class="empty-state">
            <div class="empty-icon">📱</div>
            <p>{{ $t('home.noScansYet') }}</p>
            <p class="empty-subtitle">{{ $t('home.noScansSubtitle') }}</p>
        </div>
        <div v-else class="food-item-wrapper" v-for="item in foods" :key="item.id"
            :class="{ 'swiped': swipedItems.has(item.id), 'deleting': deletingItems.has(item.id) }">
            <div class="food-item" @click="$emit('item-click', item)" @touchstart="handleTouchStart($event, item.id)"
                @touchmove="handleTouchMove($event, item.id)" @touchend="handleTouchEnd(item.id, $event)"
                @mousedown="handleMouseDown($event, item.id)" @mousemove="handleMouseMove($event, item.id)"
                @mouseup="handleMouseEnd(item.id, $event)" @mouseleave="handleMouseEnd(item.id, $event)">
                <div class="food-image">
                    <img v-if="item.image && !item.image.includes('placeholder') && !item.image.includes('image_')"
                        :src="item.image" :alt="item.name" />
                    <img v-else-if="item.image && item.image.includes('image_')" :src="getImageSrc(item)"
                        :alt="item.name" />
                    <span v-else-if="item.icon" class="food-db-icon">{{ item.icon }}</span>
                    <span v-else>{{ item.type === 'food' ? '🍽️' : '📦' }}</span>
                </div>
                <div class="food-info">
                    <h4 class="food-name">{{ item.name }}</h4>
                    <div class="food-calories">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff6b35">
                            <path
                                d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
                        </svg>
                        <span>{{ item.calories }} kcal</span>
                    </div>
                    <div class="food-macros">
                        <span class="macro-item protein-color">
                            <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path fill="#ff6b6b"
                                    d="M224 329.2C224 337.7 220.6 345.8 214.6 351.8L187.8 378.6C175.5 390.9 155.3 390 138.4 385.8C133.8 384.7 128.9 384 123.9 384C90.8 384 63.9 410.9 63.9 444C63.9 477.1 90.8 504 123.9 504C130.2 504 135.9 509.7 135.9 516C135.9 549.1 162.8 576 195.9 576C229 576 255.9 549.1 255.9 516C255.9 511 255.3 506.2 254.1 501.5C249.9 484.6 248.9 464.4 261.3 452.1L288.1 425.3C294.1 419.3 302.2 415.9 310.7 415.9L399.9 415.9C406.2 415.9 412.3 415.6 418.4 414.9C430.3 413.7 434.8 399.4 429.2 388.9C420.7 373.1 415.9 355.1 415.9 335.9C415.9 274 466 223.9 527.9 223.9C535.9 223.9 543.6 224.7 551.1 226.3C562.8 228.8 575.2 220.4 573.1 208.7C558.4 126.4 486.4 63.9 399.9 63.9C302.7 63.9 223.9 142.7 223.9 239.9L223.9 329.1z" />
                            </svg>
                            {{ item.protein }}g
                        </span>
                        <span class="macro-item carbs-color">
                            <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path fill="#ffa726"
                                    d="M79.7 234.6c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0L134.1 444.3 49.4 529c-9.4 9.4-24.5 9.4-33.9 0-9.4-9.4-9.4-24.6 0-33.9l84.7-84.7-30.5-30.5c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zm104-104c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zM495.2 15c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.2L529.2 49 414.7 163.4c7.7 1 15.2 3 22.5 5.9L495.5 111c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-52.7 52.7 39 39c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1c6.2-4.1 14.7-3.4 20.1 2.1l39 39 52.7-52.7c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-58.3 58.3c2.8 7.1 4.7 14.5 5.7 22.1L495.2 15z" />
                            </svg>
                            {{ item.carbs }}g
                        </span>
                        <span class="macro-item fats-color">
                            <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path fill="#42a5f5"
                                    d="M240 64C240 46.3 254.3 32 272 32L368 32C385.7 32 400 46.3 400 64C400 81.7 385.7 96 368 96L368 199.3C432.9 219.7 480 280.3 480 352L480 544C480 579.3 451.3 608 416 608L224 608C188.7 608 160 579.3 160 544L160 352C160 280.4 207.1 219.7 272 199.3L272 96C254.3 96 240 81.7 240 64zM320 480C355.3 480 384 447.6 384 416C384 394.8 355.1 351.5 336.1 325.4C328 314.3 311.9 314.3 303.8 325.4C284.8 351.5 255.9 394.8 255.9 416C255.9 447.6 284.6 480 319.9 480z" />
                            </svg>
                            {{ item.fats }}g
                        </span>
                    </div>
                </div>
                <div class="food-time">{{ item.time }}</div>
            </div>
            <div class="delete-action">
                <button @click="$emit('delete', item.id)" class="delete-button">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                    {{ $t('delete') }}
                </button>
            </div>
        </div>
        <div class="show-all-link">
            <router-link to="/all-scans" class="show-all-btn">
                {{ $t('home.showAllScans') }}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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

const props = defineProps<{
    foods: FoodItem[]
    imageUris: Map<string, string>
    deletingItems: Set<number>
}>()

defineEmits<{
    'item-click': [item: FoodItem]
    'delete': [id: number]
}>()

const swipeStates = ref<Map<string, { startX: number, startY: number, currentX: number, isDragging: boolean, isOpen: boolean }>>(new Map())
const swipedItems = ref<Set<number>>(new Set())

function getImageSrc(item: FoodItem): string {
    if (!item.image) return ''
    if (item.image.includes('placeholder')) return item.image
    if (item.image.startsWith('image_')) {
        return props.imageUris.get(item.image) || ''
    }
    return item.image
}

function closeAllSwipedItems(exceptId?: string) {
    swipeStates.value.forEach((state, id) => {
        if (id !== exceptId && state.isOpen) {
            state.isOpen = false
            swipedItems.value.delete(parseInt(id))
        }
    })
}

function handleTouchStart(event: TouchEvent, itemId: number) {
    const touch = event.touches[0]
    const id = itemId.toString()
    const existingState = swipeStates.value.get(id) || { startX: 0, startY: 0, currentX: 0, isDragging: false, isOpen: false }

    swipeStates.value.set(id, {
        ...existingState,
        startX: touch.clientX,
        startY: touch.clientY,
        isDragging: true
    })
}

function handleTouchMove(event: TouchEvent, itemId: number) {
    const id = itemId.toString()
    const state = swipeStates.value.get(id)
    if (!state?.isDragging) return

    const touch = event.touches[0]
    const deltaX = touch.clientX - state.startX
    const deltaY = touch.clientY - state.startY

    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY)
    const isSignificantSwipe = Math.abs(deltaX) > 20

    if (isHorizontalSwipe && isSignificantSwipe) {
        event.preventDefault()
    }
}

function handleTouchEnd(itemId: number, event: TouchEvent) {
    const id = itemId.toString()
    const state = swipeStates.value.get(id)
    if (!state?.isDragging) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - state.startX
    const deltaY = touch.clientY - state.startY

    state.isDragging = false

    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY)
    const isSignificantSwipe = Math.abs(deltaX) > 40

    if (isHorizontalSwipe && isSignificantSwipe) {
        closeAllSwipedItems(id)

        if (deltaX < -40) {
            state.isOpen = true
            swipedItems.value.add(itemId)
        } else if (deltaX > 40) {
            state.isOpen = false
            swipedItems.value.delete(itemId)
        }
    }
}

function handleMouseDown(event: MouseEvent, itemId: number) {
    const id = itemId.toString()
    const existingState = swipeStates.value.get(id) || { startX: 0, startY: 0, currentX: 0, isDragging: false, isOpen: false }

    swipeStates.value.set(id, {
        ...existingState,
        startX: event.clientX,
        startY: event.clientY,
        isDragging: true
    })
}

function handleMouseMove(_event: MouseEvent, _itemId: number) {
    // No need to do anything during mouse move for this implementation
}

function handleMouseEnd(itemId: number, event: MouseEvent) {
    const id = itemId.toString()
    const state = swipeStates.value.get(id)
    if (!state?.isDragging) return

    const deltaX = event.clientX - state.startX
    const deltaY = event.clientY - state.startY

    state.isDragging = false

    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY)
    const isSignificantSwipe = Math.abs(deltaX) > 40

    if (isHorizontalSwipe && isSignificantSwipe) {
        closeAllSwipedItems(id)

        if (deltaX < -40) {
            state.isOpen = true
            swipedItems.value.add(itemId)
        } else if (deltaX > 40) {
            state.isOpen = false
            swipedItems.value.delete(itemId)
        }
    }
}
</script>

<style scoped>
.section-title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 12px;
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
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

.food-item {
    display: flex;
    align-items: center;
    gap: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 8px;
    padding-right: 12px;
    backdrop-filter: blur(10px);
    flex: 1;
    margin-bottom: 0;
}

.food-item-wrapper {
    position: relative;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.food-item-wrapper.deleting {
    opacity: 0;
    transform: translateX(-100%);
    height: 0;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

.delete-action {
    width: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.food-item-wrapper.swiped .delete-action {
    width: 80px;
}

.delete-button {
    background: #ff4757;
    border: none;
    color: white;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: all 0.2s;
    min-height: 60px;
    justify-content: center;
    width: 70px;
    margin-left: 10px;
    white-space: nowrap;
}

.delete-button:hover {
    background: #ff3742;
    transform: scale(1.05);
}

.delete-button:active {
    background: #ff1e2e;
    transform: scale(0.95);
}

.delete-button svg {
    width: 16px;
    height: 16px;
}

.food-image {
    width: 72px;
    height: 72px;
    border-radius: 10px;
    overflow: hidden;
    background: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.food-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.food-db-icon {
    font-size: 30px;
}

.food-info {
    flex: 1;
}

.food-name {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 8px 0;
}

.food-calories {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 8px;
    font-size: 14px;
}

.food-macros {
    display: flex;
    gap: 10px;
    font-size: 12px;
}

.macro-item {
    display: flex;
    align-items: center;
    gap: 2px;
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

.food-time {
    font-size: 14px;
    opacity: 0.6;
}

.show-all-link {
    text-align: center;
}

.show-all-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    color: white;
    text-decoration: none;
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    backdrop-filter: blur(10px);
    transition: all 0.2s;
}

.show-all-btn:active {
    transform: translateY(0px);
    background: rgba(255, 255, 255, 0.2);
}
</style>
