<template>
    <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>{{ $t('weight.logWeight') }}</h3>
                <button @click="$emit('close')" class="close-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="weight-input-section">
                    <label class="modal-label">{{ $t('weight.weightLabel') }}</label>
                    <div class="weight-input-container">
                        <input
                            v-model.number="weight"
                            type="number"
                            step="0.1"
                            min="20"
                            max="300"
                            :placeholder="$t('weight.weightPlaceholder')"
                            class="modal-input"
                            @keyup.enter="logWeight"
                        />
                        <span class="weight-unit">kg</span>
                    </div>
                </div>
                
                <div class="notes-section">
                    <label class="modal-label">{{ $t('weight.notesLabel') }} ({{ $t('weight.optional') }})</label>
                    <textarea
                        v-model="notes"
                        :placeholder="$t('weight.notesPlaceholder')"
                        class="modal-textarea"
                        rows="3"
                        maxlength="200"
                    ></textarea>
                    <div class="char-counter">{{ notes.length }}/200</div>
                </div>
            </div>
            
            <div class="modal-footer">
                <button @click="$emit('close')" class="modal-btn secondary">
                    {{ $t('cancel') }}
                </button>
                <button @click="logWeight" :disabled="!canSubmit || isLogging" class="modal-btn primary">
                    <svg v-if="isLogging" class="loading-spinner" width="16" height="16" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" 
                                stroke-dasharray="31.416" stroke-dashoffset="31.416">
                            <animate attributeName="stroke-dasharray" dur="2s" 
                                     values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                            <animate attributeName="stroke-dashoffset" dur="2s" 
                                     values="0;-15.708;-31.416" repeatCount="indefinite"/>
                        </circle>
                    </svg>
                    <span v-if="!isLogging">{{ $t('weight.logWeight') }}</span>
                    <span v-else>{{ $t('weight.logging') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

defineProps<{
    show: boolean
}>()

const emit = defineEmits<{
    close: []
    logged: [weight: number, notes: string]
}>()

const weight = ref<number | null>(null)
const notes = ref('')
const isLogging = ref(false)

const canSubmit = computed(() => {
    return weight.value && weight.value >= 20 && weight.value <= 300
})

async function logWeight() {
    if (!canSubmit.value || isLogging.value) return

    isLogging.value = true

    try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        emit('logged', weight.value!, notes.value)
        
        weight.value = null
        notes.value = ''
    } catch (error) {
        console.error('Error logging weight:', error)
    } finally {
        isLogging.value = false
    }
}

function handleOverlayClick() {
    emit('close')
}

watch(() => weight.value, (newVal) => {
    if (!newVal) {
        notes.value = ''
    }
})
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: #2a2d37;
    border-radius: 20px;
    max-width: 400px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 24px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: white;
}

.close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.modal-body {
    padding: 24px;
}

.weight-input-section {
    margin-bottom: 24px;
}

.notes-section {
    margin-bottom: 0;
}

.modal-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: white;
}

.weight-input-container {
    position: relative;
    display: flex;
    align-items: center;
}

.modal-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: white;
    padding: 16px 20px;
    padding-right: 50px;
    font-size: 18px;
    font-weight: 600;
    transition: all 0.3s ease;
    text-align: center;
}

.modal-input:focus {
    outline: none;
    border-color: #007052;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 4px rgba(0, 112, 82, 0.1);
}

.modal-input::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-weight: 400;
}

.weight-unit {
    position: absolute;
    right: 20px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
    font-weight: 500;
    pointer-events: none;
}

.modal-textarea {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: white;
    padding: 16px;
    font-size: 16px;
    font-family: inherit;
    resize: vertical;
    transition: all 0.3s ease;
    line-height: 1.5;
}

.modal-textarea:focus {
    outline: none;
    border-color: #007052;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 4px rgba(0, 112, 82, 0.1);
}

.modal-textarea::placeholder {
    color: rgba(255, 255, 255, 0.4);
}

.char-counter {
    text-align: right;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 8px;
}

.modal-footer {
    padding: 16px 24px 24px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.modal-btn {
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 100px;
    justify-content: center;
}

.modal-btn.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.modal-btn.secondary:hover {
    background: rgba(255, 255, 255, 0.15);
}

.modal-btn.primary {
    background: linear-gradient(135deg, #007052, #005a42);
    color: white;
    box-shadow: 0 4px 16px rgba(0, 112, 82, 0.3);
}

.modal-btn.primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 112, 82, 0.4);
}

.modal-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.modal-btn.primary:disabled {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: none;
}

.loading-spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
