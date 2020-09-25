/// <reference types="react-scripts" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Theme } from '@material-ui/core'

declare global {
  interface Window {
    dataLayer: any
    gtag: any
    theme: Theme
    twttr: any
  }
}
