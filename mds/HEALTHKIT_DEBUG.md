# HealthKit Debugging Guide 🔍

## Problem: "HealthKit is not available on this device"

Das ist das häufigste Problem und hat meist eine einfache Ursache:

### ✅ Checkliste:

#### 1. **iOS Simulator vs. Echtes Gerät**
- ❌ **iOS Simulator**: HealthKit funktioniert NICHT im Simulator
- ✅ **Echtes iOS Gerät**: HealthKit funktioniert nur auf echten Geräten
- **Lösung**: Teste auf einem echten iPhone/iPad

#### 2. **HealthKit Capability in Xcode**
- Öffne `/Users/alexpolan/app/ios/App/App.xcworkspace` in Xcode
- Wähle das **App** Target (nicht Pods)
- Gehe zu **Signing & Capabilities**
- Stelle sicher, dass **HealthKit** Capability hinzugefügt ist
- ⚠️ **Wichtig**: **NICHT** "Clinical Health Records" aktivieren (nur für medizinische Apps)

#### 3. **Info.plist Permissions**
Überprüfe, dass diese Einträge in `ios/App/App/Info.plist` vorhanden sind:
```xml
<key>NSHealthShareUsageDescription</key>
<string>Kaloriq needs access to HealthKit to read your nutrition data and sync with your health profile.</string>
<key>NSHealthUpdateUsageDescription</key>
<string>Kaloriq needs access to HealthKit to write your nutrition data and keep your health profile up to date.</string>
```

#### 4. **Plugin Installation überprüfen**
```bash
cd /Users/alexpolan/app
npx cap sync ios
```

## 🐛 Debug Logs verstehen:

### Wenn du den iOS Simulator verwendest:
```
🩺 HealthKit Warning: Running in iOS Simulator - HealthKit is not available in the simulator
HealthKit is not available on this device
```
**Lösung**: Teste auf echtem Gerät

### Wenn HealthKit Capability fehlt:
```
🩺 HealthKit: Running on physical device, HealthKit available: false
HealthKit is not available on this device
```
**Lösung**: HealthKit Capability in Xcode hinzufügen

### Wenn alles korrekt ist:
```
🩺 Initializing HealthKit...
🩺 HealthKit available: true
🩺 Requesting HealthKit permissions...
🩺 HealthKit: Requesting permissions - Read: true, Write: true
🩺 HealthKit: Requesting authorization for 4 health types
🩺 HealthKit: Permission request completed - Success: true
✅ HealthKit initialized successfully
```

## 🔧 Manuelle Tests:

### 1. Debug Status ausführen
Füge das temporär in deine HomeView ein:
```typescript
// Temporärer Debug-Code
console.log('🔍 Starting HealthKit debug...')
await HealthKitService.debugStatus()
```

### 2. Platform Check
```typescript
import { Capacitor } from '@capacitor/core'
console.log('Platform:', Capacitor.getPlatform())
console.log('Is Native:', Capacitor.isNativePlatform())
```

### 3. Plugin Import Test
```typescript
try {
  const { HealthKit } = await import('kaloriq-health-kit')
  console.log('✅ Plugin imported successfully:', typeof HealthKit)
} catch (error) {
  console.error('❌ Plugin import failed:', error)
}
```

## 📱 iOS Gerät Setup:

1. **Build für echtes Gerät**:
   - In Xcode: Change Target von Simulator zu echtem Gerät
   - **Product → Build** oder `Cmd + B`
   - **Product → Run** oder `Cmd + R`

2. **Developer Profile**:
   - Stelle sicher, dass dein Apple Developer Account korrekt eingerichtet ist
   - Signiere die App mit deinem Team

3. **Gerät Trust**:
   - Auf dem iOS Gerät: **Settings → General → VPN & Device Management**
   - Vertraue deinem Developer Profile

## 🔄 Wenn immer noch Probleme:

1. **Clean Build**:
   ```bash
   cd /Users/alexpolan/app
   npx cap clean ios
   npx cap sync ios
   ```

2. **Xcode Clean**:
   - **Product → Clean Build Folder** (`Cmd + Shift + K`)

3. **Pod Cache leeren**:
   ```bash
   cd ios/App
   pod deintegrate
   pod install
   ```

4. **Plugin neu installieren**:
   ```bash
   npm uninstall kaloriq-health-kit
   npm install ./kaloriq-health-kit
   npx cap sync ios
   ```

## ✅ Erfolgreiche Integration:

Wenn alles funktioniert, solltest du folgende Logs sehen:
- Permissions Dialog erscheint beim ersten App-Start
- Nutrition Daten werden zu HealthKit synchronisiert
- Logs zeigen erfolgreiche Sync-Operationen

Das HealthKit Plugin ist vollständig und sollte auf echten iOS Geräten perfekt funktionieren! 🎉
