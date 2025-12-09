<template>
  <div id="app">
    <router-view v-slot="{ Component, route }">
      <transition :name="getTransitionName(route)" mode="out-in" @before-leave="onBeforeLeave" @enter="onEnter">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { analyticsActions } from './stores/analyticsStore'

const router = useRouter()

onMounted(async () => {
  try {
    await analyticsActions.loadAnalyticsData('day')
  } catch (error) {
    console.warn('Failed to preload analytics data:', error)
  }
})

const navigationFlow = {
  '/': {
    left: '/yesterday',
    position: 0
  },
  '/yesterday': {
    right: '/',
    left: '/analytics',
    position: 1
  },
  '/analytics': {
    right: '/yesterday',
    left: '/settings',
    position: 2
  },
  '/settings': {
    right: '/analytics',
    position: 3
  },
  '/onboarding': { position: -1 },
  '/scan': { position: -1 },
  '/nutrition': { position: -1 },
  '/streak': { position: -1 },
  '/profile/edit': { position: -1 }
}

function getTransitionName(route: any) {
  const from = router.currentRoute.value.path
  const to = route.path

  const fromPos = navigationFlow[from as keyof typeof navigationFlow]?.position ?? 0
  const toPos = navigationFlow[to as keyof typeof navigationFlow]?.position ?? 0

  if (fromPos < toPos) {
    return 'slide-left'
  } else if (fromPos > toPos) {
    return 'slide-right'
  }

  return 'fade'
}

function onBeforeLeave(el: Element) {
  const element = el as HTMLElement
  element.style.position = 'absolute'
  element.style.width = '100%'
  element.style.height = '100%'
}

function onEnter(el: Element) {
  setTimeout(() => {
    const element = el as HTMLElement
    element.style.position = ''
    element.style.width = ''
    element.style.height = ''
  }, 150)
}
</script>

<style>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#app {
  position: relative;
  overflow-x: hidden;
}

.slide-left-leave-active,
.slide-right-leave-active {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
}
</style>
