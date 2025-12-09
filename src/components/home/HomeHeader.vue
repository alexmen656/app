<template>
    <header class="header">
        <div class="logo-section">
            <h1 class="app-title"><span style="color: #007052;">Digmio</span></h1>
        </div>
        <div class="streak" @click="toggleDropdown" ref="dropdownContainer">
            <span class="streak-content">{{ formattedDate }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
                :class="{ 'dropdown-arrow': true, 'dropdown-open': showDropdown }">
                <path d="M7 10l5 5 5-5z" />
            </svg>
            <div v-if="showDropdown" class="date-dropdown">
                <div v-for="date in availableDates" :key="date.dateString" class="date-option"
                    :class="{ 'active': date.dateString === modelValue.toDateString() }" @click.stop="selectDate(date)">
                    <span class="date-main">{{ date.display }}</span>
                    <span v-if="date.subtitle" class="date-sub">{{ date.subtitle }}</span>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
    modelValue: Date
}>()

const emit = defineEmits<{
    'update:modelValue': [date: Date]
}>()

const { t, locale } = useI18n()
const showDropdown = ref(false)
const dropdownContainer = ref<HTMLElement>()

const formattedDate = computed(() => {
    const today = new Date()
    const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000))

    const selectedDateString = props.modelValue.toDateString()
    const todayString = today.toDateString()
    const yesterdayString = yesterday.toDateString()

    if (selectedDateString === todayString) {
        return t('app.today')[0].toUpperCase() + t('app.today').slice(1)
    } else if (selectedDateString === yesterdayString) {
        return t('app.yesterday')[0].toUpperCase() + t('app.yesterday').slice(1)
    } else {
        return props.modelValue.toLocaleDateString('de-DE', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        })
    }
})

const availableDates = computed(() => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < 30; i++) {
        const date = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000))
        const dateString = date.toDateString()

        let display = ''
        let subtitle = ''

        if (i === 0) {
            display = t('today')[0].toUpperCase() + t('today').slice(1)
            subtitle = date.toLocaleDateString(locale.value, { weekday: 'long', day: 'numeric', month: 'long' })
        } else if (i === 1) {
            display = t('yesterday')[0].toUpperCase() + t('yesterday').slice(1)
            subtitle = date.toLocaleDateString(locale.value, { weekday: 'long', day: 'numeric', month: 'long' })
        } else {
            display = date.toLocaleDateString(locale.value, { weekday: 'long', day: 'numeric', month: 'long' })
        }

        dates.push({
            date,
            dateString,
            display,
            subtitle
        })
    }

    return dates
})

function toggleDropdown() {
    showDropdown.value = !showDropdown.value
}

function selectDate(dateObj: any) {
    emit('update:modelValue', new Date(dateObj.date))
    showDropdown.value = false
}

function handleClickOutside(event: Event) {
    if (dropdownContainer.value && !dropdownContainer.value.contains(event.target as Node)) {
        showDropdown.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    height: 44px;
}

.logo-section {
    display: flex;
    align-items: center;
    gap: 10px;
}

.app-title {
    font-size: 32px;
    font-weight: 600;
    margin: 0;
}

.streak {
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(255, 255, 255, 0.1);
    padding: 8px 12px;
    border-radius: 20px;
    cursor: pointer;
    position: relative;
}

.streak:hover {
    background: rgba(255, 255, 255, 0.15);
}

.dropdown-arrow {
    transition: transform 0.2s ease;
}

.dropdown-arrow.dropdown-open {
    transform: rotate(180deg);
}

.streak-content {
    flex: 1;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
}

.date-dropdown {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-80%);
    min-width: 220px;
    max-width: calc(100vw - 40px);
    background: rgba(40, 44, 52, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    margin-top: 8px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.date-option {
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.date-option:last-child {
    border-bottom: none;
}

.date-option:hover {
    background: rgba(255, 255, 255, 0.1);
}

.date-option.active {
    background: rgba(0, 112, 82, 0.3);
}

.date-main {
    display: block;
    font-weight: 500;
    font-size: 14px;
}

.date-sub {
    display: block;
    font-size: 12px;
    opacity: 0.7;
    margin-top: 2px;
}
</style>
