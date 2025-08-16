# CalAI - Calorie Tracking App

Eine moderne Vue.js + Capacitor App zum Kalorienzählen mit KI-gestützter Nahrungsmittelerkennung.

## Features

### 🏠 Home View
- Tägliche Kalorienübersicht mit verbleibenden Kalorien
- Makronährstoff-Tracking (Proteine, Kohlenhydrate, Fette)
- Interaktive Progress Rings
- Kürzlich hinzugefügte Nahrungsmittel
- Professionelles, dunkles Design

### 📱 Scan View  
- **Foto-Scan**: Fotografieren Sie Ihr Essen für KI-Analyse
- **Barcode-Scanner**: Scannen Sie Produktbarcodes
- Portionsgrößen-Anpassung
- Nährwert-Anzeige nach dem Scannen
- Kürzlich gescannte Artikel

### 🎨 Design
- Clean und professionelles Interface
- Dunkles Theme mit Glasmorphismus-Effekten
- Responsive Design für alle Bildschirmgrößen
- Smooth Animationen und Übergänge

## Tech Stack

- **Vue.js 3** mit TypeScript
- **Vite** als Build-Tool
- **Capacitor** für Mobile App Entwicklung
- **Vue Router** für Navigation
- **CSS3** mit modernen Features

## Installation

1. Dependencies installieren:
```bash
npm install
```

2. Entwicklungsserver starten:
```bash
npm run dev
```

3. App für Mobile vorbereiten:
```bash
npm run build
npx cap add ios
npx cap add android
```

4. Mobile Platforms synchronisieren:
```bash
npx cap sync
```

5. In nativer IDE öffnen:
```bash
npx cap open ios
npx cap open android
```

## Entwicklung

### Verfügbare Scripts

- `npm run dev` - Entwicklungsserver
- `npm run build` - Production Build
- `npm run preview` - Preview des Builds
- `npx cap sync` - Synchronisiert Web-Assets mit nativen Plattformen
- `npx cap run ios` - Build und Run auf iOS
- `npx cap run android` - Build und Run auf Android

### Projektstruktur

```
src/
├── views/           # Hauptansichten
│   ├── HomeView.vue # Kalorie-Dashboard
│   └── ScanView.vue # Scan-Funktionalität
├── router/          # Vue Router Konfiguration
├── components/      # Wiederverwendbare Komponenten
└── assets/          # Statische Assets
```

## Features in Entwicklung

- [ ] KI-Integration für Bilderkennung
- [ ] Barcode-Datenbank Integration
- [ ] Benutzer-Profile und Ziele
- [ ] Historische Daten und Analytics
- [ ] Cloud-Synchronisation
- [ ] Offline-Funktionalität

## Permissions

Die App benötigt folgende Berechtigungen:
- **Kamera**: Für Foto-Scans und Barcode-Scanning
- **Speicher**: Für das Speichern von Bildern (optional)

## Browser Support

- Chrome/Safari (mobile)
- iOS Safari
- Android Chrome

## Lizenz

MIT License
