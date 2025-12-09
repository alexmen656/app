<template>
  <div class="camera-container">
    <!-- Camera video stream -->
    <video id="barcode-video" class="camera-video" autoplay muted playsinline></video>

    <!-- Header -->
    <div class="header">
      <button class="header-btn back-btn" @click="$router.go(-1)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
      <h1 class="header-title">{{ $t('app.scanner') }}</h1>
      <button class="header-btn menu-btn bg-trans">
        <!-- <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="5" r="1" fill="currentColor" />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
        </svg>-->
      </button>
    </div>

    <!-- Free User Scan Counter (top overlay) -->
    <div v-if="!isPremiumUser && mode === 'photo'" class="scan-counter-overlay">
      <div class="scan-counter">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD700">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span>{{ remainingFoodScans }}/{{ freeLimits.DAILY_FOOD_SCANS }} {{ $t('premium.scans.remaining') }}</span>
      </div>
    </div>

    <!-- Scanning area overlay -->
    <div v-if="mode === 'barcode'" class="scan-overlay">
      <div class="scan-frame"></div>
    </div>

    <!-- Mode selector -->
    <div class="mode-selector">
      <div class="mode-tabs">
        <button class="mode-tab" :class="{ active: mode === 'barcode' }" @click="mode = 'barcode'">
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
        <button class="mode-tab" :class="{ active: mode === 'photo' }" @click="switchToPhotoMode">
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

    <!-- Bottom controls -->
    <div class="bottom-controls">
      <button class="control-btn gallery-btn bg-trans" @click="switchCamera">
        <!-- <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M17 17.5V15.5C17 14.1193 15.8807 13 14.5 13H9.5C8.11929 13 7 14.1193 7 15.5V17.5"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path d="M12 7V3M12 3L9 6M12 3L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>-->
      </button>

      <div class="capture-section">
        <!-- <p class="scan-label">{{ mode === 'barcode' ? 'Scan barcode' : 'Scan food' }}</p>-->
        <div v-if="mode === 'photo'" class="shutter-btn" @click="takePhoto"></div>
        <div v-else class="barcode-indicator">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="2" fill="currentColor" />
            <rect x="3" y="10" width="10" height="1" fill="currentColor" />
            <rect x="15" y="10" width="6" height="1" fill="currentColor" />
            <rect x="3" y="12" width="14" height="1" fill="currentColor" />
            <rect x="3" y="14" width="8" height="1" fill="currentColor" />
            <rect x="13" y="14" width="8" height="1" fill="currentColor" />
            <rect x="3" y="16" width="18" height="2" fill="currentColor" />
          </svg>
        </div>
      </div>

      <button class="control-btn flash-btn" :class="{ active: flashEnabled }" @click="toggleFlash">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <!-- Premium Blocker Modal -->
    <PremiumBlocker v-if="showPremiumBlocker" :feature="'unlimited_food_scans'" :title="$t('premium.foodScans.title')"
      :description="$t('premium.foodScans.description')" :show-usage-info="true" @close="showPremiumBlocker = false"
      @upgrade="handleUpgrade" />

    <!-- Result display -->
    <!-- Overlay entfernt: Navigation erfolgt direkt nach Scan -->
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/browser';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { WidgetDataManager, StreakManager } from '../utils/widgetData';
import PremiumBlocker from '../components/PremiumBlocker.vue';
import {
  premiumManager,
  isPremiumUser,
  remainingFoodScans,
  freeLimits,
  premiumFeatures
} from '../utils/premiumManager';

const { t } = useI18n();

const mode = ref('barcode'); // 'barcode' oder 'photo'
const barcodeResult = ref('');
const router = useRouter();
const photoUrl = ref('');
const flashEnabled = ref(false);
const showPremiumBlocker = ref(false);
let videoInputDeviceId = null;
let codeReader;
let videoStream = null;
const cameraFacing = ref('environment'); // 'environment' (back) oder 'user' (front)
let isSwitchingCamera = false; // Verhindert mehrfache Kamerawechsel

const setupCamera = async (facing = 'environment') => {
  try {
    const foodBarcodeFormats = [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.ITF,
    ];

    const hints = new Map();
    hints.set('POSSIBLE_FORMATS', foodBarcodeFormats);
    hints.set('TRY_HARDER', true);
    hints.set('ASSUME_GS1', true);

    codeReader = new BrowserMultiFormatReader(hints);

    // Kamera mit facingMode öffnen - iPhone wählt automatisch die beste Kamera
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: facing,
        width: { ideal: 3840 },
        height: { ideal: 2160 },
        frameRate: { ideal: 60 }
      }
    });

    const videoElement = document.getElementById('barcode-video');
    if (videoElement) {
      videoElement.srcObject = videoStream;
      await videoElement.play();
    }

    // ImageCapture für besseren Fokus
    const track = videoStream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    const capabilities = await imageCapture.getPhotoCapabilities();

    if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
      await track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] });
    } else if (capabilities.focusMode && capabilities.focusMode.includes('auto')) {
      await track.applyConstraints({ advanced: [{ focusMode: 'auto' }] });
    } else {
      console.warn('Fokusmodus nicht verfügbar, Kamera nutzt Standardfokus');
    }


    // ZXing starten
    await codeReader.decodeFromVideoDevice(
      undefined, // Keine spezifische deviceId, verwende aktuellen Stream
      'barcode-video',
      async (result, err, controls) => {
        if (mode.value === 'barcode' && result) {
          const code = result.getText();
          const format = result.getBarcodeFormat();
          barcodeResult.value = code;

          // Foto erstellen
          let scanPhoto = '';
          if (videoElement) {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            scanPhoto = canvas.toDataURL('image/jpeg', 1);
            photoUrl.value = scanPhoto;
          }

          await controls.stop();
          const query = { barcode: code, format, photo: scanPhoto };
          router.push({ name: 'Nutrition', query });
        }
      }
    );

  } catch (error) {
    console.error('Camera setup error:', error);
    barcodeResult.value = 'Kamera-Fehler: ' + error.message;
  }
};

const switchCamera = async () => {
  if (isSwitchingCamera) return; // Verhindert mehrfache gleichzeitige Wechsel

  isSwitchingCamera = true;
  console.log('Switching camera from:', cameraFacing.value);

  try {
    // Erst die Kamera komplett stoppen
    stopCamera();

    // Warte länger, damit die Kamera vollständig gestoppt wird
    await new Promise(resolve => setTimeout(resolve, 300));

    // Wechsel zwischen Front- und Rückkamera
    const newFacing = cameraFacing.value === 'environment' ? 'user' : 'environment';
    cameraFacing.value = newFacing;

    console.log('Switching camera to:', newFacing);

    // Neue Kamera starten
    await setupCamera(newFacing);

    console.log('Camera switched successfully to:', cameraFacing.value);

  } catch (error) {
    console.error('Error switching camera:', error);
    // Bei Fehler versuche mit der ursprünglichen Kamera fortzufahren
    try {
      await setupCamera(cameraFacing.value);
    } catch (fallbackError) {
      console.error('Fallback camera setup failed:', fallbackError);
    }
  } finally {
    // Nach einer längeren Verzögerung wieder Kamerawechsel erlauben
    setTimeout(() => {
      isSwitchingCamera = false;
      console.log('Camera switching unlocked');
    }, 1000); // Erhöht auf 1 Sekunde
  }
};

const stopCamera = () => {
  console.log('Stopping camera...');

  // ZXing CodeReader stoppen
  if (codeReader && typeof codeReader.reset === 'function') {
    try {
      codeReader.reset();
      console.log('CodeReader reset');
    } catch (error) {
      console.error('Error resetting codeReader:', error);
    }
  }

  // Video Stream stoppen
  if (videoStream) {
    try {
      videoStream.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.kind);
      });
      videoStream = null;
    } catch (error) {
      console.error('Error stopping video stream:', error);
    }
  }

  // Video Element leeren
  const videoElement = document.getElementById('barcode-video');
  if (videoElement) {
    try {
      videoElement.srcObject = null;
      console.log('Video element cleared');
    } catch (error) {
      console.error('Error clearing video element:', error);
    }
  }

  console.log('Camera stopped completely');
};

const analyzeFoodPhoto = async (photoDataUrl) => {
  try {
    // Convert data URL to blob
    const response = await fetch(photoDataUrl);
    const blob = await response.blob();

    // Create form data
    const formData = new FormData();
    formData.append('image', blob, 'photo.jpg');

    // Send to KaloriQ Food Analyze API
    const apiResponse = await fetch('https://api.kalbuddy.com/api/food/analyze', {
      method: 'POST',
      body: formData
    });

    if (!apiResponse.ok) {
      throw new Error(`API error: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    if (!data.success || !data.data) {
      throw new Error('Food analysis failed');
    }

    // Prepare food data for NutritionView
    const foodData = {
      name: data.data.name || 'Unbekanntes Essen',
      foods: data.data.foods || [],
      total: data.data.total || { calories: 0, protein: 0, carbs: 0, fat: 0 },
      confidence: data.data.confidence || 'medium',
      notes: data.data.notes || '',
      timestamp: data.data.timestamp || new Date().toISOString()
    };

    // Stop camera before navigation
    stopCamera();

    // Navigate to NutritionView with food data
    router.push({
      name: 'Nutrition',
      query: {
        foodData: JSON.stringify(foodData),
        photo: photoDataUrl
      }
    });

  } catch (error) {
    console.error('Food analysis error:', error);

    // Stop camera and navigate anyway with basic data
    stopCamera();

    router.push({
      name: 'Nutrition',
      query: {
        foodData: JSON.stringify({
          foods: [{ name: t('home.scannedFood'), calories: 0, protein: 0, carbs: 0, fat: 0 }],
          total: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          confidence: 'low',
          notes: t('nutrition.analysisFailed'),
          error: true
        }),
        photo: photoDataUrl
      }
    });
  }
};

const takePhoto = async () => {
  // Premium-Check für Food-Scans
  if (!await premiumManager.canAccessFeature(premiumFeatures.UNLIMITED_FOOD_SCANS)) {
    showPremiumBlocker.value = true;
    return;
  }

  const videoElement = document.getElementById('barcode-video');
  if (!videoElement) return;

  // Usage für Free-User erhöhen
  if (!isPremiumUser.value) {
    await premiumManager.incrementFoodScanUsage();
  }

  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  photoUrl.value = canvas.toDataURL('image/jpeg');

  // Kamera-Shutter-Effekt
  const shutter = document.createElement('div');
  shutter.style.cssText = `
    position: fixed;
    top:0; left:0; width:100vw; height:100vh;
    background: white; opacity:0.8; z-index:9999; pointer-events:none;
  `;
  document.body.appendChild(shutter);
  setTimeout(() => document.body.removeChild(shutter), 100);

  // Foto an Food Analyze API senden
  try {
    await analyzeFoodPhoto(photoUrl.value);
  } catch (error) {
    console.error('Food analysis failed:', error);
    // Zeige Fehler an oder navigiere trotzdem zur NutritionView
  }
};

const toggleFlash = async () => {
  try {
    const videoElement = document.getElementById('barcode-video');
    if (videoElement && videoElement.srcObject) {
      const track = videoElement.srcObject.getVideoTracks()[0];
      if (track.getCapabilities().torch) {
        flashEnabled.value = !flashEnabled.value;
        await track.applyConstraints({ advanced: [{ torch: flashEnabled.value }] });
      }
    }
  } catch (error) {
    console.error('Flash toggle error:', error);
  }
};

watch(mode, (newMode) => {
  barcodeResult.value = '';
  photoUrl.value = '';
  console.log('Mode switched to:', newMode);
});

// Premium-Handler
const switchToPhotoMode = async () => {
  if (!await premiumManager.canAccessFeature(premiumFeatures.UNLIMITED_FOOD_SCANS)) {
    showPremiumBlocker.value = true;
    return;
  }
  mode.value = 'photo';
};

const handleUpgrade = (feature) => {
  console.log('Upgrading for feature:', feature);
  // Navigation zur Paywall erfolgt bereits in PremiumBlocker
};

onMounted(async () => {
  await setupCamera(cameraFacing.value);

  // Premium-Status initialisieren
  await premiumManager.updatePremiumStatus();
  await premiumManager.loadUsageTracking();
});

onBeforeUnmount(() => stopCamera());
</script>


<style scoped>
.camera-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  overflow: hidden;
  background: #000;
}

.camera-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 1;
}

/* Header */
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px 20px 20px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 70%, transparent 100%);
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

/* Scan Counter for Free Users */
.scan-counter-overlay {
  position: absolute;
  top: 120px;
  left: 20px;
  right: 20px;
  z-index: 15;
  display: flex;
  justify-content: center;
}

.scan-counter {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(255, 165, 0, 0.9));
  color: #1e1e2e;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
}

.header-title {
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Mode selector */
.mode-selector {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  padding: 0 20px;
}

.mode-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 4px;
  gap: 4px;
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
  min-width: 100px;
  justify-content: center;
}

.mode-tab.active {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  transform: scale(1.02);
}

.mode-tab:hover:not(.active) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Scan overlay */
.scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.scan-frame {
  width: 280px;
  height: 280px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  position: relative;
  background: transparent;
  box-shadow:
    0 0 0 9999px rgba(0, 0, 0, 0.4),
    inset 0 0 30px rgba(255, 255, 255, 0.1);
}

/*.scan-frame::before,
.scan-frame::after {
  content: '';
  position: absolute;
  width: 30px;
  height: 30px;
  border: 3px solid #00ff88;
  border-radius: 3px;
}*/

.scan-frame::before {
  top: -3px;
  left: -3px;
  border-right: none;
  border-bottom: none;
}

.scan-frame::after {
  bottom: -3px;
  right: -3px;
  border-left: none;
  border-top: none;
}

/* Bottom controls */
.bottom-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  z-index: 10;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 70%, transparent 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 30px 60px;
}

.control-btn {
  width: 56px;
  height: 56px;
  border-radius: 28px;
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

.control-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.flash-btn.active {
  background: rgba(255, 255, 0, 0.3);
  color: #ffff00;
}

.capture-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.scan-label {
  color: white;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.capture-btn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  z-index: 2;
}

.shutter-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  border: 4px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shutter-btn::before {
  content: '';
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: white;
  transition: all 0.1s ease;
}

.shutter-btn:hover {
  transform: scale(1.05);
}

.shutter-btn:active::before {
  transform: scale(0.9);
}

.barcode-indicator {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 4px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

/* Result overlay */
.result-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 20;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.result-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  max-width: 320px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.result-content h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.result-content p {
  margin: 0 0 20px 0;
  color: #666;
  font-size: 14px;
  word-break: break-all;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
}

.close-result {
  background: #007aff;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-result:hover {
  background: #0056cc;
  transform: translateY(-1px);
}

/* Responsive adjustments */
@media (max-width: 390px) {
  .scan-frame {
    width: 240px;
    height: 240px;
  }

  .bottom-controls {
    padding: 30px 20px 50px;
  }

  .header {
    padding: 45px 15px 15px;
  }
}

.bg-trans {
  background: transparent !important;
}
</style>
