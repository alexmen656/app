# Kaloriq HealthKit Plugin

Ein Capacitor Plugin für die Integration von Apple HealthKit in die Kaloriq Kalorie-Tracking App.

## Installation

```bash
npm install kaloriq-health-kit
npx cap sync ios
```

## iOS Setup

### 1. HealthKit Capability hinzufügen

In Xcode, gehe zu deinem App Target → Signing & Capabilities → + Capability → HealthKit

### 2. Info.plist konfigurieren

Füge diese Entries zu deiner `ios/App/App/Info.plist` hinzu:

```xml
<key>NSHealthShareUsageDescription</key>
<string>This app needs access to HealthKit to read your nutrition data</string>
<key>NSHealthUpdateUsageDescription</key>
<string>This app needs access to HealthKit to write your nutrition data</string>
```

## Verwendung

```typescript
import { HealthKit } from 'kaloriq-health-kit';

// Überprüfen ob HealthKit verfügbar ist
const { available } = await HealthKit.isAvailable();

if (available) {
  // Berechtigungen anfordern
  const { granted } = await HealthKit.requestHealthKitPermissions({
    read: true,
    write: true
  });

  if (granted) {
    // Nutrition Daten schreiben
    await HealthKit.writeNutritionData({
      calories: 500,
      protein: 25,
      carbs: 60,
      fat: 20,
      date: new Date().toISOString()
    });

    // Nutrition Daten für heute lesen
    const todayData = await HealthKit.readNutritionData({
      date: new Date().toISOString().split('T')[0]
    });

    // Nutrition Daten für einen Zeitraum lesen
    const rangeData = await HealthKit.readNutritionDataRange({
      startDate: '2025-08-01',
      endDate: '2025-08-25'
    });
  }
}
```

## API

### `isAvailable()`
Überprüft, ob HealthKit auf dem Gerät verfügbar ist.

**Returns:** `Promise<{ available: boolean }>`

### `requestHealthKitPermissions(options)`
Fordert HealthKit Berechtigungen an.

**Parameters:**
- `options.read` (boolean, optional): Leseberechtigung anfordern
- `options.write` (boolean, optional): Schreibberechtigung anfordern

**Returns:** `Promise<{ granted: boolean }>`

### `writeNutritionData(data)`
Schreibt Nutrition Daten in HealthKit.

**Parameters:**
- `data.calories` (number, optional): Kalorien in kcal
- `data.protein` (number, optional): Protein in Gramm
- `data.carbs` (number, optional): Kohlenhydrate in Gramm
- `data.fat` (number, optional): Fett in Gramm
- `data.date` (string, optional): ISO Date String (Standard: heute)

**Returns:** `Promise<{ success: boolean }>`

### `readNutritionData(options)`
Liest Nutrition Daten für einen bestimmten Tag.

**Parameters:**
- `options.date` (string): ISO Date String (YYYY-MM-DD)

**Returns:** `Promise<HealthData>`

### `readNutritionDataRange(options)`
Liest Nutrition Daten für einen Zeitraum.

**Parameters:**
- `options.startDate` (string): Start-Datum (YYYY-MM-DD)
- `options.endDate` (string): End-Datum (YYYY-MM-DD)

**Returns:** `Promise<{ data: HealthData[] }>`

## Types

```typescript
interface HealthData {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  date?: string;
}
```

## Supported Platforms

- ✅ iOS (HealthKit)
- ❌ Android (Google Fit Support geplant)
- ❌ Web (Nicht verfügbar)

## License

MIT
