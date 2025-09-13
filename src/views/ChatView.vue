<template>
  <div class="chat-view">
    <!-- Header -->
    <header class="chat-header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
      <div class="header-content">
        <h1 class="chat-title">{{ $t('chat.title') }}</h1>
        <div class="kalbuddy-status">
          <div class="status-indicator online"></div>
          <span>Online</span>
        </div>
      </div>
      <div class="kalbuddy-avatar">
        <span class="avatar-emoji">🤖</span>
      </div>
    </header>

    <!-- Chat Messages -->
    <div class="chat-messages" ref="messagesContainer">
      <!-- Welcome Message -->
      <div class="message bot-message" v-if="messages.length === 0">
        <div class="message-avatar">
          <span>🤖</span>
        </div>
        <div class="message-content">
          <div class="message-bubble">
            <p>{{ $t('chat.greeting') }}</p>
          </div>
          <div class="message-time">{{ getCurrentTime() }}</div>
        </div>
      </div>

      <!-- Example Questions (only shown when no messages) -->
      <div class="examples-section" v-if="messages.length === 0">
        <div class="examples-title">{{ $t('chat.examples.title') }}</div>
        <div class="example-questions">
          <button 
            class="example-btn" 
            v-for="(example, index) in exampleQuestions" 
            :key="index"
            @click="sendExample(example)"
          >
            {{ example }}
          </button>
        </div>
      </div>

      <!-- Actual Messages -->
      <div 
        v-for="(message, index) in messages" 
        :key="index" 
        class="message"
        :class="{ 'user-message': message.isUser, 'bot-message': !message.isUser }"
      >
        <div class="message-avatar" v-if="!message.isUser">
          <span>🤖</span>
        </div>
        <div class="message-content">
          <div class="message-bubble">
            <p>{{ message.text }}</p>
          </div>
          <div class="message-time">{{ message.time }}</div>
        </div>
        <div class="message-avatar" v-if="message.isUser">
          <span>👤</span>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div class="message bot-message" v-if="isTyping">
        <div class="message-avatar">
          <span>🤖</span>
        </div>
        <div class="message-content">
          <div class="message-bubble typing-bubble">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p class="typing-text">{{ $t('chat.typing') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="chat-input-area">
      <div class="input-container">
        <input 
          v-model="currentMessage"
          type="text" 
          :placeholder="$t('chat.placeholder')"
          @keypress.enter="sendMessage"
          @focus="scrollToBottom"
          class="message-input"
          :disabled="isTyping"
        />
        <button 
          class="send-btn" 
          @click="sendMessage"
          :disabled="!currentMessage.trim() || isTyping"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { userProfile, dailyGoals } from '../stores/userStore'
import { ScanHistory } from '../utils/storage'
import { WeightTracker } from '../utils/weightTracking'

const router = useRouter()
const { t, locale } = useI18n()

// API Configuration
const API_BASE_URL = 'https://v2-2.api.kalbuddy.com/api/ai'

// Reactive data
const currentMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement>()
const conversationHistory = ref<Array<{role: string, content: string}>>([])
const error = ref<string | null>(null)

interface Message {
  text: string
  isUser: boolean
  time: string
}

const messages = ref<Message[]>([])

// Example questions based on current locale
const exampleQuestions = computed(() => [
  t('chat.examples.example1'),
  t('chat.examples.example2'),
  t('chat.examples.example3'),
  t('chat.examples.example4')
])

// Get current language for API
const currentLanguage = computed(() => {
  const lang = locale.value
  return ['de', 'en', 'es'].includes(lang) ? lang : 'en'
})

// Methods
function goBack() {
  router.go(-1)
}

function getCurrentTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function sendExample(exampleText: string) {
  currentMessage.value = exampleText
  sendMessage()
}

async function sendMessage() {
  if (!currentMessage.value.trim() || isTyping.value) return

  const userMessage: Message = {
    text: currentMessage.value,
    isUser: true,
    time: getCurrentTime()
  }

  messages.value.push(userMessage)
  const messageText = currentMessage.value
  currentMessage.value = ''
  error.value = null
  
  scrollToBottom()

  // Show typing indicator
  isTyping.value = true
  scrollToBottom()

  try {
    const response = await callChatAPI(messageText)
    
    const botResponse: Message = {
      text: response.response,
      isUser: false,
      time: getCurrentTime()
    }

    isTyping.value = false
    messages.value.push(botResponse)
    
    // Update conversation history
    conversationHistory.value = response.conversationHistory || []
    
    scrollToBottom()
  } catch (err) {
    isTyping.value = false
    
    const errorMessage: Message = {
      text: getErrorMessage(err),
      isUser: false,
      time: getCurrentTime()
    }
    
    messages.value.push(errorMessage)
    scrollToBottom()
  }
}

async function callChatAPI(message: string) {
  const payload = {
    message: message,
    userProfile: await buildUserProfile(),
    conversationHistory: conversationHistory.value,
    language: currentLanguage.value
  }

  console.log('Sending payload to chat API:', payload)

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`)
  }

  return await response.json()
}

async function buildUserProfile() {
  // Build comprehensive user profile from your actual userStore and scan data
  const profile: any = {}
  
  // Basic user information
  if (userProfile.age) profile.age = userProfile.age
  if (userProfile.gender) profile.gender = userProfile.gender
  if (userProfile.weight) profile.weight = userProfile.weight
  if (userProfile.height) profile.height = userProfile.height
  if (userProfile.activityLevel) profile.activityLevel = userProfile.activityLevel
  if (userProfile.goal) profile.goals = [userProfile.goal]
  
  // Daily goals and targets
  profile.dailyGoals = {
    calories: dailyGoals.calories,
    protein: dailyGoals.protein,
    carbs: dailyGoals.carbs,
    fats: dailyGoals.fats
  }
  
  // Get today's consumed foods
  try {
    const scanHistory = await ScanHistory.get()
    const today = new Date().toISOString().split('T')[0]
    
    const todaysScans = scanHistory.filter(scan => {
      const scanDate = new Date(scan.timestamp).toISOString().split('T')[0]
      return scanDate === today
    })

    if (todaysScans.length > 0) {
      profile.todaysNutrition = {
        totalConsumed: calculateTotalNutrition(todaysScans),
        mealsCount: todaysScans.length,
        foods: todaysScans.map(scan => ({
          name: extractFoodName(scan),
          calories: extractCalories(scan),
          protein: extractProtein(scan),
          carbs: extractCarbs(scan),
          fats: extractFats(scan),
          time: scan.time,
          amount: scan.amount || 1
        }))
      }
    }
  } catch (error) {
    console.log('Could not load today\'s nutrition data:', error)
  }

  // Get recent weight history
  try {
    const weightEntries = await WeightTracker.getWeightEntries()
    if (weightEntries.length > 0) {
      profile.weightHistory = {
        currentWeight: weightEntries[0].weight,
        recentEntries: weightEntries.slice(0, 5).map(entry => ({
          weight: entry.weight,
          date: entry.date,
          note: entry.note
        }))
      }
    }
  } catch (error) {
    console.log('Could not load weight history:', error)
  }
  
  return profile
}

function calculateTotalNutrition(scans: any[]) {
  let totalCalories = 0
  let totalProtein = 0
  let totalCarbs = 0
  let totalFats = 0

  scans.forEach(scan => {
    totalCalories += extractCalories(scan)
    totalProtein += extractProtein(scan)
    totalCarbs += extractCarbs(scan)
    totalFats += extractFats(scan)
  })

  return {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein),
    carbs: Math.round(totalCarbs),
    fats: Math.round(totalFats)
  }
}

function extractFoodName(scan: any): string {
  if (scan.type === 'food') {
    return scan.data.foods?.[0]?.name || 'Unknown food'
  } else if (scan.type === 'barcode') {
    return scan.data.product?.product_name || 'Unknown product'
  }
  return 'Unknown'
}

function extractCalories(scan: any): number {
  const amount = scan.amount || 1.0
  
  if (scan.type === 'food') {
    return (scan.data.total?.calories || 0)
  } else if (scan.type === 'barcode') {
    const per100g = scan.data.nutriments?.['energy-kcal_100g'] || 0
    return per100g * amount
  }
  return 0
}

function extractProtein(scan: any): number {
  const amount = scan.amount || 1.0
  
  if (scan.type === 'food') {
    return (scan.data.total?.protein || 0)
  } else if (scan.type === 'barcode') {
    const per100g = scan.data.nutriments?.['proteins_100g'] || 0
    return per100g * amount
  }
  return 0
}

function extractCarbs(scan: any): number {
  const amount = scan.amount || 1.0
  
  if (scan.type === 'food') {
    return (scan.data.total?.carbs || 0)
  } else if (scan.type === 'barcode') {
    const per100g = scan.data.nutriments?.['carbohydrates_100g'] || 0
    return per100g * amount
  }
  return 0
}

function extractFats(scan: any): number {
  const amount = scan.amount || 1.0
  
  if (scan.type === 'food') {
    return (scan.data.total?.fat || 0)
  } else if (scan.type === 'barcode') {
    const per100g = scan.data.nutriments?.['fat_100g'] || 0
    return per100g * amount
  }
  return 0
}

function getErrorMessage(error: any): string {
  if (error.message?.includes('rate_limit_exceeded')) {
    return t('chat.rateLimitError')
  }
  
  if (error.message?.includes('insufficient_quota')) {
    return t('chat.serviceUnavailable')
  }
  
  if (!navigator.onLine) {
    return t('chat.networkError')
  }
  
  return t('chat.error')
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-view {
  min-height: 100vh;
  background: #1e1e2e;
  display: flex;
  flex-direction: column;
  padding-bottom: 120px; /* Account for bottom navigation */
}

/* Header */
.chat-header {
  background: linear-gradient(135deg, #007052, #005e4a);
  color: white;
  padding: 16px 20px;
  padding-top: calc(16px + env(safe-area-inset-top));
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  background: none;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.header-content {
  flex: 1;
}

.chat-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.kalbuddy-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  opacity: 0.9;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
}

.kalbuddy-avatar {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

/* Messages */
.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.message {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-end;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin: 0 8px;
  flex-shrink: 0;
}

.bot-message .message-avatar {
  background: linear-gradient(135deg, #007052, #005e4a);
}

.user-message .message-avatar {
  background: #3b82f6;
}

.message-content {
  max-width: 70%;
}

.user-message {
  flex-direction: row-reverse;
}

.user-message .message-content {
  text-align: right;
}

.message-bubble {
  background: #2a2d37;
  border-radius: 18px;
  padding: 12px 16px;
  margin-bottom: 4px;
  position: relative;
}

.user-message .message-bubble {
  background: #3b82f6;
  border-bottom-right-radius: 6px;
}

.bot-message .message-bubble {
  background: #2a2d37;
  border-bottom-left-radius: 6px;
}

.message-bubble p {
  margin: 0;
  color: white;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  font-size: 12px;
  color: #6b7280;
  margin: 0 8px;
}

/* Examples Section */
.examples-section {
  margin: 24px 0;
  text-align: center;
}

.examples-title {
  color: #9ca3af;
  font-size: 16px;
  margin-bottom: 16px;
  font-weight: 500;
}

.example-questions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.example-btn {
  background: #2a2d37;
  border: 1px solid #374151;
  border-radius: 12px;
  padding: 12px 16px;
  color: #d1d5db;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  line-height: 1.4;
}

.example-btn:hover {
  background: #374151;
  border-color: #007052;
  color: white;
}

/* Typing Indicator */
.typing-bubble {
  background: #2a2d37 !important;
  display: flex;
  align-items: center;
  gap: 8px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #007052;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

.typing-text {
  margin: 0 !important;
  color: #9ca3af !important;
  font-style: italic;
  font-size: 14px;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Input Area */
.chat-input-area {
  background: #1e1e2e;
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  border-top: 1px solid #374151;
  position: sticky;
  bottom: 0;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #2a2d37;
  border-radius: 24px;
  padding: 8px;
  border: 1px solid #374151;
}

.message-input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  padding: 8px 16px;
  font-size: 16px;
  outline: none;
}

.message-input::placeholder {
  color: #6b7280;
}

.send-btn {
  background: linear-gradient(135deg, #007052, #005e4a);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 112, 82, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Responsive Design */
@media (max-width: 480px) {
  .chat-messages {
    padding: 16px;
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .chat-header {
    padding: 12px 16px;
    padding-top: calc(12px + env(safe-area-inset-top));
  }
  
  .chat-input-area {
    padding: 12px 16px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }
}
</style>
