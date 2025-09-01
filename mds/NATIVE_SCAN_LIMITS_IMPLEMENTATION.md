# Native iOS Scan Limit Implementation

## Übersicht

Das Scan-Limit-System wurde vollständig in Swift implementiert und ist in das KaloriqBarcodeScanner Plugin integriert. Dies stellt sicher, dass die Limits korrekt auf nativer Ebene durchgesetzt werden, unabhängig von JavaScript.

## Architektur

### Swift-Komponenten

#### 1. ScanLimitManager.swift
- **Zweck**: Zentrale Verwaltung der täglichen Scan-Limits
- **Features**:
  - Tägliche Scan-Zählung mit automatischem Reset
  - Premium-Status-Management
  - UserDefaults-basierte Persistierung
  - Scan-Limit-Validierung

#### 2. CameraPlugin.swift (erweitert)
- **Neue Methoden**:
  - `canScan()` - Prüft Scan-Verfügbarkeit
  - `getScanUsage()` - Aktueller Verbrauch
  - `setPremiumStatus()` - Premium-Status setzen
  - `resetScanCount()` - Für Testing
- **Integration**: Scan-Recording bei erfolgreichem Barcode-Scan

#### 3. ScanViewController.swift (erweitert)
- **UI-Komponenten**: Scan-Limit-Anzeige für Free-User
- **Features**:
  - Live-Anzeige verbleibender Scans
  - Fortschrittsbalken mit Farbcodierung
  - Automatisches Ausblenden für Premium-User

### TypeScript/Vue Integration

#### 1. useBarcodeScanner.ts (erweitert)
- **Neue Funktionen**:
  - `checkScanLimit()` - Limit-Prüfung vor Scan
  - `getScanUsage()` - Aktueller Status abrufen
  - `setPremiumStatus()` - Premium-Status synchronisieren
- **Integration**: Automatische Limit-Prüfung vor Scanner-Start

#### 2. definitions.ts (erweitert)
- **Neue Interfaces**: `ScanUsageInfo` für Limit-Daten
- **Type Safety**: Vollständige TypeScript-Unterstützung

#### 3. premiumManager.ts (aktualisiert)
- **Native Sync**: Synchronisation mit Swift ScanLimitManager
- **RevenueCat Integration**: Automatisches Premium-Status-Update

## Scan-Limit-Konfiguration

### Free User Limits
```swift
private let FREE_DAILY_SCANS = 10
private let PREMIUM_DAILY_SCANS = 999999 // Unlimited
```

### Premium User
- Unbegrenzte Scans
- Keine UI-Anzeige der Limits
- Alle Features verfügbar

### Free User
- 10 Scans pro Tag
- Täglicher Reset um Mitternacht
- UI-Anzeige mit Fortschrittsbalken
- Farbcodierung: Grün (OK) → Orange (Warnung) → Rot (Kritisch)

## Datenfluss

### 1. Scan-Start
```
Vue App → useBarcodeScanner.startScanning()
       → checkScanLimit() 
       → Swift: ScanLimitManager.canScan()
       → Limit OK? → Scanner starten
       → Limit erreicht? → Fehler werfen
```

### 2. Erfolgreicher Scan
```
Swift: Barcode erkannt → ScanLimitManager.recordScan()
                     → JavaScript Callback
                     → Navigation zu Nutrition View
                     → UI-Update der Scan-Counts
```

### 3. Premium-Status-Update
```
RevenueCat Status Change → premiumManager.updatePremiumStatus()
                        → syncWithNativeScanLimits()
                        → Swift: ScanLimitManager.setPremiumStatus()
                        → UI-Update (Limits ausblenden)
```

## Testing

### Debug-Funktionen
- `resetScanCount()` - Zähler zurücksetzen
- Konsolen-Logging für alle Scan-Events
- UserDefaults-Keys für manuelle Inspektion

### Test-Scenarios
1. **Free User Limit**: 10 Scans → 11. Scan blockiert
2. **Premium Upgrade**: Limits sofort aufgehoben
3. **Täglicher Reset**: Neue Scans nach Mitternacht
4. **App-Neustart**: Persistierte Counts bleiben erhalten

## Error Handling

### Scan Limit Erreicht
```swift
call.reject("SCAN_LIMIT_REACHED", "Daily scan limit reached", nil, usageInfo)
```

### JavaScript Error Handling
```typescript
catch (error) {
  if (error.message?.includes('SCAN_LIMIT_REACHED')) {
    // Zeige Premium-Upgrade-Prompt
  }
}
```

## UI Components

### Native Swift UI
- **ScanViewController**: Live-Counter oben im Scanner
- **Responsive Design**: Automatisches Hide/Show
- **Accessibility**: VoiceOver-Support

### Vue.js Integration
- **HomeView**: Limit-Status vor Scanner-Start
- **PremiumBlocker**: Upgrade-Prompts bei Limit
- **Reactive Updates**: Live-Sync mit nativem Status

## Performance

### Optimierungen
- UserDefaults für schnelle Persistierung
- Minimale API-Calls zwischen Swift/JS
- UI-Updates nur bei Statusänderungen
- Lazy Loading von Premium-Checks

### Memory Management
- Weak References in Callbacks
- Automatic Cleanup bei View Dismissal
- Efficient UserDefaults-Zugriffe

## Deployment

### Produktionsbereit
- ✅ Swift-Implementation komplett
- ✅ TypeScript-Bindings
- ✅ Error Handling
- ✅ UI Integration
- ✅ RevenueCat-Sync

### Nächste Schritte
1. A/B Testing verschiedener Limits (5, 10, 15)
2. Analytics für Conversion-Tracking
3. Weitere Premium-Features
4. Push Notifications bei Limit-Erreichen

## Integration mit RevenueCat

Das System integriert sich nahtlos mit dem bestehenden RevenueCat-Setup:

1. **Premium-Status-Changes** werden automatisch an das native System weitergegeben
2. **Subscription-Expiry** wird korrekt gehandhabt
3. **Offline-Fähigkeit** durch lokale Caching der Premium-Status

Dies stellt sicher, dass die Scan-Limits auch bei schlechter Internetverbindung korrekt funktionieren.
