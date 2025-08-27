# 📱 iOS Widget Setup Anleitung

## ✅ Schritt 1: App Groups konfigurieren

### In Xcode:

1. **Main App Target**:
   - Wählen Sie Ihr App-Target
   - Gehen Sie zu "Signing & Capabilities"
   - Klicken Sie auf "+ Capability"
   - Fügen Sie "App Groups" hinzu
   - Erstellen Sie Gruppe: `group.com.kaloriq.shared`

2. **Widget Extension Target**:
   - Wählen Sie das "KaloriqWidget" Target
   - Gehen Sie zu "Signing & Capabilities"  
   - Klicken Sie auf "+ Capability"
   - Fügen Sie "App Groups" hinzu
   - Wählen Sie dieselbe Gruppe: `group.com.kaloriq.shared`

## ✅ Schritt 2: Capacitor synchronisieren

```bash
cd /Users/alexpolan/app
npx cap sync ios
```

## ✅ Schritt 3: Widget Features

### 🔥 **Small Widget** (Calorie Ring)
- Zeigt aktuellen Kalorienverbrauch
- Weißer Fortschrittsring
- Flame-Icon in der Mitte
- "X von Y kcal" Anzeige

### 📊 **Medium Widget** (Macros Overview)
- Haupt-Kalorienring links
- 3 Makro-Ringe rechts (P/C/F)
- Farbkodiert: Protein (rot), Carbs (orange), Fats (blau)
- Kompakte Nährwert-Übersicht

### 📈 **Large Widget** (Complete Overview)
- Vollständige Tagesübersicht
- Kaloriq-Logo mit Branding
- Streak-Anzeige mit Flame-Icon
- Haupt-Kalorienring + Makro-Spalten
- Liste der letzten 3 Lebensmittel
- "Recent" Sektion mit Kalorien

## ✅ Schritt 4: Datenfluss

### App → Widget:
1. Nutzer scannt Essen in der App
2. `WidgetDataManager.updateWidgetData()` wird aufgerufen
3. Daten werden in Capacitor Preferences mit `group.com.kaloriq.shared` gespeichert
4. Widget liest Daten aus der geteilten UserDefaults

### Widget Datenstruktur:
```json
{
  "calories": {
    "current": 1800,
    "target": 2500, 
    "progress": 0.72,
    "remaining": 700
  },
  "macros": {
    "protein": { "current": 120, "target": 150, "progress": 0.8 },
    "carbs": { "current": 180, "target": 300, "progress": 0.6 },
    "fats": { "current": 60, "target": 80, "progress": 0.75 }
  },
  "streak": 15,
  "lastUpdated": "2025-08-18T12:00:00Z",
  "todayFoods": [
    { "name": "Chicken Breast", "calories": 350, "time": "12:30" }
  ]
}
```

## ✅ Schritt 5: Design Features

### 🎨 Dark Theme:
- Gradient: `#1e1e2e` → `#2a2d37`
- Weiße Ringe und Text
- Transparente Hintergründe
- Konsistent mit App-Design

### 🌈 Farbschema:
- **Kaloriq Grün**: `#007052` (für Logo)
- **Flame Orange**: `#ff6b35` (für Streak)
- **Protein Rot**: `#ff6b6b` 
- **Carbs Orange**: `#ffa726`
- **Fats Blau**: `#42a5f5`

### ⚡ Animationen:
- Sanfte Ring-Animationen beim Laden
- 1 Sekunde `easeInOut` Transition
- Fortschritts-Updates in Echtzeit

## ✅ Schritt 6: Testing

### Nach dem Setup:
1. **Build** das Projekt in Xcode
2. **Installieren** auf dem iPhone
3. **Widgets hinzufügen**:
   - Home Screen lang drücken
   - "+" in der oberen linken Ecke
   - "Kaloriq" suchen
   - Alle 3 Größen testen

4. **Daten testen**:
   - Essen in der App scannen
   - Widget sollte sich automatisch aktualisieren
   - Alle 3 Widget-Größen prüfen

## ✅ Schritt 7: Update-Frequenz

- **Automatisch**: Alle 15 Minuten
- **On-Demand**: Beim App-Öffnen  
- **Real-time**: Nach jedem Scan in der App

## 🚀 Live Features

- ✅ Echte Kalorien-Daten aus Scans
- ✅ Live Makronährstoff-Verfolgung
- ✅ Aktuelle Streak-Anzeige
- ✅ Letzte Lebensmittel-Liste
- ✅ Fortschritts-Animationen
- ✅ Dark Theme Design
- ✅ 3 Widget-Größen

Die Widgets sind jetzt vollständig implementiert mit:
- **Real-time Daten** aus der Vue.js App
- **Native iOS Design** mit SwiftUI
- **Shared App Group** für Daten-Synchronisation
- **Professional Animations** und Farbschema

Viel Erfolg beim Testing! 🎉
