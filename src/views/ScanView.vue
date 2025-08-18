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
      <h1 class="header-title">Scanner</h1>
      <button class="header-btn menu-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="5" r="1" fill="currentColor" />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
        </svg>
      </button>
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
          <span>Barcode</span>
        </button>
        <button class="mode-tab" :class="{ active: mode === 'photo' }" @click="mode = 'photo'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
            <path
              d="M12 1a4 4 0 0 0-4 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3a4 4 0 0 0-4-4z"
              stroke="currentColor" stroke-width="2" />
          </svg>
          <span>Foto</span>
        </button>
      </div>
    </div>

    <!-- Bottom controls -->
    <div class="bottom-controls">
      <button class="control-btn gallery-btn" @click="switchCamera">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M17 17.5V15.5C17 14.1193 15.8807 13 14.5 13H9.5C8.11929 13 7 14.1193 7 15.5V17.5"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path d="M12 7V3M12 3L9 6M12 3L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
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

    <!-- Result display -->
    <!-- Overlay entfernt: Navigation erfolgt direkt nach Scan -->
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/browser';
import { useRouter } from 'vue-router';

const mode = ref('barcode'); // 'barcode' oder 'photo'
const barcodeResult = ref('');
const router = useRouter();
const photoUrl = ref('');
const flashEnabled = ref(false);
let videoInputDeviceId = null;
let codeReader;
let videoStream = null;
const cameraFacing = ref('environment'); // 'environment' (back) oder 'user' (front)
let allVideoInputDevices = [];
let videoInputDevices = [];
let currentDeviceIndex = 0;

const setupCamera = async (deviceId = null) => {
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

    allVideoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
    videoInputDevices = allVideoInputDevices.filter(d => {
      const label = d.label.toLowerCase();
      if (label.includes('front') || label.includes('user')) return true;
      if (label.includes('back') || label.includes('environment')) return true;
      if (label.includes('ultra') || label.includes('zoom') || label.includes('tele') || label.includes('wide')) return false;
      return true;
    });

    if (!videoInputDevices.length) {
      barcodeResult.value = 'Keine passende Kamera gefunden';
      return;
    }

    if (deviceId) {
      videoInputDeviceId = deviceId;
      currentDeviceIndex = videoInputDevices.findIndex(d => d.deviceId === deviceId);
    } else {
      const backCam = videoInputDevices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment'));
      videoInputDeviceId = backCam ? backCam.deviceId : videoInputDevices[0].deviceId;
      currentDeviceIndex = videoInputDevices.findIndex(d => d.deviceId === videoInputDeviceId);
    }

    // Kamera öffnen, um Track zu bekommen
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: videoInputDeviceId,
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


    const scanRegion = {
      x: 0.15, // 20% vom linken Rand
      y: 0.25, // 30% von oben
      width: 0.7, // 80% der Breite
      height: 0.5 // 40% der Höhe
    };
    // ZXing starten
    await codeReader.decodeFromVideoDevice(
      videoInputDeviceId,
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
      },
      scanRegion
    );

  } catch (error) {
    console.error('Camera setup error:', error);
    barcodeResult.value = 'Kamera-Fehler: ' + error.message;
  }
};

const switchCamera = async () => {
  if (!videoInputDevices.length) return;
  stopCamera();
  currentDeviceIndex = (currentDeviceIndex + 1) % videoInputDevices.length;
  videoInputDeviceId = videoInputDevices[currentDeviceIndex].deviceId;
  cameraFacing.value = videoInputDevices[currentDeviceIndex].label.toLowerCase().includes('front') || videoInputDevices[currentDeviceIndex].label.toLowerCase().includes('user') ? 'user' : 'environment';
  await setupCamera(videoInputDeviceId);
};

const stopCamera = () => {
  if (codeReader && typeof codeReader.reset === 'function') codeReader.reset();
  if (videoStream) videoStream.getTracks().forEach(track => track.stop());
};

const takePhoto = () => {
  const videoElement = document.getElementById('barcode-video');
  if (!videoElement) return;

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

onMounted(() => setupCamera());
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
</style>
