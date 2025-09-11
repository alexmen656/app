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
                <button class="option-btn" @click="selectScanner">
                    <div class="option-icon">📱</div>
                    <div class="option-content">
                        <h4>{{ $t('addFood.scanner.title') }}</h4>
                        <p>{{ $t('addFood.scanner.description') }}</p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                </button>
                
                <button class="option-btn" @click="selectFoodDatabase">
                    <div class="option-icon">🍎</div>
                    <div class="option-content">
                        <h4>{{ $t('addFood.database.title') }}</h4>
                        <p>{{ $t('addFood.database.description') }}</p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                </button>
                
                <button class="option-btn" @click="selectManualEntry">
                    <div class="option-icon">✍️</div>
                    <div class="option-content">
                        <h4>{{ $t('addFood.manual.title') }}</h4>
                        <p>{{ $t('addFood.manual.description') }}</p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                </button>
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
    (e: 'select-scanner'): void
    (e: 'select-database'): void
    (e: 'select-manual'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function closeModal() {
    emit('close')
}

function selectScanner() {
    emit('select-scanner')
}

function selectFoodDatabase() {
    emit('select-database')
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
    gap: 15px;
}

.option-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    text-align: left;
}

.option-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.option-icon {
    font-size: 32px;
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

.option-btn svg {
    color: rgba(255, 255, 255, 0.5);
    transition: color 0.2s;
}

.option-btn:hover svg {
    color: white;
}
</style>
