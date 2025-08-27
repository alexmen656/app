import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'eu.controlcenter.sites.kaloriq',
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
    },
    LocalNotifications: {
      smallIcon: "ic_launcher",
      iconColor: "#007052",
      sound: "beep.wav"
    }
    /*Preferences: {
      group: "group.com.kaloriq.shared"
    }*/
  }
};

export default config;
