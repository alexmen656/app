<template>
    <nav class="bottom-nav">
        <router-link to="/" class="nav-item" :class="{ active: isActive('/') || isActive('/yesterday') }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span class="nav-label">{{ $t('app.home') }}</span>
        </router-link>
        <router-link to="/analytics" class="nav-item" :class="{ active: isActive('/analytics') }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
            <span class="nav-label">{{ $t('app.analytics') }}</span>
        </router-link>
        <router-link to="/settings" class="nav-item" :class="{ active: isActive('/settings') }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
            </svg>
            <span class="nav-label">{{ $t('app.settings') }}</span>
        </router-link>
    </nav>
</template>
<script>
export default {
    methods: {
        isActive(route) {
            return this.$route.path === route;
        }
    }
}
</script>
<style>
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(30, 30, 46, 0.95);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 12px 20px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    height: 80px;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    text-decoration: none;
    color: white;
    opacity: 0.6;
    transition: opacity 0.2s;
    min-width: 60px;
    height: 50px;
}

.nav-item.active {
    opacity: 1;
}

.nav-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
}

.nav-label {
    font-size: 11px;
    font-weight: 500;
}
</style>