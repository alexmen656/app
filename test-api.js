// Frontend code to fetch product by barcode
const fetchProductFromAPI = async (barcode) => {
    try {
        const response = await fetch(`http://kaloriq-api.vercel.app/api/product/${barcode}`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            console.log('Product found:', data.product);
            
            // Update your Vue.js reactive variables
            product.value = data.product;
            editedProduct.value = { ...product.value };
            
            if (data.warning) {
                console.warn(data.warning);
                // Show warning to user that manual entry might be needed
            }
            
            return data.product;
        } else {
            throw new Error('Product not found');
        }
        
    } catch (error) {
        console.error('Error fetching product:', error);
        
        // Fallback handling
        product.value = {
            name: 'Unknown Product',
            image: null,
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            healthScore: 5,
            ingredients: [],
            barcode: barcode,
            source: 'Manual'
        };
        editedProduct.value = { ...product.value };
        
        return null;
    }
};

// Replace your existing fetchProduct function with this:
const fetchProduct = (barcode) => {
    return fetchProductFromAPI(barcode);
};

// Usage in your Vue component
onMounted(() => {
    if (route.query.barcode) {
        fetchProduct(route.query.barcode);
    } else if (route.query.foodData) {
        // Handle food scan data (keep your existing logic)
        try {
            const foodData = JSON.parse(route.query.foodData);
            product.value = {
                name: foodData.name || 'Scanned Food',
                image: route.query.photo,
                calories: foodData.calories || 0,
                protein: foodData.protein || 0,
                carbs: foodData.carbs || 0,
                fats: foodData.fats || 0,
                healthScore: foodData.healthScore || 7,
                ingredients: foodData.ingredients || [],
                type: 'food'
            };
            editedProduct.value = { ...product.value };
        } catch (e) {
            console.error('Error parsing food data:', e);
        }
    }
});