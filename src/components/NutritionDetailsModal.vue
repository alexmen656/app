<template>
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
        <div class="details-modal" @click.stop>
            <div class="details-header">
                <h3>{{ $t('nutrition.allNutritionInfo') }}</h3>
                <button @click="$emit('close')" class="close-btn">×</button>
            </div>
            <div class="details-content">
                <div class="details-section">
                    <h4>{{ $t('nutrition.mainNutrients') }} ({{ amount }}x {{ $t('nutrition.portion') }})</h4>
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.calories') }}</span>
                            <span class="detail-value">{{ Math.round(product.calories * amount) }} kcal</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.protein') }}</span>
                            <span class="detail-value">{{ Math.round(product.protein * amount) }}g</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.carbs') }}</span>
                            <span class="detail-value">{{ Math.round(product.carbs * amount) }}g</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.fat') }}</span>
                            <span class="detail-value">{{ Math.round(product.fats * amount) }}g</span>
                        </div>
                        <div v-if="product.fiber > 0" class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.fiber') }}</span>
                            <span class="detail-value">{{ Math.round(product.fiber * amount) }}g</span>
                        </div>
                        <div v-if="product.sugar > 0" class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.sugar') }}</span>
                            <span class="detail-value">{{ Math.round(product.sugar * amount) }}g</span>
                        </div>
                        <div v-if="product.salt > 0" class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.salt') }}</span>
                            <span class="detail-value">{{ Math.round(product.salt * amount * 100) / 100 }}g</span>
                        </div>
                    </div>
                </div>
                <div v-if="product.nutritionPer100g" class="details-section">
                    <h4>{{ $t('nutrition.per100g') }}</h4>
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.calories') }}</span>
                            <span class="detail-value">{{ product.nutritionPer100g.calories || 0 }} kcal</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.protein') }}</span>
                            <span class="detail-value">{{ product.nutritionPer100g.protein || 0 }}g</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.carbs') }}</span>
                            <span class="detail-value">{{ product.nutritionPer100g.carbs || 0 }}g</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.fat') }}</span>
                            <span class="detail-value">{{ product.nutritionPer100g.fats || 0 }}g</span>
                        </div>
                        <div v-if="product.nutritionPer100g.fiber > 0" class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.fiber') }}</span>
                            <span class="detail-value">{{ product.nutritionPer100g.fiber }}g</span>
                        </div>
                        <div v-if="product.nutritionPer100g.sugar > 0" class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.sugar') }}</span>
                            <span class="detail-value">{{ product.nutritionPer100g.sugar }}g</span>
                        </div>
                        <div v-if="product.nutritionPer100g.salt > 0" class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.salt') }}</span>
                            <span class="detail-value">{{ product.nutritionPer100g.salt }}g</span>
                        </div>
                    </div>
                </div>
                <div v-if="product.nutritionPerServing" class="details-section">
                    <h4>{{ $t('nutrition.perServing') }} ({{ product.servingSize }}{{ product.servingUnit }})</h4>
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.calories') }}</span>
                            <span class="detail-value">{{ product.nutritionPerServing.calories || 0 }} kcal</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.protein') }}</span>
                            <span class="detail-value">{{ product.nutritionPerServing.protein || 0 }}g</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.carbs') }}</span>
                            <span class="detail-value">{{ product.nutritionPerServing.carbs || 0 }}g</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.fat') }}</span>
                            <span class="detail-value">{{ product.nutritionPerServing.fats || 0 }}g</span>
                        </div>
                        <div v-if="product.nutritionPerServing.fiber > 0" class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.fiber') }}</span>
                            <span class="detail-value">{{ product.nutritionPerServing.fiber }}g</span>
                        </div>
                        <div v-if="product.nutritionPerServing.sugar > 0" class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.sugar') }}</span>
                            <span class="detail-value">{{ product.nutritionPerServing.sugar }}g</span>
                        </div>
                        <div v-if="product.nutritionPerServing.salt > 0" class="detail-item">
                            <span class="detail-label">{{ $t('nutrition.salt') }}</span>
                            <span class="detail-value">{{ product.nutritionPerServing.salt }}g</span>
                        </div>
                    </div>
                </div>
                <div class="details-section">
                    <h4>{{ $t('nutrition.productInfo') }}</h4>
                    <div class="product-details">
                        <div v-if="product.brand" class="product-detail">
                            <span class="detail-label">{{ $t('nutrition.brand') }}</span>
                            <span class="detail-value">{{ product.brand }}</span>
                        </div>
                        <div v-if="product.packageSize" class="product-detail">
                            <span class="detail-label">{{ $t('nutrition.packageSize') }}</span>
                            <span class="detail-value">{{ product.packageSize }}</span>
                        </div>
                        <div v-if="product.barcode" class="product-detail">
                            <span class="detail-label">{{ $t('nutrition.barcode') }}</span>
                            <span class="detail-value">{{ product.barcode }}</span>
                        </div>
                        <div class="product-detail">
                            <span class="detail-label">{{ $t('nutrition.healthScore') }}</span>
                            <span class="detail-value">{{ product.healthScore }}/10</span>
                        </div>
                        <div class="product-detail">
                            <span class="detail-label">{{ $t('nutrition.source') }}</span>
                            <span class="detail-value">{{ product.source }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
    show: {
        type: Boolean,
        default: false
    },
    product: {
        type: Object,
        required: true
    },
    amount: {
        type: Number,
        default: 1
    }
});

defineEmits(['close']);
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
}

.details-modal {
    background: #1a1a1a;
    border-radius: 24px;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 24px 0;
    border-bottom: 1px solid #333;
    margin-bottom: 20px;
}

.details-header h3 {
    color: #00ff8c;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    color: #999;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background: #333;
    color: #fff;
}

.details-content {
    max-height: calc(80vh - 100px);
    overflow-y: auto;
    padding: 0 24px 24px;
}

.details-section {
    margin-bottom: 32px;
}

.details-section h4 {
    color: #00ff8c;
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 16px 0;
    border-bottom: 1px solid #333;
    padding-bottom: 8px;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
}

.detail-item {
    background: #2a2a2a;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.detail-label {
    color: #999;
    font-size: 14px;
    font-weight: 500;
}

.detail-value {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
}

.product-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.product-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #2a2a2a;
    border-radius: 12px;
}

@media (max-width: 768px) {
    .modal-overlay {
        padding: 10px;
    }

    .details-modal {
        max-height: 90vh;
    }

    .details-grid {
        grid-template-columns: 1fr;
    }

    .details-header {
        padding: 20px 20px 0;
    }

    .details-content {
        padding: 0 20px 20px;
    }
}
</style>
