# KalBuddy Website

Eine professionelle Landing Page für die KalBuddy App - eine intelligente Kalorienverfolgungsapp mit AI-Fooderkennung und Barcode-Scanner.

## Features

- **Responsives Design**: Optimiert für Desktop, Tablet und Mobile
- **Moderne Ästhetik**: Clean und professionell im Stil der App
- **Performance-optimiert**: Lazy Loading, optimierte Assets
- **Interaktive Elemente**: Smooth Scrolling, Animationen
- **App Store Integration**: Download-Links für iOS und Android
- **Demo-Funktionalität**: Video-Demo der App-Features

## Technologien

- **HTML5**: Semantische Struktur
- **CSS3**: Modern CSS mit Custom Properties, Grid, Flexbox
- **Vanilla JavaScript**: Keine Abhängigkeiten, optimierte Performance
- **Responsive Design**: Mobile-first Ansatz
- **Web Animations**: CSS und JavaScript Animationen

## Struktur

```
website/
├── index.html          # Haupt-HTML-Datei
├── style.css           # Stylesheet mit allen Styles
├── script.js           # JavaScript für Interaktivität
└── README.md          # Diese Dokumentation
```

## Inhalte

### Hero Section
- Haupttitel mit Brand-Akzent
- Call-to-Action Buttons (Download, Demo)
- Statistiken (Nutzer, Rating, Scans)
- Animierte Phone-Mockup mit App-Preview

### Features Section
- 6 Hauptfeatures mit Icons und Beschreibungen
- Hover-Effekte und Animationen
- Grid-Layout für optimale Darstellung

### How it Works
- 3-Schritt Anleitung
- Visuelle Schritt-für-Schritt Darstellung
- Leicht verständliche Erklärungen

### Download Section
- App Store und Google Play Buttons
- Phone-Mockups mit App-Screenshots
- Feature-Liste mit Checkmarks

### Footer
- Links zu wichtigen Seiten
- Social Media Links
- Copyright und rechtliche Informationen

## Anpassungen

### App Store Links
Ersetzen Sie in `script.js` die Platzhalter-URLs durch echte App Store Links:

```javascript
// App Store URL
window.open('https://apps.apple.com/app/your-actual-app-id', '_blank');

// Google Play URL
window.open('https://play.google.com/store/apps/details?id=your.actual.package.name', '_blank');
```

### Analytics
Integration von Analytics-Services in `script.js`:

```javascript
function trackEvent(eventName, properties = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Mixpanel
    if (typeof mixpanel !== 'undefined') {
        mixpanel.track(eventName, properties);
    }
}
```

### Demo Video
Fügen Sie ein Demo-Video hinzu, indem Sie `demo-video.mp4` in den website-Ordner legen.

## Deployment

### Statisches Hosting
Die Website kann auf jeder statischen Hosting-Plattform deployed werden:

- **Netlify**: Einfach den `website/` Ordner hochladen
- **Vercel**: GitHub-Repository verbinden
- **GitHub Pages**: Repository in GitHub Pages aktivieren

### Domain Setup
1. Domain bei einem Provider registrieren
2. DNS zu Hosting-Provider weiterleiten
3. SSL-Zertifikat aktivieren

## SEO Optimierungen

- Meta Tags für Social Media (Open Graph)
- Strukturierte Daten
- Optimierte Ladezeiten
- Mobile-First Design
- Semantisches HTML

## Performance

- Minifizierte CSS und JavaScript für Production
- Optimierte Bilder (WebP Format empfohlen)
- Lazy Loading für Bilder
- Minimale externe Abhängigkeiten

## Browser-Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 6+)

## Accessibility

- Semantisches HTML
- ARIA Labels
- Keyboard Navigation
- Screen Reader Support
- Ausreichende Farbkontraste

## Customization

### Farben
Passen Sie die CSS Custom Properties in `style.css` an:

```css
:root {
    --primary-color: #007052;
    --primary-dark: #005238;
    --primary-light: #00a86b;
    /* ... weitere Farben */
}
```

### Schriftarten
Ändern Sie die Schriftart in `style.css`:

```css
body {
    font-family: 'Ihre-Schriftart', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

## Lizenz

© 2025 KalBuddy. Alle Rechte vorbehalten.
