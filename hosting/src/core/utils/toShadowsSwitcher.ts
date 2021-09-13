import { Shadows } from '@mui/material/styles/shadows'
import { Mode } from 'src/core/types/mode'

export const toShadowsSwitcher = (mode: Mode) => {
  return (light: Shadows, dark?: Shadows, red?: Shadows) => {
    if (mode === 'dark') {
      return dark || light
    }

    if (mode === 'red') {
      return red || light
    }

    return light
  }
}
