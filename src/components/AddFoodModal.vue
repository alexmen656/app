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
                <!-- Scanner Options -->
                <div class="option-section">
                    <h4 class="section-title">
                        <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C13.1 2 14 2.9 14 4V8C14 9.1 13.1 10 12 10S10 9.1 10 8V4C10 2.9 10.9 2 12 2M21 11H17C15.9 11 15 11.9 15 13S15.9 15 17 15H21C22.1 15 23 14.1 23 13S22.1 11 21 11M7 13C7 11.9 6.1 11 5 11H1C.9 11 0 11.9 0 13S.9 15 1 15H5C6.1 15 7 14.1 7 13M12 22C10.9 22 10 21.1 10 20V16C10 14.9 10.9 14 12 14S14 14.9 14 16V20C14 21.1 13.1 22 12 22M6.05 7.05C6.45 6.65 6.45 6.03 6.05 5.64L3.51 3.1C3.11 2.7 2.49 2.7 2.1 3.1C1.7 3.5 1.7 4.12 2.1 4.51L4.64 7.05C5.03 7.45 5.65 7.45 6.05 7.05M17.95 18.95C17.55 19.35 17.55 19.97 17.95 20.36L20.49 22.9C20.89 23.3 21.51 23.3 21.9 22.9C22.3 22.5 22.3 21.88 21.9 21.49L19.36 18.95C18.97 18.55 18.35 18.55 17.95 18.95M19.36 7.05L21.9 4.51C22.3 4.12 22.3 3.5 21.9 3.1C21.51 2.7 20.89 2.7 20.49 3.1L17.95 5.64C17.55 6.03 17.55 6.65 17.95 7.05C18.35 7.45 18.97 7.45 19.36 7.05M4.64 18.95C5.03 18.55 5.65 18.55 6.05 18.95C6.45 19.35 6.45 19.97 6.05 20.36L3.51 22.9C3.12 23.3 2.5 23.3 2.1 22.9C1.7 22.5 1.7 21.88 2.1 21.49L4.64 18.95Z"/>
                        </svg>
                        {{ $t('addFood.scanner.title') }}
                    </h4>
                    <div class="option-buttons">
                        <button class="option-btn" @click="selectScanner('barcode')">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 5H5V19H3V5M7 5H8V19H7V5M10 5H12V19H10V5M14 5H16V19H14V5M18 5H21V19H18V5Z"/>
                            </svg>
                            <span>{{ $t('addFood.scanner.barcode') }}</span>
                        </button>
                        <button class="option-btn" @click="selectScanner('photo')">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z"/>
                            </svg>
                            <span>{{ $t('addFood.scanner.photo') }}</span>
                        </button>
                        <button class="option-btn" @click="selectScanner('label')">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M5.5,7A1.5,1.5 0 0,1 4,5.5A1.5,1.5 0 0,1 5.5,4A1.5,1.5 0 0,1 7,5.5A1.5,1.5 0 0,1 5.5,7M21.41,11.58L12.41,2.58C12.05,2.22 11.55,2 11,2H4C2.89,2 2,2.89 2,4V11C2,11.55 2.22,12.05 2.59,12.41L11.58,21.41C11.95,21.78 12.45,22 13,22C13.55,22 14.05,21.78 14.41,21.41L21.41,14.41C21.78,14.05 22,13.55 22,13C22,12.45 21.78,11.95 21.41,11.58Z"/>
                            </svg>
                            <span>{{ $t('addFood.scanner.label') }}</span>
                        </button>
                    </div>
                </div>

                <!-- Database Options -->
                <div class="option-section">
                    <h4 class="section-title">
                        <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z"/>
                        </svg>
                        {{ $t('addFood.database.title') }}
                    </h4>
                    <div class="option-buttons">
                        <button class="option-btn" @click="selectFoodDatabase('all')">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z"/>
                            </svg>
                            <span>{{ $t('addFood.database.allFoods') }}</span>
                        </button>
                        <button class="option-btn" @click="selectFoodDatabase('favorites')">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                            </svg>
                            <span>{{ $t('addFood.database.favorites') }}</span>
                        </button>
                    </div>
                </div>

                <!-- Manual Entry -->
                <!--<div class="option-section">
                    <h4 class="section-title">
                        <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                        </svg>
                        {{ $t('addFood.manual.title') }}
                    </h4>
                    <div class="option-buttons">
                        <button class="option-btn primary" @click="selectManualEntry()">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M8,2H10V4H8V2M8,20H10V22H8V20Z"/>
                            </svg>
                            <span>{{ $t('addFood.manual.start') }}</span>
                        </button>
                    </div>
                </div>-->

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

//function selectManualEntry() {
  //  emit('select-manual')
//}
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
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 600;
    color: white;
    margin: 0 0 12px 0;
    padding: 0 4px;
}

.section-icon {
    width: 20px;
    height: 20px;
    color: rgba(255, 255, 255, 0.8);
}

.option-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
}

.option-btn {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 16px 12px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    backdrop-filter: blur(10px);
    min-height: 80px;
    justify-content: center;
}

.option-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.option-btn:active {
    transform: translateY(0);
}

.option-btn.primary {
    background: rgba(255, 107, 53, 0.2);
    border-color: rgba(255, 107, 53, 0.4);
    grid-column: 1 / -1; /* Full width for manual entry */
}

.option-btn.primary:hover {
    background: rgba(255, 107, 53, 0.3);
    border-color: rgba(255, 107, 53, 0.5);
}

.btn-icon {
    width: 24px;
    height: 24px;
    color: rgba(255, 255, 255, 0.9);
}

.option-btn span {
    text-align: center;
    line-height: 1.2;
}
</style>
