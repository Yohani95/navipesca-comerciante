import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.navipesca.comerciante',
  appName: 'NaviPesca Comerciante',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f172a',
      showSpinner: false,
      spinnerColor: '#14b8a6'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0f172a'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark'
    }
  }
}

export default config