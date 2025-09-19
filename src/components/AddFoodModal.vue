<template>
    <div v-if="show" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>{{ $t('addFood.title') }}</h3>
                <button class="close-btn" @click="closeModal">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            </div>
            
            <div class="modal-options">
                <div class="option-group">
                    <div class="option-header">
                        <div class="option-icon">📱</div>
                        <div class="option-content">
                            <h4>{{ $t('addFood.scanner.title') }}</h4>
                            <p>{{ $t('addFood.scanner.description') }}</p>
                        </div>
                    </div>
                    <div class="sub-buttons">
                        <button class="sub-btn" @click="selectScanner('barcode')">
                            {{ $t('addFood.scanner.barcode') }}
                        </button>
                        <button class="sub-btn" @click="selectScanner('photo')">
                            {{ $t('addFood.scanner.photo') }}
                        </button>
                        <button class="sub-btn" @click="selectScanner('label')">
                            {{ $t('addFood.scanner.label') }}
                        </button>
                    </div>
                </div>
                
                <div class="option-group">
                    <div class="option-header">
                        <div class="option-icon">🍎</div>
                        <div class="option-content">
                            <h4>{{ $t('addFood.database.title') }}</h4>
                            <p>{{ $t('addFood.database.description') }}</p>
                        </div>
                    </div>
                    <div class="sub-buttons">
                        <button class="sub-btn" @click="selectFoodDatabase('all')">
                            {{ $t('addFood.database.allFoods') }}
                        </button>
                        <button class="sub-btn" @click="selectFoodDatabase('favorites')">
                            {{ $t('addFood.database.favorites') }}
                        </button>
                    </div>
                </div>
                
                <div class="option-group">
                    <div class="option-header">
                        <div class="option-icon">✍️</div>
                        <div class="option-content">
                            <h4>{{ $t('addFood.manual.title') }}</h4>
                            <p>{{ $t('addFood.manual.description') }}</p>
                        </div>
                    </div>
                    <div class="sub-buttons">
                        <button class="sub-btn primary" @click="selectManualEntry()">
                            {{ $t('addFood.manual.start') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    show: boolean
}

interface Emits {
    (e: 'close'): void
    (e: 'select-scanner', mode: 'barcode' | 'photo' | 'label'): void
    (e: 'select-database', category?: 'all' | 'favorites'): void
    (e: 'select-manual'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function closeModal() {
    emit('close')
}

function selectScanner(mode: 'barcode' | 'photo' | 'label') {
    emit('select-scanner', mode)
}

function selectFoodDatabase(category: 'all' | 'favorites' = 'all') {
    emit('select-database', category)
}

function selectManualEntry() {
    emit('select-manual')
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    backdrop-filter: blur(5px);
}

.modal-content {
    background: #1e1e2e;
    border-radius: 20px;
    max-width: 400px;
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 10px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
    color: white;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    padding: 5px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.modal-options {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.option-group {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 20px;
    backdrop-filter: blur(10px);
}

.option-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
}

.option-icon {
    font-size: 28px;
    min-width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.option-content {
    flex: 1;
}

.option-content h4 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 5px 0;
    color: white;
}

.option-content p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    line-height: 1.4;
}

.sub-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.sub-btn {
    flex: 1;
    min-width: 0;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 12px 16px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
}

.sub-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.3);
}

.sub-btn:active {
    transform: translateY(0);
}

.sub-btn.primary {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
}

.sub-btn.primary:hover {
    background: rgba(255, 255, 255, 0.25);
}
</style>
