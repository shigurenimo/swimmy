import { ImageQuery } from './types/imageQuery'

export const toHeight = (query: ImageQuery): number | undefined => {
  const h = query.h

  if (typeof h === 'undefined') return

  try {
    return parseInt(h)
  } catch (e) {
    console.error(e)
    return
  }
}
