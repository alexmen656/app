const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.get('/:barcode', async (req, res) => {
    const { barcode } = req.params;

    if (!barcode) {
        return res.status(400).json({
            error: 'Barcode is required'
        });
    }

    try {
        const nutritionixProduct = await fetchFromNutritionix(barcode);
        if (nutritionixProduct) {
            ``
            return res.json({
                success: true,
                product: nutritionixProduct
            });
        }
    } catch (error) {
        console.error('Nutritionix API failed:', error.message);
    }

    try {
        const openFoodFactsProduct = await fetchFromOpenFoodFacts(barcode);
        if (openFoodFactsProduct) {
            return res.json({
                success: true,
                product: openFoodFactsProduct
            });
        }
    } catch (error) {
        console.error('OpenFoodFacts API failed:', error.message);
    }

    return res.json({
        success: true,
        product: {
            names: {
                en: 'Unknown Product',
                de: 'Unknown Product',
                es: 'Unknown Product'
            },
            image: null,
            nutrition: {
                per100g: {
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fats: 0,
                    fiber: 0,
                    sugar: 0,
                    salt: 0
                },
                perServing: {
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fats: 0,
                    fiber: 0,
                    sugar: 0,
                    salt: 0
                }
            },
            healthScore: 5,
            ingredients: [],
            barcode: barcode,
            servingSize: 100,
            servingUnit: 'g',
            packageSize: null,
            source: 'Manual'
        },
        warning: 'Product not found in databases. Manual entry required.'
    });
});

const fetchFromNutritionix = async (barcode) => {
    const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
    const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;

    const response = await fetch(`https://trackapi.nutritionix.com/v2/search/item?upc=${barcode}`, {
        method: 'GET',
        headers: {
            'x-app-id': NUTRITIONIX_APP_ID,
            'x-app-key': NUTRITIONIX_API_KEY,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Nutritionix API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.foods || data.foods.length === 0) {
        throw new Error('No product found in Nutritionix');
    }

    const food = data.foods[0];
    const servingWeight = food.serving_weight_grams || 100;
    const factor100g = 100 / servingWeight;

    const perServing = {
        calories: Math.round(food.nf_calories || 0),
        protein: Math.round((food.nf_protein || 0) * 10) / 10,
        carbs: Math.round((food.nf_total_carbohydrate || 0) * 10) / 10,
        fats: Math.round((food.nf_total_fat || 0) * 10) / 10,
        fiber: Math.round((food.nf_dietary_fiber || 0) * 10) / 10,
        sugar: Math.round((food.nf_sugars || 0) * 10) / 10,
        salt: Math.round((food.nf_sodium || 0) / 1000 * 2.54 * 10) / 10
    };

    const per100g = {
        calories: Math.round((perServing.calories * factor100g)),
        protein: Math.round((perServing.protein * factor100g) * 10) / 10,
        carbs: Math.round((perServing.carbs * factor100g) * 10) / 10,
        fats: Math.round((perServing.fats * factor100g) * 10) / 10,
        fiber: Math.round((perServing.fiber * factor100g) * 10) / 10,
        sugar: Math.round((perServing.sugar * factor100g) * 10) / 10,
        salt: Math.round((perServing.salt * factor100g) * 10) / 10
    };

    return {
        names: {
            en: food.food_name || 'Unknown Product',
            de: food.food_name || 'Unknown Product',
            es: food.food_name || 'Unknown Product'
        },
        image: food.photo?.thumb || food.photo?.highres || null,
        nutrition: {
            per100g,
            perServing
        },
        healthScore: calculateNutritionixHealthScore(food),
        ingredients: food.nf_ingredient_statement ?
            food.nf_ingredient_statement.split(/[,;]/).map(s => s.trim()).filter(Boolean) : [],
        barcode: barcode,
        servingSize: food.serving_qty || 1,
        servingUnit: food.serving_unit || 'serving',
        packageSize: food.serving_weight_grams ? `${food.serving_weight_grams}g` : null,
        brand: food.brand_name || null,
        source: 'Nutritionix'
    };
};

const fetchFromOpenFoodFacts = async (barcode) => {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}`);

    if (!response.ok) {
        throw new Error(`OpenFoodFacts API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.product) {
        throw new Error('Product not found in OpenFoodFacts');
    }

    const nutriments = data.product.nutriments || {};

    const per100g = {
        calories: Math.round(nutriments.energy_kcal_100g || nutriments['energy-kcal_100g'] || 0),
        protein: Math.round((nutriments.proteins_100g || 0) * 10) / 10,
        carbs: Math.round((nutriments.carbohydrates_100g || 0) * 10) / 10,
        fats: Math.round((nutriments.fat_100g || 0) * 10) / 10,
        fiber: Math.round((nutriments.fiber_100g || 0) * 10) / 10,
        sugar: Math.round((nutriments.sugars_100g || 0) * 10) / 10,
        salt: Math.round((nutriments.salt_100g || 0) * 10) / 10
    };

    const packageSize = data.product.quantity || null;
    let servingSize = 100;
    let servingUnit = 'g';

    if (data.product.serving_quantity) {
        servingSize = parseFloat(data.product.serving_quantity);
        servingUnit = data.product.serving_quantity_unit || 'g';
    } else if (packageSize) {
        const sizeMatch = packageSize.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)/);
        if (sizeMatch) {
            servingSize = parseFloat(sizeMatch[1]);
            servingUnit = sizeMatch[2];
        }
    }

    const servingFactor = servingSize / 100;
    const perServing = {
        calories: Math.round(per100g.calories * servingFactor),
        protein: Math.round((per100g.protein * servingFactor) * 10) / 10,
        carbs: Math.round((per100g.carbs * servingFactor) * 10) / 10,
        fats: Math.round((per100g.fats * servingFactor) * 10) / 10,
        fiber: Math.round((per100g.fiber * servingFactor) * 10) / 10,
        sugar: Math.round((per100g.sugar * servingFactor) * 10) / 10,
        salt: Math.round((per100g.salt * servingFactor) * 10) / 10
    };

    return {
        names: {
            en: data.product.product_name || 'Unknown Product',
            de: data.product.product_name || 'Unknown Product',
            es: data.product.product_name || 'Unknown Product'
        },
        image: data.product.image_url || null,
        nutrition: {
            per100g,
            perServing
        },
        healthScore: calculateHealthScore(nutriments),
        ingredients: data.product.ingredients_text ?
            data.product.ingredients_text.split(/[,;]/).map(s => s.trim()).filter(Boolean) : [],
        barcode: barcode,
        servingSize: servingSize,
        servingUnit: servingUnit,
        packageSize: packageSize,
        brand: data.product.brands || null,
        source: 'OpenFoodFacts'
    };
};

const calculateNutritionixHealthScore = (food) => {
    let score = 7;

    const calories = food.nf_calories || 0;
    const sugar = food.nf_sugars || 0;
    const sodium = food.nf_sodium || 0;
    const fiber = food.nf_dietary_fiber || 0;
    const saturatedFat = food.nf_saturated_fat || 0;
    const protein = food.nf_protein || 0;
    const servingWeight = food.serving_weight_grams || 100;
    const factor = 100 / servingWeight;

    const sugar100g = sugar * factor;
    const sodium100g = sodium * factor;
    const fiber100g = fiber * factor;
    const saturatedFat100g = saturatedFat * factor;
    const protein100g = protein * factor;

    if (sugar100g > 20) score -= 2;
    else if (sugar100g > 10) score -= 1;
    if (sodium100g > 1000) score -= 2;
    else if (sodium100g > 500) score -= 1;
    if (fiber100g > 5) score += 1;
    if (saturatedFat100g > 10) score -= 1;
    if (protein100g > 15) score += 1;
    if (calories > 500) score -= 1;

    return Math.max(1, Math.min(10, score));
};

const calculateHealthScore = (nutriments) => {
    let score = 7;

    const sugar = nutriments.sugars_100g || 0;
    const sodium = nutriments.sodium_100g || 0;
    const salt = nutriments.salt_100g || 0;
    const fiber = nutriments.fiber_100g || 0;
    const saturatedFat = nutriments['saturated-fat_100g'] || 0;
    const protein = nutriments.proteins_100g || 0;

    if (sugar > 20) score -= 2;
    else if (sugar > 10) score -= 1;

    const sodiumMg = sodium * 1000;
    const saltEquivalent = salt * 400;
    const totalSodium = Math.max(sodiumMg, saltEquivalent);

    if (totalSodium > 1000) score -= 2;
    else if (totalSodium > 500) score -= 1;
    if (fiber > 5) score += 1;
    if (saturatedFat > 10) score -= 1;
    if (protein > 15) score += 1;
    return Math.max(1, Math.min(10, score));
};

module.exports = router;