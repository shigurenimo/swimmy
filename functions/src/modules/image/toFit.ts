import { FitEnum } from 'sharp'
import { ImageQuery } from './types/imageQuery'

export const toFit = (query: ImageQuery): keyof FitEnum | undefined => {
  if (query.fit === 'cover') {
    return 'cover'
  }

  if (query.fit === 'contain') {
    return 'contain'
  }

  if (query.fit === 'fill') {
    return 'fill'
  }

  return
}
