<template>
    <div class="macros-grid">
        <div class="macro-card protein" @click="$emit('protein-click')">
            <div class="macro-amount">{{ proteinDisplay }}</div>
            <div class="macro-label">{{ proteinLabel }}</div>
            <div class="macro-progress">
                <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="24" stroke="#2a2d37" stroke-width="5" fill="none" />
                    <circle cx="30" cy="30" r="24" stroke="#ff6b6b" stroke-width="5" fill="none"
                        stroke-dasharray="150.8" :stroke-dashoffset="calculateOffset(proteinProgress)"
                        stroke-linecap="round" transform="rotate(-90 30 30)" class="progress-circle" />
                </svg>
                <div class="macro-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path fill="#ff6b6b"
                            d="M224 329.2C224 337.7 220.6 345.8 214.6 351.8L187.8 378.6C175.5 390.9 155.3 390 138.4 385.8C133.8 384.7 128.9 384 123.9 384C90.8 384 63.9 410.9 63.9 444C63.9 477.1 90.8 504 123.9 504C130.2 504 135.9 509.7 135.9 516C135.9 549.1 162.8 576 195.9 576C229 576 255.9 549.1 255.9 516C255.9 511 255.3 506.2 254.1 501.5C249.9 484.6 248.9 464.4 261.3 452.1L288.1 425.3C294.1 419.3 302.2 415.9 310.7 415.9L399.9 415.9C406.2 415.9 412.3 415.6 418.4 414.9C430.3 413.7 434.8 399.4 429.2 388.9C420.7 373.1 415.9 355.1 415.9 335.9C415.9 274 466 223.9 527.9 223.9C535.9 223.9 543.6 224.7 551.1 226.3C562.8 228.8 575.2 220.4 573.1 208.7C558.4 126.4 486.4 63.9 399.9 63.9C302.7 63.9 223.9 142.7 223.9 239.9L223.9 329.1z" />
                    </svg>
                </div>
            </div>
        </div>
        <div class="macro-card carbs" @click="$emit('carbs-click')">
            <div class="macro-amount">{{ carbsDisplay }}</div>
            <div class="macro-label">{{ carbsLabel }}</div>
            <div class="macro-progress">
                <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="24" stroke="#2a2d37" stroke-width="5" fill="none" />
                    <circle cx="30" cy="30" r="24" stroke="#ffa726" stroke-width="5" fill="none"
                        stroke-dasharray="150.8" :stroke-dashoffset="calculateOffset(carbsProgress)"
                        stroke-linecap="round" transform="rotate(-90 30 30)" class="progress-circle" />
                </svg>
                <div class="macro-icon macro-icon-carbs">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="#ffa726"
                            d="M79.7 234.6c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0L134.1 444.3 49.4 529c-9.4 9.4-24.5 9.4-33.9 0-9.4-9.4-9.4-24.6 0-33.9l84.7-84.7-30.5-30.5c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zm104-104c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zM495.2 15c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.2L529.2 49 414.7 163.4c7.7 1 15.2 3 22.5 5.9L495.5 111c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-52.7 52.7 39 39c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1c6.2-4.1 14.7-3.4 20.1 2.1l39 39 52.7-52.7c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-58.3 58.3c2.8 7.1 4.7 14.5 5.7 22.1L495.2 15z" />
                    </svg>
                </div>
            </div>
        </div>
        <div class="macro-card fats" @click="$emit('fats-click')">
            <div class="macro-amount">{{ fatsDisplay }}</div>
            <div class="macro-label">{{ fatsLabel }}</div>
            <div class="macro-progress">
                <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="24" stroke="#2a2d37" stroke-width="5" fill="none" />
                    <circle cx="30" cy="30" r="24" stroke="#42a5f5" stroke-width="5" fill="none"
                        stroke-dasharray="150.8" :stroke-dashoffset="calculateOffset(fatsProgress)"
                        stroke-linecap="round" transform="rotate(-90 30 30)" class="progress-circle" />
                </svg>
                <div class="macro-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path fill="#42a5f5"
                            d="M240 64C240 46.3 254.3 32 272 32L368 32C385.7 32 400 46.3 400 64C400 81.7 385.7 96 368 96L368 199.3C432.9 219.7 480 280.3 480 352L480 544C480 579.3 451.3 608 416 608L224 608C188.7 608 160 579.3 160 544L160 352C160 280.4 207.1 219.7 272 199.3L272 96C254.3 96 240 81.7 240 64zM320 480C355.3 480 384 447.6 384 416C384 394.8 355.1 351.5 336.1 325.4C328 314.3 311.9 314.3 303.8 325.4C284.8 351.5 255.9 394.8 255.9 416C255.9 447.6 284.6 480 319.9 480z" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    proteinDisplay: string
    proteinLabel: string
    proteinProgress: number
    carbsDisplay: string
    carbsLabel: string
    carbsProgress: number
    fatsDisplay: string
    fatsLabel: string
    fatsProgress: number
}>()

defineEmits<{
    'protein-click': []
    'carbs-click': []
    'fats-click': []
}>()

function calculateOffset(progress: number): number {
    const clampedProgress = Math.max(0, Math.min(1, progress))
    return 150.8 - (150.8 * clampedProgress)
}
</script>

<style scoped>
.macros-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 32px;
}

.macro-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 16px;
    text-align: center;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.macro-amount {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 5px;
}

.macro-label {
    font-size: 12px;
    opacity: 0.8;
    margin-bottom: 15px;
}

.macro-progress {
    position: relative;
    display: flex;
    justify-content: center;
    width: 60px;
    height: 60px;
    margin: 0 auto;
}

.macro-progress>svg {
    width: 60px;
    height: 60px;
}

.macro-progress svg .progress-circle {
    transition: stroke-dashoffset 0.8s ease-in-out;
}

.macro-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 1;
    padding-top: 2px;
}

.macro-icon>svg {
    width: 30px;
    height: 30px;
}

.macro-icon-carbs {
    padding-top: 4px;
}

.macro-icon-carbs>svg {
    width: 26px;
    height: 26px;
}
</style>
