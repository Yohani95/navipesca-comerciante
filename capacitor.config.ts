import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.navipesca.comerciante',
  appName: 'NaviPesca Comerciante',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#0f172a',
      showSpinner: true,
      spinnerColor: '#14b8a6',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0f172a',
      overlaysWebView: false
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      accessoryBarVisible: false
    },
    App: {
      url: 'https://navipesca.comerciante.app'
    }
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    allowMixedContent: true
  }
}

export default config