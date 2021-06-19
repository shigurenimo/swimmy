import { Mode } from 'src/core/types/mode'

export const toColorSwitcher = (mode: Mode) => {
  return (light: string, dark?: string, red?: string) => {
    if (mode === 'dark') {
      return dark || light
    }

    if (mode === 'red') {
      return red || light
    }

    return light
  }
}
