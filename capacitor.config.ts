import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'apparkcar',
  server: {
    androidScheme: 'https'
  },
  webDir: 'www', // Ajusta esto según la ubicación real de tus activos web
};

export default config;
