<template>
  <div class="scan-view">
    <!-- Header -->
    <header class="header">
      <router-link to="/" class="back-button">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
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
        <div class="option-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1L21.05 10c.33-.26.43-.73.23-1.09l-2.05-3.56c-.2-.36-.58-.52-.92-.4l-2.24.91c-.52-.4-1.09-.74-1.71-1L14.07 2.5c-.06-.4-.4-.7-.8-.7h-4.54c-.4 0-.74.3-.8.7L7.64 4.86c-.62.26-1.19.6-1.71 1L3.69 5.05c-.34-.12-.72.04-.92.4L.72 8.01c-.2.36-.1.83.23 1.09L2.57 10c-.04.34-.07.67-.07 1c0 .33.03.65.07.97L.95 12.97c-.33.26-.43.73-.23 1.09l2.05 3.56c.2.36.58.52.92.4l2.24-.91c.52.4 1.09.74 1.71 1l.29 2.36c.06.4.4.7.8.7h4.54c.4 0 .74-.3.8-.7l.29-2.36c.62-.26 1.19-.6 1.71-1l2.24.91c.34.12.72-.04.92-.4l2.05-3.56c.2-.36.1-.83-.23-1.09L21.43 13z"/>
          </svg>
        </div>
        <div class="option-content">
          <span class="option-label">Photo Scan</span>
          <span class="option-description">Take a photo of your food</span>
        </div>
      </button>

      <button 
        class="scan-option" 
        :class="{ active: scanMode === 'barcode' }"
        @click="scanMode = 'barcode'"
      >
        <div class="option-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M2 4h2v16H2V4zm4 0h2v16H6V4zm4 0h1v16h-1V4zm3 0h2v16h-2V4zm4 0h2v16h-2V4zm4 0h1v16h-1V4zM1 2h2v2H1V2zm20 0h2v2h-2V2zM1 20h2v2H1v-2zm20 0h2v2h-2v-2z"/>
          </svg>
        </div>
        <div class="option-content">
          <span class="option-label">Barcode Scan</span>
          <span class="option-description">Scan product barcode</span>
        </div>
      </button>
    </div>

    <!-- Camera Preview Area -->
    <div class="camera-preview" v-if="!isScanning && !scanResult">
      <div class="preview-placeholder">
        <div class="camera-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1L21.05 10c.33-.26.43-.73.23-1.09l-2.05-3.56c-.2-.36-.58-.52-.92-.4l-2.24.91c-.52-.4-1.09-.74-1.71-1L14.07 2.5c-.06-.4-.4-.7-.8-.7h-4.54c-.4 0-.74.3-.8.7L7.64 4.86c-.62.26-1.19.6-1.71 1L3.69 5.05c-.34-.12-.72.04-.92.4L.72 8.01c-.2.36-.1.83.23 1.09L2.57 10c-.04.34-.07.67-.07 1c0 .33.03.65.07.97L.95 12.97c-.33.26-.43.73-.23 1.09l2.05 3.56c.2.36.58.52.92.4l2.24-.91c.52.4 1.09.74 1.71 1l.29 2.36c.06.4.4.7.8.7h4.54c.4 0 .74-.3.8-.7l.29-2.36c.62-.26 1.19-.6 1.71-1l2.24.91c.34.12.72-.04.92-.4l2.05-3.56c.2-.36.1-.83-.23-1.09L21.43 13z"/>
          </svg>
          <div class="sparkle">✨</div>
        </div>
        <p class="preview-text">{{ scanMode === 'photo' ? 'Position your food in the frame' : 'Point camera at barcode' }}</p>
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
        <div class="pulse-ring"></div>
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
          <img v-if="scanResult.image && !scanResult.image.includes('placeholder')" :src="scanResult.image" :alt="scanResult.name" />
          <div v-else class="placeholder-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
        
        <h3 class="food-name">{{ scanResult.name }}</h3>
        
        <div class="nutrition-info">
          <div class="nutrition-main">
            <div class="nutrition-item main-calories">
              <svg viewBox="0 0 24 24" fill="#ff6b35" width="20" height="20">
                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
              </svg>
              <span class="nutrition-value">{{ scanResult.calories }}</span>
              <span class="nutrition-label">kcal</span>
            </div>
          </div>
          
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <svg viewBox="0 0 24 24" fill="#ff6b6b" width="16" height="16">
                <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
              </svg>
              <span class="nutrition-value">{{ scanResult.protein }}g</span>
              <span class="nutrition-label">Protein</span>
            </div>
            
            <div class="nutrition-item">
              <svg viewBox="0 0 24 24" fill="#ffa726" width="16" height="16">
                <path d="M4.5 12.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S6.83 14 6 14s-1.5-.67-1.5-1.5zm.5-2h2c.55 0 1-.45 1-1V8.5c0-.83-.67-1.5-1.5-1.5S5.5 7.67 5.5 8.5V9.5c0 .55-.45 1-1 1z"/>
              </svg>
              <span class="nutrition-value">{{ scanResult.carbs }}g</span>
              <span class="nutrition-label">Carbs</span>
            </div>
            
            <div class="nutrition-item">
              <svg viewBox="0 0 24 24" fill="#42a5f5" width="16" height="16">
                <path d="M12 2c1.1 0 2 .9 2 2 0 .74-.4 1.38-1 1.72v2.56l7 7V17c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-1.72l7-7V5.72c-.6-.34-1-.98-1-1.72 0-1.1.9-2 2-2z"/>
              </svg>
              <span class="nutrition-value">{{ scanResult.fats }}g</span>
              <span class="nutrition-label">Fats</span>
            </div>
          </div>
        </div>

        <!-- Portion Size Adjustment -->
        <div class="portion-control">
          <label class="portion-label">Portion Size</label>
          <div class="portion-input">
            <button class="portion-btn" @click="adjustPortion(-0.5)">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M19 13H5v-2h14v2z"/>
              </svg>
            </button>
            <span class="portion-value">{{ portionSize }}</span>
            <button class="portion-btn" @click="adjustPortion(0.5)">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="action-btn secondary" @click="resetScan">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
            Scan Again
          </button>
          <button class="action-btn primary" @click="addFood">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
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
      <div class="scan-icon">
        <svg v-if="scanMode === 'photo'" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1L21.05 10c.33-.26.43-.73.23-1.09l-2.05-3.56c-.2-.36-.58-.52-.92-.4l-2.24.91c-.52-.4-1.09-.74-1.71-1L14.07 2.5c-.06-.4-.4-.7-.8-.7h-4.54c-.4 0-.74.3-.8.7L7.64 4.86c-.62.26-1.19.6-1.71 1L3.69 5.05c-.34-.12-.72.04-.92.4L.72 8.01c-.2.36-.1.83.23 1.09L2.57 10c-.04.34-.07.67-.07 1c0 .33.03.65.07.97L.95 12.97c-.33.26-.43.73-.23 1.09l2.05 3.56c.2.36.58.52.92.4l2.24-.91c.52.4 1.09.74 1.71 1l.29 2.36c.06.4.4.7.8.7h4.54c.4 0 .74-.3.8-.7l.29-2.36c.62-.26 1.19-.6 1.71-1l2.24.91c.34.12.72-.04.92-.4l2.05-3.56c.2-.36.1-.83-.23-1.09L21.43 13z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M2 4h2v16H2V4zm4 0h2v16H6V4zm4 0h1v16h-1V4zm3 0h2v16h-2V4zm4 0h2v16h-2V4zm4 0h1v16h-1V4zM1 2h2v2H1V2zm20 0h2v2h-2V2zM1 20h2v2H1v-2zm20 0h2v2h-2v-2z"/>
        </svg>
      </div>
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
            <div class="placeholder-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
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
    protein: 35,
    carbs: 12,
    fats: 18
  },
  {
    id: 2,
    name: 'Avocado Toast',
    calories: 280,
    protein: 12,
    carbs: 35,
    fats: 16
  },
  {
    id: 3,
    name: 'Greek Yogurt',
    calories: 150,
    protein: 15,
    carbs: 18,
    fats: 5
  }
])

// Function to fetch food data from OpenFoodFacts API
async function fetchFoodByBarcode(barcode: string) {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    const data = await response.json()
    
    if (data.status === 1 && data.product) {
      const product = data.product
      
      // Extract nutrition data (per 100g)
      const nutriments = product.nutriments || {}
      
      return {
        name: product.product_name || product.product_name_de || product.product_name_en || 'Unknown Product',
        calories: Math.round((nutriments.energy_kcal_100g || nutriments['energy-kcal_100g'] || 0)),
        protein: Math.round((nutriments.proteins_100g || 0) * 10) / 10,
        carbs: Math.round((nutriments.carbohydrates_100g || 0) * 10) / 10,
        fats: Math.round((nutriments.fat_100g || 0) * 10) / 10,
        image: product.image_url || product.image_front_url,
        barcode: barcode,
        brand: product.brands,
        categories: product.categories
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching food data:', error)
    return null
  }
}

function startScan() {
  isScanning.value = true
  
  if (scanMode.value === 'barcode') {
    // Simulate barcode scanning with a real barcode for demonstration
    const mockBarcodes = [
      '7622210988560', // Oreo cookies
      '3017620422003', // Nutella
      '5449000000996', // Coca Cola
      '8712566446593', // Red Bull
      '4000417025005'  // Milka chocolate
    ]
    
    const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)]
    
    // Simulate scanning time
    setTimeout(async () => {
      const foodData = await fetchFoodByBarcode(randomBarcode)
      
      if (foodData) {
        scanResult.value = foodData
      } else {
        // Fallback to mock data if API fails
        scanResult.value = {
          name: 'Product Not Found',
          calories: 140,
          protein: 0,
          carbs: 35,
          fats: 0,
          image: null,
          barcode: randomBarcode
        }
      }
      
      isScanning.value = false
    }, 3000)
  } else {
    // Photo scan simulation (mock AI analysis)
    setTimeout(() => {
      isScanning.value = false
      
      scanResult.value = {
        name: 'Grilled Salmon with Vegetables',
        calories: 420,
        protein: 35,
        carbs: 12,
        fats: 18,
        image: null
      }
    }, 3000)
  }
}

function resetScan() {
  scanResult.value = null
  portionSize.value = 1.0
}

function adjustPortion(delta: number) {
  portionSize.value = Math.max(0.5, Math.round((portionSize.value + delta) * 2) / 2)
}

function addFood() {
  // Calculate adjusted nutrition values based on portion size
  const adjustedFood = {
    ...scanResult.value,
    calories: Math.round(scanResult.value.calories * portionSize.value),
    protein: Math.round(scanResult.value.protein * portionSize.value * 10) / 10,
    carbs: Math.round(scanResult.value.carbs * portionSize.value * 10) / 10,
    fats: Math.round(scanResult.value.fats * portionSize.value * 10) / 10,
    portion: portionSize.value
  }
  
  console.log('Adding food to diary:', adjustedFood)
  
  // Navigate back to home
  router.push('/')
}

function selectRecentItem(item: any) {
  scanResult.value = {
    ...item,
    image: null
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
  /* Prevent text selection */
  -webkit-user-select: none;
  user-select: none;
  /* Prevent touch callouts */
  -webkit-touch-callout: none;
  /* Prevent tap highlights */
  -webkit-tap-highlight-color: transparent;
  /* Prevent zoom on double tap */
  touch-action: manipulation;
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
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
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
  padding: 20px 16px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 80px;
}

.scan-option.active {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.scan-option:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.option-icon {
  flex-shrink: 0;
  opacity: 0.8;
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-label {
  font-weight: 600;
  font-size: 16px;
}

.option-description {
  font-size: 13px;
  opacity: 0.7;
  line-height: 1.3;
}

.camera-preview {
  position: relative;
  margin: 0 16px;
  height: 300px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-placeholder {
  text-align: center;
  position: relative;
}

.camera-icon {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
  opacity: 0.6;
}

.sparkle {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 16px;
  animation: sparkle 2s infinite;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
}

.preview-text {
  font-size: 16px;
  opacity: 0.8;
  margin: 0;
  line-height: 1.4;
}

.scan-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 220px;
  height: 220px;
}

.scan-frame.barcode {
  width: 280px;
  height: 120px;
}

.corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 3px solid white;
  opacity: 0.8;
}

.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
  border-radius: 4px 0 0 0;
}

.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
  border-radius: 0 4px 0 0;
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 4px;
}

.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
  border-radius: 0 0 4px 0;
}

.scanning-state {
  margin: 0 16px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.scanning-animation {
  width: 200px;
  height: 200px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.02);
}

.scanning-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #00f5ff, transparent);
  animation: scan 2s infinite;
  box-shadow: 0 0 10px #00f5ff;
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: calc(100% - 3px); }
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}

.scanning-text {
  font-size: 18px;
  margin-bottom: 16px;
  font-weight: 500;
}

.loading-dots {
  display: flex;
  gap: 8px;
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
  0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
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
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.food-image {
  width: 120px;
  height: 120px;
  border-radius: 15px;
  margin: 0 auto 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.food-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-icon {
  opacity: 0.6;
}

.food-name {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
  line-height: 1.3;
}

.nutrition-info {
  margin-bottom: 30px;
}

.nutrition-main {
  margin-bottom: 20px;
}

.nutrition-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.nutrition-item.main-calories {
  margin-bottom: 20px;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.nutrition-grid .nutrition-item {
  flex-direction: column;
  gap: 6px;
  background: rgba(255, 255, 255, 0.05);
  padding: 16px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.nutrition-value {
  font-size: 18px;
  font-weight: 600;
}

.nutrition-label {
  font-size: 12px;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.portion-control {
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.portion-label {
  display: block;
  margin-bottom: 15px;
  font-size: 14px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.portion-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.portion-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.portion-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.portion-value {
  font-size: 20px;
  font-weight: 600;
  min-width: 50px;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.action-btn {
  flex: 1;
  padding: 16px 20px;
  border-radius: 15px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.action-btn.primary {
  background: white;
  color: #1e1e2e;
}

.action-btn.primary:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
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
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  margin-bottom: env(safe-area-inset-bottom);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.scan-button:hover {
  transform: translateX(-50%) translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.scan-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.recent-scans {
  padding: 0 16px;
  margin-bottom: 120px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  opacity: 0.9;
}

.recent-items {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.recent-item {
  min-width: 140px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.recent-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.recent-image {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin: 0 auto 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.recent-image .placeholder-icon {
  opacity: 0.6;
}

.recent-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
  line-height: 1.3;
}

.recent-calories {
  font-size: 12px;
  opacity: 0.7;
}

/* Hide scrollbars completely */
.scan-view::-webkit-scrollbar,
.recent-items::-webkit-scrollbar {
  display: none;
}

.scan-view,
.recent-items {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
