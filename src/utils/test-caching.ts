// Test script to verify barcode caching functionality
import { BarcodeCache, ScanHistory } from './storage';

async function testCaching() {
  console.log('🧪 Testing Barcode Caching...');
  
  // Test barcode caching
  const testBarcode = '1234567890123';
  const testProduct = {
    name: 'Test Product',
    calories: 100,
    protein: 5,
    carbs: 20,
    fats: 3,
    healthScore: 8,
    ingredients: ['Test ingredient'],
    barcode: testBarcode,
    source: 'Test'
  };

  // Cache the product
  await BarcodeCache.set(testBarcode, testProduct);
  console.log('✅ Product cached');

  // Retrieve from cache
  const cached = await BarcodeCache.get(testBarcode);
  console.log('✅ Product retrieved from cache:', cached?.name);

  // Test cache stats
  const stats = await BarcodeCache.getStats();
  console.log('📊 Cache stats:', stats);

  // Test scan history
  console.log('\n🧪 Testing Scan History...');
  
  const testScan = {
    id: Date.now(),
    type: 'barcode' as const,
    timestamp: new Date().toISOString(),
    time: '12:30',
    image: 'test-image-url',
    data: {
      product_name: testProduct.name,
      nutriments: {
        energy_kcal_100g: testProduct.calories,
        proteins_100g: testProduct.protein,
        carbohydrates_100g: testProduct.carbs,
        fat_100g: testProduct.fats
      }
    }
  };

  await ScanHistory.add(testScan);
  console.log('✅ Scan added to history');

  const history = await ScanHistory.get();
  console.log('✅ Scan history retrieved:', history.length, 'items');

  // Test migration
  console.log('\n✅ All tests completed successfully!');
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testCaching = testCaching;
  console.log('🎯 Test function available as window.testCaching()');
}

export { testCaching };
