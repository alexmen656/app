# KalBuddy - Calorie Tracking App

A modern Vue.js + Capacitor app for calorie tracking with AI-powered food recognition and barcode scanning.

## Features

### Home View
- Daily calorie overview with remaining calories
- Macronutrient tracking (Proteins, Carbohydrates, Fats)
- Interactive progress rings
- Recently added foods
- Professional dark design

### Scan View  
- **Photo Scan**: Take photos of your food for AI analysis
- **Barcode Scanner**: Scan product barcodes for instant nutrition data
- Portion size adjustment
- Nutrition display after scanning
- Recently scanned items

### Design
- Clean and professional interface
- Dark theme with glassmorphism effects
- Responsive design for all screen sizes
- Smooth animations and transitions

### 🔧 Backend Integration
- PHP backend with MySQL database
- Food categories and units management
- Consumption logging
- Admin panel for data management

### 📱 Native Features
- Custom barcode scanner plugin
- HealthKit integration for iOS
- Cross-platform mobile support

## Tech Stack

- **Vue.js 3** with TypeScript
- **Vite** as Build-Tool
- **Capacitor** fot Mobile App Development
- **Vue Router** for Navigation
- **CSS3** for Design

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Prepare app for mobile:
```bash
npm run build
npx cap add ios
npx cap add android
```

4. Sync mobile platforms:
```bash
npx cap sync
```

5. Open in native IDE:
```bash
npx cap open ios
npx cap open android
```

## Development

### Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview the build
- `npx cap sync` - Sync web assets with native platforms
- `npx cap run ios` - Build and run on iOS
- `npx cap run android` - Build and run on Android

### Project Structure

```
src/
├── views/           # Main views
│   ├── HomeView.vue # Calorie dashboard
│   └── ScanView.vue # Scan functionality
├── router/          # Vue Router configuration
├── components/      # Reusable components
├── stores/          # Pinia state management
├── services/        # API services
├── composables/     # Vue composables
└── assets/          # Static assets

backend/
├── *.php           # PHP API endpoints
└── database/       # Database scripts

plugins/
├── kaloriq-barcode-scanner/  # Custom barcode scanner
└── kaloriq-health-kit/      # HealthKit integration
```

## Permissions

The app requires the following permissions:
- **Camera**: For photo scans and barcode scanning
- **Storage**: For saving images (optional)
- **HealthKit**: For health data integration (iOS only)

## Browser Support

- Chrome/Safari (mobile)
- iOS Safari  
- Android Chrome

## Documentation

Additional documentation can be found in the `mds/` directory:
- Feature summaries and implementation guides
- HealthKit setup and debugging
- Premium features and paywall implementation
- Analytics and store management

## License

MIT License