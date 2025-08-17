<template>
  <div class="scan-view">
    <!-- Camera Interface (Full Screen) -->
    <div class="camera-container" v-if="!scanResults && !error">
      <!-- Header Bar -->
      <div class="header-bar">
        <button @click="$router.go(-1)" class="back-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        <h1 class="scanner-title">Scanner</h1>
        <button class="menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      </div>

      <!-- Camera View -->
      <div class="camera-view-full">
        <!-- Viewfinder Overlay -->
        <div class="viewfinder-overlay">
          <div class="viewfinder-frame">
            <div class="corner-tl"></div>
            <div class="corner-tr"></div>
            <div class="corner-bl"></div>
            <div class="corner-br"></div>
          </div>
        </div>

        <!-- Camera Placeholder/Preview -->
        <div class="camera-preview">
          <div v-if="!isScanning && !isAnalyzing" class="preview-placeholder">
            <div class="placeholder-content">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
                <path d="M9 2l-1 1H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-4L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
              </svg>
              <p v-if="scanMode === 'food'">Position food in frame</p>
              <p v-else>Position barcode in frame</p>
            </div>
          </div>
          <div v-else class="scanning-state">
            <div class="loading-spinner"></div>
            <p>{{ loadingMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Bottom Controls -->
      <div class="bottom-controls">
        <!-- Scan Mode Toggle -->
        <div class="scan-mode-toggle">
          <button 
            class="mode-btn" 
            :class="{ active: scanMode === 'barcode' }"
            @click="setScanMode('barcode')"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 5v4h2V7h2V5H3zm2 10H3v4h4v-2H5v-2zm14 4v-2h-2v4h4v-4h-2zM19 5h-2v2h2v2h2V5h-4z"/>
            </svg>
          </button>
          <span class="mode-label">{{ modeLabel }}</span>
          <button 
            class="mode-btn" 
            :class="{ active: scanMode === 'food' }"
            @click="setScanMode('food')"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 2l-1 1H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-4L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
            </svg>
          </button>
        </div>

        <!-- Capture Controls -->
        <div class="capture-controls">
          <div class="capture-actions">
            <!-- Flash Toggle -->
            <button class="action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M7 2v11h3v9l7-12h-4L17 2H7z"/>
              </svg>
            </button>

            <!-- Main Capture Button -->
            <button 
              class="capture-btn"
              :disabled="isScanning || isAnalyzing"
              @click="scanMode === 'food' ? startFoodScan() : startBarcodeScan()"
            >
              <div class="capture-inner" :class="{ scanning: isScanning || isAnalyzing }">
                <div v-if="!isScanning && !isAnalyzing" class="capture-ring"></div>
                <div v-else class="capture-loading"></div>
              </div>
            </button>

            <!-- Gallery/Image Picker -->
            <button class="action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Display -->
    <div class="results" v-if="scanResults">
      <div class="results-header">
        <h2 class="section-title">Scan-Ergebnisse</h2>
        <button @click="resetScan" class="reset-btn">Neuer Scan</button>
      </div>

      <!-- Food Analysis Results -->
      <div v-if="scanResults.type === 'food'" class="food-results">
        <div class="result-image" v-if="scanResults.image">
          <img :src="scanResults.image" alt="Gescanntes Essen" />
        </div>
        
        <div class="confidence-badge" :class="confidenceClass">
          Vertrauen: {{ scanResults.data.confidence }}
        </div>
        
        <div class="main-card">
          <div class="calories-section">
            <h2 class="calories-number">{{ scanResults.data.total.calories }}</h2>
            <p class="calories-label">Gesamt-Kalorien</p>
          </div>
          <div class="progress-ring">
            <svg class="progress-svg" width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="30" stroke="#2a2d37" stroke-width="4" fill="none"/>
              <circle 
                cx="40" 
                cy="40" 
                r="30" 
                stroke="white" 
                stroke-width="4" 
                fill="none"
                stroke-dasharray="188.4"
                stroke-dashoffset="0"
                stroke-linecap="round"
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div class="flame-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="macros-grid">
          <div class="macro-card protein">
            <div class="macro-amount">{{ scanResults.data.total.protein }}g</div>
            <div class="macro-label">Protein</div>
            <div class="macro-progress">
              <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" stroke="#2a2d37" stroke-width="3" fill="none"/>
                <circle 
                  cx="25" 
                  cy="25" 
                  r="20" 
                  stroke="#ff6b6b" 
                  stroke-width="3" 
                  fill="none"
                  stroke-dasharray="125.6"
                  stroke-dashoffset="0"
                  stroke-linecap="round"
                  transform="rotate(-90 25 25)"
                />
              </svg>
              <div class="macro-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#ff6b6b">
                  <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="macro-card carbs">
            <div class="macro-amount">{{ scanResults.data.total.carbs }}g</div>
            <div class="macro-label">Kohlenhydrate</div>
            <div class="macro-progress">
              <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" stroke="#2a2d37" stroke-width="3" fill="none"/>
                <circle 
                  cx="25" 
                  cy="25" 
                  r="20" 
                  stroke="#ffa726" 
                  stroke-width="3" 
                  fill="none"
                  stroke-dasharray="125.6"
                  stroke-dashoffset="0"
                  stroke-linecap="round"
                  transform="rotate(-90 25 25)"
                />
              </svg>
              <div class="macro-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffa726">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="macro-card fats">
            <div class="macro-amount">{{ scanResults.data.total.fat }}g</div>
            <div class="macro-label">Fett</div>
            <div class="macro-progress">
              <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" stroke="#2a2d37" stroke-width="3" fill="none"/>
                <circle 
                  cx="25" 
                  cy="25" 
                  r="20" 
                  stroke="#42a5f5" 
                  stroke-width="3" 
                  fill="none"
                  stroke-dasharray="125.6"
                  stroke-dashoffset="0"
                  stroke-linecap="round"
                  transform="rotate(-90 25 25)"
                />
              </svg>
              <div class="macro-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#42a5f5">
                  <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 2c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="food-items">
          <h3 class="section-title">Erkannte Lebensmittel</h3>
          <div v-for="food in scanResults.data.foods" :key="food.name" class="food-item">
            <div class="food-image">
              <span>🍽️</span>
            </div>
            <div class="food-info">
              <h4 class="food-name">{{ food.name }}</h4>
              <div class="food-calories">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff6b35">
                  <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
                </svg>
                <span>{{ food.calories }} kcal</span>
              </div>
              <div class="food-macros">
                <span class="macro-item protein-color">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
                  </svg>
                  {{ food.protein }}g
                </span>
                <span class="macro-item carbs-color">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.5 12.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S6.83 14 6 14s-1.5-.67-1.5-1.5zm.5-2h2c.55 0 1-.45 1-1V8.5c0-.83-.67-1.5-1.5-1.5S5.5 7.67 5.5 8.5V9.5c0 .55-.45 1-1 1z"/>
                  </svg>
                  {{ food.carbs }}g
                </span>
                <span class="macro-item fats-color">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c1.1 0 2 .9 2 2 0 .74-.4 1.38-1 1.72v2.56l7 7V17c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-1.72l7-7V5.72c-.6-.34-1-.98-1-1.72 0-1.1.9-2 2-2z"/>
                  </svg>
                  {{ food.fat }}g
                </span>
              </div>
            </div>
            <div class="food-amount">{{ food.amount }}</div>
          </div>
        </div>

        <div class="notes" v-if="scanResults.data.notes">
          <h4>Hinweise</h4>
          <p>{{ scanResults.data.notes }}</p>
        </div>
      </div>

      <!-- Barcode Results -->
      <div v-if="scanResults.type === 'barcode'" class="barcode-results">
        <div class="main-card">
          <div class="calories-section">
            <h2 class="calories-number">{{ Math.round(scanResults.data.nutriments?.energy_kcal_100g || 0) }}</h2>
            <p class="calories-label">kcal/100g</p>
          </div>
          <div class="progress-ring">
            <svg class="progress-svg" width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="30" stroke="#2a2d37" stroke-width="4" fill="none"/>
              <circle 
                cx="40" 
                cy="40" 
                r="30" 
                stroke="white" 
                stroke-width="4" 
                fill="none"
                stroke-dasharray="188.4"
                stroke-dashoffset="0"
                stroke-linecap="round"
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div class="flame-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="product-info">
          <h3 class="product-name">{{ scanResults.data.product_name || 'Unbekanntes Produkt' }}</h3>
          <p v-if="scanResults.data.brands" class="product-brand">{{ scanResults.data.brands }}</p>
        </div>

        <div class="macros-grid" v-if="scanResults.data.nutriments">
          <div class="macro-card protein">
            <div class="macro-amount">{{ (scanResults.data.nutriments.proteins_100g || 0).toFixed(1) }}g</div>
            <div class="macro-label">Protein/100g</div>
            <div class="macro-progress">
              <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" stroke="#2a2d37" stroke-width="3" fill="none"/>
                <circle 
                  cx="25" 
                  cy="25" 
                  r="20" 
                  stroke="#ff6b6b" 
                  stroke-width="3" 
                  fill="none"
                  stroke-dasharray="125.6"
                  stroke-dashoffset="0"
                  stroke-linecap="round"
                  transform="rotate(-90 25 25)"
                />
              </svg>
              <div class="macro-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#ff6b6b">
                  <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="macro-card carbs">
            <div class="macro-amount">{{ (scanResults.data.nutriments.carbohydrates_100g || 0).toFixed(1) }}g</div>
            <div class="macro-label">Kohlenhydrate/100g</div>
            <div class="macro-progress">
              <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" stroke="#2a2d37" stroke-width="3" fill="none"/>
                <circle 
                  cx="25" 
                  cy="25" 
                  r="20" 
                  stroke="#ffa726" 
                  stroke-width="3" 
                  fill="none"
                  stroke-dasharray="125.6"
                  stroke-dashoffset="0"
                  stroke-linecap="round"
                  transform="rotate(-90 25 25)"
                />
              </svg>
              <div class="macro-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffa726">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="macro-card fats">
            <div class="macro-amount">{{ (scanResults.data.nutriments.fat_100g || 0).toFixed(1) }}g</div>
            <div class="macro-label">Fett/100g</div>
            <div class="macro-progress">
              <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" stroke="#2a2d37" stroke-width="3" fill="none"/>
                <circle 
                  cx="25" 
                  cy="25" 
                  r="20" 
                  stroke="#42a5f5" 
                  stroke-width="3" 
                  fill="none"
                  stroke-dasharray="125.6"
                  stroke-dashoffset="0"
                  stroke-linecap="round"
                  transform="rotate(-90 25 25)"
                />
              </svg>
              <div class="macro-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#42a5f5">
                  <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 2c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="saveResults" class="save-btn">Speichern</button>
        <button @click="resetScan" class="cancel-btn">Verwerfen</button>
      </div>
    </div>

    <!-- Error State -->
    <div class="error-state" v-if="error">
      <div class="error-card">
        <div class="error-icon">⚠️</div>
        <h3>Fehler beim Scannen</h3>
        <p>{{ error }}</p>
        <button @click="resetScan" class="retry-btn">Erneut versuchen</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner'

// Reactive state
const isScanning = ref(false)
const isAnalyzing = ref(false)
const scanResults = ref<any>(null)
const error = ref('')
const loadingMessage = ref('')
const scanMode = ref<'food' | 'barcode'>('food') // Default to food scanning

// Set scan mode
function setScanMode(mode: 'food' | 'barcode') {
  scanMode.value = mode
  resetScan() // Clear any existing results/errors when switching modes
}

// Computed property for mode label
const modeLabel = computed(() => {
  return scanMode.value === 'food' ? 'Scan food' : 'Scan code'
})

// Computed properties
const confidenceClass = computed(() => {
  if (!scanResults.value?.data?.confidence) return ''
  const confidence = scanResults.value.data.confidence.toLowerCase()
  if (confidence === 'hoch') return 'high'
  if (confidence === 'mittel') return 'medium'
  return 'low'
})

// Food scanning with camera
async function startFoodScan() {
  try {
    isScanning.value = true
    loadingMessage.value = 'Kamera wird vorbereitet...'
    
    // Request camera permissions
    const permissions = await Camera.requestPermissions()
    if (permissions.camera !== 'granted') {
      throw new Error('Kamera-Berechtigung wurde verweigert')
    }

    loadingMessage.value = 'Foto aufnehmen...'
    
    // Take photo with improved error handling
    const image = await Camera.getPhoto({
      quality: 85,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      width: 1024,
      height: 1024,
      correctOrientation: true
    })

    if (!image.base64String) {
      throw new Error('Kein Bild aufgenommen')
    }

    loadingMessage.value = 'Essen wird analysiert...'
    isAnalyzing.value = true

    // Create blob from base64
    const byteCharacters = atob(image.base64String)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'image/jpeg' })
    
    // Send to AI API
    const formData = new FormData()
    formData.append('image', blob, 'food.jpg')

    const apiResponse = await fetch('https://calai-nu.vercel.app/api/food/analyze', {
      method: 'POST',
      body: formData
    })

    if (!apiResponse.ok) {
      throw new Error(`API Error: ${apiResponse.status}`)
    }

    const result = await apiResponse.json()
    
    // Check if the result has the expected structure
    if (!result.foods || !result.total) {
      throw new Error(result.error || 'Ungültige API-Antwort')
    }

    scanResults.value = {
      type: 'food',
      data: result,
      image: `data:image/jpeg;base64,${image.base64String}`
    }

  } catch (err: any) {
    console.error('Camera error:', err)
    error.value = err.message || 'Unbekannter Fehler beim Fotografieren'
  } finally {
    isScanning.value = false
    isAnalyzing.value = false
  }
}

// Barcode scanning
async function startBarcodeScan() {
  try {
    isScanning.value = true
    loadingMessage.value = 'Barcode-Scanner wird vorbereitet...'

    loadingMessage.value = 'Barcode scannen...'

    // Start scanning with options
    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: 17, // ALL barcode types
      scanInstructions: 'Barcode scannen',
      scanButton: true,
      scanText: 'Scannen'
    })
    
    if (!result.ScanResult) {
      throw new Error('Kein Barcode erkannt')
    }

    loadingMessage.value = 'Produktinformationen werden geladen...'
    isAnalyzing.value = true

    // Query Open Food Facts API
    const productResponse = await fetch(`https://world.openfoodfacts.org/api/v0/product/${result.ScanResult}.json`)
    
    if (!productResponse.ok) {
      throw new Error('Produktinformationen konnten nicht geladen werden')
    }

    const productData = await productResponse.json()
    
    if (productData.status === 0) {
      throw new Error('Produkt nicht in der Datenbank gefunden')
    }

    scanResults.value = {
      type: 'barcode',
      data: productData.product
    }

  } catch (err: any) {
    error.value = err.message || 'Unbekannter Fehler beim Barcode-Scannen'
  } finally {
    isScanning.value = false
    isAnalyzing.value = false
  }
}

// Reset to initial state
function resetScan() {
  scanResults.value = null
  error.value = ''
  isScanning.value = false
  isAnalyzing.value = false
}

// Save results (implement actual storage logic)
function saveResults() {
  if (!scanResults.value) return
  
  try {
    // Get existing scan history from localStorage
    const existingHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]')
    
    // Create new scan entry
    const scanEntry = {
      id: Date.now(),
      type: scanResults.value.type,
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      image: scanResults.value.image || null,
      data: scanResults.value.data
    }
    
    // Add to beginning of array (most recent first)
    existingHistory.unshift(scanEntry)
    
    // Keep only last 20 scans
    const limitedHistory = existingHistory.slice(0, 20)
    
    // Save back to localStorage
    localStorage.setItem('scanHistory', JSON.stringify(limitedHistory))
    
    // Show success message
    alert('Ergebnisse gespeichert!')
    
    // Navigate back to home
    resetScan()
    
  } catch (error) {
    console.error('Error saving scan results:', error)
    alert('Fehler beim Speichern der Ergebnisse')
  }
}

// Initialize with food mode on mount
onMounted(() => {
  scanMode.value = 'food'
})
</script>

<style scoped>
.scan-view {
  height: 100vh;
  height: 100dvh;
  background: #000;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  overflow: hidden;
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  position: relative;
}

/* Camera Container - Full Screen */
.camera-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  flex-direction: column;
}

/* Header Bar */
.header-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  padding: max(44px, env(safe-area-inset-top, 44px)) 20px 20px;
  background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn, .menu-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover, .menu-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.scanner-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: white;
  text-align: center;
}

/* Camera View Full Screen */
.camera-view-full {
  position: relative;
  flex: 1;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Viewfinder Overlay */
.viewfinder-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.viewfinder-frame {
  position: relative;
  width: 280px;
  height: 280px;
  border: 2px solid white;
  border-radius: 12px;
}

.corner-tl, .corner-tr, .corner-bl, .corner-br {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 3px solid white;
}

.corner-tl {
  top: -3px;
  left: -3px;
  border-right: none;
  border-bottom: none;
  border-radius: 12px 0 0 0;
}

.corner-tr {
  top: -3px;
  right: -3px;
  border-left: none;
  border-bottom: none;
  border-radius: 0 12px 0 0;
}

.corner-bl {
  bottom: -3px;
  left: -3px;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 12px;
}

.corner-br {
  bottom: -3px;
  right: -3px;
  border-left: none;
  border-top: none;
  border-radius: 0 0 12px 0;
}

/* Camera Preview */
.camera-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
}

.preview-placeholder {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.placeholder-content svg {
  margin-bottom: 16px;
}

.placeholder-content p {
  font-size: 16px;
  margin: 0;
}

.scanning-state {
  text-align: center;
  color: white;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.scanning-state p {
  margin: 0;
  font-size: 16px;
}

/* Bottom Controls */
.bottom-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  padding: 20px 20px max(34px, calc(34px + env(safe-area-inset-bottom, 0px)));
  background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
}

/* Scan Mode Toggle */
.scan-mode-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.mode-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.6);
}

.mode-btn.active {
  background: white;
  color: #000;
  transform: scale(1.1);
}

.mode-btn:not(.active):hover {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.mode-label {
  color: white;
  font-size: 17px;
  font-weight: 500;
  min-width: 120px;
  text-align: center;
}

/* Capture Controls */
.capture-controls {
  display: flex;
  justify-content: center;
}

.capture-actions {
  display: flex;
  align-items: center;
  gap: 32px;
}

.action-btn {
  width: 50px;
  height: 50px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* Main Capture Button */
.capture-btn {
  width: 80px;
  height: 80px;
  border: none;
  background: none;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.capture-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.capture-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  transition: all 0.2s ease;
}

.capture-inner.scanning {
  background: rgba(255, 255, 255, 0.8);
}

.capture-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  border: 2px solid #000;
}

.capture-btn:active .capture-inner {
  transform: scale(0.95);
}

.capture-loading {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-top: 2px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Results Display - Keep existing styles for results */
.results {
  height: 100vh;
  height: 100dvh;
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
  color: white;
  padding: 16px;
  padding-top: max(44px, env(safe-area-inset-top, 44px));
  padding-bottom: max(80px, calc(80px + env(safe-area-inset-bottom, 0px)));
  overflow-y: auto;
  max-width: 800px;
  margin: 0 auto;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: white;
}

.reset-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.result-image {
  width: 100%;
  height: 200px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);
}

.result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.confidence-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
}

.confidence-badge.high {
  background: #16a34a;
  color: white;
}

.confidence-badge.medium {
  background: #ca8a04;
  color: white;
}

.confidence-badge.low {
  background: #dc2626;
  color: white;
}

.main-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  height: 120px;
}

.calories-number {
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.calories-label {
  font-size: 14px;
  opacity: 0.8;
  margin: 5px 0 0 0;
}

.progress-ring {
  position: relative;
  width: 80px;
  height: 80px;
}

.flame-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.macros-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.macro-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 16px;
  text-align: center;
  backdrop-filter: blur(10px);
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.macro-amount {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.macro-label {
  font-size: 11px;
  opacity: 0.8;
  margin-bottom: 8px;
}

.macro-progress {
  position: relative;
  display: flex;
  justify-content: center;
  width: 50px;
  height: 50px;
  margin: 0 auto;
}

.macro-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.product-info {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.product-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: white;
}

.product-brand {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.food-items {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.food-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 12px;
}

.food-item:last-child {
  margin-bottom: 0;
}

.food-image {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.food-info {
  flex: 1;
}

.food-name {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: white;
}

.food-calories {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.food-macros {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.macro-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.protein-color { color: #ff6b6b; }
.carbs-color { color: #ffa726; }
.fats-color { color: #42a5f5; }

.food-amount {
  font-size: 14px;
  opacity: 0.7;
  font-weight: 500;
}

.notes {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 24px;
  border-left: 4px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.notes h4 {
  color: white;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
}

.notes p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
}

.save-btn {
  background: white;
  color: #1e1e2e;
  border: none;
  padding: 16px 32px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: transform 0.2s;
  flex: 1;
  max-width: 200px;
}

.save-btn:hover {
  transform: translateY(-2px);
}

.cancel-btn, .retry-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.2s;
  flex: 1;
  max-width: 200px;
}

.cancel-btn:hover, .retry-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Error State */
.error-state {
  height: 100vh;
  height: 100dvh;
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  backdrop-filter: blur(10px);
  max-width: 400px;
  width: 100%;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .macros-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .macro-card {
    height: 80px;
    padding: 12px;
  }
  
  .main-card {
    height: 100px;
    padding: 20px;
  }
  
  .calories-number {
    font-size: 28px;
  }
  
  .progress-ring {
    width: 60px;
    height: 60px;
  }
  
  .results-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .save-btn, .cancel-btn, .retry-btn {
    max-width: none;
  }

  .food-item {
    flex-wrap: wrap;
    gap: 10px;
  }

  .food-macros {
    flex-wrap: wrap;
    gap: 8px;
  }

  .capture-actions {
    gap: 24px;
  }

  .action-btn {
    width: 44px;
    height: 44px;
  }

  .capture-btn {
    width: 70px;
    height: 70px;
  }

  .capture-ring {
    width: 50px;
    height: 50px;
  }

  .viewfinder-frame {
    width: 240px;
    height: 240px;
  }

  .mode-label {
    font-size: 15px;
    min-width: 100px;
  }
}

.result-image {
  width: 100%;
  height: 200px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);
}

.result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.confidence-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
}

.confidence-badge.high {
  background: #16a34a;
  color: white;
}

.confidence-badge.medium {
  background: #ca8a04;
  color: white;
}

.confidence-badge.low {
  background: #dc2626;
  color: white;
}

.main-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  height: 120px;
}

.calories-number {
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.calories-label {
  font-size: 14px;
  opacity: 0.8;
  margin: 5px 0 0 0;
}

.progress-ring {
  position: relative;
  width: 80px;
  height: 80px;
}

.flame-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.macros-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.macro-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 16px;
  text-align: center;
  backdrop-filter: blur(10px);
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.macro-amount {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.macro-label {
  font-size: 11px;
  opacity: 0.8;
  margin-bottom: 8px;
}

.macro-progress {
  position: relative;
  display: flex;
  justify-content: center;
  width: 50px;
  height: 50px;
  margin: 0 auto;
}

.macro-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.product-info {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.product-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: white;
}

.product-brand {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.food-items {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.food-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 12px;
}

.food-item:last-child {
  margin-bottom: 0;
}

.food-image {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.food-info {
  flex: 1;
}

.food-name {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: white;
}

.food-calories {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.food-macros {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.macro-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.protein-color { color: #ff6b6b; }
.carbs-color { color: #ffa726; }
.fats-color { color: #42a5f5; }

.food-amount {
  font-size: 14px;
  opacity: 0.7;
  font-weight: 500;
}

.notes {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 24px;
  border-left: 4px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.notes h4 {
  color: white;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
}

.notes p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
}

.save-btn {
  background: white;
  color: #1e1e2e;
  border: none;
  padding: 16px 32px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: transform 0.2s;
  flex: 1;
  max-width: 200px;
}

.save-btn:hover {
  transform: translateY(-2px);
}

.cancel-btn, .retry-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.2s;
  flex: 1;
  max-width: 200px;
}

.cancel-btn:hover, .retry-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Tab Styles */
.scan-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  justify-content: center;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.tab-button.active {
  background: #4ade80;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
}

.tab-button:hover:not(.active) {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.tab-icon {
  font-size: 18px;
}

/* Scanner Interface Styles */
.scanner-interface {
  max-width: 400px;
  margin: 0 auto;
}

.camera-view, .barcode-view {
  text-align: center;
}

.camera-frame, .scanner-frame {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.camera-overlay, .scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scan-area {
  width: 200px;
  height: 200px;
  border: 2px solid #4ade80;
  border-radius: 15px;
  position: relative;
  animation: pulse 2s infinite;
}

.scan-area-barcode {
  width: 250px;
  height: 100px;
  border: 2px solid #4ade80;
  border-radius: 10px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scan-line {
  width: 100%;
  height: 2px;
  background: #4ade80;
  animation: scanLine 2s infinite;
}

@keyframes pulse {
  0%, 100% { 
    border-color: #4ade80;
    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4);
  }
  50% { 
    border-color: #22c55e;
    box-shadow: 0 0 0 10px rgba(74, 222, 128, 0);
  }
}

@keyframes scanLine {
  0% { transform: translateY(-50px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(50px); opacity: 0; }
}

.camera-placeholder, .scanner-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  z-index: 1;
}

.camera-placeholder p, .scanner-placeholder p {
  margin: 12px 0 0 0;
  font-size: 14px;
  font-weight: 500;
}

.camera-controls, .scanner-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.capture-button {
  width: 80px;
  height: 80px;
  border: 4px solid white;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.capture-button:hover {
  border-color: #4ade80;
  transform: scale(1.05);
}

.capture-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.capture-inner {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.capture-inner.scanning {
  background: #4ade80;
  animation: pulse 1s infinite;
}

.scan-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: #4ade80;
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.scan-button:hover {
  background: #22c55e;
  transform: translateY(-2px);
}

.scan-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.capture-hint {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
  text-align: center;
}

.loading-spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@media (max-width: 768px) {
  .macros-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .macro-card {
    height: 80px;
    padding: 12px;
  }
  
  .main-card {
    height: 100px;
    padding: 20px;
  }
  
  .calories-number {
    font-size: 28px;
  }
  
  .progress-ring {
    width: 60px;
    height: 60px;
  }
  
  .results-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .save-btn, .cancel-btn, .retry-btn {
    max-width: none;
  }

  .food-item {
    flex-wrap: wrap;
    gap: 10px;
  }

  .food-macros {
    flex-wrap: wrap;
    gap: 8px;
  }

  .tab-button {
    padding: 10px 20px;
    font-size: 14px;
  }

  .camera-frame, .scanner-frame {
    height: 250px;
  }

  .scan-area {
    width: 160px;
    height: 160px;
  }

  .scan-area-barcode {
    width: 200px;
    height: 80px;
  }
}
</style>
