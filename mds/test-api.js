// Test script for Kaloriq API endpoints
console.log('🧪 Testing Kaloriq API...');

// Test Barcode API
const testBarcodeAPI = async (barcode = '8901030895486') => {
    try {
        console.log(`\n📊 Testing Barcode API with: ${barcode}`);
        const response = await fetch(`https://v2-1.api.kalbuddy.com/api/product/${barcode}`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Product found:', data.product.name);
            console.log('📋 Nutrition:', {
                calories: data.product.calories,
                protein: data.product.protein,
                carbs: data.product.carbs,
                fats: data.product.fats
            });
            
            if (data.warning) {
                console.warn('⚠️ Warning:', data.warning);
            }
            
            return data.product;
        } else {
            throw new Error('Product not found');
        }
        
    } catch (error) {
        console.error('❌ Error fetching product:', error);
        return null;
    }
};

// Test Food Analysis API 
const testFoodAnalysisAPI = async () => {
    try {
        console.log('\n🍽️ Testing Food Analysis API...');
        
        // Create a simple test image (1x1 pixel PNG)
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgb(200, 100, 50)';
        ctx.fillRect(0, 0, 1, 1);
        
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('image', blob, 'test.jpg');
            
            const response = await fetch('https://v2-1.api.kalbuddy.com/api/food/analyze', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                console.log('✅ Food analysis successful');
                console.log('🍕 Detected foods:', data.data.foods?.length || 0);
                console.log('📊 Total nutrition:', data.data.total);
                console.log('🎯 Confidence:', data.data.confidence);
                return data.data;
            } else {
                throw new Error('Food analysis failed');
            }
        }, 'image/jpeg');
        
    } catch (error) {
        console.error('❌ Error in food analysis:', error);
        return null;
    }
};

// Cache simulation test
const testCachingSimulation = () => {
    console.log('\n💾 Testing localStorage caching simulation...');
    
    const testData = {
        barcode: '1234567890123',
        name: 'Test Product',
        calories: 250,
        protein: 12,
        carbs: 30,
        fats: 8,
        timestamp: Date.now()
    };
    
    // Simulate caching
    localStorage.setItem(`barcode_cache_${testData.barcode}`, JSON.stringify({
        data: testData,
        timestamp: Date.now()
    }));
    
    console.log('✅ Test data cached');
    
    // Simulate cache retrieval
    const cached = localStorage.getItem(`barcode_cache_${testData.barcode}`);
    if (cached) {
        const parsedCache = JSON.parse(cached);
        const ageMinutes = (Date.now() - parsedCache.timestamp) / (1000 * 60);
        console.log('✅ Cache retrieved, age:', Math.round(ageMinutes * 100) / 100, 'minutes');
        console.log('📦 Cached product:', parsedCache.data.name);
    }
};

// Run all tests
const runAllTests = async () => {
    console.log('🚀 Starting API tests...\n');
    
    // Test barcode API with known working barcode
    await testBarcodeAPI('8901030895486'); // Coca Cola
    await testBarcodeAPI('4260479810075'); // Another test barcode
    
    // Test food analysis API
    await testFoodAnalysisAPI();
    
    // Test caching simulation
    testCachingSimulation();
    
    console.log('\n✅ All tests completed!');
    console.log('💡 Note: The app now includes advanced caching with Capacitor Preferences');
};

// Auto-run tests
runAllTests();