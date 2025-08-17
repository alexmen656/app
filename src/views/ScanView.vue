<template>
  <div class="scan-view">
    <!-- Header -->
    <header class="header">
      <router-link to="/" class="back-button">
        <span>←</span>
      </router-link>
      <h1 class="title">Scan Food</h1>
      <div></div>
    </header>

    <!-- Scan Options -->
    <div class="scan-options">
      <button 
        class="scan-option" 
        :class="{ active: scanMode === 'photo' }"
        @click="scanMode = 'photo'"
      >
        <span class="option-icon">📷</span>
        <span class="option-label">Photo Scan</span>
        <span class="option-description">Take a photo of your food</span>
      </button>

      <button 
        class="scan-option" 
        :class="{ active: scanMode === 'barcode' }"
        @click="scanMode = 'barcode'"
      >
        <span class="option-icon">📱</span>
        <span class="option-label">Barcode Scan</span>
        <span class="option-description">Scan product barcode</span>
      </button>
    </div>

    <!-- Camera Preview Area -->
    <div class="camera-preview" v-if="!isScanning && !scanResult">
      <div class="preview-placeholder">
        <span class="camera-icon">📸</span>
        <p>{{ scanMode === 'photo' ? 'Position your food in the frame' : 'Point camera at barcode' }}</p>
      </div>
      
      <!-- Scan Frame -->
      <div class="scan-frame" :class="scanMode">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
      </div>
    </div>

    <!-- Scanning State -->
    <div class="scanning-state" v-if="isScanning">
      <div class="scanning-animation">
        <div class="scanning-line"></div>
      </div>
      <p class="scanning-text">{{ scanMode === 'photo' ? 'Analyzing food...' : 'Scanning barcode...' }}</p>
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <!-- Scan Result -->
    <div class="scan-result" v-if="scanResult">
      <div class="result-card">
        <div class="food-image">
          <img :src="scanResult.image" :alt="scanResult.name" />
        </div>
        
        <h3 class="food-name">{{ scanResult.name }}</h3>
        
        <div class="nutrition-info">
          <div class="nutrition-item">
            <span class="nutrition-icon">🔥</span>
            <span class="nutrition-value">{{ scanResult.calories }}</span>
            <span class="nutrition-label">kcal</span>
          </div>
          
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <span class="nutrition-icon protein-color">⚡</span>
              <span class="nutrition-value">{{ scanResult.protein }}g</span>
              <span class="nutrition-label">Protein</span>
            </div>
            
            <div class="nutrition-item">
              <span class="nutrition-icon carbs-color">🌾</span>
              <span class="nutrition-value">{{ scanResult.carbs }}g</span>
              <span class="nutrition-label">Carbs</span>
            </div>
            
            <div class="nutrition-item">
              <span class="nutrition-icon fats-color">💧</span>
              <span class="nutrition-value">{{ scanResult.fats }}g</span>
              <span class="nutrition-label">Fats</span>
            </div>
          </div>
        </div>

        <!-- Portion Size Adjustment -->
        <div class="portion-control">
          <label class="portion-label">Portion Size</label>
          <div class="portion-input">
            <button class="portion-btn" @click="adjustPortion(-0.5)">-</button>
            <span class="portion-value">{{ portionSize }}</span>
            <button class="portion-btn" @click="adjustPortion(0.5)">+</button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="action-btn secondary" @click="resetScan">
            Scan Again
          </button>
          <button class="action-btn primary" @click="addFood">
            Add to Diary
          </button>
        </div>
      </div>
    </div>

    <!-- Scan Button -->
    <button 
      class="scan-button" 
      v-if="!isScanning && !scanResult"
      @click="startScan"
    >
      <span class="scan-icon">{{ scanMode === 'photo' ? '📷' : '📱' }}</span>
      <span>{{ scanMode === 'photo' ? 'Take Photo' : 'Scan Barcode' }}</span>
    </button>

    <!-- Recent Scans -->
    <div class="recent-scans" v-if="!isScanning && !scanResult && recentScans.length > 0">
      <h3 class="section-title">Recent Scans</h3>
      <div class="recent-items">
        <div 
          class="recent-item" 
          v-for="item in recentScans" 
          :key="item.id"
          @click="selectRecentItem(item)"
        >
          <div class="recent-image">
            <img :src="item.image" :alt="item.name" />
          </div>
          <div class="recent-info">
            <span class="recent-name">{{ item.name }}</span>
            <span class="recent-calories">{{ item.calories }} kcal</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const scanMode = ref<'photo' | 'barcode'>('photo')
const isScanning = ref(false)
const scanResult = ref<any>(null)
const portionSize = ref(1.0)

// Sample recent scans
const recentScans = ref([
  {
    id: 1,
    name: 'Grilled Salmon',
    calories: 350,
    image: '/api/placeholder/50/50'
  },
  {
    id: 2,
    name: 'Avocado Toast',
    calories: 280,
    image: '/api/placeholder/50/50'
  },
  {
    id: 3,
    name: 'Greek Yogurt',
    calories: 150,
    image: '/api/placeholder/50/50'
  }
])

function startScan() {
  isScanning.value = true
  
  // Simulate scanning process
  setTimeout(() => {
    isScanning.value = false
    
    // Mock scan result
    scanResult.value = {
      name: scanMode.value === 'photo' ? 'Grilled Salmon with Vegetables' : 'Coca Cola 330ml',
      calories: scanMode.value === 'photo' ? 420 : 140,
      protein: scanMode.value === 'photo' ? 35 : 0,
      carbs: scanMode.value === 'photo' ? 12 : 35,
      fats: scanMode.value === 'photo' ? 18 : 0,
      image: '/api/placeholder/200/200'
    }
  }, 3000)
}

function resetScan() {
  scanResult.value = null
  portionSize.value = 1.0
}

function adjustPortion(delta: number) {
  portionSize.value = Math.max(0.5, portionSize.value + delta)
}

function addFood() {
  // Here you would typically save the food to the user's diary
  console.log('Adding food:', {
    ...scanResult.value,
    portion: portionSize.value
  })
  
  // Navigate back to home
  router.push('/')
}

function selectRecentItem(item: any) {
  scanResult.value = {
    ...item,
    protein: 25,
    carbs: 15,
    fats: 12
  }
}
</script>

<style scoped>
.scan-view {
  height: 100vh;
  height: 100dvh;
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  padding-top: max(16px, env(safe-area-inset-top));
  height: 60px;
}

.back-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  font-size: 18px;
  backdrop-filter: blur(10px);
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.scan-options {
  display: flex;
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 24px;
}

.scan-option {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: 15px;
  padding: 16px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  backdrop-filter: blur(10px);
  height: 90px;
}

.scan-option.active {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
}

.option-icon {
  display: block;
  font-size: 24px;
  margin-bottom: 8px;
}

.option-label {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
}

.option-description {
  font-size: 12px;
  opacity: 0.7;
}

.camera-preview {
  position: relative;
  margin: 0 16px;
  height: 280px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.preview-placeholder {
  text-align: center;
}

.camera-icon {
  display: block;
  font-size: 48px;
  margin-bottom: 10px;
}

.scan-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
}

.scan-frame.barcode {
  width: 250px;
  height: 100px;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid white;
}

.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

.scanning-state {
  margin: 0 16px;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.scanning-animation {
  width: 200px;
  height: 200px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
}

.scanning-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, white, transparent);
  animation: scan 2s infinite;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

.scanning-text {
  font-size: 16px;
  margin-bottom: 10px;
}

.loading-dots {
  display: flex;
  gap: 5px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.scan-result {
  margin: 0 16px;
  margin-bottom: 24px;
}

.result-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.food-image {
  width: 120px;
  height: 120px;
  border-radius: 15px;
  margin: 0 auto 20px;
  overflow: hidden;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.food-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.food-name {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
}

.nutrition-info {
  margin-bottom: 30px;
}

.nutrition-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.nutrition-grid .nutrition-item {
  flex-direction: column;
  gap: 5px;
}

.nutrition-icon {
  font-size: 20px;
}

.nutrition-value {
  font-size: 18px;
  font-weight: 600;
}

.nutrition-label {
  font-size: 12px;
  opacity: 0.7;
}

.protein-color { color: #ff6b6b; }
.carbs-color { color: #ffa726; }
.fats-color { color: #42a5f5; }

.portion-control {
  margin-bottom: 30px;
}

.portion-label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  opacity: 0.8;
}

.portion-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.portion-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s;
}

.portion-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.portion-value {
  font-size: 18px;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.action-btn {
  flex: 1;
  padding: 15px;
  border-radius: 15px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.action-btn.primary {
  background: white;
  color: #1e1e2e;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.scan-button {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  color: #1e1e2e;
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
  margin-bottom: env(safe-area-inset-bottom);
}

.scan-button:hover {
  transform: translateX(-50%) translateY(-2px);
}

.scan-icon {
  font-size: 20px;
}

.recent-scans {
  padding: 0 16px;
  margin-bottom: 80px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
}

.recent-items {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.recent-item {
  min-width: 120px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.recent-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.recent-image {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  margin: 0 auto 10px;
  overflow: hidden;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.recent-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recent-name {
  display: block;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 5px;
}

.recent-calories {
  font-size: 11px;
  opacity: 0.7;
}
</style>
