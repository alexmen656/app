<template>
  <div class="native-scan-container">
    <div class="header">
      <button class="header-btn back-btn" @click="handleBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
      <h1 class="header-title">{{ $t('app.scanner') }}</h1>
      <div class="header-btn placeholder"></div>
    </div>
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">{{ loadingText }}</p>
    </div>
    <div v-else-if="!hasPermission" class="permission-container">
      <div class="permission-content">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" class="permission-icon">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
            stroke="currentColor" stroke-width="2" />
          <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2" />
          <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="2" />
        </svg>
        <h2>{{ $t('scanner.permission.title') }}</h2>
        <p>{{ $t('scanner.permission.description') }}</p>
        <button class="permission-btn" @click="requestPermissionAndStart">
          {{ $t('scanner.permission.grant') }}
        </button>
      </div>
    </div>
    <div v-else class="scan-content">
      <div class="mode-selector">
        <div class="mode-tabs">
          <button class="mode-tab" :class="{ active: selectedMode === 'barcode' }" @click="changeMode('barcode')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="6" width="18" height="2" fill="currentColor" />
              <rect x="3" y="10" width="10" height="1" fill="currentColor" />
              <rect x="15" y="10" width="6" height="1" fill="currentColor" />
              <rect x="3" y="12" width="14" height="1" fill="currentColor" />
              <rect x="3" y="14" width="8" height="1" fill="currentColor" />
              <rect x="13" y="14" width="8" height="1" fill="currentColor" />
              <rect x="3" y="16" width="18" height="2" fill="currentColor" />
            </svg>
            <span>{{ $t('scanner.modes.barcode') }}</span>
          </button>
          <button class="mode-tab" :class="{ active: selectedMode === 'photo' }" @click="changeMode('photo')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
              <path
                d="M9 2H15L17 5H21C21.5304 5 22.0391 5.21071 22.4142 5.58579C22.7893 5.96086 23 6.46957 23 7V19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V7C1 6.46957 1.21071 5.96086 1.58579 5.58579C1.96086 5.21071 2.46957 5 3 5H7L9 2Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>{{ $t('scanner.modes.photo') }}</span>
          </button>
        </div>
      </div>

      <!-- Instructions -->
      <div class="instructions">
        <p v-if="selectedMode === 'barcode'">{{ $t('scanner.instructions.barcode') }}</p>
        <p v-else>{{ $t('scanner.instructions.photo') }}</p>
      </div>

      <!-- Start scanning button -->
      <div class="scan-button-container">
        <button class="scan-button" :disabled="isScanning" @click="startNativeScanning">
          <svg v-if="!isScanning" width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
            <polygon points="10,8 16,12 10,16" fill="currentColor" />
          </svg>
          <div v-else class="scanning-indicator">
            <div class="pulse"></div>
          </div>
          <span>{{ isScanning ? $t('scanner.scanning') : $t('scanner.start') }}</span>
        </button>
      </div>

      <!-- Features list -->
      <div class="features-list">
        <div class="feature-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
          </svg>
          <span>{{ $t('scanner.features.fast') }}</span>
        </div>
        <div class="feature-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
            <path
              d="M20.188 10.934c.388.472.582.707.582 1.066 0 .359-.194.594-.582 1.066C18.768 14.79 15.636 18 12 18c-3.636 0-6.768-3.21-8.188-4.934-.388-.472-.582-.707-.582-1.066 0-.359.194-.594.582-1.066C5.232 9.21 8.364 6 12 6c3.636 0 6.768 3.21 8.188 4.934z"
              stroke="currentColor" stroke-width="2" />
          </svg>
          <span>{{ $t('scanner.features.accurate') }}</span>
        </div>
        <div class="feature-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" />
            <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2" />
            <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2" />
          </svg>
          <span>{{ $t('scanner.features.fullscreen') }}</span>
        </div>
      </div>
    </div>

    <!-- Error toast -->
    <div v-if="errorMessage" class="error-toast" @click="errorMessage = ''">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBarcodeScanner } from '../composables/useBarcodeScanner'

const { t } = useI18n()
const router = useRouter()

// Use our native barcode scanner composable
const {
  isScanning,
  hasPermission,
  currentMode,
  checkPermission,
  requestPermission,
  startScanning,
  stopScanning
} = useBarcodeScanner()

// Component state
const isLoading = ref(true)
const loadingText = ref(t('scanner.checking'))
const selectedMode = ref('barcode')
const errorMessage = ref('')

// Lifecycle
onMounted(async () => {
  await initializeScanner()
})

onBeforeUnmount(() => {
  if (isScanning.value) {
    stopScanning()
  }
})

// Methods
const initializeScanner = async () => {
  try {
    loadingText.value = t('scanner.checking')

    // Check if we have camera permission
    await checkPermission()

    isLoading.value = false
  } catch (error) {
    console.error('Error initializing scanner:', error)
    showError(t('scanner.errors.initialization'))
    isLoading.value = false
  }
}

const requestPermissionAndStart = async () => {
  try {
    isLoading.value = true
    loadingText.value = t('scanner.requesting')

    const granted = await requestPermission()
    if (!granted) {
      showError(t('scanner.errors.permissionDenied'))
    }

    isLoading.value = false
  } catch (error) {
    console.error('Error requesting permission:', error)
    showError(t('scanner.errors.permission'))
    isLoading.value = false
  }
}

const startNativeScanning = async () => {
  try {
    await startScanning({
      mode: selectedMode.value,
      camera: 'back',
      showControls: true,
      timeout: 60 // 60 seconds timeout
    })
  } catch (error) {
    console.error('Error starting scanner:', error)

    if (error.message.includes('permission')) {
      showError(t('scanner.errors.permissionDenied'))
    } else if (error.message.includes('SCAN_CANCELLED')) {
      // User cancelled, no error needed
    } else {
      showError(t('scanner.errors.start'))
    }
  }
}

const changeMode = (mode) => {
  selectedMode.value = mode
}

const handleBack = () => {
  router.go(-1)
}

const showError = (message) => {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = ''
  }, 5000)
}
</script>

&lt;style scoped&gt;
.native-scan-container {
min-height: 100vh;
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
position: relative;
overflow: hidden;
}

/* Header */
.header {
position: fixed;
top: 0;
left: 0;
right: 0;
height: 100px;
z-index: 10;
display: flex;
align-items: center;
justify-content: space-between;
padding: 50px 20px 20px;
background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 100%);
}

.header-btn {
width: 44px;
height: 44px;
border-radius: 22px;
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(10px);
border: none;
color: white;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
transition: all 0.2s ease;
}

.header-btn:hover {
background: rgba(255, 255, 255, 0.25);
transform: scale(1.05);
}

.header-btn.placeholder {
opacity: 0;
pointer-events: none;
}

.header-title {
color: white;
font-size: 18px;
font-weight: 600;
margin: 0;
text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Loading state */
.loading-container {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
min-height: calc(100vh - 100px);
padding: 120px 20px 20px;
}

.loading-spinner {
width: 48px;
height: 48px;
border: 4px solid rgba(255, 255, 255, 0.3);
border-top: 4px solid white;
border-radius: 50%;
animation: spin 1s linear infinite;
margin-bottom: 20px;
}

.loading-text {
color: white;
font-size: 16px;
font-weight: 500;
text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
margin: 0;
}

/* Permission state */
.permission-container {
display: flex;
align-items: center;
justify-content: center;
min-height: calc(100vh - 100px);
padding: 120px 20px 20px;
}

.permission-content {
text-align: center;
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(20px);
border-radius: 20px;
padding: 40px 30px;
max-width: 320px;
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.permission-icon {
color: white;
margin-bottom: 20px;
opacity: 0.8;
}

.permission-content h2 {
color: white;
font-size: 22px;
font-weight: 600;
margin: 0 0 15px 0;
text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.permission-content p {
color: rgba(255, 255, 255, 0.9);
font-size: 16px;
line-height: 1.5;
margin: 0 0 25px 0;
text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.permission-btn {
background: white;
color: #667eea;
border: none;
border-radius: 12px;
padding: 14px 28px;
font-size: 16px;
font-weight: 600;
cursor: pointer;
transition: all 0.2s ease;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.permission-btn:hover {
transform: translateY(-1px);
box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

/* Main content */
.scan-content {
padding: 120px 20px 40px;
min-height: calc(100vh - 100px);
display: flex;
flex-direction: column;
}

/* Mode selector */
.mode-selector {
margin-bottom: 30px;
}

.mode-tabs {
display: flex;
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border-radius: 25px;
padding: 4px;
gap: 4px;
max-width: 320px;
margin: 0 auto;
}

.mode-tab {
display: flex;
align-items: center;
gap: 8px;
padding: 12px 20px;
border: none;
border-radius: 20px;
background: transparent;
color: rgba(255, 255, 255, 0.7);
font-size: 14px;
font-weight: 500;
cursor: pointer;
transition: all 0.3s ease;
flex: 1;
justify-content: center;
}

.mode-tab.active {
background: rgba(255, 255, 255, 0.9);
color: #333;
transform: scale(1.02);
}

.mode-tab:hover:not(.active) {
background: rgba(255, 255, 255, 0.15);
color: white;
}

/* Instructions */
.instructions {
text-align: center;
margin-bottom: 40px;
}

.instructions p {
color: rgba(255, 255, 255, 0.9);
font-size: 16px;
line-height: 1.5;
margin: 0;
text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Scan button */
.scan-button-container {
text-align: center;
margin-bottom: 60px;
}

.scan-button {
display: inline-flex;
flex-direction: column;
align-items: center;
gap: 12px;
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(20px);
border: 2px solid rgba(255, 255, 255, 0.3);
border-radius: 50%;
width: 120px;
height: 120px;
color: white;
cursor: pointer;
transition: all 0.3s ease;
position: relative;
overflow: hidden;
}

.scan-button:hover:not(:disabled) {
transform: scale(1.05);
background: rgba(255, 255, 255, 0.2);
border-color: rgba(255, 255, 255, 0.4);
}

.scan-button:disabled {
opacity: 0.7;
cursor: not-allowed;
}

.scan-button span {
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.5px;
text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.scanning-indicator {
position: relative;
width: 32px;
height: 32px;
}

.pulse {
width: 32px;
height: 32px;
border: 2px solid white;
border-radius: 50%;
animation: pulse 2s infinite;
}

/* Features list */
.features-list {
display: flex;
flex-direction: column;
gap: 20px;
margin-top: auto;
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border-radius: 16px;
padding: 24px;
}

.feature-item {
display: flex;
align-items: center;
gap: 16px;
color: white;
font-size: 14px;
font-weight: 500;
text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.feature-item svg {
opacity: 0.8;
flex-shrink: 0;
}

/* Error toast */
.error-toast {
position: fixed;
top: 100px;
left: 20px;
right: 20px;
background: rgba(255, 59, 48, 0.9);
backdrop-filter: blur(10px);
color: white;
padding: 16px 20px;
border-radius: 12px;
box-shadow: 0 8px 24px rgba(255, 59, 48, 0.3);
z-index: 100;
cursor: pointer;
animation: slideDown 0.3s ease;
}

.error-toast p {
margin: 0;
font-size: 14px;
font-weight: 500;
text-align: center;
}

/* Animations */
@keyframes spin {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}

@keyframes pulse {
0% {
transform: scale(1);
opacity: 1;
}
100% {
transform: scale(1.4);
opacity: 0;
}
}

@keyframes slideDown {
from {
transform: translateY(-100%);
opacity: 0;
}
to {
transform: translateY(0);
opacity: 1;
}
}

/* Responsive */
@media (max-width: 390px) {
.permission-content {
padding: 30px 20px;
margin: 0 10px;
}

.scan-content {
padding: 110px 15px 30px;
}

.scan-button {
width: 100px;
height: 100px;
}
}
&lt;/style&gt;
