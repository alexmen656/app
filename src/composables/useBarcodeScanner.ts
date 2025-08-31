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

export function useBarcodeScanner() {
  const router = useRouter()
  const isScanning = ref(false)
  const hasPermission = ref(false)
  const currentMode = ref<'barcode' | 'photo'>('barcode')

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

      isScanning.value = true
      currentMode.value = options.mode || 'barcode'

      // Set up event listeners
      KaloriqBarcodeScanner.addListener('barcodeScanned', handleBarcodeScanned)
      KaloriqBarcodeScanner.addListener('photoTaken', handlePhotoTaken)

      // Start the native scanner
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
    
    // Navigate to nutrition view with barcode data
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
    console.log('Photo taken:', { width: result.width, height: result.height })
    
    isScanning.value = false
    
    try {
      // Analyze the photo for food content
      const analyzedFood = await analyzeFoodPhoto(result.base64)
      
      // Navigate to nutrition view with food data
      await router.push({
        name: 'Nutrition',
        query: {
          foodData: JSON.stringify(analyzedFood),
          photo: result.base64
        }
      })
    } catch (error) {
      console.error('Food analysis failed:', error)
      
      // Navigate anyway with basic data
      await router.push({
        name: 'Nutrition', 
        query: {
          foodData: JSON.stringify({
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

  // Analyze food photo using KaloriQ API
  const analyzeFoodPhoto = async (base64Image: string) => {
    try {
      // Convert base64 to blob
      const response = await fetch(base64Image)
      const blob = await response.blob()

      // Create form data
      const formData = new FormData()
      formData.append('image', blob, 'photo.jpg')

      // Send to KaloriQ Food Analyze API
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
      console.error('Food analysis error:', error)
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
    
    // Methods
    checkPermission,
    requestPermission,
    startScanning,
    stopScanning,
    switchCamera,
    toggleFlash,
    takePhoto
  }
}
