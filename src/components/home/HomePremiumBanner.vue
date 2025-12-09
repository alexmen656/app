<template>
    <div v-if="show" class="premium-banner" @click="$emit('upgrade')">
        <div class="banner-content">
            <div class="banner-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFD700">
                    <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            </div>
            <div class="banner-text">
                <span class="banner-title">{{ $t('premium.banner.title') }}</span>
                <span class="banner-subtitle">{{ $t('premium.banner.subtitle') }}</span>
            </div>
            <div class="banner-close" @click.stop="$emit('close')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    show: boolean
}>()

defineEmits<{
    'upgrade': []
    'close': []
}>()
</script>

<style scoped>
.premium-banner {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(255, 165, 0, 0.9));
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.banner-content {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #1e1e2e;
}

.banner-icon {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    background: rgba(30, 30, 46, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.banner-text {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.banner-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 2px;
}

.banner-subtitle {
    font-size: 13px;
    opacity: 0.8;
}

.banner-close {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background: rgba(30, 30, 46, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
}
</style>
