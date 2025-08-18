<template>
  <div class="nutrition-container" v-if="product">
    <div class="nutrition-header">
      <img :src="product.image" class="nutrition-image" v-if="product.image"/>
      <button class="nutrition-back" @click="$router.go(-1)">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <h2 class="nutrition-title">Nutrition</h2>
      <button class="nutrition-share">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M18 8.59V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3.59" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 12l5-5m0 0l-5-5m5 5H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button class="nutrition-menu">...</button>
    </div>
    <div class="nutrition-content">
      <div class="nutrition-time">{{ time }}</div>
      <h1 class="nutrition-name">{{ product.name }}</h1>
      <div class="nutrition-amount">
        <span>{{ amount }}</span>
        <button class="nutrition-edit" @click="editAmount"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </div>
      <div class="nutrition-macros">
        <div class="macro calories">
          <div class="macro-label">Calories</div>
          <div class="macro-value">{{ product.calories }}</div>
        </div>
        <div class="macro protein">
          <div class="macro-label">Protein</div>
          <div class="macro-value">{{ product.protein }}g</div>
        </div>
        <div class="macro carbs">
          <div class="macro-label">Carbs</div>
          <div class="macro-value">{{ product.carbs }}g</div>
        </div>
        <div class="macro fats">
          <div class="macro-label">Fats</div>
          <div class="macro-value">{{ product.fats }}g</div>
        </div>
      </div>
      <div class="nutrition-health">
        <div class="health-label">Health Score</div>
        <div class="health-score">{{ product.healthScore }}/10</div>
        <div class="health-bar">
          <div class="health-bar-inner" :style="{ width: (product.healthScore * 10) + '%' }"></div>
        </div>
      </div>
      <div class="nutrition-ingredients">
        <h3>Ingredients</h3>
        <div class="ingredient-list">
          <span v-for="(ing, i) in product.ingredients" :key="i" class="ingredient">{{ ing }}</span>
        </div>
      </div>
      <div class="nutrition-actions">
        <button class="fix-btn">Fix Results</button>
        <button class="done-btn" @click="$router.go(-1)">Done</button>
      </div>
    </div>
  </div>
  <div v-else class="nutrition-loading">Loading...</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const product = ref(null);
const amount = ref(1);
const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const fetchProduct = async (barcode) => {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}`);
    const data = await res.json();
    if (!data.product) throw new Error('Not found');
    // Map Open Food Facts fields to our UI
    product.value = {
      name: data.product.product_name || 'Unknown',
      image: data.product.image_url,
      calories: data.product.nutriments.energy_kcal || '-',
      protein: data.product.nutriments.proteins || '-',
      carbs: data.product.nutriments.carbohydrates || '-',
      fats: data.product.nutriments.fat || '-',
      healthScore: 7, // Placeholder, you can calculate based on nutrition
      ingredients: (data.product.ingredients_text || '').split(/,|;/).map(s => s.trim()).filter(Boolean),
    };
  } catch (e) {
    product.value = null;
  }
};

if (route.query.barcode) {
  fetchProduct(route.query.barcode);
}

function editAmount() {
  // TODO: implement amount editing
}
</script>

<style scoped>
.nutrition-container {
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.nutrition-header {
  position: relative;
  height: 220px;
  background: #f5f5f5;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;
}
.nutrition-image {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100%; height: 100%; object-fit: cover;
  z-index: 1;
  border-radius: 0 0 32px 32px;
}
.nutrition-back, .nutrition-share, .nutrition-menu {
  z-index: 2;
  background: #e5e9d7;
  border: none;
  border-radius: 50%;
  width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 4px;
}
.nutrition-title {
  position: absolute;
  top: 24px; left: 50%; transform: translateX(-50%);
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  z-index: 2;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.nutrition-content {
  background: #fff;
  border-radius: 32px 32px 0 0;
  margin-top: -32px;
  padding: 24px 16px 0 16px;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.04);
  flex: 1;
}
.nutrition-time {
  color: #888;
  font-size: 13px;
  margin-bottom: 8px;
}
.nutrition-name {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px 0;
}
.nutrition-amount {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.nutrition-edit {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 4px 8px;
  display: flex; align-items: center; justify-content: center;
}
.nutrition-macros {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
.macro {
  background: #f7f7f7;
  border-radius: 16px;
  padding: 12px 16px;
  flex: 1;
  text-align: center;
}
.macro-label {
  color: #888;
  font-size: 13px;
  margin-bottom: 4px;
}
.macro-value {
  font-size: 18px;
  font-weight: 600;
}
.nutrition-health {
  margin-bottom: 16px;
}
.health-label {
  color: #888;
  font-size: 13px;
}
.health-score {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}
.health-bar {
  background: #eee;
  border-radius: 8px;
  height: 8px;
  width: 100%;
  margin-bottom: 8px;
}
.health-bar-inner {
  background: #6ee37a;
  height: 100%;
  border-radius: 8px;
  transition: width 0.3s;
}
.nutrition-ingredients {
  margin-bottom: 24px;
}
.ingredient-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.ingredient {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 6px 12px;
  font-size: 13px;
}
.nutrition-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}
.fix-btn {
  flex: 1;
  background: #fff;
  border: 2px solid #000;
  border-radius: 16px;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  color: #000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.done-btn {
  flex: 1;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.nutrition-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 20px;
  color: #888;
}
</style>
