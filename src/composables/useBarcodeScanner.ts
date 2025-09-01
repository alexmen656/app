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
  const currentMode = ref<'barcode' | 'photo'>('barcode')
  const isProcessingPhoto = ref(false) // New loading state for photo processing
  const scanUsage = ref<ScanUsageInfo | null>(null)

  // Check camera permission
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

  // Request camera permission
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

  // NEW: Scan limit functions
  
  // Check if user can scan (within daily limit)
  const checkScanLimit = async (): Promise<ScanUsageInfo> => {
    try {
      const usage = await (KaloriqBarcodeScanner as any).canScan()
      scanUsage.value = usage
      return usage
    } catch (error) {
      console.error('Error checking scan limit:', error)
      // Default fallback for non-premium users
      return {
        currentCount: 0,
        limit: 10,
        remaining: 10,
        isPremium: false,
        canScan: true,
        limitReached: false
      }
    }
  }

  // Get current scan usage
  const getScanUsage = async (): Promise<ScanUsageInfo> => {
    try {
      const usage = await (KaloriqBarcodeScanner as any).getScanUsage()
      scanUsage.value = usage
      return usage
    } catch (error) {
      console.error('Error getting scan usage:', error)
      return {
        currentCount: 0,
        limit: 10,
        remaining: 10,
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
    mode?: 'barcode' | 'photo'
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

      // Set up event listeners
      KaloriqBarcodeScanner.addListener('barcodeScanned', handleBarcodeScanned)
      KaloriqBarcodeScanner.addListener('photoTaken', handlePhotoTaken)
      
      // Add food analysis listener using generic approach
      try {
        (KaloriqBarcodeScanner as any).addListener('foodAnalyzed', handleFoodAnalyzed)
        //console.log('Food analysis listener added')
      } catch (e) {
        //console.log('Food analysis listener not available (web fallback)')
      }

      // Start the native scanner with scan limit check
      await KaloriqBarcodeScanner.startScanning({
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
    //console.log('Barcode scanned:', result)
    
    isScanning.value = false
    
    // Update scan usage after successful scan
    try {
      await getScanUsage()
    } catch (error) {
      console.error('Error updating scan usage:', error)
    }
    
    console.log("Pushing to nutrition", result.image);
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
    //console.log('🔥 Photo taken event received:', { width: result.width, height: result.height, base64Length: result.base64?.length })
    
    isScanning.value = false
    isProcessingPhoto.value = true // Start processing state
    
    try {
      // Analyze the photo for food content
      //console.log('🔥 Starting food analysis...')
      const analyzedFood = await analyzeFoodPhoto(result.base64)
      //console.log('🔥 Food analysis completed:', analyzedFood)
      
      isProcessingPhoto.value = false // End processing state
      
      // Navigate to nutrition view with food data
      await router.push({
        name: 'Nutrition',
        query: {
          foodData: JSON.stringify(analyzedFood),
          photo: result.base64
        }
      })
    } catch (error) {
      console.error('🔥 Food analysis failed:', error)
      
      isProcessingPhoto.value = false // End processing state
      
      // Navigate anyway with basic data
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

  // Handle food analysis result (NEW - from iOS native analysis)
  const handleFoodAnalyzed = async (result: any) => {
    ////console.log('Food analyzed natively:', result)
    
    isScanning.value = false
    
    // Navigate to nutrition view with pre-analyzed food data
    await router.push({
      name: 'Nutrition',
      query: {
        foodData: JSON.stringify(result.foodData),
        photo: result.photo
      }
    })
  }

  // Analyze food photo using KaloriQ API
  const analyzeFoodPhoto = async (base64Image: string) => {
    try {
      //console.log('🔥 analyzeFoodPhoto called with base64 length:', base64Image.length)
      
      // Ensure base64Image is a data URL
      const dataUrl = base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`
      
      // Convert base64 to blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      
      //console.log('🔥 Blob created, size:', blob.size)

      // Create form data
      const formData = new FormData()
      formData.append('image', blob, 'photo.jpg')

      //console.log('🔥 Sending request to KaloriQ API...')
      
      // Send to KaloriQ Food Analyze API
      const apiResponse = await fetch('https://kaloriq-api.vercel.app/api/food/analyze', {
        method: 'POST',
        body: formData
      })

      //console.log('🔥 API Response status:', apiResponse.status)

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`)
      }

      const data = await apiResponse.json()
      //console.log('🔥 API Response data:', data)

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
      // Result will be handled by the photoTaken event listener
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
    scanUsage,
    
    // Methods
    checkPermission,
    requestPermission,
    startScanning,
    stopScanning,
    switchCamera,
    toggleFlash,
    takePhoto,
    
    // NEW: Scan limit methods
    checkScanLimit,
    getScanUsage,
    setPremiumStatus,
    resetScanCount
  }
}
