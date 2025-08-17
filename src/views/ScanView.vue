<template>
  <div class="scan-view">
    <!-- Header -->
    <header class="header">
      <div class="logo-section">
        <svg class="logo" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <h1 class="app-title">Cal AI</h1>
      </div>
      <router-link to="/" class="back-button">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </router-link>
    </header>

    <!-- Scan Type Selection -->
    <div class="scan-options" v-if="!isScanning && !scanResults && !error">
      <h2 class="section-title">Scannen</h2>
      <p class="section-subtitle">Wählen Sie eine Scan-Option</p>
      
      <div class="option-card" @click="startFoodScan">
        <div class="option-icon">📸</div>
        <h3>Essen scannen</h3>
        <p>Foto vom Essen aufnehmen und analysieren lassen</p>
      </div>
      
      <div class="option-card" @click="startBarcodeScan">
        <div class="option-icon">📱</div>
        <h3>Barcode scannen</h3>
        <p>Produktbarcode scannen für Nährwertinformationen</p>
      </div>
    </div>

    <!-- Loading State -->
    <div class="loading-state" v-if="isScanning || isAnalyzing">
      <div class="loading-card">
        <div class="loading-spinner"></div>
        <h3>{{ loadingMessage }}</h3>
        <button @click="cancelScan" class="cancel-btn">Abbrechen</button>
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
import { ref, computed } from 'vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner'

// Reactive state
const isScanning = ref(false)
const isAnalyzing = ref(false)
const scanResults = ref<any>(null)
const error = ref('')
const loadingMessage = ref('')

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
    
    if (!result.success) {
      throw new Error(result.message || 'Analyse fehlgeschlagen')
    }

    scanResults.value = {
      type: 'food',
      data: result.data,
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

// Cancel scanning
function cancelScan() {
  isScanning.value = false
  isAnalyzing.value = false
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
</script>

<style scoped>
.scan-view {
  height: 100vh;
  height: 100dvh;
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
  color: white;
  padding: 16px;
  padding-top: max(44px, env(safe-area-inset-top, 44px));
  padding-bottom: max(80px, calc(80px + env(safe-area-inset-bottom, 0px)));
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  height: 44px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 24px;
  height: 24px;
}

.app-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  text-decoration: none;
  transition: background-color 0.2s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: white;
}

.section-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin-bottom: 32px;
}

.scan-options {
  display: grid;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.option-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  backdrop-filter: blur(10px);
}

.option-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.option-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.option-card h3 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #ffffff;
  font-weight: 600;
}

.option-card p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.4;
}

.loading-state, .error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-card, .error-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  backdrop-filter: blur(10px);
  max-width: 400px;
  width: 100%;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.results {
  max-width: 800px;
  margin: 0 auto;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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
    gap: 16px;
    align-items: flex-start;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .save-btn, .cancel-btn, .retry-btn {
    max-width: none;
  }

  .food-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    text-align: left;
  }

  .food-macros {
    flex-wrap: wrap;
  }
}
</style>
