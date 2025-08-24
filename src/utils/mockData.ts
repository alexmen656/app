import { Storage, ScanHistory } from './storage';

// 🎯 SIMPLE MOCK DATA SYSTEM
export class MockDataManager {
  private static readonly MOCK_DATA_KEY = 'mockDataEnabled';

  // Check if mock data is enabled
  static async isEnabled(): Promise<boolean> {
    try {
      return await Storage.get(this.MOCK_DATA_KEY) || false;
    } catch {
      return false;
    }
  }

  // Enable/disable mock data
  static async setEnabled(enabled: boolean): Promise<void> {
    try {
      await Storage.set(this.MOCK_DATA_KEY, enabled);
      
      if (enabled) {
        await this.installMockData();
      } else {
        await this.removeMockData();
      }
    } catch (error) {
      console.error('Error setting mock data:', error);
    }
  }

  // Install mock data
  private static async installMockData(): Promise<void> {
    try {
      console.log('📦 Installing mock data...');

      // Generate mock scan history
      const mockHistory = this.generateMockScanHistory();
      await Storage.set('scanHistory', mockHistory);

      // Set up streak
      await this.setupMockStreak();

      console.log('✅ Mock data installed!');

      // Update UI
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('scanHistoryUpdated'));
      }
    } catch (error) {
      console.error('❌ Error installing mock data:', error);
    }
  }

  // Remove mock data
  private static async removeMockData(): Promise<void> {
    try {
      console.log('🧹 Removing mock data...');

      await ScanHistory.clear();
      await Storage.remove('currentStreak');
      await Storage.remove('lastLoggedDate');
      await Storage.remove('longestStreak');

      console.log('✅ Mock data removed!');

      // Update UI
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('scanHistoryUpdated'));
      }
    } catch (error) {
      console.error('❌ Error removing mock data:', error);
    }
  }

  // Generate realistic mock scan history for last 30 days
  private static generateMockScanHistory(): any[] {
    const history: any[] = [];
    const now = new Date();
    let id = 1000; // Start with high ID to avoid conflicts

    // Define realistic food items
    const foodItems = [
      {
        name: 'Haferflocken mit Banane',
        calories: 320,
        protein: 12,
        carbs: 58,
        fats: 6,
        type: 'food'
      },
      {
        name: 'Gegrilltes Hähnchen',
        calories: 280,
        protein: 45,
        carbs: 0,
        fats: 8,
        type: 'food'
      },
      {
        name: 'Vollkornbrot mit Avocado',
        calories: 250,
        protein: 8,
        carbs: 30,
        fats: 12,
        type: 'food'
      },
      {
        name: 'Griechischer Joghurt',
        calories: 150,
        protein: 20,
        carbs: 8,
        fats: 4,
        type: 'food'
      },
      {
        name: 'Lachs mit Reis',
        calories: 420,
        protein: 35,
        carbs: 40,
        fats: 15,
        type: 'food'
      },
      {
        name: 'Mandeln (30g)',
        calories: 180,
        protein: 6,
        carbs: 6,
        fats: 15,
        type: 'food'
      },
      {
        name: 'Quinoa Salat',
        calories: 310,
        protein: 12,
        carbs: 45,
        fats: 10,
        type: 'food'
      },
      {
        name: 'Protein Shake',
        calories: 200,
        protein: 30,
        carbs: 5,
        fats: 3,
        type: 'food'
      }
    ];

    const barcodeProducts = [
      {
        product_name: 'Müller Milchreis',
        nutriments: {
          energy_kcal_100g: 110,
          proteins_100g: 3.2,
          carbohydrates_100g: 18,
          fat_100g: 2.8
        }
      },
      {
        product_name: 'Coca-Cola',
        nutriments: {
          energy_kcal_100g: 42,
          proteins_100g: 0,
          carbohydrates_100g: 10.6,
          fat_100g: 0
        }
      },
      {
        product_name: 'Nutella',
        nutriments: {
          energy_kcal_100g: 539,
          proteins_100g: 6.3,
          carbohydrates_100g: 57.5,
          fat_100g: 30.9
        }
      }
    ];

    // Generate data for last 30 days
    for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      
      // Skip some days randomly to make it more realistic (80% chance of logging)
      if (Math.random() > 0.8) continue;

      // Generate 2-5 scans per day
      const scansPerDay = Math.floor(Math.random() * 4) + 2;
      
      for (let scanIndex = 0; scanIndex < scansPerDay; scanIndex++) {
        const isFood = Math.random() > 0.3; // 70% food, 30% barcode
        
        if (isFood) {
          const food = foodItems[Math.floor(Math.random() * foodItems.length)];
          const scanTime = new Date(date);
          scanTime.setHours(7 + (scanIndex * 4) + Math.floor(Math.random() * 3)); // Spread throughout day
          
          history.push({
            id: id++,
            type: 'food',
            timestamp: scanTime.toISOString(),
            time: this.formatTime(scanTime),
            image: `/api/placeholder/300/300`,
            data: {
              foods: [{
                name: food.name,
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fat: food.fats
              }],
              total: {
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fat: food.fats
              }
            }
          });
        } else {
          const product = barcodeProducts[Math.floor(Math.random() * barcodeProducts.length)];
          const scanTime = new Date(date);
          scanTime.setHours(7 + (scanIndex * 4) + Math.floor(Math.random() * 3));
          
          history.push({
            id: id++,
            type: 'barcode',
            timestamp: scanTime.toISOString(),
            time: this.formatTime(scanTime),
            image: `/api/placeholder/300/300`,
            data: product
          });
        }
      }
    }

    // Sort by timestamp (newest first)
    return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Set up realistic streak data
  private static async setupMockStreak(): Promise<void> {
    try {
      // Create a realistic streak (15-25 days)
      const streakDays = Math.floor(Math.random() * 11) + 15; // 15-25 days
      const longestStreak = Math.max(streakDays, Math.floor(Math.random() * 20) + 25); // 25-45 days
      
      // Set streak to continue until today
      const today = new Date().toISOString().split('T')[0];
      
      await Storage.set('currentStreak', streakDays);
      await Storage.set('lastLoggedDate', today);
      await Storage.set('longestStreak', longestStreak);

      console.log(`🔥 Mock streak set: ${streakDays} days (longest: ${longestStreak})`);
    } catch (error) {
      console.error('Error setting up mock streak:', error);
    }
  }

  // Format time for display
  private static formatTime(date: Date): string {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Add to window for console access
if (typeof window !== 'undefined') {
  (window as any).MockData = MockDataManager;
}
