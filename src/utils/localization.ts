// Utils for handling multilingual food names and text
import { getCurrentLanguage } from '../i18n'

/**
 * Get localized name based on current app language
 * @param item Object with name (German) and name_en (English) properties OR names object with language keys
 * @returns Localized name based on current language
 */
export function getLocalizedName(item: { name?: string; name_en?: string } | { names?: { [key: string]: string } }): string {
  const currentLanguage = getCurrentLanguage()
  
  // Handle new multilingual structure
  if ('names' in item && item.names) {
    // Try current language first
    if (item.names[currentLanguage]) {
      return item.names[currentLanguage]
    }
    
    // Fallback to any available language
    const availableLanguages = Object.keys(item.names)
    if (availableLanguages.length > 0) {
      return item.names[availableLanguages[0]]
    }
  }
  
  // Handle legacy structure (backward compatibility)
  if ('name' in item || 'name_en' in item) {
    console.log('🌐 getLocalizedName (legacy):', { currentLanguage, item, name: item?.name, name_en: item?.name_en })
    
    if (currentLanguage === 'en' && item?.name_en) {
      return item.name_en
    }
    
    return item?.name || item?.name_en || 'Unknown'
  }
  
  return 'Unknown'
}

/**
 * Get localized notes based on current app language  
 * @param item Object with notes (German) and notes_en (English) properties OR notes object with language keys
 * @returns Localized notes based on current language
 */
export function getLocalizedNotes(item: { notes?: string; notes_en?: string } | { notes?: { [key: string]: string } }): string {
  const currentLanguage = getCurrentLanguage()
  
  // Handle new multilingual structure
  if ('notes' in item && typeof item.notes === 'object' && item.notes) {
    // Try current language first
    if (item.notes[currentLanguage]) {
      return item.notes[currentLanguage]
    }
    
    // Fallback to any available language
    const availableLanguages = Object.keys(item.notes)
    if (availableLanguages.length > 0) {
      return item.notes[availableLanguages[0]]
    }
  }
  
  // Handle legacy structure (backward compatibility)
  if ('notes' in item && typeof item.notes === 'string') {
    if (currentLanguage === 'en' && 'notes_en' in item && item.notes_en) {
      return item.notes_en
    }
    return item.notes || ''
  }
  
  if ('notes_en' in item) {
    return item.notes_en || ''
  }
  
  return ''
}

/**
 * Get localized amount based on current app language  
 * @param item Object with amount (German) and amount_en (English) properties OR amount object with language keys
 * @returns Localized amount based on current language
 */
export function getLocalizedAmount(item: { amount?: string; amount_en?: string } | { amount?: { [key: string]: string } }): string {
  const currentLanguage = getCurrentLanguage()
  
  // Handle new multilingual structure
  if ('amount' in item && typeof item.amount === 'object' && item.amount) {
    // Try current language first
    if (item.amount[currentLanguage]) {
      return item.amount[currentLanguage]
    }
    
    // Fallback to any available language
    const availableLanguages = Object.keys(item.amount)
    if (availableLanguages.length > 0) {
      return item.amount[availableLanguages[0]]
    }
  }
  
  // Handle legacy structure (backward compatibility)
  if ('amount' in item && typeof item.amount === 'string') {
    if (currentLanguage === 'en' && 'amount_en' in item && item.amount_en) {
      return item.amount_en
    }
    return item.amount || ''
  }
  
  if ('amount_en' in item) {
    return item.amount_en || ''
  }
  
  return ''
}

/**
 * Migrate old naming formats to unified names object
 * @param item Object with potential old naming formats (name, name_en, product_name, etc.)
 * @returns Object with standardized names format
 */
export function migrateToNamesFormat(item: any): any {
  if (!item) return item

  // If already has names object, keep it but ensure it's complete
  if (item.names && typeof item.names === 'object') {
    return {
      ...item,
      names: item.names
    }
  }

  // Create names object from legacy fields
  const names: { [key: string]: string } = {}

  // Extract from various legacy name fields
  if (item.name) {
    names.de = item.name
  }
  if (item.name_en) {
    names.en = item.name_en
  }
  if (item.name_es) {
    names.es = item.name_es
  }
  if (item.product_name) {
    // Use product_name as German fallback if no other name exists
    if (!names.de) {
      names.de = item.product_name
    }
    if (!names.en) {
      names.en = item.product_name
    }
  }

  // If no names found, use fallback
  if (Object.keys(names).length === 0) {
    names.de = 'Unbekanntes Produkt'
    names.en = 'Unknown Product'
    names.es = 'Producto Desconocido'
  }

  // Ensure all languages have a value
  if (!names.de) names.de = names.en || names.es || 'Unbekanntes Produkt'
  if (!names.en) names.en = names.de || names.es || 'Unknown Product'
  if (!names.es) names.es = names.de || names.en || 'Producto Desconocido'

  // Create new object without legacy name fields
  const migratedItem = { ...item }
  delete migratedItem.name
  delete migratedItem.name_en
  delete migratedItem.name_es
  delete migratedItem.product_name

  return {
    ...migratedItem,
    names
  }
}

/**
 * Migrate food items with nested food arrays
 * @param item Object that might contain foods array
 * @returns Object with migrated foods array
 */
export function migrateFoodsArray(item: any): any {
  if (!item) return item

  let migratedItem = migrateToNamesFormat(item)

  // Migrate foods array if it exists
  if (migratedItem.foods && Array.isArray(migratedItem.foods)) {
    migratedItem.foods = migratedItem.foods.map((food: any) => migrateToNamesFormat(food))
  }

  return migratedItem
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
