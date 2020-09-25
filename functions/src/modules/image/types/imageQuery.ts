import { FitEnum } from 'sharp'

export type ImageQuery = {
  fit?: keyof FitEnum
  h?: string
  src?: string
  w?: string
  fm?: 'png' | 'jpg' | 'png'
}
