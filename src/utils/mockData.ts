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

      // Setup mock weight entries
      await this.setupMockWeightEntries();

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
      await Storage.remove('weightEntries');

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
    let id = 1000;

    // Realistic German meals with proper nutrition
    const breakfastItems = [
      { name: 'Haferflocken mit Banane', calories: 350, protein: 12, carbs: 65, fats: 8 },
      { name: 'Vollkornbrot mit Ei', calories: 280, protein: 18, carbs: 35, fats: 12 },
      { name: 'Griechischer Joghurt mit Beeren', calories: 220, protein: 20, carbs: 25, fats: 6 },
      { name: 'Müsli mit Milch', calories: 320, protein: 14, carbs: 55, fats: 9 },
      { name: 'Rührei mit Vollkorntoast', calories: 290, protein: 16, carbs: 30, fats: 14 }
    ];

    const lunchItems = [
      { name: 'Hähnchenbrust mit Reis', calories: 450, protein: 35, carbs: 45, fats: 12 },
      { name: 'Lachs mit Quinoa', calories: 480, protein: 32, carbs: 42, fats: 18 },
      { name: 'Linsensuppe', calories: 320, protein: 18, carbs: 48, fats: 6 },
      { name: 'Thunfisch Salat', calories: 380, protein: 28, carbs: 25, fats: 20 },
      { name: 'Pasta mit Hähnchen', calories: 520, protein: 28, carbs: 65, fats: 14 }
    ];

    const dinnerItems = [
      { name: 'Rind mit Gemüse', calories: 420, protein: 30, carbs: 35, fats: 16 },
      { name: 'Fisch mit Kartoffeln', calories: 380, protein: 26, carbs: 40, fats: 12 },
      { name: 'Gemüsecurry mit Reis', calories: 350, protein: 12, carbs: 58, fats: 10 },
      { name: 'Pute mit Süßkartoffel', calories: 400, protein: 32, carbs: 45, fats: 10 },
      { name: 'Tofu Pfanne', calories: 340, protein: 20, carbs: 35, fats: 15 }
    ];

    const snackItems = [
      { name: 'Mandeln (30g)', calories: 180, protein: 6, carbs: 6, fats: 15 },
      { name: 'Protein Shake', calories: 200, protein: 25, carbs: 8, fats: 4 },
      { name: 'Apfel mit Erdnussbutter', calories: 240, protein: 8, carbs: 28, fats: 12 },
      { name: 'Joghurt mit Nüssen', calories: 190, protein: 12, carbs: 15, fats: 10 },
      { name: 'Proteinriegel', calories: 220, protein: 20, carbs: 22, fats: 8 }
    ];

    const barcodeProducts = [
      {
        product_name: 'Müller Milchreis Zimt',
        nutriments: { energy_kcal_100g: 110, proteins_100g: 3.2, carbohydrates_100g: 18, fat_100g: 2.8 }
      },
      {
        product_name: 'Haribo Goldbären',
        nutriments: { energy_kcal_100g: 343, proteins_100g: 6.9, carbohydrates_100g: 77, fat_100g: 0.5 }
      },
      {
        product_name: 'Nutella',
        nutriments: { energy_kcal_100g: 539, proteins_100g: 6.3, carbohydrates_100g: 57.5, fat_100g: 30.9 }
      },
      {
        product_name: 'Coca-Cola',
        nutriments: { energy_kcal_100g: 42, proteins_100g: 0, carbohydrates_100g: 10.6, fat_100g: 0 }
      }
    ];

    // Generate data for last 30 days
    for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      
      // Skip some days randomly (85% chance of logging)
      if (Math.random() > 0.85) continue;

      // Determine if this is a low-calorie day (once per week)
      const isLowCalorieDay = daysAgo % 7 === 0;
      let dailyCalories = 0;
      let dailyProtein = 0;
      let dailyCarbs = 0;
      let dailyFats = 0;

      // Generate meals for the day
      const meals = [
        { items: breakfastItems, time: 7, name: 'Frühstück' },
        { items: lunchItems, time: 12, name: 'Mittagessen' },
        { items: dinnerItems, time: 19, name: 'Abendessen' },
        { items: snackItems, time: 15, name: 'Snack', optional: true }
      ];

      meals.forEach((meal) => {
        // Skip optional snack sometimes
        if (meal.optional && Math.random() > 0.7) return;

        const item = meal.items[Math.floor(Math.random() * meal.items.length)];
        
        // Scale portions for target calories
        const scale = isLowCalorieDay ? 0.8 : (0.9 + Math.random() * 0.4); // 0.8 for low days, 0.9-1.3 for normal
        
        const scaledItem = {
          name: item.name,
          calories: Math.round(item.calories * scale),
          protein: Math.round(item.protein * scale),
          carbs: Math.round(item.carbs * scale),
          fats: Math.round(item.fats * scale)
        };

        dailyCalories += scaledItem.calories;
        dailyProtein += scaledItem.protein;
        dailyCarbs += scaledItem.carbs;
        dailyFats += scaledItem.fats;

        const scanTime = new Date(date);
        scanTime.setHours(meal.time + Math.floor(Math.random() * 2)); // Add some variance
        scanTime.setMinutes(Math.floor(Math.random() * 60));

        // Add as food scan
        history.push({
          id: id++,
          type: 'food',
          timestamp: scanTime.toISOString(),
          time: this.formatTime(scanTime),
          image: `/api/placeholder/300/300`,
          data: {
            foods: [{
              name: scaledItem.name,
              calories: scaledItem.calories,
              protein: scaledItem.protein,
              carbs: scaledItem.carbs,
              fat: scaledItem.fats
            }],
            total: {
              calories: scaledItem.calories,
              protein: scaledItem.protein,
              carbs: scaledItem.carbs,
              fat: scaledItem.fats
            }
          }
        });

        // Sometimes add a barcode item too
        if (Math.random() > 0.85) {
          const product = barcodeProducts[Math.floor(Math.random() * barcodeProducts.length)];
          const barcodeTime = new Date(scanTime);
          barcodeTime.setMinutes(barcodeTime.getMinutes() + 30);
          
          history.push({
            id: id++,
            type: 'barcode',
            timestamp: barcodeTime.toISOString(),
            time: this.formatTime(barcodeTime),
            image: `/api/placeholder/300/300`,
            data: product
          });
        }
      });

      console.log(`Tag ${daysAgo}: ${Math.round(dailyCalories)} kcal, ${Math.round(dailyProtein)}g Protein, ${Math.round(dailyCarbs)}g Carbs, ${Math.round(dailyFats)}g Fette`);
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

  // Setup realistic mock weight entries for last 30 days
  private static async setupMockWeightEntries(): Promise<void> {
    try {
      const weightEntries: any[] = [];
      const now = new Date();
      
      // Starting weight with slight downward trend
      let currentWeight = 80 + Math.random() * 15; // 80-95kg starting weight
      const targetWeightLoss = 2 + Math.random() * 3; // 2-5kg total loss over 30 days
      const dailyLossRate = targetWeightLoss / 30;
      
      for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
        // Only log weight every 2-3 days (more realistic)
        if (Math.random() > 0.4) continue;
        
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);
        date.setHours(7 + Math.floor(Math.random() * 2)); // Morning weigh-ins
        
        // Add natural weight fluctuation
        const fluctuation = (Math.random() - 0.5) * 1.2; // ±0.6kg daily fluctuation
        const trendWeight = currentWeight - (dailyLossRate * (29 - daysAgo));
        const loggedWeight = Math.round((trendWeight + fluctuation) * 10) / 10; // Round to 1 decimal
        
        weightEntries.push({
          weight: Math.max(loggedWeight, currentWeight - targetWeightLoss), // Don't go below target
          date: date.toISOString().split('T')[0], // YYYY-MM-DD format
          timestamp: date.getTime(),
          note: daysAgo === 29 ? 'Startgewicht' : undefined
        });
      }
      
      // Sort by timestamp (newest first)
      weightEntries.sort((a, b) => b.timestamp - a.timestamp);
      
      console.log(`Generated ${weightEntries.length} weight entries`);
      await Storage.set('weightEntries', weightEntries);
    } catch (error) {
      console.error('Error setting up mock weight entries:', error);
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
