<template>
    <div v-if="show" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>{{ $t('addFood.title') }}</h3>
                <button class="close-btn" @click="closeModal">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            </div>
            <div class="modal-options">
                <div class="option-section">
                    <h4 class="section-title">
                        <svg class="section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
                            fill="currentColor">
                            <path
                                d="M213.1 128.8L202.7 160L128 160C92.7 160 64 188.7 64 224L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 224C576 188.7 547.3 160 512 160L437.3 160L426.9 128.8C420.4 109.2 402.1 96 381.4 96L258.6 96C237.9 96 219.6 109.2 213.1 128.8zM320 256C373 256 416 299 416 352C416 405 373 448 320 448C267 448 224 405 224 352C224 299 267 256 320 256z" />
                        </svg>
                        {{ $t('addFood.scanner.title') }}
                    </h4>
                    <div class="option-buttons">
                        <button class="option-btn" @click="selectScanner('barcode')">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 5H5V19H3V5M7 5H8V19H7V5M10 5H12V19H10V5M14 5H16V19H14V5M18 5H21V19H18V5Z" />
                            </svg>
                            <span>{{ $t('addFood.scanner.barcode') }}</span>
                        </button>
                        <button class="option-btn" @click="selectScanner('photo')">
                            <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
                                fill="currentColor">
                                <path
                                    d="M64 480L64 272L200.2 272C213.7 251.8 232.2 235.2 253.9 224L64 224L64 189.7C64 154.4 92.7 125.7 128 125.7L128.1 125.7C129.3 109.1 143.1 96 160 96L192 96C208.9 96 222.7 109.1 223.9 125.7L256 125.7L307.2 101.9C315.6 98 324.8 95.9 334.1 95.9L512 96C547.3 96 576 124.7 576 160L576 224L386 224C407.7 235.2 426.2 251.8 439.7 272L575.9 272L575.9 480C575.9 515.3 547.2 544 511.9 544L128 544C92.7 544 64 515.3 64 480zM320 256C284.9 254.9 252.1 272.9 234.2 303.1C216.3 333.3 216.3 370.8 234.2 401C252.1 431.2 284.9 449.2 320 448.1C355.1 449.2 387.9 431.2 405.8 401C423.7 370.8 423.7 333.3 405.8 303.1C387.9 272.9 355.1 254.9 320 256z" />
                            </svg>
                            <span>{{ $t('addFood.scanner.photo') }}</span>
                        </button>
                        <button class="option-btn" @click="selectScanner('label')">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M5.5,7A1.5,1.5 0 0,1 4,5.5A1.5,1.5 0 0,1 5.5,4A1.5,1.5 0 0,1 7,5.5A1.5,1.5 0 0,1 5.5,7M21.41,11.58L12.41,2.58C12.05,2.22 11.55,2 11,2H4C2.89,2 2,2.89 2,4V11C2,11.55 2.22,12.05 2.59,12.41L11.58,21.41C11.95,21.78 12.45,22 13,22C13.55,22 14.05,21.78 14.41,21.41L21.41,14.41C21.78,14.05 22,13.55 22,13C22,12.45 21.78,11.95 21.41,11.58Z" />
                            </svg>
                            <span>{{ $t('addFood.scanner.label') }}</span>
                        </button>
                        <button class="option-btn" @click="selectScanner('label')">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M5.5,7A1.5,1.5 0 0,1 4,5.5A1.5,1.5 0 0,1 5.5,4A1.5,1.5 0 0,1 7,5.5A1.5,1.5 0 0,1 5.5,7M21.41,11.58L12.41,2.58C12.05,2.22 11.55,2 11,2H4C2.89,2 2,2.89 2,4V11C2,11.55 2.22,12.05 2.59,12.41L11.58,21.41C11.95,21.78 12.45,22 13,22C13.55,22 14.05,21.78 14.41,21.41L21.41,14.41C21.78,14.05 22,13.55 22,13C22,12.45 21.78,11.95 21.41,11.58Z" />
                            </svg>
                            <span>{{ $t('addFood.scanner.menu') }}</span>
                        </button>
                    </div>
                </div>
                <div class="option-section">
                    <h4 class="section-title">
                        <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z" />
                        </svg>
                        {{ $t('addFood.database.title') }}
                    </h4>
                    <div class="option-buttons">
                        <button class="option-btn" @click="selectFoodDatabase('all')">
                            <svg class="section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
                                fill="currentColor">
                                <path
                                    d="M64 240C64 204.7 92.7 176 128 176C128.5 176 129.1 176 129.6 176C137 139.5 169.3 112 208 112C223 112 237 116.1 248.9 123.2C262.2 97.5 289 80 320 80C351 80 377.8 97.6 391.1 123.2C403.1 116.1 417.1 112 432 112C470.7 112 503 139.5 510.4 176C510.9 176 511.5 176 512 176C547.3 176 576 204.7 576 240C576 251.7 572.9 262.6 567.4 272L72.6 272C67.1 262.6 64 251.7 64 240zM64 347.4C64 332.3 76.3 320 91.4 320L548.5 320C563.6 320 575.9 332.3 575.9 347.4C575.9 417.9 531.5 478.1 469.2 501.5L467.5 516C465.5 532 451.9 544 435.7 544L204.2 544C188.1 544 174.4 532 172.4 516L170.6 501.6C108.4 478.1 64 417.9 64 347.4z" />
                            </svg>
                            <span>{{ $t('addFood.database.allFoods') }}</span>
                        </button>
                        <button class="option-btn" @click="selectFoodDatabase('favorites')">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
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
    grid-column: 1 / -1;
    /* Full width for manual entry */
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
