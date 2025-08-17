<template>
  <div class="scan-view">
    <!-- Header -->
    <div class="header">
      <h1>Scannen</h1>
      <p>Wählen Sie eine Scan-Option</p>
    </div>

    <!-- Scan Type Selection -->
    <div class="scan-options" v-if="!isScanning">
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
      <div class="loading-spinner"></div>
      <h3>{{ loadingMessage }}</h3>
      <button @click="cancelScan" class="cancel-btn">Abbrechen</button>
    </div>

    <!-- Results Display -->
    <div class="results" v-if="scanResults">
      <div class="results-header">
        <h2>Scan-Ergebnisse</h2>
        <button @click="resetScan" class="reset-btn">Neuer Scan</button>
      </div>

      <!-- Food Analysis Results -->
      <div v-if="scanResults.type === 'food'" class="food-results">
        <div class="confidence-badge" :class="confidenceClass">
          Vertrauen: {{ scanResults.data.confidence }}
        </div>
        
        <div class="total-nutrition">
          <h3>Gesamt-Nährwerte</h3>
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <span class="label">Kalorien</span>
              <span class="value">{{ scanResults.data.total.calories }} kcal</span>
            </div>
            <div class="nutrition-item">
              <span class="label">Protein</span>
              <span class="value">{{ scanResults.data.total.protein }}g</span>
            </div>
            <div class="nutrition-item">
              <span class="label">Kohlenhydrate</span>
              <span class="value">{{ scanResults.data.total.carbs }}g</span>
            </div>
            <div class="nutrition-item">
              <span class="label">Fett</span>
              <span class="value">{{ scanResults.data.total.fat }}g</span>
            </div>
          </div>
        </div>

        <div class="food-items">
          <h3>Erkannte Lebensmittel</h3>
          <div v-for="food in scanResults.data.foods" :key="food.name" class="food-item">
            <div class="food-info">
              <h4>{{ food.name }}</h4>
              <span class="amount">{{ food.amount }}</span>
            </div>
            <div class="food-nutrition">
              <span>{{ food.calories }} kcal</span>
              <span>P: {{ food.protein }}g</span>
              <span>K: {{ food.carbs }}g</span>
              <span>F: {{ food.fat }}g</span>
            </div>
          </div>
        </div>

        <div class="notes" v-if="scanResults.data.notes">
          <h4>Hinweise</h4>
          <p>{{ scanResults.data.notes }}</p>
        </div>
      </div>

      <!-- Barcode Results -->
      <div v-if="scanResults.type === 'barcode'" class="barcode-results">
        <div class="product-info">
          <h3>{{ scanResults.data.product_name || 'Unbekanntes Produkt' }}</h3>
          <p v-if="scanResults.data.brands">Marke: {{ scanResults.data.brands }}</p>
        </div>

        <div class="nutrition-grid" v-if="scanResults.data.nutriments">
          <div class="nutrition-item">
            <span class="label">Kalorien</span>
            <span class="value">{{ Math.round(scanResults.data.nutriments.energy_kcal_100g || 0) }} kcal/100g</span>
          </div>
          <div class="nutrition-item">
            <span class="label">Protein</span>
            <span class="value">{{ (scanResults.data.nutriments.proteins_100g || 0).toFixed(1) }}g/100g</span>
          </div>
          <div class="nutrition-item">
            <span class="label">Kohlenhydrate</span>
            <span class="value">{{ (scanResults.data.nutriments.carbohydrates_100g || 0).toFixed(1) }}g/100g</span>
          </div>
          <div class="nutrition-item">
            <span class="label">Fett</span>
            <span class="value">{{ (scanResults.data.nutriments.fat_100g || 0).toFixed(1) }}g/100g</span>
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
      <div class="error-icon">⚠️</div>
      <h3>Fehler beim Scannen</h3>
      <p>{{ error }}</p>
      <button @click="resetScan" class="retry-btn">Erneut versuchen</button>
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
    
    // Take photo
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    })

    if (!image.dataUrl) {
      throw new Error('Kein Bild aufgenommen')
    }

    loadingMessage.value = 'Essen wird analysiert...'
    isAnalyzing.value = true

    // Convert data URL to blob
    const response = await fetch(image.dataUrl)
    const blob = await response.blob()
    
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
      data: result.data
    }

  } catch (err: any) {
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

// Save results (placeholder - implement actual storage logic)
function saveResults() {
  // TODO: Implement saving to local storage or backend
  console.log('Saving results:', scanResults.value)
  alert('Ergebnisse gespeichert!')
  resetScan()
}
</script>

<style scoped>
.scan-view {
  min-height: 100vh;
  background: #1a1a1a;
  color: #ffffff;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #4ade80;
}

.header p {
  color: #a1a1aa;
  font-size: 1rem;
}

.scan-options {
  display: grid;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.option-card {
  background: #262626;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.option-card:hover {
  background: #374151;
  border-color: #4ade80;
  transform: translateY(-2px);
}

.option-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.option-card h3 {
  font-size: 1.25rem;
  margin-bottom: 8px;
  color: #ffffff;
}

.option-card p {
  color: #a1a1aa;
  font-size: 0.875rem;
}

.loading-state {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #374151;
  border-top: 4px solid #4ade80;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.cancel-btn, .retry-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.cancel-btn:hover, .retry-btn:hover {
  background: #b91c1c;
}

.results {
  max-width: 800px;
  margin: 0 auto;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.results-header h2 {
  color: #4ade80;
  font-size: 1.5rem;
}

.reset-btn {
  background: #6b7280;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.reset-btn:hover {
  background: #4b5563;
}

.confidence-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
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

.total-nutrition, .product-info {
  background: #262626;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
}

.total-nutrition h3, .product-info h3 {
  color: #4ade80;
  margin-bottom: 16px;
  font-size: 1.25rem;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.nutrition-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #374151;
  border-radius: 8px;
}

.nutrition-item .label {
  color: #a1a1aa;
  font-size: 0.875rem;
}

.nutrition-item .value {
  color: #ffffff;
  font-weight: 600;
}

.food-items {
  background: #262626;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
}

.food-items h3 {
  color: #4ade80;
  margin-bottom: 16px;
  font-size: 1.25rem;
}

.food-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #374151;
  border-radius: 8px;
  margin-bottom: 12px;
}

.food-item:last-child {
  margin-bottom: 0;
}

.food-info h4 {
  color: #ffffff;
  margin-bottom: 4px;
  font-size: 1rem;
}

.food-info .amount {
  color: #a1a1aa;
  font-size: 0.875rem;
}

.food-nutrition {
  display: flex;
  gap: 12px;
  font-size: 0.875rem;
  color: #a1a1aa;
}

.notes {
  background: #1f2937;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  border-left: 4px solid #4ade80;
}

.notes h4 {
  color: #4ade80;
  margin-bottom: 8px;
  font-size: 1rem;
}

.notes p {
  color: #a1a1aa;
  font-size: 0.875rem;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 30px;
}

.save-btn {
  background: #4ade80;
  color: #1a1a1a;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.save-btn:hover {
  background: #22c55e;
}

.error-state {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.error-state h3 {
  color: #dc2626;
  margin-bottom: 12px;
  font-size: 1.25rem;
}

.error-state p {
  color: #a1a1aa;
  margin-bottom: 20px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .scan-view {
    padding: 16px;
  }
  
  .nutrition-grid {
    grid-template-columns: 1fr;
  }
  
  .food-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .food-nutrition {
    flex-wrap: wrap;
  }
  
  .results-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
