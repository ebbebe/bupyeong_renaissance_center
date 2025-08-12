export const APP_CONFIG = {
  appName: 'Bupyeong Renaissance Center',
  version: '1.0.0',
  defaultLanguage: 'ko',
  storageKeys: {
    stamps: 'brc_stamps',
    user: 'brc_user',
    preferences: 'brc_preferences',
  },
  map: {
    defaultCenter: {
      lat: 37.5074,
      lng: 126.7216,
    },
    defaultZoom: 15,
  },
  qr: {
    scanDelay: 500,
    cameraConstraints: {
      facingMode: 'environment',
    },
  },
} as const;