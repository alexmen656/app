<template>
    <div class="processing-overlay">
        <div class="processing-content">
            <div class="processing-spinner"></div>
            <h3>{{ $t('scanner.analyzingLabel') }}</h3>
            <p>{{ $t('scanner.pleaseWait') }}</p>
        </div>
    </div>
</template>

<style scoped>
.processing-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.processing-content {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 40px 30px;
    text-align: center;
    max-width: 300px;
    width: 90%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.processing-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007052;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

.processing-content h3 {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 10px 0;
}

.processing-content p {
    color: #666;
    font-size: 14px;
    margin: 0;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>