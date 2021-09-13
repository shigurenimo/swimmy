/// <reference types="react-scripts" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Theme } from '@mui/material'

declare global {
  interface Window {
    dataLayer: any
    gtag: any
    theme: Theme
    twttr: any
  }
}
