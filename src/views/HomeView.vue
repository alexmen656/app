<template>
    <div class="home-view">
        <!-- Photo Processing Overlay -->
        <div v-if="isProcessingPhoto" class="processing-overlay">
            <div class="processing-content">
                <div class="processing-spinner"></div>
                <h3>{{ $t('scanner.analyzingFood') }}</h3>
                <p>{{ $t('scanner.pleaseWait') }}</p>
            </div>
        </div>

        <!-- Label Processing Overlay -->
        <div v-if="isProcessingLabel" class="processing-overlay">
            <div class="processing-content">
                <div class="processing-spinner"></div>
                <h3>{{ $t('scanner.analyzingLabel') }}</h3>
                <p>{{ $t('scanner.pleaseWait') }}</p>
            </div>
        </div>

        <header class="header">
            <div class="logo-section">
                <h1 class="app-title"><span style="color: #007052;">KalBuddy</span></h1><!--#005e4a #005f4a -->
            </div>
            <div class="streak" @click="toggleDateDropdown" ref="dateDropdownContainer">
                <!-- Current Date Display with Dropdown Arrow -->
                <span class="streak-content">{{ formatCurrentDate() }}</span>
                
                <!-- Dropdown Arrow -->
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" 
                     :class="{ 'dropdown-arrow': true, 'dropdown-open': showDateDropdown }">
                    <path d="M7 10l5 5 5-5z"/>
                </svg>
                
                <!-- Dropdown Menu -->
                <div v-if="showDateDropdown" class="date-dropdown">
                    <div v-for="date in availableDates" :key="date.dateString" 
                         class="date-option" 
                         :class="{ 'active': date.dateString === selectedDate.toDateString() }"
                         @click.stop="selectDate(date)">
                        <span class="date-main">{{ date.display }}</span>
                        <span v-if="date.subtitle" class="date-sub">{{ date.subtitle }}</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- AUSKOMMENTIERT: Alter Date-Toggle
        <div class="date-toggle">
            <button class="date-nav-btn" @click="changeDate(-1)" :disabled="!canGoBack">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
            </button>
            <div class="current-date-compact">
                <span class="date-label">{{ formatCurrentDate() }}</span>
            </div>
            <button class="date-nav-btn" @click="changeDate(1)" :disabled="!canGoForward">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
            </button>
        </div>
        -->
        <!-- KalBuddy Chat Link 
        <div class="kalbuddy-chat-section">
            <router-link to="/chat" class="kalbuddy-chat-link">
                <div class="chat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                    </svg>
                </div>
                <div class="chat-content">
                    <h3 class="chat-title">{{ $t('home.chatWithKalBuddy') }}</h3>
                    <p class="chat-subtitle">{{ getChatSubtitle() }}</p>
                </div>
                <div class="chat-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                </div>
            </router-link>
        </div>-->

        <!-- Quick Actions -->
        <div class="quick-actions">
            <div class="action-chip" @click="goToView('chat')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
                <span>Chat</span>
            </div>
            
            <div class="action-chip" @click="goToView('weight')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm1-11h-2v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <span>Weight</span>
            </div>
            
            <div class="action-chip" @click="goToView('water')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2C13.73,7.21 16.69,9.88 16.69,13.58C16.69,17.65 14.54,19.12 12,19.12C9.46,19.12 7.31,17.65 7.31,13.58C7.31,9.88 10.27,7.21 12,2Z"/>
                </svg>
                <span>Water</span>
            </div>
            
            <div class="action-chip" @click="openFeedback">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                </svg>
                <span>Feedback</span>
            </div>
            
            <div class="action-chip" @click="goToView('goals')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17L7,12L8.41,10.59L12,14.17L15.59,10.59L17,12L12,17Z"/>
                </svg>
                <span>Goals</span>
            </div>
        </div>

        <div class="main-card" @click="goToView('calories')">
            <div class="calories-section">
                <h2 class="calories-number">{{ caloriesNumberDisplay }}</h2>
                <p class="calories-label">{{ caloriesLabelDisplay }}</p>
                <div class="streak-line" @click.stop="goToView('streak')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff6b35">
                        <path
                            d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
                    </svg>
                    <span class="streak-text">{{ currentStreak }} {{ $t('streak.days') }}</span>
                </div>
            </div>
            <div class="progress-ring">
                <svg class="progress-svg" width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#2a2d37" stroke-width="6" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke="white" stroke-width="6" fill="none" stroke-dasharray="251.2"
                        :stroke-dashoffset="251.2 - (251.2 * caloriesProgress)" stroke-linecap="round"
                        class="progress-circle" transform="rotate(-90 50 50)" />
                </svg>
                <div class="flame-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path
                            d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
                    </svg>
                </div>
            </div>
        </div>
        <!-- Premium Banner for Free Users -->
        <div v-if="!isPremiumUser && showPremiumBanner" class="premium-banner" @click="goToView('upgrade')">
            <div class="banner-content">
                <div class="banner-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFD700">
                        <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </div>
                <div class="banner-text">
                    <span class="banner-title">{{ $t('premium.banner.title') }}</span>
                    <span class="banner-subtitle">{{ $t('premium.banner.subtitle') }}</span>
                </div>
                <div class="banner-close" @click.stop="hidePremiumBanner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Macros Grid -->
        <div class="macros-grid">
            <div class="macro-card protein" @click="goToView('protein')">
                <div class="macro-amount">{{ proteinNumberDisplay }}</div>
                <div class="macro-label">{{ proteinLabelDisplay }}</div>
                <div class="macro-progress">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        <!-- Background circle -->
                        <circle cx="30" cy="30" r="24" stroke="#2a2d37" stroke-width="5" fill="none" />
                        <!-- Progress circle -->
                        <circle cx="30" cy="30" r="24" stroke="#ff6b6b" stroke-width="5" fill="none"
                            stroke-dasharray="150.8" :stroke-dashoffset="calculateMacroOffset(proteinProgress, 150.8)"
                            stroke-linecap="round" transform="rotate(-90 30 30)" class="progress-circle" />
                    </svg>
                    <div class="macro-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path fill="#ff6b6b"
                                d="M224 329.2C224 337.7 220.6 345.8 214.6 351.8L187.8 378.6C175.5 390.9 155.3 390 138.4 385.8C133.8 384.7 128.9 384 123.9 384C90.8 384 63.9 410.9 63.9 444C63.9 477.1 90.8 504 123.9 504C130.2 504 135.9 509.7 135.9 516C135.9 549.1 162.8 576 195.9 576C229 576 255.9 549.1 255.9 516C255.9 511 255.3 506.2 254.1 501.5C249.9 484.6 248.9 464.4 261.3 452.1L288.1 425.3C294.1 419.3 302.2 415.9 310.7 415.9L399.9 415.9C406.2 415.9 412.3 415.6 418.4 414.9C430.3 413.7 434.8 399.4 429.2 388.9C420.7 373.1 415.9 355.1 415.9 335.9C415.9 274 466 223.9 527.9 223.9C535.9 223.9 543.6 224.7 551.1 226.3C562.8 228.8 575.2 220.4 573.1 208.7C558.4 126.4 486.4 63.9 399.9 63.9C302.7 63.9 223.9 142.7 223.9 239.9L223.9 329.1z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="macro-card carbs" @click="goToView('carbs')">
                <div class="macro-amount">{{ carbsNumberDisplay }}</div>
                <div class="macro-label">{{ carbsLabelDisplay }}</div>
                <div class="macro-progress">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        <!-- Background circle -->
                        <circle cx="30" cy="30" r="24" stroke="#2a2d37" stroke-width="5" fill="none" />
                        <!-- Progress circle -->
                        <circle cx="30" cy="30" r="24" stroke="#ffa726" stroke-width="5" fill="none"
                            stroke-dasharray="150.8" :stroke-dashoffset="calculateMacroOffset(carbsProgress, 150.8)"
                            stroke-linecap="round" transform="rotate(-90 30 30)" class="progress-circle" />
                    </svg>
                    <div class="macro-icon macro-icon-carbs">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            <path fill="#ffa726"
                                d="M79.7 234.6c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0L134.1 444.3 49.4 529c-9.4 9.4-24.5 9.4-33.9 0-9.4-9.4-9.4-24.6 0-33.9l84.7-84.7-30.5-30.5c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zm104-104c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zM495.2 15c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.2L529.2 49 414.7 163.4c7.7 1 15.2 3 22.5 5.9L495.5 111c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-52.7 52.7 39 39c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1c6.2-4.1 14.7-3.4 20.1 2.1l39 39 52.7-52.7c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-58.3 58.3c2.8 7.1 4.7 14.5 5.7 22.1L495.2 15z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="macro-card fats" @click="goToView('fats')">
                <div class="macro-amount">{{ fatsNumberDisplay }}</div>
                <div class="macro-label">{{ fatsLabelDisplay }}</div>
                <div class="macro-progress">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        <!-- Background circle -->
                        <circle cx="30" cy="30" r="24" stroke="#2a2d37" stroke-width="5" fill="none" />
                        <!-- Progress circle -->
                        <circle cx="30" cy="30" r="24" stroke="#42a5f5" stroke-width="5" fill="none"
                            stroke-dasharray="150.8" :stroke-dashoffset="calculateMacroOffset(fatsProgress, 150.8)"
                            stroke-linecap="round" transform="rotate(-90 30 30)" class="progress-circle" />
                    </svg>
                    <div class="macro-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path fill="#42a5f5"
                                d="M240 64C240 46.3 254.3 32 272 32L368 32C385.7 32 400 46.3 400 64C400 81.7 385.7 96 368 96L368 199.3C432.9 219.7 480 280.3 480 352L480 544C480 579.3 451.3 608 416 608L224 608C188.7 608 160 579.3 160 544L160 352C160 280.4 207.1 219.7 272 199.3L272 96C254.3 96 240 81.7 240 64zM320 480C355.3 480 384 447.6 384 416C384 394.8 355.1 351.5 336.1 325.4C328 314.3 311.9 314.3 303.8 325.4C284.8 351.5 255.9 394.8 255.9 416C255.9 447.6 284.6 480 319.9 480z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recently Uploaded Section -->
        <div class="recent-section">
            <h3 class="section-title">{{ $t('home.recentlyUploaded') }}</h3>

            <div v-if="recentFoods.length === 0" class="empty-state">
                <div class="empty-icon">📱</div>
                <p>{{ $t('home.noScansYet') }}</p>
                <p class="empty-subtitle">{{ $t('home.noScansSubtitle') }}</p>
            </div>

            <div v-else class="food-item" @click="goToNutritionDetail(item)" v-for="item in recentFoods" :key="item.id">
                <div class="food-image">
                    <img v-if="item.image && !item.image.includes('placeholder')" :src="item.image" :alt="item.name" />
                    <span v-else-if="item.icon" class="food-db-icon">{{ item.icon }}</span>
                    <span v-else>{{ item.type === 'food' ? '🍽️' : '📦' }}</span>
                </div>
                <div class="food-info">
                    <h4 class="food-name">{{ item.name }}</h4><!--getLocalizedName(-->
                    <div class="food-calories">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff6b35">
                            <path
                                d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
                        </svg>
                        <span>{{ item.calories }} kcal</span>
                    </div>
                    <div class="food-macros">
                        <span class="macro-item protein-color">
                            <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path fill="#ff6b6b"
                                    d="M224 329.2C224 337.7 220.6 345.8 214.6 351.8L187.8 378.6C175.5 390.9 155.3 390 138.4 385.8C133.8 384.7 128.9 384 123.9 384C90.8 384 63.9 410.9 63.9 444C63.9 477.1 90.8 504 123.9 504C130.2 504 135.9 509.7 135.9 516C135.9 549.1 162.8 576 195.9 576C229 576 255.9 549.1 255.9 516C255.9 511 255.3 506.2 254.1 501.5C249.9 484.6 248.9 464.4 261.3 452.1L288.1 425.3C294.1 419.3 302.2 415.9 310.7 415.9L399.9 415.9C406.2 415.9 412.3 415.6 418.4 414.9C430.3 413.7 434.8 399.4 429.2 388.9C420.7 373.1 415.9 355.1 415.9 335.9C415.9 274 466 223.9 527.9 223.9C535.9 223.9 543.6 224.7 551.1 226.3C562.8 228.8 575.2 220.4 573.1 208.7C558.4 126.4 486.4 63.9 399.9 63.9C302.7 63.9 223.9 142.7 223.9 239.9L223.9 329.1z" />
                            </svg>
                            {{ item.protein }}g
                        </span>
                        <span class="macro-item carbs-color">
                            <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path fill="#ffa726"
                                    d="M79.7 234.6c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0L134.1 444.3 49.4 529c-9.4 9.4-24.5 9.4-33.9 0-9.4-9.4-9.4-24.6 0-33.9l84.7-84.7-30.5-30.5c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zm104-104c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zM495.2 15c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.2L529.2 49 414.7 163.4c7.7 1 15.2 3 22.5 5.9L495.5 111c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-52.7 52.7 39 39c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1c6.2-4.1 14.7-3.4 20.1 2.1l39 39 52.7-52.7c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-58.3 58.3c2.8 7.1 4.7 14.5 5.7 22.1L495.2 15z" />
                            </svg>
                            {{ item.carbs }}g
                        </span>
                        <span class="macro-item fats-color">
                            <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path fill="#42a5f5"
                                    d="M240 64C240 46.3 254.3 32 272 32L368 32C385.7 32 400 46.3 400 64C400 81.7 385.7 96 368 96L368 199.3C432.9 219.7 480 280.3 480 352L480 544C480 579.3 451.3 608 416 608L224 608C188.7 608 160 579.3 160 544L160 352C160 280.4 207.1 219.7 272 199.3L272 96C254.3 96 240 81.7 240 64zM320 480C355.3 480 384 447.6 384 416C384 394.8 355.1 351.5 336.1 325.4C328 314.3 311.9 314.3 303.8 325.4C284.8 351.5 255.9 394.8 255.9 416C255.9 447.6 284.6 480 319.9 480z" />
                            </svg>
                            {{ item.fats }}g
                        </span>
                    </div>
                </div>
                <div class="food-time">{{ item.time }}</div>
            </div>

            <!-- Show All Scans Link -->
            <div v-if="recentFoods.length > 5" class="show-all-link">
                <router-link to="/all-scans" class="show-all-btn">
                    {{ $t('home.showAllScans') }}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                </router-link>
            </div>
        </div>

        <BottomNavigation />
        <div @click="toggleAddFoodModal(true)" class="add-button">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
        </div>

        <!-- Add Food Modal -->
        <AddFoodModal :show="isAddFoodModalVisible" @close="toggleAddFoodModal(false)"
            @select-scanner="handleSelectScanner" @select-database="handleSelect('food-database')"
            @select-manual="handleSelect('manual-entry')" />

        <!-- Scan Limit Blocker -->
        <PremiumBlocker v-if="showScanLimitBlocker" feature="unlimited_food_scans"
            :title="$t('premium.scanLimit.title')" :description="$t('premium.scanLimit.description')" :features="[
                $t('premium.scanLimit.feature1'),
                $t('premium.scanLimit.feature2'),
                $t('premium.scanLimit.feature3')
            ]" :show-usage-info="true" :scans-used="currentScanUsage?.currentCount || 0"
            :scans-total="currentScanUsage?.limit || 10" @close="closeScanLimitBlocker"
            @upgrade="handleScanLimitUpgrade" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, type ComputedRef } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { dailyGoals, isOnboardingCompleted, storeReady } from '../stores/userStore'
import { ScanHistory } from '../utils/storage'
import { WidgetDataManager, StreakManager } from '../utils/widgetData'
import { HealthKitService } from '../services/healthkit'
import { InAppReview } from '@capacitor-community/in-app-review';
import { shouldShowReviewPrompt, setLastReviewPrompt, getNotificationSettings } from '../stores/preferencesStore'
import { NotificationService } from '../services/notifications'
import { useBarcodeScanner } from '../composables/useBarcodeScanner'
import { isPremiumUser, onPremiumStatusChange } from '../utils/premiumManager' //premiumManager
import { getLocalizedName } from '../utils/localization'
import PremiumBlocker from '../components/PremiumBlocker.vue'
import BottomNavigation from '../components/BottomNavigation.vue'
import AddFoodModal from '../components/AddFoodModal.vue'

const router = useRouter()
const { t, locale } = useI18n()
const { startScanning, isProcessingPhoto, isProcessingLabel, checkScanLimit, getScanUsage } = useBarcodeScanner()

const showPremiumBanner = ref(true)
const showScanLimitBlocker = ref(false)
const currentScanUsage = ref<any>(null)
const isAddFoodModalVisible = ref(false)

async function openNativeScanner() {
    try {
        const usage = await checkScanLimit()
        currentScanUsage.value = usage

        if (!usage.canScan && !usage.isPremium) {
            console.log(`Scan limit reached: ${usage.currentCount}/${usage.limit} scans used today`)
            showScanLimitBlocker.value = true
            return
        }

        await startScanningWithMode('barcode')
    } catch (error) {
        console.error('Failed to check scan limits:', error)
        await startScanningWithMode('barcode')
    }
}

async function startScanningWithMode(mode: 'barcode' | 'photo' | 'label') {
    try {
        await startScanning({
            mode: mode,
            timeout: 0,
            showControls: true
        })

        loadScanHistory()
        await getScanUsage()
    } catch (error) {
        console.error('Failed to open scanner:', error)

        if (error instanceof Error && error.message?.includes('SCAN_LIMIT_REACHED')) {
            showScanLimitBlocker.value = true
        }
    }
}

function closeScanLimitBlocker() {
    showScanLimitBlocker.value = false
}

function handleScanLimitUpgrade() {
    showScanLimitBlocker.value = false
    router.push('/upgrade')
}

function loadScanHistoryAndStreak() {
    loadScanHistory()
    loadStreak()
}

setTimeout(async () => {
    try {
        if (recentFoods.value.length > 9) {
            const canShow = await shouldShowReviewPrompt(5)
            if (canShow) {
                const result = await InAppReview.requestReview();
                await setLastReviewPrompt(Date.now())
                console.log('InAppReview requested:', result)
            }
        }
    } catch (err) {
        console.error('Error requesting in-app review:', err)
    }
}, 20000);

onMounted(async () => {
    await storeReady

    if (!isOnboardingCompleted.value) {
        router.push('/onboarding')
        return
    }

    try {
        const notificationSettings = await getNotificationSettings()
        if (notificationSettings.enabled && NotificationService.isSupported()) {
            await NotificationService.scheduleAllMealNotifications(notificationSettings)
            console.log('📅 Meal notifications scheduled')
        }
    } catch (error) {
        console.error('Error loading notification settings:', error)
    }

    loadScanHistoryAndStreak()
    window.addEventListener('scanHistoryUpdated', loadScanHistoryAndStreak)
    window.addEventListener('focus', loadScanHistoryAndStreak)

    const unsubscribe = onPremiumStatusChange((isPremium) => {
        console.log('🎉 Premium status changed in HomeView:', isPremium)
        if (isPremium) {
            showPremiumBanner.value = false
        }
    })

    window.addEventListener('beforeunload', unsubscribe)
    
    // Add click outside listener for date dropdown
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    window.removeEventListener('scanHistoryUpdated', loadScanHistoryAndStreak)
    window.removeEventListener('focus', loadScanHistoryAndStreak)
    document.removeEventListener('click', handleClickOutside)
})

interface ScanData {
    id: number
    type: 'food' | 'barcode'
    timestamp: string
    time: string
    image?: string
    amount?: number
    icon?: string
    data: any
}

interface FoodItem {
    id: number
    name: string
    calories: number
    protein: number
    carbs: number
    fats: number
    time: string
    image: string
    type: string
    icon?: string
}

const dailyCalories = computed(() => dailyGoals.calories)
const dailyProtein = computed(() => dailyGoals.protein)
const dailyCarbs = computed(() => dailyGoals.carbs)
const dailyFats = computed(() => dailyGoals.fats)
const todaysNutrition = ref({ calories: 0, protein: 0, carbs: 0, fats: 0 })
const consumedCalories = computed(() => todaysNutrition.value.calories)
const consumedProtein = computed(() => todaysNutrition.value.protein)
const consumedCarbs = computed(() => todaysNutrition.value.carbs)
const consumedFats = computed(() => todaysNutrition.value.fats)
const scanHistory = ref<ScanData[]>([])
const currentStreak = ref<number>(0)
const selectedDate = ref(new Date())

// Dropdown state
const showDateDropdown = ref(false)
const dateDropdownContainer = ref<HTMLElement>()

// Available dates for dropdown (last 30 days)
const availableDates = computed(() => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
        const date = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000))
        const dateString = date.toDateString()
        
        let display = ''
        let subtitle = ''
        
        if (i === 0) {
            display = t('today')
            subtitle = date.toLocaleDateString(locale.value, { weekday: 'long', day: 'numeric', month: 'long' })
        } else if (i === 1) {
            display = t('yesterday')
            subtitle = date.toLocaleDateString(locale.value, { weekday: 'long', day: 'numeric', month: 'long' })
        } else {
            display = date.toLocaleDateString(locale.value, { weekday: 'long', day: 'numeric', month: 'long' })
        }
        
        dates.push({
            date,
            dateString,
            display,
            subtitle
        })
    }
    
    return dates
})

function createMacroCalculations(
    dailyValue: ComputedRef<number>,
    consumedValue: ComputedRef<number>,
    unit: string,
    overKey: string,
    leftKey: string
) {
    const diff = computed(() => Math.round(dailyValue.value - consumedValue.value))
    const isOver = computed(() => diff.value < 0)
    const abs = computed(() => Math.abs(diff.value))
    const numberDisplay = computed(() => isOver.value ? `${abs.value}${unit}` : `${diff.value}${unit}`)
    const labelDisplay = computed(() => isOver.value ? t(overKey) : t(leftKey))
    const progress = computed(() => Math.min(consumedValue.value / dailyValue.value, 1))

    return { diff, isOver, abs, numberDisplay, labelDisplay, progress }
}

function transformFoodScan(scan: ScanData): FoodItem {
    const total = scan.data.total
    const firstFood = scan.data.foods?.[0]
    return {
        id: scan.id,
        name: getLocalizedName(firstFood) || t('home.scannedFood'),
        calories: total.calories || 0,
        protein: total.protein || 0,
        carbs: total.carbs || 0,
        fats: total.fat || 0,
        time: scan.time,
        image: scan.image || '/api/placeholder/60/60',
        type: 'food',
        icon: scan.icon
    }
}

function transformBarcodeScan(scan: ScanData, amount: number): FoodItem {
    const nutriments = scan.data.nutriments || {}
    return {
        id: scan.id,
        name: scan.data.product_name || t('home.unknownProduct'),
        calories: Math.round((nutriments.energy_kcal_100g || 0) * amount),
        protein: Math.round((nutriments.proteins_100g || 0) * amount),
        carbs: Math.round((nutriments.carbohydrates_100g || 0) * amount),
        fats: Math.round((nutriments.fat_100g || 0) * amount),
        time: scan.time,
        image: scan.image || '/api/placeholder/60/60',
        type: 'barcode',
        icon: undefined
    }
}

function transformScanToFoodItem(scan: ScanData): FoodItem | null {
    const amount = scan.amount || 1.0

    if (scan.type === 'food') {
        return transformFoodScan(scan)
    } else if (scan.type === 'barcode') {
        return transformBarcodeScan(scan, amount)
    }
    return null
}

async function loadScanHistory() {
    try {
        const history = await ScanHistory.get()
        const selectedDateString = selectedDate.value.toISOString().split('T')[0]

        // Filter scans for selected date
        const dateScans = history.filter(scan => {
            const scanDate = new Date(scan.timestamp).toISOString().split('T')[0]
            return scanDate === selectedDateString
        })

        scanHistory.value = dateScans.slice(0, 10)

        calculateNutritionFromHistory(history)
        
        // Only update widget data and sync if it's today
        const today = new Date().toISOString().split('T')[0]
        if (selectedDateString === today) {
            await WidgetDataManager.updateWidgetData()
            await syncToHealthKit()
            await NotificationService.resetInactivityTimer()
        }
    } catch (error) {
        console.error('Error loading scan history:', error)
        scanHistory.value = []
        todaysNutrition.value = { calories: 0, protein: 0, carbs: 0, fats: 0 }
    }
}

function calculateNutritionFromHistory(history: ScanData[]) {
    try {
        const selectedDateString = selectedDate.value.toISOString().split('T')[0]

        const dateScans = history.filter(scan => {
            const scanDate = new Date(scan.timestamp).toISOString().split('T')[0]
            return scanDate === selectedDateString
        })

        let totalCalories = 0
        let totalProtein = 0
        let totalCarbs = 0
        let totalFats = 0

        dateScans.forEach(scan => {
            const amount = scan.amount || 1.0;

            if (scan.type === 'food' && scan.data.total) {
                totalCalories += scan.data.total.calories || 0
                totalProtein += scan.data.total.protein || 0
                totalCarbs += scan.data.total.carbs || 0
                totalFats += scan.data.total.fat || 0
            } else if (scan.type === 'barcode' && scan.data.nutriments) {
                totalCalories += (scan.data.nutriments.energy_kcal_100g || 0) * amount
                totalProtein += (scan.data.nutriments.proteins_100g || 0) * amount
                totalCarbs += (scan.data.nutriments.carbohydrates_100g || 0) * amount
                totalFats += (scan.data.nutriments.fat_100g || 0) * amount
            }
        })

        todaysNutrition.value = {
            calories: Math.round(totalCalories),
            protein: Math.round(totalProtein),
            carbs: Math.round(totalCarbs),
            fats: Math.round(totalFats)
        }
    } catch (error) {
        console.error('Error calculating nutrition:', error)
        todaysNutrition.value = { calories: 0, protein: 0, carbs: 0, fats: 0 }
    }
}

async function loadStreak() {
    try {
        currentStreak.value = await StreakManager.getCurrentStreak()
    } catch (error) {
        console.error('Error loading streak:', error)
        currentStreak.value = 0
    }
}

async function syncToHealthKit() {
    try {
        if (!isPremiumUser.value) {
            console.log('🔒 HealthKit sync skipped - Premium feature');
            return;
        }

        await HealthKitService.syncTodaysData()
    } catch (error) {
        console.error('Error syncing to HealthKit:', error)
    }
}

function goToView(view: string) {
    router.push(`/${view}`)
}

function openFeedback() {
    // Open app store for feedback or feedback form
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)
    
    if (isIOS) {
        window.open('https://apps.apple.com/app/kalbuddy/id123456789', '_blank')
    } else if (isAndroid) {
        window.open('https://play.google.com/store/apps/details?id=com.kalbuddy.app', '_blank')
    } else {
        // Fallback - could open a feedback form
        router.push('/feedback')
    }
}

function toggleAddFoodModal(val: boolean) {
    isAddFoodModalVisible.value = val
}

async function handleSelectScanner() {
    toggleAddFoodModal(false)
    await openNativeScanner()
}

function handleSelect(view: string) {
    toggleAddFoodModal(false)
    router.push(`/${view}`)
}

/*function getChatSubtitle(): string {
    return t('home.chatSubtitle')
}*/

function formatCurrentDate(): string {
    const today = new Date()
    const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000))
    
    const selectedDateString = selectedDate.value.toDateString()
    const todayString = today.toDateString()
    const yesterdayString = yesterday.toDateString()
    
    if (selectedDateString === todayString) {
        return t('app.today')
    } else if (selectedDateString === yesterdayString) {
        return t('app.yesterday')
    } else {
        return selectedDate.value.toLocaleDateString('de-DE', { 
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        })
    }
}

// Dropdown functions
function toggleDateDropdown() {
    showDateDropdown.value = !showDateDropdown.value
}

function selectDate(dateObj: any) {
    selectedDate.value = new Date(dateObj.date)
    showDateDropdown.value = false
    loadScanHistory()
}

// Close dropdown when clicking outside
function handleClickOutside(event: Event) {
    if (dateDropdownContainer.value && !dateDropdownContainer.value.contains(event.target as Node)) {
        showDateDropdown.value = false
    }
}

function hidePremiumBanner() {
    showPremiumBanner.value = false
}

function goToNutritionDetail(item: FoodItem) {
    router.push({
        path: '/scan-detail',
        query: {
            scanId: item.id.toString()
        }
    })
}

const recentFoods = computed((): FoodItem[] => {
    return scanHistory.value
        .map(transformScanToFoodItem)
        .filter((item): item is FoodItem => item !== null)
})

// Verwende die generische Funktion für alle Makronährstoffe
const calories = createMacroCalculations(dailyCalories, consumedCalories, '', 'home.caloriesOver', 'home.caloriesLeft')
const protein = createMacroCalculations(dailyProtein, consumedProtein, 'g', 'home.proteinOver', 'home.proteinLeft')
const carbs = createMacroCalculations(dailyCarbs, consumedCarbs, 'g', 'home.carbsOver', 'home.carbsLeft')
const fats = createMacroCalculations(dailyFats, consumedFats, 'g', 'home.fatsOver', 'home.fatsLeft')

// Aliases für Backward-Kompatibilität
const caloriesProgress = calories.progress
const proteinProgress = protein.progress
const carbsProgress = carbs.progress
const fatsProgress = fats.progress

const caloriesNumberDisplay = calories.numberDisplay
const caloriesLabelDisplay = calories.labelDisplay
const proteinNumberDisplay = protein.numberDisplay
const proteinLabelDisplay = protein.labelDisplay
const carbsNumberDisplay = carbs.numberDisplay
const carbsLabelDisplay = carbs.labelDisplay
const fatsNumberDisplay = fats.numberDisplay
const fatsLabelDisplay = fats.labelDisplay

// Watch for date changes and reload data
watch(selectedDate, () => {
    loadScanHistoryAndStreak()
}, { immediate: false })

function calculateMacroOffset(progress: number, circumference: number): number {
    const clampedProgress = Math.max(0, Math.min(1, progress))
    return circumference - (circumference * clampedProgress)
}
</script>

<style scoped>
.home-view {
    height: 100vh;
    height: calc(100vh - max(44px, env(safe-area-inset-top, 44px)));
    background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
    background-size: 100% 100vh;
    background-position: bottom;
    color: white;
    padding: 0 14px 16px;
    margin-top: max(44px, env(safe-area-inset-top, 44px));
    padding-bottom: max(80px, calc(80px + env(safe-area-inset-bottom, 0px)));
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    height: 44px;
}

.logo-section {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo {
    width: 24px;
    height: 24px;
}

.app-title {
    font-size: 30px;
    font-weight: 600;
    margin: 0;
}

.streak {
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(255, 255, 255, 0.1);
    padding: 8px 12px;
    border-radius: 20px;
    cursor: pointer;
    position: relative;
}

.streak:hover {
    background: rgba(255, 255, 255, 0.15);
}

.dropdown-arrow {
    transition: transform 0.2s ease;
}

.dropdown-arrow.dropdown-open {
    transform: rotate(180deg);
}

.streak-content {
    flex: 1;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
}

.date-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(40, 44, 52, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    margin-top: 8px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.date-option {
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.date-option:last-child {
    border-bottom: none;
}

.date-option:hover {
    background: rgba(255, 255, 255, 0.1);
}

.date-option.active {
    background: rgba(0, 112, 82, 0.3);
}

.date-main {
    display: block;
    font-weight: 500;
    font-size: 14px;
}

.date-sub {
    display: block;
    font-size: 12px;
    opacity: 0.7;
    margin-top: 2px;
}

.date-toggle {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 8px 10px;
    margin-bottom: 12px;
    backdrop-filter: blur(10px);
    height: auto;
}

.date-nav-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
}

.date-nav-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.date-nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.date-nav-btn:disabled:hover {
    background: rgba(255, 255, 255, 0.1);
}

.current-date-compact {
    text-align: center;
    flex: 1;
    margin: 0 16px;
}

.date-label {
    font-size: 18px;
    font-weight: 600;
    display: block;
    line-height: 1.2;
}

.date-btn {
    background: transparent;
    border: none;
    color: white;
    padding: 8px 0;
    font-size: 16px;
    cursor: pointer;
    position: relative;
}

.date-btn.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: white;
    border-radius: 1px;
}

.history-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    text-decoration: none;
    margin-left: auto;
    transition: all 0.2s ease;
}

.history-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.history-btn:active {
    transform: scale(0.95);
}

.quick-actions {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
    overflow-x: auto;
    padding: 0 2px;
}

.quick-actions::-webkit-scrollbar {
    display: none;
}

.action-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.08);
    padding: 8px 12px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    backdrop-filter: blur(10px);
    /*border: 1px solid rgba(255, 255, 255, 0.1);*/
}

.action-chip:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
}

.action-chip:active {
    transform: translateY(0);
}

.action-chip span {
    font-size: 13px;
    font-weight: 500;
}

.action-chip svg {
    opacity: 0.9;
}

/* AUSKOMMENTIERT: Altes Date-Toggle CSS
.date-toggle {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 8px 10px;
    margin-bottom: 12px;
    backdrop-filter: blur(10px);
    height: auto;
}

.date-nav-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
}

.date-nav-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.date-nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.date-nav-btn:disabled:hover {
    background: rgba(255, 255, 255, 0.1);
}

.current-date-compact {
    text-align: center;
    flex: 1;
    margin: 0 16px;
}

.date-label {
    font-size: 18px;
    font-weight: 600;
    display: block;
    line-height: 1.2;
}
*/

.main-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    /*24px*/
    backdrop-filter: blur(10px);
    height: 140px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    /*cursor: pointer;
    transition: transform 0.2s, background 0.2s;*/
}

/*.main-card:active {
    transform: translateY(0px);
    background: rgba(255, 255, 255, 0.12);
}*/

.calories-number {
    font-size: 48px;
    font-weight: 700;
    margin: 0;
    line-height: 1;
}

.calories-label {
    font-size: 16px;
    opacity: 0.8;
    margin: 5px 0 0 0;
}

.streak-line {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.streak-line:hover {
    opacity: 0.8;
}

.streak-text {
    font-size: 14px;
    font-weight: 500;
    color: #ff6b35;
}

.progress-ring {
    position: relative;
    width: 100px;
    height: 100px;
}

.progress-circle {
    transition: stroke-dashoffset 0.8s ease-in-out;
}

.flame-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
}

.macros-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 32px;
}

.macro-card {
    background: rgba(255, 255, 255, 0.05);
    /*border: 1px solid rgba(255, 255, 255, 0.1);*/
    border-radius: 15px;
    padding: 16px;
    text-align: center;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* cursor: pointer;
    transition: transform 0.2s, background 0.2s;*/
}

/*.macro-card:active {
    transform: translateY(0px);
    background: rgba(255, 255, 255, 0.12);
}*/

.macro-amount {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 5px;
}

.macro-label {
    font-size: 12px;
    opacity: 0.8;
    margin-bottom: 15px;
}

.macro-progress {
    position: relative;
    display: flex;
    justify-content: center;
    width: 60px;
    height: 60px;
    margin: 0 auto;
}

.macro-progress>svg {
    width: 60px;
    height: 60px;
}

.macro-progress svg .progress-circle {
    transition: stroke-dashoffset 0.8s ease-in-out;
}

.macro-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /*font-size: 12px;*/
    pointer-events: none;
    z-index: 1;
    padding-top: 2px;
}

.macro-icon>svg {
    width: 30px;
    height: 30px;
}

.macro-icon-carbs {
    padding-top: 4px;
}

.macro-icon-carbs>svg {
    width: 26px;
    height: 26px;
}

/*.recent-section {
    margin-bottom: 30px;
}*/

.section-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    backdrop-filter: blur(10px);
}

.empty-icon {
    font-size: 3rem;
    margin-bottom: 16px;
    opacity: 0.6;
}

.empty-state p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    margin-bottom: 8px;
}

.empty-subtitle {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px !important;
    margin-bottom: 0 !important;
}

.food-item {
    display: flex;
    align-items: center;
    gap: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 12px;
    margin-bottom: 12px;
    backdrop-filter: blur(10px);
}

.food-image {
    width: 69px;
    height: 69px;
    border-radius: 10px;
    overflow: hidden;
    background: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.food-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.food-db-icon {
    font-size: 30px;
}

.food-info {
    flex: 1;
}

.food-name {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 8px 0;
}

.food-calories {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 8px;
    font-size: 14px;
}

.food-macros {
    display: flex;
    gap: 10px;
    font-size: 12px;
}

.macro-item {
    display: flex;
    align-items: center;
    gap: 2px;
}

.protein-color {
    color: #ff6b6b;
}

.carbs-color {
    color: #ffa726;
}

.fats-color {
    color: #42a5f5;
}

.food-time {
    font-size: 14px;
    opacity: 0.6;
}

.show-all-link {
    text-align: center;
    /*margin-top: 20px;*/
}

.show-all-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    /*gap: 8px;*/
    background: rgba(255, 255, 255, 0.05);
    color: white;
    text-decoration: none;
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    backdrop-filter: blur(10px);
    transition: all 0.2s;
}

.show-all-btn:active {
    transform: translateY(0px);
    background: rgba(255, 255, 255, 0.2);
}

.add-button {
    position: fixed;
    bottom: 90px;
    right: 16px;
    width: 56px;
    height: 56px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1e1e2e;
    text-decoration: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;
}

a {
    text-decoration: none;
}

/* Processing Overlay */
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

/* Mode Selector */
.mode-selector-overlay {
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

.mode-selector-content {
    background: #fff;
    border-radius: 20px;
    padding: 24px;
    max-width: 400px;
    width: 100%;
    text-align: center;
}

.mode-selector-content h3 {
    margin: 0 0 24px 0;
    color: #1a1a1a;
    font-size: 20px;
    font-weight: 600;
}

.mode-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
}

.mode-option {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 2px solid #f0f0f0;
    border-radius: 12px;
    background: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
}

.mode-icon {
    font-size: 32px;
    margin-right: 16px;
    min-width: 48px;
}

.mode-option h4 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
}

.mode-option p {
    margin: 0;
    font-size: 14px;
    color: #666;
    line-height: 1.4;
}

.mode-cancel {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
    color: #666;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
}

/* Premium Banner */
.premium-banner {
    /*margin: 16px 20px 0;*/
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(255, 165, 0, 0.9));
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.banner-content {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #1e1e2e;
}

.banner-icon {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    background: rgba(30, 30, 46, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.banner-text {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.banner-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 2px;
}

.banner-subtitle {
    font-size: 13px;
    opacity: 0.8;
}

.banner-close {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background: rgba(30, 30, 46, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
}

.kalbuddy-chat-link {
    display: flex;
    align-items: center;
    padding: 12px;
    background: linear-gradient(135deg, #007052, #005e4a);
    border-radius: 16px;
    text-decoration: none;
    color: white;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(0, 112, 82, 0.2);
}

.chat-icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
}

.chat-content {
    flex: 1;
}

.chat-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 4px 0;
    color: white;
}

.chat-subtitle {
    font-size: 14px;
    margin: 0;
    opacity: 0.9;
    color: white;
}

.chat-arrow {
    flex-shrink: 0;
    opacity: 0.8;
    transition: transform 0.3s ease;
}

.kalbuddy-chat-section {
    margin-bottom: 12px;
}
</style>
