<template>
  <div class="nutrition-container" v-if="product">
    <div class="nutrition-header">
      <div class="statusbar-spacer"></div>
      <div class="nutrition-image-wrap" :style="backgroundStyle">
        <button class="nutrition-back" @click="$router.go(-1)">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button class="nutrition-menu">...</button>
      </div>
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
import { ref, computed } from 'vue';
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

const backgroundStyle = computed(() => {
  const img = route.query.photo || (product.value && product.value.image);
  return img
    ? {
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0.18)), url('${img}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '220px',
        borderBottomLeftRadius: '32px',
        borderBottomRightRadius: '32px',
        position: 'relative',
        zIndex: 1,
      }
    : {};
});

function editAmount() {
  // TODO: implement amount editing
}
</script>

<style scoped>
/* Statusbar-Space für iOS */
.statusbar-spacer {
  height: env(safe-area-inset-top, 44px);
  width: 100%;
}
.nutrition-container {
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.nutrition-header {
  position: relative;
  background: #f5f5f5;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  overflow: hidden;
  padding-bottom: 0;
}
.nutrition-image-wrap {
  position: relative;
  width: 100%;
  height: 220px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: #f5f5f5;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  overflow: hidden;
  z-index: 1;
}
.nutrition-back {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  background: #e5e9d7;
  border: none;
  border-radius: 50%;
  width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.nutrition-menu {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  background: #e5e9d7;
  border: none;
  border-radius: 50%;
  width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.nutrition-content {
  background: #fff;
  border-radius: 32px 32px 0 0;
  margin-top: -32px;
  padding: 24px 16px 0 16px;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.04);
  flex: 1;
}
/* Zeit, Name, Menge */
.nutrition-time {
  color: #888;
  font-size: 13px;
  margin-bottom: 8px;
  margin-top: 0;
}
.nutrition-name {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px 0;
  word-break: break-word;
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
  min-width: 0;
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
@media (max-width: 390px) {
  .nutrition-image-wrap, .nutrition-image {
    height: 160px;
  }
  .nutrition-content {
    padding: 16px 8px 0 8px;
  }
}
</style>
