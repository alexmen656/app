import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import de from './locales/de.json'
import es from './locales/es.json'

const messages = {
  en,
  de,
  es
}

// Get saved language from localStorage or use system language
const savedLanguage = localStorage.getItem('kaloriq-language')
const systemLanguage = navigator.language.split('-')[0]
const defaultLanguage = savedLanguage || (systemLanguage === 'de' ? 'de' : systemLanguage === 'es' ? 'es' : 'en')

const i18n = createI18n({
  legacy: false,
  locale: defaultLanguage,
  fallbackLocale: 'en',
  messages
})

export default i18n

// Helper function to change language
export function setLanguage(locale: 'en' | 'de' | 'es') {
  i18n.global.locale.value = locale
  localStorage.setItem('kaloriq-language', locale)
  document.documentElement.setAttribute('lang', locale)
}

// Helper function to get current language
export function getCurrentLanguage() {
  return i18n.global.locale.value
}
