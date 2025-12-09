import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'eu.controlcenter.sites.kaloriq',
  appName: 'Digmio',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  //ios: {
    //contentInset: "always"
 //},
  plugins: {
    KaloriqBarcodeScanner: {
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
