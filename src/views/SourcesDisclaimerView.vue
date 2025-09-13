<template>
  <div class="sources-disclaimer-view" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <!-- Header -->
    <header class="header">
      <button class="back-button" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
      <h1 class="title">{{ $t('sourcesDisclaimer.title') }}</h1>
    </header>

    <!-- Content Sections -->
    <div class="content">
      <!-- Educational Purpose Section -->
      <div class="section">
        <div class="section-card">
          <div class="icon-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,3L1,9L12,15L21,9V16H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
            </svg>
            <h2 class="section-title">{{ $t('sourcesDisclaimer.educational.title') }}</h2>
          </div>
          <div class="section-content">
            <p>{{ $t('sourcesDisclaimer.educational.content1') }}</p>
            <p>{{ $t('sourcesDisclaimer.educational.content2') }}</p>
            <div class="warning-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
              <span>{{ $t('sourcesDisclaimer.educational.warning') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Sources Section -->
      <div class="section">
        <div class="section-card">
          <div class="icon-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,7H13V9H11V7M11,11H13V17H11V11Z"/>
            </svg>
            <h2 class="section-title">{{ $t('sourcesDisclaimer.sources.title') }}</h2>
          </div>
          <div class="section-content">
            <div class="source-item">
              <div class="source-header">
                <div class="source-icon">🍯</div>
                <div class="source-info">
                  <h3>{{ $t('sourcesDisclaimer.sources.barcodes.title') }}</h3>
                  <p>{{ $t('sourcesDisclaimer.sources.barcodes.description') }}</p>
                </div>
              </div>
              <a href="https://world.openfoodfacts.org" target="_blank" rel="noopener" class="source-link">
                {{ $t('sourcesDisclaimer.sources.barcodes.link') }}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                </svg>
              </a>
            </div>

            <div class="source-item">
              <div class="source-header">
                <div class="source-icon">🤖</div>
                <div class="source-info">
                  <h3>{{ $t('sourcesDisclaimer.sources.ai.title') }}</h3>
                  <p>{{ $t('sourcesDisclaimer.sources.ai.description') }}</p>
                </div>
              </div>
              <div class="ai-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
                </svg>
                <span>{{ $t('sourcesDisclaimer.sources.ai.note') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Accuracy Section -->
      <div class="section">
        <div class="section-card">
          <div class="icon-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
            </svg>
            <h2 class="section-title">{{ $t('sourcesDisclaimer.accuracy.title') }}</h2>
          </div>
          <div class="section-content">
            <p>{{ $t('sourcesDisclaimer.accuracy.content1') }}</p>
            <ul class="accuracy-list">
              <li>{{ $t('sourcesDisclaimer.accuracy.point1') }}</li>
              <li>{{ $t('sourcesDisclaimer.accuracy.point2') }}</li>
              <li>{{ $t('sourcesDisclaimer.accuracy.point3') }}</li>
            </ul>
            <p>{{ $t('sourcesDisclaimer.accuracy.content2') }}</p>
          </div>
        </div>
      </div>

      <!-- Privacy Section -->
      <div class="section">
        <div class="section-card">
          <div class="icon-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
            </svg>
            <h2 class="section-title">{{ $t('sourcesDisclaimer.privacy.title') }}</h2>
          </div>
          <div class="section-content">
            <p>{{ $t('sourcesDisclaimer.privacy.content1') }}</p>
            <p>{{ $t('sourcesDisclaimer.privacy.content2') }}</p>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="section">
        <div class="section-card">
          <div class="icon-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4M20,8L12,13L4,8V6L12,11L20,6V8Z"/>
            </svg>
            <h2 class="section-title">{{ $t('sourcesDisclaimer.contact.title') }}</h2>
          </div>
          <div class="section-content">
            <p>{{ $t('sourcesDisclaimer.contact.content') }}</p>
            <a href="mailto:KalBuddy@control-center.eu" class="contact-email">
              kalbuddy@control-center.eu
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}

// Touch/Swipe functionality
let touchStartX = 0
let touchStartY = 0
const swipeThreshold = 50

function handleTouchStart(event: TouchEvent) {
  touchStartX = event.touches[0].clientX
  touchStartY = event.touches[0].clientY
}

function handleTouchMove(event: TouchEvent) {
  const currentX = event.touches[0].clientX
  const currentY = event.touches[0].clientY
  const deltaX = Math.abs(currentX - touchStartX)
  const deltaY = Math.abs(currentY - touchStartY)

  if (deltaX > deltaY && deltaX > 10) {
    event.preventDefault()
  }
}

function handleTouchEnd(event: TouchEvent) {
  const touchEndX = event.changedTouches[0].clientX
  const deltaX = touchEndX - touchStartX

  if (Math.abs(deltaX) > swipeThreshold) {
    if (deltaX > 0) {
      goBack()
    }
  }
}
</script>

<style scoped>
.sources-disclaimer-view {
  height: 100vh;
  height: calc(100vh - max(44px, env(safe-area-inset-top, 44px)));
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
  background-size: 100% 100vh;
  background-position: bottom;
  color: white;
  padding: 0 16px 16px 16px;
  margin-top: max(44px, env(safe-area-inset-top, 44px));
  padding-bottom: max(24px, env(safe-area-inset-bottom, 24px));
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  height: 44px;
  gap: 16px;
}

.back-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section {
  width: 100%;
}

.section-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.icon-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.section-content {
  line-height: 1.6;
}

.section-content p {
  margin: 0 0 16px 0;
  opacity: 0.9;
}

.section-content p:last-child {
  margin-bottom: 0;
}

.warning-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 152, 0, 0.2);
  border: 1px solid rgba(255, 152, 0, 0.4);
  border-radius: 12px;
  padding: 16px;
  color: #ff9800;
  font-weight: 500;
  margin-top: 16px;
}

.source-item {
  margin-bottom: 24px;
}

.source-item:last-child {
  margin-bottom: 0;
}

.source-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.source-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.source-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.source-info p {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

.source-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #4ade80;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.2s;
}

.source-link:hover {
  opacity: 0.8;
}

.ai-note {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 193, 7, 0.2);
  border: 1px solid rgba(255, 193, 7, 0.4);
  border-radius: 8px;
  padding: 12px;
  color: #ffc107;
  font-size: 14px;
  font-weight: 500;
}

.accuracy-list {
  margin: 16px 0;
  padding-left: 20px;
}

.accuracy-list li {
  margin-bottom: 8px;
  opacity: 0.9;
}

.contact-email {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #4ade80;
  text-decoration: none;
  font-weight: 500;
  margin-top: 8px;
  transition: opacity 0.2s;
}

.contact-email:hover {
  opacity: 0.8;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .sources-disclaimer-view {
    padding: 12px;
    padding-top: max(44px, env(safe-area-inset-top, 44px));
  }

  .title {
    font-size: 18px;
  }

  .section-title {
    font-size: 16px;
  }

  .section-card {
    padding: 16px;
  }
}
</style>
