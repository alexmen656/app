# HealthKit Setup für Kaloriq - Manuelle Schritte in Xcode

Das HealthKit Plugin wurde erfolgreich erstellt und installiert! Du musst jedoch noch einige manuelle Schritte in Xcode durchführen:

## 🚀 Plugin erfolgreich erstellt!

- ✅ **TypeScript Interface** definiert (`definitions.ts`)
- ✅ **iOS Swift Implementation** mit vollständiger HealthKit Integration (`Plugin.swift`)
- ✅ **Web Fallback** implementiert (`web.ts`)
- ✅ **Podspec** mit HealthKit Framework konfiguriert
- ✅ **Plugin in App installiert** und synchronisiert
- ✅ **Service Klasse** für einfache Verwendung erstellt
- ✅ **Vue Composable** für reaktive Integration erstellt
- ✅ **Info.plist** mit HealthKit Permissions aktualisiert

## 📱 Manuelle Schritte in Xcode (WICHTIG!)

### 1. HealthKit Capability hinzufügen

1. Öffne `/Users/alexpolan/app/ios/App/App.xcworkspace` in Xcode
2. Wähle dein **App** Target aus (nicht das Pod Projekt)
3. Gehe zu **Signing & Capabilities**
4. Klicke auf **+ Capability**
5. Suche nach **HealthKit** und füge es hinzu
6. Stelle sicher, dass **"Clinical Health Records"** **NICHT** aktiviert ist (nur für medizinische Apps)

### 2. Build und Test

1. Baue das Projekt in Xcode (`Cmd + B`)
2. Teste auf einem echten iOS Gerät (HealthKit funktioniert nicht im Simulator)

## 📋 Plugin API Übersicht

### Verfügbare Methoden:

```typescript
// Plugin verfügbar prüfen
const { available } = await HealthKit.isAvailable();

// Permissions anfordern
const { granted } = await HealthKit.requestHealthKitPermissions({
  read: true,
  write: true
});

// Nutrition Daten schreiben
await HealthKit.writeNutritionData({
  calories: 500,
  protein: 25,
  carbs: 60,
  fat: 20,
  date: new Date().toISOString()
});

// Daten für heute lesen
const todayData = await HealthKit.readNutritionData({
  date: new Date().toISOString().split('T')[0]
});

// Daten für Zeitraum lesen
const rangeData = await HealthKit.readNutritionDataRange({
  startDate: '2025-08-01',
  endDate: '2025-08-25'
});
```

### Service Integration (bereits implementiert):

```typescript
// In HomeView.vue bereits integriert:
import { HealthKitService } from '../services/healthkit'

// Automatische Synchronisation bei jedem Scan
await HealthKitService.syncTodaysData()
```

## 🎯 Was das Plugin kann:

1. **Automatische Synchronisation**: Jedes Mal wenn du Food/Barcode scannst, werden die Daten automatisch zu HealthKit synchronisiert
2. **Nutrition Tracking**: Kalorien, Protein, Kohlenhydrate und Fett werden geschrieben
3. **Daten Lesen**: Du kannst auch Daten aus HealthKit lesen (falls der User Daten von anderen Apps hat)
4. **Datum-spezifisch**: Daten werden korrekt dem jeweiligen Tag zugeordnet
5. **Fehler-Behandlung**: Robuste Fehlerbehandlung und Fallbacks

## ⚠️ Wichtige Hinweise:

- **HealthKit funktioniert nur auf echten iOS Geräten**, nicht im Simulator
- **Permissions** werden beim ersten App-Start angefordert
- **Daten sind privat** und werden lokal auf dem Gerät gespeichert
- **Apple Review**: HealthKit Apps werden strenger reviewt, stelle sicher dass die Usage Descriptions klar sind

## 🔧 Troubleshooting:

1. **Plugin nicht gefunden**: Stelle sicher dass `npx cap sync ios` erfolgreich war
2. **HealthKit Capability fehlt**: Füge sie manuell in Xcode hinzu (siehe oben)
3. **Permissions nicht erhalten**: Überprüfe die Info.plist Einträge
4. **Build Fehler**: Reinige das Projekt (`Product → Clean Build Folder`)

Das HealthKit Plugin ist nun vollständig einsatzbereit! 🎉
