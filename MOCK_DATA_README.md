# 📦 Mock Data System für App Store Screenshots

Dieses System ermöglicht es dir, realistische Test-Daten für die letzten 30 Tage zu generieren, damit du perfekte Screenshots für den App Store machen kannst.

## 🚀 Schnelle Aktivierung

### 1. Mock-Daten aktivieren
```typescript
// In src/utils/mockData.ts, Zeile 8:
private static readonly MOCK_DATA_ENABLED = true; // Set to true for screenshots
```

### 2. App neu starten
Die Mock-Daten werden automatisch beim App-Start geladen, wenn `MOCK_DATA_ENABLED = true` ist.

### 3. Screenshots machen
- **Home View**: Zeigt realistischen Fortschritt und Recent Foods
- **Analytics View**: Zeigt 30 Tage Daten mit Trends
- **Streak**: Zeigt 15-25 Tage Streak
- Alle Daten sind realistisch und deutsch

### 4. Deaktivieren nach Screenshots
```typescript
// In src/utils/mockData.ts, Zeile 8:
private static readonly MOCK_DATA_ENABLED = false; // Disable after screenshots
```

## 🛠️ Debug Controls (für Entwicklung)

Aktiviere Debug-Modus:
```javascript
// In Browser Console:
localStorage.setItem('enableDebug', 'true')
// Dann App neu laden
```

In den Settings → Debug Sektion findest du dann:
- **Mock Data Status**: Zeigt ob aktiviert/installiert
- **📦 Install Mock Data**: Installiert Mock-Daten manuell
- **🗑️ Remove Mock Data**: Entfernt Mock-Daten
- **Mock Streak**: Zeigt aktueller Mock-Streak

## 📊 Was wird generiert

### Scan History (letzten 30 Tage)
- 2-5 Scans pro Tag (80% der Tage haben Daten)
- Mix aus Food-Scans und Barcode-Scans
- Realistische deutsche Lebensmittel
- Verteilung über den Tag (Frühstück, Mittag, Snacks, Abendessen)

### Streak Data
- 15-25 Tage aktueller Streak
- 25-45 Tage längster Streak
- Automatisch auf "heute" gesetzt

### Nutrition Daten
- Realistische Kalorienwerte (1800-2500 kcal/Tag)
- Ausgewogene Makros
- Verschiedene Lebensmittel-Kategorien

## 📱 Perfekte Screenshots

### Empfohlene Reihenfolge:
1. **Home View**: Zeigt Daily Progress und Recent Foods
2. **Analytics → Weekly**: Zeigt Wochentrends
3. **Analytics → Monthly**: Zeigt 30-Tage-Trends
4. **Streak View**: Zeigt Streak-Statistiken
5. **Settings**: Zeigt App-Features

### Pro-Tipps:
- Mock-Daten sind auf deutsche Nutzer optimiert
- Alle Zeitstempel sind realistisch verteilt
- Nutrition-Werte entsprechen echten Lebensmitteln
- Streak ist lang genug für beeindruckende Screenshots

## 🔧 Console Helper

Du kannst auch direkt in der Browser Console arbeiten:
```javascript
// Mock-Daten Status prüfen
await MockData.getStatus()

// Mock-Daten installieren
await MockData.installMockData()

// Mock-Daten entfernen
await MockData.removeMockData()

// Toggle (ein/ausschalten)
await MockData.toggle()
```

## ⚠️ Wichtige Hinweise

1. **Vor App Store Build**: Immer `MOCK_DATA_ENABLED = false` setzen!
2. **Git Commit**: Nicht die aktivierten Mock-Daten committen
3. **Production**: System ist automatisch deaktiviert in Production builds
4. **Daten-Sicherheit**: Mock-Daten überschreiben echte Daten (mit Warnung)

## 🎯 Verwendung für Screenshots

1. `MOCK_DATA_ENABLED = true` setzen
2. App starten → automatisch 30 Tage Mock-Daten
3. Screenshots in verschiedenen Views machen
4. `MOCK_DATA_ENABLED = false` setzen
5. App neu starten → echte Daten wieder da

Das System ist komplett reversibel und sicher! 🚀
