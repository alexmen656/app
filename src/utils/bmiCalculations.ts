// Utility functions for BMI calculations
export const BMI_CATEGORIES = {
  UNDERWEIGHT: { min: 0, max: 18.5, color: '#42a5f5', name: 'underweight' },
  NORMAL: { min: 18.5, max: 25, color: '#4caf50', name: 'normal' },
  OVERWEIGHT: { min: 25, max: 30, color: '#ff9800', name: 'overweight' },
  OBESE: { min: 30, max: 100, color: '#f44336', name: 'obese' }
} as const

export interface BMIResult {
  value: number | null
  category: string | null
  categoryColor: string | null
  position: number
}

export function calculateBMI(height: number | null, weight: number | null): BMIResult {
  if (!height || !weight || height <= 0 || weight <= 0) {
    return {
      value: null,
      category: null,
      categoryColor: null,
      position: 0
    }
  }

  // Convert height from cm to meters for BMI calculation
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)
  
  // Find category
  const category = Object.values(BMI_CATEGORIES).find(cat => 
    bmi >= cat.min && bmi < cat.max
  ) || BMI_CATEGORIES.OBESE

  // Calculate position for BMI scale (15-35 range)
  const minBMI = 15
  const maxBMI = 35
  const position = Math.max(0, Math.min(100, ((bmi - minBMI) / (maxBMI - minBMI)) * 100))

  return {
    value: Math.round(bmi * 10) / 10, // Round to 1 decimal
    category: category.name,
    categoryColor: category.color,
    position
  }
}

export function getBMIAdvice(bmi: number | null): string {
  if (!bmi) return ''
  
  if (bmi < 18.5) {
    return 'Consider consulting a healthcare provider about healthy weight gain strategies.'
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Great! Maintain your healthy weight with balanced nutrition and regular exercise.'
  } else if (bmi >= 25 && bmi < 30) {
    return 'Consider a balanced diet and increased physical activity to reach a healthier weight.'
  } else {
    return 'Consult with a healthcare provider for a personalized weight management plan.'
  }
}
