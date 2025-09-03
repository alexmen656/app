// Utils for handling multilingual food names and text
import { getCurrentLanguage } from '../i18n'

/**
 * Get localized name based on current app language
 * @param item Object with name (German) and name_en (English) properties
 * @returns Localized name based on current language
 */
export function getLocalizedName(item: { name?: string; name_en?: string }): string {
  const currentLanguage = getCurrentLanguage()
  console.log('🌐 getLocalizedName:', { currentLanguage, item, name: item?.name, name_en: item?.name_en })
  
  if (currentLanguage === 'en' && item?.name_en) {
    return item.name_en
  }
  
  return item?.name || item?.name_en || 'Unknown'
}

/**
 * Get localized notes based on current app language  
 * @param item Object with notes (German) and notes_en (English) properties
 * @returns Localized notes based on current language
 */
export function getLocalizedNotes(item: { notes?: string; notes_en?: string }): string {
  const currentLanguage = getCurrentLanguage()
  
  if (currentLanguage === 'en' && item.notes_en) {
    return item.notes_en
  }
  
  return item.notes || item.notes_en || ''
}

/**
 * Get localized amount based on current app language  
 * @param item Object with amount (German) and amount_en (English) properties
 * @returns Localized amount based on current language
 */
export function getLocalizedAmount(item: { amount?: string; amount_en?: string }): string {
  const currentLanguage = getCurrentLanguage()
  
  if (currentLanguage === 'en' && item.amount_en) {
    return item.amount_en
  }
  
  return item.amount || item.amount_en || ''
}

/**
 * Capitalize first letter if it starts with a letter
 * @param value String to capitalize
 * @returns Capitalized string
 */
export function capitalizeIfLetter(value: string): string {
  if (!value) return ''
  return /^[a-zA-Z]/.test(value)
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : value
}
