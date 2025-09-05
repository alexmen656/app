# Analytics Store Implementation

## Übersicht

Das neue Analytics Store System verbessert die Performance der App durch intelligentes Caching von Analytics-Daten.

## Wie es funktioniert

### Store (`/src/stores/analyticsStore.ts`)
- **Reaktiver Store**: Verwendet Vue 3's reactive API
- **Automatisches Caching**: Daten werden 5 Minuten gecacht
- **Intelligentes Laden**: Überprüft Cache-Gültigkeit vor neuen API-Aufrufen
- **Fehlerbehandlung**: Robuste Fehlerbehandlung mit Store-State

### App-Initialisierung (`/src/App.vue`)
- Lädt Analytics-Daten beim App-Start vor
- Reduziert Wartezeiten beim ersten Besuch der Analytics-Seite

### Analytics View (`/src/views/AnalyticsView.vue`)
- Verwendet gecachte Daten sofort wenn verfügbar
- Lädt nur neue Daten wenn Cache abgelaufen ist
- Nahtlose User Experience ohne sichtbare Ladezeiten

## Vorteile

1. **Reduzierte Wartezeiten**: Sofortige Anzeige von gecachten Daten
2. **Weniger API-Aufrufe**: Daten werden nur bei Bedarf neu geladen
3. **Bessere Performance**: Schnellere Navigation zwischen Zeiträumen
4. **Konsistente Daten**: Zentraler Store sorgt für einheitliche Daten-States

## Cache-Verhalten

- **Cache-Dauer**: 5 Minuten
- **Cache-Schlüssel**: Zeitraum (week/month/year)
- **Automatische Invalidierung**: Bei Zeitraum-Wechsel oder manueller Aktualisierung
- **Fallback**: Bei Cache-Miss wird automatisch neu geladen

## API

```typescript
// Store actions
analyticsActions.loadAnalyticsData(period) // Lädt mit Cache
analyticsActions.refreshAnalyticsData(period) // Erzwingt Neuladen

// Store state
analyticsStore.data // Aktuelle Daten
analyticsStore.isLoading // Loading-State
analyticsStore.error // Fehlerstatus
analyticsStore.lastUpdated // Letztes Update-Timestamp
```

## Zukünftige Erweiterungen

- Pull-to-refresh Funktionalität
- Offline-Caching mit localStorage
- Granulareres Caching pro Datentyp
- Background-Updates
