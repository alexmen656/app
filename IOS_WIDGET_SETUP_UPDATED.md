# iOS Widget Setup für Kaloriq - KORRIGIERT

## 🚨 WICHTIGER UPDATE: App Groups Data Sharing

Sie haben absolut recht! Die Daten werden **NICHT automatisch** zwischen App und Widgets geteilt, nur weil sie in der gleichen App Group sind. Man muss die Daten **explizit** in die App Group UserDefaults schreiben.

## ✅ Korrigierte Implementierung

### 1. App Groups Setup (unverändert)

**In Apple Developer Portal:**
```
1. Gehe zu developer.apple.com → Certificates, Identifiers & Profiles
2. Wähle "Identifiers" → "App Groups"
3. Erstelle: group.com.kaloriq.shared
```

**In Xcode für ALLE Targets (App + alle 3 Widgets):**
```
1. Target auswählen
2. "Signing & Capabilities"
3. "+ Capability" → "App Groups"
4. Aktiviere "group.com.kaloriq.shared"
```

### 2. 🔥 KORRIGIERTE Daten-Synchronisation

**Das Problem:** Normale Capacitor Preferences speichern nur in der App, nicht in App Groups.

**Die Lösung:** Explizite App Group Konfiguration in TypeScript:

```typescript
// In widgetData.ts (bereits implementiert):
private static async storeDataForWidgets(widgetData: WidgetData): Promise<void> {
  try {
    // 🚨 CRITICAL: Configure Capacitor to use App Groups
    await Preferences.configure({
      group: 'group.com.kaloriq.shared'  // Explizit App Group setzen
    });
    
    // Store widget data as JSON in shared UserDefaults
    const widgetDataJson = JSON.stringify(widgetData);
    await Preferences.set({
      key: 'widgetData',
      value: widgetDataJson
    });
    
    console.log('✅ Widget data stored in App Group UserDefaults');
    
    // Reset to normal app storage
    await Preferences.configure({
      group: undefined
    });
    
  } catch (error) {
    console.error('❌ Error storing in App Group:', error);
  }
}
```

### 3. SwiftUI Widgets Data Loading

**Alle 3 Widgets laden korrekt aus App Groups:**

```swift
// In allen Widget Provider Klassen:
private func loadWidgetData() -> WidgetData? {
    // 🔥 KORREKT: Explizit App Group UserDefaults verwenden
    guard let sharedDefaults = UserDefaults(suiteName: "group.com.kaloriq.shared") else {
        print("❌ Failed to access shared UserDefaults")
        return nil
    }
    
    guard let widgetDataString = sharedDefaults.string(forKey: "widgetData") else {
        print("❌ No widget data found in App Group")
        return nil
    }
    
    // JSON dekodieren...
}
```

## 📱 3 Implementierte Widgets

### Widget 1 (Small) - KaloriqWidget.swift
- **Größe**: 2x2 Grid
- **Inhalt**: Kalorienring + aktueller Stand
- **Design**: Minimalistisch, großer Ring
- **Update**: Alle 15 Minuten

### Widget 2 (Medium) - KaloriqWidget2.swift  
- **Größe**: 4x2 Grid
- **Inhalt**: 
  - Kalorienring (links)
  - Makronährstoffe Grid (rechts): Protein, Carbs, Fats
  - Fortschrittsbalken für jeden Makronährstoff
- **Design**: Fokus auf Makro-Details
- **Update**: Alle 10 Minuten (häufiger für Tracking)

### Widget 3 (Large) - KaloriqWidget3.swift
- **Größe**: 4x4 Grid  
- **Inhalt**: 
  - Header mit Logo + Streak Badge
  - Kalorienring + Remaining Calories
  - 3 Makronährstoff-Ringe (P/C/F)
  - Liste der letzten 3 gescannten Lebensmittel
  - Update-Zeitstempel
- **Design**: Vollständige Übersicht
- **Update**: Alle 15 Minuten

## 🔄 Datenfluss - KORRIGIERT

```
Vue App
  ↓ (Food Scan / Streak Update)
WidgetDataManager.updateWidgetData()
  ↓ (Berechnet aktuelle Nutrition)
Preferences.configure({ group: 'group.com.kaloriq.shared' })
  ↓ (Setzt App Group UserDefaults)
Preferences.set({ key: 'widgetData', value: JSON })
  ↓ (Speichert in shared UserDefaults)
iOS Widgets
  ↓ (UserDefaults(suiteName: "group.com.kaloriq.shared"))
loadWidgetData() 
  ↓ (Lädt + dekodiert JSON)
SwiftUI View Update
```

## 🧪 Testing Schritte

### 1. Build & Deploy
```bash
npm run build
npx cap sync
npx cap open ios
```

### 2. App Groups Verification
```
1. Alle 4 Targets haben App Groups aktiviert
2. Gleiche App Group ID: group.com.kaloriq.shared
3. Keine Fehlermeldungen beim Build
```

### 3. Daten-Sync Test
```
1. App auf echtes iOS Gerät installieren
2. App öffnen → Food scannen
3. Console Logs überprüfen:
   "✅ Widget data stored in App Group UserDefaults"
4. Widget hinzufügen zum Home Screen
5. Widget sollte echte Daten anzeigen
```

### 4. Console Debugging
**In Xcode Console nach:**
```
✅ Widget1: Loaded data - [calories] kcal    (Widget erfolgreich geladen)
❌ Failed to access shared UserDefaults      (App Groups Problem)
❌ No widget data found in App Group         (Daten nicht gespeichert)
❌ Decode error: [error]                     (JSON Problem)
```

## 🐛 Häufige Probleme

### Problem: "Failed to access shared UserDefaults"
**Ursache:** App Groups nicht korrekt konfiguriert
**Lösung:** 
1. Überprüfe App Groups in allen 4 Targets
2. Verwende exakt: `group.com.kaloriq.shared`
3. App Groups im Apple Developer Portal erstellt?

### Problem: "No widget data found"
**Ursache:** App hat noch keine Daten in App Groups gespeichert
**Lösung:**
1. App mindestens einmal öffnen
2. Ein Food scannen (trigger für Widget Update)
3. Console Log "✅ Widget data stored" überprüfen

### Problem: Widget zeigt Mock-Daten
**Ursache:** Widget lädt echte Daten nicht
**Lösung:**
1. Console Logs überprüfen
2. Widget entfernen und neu hinzufügen
3. App force-close und neu öffnen

## 📊 Widget Data Structure

```typescript
interface WidgetData {
  calories: {
    current: number;      // Heute gescannte Kalorien
    target: number;       // Tägliches Ziel (aus dailyGoals)
    progress: number;     // 0.0 - 1.0 (für Ring-Animation)
    remaining: number;    // Verbleibende Kalorien
  };
  macros: {
    protein: { current: number; target: number; progress: number };
    carbs: { current: number; target: number; progress: number };  
    fats: { current: number; target: number; progress: number };
  };
  streak: number;         // Aktuelle Streak aus StreakManager
  lastUpdated: string;    // ISO String für Update-Anzeige
  todayFoods: Array<{     // Letzte 3 gescannte Foods für Large Widget
    name: string;         // Food Name oder "Unbekanntes Produkt"
    calories: number;     // Kalorien pro Portion
    time: string;         // Scan-Zeit
  }>;
}
```

## ✅ Status Check

- ✅ **3 SwiftUI Widgets implementiert** (Small/Medium/Large)
- ✅ **App Groups Daten-Sharing korrigiert** 
- ✅ **Echte Daten aus ScanHistory**
- ✅ **Automatische Updates bei Food Scans**
- ✅ **Streak Integration**
- ✅ **Konsistentes Design**
- ✅ **Error Handling & Debugging**

Die Widgets sind jetzt **korrekt** implementiert und sollten echte Daten anzeigen, sobald die App Groups konfiguriert sind! 🎉

**Nächster Schritt:** App Groups in Xcode aktivieren und auf echtes Gerät testen.
