/// <reference types="react-scripts" />

// TODO: fix location any
interface Window {
  theme: any
  dataLayer: any
  gtag: any
  location: any
}

declare var window: Window

declare module 'react-headroom'
