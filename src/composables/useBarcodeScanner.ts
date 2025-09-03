import { ref } from 'vue'
import { KaloriqBarcodeScanner } from 'kaloriq-barcode-scanner'
import { useRouter } from 'vue-router'

export interface ScanResult {
  barcode: string
  format: string
  image?: string
  confidence?: number
}

export interface PhotoResult {
  base64: string
  width: number
  height: number
}

export interface LabelResult {
  base64: string
  width: number
  height: number
}

export interface ScanUsageInfo {
  currentCount: number
  limit: number
  remaining: number
  isPremium: boolean
  canScan: boolean
  limitReached: boolean
}

export function useBarcodeScanner() {
  const router = useRouter()
  const isScanning = ref(false)
  const hasPermission = ref(false)
  const currentMode = ref<'barcode' | 'photo' | 'label'>('barcode')
  const isProcessingPhoto = ref(false) // New loading state for photo processing
  const isProcessingLabel = ref(false) // New loading state for label processing
  const scanUsage = ref<ScanUsageInfo | null>(null)

  const checkPermission = async (): Promise<boolean> => {
    try {
      const result = await KaloriqBarcodeScanner.checkCameraPermission()
      hasPermission.value = result.granted
      return result.granted
    } catch (error) {
      console.error('Error checking camera permission:', error)
      return false
    }
  }

  const requestPermission = async (): Promise<boolean> => {
    try {
      const result = await KaloriqBarcodeScanner.requestCameraPermission()
      hasPermission.value = result.granted
      return result.granted
    } catch (error) {
      console.error('Error requesting camera permission:', error)
      return false
    }
  }

    const checkScanLimit = async (): Promise<ScanUsageInfo> => {
    try {
      const usage = await (KaloriqBarcodeScanner as any).canScan()
      scanUsage.value = usage
      return usage
    } catch (error) {
      console.error('Error checking scan limit:', error)
      return {
        currentCount: 0,
        limit: 5,
        remaining: 5,
        isPremium: false,
        canScan: true,
        limitReached: false
      }
    }
  }

  const getScanUsage = async (): Promise<ScanUsageInfo> => {
    try {
      const usage = await (KaloriqBarcodeScanner as any).getScanUsage()
      scanUsage.value = usage
      return usage
    } catch (error) {
      console.error('Error getting scan usage:', error)
      return {
        currentCount: 0,
        limit: 5,
        remaining: 5,
        isPremium: false,
        canScan: true,
        limitReached: false
      }
    }
  }

  // Set premium status (called from RevenueCat)
  const setPremiumStatus = async (isPremium: boolean, expiryDate?: number): Promise<void> => {
    try {
      await (KaloriqBarcodeScanner as any).setPremiumStatus({
        isPremium,
        expiryDate
      })
      // Refresh usage info
      await getScanUsage()
    } catch (error) {
      console.error('Error setting premium status:', error)
    }
  }

  // Reset scan count (for testing)
  const resetScanCount = async (): Promise<void> => {
    try {
      const usage = await (KaloriqBarcodeScanner as any).resetScanCount()
      scanUsage.value = usage
    } catch (error) {
      console.error('Error resetting scan count:', error)
    }
  }

  // Start scanning
  const startScanning = async (options: {
    mode?: 'barcode' | 'photo' | 'label'
    camera?: 'front' | 'back'
    showControls?: boolean
    timeout?: number
  } = {}) => {
    try {
      // Check permission first
      const permitted = await checkPermission()
      if (!permitted) {
        const granted = await requestPermission()
        if (!granted) {
          throw new Error('Camera permission denied')
        }
      }

      // NEW: Check scan limits before starting
      const usage = await checkScanLimit()
      if (!usage.canScan) {
        throw new Error(`SCAN_LIMIT_REACHED: ${usage.remaining} scans remaining today`)
      }

      isScanning.value = true
      currentMode.value = options.mode || 'barcode'

      KaloriqBarcodeScanner.addListener('barcodeScanned', handleBarcodeScanned)
      KaloriqBarcodeScanner.addListener('photoTaken', handlePhotoTaken)
      
      try {
        (KaloriqBarcodeScanner as any).addListener('labelTaken', handleLabelTaken)
      } catch (e) {
        console.log('Label taken listener not available (web fallback)')
      }
      
      try {
        (KaloriqBarcodeScanner as any).addListener('foodAnalyzed', handleFoodAnalyzed)
      } catch (e) {
        console.log('Food analysis listener not available (web fallback)')
      }

      try {
        (KaloriqBarcodeScanner as any).addListener('labelAnalyzed', handleLabelAnalyzed)
      } catch (e) {
        console.log('Label analysis listener not available (web fallback)')
      }

      await (KaloriqBarcodeScanner as any).startScanning({
        mode: options.mode || 'barcode',
        camera: options.camera || 'back',
        showControls: options.showControls ?? true,
        timeout: options.timeout || 0,
        formats: [
          'EAN8',
          'EAN13', 
          'UPC_A',
          'UPC_E',
          'CODE128',
          'ITF'
        ]
      })

    } catch (error) {
      console.error('Error starting scanner:', error)
      isScanning.value = false
      
      // Check if it's a scan limit error
      if (error instanceof Error && error.message?.includes('SCAN_LIMIT_REACHED')) {
        throw new Error(error.message)
      }
      
      throw error
    }
  }

  // Stop scanning
  const stopScanning = async () => {
    try {
      isScanning.value = false
      await KaloriqBarcodeScanner.stopScanning()
      
      // Remove event listeners
      KaloriqBarcodeScanner.removeAllListeners()
    } catch (error) {
      console.error('Error stopping scanner:', error)
    }
  }

  // Handle barcode scan result
  const handleBarcodeScanned = async (result: ScanResult) => {
    console.log('Barcode scanned:', result)
    isScanning.value = false
    
    try {
      await getScanUsage()
    } catch (error) {
      console.error('Error updating scan usage:', error)
    }
    
    await router.push({
      name: 'Nutrition',
      query: {
        barcode: result.barcode,
        format: result.format,
        photo: result.image || ''
      }
    })
  }

  // Handle photo result
  const handlePhotoTaken = async (result: PhotoResult) => {
    console.log('🔥 Photo taken event received:', { width: result.width, height: result.height, base64Length: result.base64?.length })
    isScanning.value = false
    isProcessingPhoto.value = true
    
    try {
      const analyzedFood = await analyzeFoodPhoto(result.base64)      
      isProcessingPhoto.value = false
      
      await router.push({
        name: 'Nutrition',
        query: {
          foodData: JSON.stringify(analyzedFood),
          photo: result.base64
        }
      })
    } catch (error) {
      console.error('🔥 Food analysis failed:', error)
      isProcessingPhoto.value = false
      
      await router.push({
        name: 'Nutrition', 
        query: {
          foodData: JSON.stringify({
            name: 'Scanned Food',
            foods: [{ name: 'Scanned Food', calories: 0, protein: 0, carbs: 0, fat: 0 }],
            total: { calories: 0, protein: 0, carbs: 0, fat: 0 },
            confidence: 'low',
            notes: 'Food analysis failed',
            error: true
          }),
          photo: result.base64
        }
      })
    }
  }

  // Handle label result
  const handleLabelTaken = async (result: LabelResult) => {    
    isScanning.value = false
    isProcessingLabel.value = true
    
    try {
      const analyzedLabel = await analyzeLabelPhoto(result.base64)
      isProcessingLabel.value = false
      
      await router.push({
        name: 'Nutrition',
        query: {
          labelData: JSON.stringify(analyzedLabel),
          photo: result.base64
        }
      })
    } catch (error) {
      console.error('🔥 Label analysis failed:', error)
      isProcessingLabel.value = false
      
      await router.push({
        name: 'Nutrition', 
        query: {
          labelData: JSON.stringify({
            name: 'Scanned Label',
            ingredients: [],
            nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
            confidence: 'low',
            notes: 'Label analysis failed',
            error: true
          }),
          photo: result.base64
        }
      })
    }
  }

  const handleFoodAnalyzed = async (result: any) => {
    console.log('Food analyzed natively:', result)
    isScanning.value = false
    
    await router.push({
      name: 'Nutrition',
      query: {
        foodData: JSON.stringify(result.foodData),
        photo: result.photo
      }
    })
  }

  const handleLabelAnalyzed = async (result: any) => {
    console.log('Label analyzed natively:', result)
    isScanning.value = false
    
    await router.push({
      name: 'Nutrition',
      query: {
        labelData: JSON.stringify(result.labelData),
        photo: result.photo
      }
    })
  }

  // Analyze food photo using KaloriQ API
  const analyzeFoodPhoto = async (base64Image: string) => {
    try {
      const dataUrl = base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`
      
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      
      const formData = new FormData()
      formData.append('image', blob, 'photo.jpg')
      
      const apiResponse = await fetch('https://kaloriq-api.vercel.app/api/food/analyze', {
        method: 'POST',
        body: formData
      })

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`)
      }

      const data = await apiResponse.json()

      if (!data.success || !data.data) {
        throw new Error('Food analysis failed')
      }

      return {
        name: data.data.name || 'Unknown Food',
        foods: data.data.foods || [],
        total: data.data.total || { calories: 0, protein: 0, carbs: 0, fat: 0 },
        confidence: data.data.confidence || 'medium',
        notes: data.data.notes || '',
        timestamp: data.data.timestamp || new Date().toISOString()
      }

    } catch (error) {
      console.error('🔥 Food analysis error:', error)
      throw error
    }
  }

  // Analyze label photo using KaloriQ API
  const analyzeLabelPhoto = async (base64Image: string) => {
    try {
      const dataUrl = base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`
      
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      
      const formData = new FormData()
      formData.append('image', blob, 'label.jpg')

      const apiResponse = await fetch('https://kaloriq-api.vercel.app/api/label/analyze', {
        method: 'POST',
        body: formData
      })

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`)
      }

      const data = await apiResponse.json()

      if (!data.success || !data.data) {
        throw new Error('Label analysis failed')
      }

      return {
        name: data.data.name || 'Unknown Product',
        ingredients: data.data.ingredients || [],
        nutrition: data.data.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0 },
        allergens: data.data.allergens || [],
        claims: data.data.claims || [],
        brand: data.data.brand || '',
        confidence: data.data.confidence || 'medium',
        notes: data.data.notes || '',
        timestamp: data.data.timestamp || new Date().toISOString()
      }

    } catch (error) {
      console.error('🔥 Label analysis error:', error)
      throw error
    }
  }

  // Camera controls
  const switchCamera = async () => {
    try {
      await KaloriqBarcodeScanner.switchCamera()
    } catch (error) {
      console.error('Error switching camera:', error)
    }
  }

  const toggleFlash = async (): Promise<boolean> => {
    try {
      const result = await KaloriqBarcodeScanner.toggleFlash()
      return result.enabled
    } catch (error) {
      console.error('Error toggling flash:', error)
      return false
    }
  }

  const takePhoto = async () => {
    try {
      await KaloriqBarcodeScanner.takePhoto()
    } catch (error) {
      console.error('Error taking photo:', error)
    }
  }

  return {
    // State
    isScanning,
    hasPermission,
    currentMode,
    isProcessingPhoto,
    isProcessingLabel,
    scanUsage,
    
    // Methods
    checkPermission,
    requestPermission,
    startScanning,
    stopScanning,
    switchCamera,
    toggleFlash,
    takePhoto,
    checkScanLimit,
    getScanUsage,
    setPremiumStatus,
    resetScanCount
  }
}
