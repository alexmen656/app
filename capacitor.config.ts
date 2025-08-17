import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'eu.control-center.sites.kaloriq',
  appName: 'Kaloriq',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissions: {
        camera: "Camera access is required to scan food items."
      }
    },
    BarcodeScanner: {
      permissions: {
        camera: "Camera access is required to scan barcodes."
      }
    }
  }
};

export default config;
