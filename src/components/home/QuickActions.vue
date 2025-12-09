<template>
    <div class="quick-actions">
        <div class="action-chip" @click="$emit('chat')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
            <span>{{ $t('home.chat') }}</span>
        </div>
        <div class="action-chip" @click="$emit('log-weight')">
            <svg width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path
                    d="M288 160C288 142.3 302.3 128 320 128C337.7 128 352 142.3 352 160C352 177.7 337.7 192 320 192C302.3 192 288 177.7 288 160zM410.5 192C414 182 416 171.2 416 160C416 107 373 64 320 64C267 64 224 107 224 160C224 171.2 225.9 182 229.5 192L207.7 192C179.4 192 154.5 210.5 146.4 237.6L66.4 504.2C64.8 509.4 64 514.8 64 520.2C64 551 89 576 119.8 576L520.2 576C551 576 576 551 576 520.2C576 514.8 575.2 509.4 573.6 504.2L493.6 237.7C485.5 210.6 460.6 192.1 432.3 192.1L410.5 192.1z" />
            </svg>
            <span>{{ $t('home.logWeight') }}</span>
        </div>
        <div class="action-chip" @click="$emit('feedback')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
            </svg>
            <span>{{ $t('home.giveFeedback') }}</span>
        </div>
        <div class="action-chip" @click="$emit('favorites')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{{ $t('home.favorites') }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineEmits<{
    'chat': []
    'log-weight': []
    'feedback': []
    'favorites': []
}>()
</script>

<style scoped>
.quick-actions {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
    overflow-x: auto;
    padding: 0 2px;
}

.quick-actions::-webkit-scrollbar {
    display: none;
}

.action-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.08);
    padding: 8px 12px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    backdrop-filter: blur(10px);
}

.action-chip:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
}

.action-chip:active {
    transform: translateY(0);
}

.action-chip span {
    font-size: 13px;
    font-weight: 500;
}

.action-chip svg {
    opacity: 0.9;
}
</style>
