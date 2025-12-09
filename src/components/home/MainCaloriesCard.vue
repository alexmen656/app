<template>
    <div class="main-card" @click="$emit('click')">
        <div class="calories-section">
            <h2 class="calories-number">{{ caloriesDisplay }}</h2>
            <p class="calories-label">{{ labelDisplay }}</p>
            <div class="streak-line" @click.stop="$emit('streak-click')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff6b35">
                    <path
                        d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
                </svg>
                <span class="streak-text">{{ currentStreak }} {{ $t('streak.days') }}</span>
            </div>
        </div>
        <div class="progress-ring">
            <svg class="progress-svg" width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#2a2d37" stroke-width="6" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="white" stroke-width="6" fill="none" stroke-dasharray="251.2"
                    :stroke-dashoffset="251.2 - (251.2 * progress)" stroke-linecap="round" class="progress-circle"
                    transform="rotate(-90 50 50)" />
            </svg>
            <div class="flame-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path
                        d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    caloriesDisplay: string
    labelDisplay: string
    currentStreak: number
    progress: number
}>()

defineEmits<{
    'click': []
    'streak-click': []
}>()
</script>

<style scoped>
.main-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    backdrop-filter: blur(10px);
    height: 140px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.calories-number {
    font-size: 48px;
    font-weight: 700;
    margin: 0;
    line-height: 1;
}

.calories-label {
    font-size: 16px;
    opacity: 0.8;
    margin: 5px 0 0 0;
}

.streak-line {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.streak-line:hover {
    opacity: 0.8;
}

.streak-text {
    font-size: 14px;
    font-weight: 500;
    color: #ff6b35;
}

.progress-ring {
    position: relative;
    width: 100px;
    height: 100px;
}

.progress-circle {
    transition: stroke-dashoffset 0.8s ease-in-out;
}

.flame-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
}
</style>
